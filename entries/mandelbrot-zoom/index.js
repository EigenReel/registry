// github.com/loci-viz/mandelbrot-zoom/src/index.js · MIT License
// render: "webgl2". One full-box triangle; the fragment shader iterates z -> z² + c for every pixel.
// pointer: "pan-zoom". The camera follows a zoom tour, a function of t. Once the viewer drags, scrolls or double-clicks
// (after engaging the piece) the kit's PanZoom takes over and the view stays where they left it, also after they
// release the piece, until the "Resume the tour" preset (or the 0 key) hands it back to the tour.
import { hex, fsFor, PanZoom } from '@loci/kit';

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
#define MAX_ITER 1000            // the literal cap: the loop below never runs longer than this
uniform vec4 u_vp;               // the box in device pixels: x, y, w, h
uniform vec2 u_center;           // the point at the middle of the box
uniform float u_width;           // the width of the box's shorter side, in the complex plane
uniform int u_iter;              // the iteration budget (param), at most MAX_ITER
uniform vec3 u_bg, u_a1, u_a2;
out vec4 color;
void main() {
  float s = min(u_vp.z, u_vp.w);
  vec2 q = (gl_FragCoord.xy - u_vp.xy - 0.5 * u_vp.zw) / s;
  vec2 c = u_center + q * u_width;
  vec2 z = vec2(0.0);
  float n = -1.0;
  for (int i = 0; i < MAX_ITER; i++) {
    if (i >= u_iter) break;
    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
    if (dot(z, z) > 256.0) { n = float(i); break; }
  }
  if (n < 0.0) { color = vec4(u_bg, 1.0); return; }      // did not escape: inside, as far as we can tell
  float mu = n + 1.0 - log2(0.5 * log(dot(z, z)));        // smooth escape count
  float w = 0.5 + 0.5 * cos(2.2 * log(mu + 1.0) * 3.14159);
  vec3 ink = mix(u_a1, u_a2, w);
  color = vec4(mix(u_bg, ink, 1.0 - exp(-0.15 * mu)), 1.0);
}`;

// three boundary points to zoom toward
const TARGETS = {
  seahorse: { re: -0.743643887037151, im: 0.131825904205330, name: 'Seahorse valley' },
  misiurewicz: { re: -0.77568377, im: 0.13646737, name: 'a Misiurewicz point' },
  branch: { re: -0.10109636384562, im: 0.95628651080914, name: 'a three-armed branch point' },
};
const START = { re: -0.6, im: 0.0 }, W0 = 3.2, DEPTH = 5, CYCLE = 30;
const W_MIN = 2e-5, W_MAX = 4;   // the view's width limits: below W_MIN 32-bit floats show blocks, not detail

// the tour: zoom depth k goes 0 -> DEPTH -> 0 once per cycle; the centre slides from the overview onto the target
function tour(t, T) {
  const ph = ((t % CYCLE) + CYCLE) % CYCLE / CYCLE, k = DEPTH * (0.5 - 0.5 * Math.cos(2 * Math.PI * ph));
  const s = Math.pow(10, -k), pull = Math.pow(s, 1.5);
  return { k, re: T.re + (START.re - T.re) * pull, im: T.im + (START.im - T.im) * pull, w: W0 * s };
}

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src); gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error('shader: ' + gl.getShaderInfoLog(sh));
  return sh;
}

export default {
  setup({ gl, env }) {
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.bindAttribLocation(prog, 0, 'p');
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link: ' + gl.getProgramInfoLog(prog));
    const vao = gl.createVertexArray(), buf = gl.createBuffer();
    gl.bindVertexArray(vao); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);   // one triangle covers the viewport
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);
    const u = {};
    for (const k of ['u_vp', 'u_center', 'u_width', 'u_iter', 'u_bg', 'u_a1', 'u_a2']) u[k] = gl.getUniformLocation(prog, k);
    this.gpu = { prog, vao, u };
    this.pz = new PanZoom();
    this.mine = null;   // the viewer's view {c: [re, im], w}, or null while the tour drives the camera
  },
  // the view a share link keeps: the viewer's centre and width, or nothing during the tour
  getView() { return this.mine && { c: this.mine.c.slice(), w: this.mine.w }; },
  setView(v) {
    const ok = v && Array.isArray(v.c) && v.c.length === 2 && v.c.every(Number.isFinite) && Number.isFinite(v.w);
    this.mine = ok ? { c: v.c.slice(), w: Math.min(W_MAX, Math.max(W_MIN, v.w)) } : null;
  },

  draw({ gl, t, box, viewport, theme, params, events, engaged }) {
    const { prog, vao, u } = this.gpu, T = TARGETS[params.target] || TARGETS.seahorse, pz = this.pz, S = Math.min(box.w, box.h);
    // input: PanZoom starts from wherever the camera is (the tour's, or the viewer's), in this box
    const tc = tour(t, T), from = this.mine || { c: [tc.re, tc.im], w: tc.w };
    pz.setBox(box); pz.minScale = S / W_MAX; pz.maxScale = S / W_MIN; pz.setState({ center: from.c, scale: S / from.w });
    for (const e of events) {
      if (e.type === 'keydown' && e.key === '0') { this.mine = null; pz.setState({ center: [tc.re, tc.im], scale: S / tc.w }); continue; }
      if (pz.handle(e)) this.mine = { c: pz.center.slice(), w: S / pz.scale };
    }
    const cam = this.mine ? { re: this.mine.c[0], im: this.mine.c[1], w: this.mine.w, k: Math.log10(W0 / this.mine.w) } : tc;
    const cre = cam.re, cim = cam.im, k = cam.k;
    const col = h => hex(h).map(x => x / 255);
    gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND);
    gl.useProgram(prog); gl.bindVertexArray(vao);
    gl.uniform4f(u.u_vp, ...viewport);
    gl.uniform2f(u.u_center, cre, cim);
    gl.uniform1f(u.u_width, cam.w);
    gl.uniform1i(u.u_iter, params.iter);
    gl.uniform3f(u.u_bg, ...col(theme.bg)); gl.uniform3f(u.u_a1, ...col(theme.a1)); gl.uniform3f(u.u_a2, ...col(theme.a2));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindVertexArray(null);
    // text cannot be drawn into a WebGL canvas here: return it, and the host draws it in the theme font
    const fs = fsFor(box);
    return { labels: [
      { text: this.mine ? `Mandelbrot set at ${cre.toFixed(6)} ${cim < 0 ? '−' : '+'} ${Math.abs(cim).toFixed(6)}i` : `Mandelbrot set, toward ${T.name}`, x: box.x, y: box.y + fs, size: fs + 1, weight: 700 },
      { text: `${params.iter} iterations · zoom 10^${k.toFixed(1)}${this.mine ? ' · your view' : ''}`, x: box.x, y: box.y + fs * 2.3, size: fs, alpha: 0.8 },
      { text: `width ${cam.w.toExponential(1)}${this.mine && !engaged ? ' · Resume the tour from Try this' : ''}`, x: box.x, y: box.y + box.h - 6, size: fs, weight: 700, color: k > 4.2 ? 'a1' : 'fg' },
    ], cursor: pz.down ? 'grabbing' : 'grab' };
  },
};

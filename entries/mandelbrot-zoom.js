const COLORS = {
  main: '#818cf8',
  secondary: '#fcd34d',
  bg: '#050508',
  fg: '#ecebf5',
};

import { hex, rgba } from '@eigenreel/kit';

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

// Every pixel is one c; the loop iterates z -> z^2 + c with a literal cap (MAX_ITER) and stops early at the budget.
// Alongside z it carries the derivative dz/dc (dz -> 2 z dz + 1), which gives the distance estimate
// d = |z| ln|z| / |dz| from c to the boundary of the set. Escaped points are tinted by the smooth escape count mu
// (violet and gold bands, as before) and lit by d measured in pixels: filaments and the edge of the set glow, points far
// from the boundary stay dark. Points that never escape within the budget are drawn in bg.
const FRAG = `#version 300 es
precision highp float;
#define MAX_ITER 1000
uniform vec4 u_vp;
uniform vec2 u_center;
uniform float u_width;
uniform int u_iter;
uniform vec3 u_bg, u_a1, u_a2, u_fg;
out vec4 color;
void main() {
  float s = min(u_vp.z, u_vp.w);
  vec2 q = (gl_FragCoord.xy - u_vp.xy - 0.5 * u_vp.zw) / s;
  vec2 c = u_center + q * u_width;
  vec2 z = vec2(0.0), dz = vec2(0.0);
  bool big = false;   // |dz| past float range: the point is as close to the boundary as this picture can tell
  float n = -1.0;
  for (int i = 0; i < MAX_ITER; i++) {
    if (i >= u_iter) break;
    if (!big) {
      dz = 2.0 * vec2(z.x * dz.x - z.y * dz.y, z.x * dz.y + z.y * dz.x) + vec2(1.0, 0.0);
      big = dot(dz, dz) > 1e34;
    }
    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
    if (dot(z, z) > 256.0) { n = float(i); break; }
  }
  // a soft vignette toward the corners of the box
  vec2 e = (gl_FragCoord.xy - u_vp.xy) / u_vp.zw - 0.5;
  float vig = 1.0 - 0.45 * smoothstep(0.18, 0.62, length(e * vec2(u_vp.z / s, u_vp.w / s) * 0.9));
  if (n < 0.0) { color = vec4(u_bg, 1.0); return; }
  float r2 = dot(z, z);
  float mu = n + 1.0 - log2(0.5 * log(r2));
  float w = 0.5 + 0.5 * cos(2.2 * log(mu + 1.0) * 3.14159);
  vec3 ink = mix(u_a1, u_a2, w);
  // distance to the boundary in device pixels (0 when the derivative overflowed)
  float d = big ? 0.0 : 0.5 * sqrt(r2 / max(dot(dz, dz), 1e-30)) * log(r2);
  float px = d * s / u_width;
  float edge = exp(-0.45 * px);              // the filament itself
  float halo = 0.36 * exp(-0.05 * px);       // the light around it
  float amb = 0.05 + 0.09 * (1.0 - exp(-0.02 * mu));
  float L = clamp(edge + halo + amb, 0.0, 1.0) * (1.0 - exp(-0.6 * mu));
  vec3 col = mix(u_bg, ink, L) + u_fg * 0.2 * edge * edge * edge;
  color = vec4(mix(u_bg, min(col, vec3(1.0)), vig), 1.0);
}`;

// three boundary points to zoom toward
const TARGETS = {
  seahorse: { re: -0.743643887037151, im: 0.131825904205330, name: 'Seahorse valley' },
  misiurewicz: { re: -0.77568377, im: 0.13646737, name: 'a Misiurewicz point' },
  branch: { re: -0.10109636384562, im: 0.95628651080914, name: 'a three-armed branch point' },
};
const START = { re: -0.6, im: 0.0 }, W0 = 3.2, DEPTH = 5, CYCLE = 30;

// The tour, a function of t: zoom depth k goes 0 -> DEPTH -> 0 over the 30-second loop, deepest at t = 15, and the
// centre slides from the overview onto the target as the view narrows.
function tour(t, T) {
  const ph = (((t % CYCLE) + CYCLE) % CYCLE) / CYCLE, k = DEPTH * (0.5 - 0.5 * Math.cos(2 * Math.PI * ph));
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
  title: 'A zoom into the Mandelbrot set, on the GPU',
  hook: 'A hundred thousand times closer to the edge of the Mandelbrot set, every pixel iterated on the GPU, until 32-bit floats run out of digits.',
  alt: 'The dark body of the Mandelbrot set is outlined by glowing violet and gold filaments while the view dives toward a point on the boundary, where spirals open up, and pulls back out. A thin gauge at the right edge fills with the depth of the zoom.',
  tags: ['Complex dynamics', 'Fractals', 'GPU'],
  license: 'MIT',
  author: { name: 'escape.time' },

  modes: { desktop: true, phone: false },
  time: { length: 30, loop: true },
  context: 'webgl2',
  libraries: [],

  params: [
    { key: 'iter', type: 'range', label: 'Iterations', min: 50, max: 1000, step: 10, default: 300 },
    {
      key: 'target', type: 'select', label: 'Zoom toward',
      options: [['seahorse', 'Seahorse valley'], ['misiurewicz', 'Misiurewicz point'], ['branch', 'Branch point']],
      default: 'seahorse',
    },
  ],
  presets: [
    { id: 'seahorse-1000', label: 'Seahorse valley at 1000 iterations', params: { iter: 1000, target: 'seahorse' }, t: 13 },
    { id: 'budget-50', label: '50 iterations, the budget shows', params: { iter: 50, target: 'seahorse' }, t: 12 },
    { id: 'misiurewicz', label: 'A Misiurewicz point', params: { iter: 300, target: 'misiurewicz' }, t: 14 },
    { id: 'branch', label: 'A three-armed branch point', params: { iter: 300, target: 'branch' }, t: 14 },
  ],

  // The GL context arrives in draw, not setup, so the program is built on the first frame and kept in S.
  draw(gl, t, params, env, S) {
    if (!S.gpu) {
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
      for (const k of ['u_vp', 'u_center', 'u_width', 'u_iter', 'u_bg', 'u_a1', 'u_a2', 'u_fg']) u[k] = gl.getUniformLocation(prog, k);
      S.gpu = { prog, vao, u };
    }
    const { prog, vao, u } = S.gpu, C = env.colors, T = TARGETS[params.target] || TARGETS.seahorse;
    const cam = tour(t, T);
    const col = h => hex(h).map(x => x / 255);
    const vp = gl.getParameter(gl.VIEWPORT);   // the box in device px, bottom-left origin, as the page set it

    gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND); gl.disable(gl.CULL_FACE);
    gl.useProgram(prog); gl.bindVertexArray(vao);
    gl.uniform4f(u.u_vp, vp[0], vp[1], vp[2], vp[3]);
    gl.uniform2f(u.u_center, cam.re, cam.im);
    gl.uniform1f(u.u_width, cam.w);
    gl.uniform1i(u.u_iter, params.iter);
    gl.uniform3f(u.u_bg, ...col(C.bg)); gl.uniform3f(u.u_a1, ...col(C.main)); gl.uniform3f(u.u_a2, ...col(C.secondary)); gl.uniform3f(u.u_fg, ...col(C.fg));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindVertexArray(null);

    // the depth gauge on the 2D overlay (CSS px, (0, 0) at the box's top-left): a thin rule at the right edge with a tick
    // for each power of ten of magnification, filled up to the current zoom 10^k; the ring at the top, 10^5, is where
    // 32-bit floats run out of digits
    const o = env.overlay;
    if (!o) return;
    const { w, h } = env.box, x = w - Math.max(12, Math.min(22, w * 0.022));
    const y0 = h * 0.5 + Math.min(110, h * 0.22), y1 = h * 0.5 - Math.min(110, h * 0.22), Y = k => y0 + (y1 - y0) * k / DEPTH;
    o.lineCap = 'round';
    o.strokeStyle = rgba(C.bg, 0.45); o.lineWidth = 7;   // a dark backing, so the gauge reads over bright filaments
    o.beginPath(); o.moveTo(x, y0 + 4); o.lineTo(x, y1 - 4); o.stroke();
    o.strokeStyle = rgba(C.fg, 0.2); o.lineWidth = 1;
    o.beginPath(); o.moveTo(x, y0); o.lineTo(x, y1); o.stroke();
    o.strokeStyle = rgba(C.fg, 0.3);
    o.beginPath();
    for (let k = 0; k < DEPTH; k++) { o.moveTo(x - 3, Y(k)); o.lineTo(x + 3, Y(k)); }
    o.stroke();
    o.strokeStyle = rgba(C.main, 0.75); o.lineWidth = 1.2;
    o.beginPath(); o.arc(x, Y(DEPTH), 3.5, 0, 2 * Math.PI); o.stroke();
    const yk = Y(cam.k), deep = Math.max(0, (cam.k - 4.2) / (DEPTH - 4.2));
    o.strokeStyle = rgba(C.secondary, 0.6); o.lineWidth = 2;
    o.beginPath(); o.moveTo(x, y0); o.lineTo(x, yk); o.stroke();
    const g = o.createRadialGradient(x, yk, 0, x, yk, 12);
    g.addColorStop(0, rgba(deep > 0 ? C.main : C.secondary, 0.5)); g.addColorStop(1, rgba(C.secondary, 0));
    o.fillStyle = g; o.beginPath(); o.arc(x, yk, 12, 0, 2 * Math.PI); o.fill();
    o.fillStyle = C.fg; o.beginPath(); o.arc(x, yk, 2.6, 0, 2 * Math.PI); o.fill();
  },
};

// github.com/loci-viz/mandelbrot-zoom/src/mobile.js · MIT License
// The mobile target: render "canvas2d". The same zoom path and smooth coloring as the desktop shader, iterated on
// the CPU at half resolution, with the iteration budget capped at 200.
// pointer: "pan-zoom", as on desktop: after a tap, one finger pans, two pinch, a double tap zooms in.
import { hex, fsFor, label, clipBox, PanZoom } from '@loci/kit';

const MOBILE_MAX_ITER = 200;     // the phone cap: params.iter above this is clamped (see "Try this")
const MAX_SAMPLES = 48000;       // pixels in the buffer, at most (a large box gets less than half resolution)
const TARGETS = {
  seahorse: { re: -0.743643887037151, im: 0.131825904205330, name: 'Seahorse valley' },
  misiurewicz: { re: -0.77568377, im: 0.13646737, name: 'a Misiurewicz point' },
  branch: { re: -0.10109636384562, im: 0.95628651080914, name: 'a three-armed branch point' },
};
const START = { re: -0.6, im: 0.0 }, W0 = 3.2, DEPTH = 5, CYCLE = 30;
const W_MIN = 2e-5, W_MAX = 4;   // the same view limits as the desktop version

// the camera of the desktop version: zoom depth k goes 0 -> DEPTH -> 0 once per cycle
function camera(t, T) {
  const ph = ((t % CYCLE) + CYCLE) % CYCLE / CYCLE, k = DEPTH * (0.5 - 0.5 * Math.cos(2 * Math.PI * ph));
  const s = Math.pow(10, -k), pull = Math.pow(s, 1.5);
  return { k, s, re: T.re + (START.re - T.re) * pull, im: T.im + (START.im - T.im) * pull };
}

// smooth escape count mu of c = (cr, ci), or -1 if the orbit has not escaped within iter steps (bailout |z| > 16)
function escape(cr, ci, iter) {
  const q = (cr - 0.25) * (cr - 0.25) + ci * ci;           // the main cardioid and the period-2 bulb never escape
  if (q * (q + (cr - 0.25)) <= 0.25 * ci * ci || (cr + 1) * (cr + 1) + ci * ci <= 0.0625) return -1;
  let zr = 0, zi = 0, zr2 = 0, zi2 = 0;
  for (let n = 0; n < iter; n++) {
    zi = 2 * zr * zi + ci; zr = zr2 - zi2 + cr; zr2 = zr * zr; zi2 = zi * zi;
    if (zr2 + zi2 > 256) return n + 1 - Math.log2(0.5 * Math.log(zr2 + zi2));
  }
  return -1;
}

/* Fill mu[] for the W×H grid. Mariani–Silver: when the whole border of a rectangle has not escaped, neither has its
   inside (the set is connected and full), so it is filled without iterating. Only rectangles bordered by escaping
   points are subdivided down to single pixels. */
function render(mu, W, H, cam, iter) {
  const S = Math.min(W, H), step = cam.s * W0 / S;
  const at = (i, j) => { const o = j * W + i; if (mu[o] === -2) mu[o] = escape(cam.re + (i + 0.5 - W / 2) * step, cam.im + (H / 2 - (j + 0.5)) * step, iter); return mu[o]; };
  mu.fill(-2);
  const stack = [0, 0, W - 1, H - 1];
  while (stack.length) {
    const y1 = stack.pop(), x1 = stack.pop(), y0 = stack.pop(), x0 = stack.pop();
    if (x1 - x0 < 6 || y1 - y0 < 6) { for (let j = y0; j <= y1; j++) for (let i = x0; i <= x1; i++) at(i, j); continue; }
    let inside = true;
    for (let i = x0; i <= x1; i++) { if (at(i, y0) >= 0) inside = false; if (at(i, y1) >= 0) inside = false; }
    for (let j = y0 + 1; j < y1; j++) { if (at(x0, j) >= 0) inside = false; if (at(x1, j) >= 0) inside = false; }
    if (inside) { for (let j = y0 + 1; j < y1; j++) mu.fill(-1, j * W + x0 + 1, j * W + x1); continue; }
    const xm = (x0 + x1) >> 1, ym = (y0 + y1) >> 1;
    stack.push(x0, y0, xm, ym, xm + 1, y0, x1, ym, x0, ym + 1, xm, y1, xm + 1, ym + 1, x1, y1);
  }
}

export default {
  setup() { this.pz = new PanZoom(); this.mine = null; },
  getView() { return this.mine && { c: this.mine.c.slice(), w: this.mine.w }; },
  setView(v) {
    const ok = v && Array.isArray(v.c) && v.c.length === 2 && v.c.every(Number.isFinite) && Number.isFinite(v.w);
    this.mine = ok ? { c: v.c.slice(), w: Math.min(W_MAX, Math.max(W_MIN, v.w)) } : null;
  },
  draw({ ctx, t, box, theme, params, state, events, engaged }) {
    const T = TARGETS[params.target] || TARGETS.seahorse, iter = Math.min(MOBILE_MAX_ITER, params.iter), pz = this.pz, S = Math.min(box.w, box.h);
    const tc = camera(t, T), from = this.mine || { c: [tc.re, tc.im], w: W0 * tc.s };
    pz.setBox(box); pz.minScale = S / W_MAX; pz.maxScale = S / W_MIN; pz.setState({ center: from.c, scale: S / from.w });
    for (const e of events) {
      if (e.type === 'keydown' && e.key === '0') { this.mine = null; pz.setState({ center: [tc.re, tc.im], scale: S / (W0 * tc.s) }); continue; }
      if (pz.handle(e)) this.mine = { c: pz.center.slice(), w: S / pz.scale };
    }
    const cam = this.mine ? { re: this.mine.c[0], im: this.mine.c[1], s: this.mine.w / W0, k: Math.log10(W0 / this.mine.w) } : tc;
    // the buffer: half the box's CSS size, cached by size. Deep in the zoom almost every pixel escapes late, so each
    // whole zoom level below 10^-2 takes a little resolution off (a function of t, so frames stay deterministic).
    const level = Math.max(0, Math.round(cam.k) - 2), f = Math.min(0.5, Math.sqrt(MAX_SAMPLES / (box.w * box.h))) * (1 - 0.1 * level);
    const W = Math.max(1, Math.round(box.w * f)), H = Math.max(1, Math.round(box.h * f)), size = W + 'x' + H;
    state.bufs = state.bufs || new Map();
    if (!state.bufs.has(size)) {
      if (state.bufs.size > 8) state.bufs.clear();     // the box changed: drop the old sizes
      const buf = new OffscreenCanvas(W, H), bctx = buf.getContext('2d');
      state.bufs.set(size, { buf, bctx, img: bctx.createImageData(W, H), mu: new Float32Array(W * H), key: '' });
    }
    const B = state.bufs.get(size);
    const key = [cam.re, cam.im, cam.s, iter, theme.bg, theme.a1, theme.a2].join('|');
    if (key !== B.key) {   // a paused redraw or a capture at the same t reuses the last frame
      B.key = key;
      render(B.mu, W, H, cam, iter);
      // color: the palette of the desktop shader, a function of mu
      const bg = hex(theme.bg), a1 = hex(theme.a1), a2 = hex(theme.a2), px = B.img.data, mu = B.mu;
      for (let o = 0; o < W * H; o++) {
        const m = mu[o], p = o * 4; px[p + 3] = 255;
        if (m < 0) { px[p] = bg[0]; px[p + 1] = bg[1]; px[p + 2] = bg[2]; continue; }
        const w = 0.5 + 0.5 * Math.cos(2.2 * Math.log(m + 1) * 3.14159), g = 1 - Math.exp(-0.15 * m);
        for (let c = 0; c < 3; c++) { const ink = a1[c] + (a2[c] - a1[c]) * w; px[p + c] = bg[c] + (ink - bg[c]) * g; }
      }
      B.bctx.putImageData(B.img, 0, 0);
    }
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(B.buf, box.x, box.y, box.w, box.h);
    const fs = fsFor(box), capped = params.iter > MOBILE_MAX_ITER;
    clipBox(ctx, box);   // text stays inside the box, antialiasing included
    label(ctx, theme, this.mine ? `Mandelbrot set at ${cam.re.toFixed(6)} ${cam.im < 0 ? '−' : '+'} ${Math.abs(cam.im).toFixed(6)}i` : `Mandelbrot set, toward ${T.name}`, box.x, box.y + fs, { size: fs + 1, weight: 700 });
    label(ctx, theme, `${iter} iterations${capped ? ` (capped from ${params.iter} on phones)` : ''} · zoom 10^${cam.k.toFixed(1)}${this.mine ? ' · your view' : ''}`, box.x, box.y + fs * 2.3, { size: fs, alpha: 0.8 });
    label(ctx, theme, `width ${(W0 * cam.s).toExponential(1)}${this.mine && !engaged ? ' · Resume the tour from Try this' : ''}`, box.x, box.y + box.h - 6, { size: fs, weight: 700, color: cam.k > 4.2 ? theme.a1 : theme.fg });
    ctx.restore();
    return { cursor: pz.down ? 'grabbing' : 'grab' };
  },
};

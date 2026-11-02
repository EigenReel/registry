const COLORS = {
  main: '#1d4f86',       // the partial sum S_N and the tip of the chain
  secondary: '#b4391f',  // the error S_N − sq and the Gibbs overshoot
  bg: '#f3ead8',
  fg: '#2b2420',
};

import { hex, mix, rgba } from '@eigenreel/kit';

const GIBBS = 1.178979744;   // (2/π) Si(π), the limit of the overshoot

function makeCanvas(w, h) {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h);
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; return cv;
}

const N_MAX = 40;            // the largest N the param allows

/* How far the chain of N_MAX circles can reach from its center, in units of the amplitude 1: sideways, the sum
   of the radii (4/π) Σ 1/(2k − 1), reached at θ = 0 and θ = π when every vector lies along the axis; up and
   down, the largest |y| of any circle over a turn, found by sampling. A chain with fewer circles is a part of
   this one, so it reaches no further. */
let REACH = null;
function reach() {
  if (REACH) return REACH;
  let side = 0, up = 0;
  for (let k = 1; k <= N_MAX; k++) side += 4 / ((2 * k - 1) * Math.PI);
  for (let s = 0; s < 2048; s++) {
    const th = Math.PI * s / 2048;   // y(θ + π) = −y(θ), so half a turn covers both signs
    let y = 0;
    for (let k = 1; k <= N_MAX; k++) {
      const n = 2 * k - 1, r = 4 / (n * Math.PI);
      up = Math.max(up, Math.abs(y) + r);
      y += r * Math.sin(n * th);
    }
  }
  return (REACH = { side, up });
}

/* The layout, in "wave coordinates": a W × H rectangle with time running left to right and amplitude up. On a
   wide box that is the box itself; on a tall one it is the box turned a quarter turn, so the circles sit at the
   top and the trace runs down the screen. R is the amplitude 1 in px, the same for every N, and small enough
   that the whole chain stays inside the box, with a margin, for every N and θ, while the trace keeps at least
   45% of the width. The chain may swing over the start of the trace near the jumps. */
function layout(w, h) {
  const turned = h > w * 1.15, W = turned ? h : w, H = turned ? w : h;
  const { side, up } = reach(), m = Math.max(10, Math.min(W, H) * 0.04);
  const R = Math.max(4, Math.min((H / 2 - m) / Math.max(up, GIBBS + 0.15), (0.55 * W - m) / (side + 1.65)));
  const cx = m + side * R, cy = H / 2;
  return { turned, W, H, R, cx, cy, wx0: cx + R * 1.65 };
}
function orient(c, w, L) { if (L.turned) { c.translate(w, 0); c.rotate(Math.PI / 2); } }

/* The paper, drawn once per box and palette at device resolution: cream warming toward the edges, and a faint
   graph-paper grid aligned with the trace, a line every quarter of the amplitude and a stronger one every unit. */
function paper(w, h, dpr, C, L) {
  const cv = makeCanvas(Math.max(1, Math.round(w * dpr)), Math.max(1, Math.round(h * dpr))), c = cv.getContext('2d');
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  const bg = hex(C.bg), edge = mix(bg, [176, 140, 96], 0.22);
  const g = c.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.25, w / 2, h / 2, Math.hypot(w, h) * 0.62);
  g.addColorStop(0, C.bg); g.addColorStop(1, `rgb(${edge.map(Math.round).join()})`);
  c.fillStyle = g; c.fillRect(0, 0, w, h);

  orient(c, w, L);
  const q = L.R / 4, ink = mix(bg, [70, 110, 150], 1);
  for (const major of [false, true]) {
    c.strokeStyle = `rgba(${ink.map(Math.round).join()},${major ? 0.16 : 0.07})`;
    c.lineWidth = major ? 1 : 0.75;
    c.beginPath();
    for (let m = Math.floor(-L.cy / q); L.cy + m * q <= L.H; m++) {
      if ((m % 4 === 0) !== major) continue;
      const y = L.cy + m * q; c.moveTo(0, y); c.lineTo(L.W, y);
    }
    for (let m = Math.floor(-L.wx0 / q); L.wx0 + m * q <= L.W; m++) {
      if ((m % 4 === 0) !== major) continue;
      const x = L.wx0 + m * q; c.moveTo(x, 0); c.lineTo(x, L.H);
    }
    c.stroke();
  }
  return cv;
}

export default {
  title: 'A square wave from spinning circles',
  hook: 'Each epicycle is one odd harmonic. Add more and watch the Gibbs overshoot refuse to shrink.',
  alt: "On cream graph paper, a chain of ink circles spins, each smaller and faster than the last. The height of its tip is traced in blue as a wave close to a dashed square wave, the gap shaded red, with red marks at the overshoot beside each jump.",
  tags: ['Harmonic analysis', 'Fourier series', 'Teaching'],
  license: 'MIT',
  author: { name: 'epicycle.lab' },

  modes: { desktop: true, phone: true },
  time: { length: 30, loop: true },
  context: '2d',
  libraries: [],

  params: [
    { key: 'N', type: 'range', label: 'Number of terms N', min: 1, max: 40, step: 1, default: 6 },
  ],
  presets: [
    { id: 'n-1', label: 'N = 1, a pure sine', params: { N: 1 } },
    { id: 'n-40', label: 'N = 40, Gibbs overshoot', params: { N: 40 } },
    { id: 'six-at-jump', label: 'N = 6, just after a jump', params: { N: 6 }, t: 3.2 },
    { id: 'forty-at-jump', label: 'N = 40, just after a jump', params: { N: 40 }, t: 3.2 },
  ],

  draw(ctx, t, params, env, S) {
    const { w, h } = env.box, C = env.colors, dpr = env.dpr || 1;
    const N = params.N, phone = env.device === 'phone', lw = phone ? 1.6 : 2;
    const L = layout(w, h), { R, cx, cy, wx0 } = L, wx1 = L.W;

    const key = [w, h, dpr, C.bg].join();
    if (S.paperKey !== key) { S.paperKey = key; S.paper = paper(w, h, dpr, C, L); }
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(S.paper, 0, 0, w, h);
    ctx.save();
    orient(ctx, w, L);

    // θ turns once every 6 seconds, five turns per loop; the trace shows θ going back from now, 1.4/R per px
    const om = 2 * Math.PI * t / 6, dth = 1.4 / R, step = 1.5;
    const S_N = th => { let s = 0; for (let k = 1; k <= N; k++) { const n = 2 * k - 1; s += 4 / (n * Math.PI) * Math.sin(n * th); } return s; };
    const X = th => wx0 + (om - th) / dth, Y = v => cy - R * v;
    const sq = th => Math.sign(Math.sin(th));
    const xs = [], ys = [];
    for (let x = wx0; x <= wx1 + step; x += step) { xs.push(x); ys.push(Y(S_N(om - (x - wx0) * dth))); }
    // the jumps of sq in view, θ = mπ, newest first
    const jumps = [];
    for (let m = Math.floor(om / Math.PI); X(m * Math.PI) <= wx1 + R; m--) jumps.push(m * Math.PI);

    // the square wave itself, through its jumps, and the error between it and S_N, shaded
    // sq from now back to the right edge, starting a new subpath or continuing the current one
    const sqPath = (join) => {
      let th = om;
      join ? ctx.lineTo(wx0, Y(sq(th - 1e-9))) : ctx.moveTo(wx0, Y(sq(th - 1e-9)));
      for (const j of jumps) {
        const xj = Math.min(X(j), wx1 + step);
        ctx.lineTo(xj, Y(sq(th - 1e-9)));
        if (xj >= wx1) break;
        ctx.lineTo(xj, Y(sq(j - 1e-9)));
        th = j;
      }
      ctx.lineTo(wx1 + step, Y(sq(th - 1e-9)));
    };
    const fade = ctx.createLinearGradient(wx0, 0, wx1, 0);
    fade.addColorStop(0, rgba(C.secondary, 0.2)); fade.addColorStop(1, rgba(C.secondary, 0.06));
    ctx.fillStyle = fade;
    ctx.beginPath();
    for (let i = xs.length - 1; i >= 0; i--) i === xs.length - 1 ? ctx.moveTo(xs[i], ys[i]) : ctx.lineTo(xs[i], ys[i]);
    sqPath(true);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = rgba(C.fg, 0.22); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(wx0, cy); ctx.lineTo(wx1, cy); ctx.stroke();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = rgba(C.fg, 0.5); ctx.lineWidth = 1.1;
    ctx.beginPath(); sqPath(); ctx.stroke();

    // the Gibbs level ±1.179, dotted, and beside each jump the first ripple's peak, at θ = mπ ± π/(2N)
    // exactly, with a tick showing how far it overshoots ±1
    ctx.setLineDash([1.5, 4.5]);
    ctx.strokeStyle = rgba(C.secondary, 0.55); ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (const v of [GIBBS, -GIBBS]) { ctx.moveTo(wx0, Y(v)); ctx.lineTo(wx1, Y(v)); }
    ctx.stroke();
    ctx.setLineDash([]);
    const peaks = [];
    for (const j of jumps) for (const d of [-1, 1]) {
      const th = j + d * Math.PI / (2 * N), x = X(th);
      if (x >= wx0 && x <= wx1) peaks.push([x, S_N(th)]);
    }
    ctx.strokeStyle = C.secondary; ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (const [x, v] of peaks) { ctx.moveTo(x, Y(Math.sign(v))); ctx.lineTo(x, Y(v)); }
    ctx.stroke();

    // the epicycles, tip to tail: the circles faint, the first a little stronger, the radii in ink
    let x = cx, y = cy;
    const joints = [[x, y]];
    for (let k = 1; k <= N; k++) {
      const n = 2 * k - 1, r = R * 4 / (n * Math.PI);
      x += r * Math.cos(n * om); y -= r * Math.sin(n * om);
      joints.push([x, y]);
    }
    const r1 = R * 4 / Math.PI;
    ctx.beginPath(); ctx.arc(cx, cy, r1, 0, 2 * Math.PI);
    ctx.strokeStyle = rgba(C.fg, 0.32); ctx.lineWidth = 1;
    ctx.stroke();
    ctx.strokeStyle = rgba(C.fg, 0.18);
    ctx.beginPath();
    for (let k = 2; k <= N; k++) {
      const [ax, ay] = joints[k - 1], r = R * 4 / ((2 * k - 1) * Math.PI);
      if (r < 0.6) break;
      ctx.moveTo(ax + r, ay); ctx.arc(ax, ay, r, 0, 2 * Math.PI);
    }
    ctx.stroke();
    ctx.strokeStyle = rgba(C.fg, 0.82); ctx.lineWidth = Math.max(1, lw * 0.75); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.beginPath();
    joints.forEach(([a, b], i) => i ? ctx.lineTo(a, b) : ctx.moveTo(a, b));
    ctx.stroke();
    ctx.fillStyle = C.fg;
    ctx.beginPath(); ctx.arc(cx, cy, 2.2, 0, 2 * Math.PI); ctx.fill();

    // the tip, joined to the newest point of the trace
    ctx.setLineDash([2, 4]);
    ctx.strokeStyle = rgba(C.main, 0.6); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(wx0, y); ctx.stroke();
    ctx.setLineDash([]);

    // the partial sum S_N, newest at the left, fading a little as it ages
    const ink = ctx.createLinearGradient(wx0, 0, wx1, 0);
    ink.addColorStop(0, C.main); ink.addColorStop(1, rgba(C.main, 0.5));
    ctx.strokeStyle = ink; ctx.lineWidth = lw * 1.5;
    ctx.beginPath();
    for (let i = 0; i < xs.length; i++) i ? ctx.lineTo(xs[i], ys[i]) : ctx.moveTo(xs[i], ys[i]);
    ctx.stroke();

    // the Gibbs peaks on top of the curve, and the tip
    ctx.fillStyle = C.secondary;
    ctx.beginPath();
    for (const [px, v] of peaks) { ctx.moveTo(px + 2.6, Y(v)); ctx.arc(px, Y(v), 2.6, 0, 2 * Math.PI); }
    ctx.fill();
    ctx.strokeStyle = rgba(C.main, 0.35); ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(x, y, 7, 0, 2 * Math.PI); ctx.stroke();
    ctx.fillStyle = C.main;
    ctx.beginPath(); ctx.arc(x, y, 3.5, 0, 2 * Math.PI); ctx.fill();
    ctx.beginPath(); ctx.arc(wx0, y, 3, 0, 2 * Math.PI); ctx.fill();
    ctx.restore();
  },
};

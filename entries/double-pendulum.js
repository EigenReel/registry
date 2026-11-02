const COLORS = { main: '#fb7185', secondary: '#93c5fd', bg: '#050508', fg: '#ecebf5' };

import { rgba } from '@eigenreel/kit';

// Equal masses, rods of length 1, g = 9.81. State y = (θ₁, θ₂, θ₁′, θ₂′).
const G = 9.81, DT = 0.005, NMAX = 4800;   // NMAX = 24 s / DT: the whole loop
const EVERY = 3, TRAIL = 400;                       // the trail: one point every 3 steps, the last 400 (6 s) of them

function deriv(y, o) {
  const d = y[0] - y[1], den = 3 - Math.cos(2 * d), s = Math.sin(d), c = Math.cos(d);
  o[0] = y[2]; o[1] = y[3];
  o[2] = (-3 * G * Math.sin(y[0]) - G * Math.sin(y[0] - 2 * y[1]) - 2 * s * (y[3] * y[3] + y[2] * y[2] * c)) / den;
  o[3] = (2 * s * (2 * y[2] * y[2] + 2 * G * Math.cos(y[0]) + y[3] * y[3] * c)) / den;
}

function rk4(y, dt, K) {
  const [k1, k2, k3, k4, u] = K;
  deriv(y, k1);
  for (let i = 0; i < 4; i++) u[i] = y[i] + dt / 2 * k1[i];
  deriv(u, k2);
  for (let i = 0; i < 4; i++) u[i] = y[i] + dt / 2 * k2[i];
  deriv(u, k3);
  for (let i = 0; i < 4; i++) u[i] = y[i] + dt * k3[i];
  deriv(u, k4);
  for (let i = 0; i < 4; i++) y[i] += dt / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
}

// The cache holds the angles of both pendulums at every step from 0 to S.n. It depends on th alone: a new th
// starts it again from t = 0, a later t extends it forward, an earlier t just reads what is already there.
function advance(S, th, n) {
  if (S.th !== th) {
    const a = th * Math.PI / 180;
    S.th = th; S.n = 0;
    S.A = new Float64Array([a, 0, 0, 0]);
    S.B = new Float64Array([a + 0.001, 0, 0, 0]);
    S.K = [0, 1, 2, 3, 4].map(() => new Float64Array(4));
    S.ang = new Float64Array(4 * (NMAX + 1));
    S.ang[0] = S.A[0]; S.ang[1] = S.A[1]; S.ang[2] = S.B[0]; S.ang[3] = S.B[1];
  }
  while (S.n < n) {
    rk4(S.A, DT, S.K); rk4(S.B, DT, S.K); S.n++;
    const j = 4 * S.n;
    S.ang[j] = S.A[0]; S.ang[j + 1] = S.A[1]; S.ang[j + 2] = S.B[0]; S.ang[j + 3] = S.B[1];
  }
}

export default {
  title: 'Two double pendulums, one thousandth apart',
  hook: 'Start two double pendulums 0.001 rad apart. For a few seconds they agree. Then they have nothing to do with each other.',
  alt: 'A glowing white double pendulum swings below a dotted line inside a faint circle. After a few seconds it splits into a pink and a blue pendulum whose fading trails tangle apart.',
  tags: ['Dynamics', 'Chaos', 'Mechanics', 'Teaching'],
  license: 'BSD-3-Clause',
  author: { name: 'levien.tan' },
  modes: { desktop: true, phone: true },
  time: { length: 24, loop: true },
  context: '2d',
  libraries: [],
  params: [
    { key: 'th', type: 'range', label: 'Initial angle θ₁', min: 20, max: 175, step: 5, default: 135, format: '{}°' },
  ],
  presets: [
    { id: 'small-swings', label: 'θ₁ = 20°, small swings', params: { th: 20 }, t: 12 },
    { id: 'parting', label: 'θ₁ = 135°, the moment they part', params: { th: 135 }, t: 9 },
    { id: 'over-the-top', label: 'θ₁ = 175°, nearly upside down', params: { th: 175 }, t: 6 },
  ],

  draw(ctx, t, params, env, S) {
    const C = env.colors, { w, h } = env.box;
    const n = Math.max(0, Math.min(NMAX, Math.floor(t / DT + 1e-6)));
    advance(S, params.th, n);
    const ang = S.ang;

    // the pivot in the middle; the two rods together reach 2k, a little short of the shorter side's half
    const k = Math.max(10, Math.min(w, h) / 4 * 0.9), ox = w / 2, oy = h / 2;
    const tip = (m, o) => {
      const j = 4 * m + o;
      return [ox + (Math.sin(ang[j]) + Math.sin(ang[j + 1])) * k, oy + (Math.cos(ang[j]) + Math.cos(ang[j + 1])) * k];
    };

    // a soft pool of light around the pivot, fading into the page
    const bgl = ctx.createRadialGradient(ox, oy, 0, ox, oy, Math.hypot(w, h) * 0.6);
    bgl.addColorStop(0, rgba(C.secondary, 0.07)); bgl.addColorStop(0.45, rgba(C.secondary, 0.025)); bgl.addColorStop(1, rgba(C.bg, 0));
    ctx.fillStyle = bgl; ctx.fillRect(0, 0, w, h);

    // the disc the lower bob can reach, and the energy ceiling: both copies start at rest, so with
    // a = cos θ₁, b = cos θ₂ energy keeps 2a + b ≥ 2cos θ₁(0) + 1, and the lower bob never rises above
    // −cos θ₁(0) rod lengths over the pivot (−2cos θ₁(0) when θ₁(0) < 90°)
    const c0 = Math.cos(params.th * Math.PI / 180), ceil = c0 > 0 ? -2 * c0 : -c0, yc = oy - ceil * k;
    const half = Math.sqrt(Math.max(0, 4 - ceil * ceil)) * k;
    ctx.strokeStyle = rgba(C.fg, 0.07); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(ox, oy, 2 * k, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = rgba(C.fg, 0.26); ctx.setLineDash([2, 6]);
    ctx.beginPath(); ctx.moveTo(ox - half, yc); ctx.lineTo(ox + half, yc); ctx.stroke();
    ctx.setLineDash([]);

    // trails of the lower bobs, added light on light: where the two copies agree pink and blue sum to white,
    // where they part each shows its own color. Older stretches fade out over about a second and a half.
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineJoin = 'round'; ctx.lineCap = 'butt';   // butt ends, so the chunks do not overlap into bright dots
    const last = n - n % EVERY, count = Math.min(TRAIL, Math.floor(last / EVERY) + 1), CH = 4;
    const trail = (o, col) => {
      for (let i0 = 0; i0 < count - 1; i0 += CH) {
        const i1 = Math.min(count - 1, i0 + CH), age = (count - 1 - i1) * EVERY * DT, f = Math.exp(-age / 1.4);
        if (f < 0.015) continue;
        ctx.strokeStyle = rgba(col, 0.75 * f); ctx.lineWidth = 0.8 + 1.8 * f;
        ctx.beginPath();
        for (let i = i0; i <= i1; i++) {
          const [x, y] = tip(last - (count - 1 - i) * EVERY, o);
          i === i0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };
    trail(2, C.secondary); trail(0, C.main);

    // the rods and bobs, also added: one white pendulum while the copies agree, then pink and blue. The bob cores
    // go onto dark holes, so a lone bob shows exactly its own color and two coinciding bobs sum to white.
    const R = Math.max(3, k / 26), bobs = [];
    const rod = (o, col) => {
      const j = 4 * n + o;
      const x1 = ox + Math.sin(ang[j]) * k, y1 = oy + Math.cos(ang[j]) * k;
      const x2 = x1 + Math.sin(ang[j + 1]) * k, y2 = y1 + Math.cos(ang[j + 1]) * k;
      ctx.strokeStyle = rgba(col, 0.85); ctx.lineWidth = Math.max(1.5, R * 0.55); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      for (const [x, y, r] of [[x1, y1, R], [x2, y2, R * 1.25]]) {
        const gl = ctx.createRadialGradient(x, y, 0, x, y, r * 4.5);
        gl.addColorStop(0, rgba(col, 0.4)); gl.addColorStop(1, rgba(col, 0));
        ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(x, y, r * 4.5, 0, Math.PI * 2); ctx.fill();
        bobs.push([x, y, r, col]);
      }
    };
    rod(2, C.secondary); rod(0, C.main);
    ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = C.bg;
    for (const [x, y, r] of bobs) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
    ctx.globalCompositeOperation = 'lighter';
    for (const [x, y, r, col] of bobs) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
    ctx.globalCompositeOperation = 'source-over';

    // the pivot
    ctx.fillStyle = C.bg; ctx.beginPath(); ctx.arc(ox, oy, R * 1.1, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = C.fg; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(ox, oy, R * 1.1, 0, Math.PI * 2); ctx.stroke();
  },
};

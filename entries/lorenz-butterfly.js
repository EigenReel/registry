const COLORS = { main: '#fdba74', secondary: '#a5b4fc', bg: '#050508', fg: '#ecebf5' };

import { rgba } from '@eigenreel/kit';

// σ = 10, β = 8/3, RK4 with dt = 0.005 at 250 steps per second of playback: 40 s of loop = 50 time units.
const DT = 0.005, RATE = 250, NMAX = 10000;   // NMAX = 40 s × RATE
const EVERY = 2, TRAIL = 900;                // the trail: one point every 2 steps, the last 900 of them

function lorenzStep(s, o, dt, rho) {
  const sg = 10, be = 8 / 3, h = dt / 2, x = s[o], y = s[o + 1], z = s[o + 2];
  const ax = sg * (y - x), ay = x * (rho - z) - y, az = x * y - be * z;
  let X = x + h * ax, Y = y + h * ay, Z = z + h * az;
  const bx = sg * (Y - X), by = X * (rho - Z) - Y, bz = X * Y - be * Z;
  X = x + h * bx; Y = y + h * by; Z = z + h * bz;
  const cx = sg * (Y - X), cy = X * (rho - Z) - Y, cz = X * Y - be * Z;
  X = x + dt * cx; Y = y + dt * cy; Z = z + dt * cz;
  const ex = sg * (Y - X), ey = X * (rho - Z) - Y, ez = X * Y - be * Z;
  s[o] = x + dt / 6 * (ax + 2 * bx + 2 * cx + ex);
  s[o + 1] = y + dt / 6 * (ay + 2 * by + 2 * cy + ey);
  s[o + 2] = z + dt / 6 * (az + 2 * bz + 2 * cz + ez);
}

// The cache holds both runs at every step from 0 to S.n (6 numbers a step: run A then run B). It depends on rho
// alone: a new rho starts it again from t = 0, a later t extends it forward, an earlier t reads what is there.
function advance(S, rho, n) {
  if (S.rho !== rho) {
    S.rho = rho; S.n = 0;
    S.p = new Float64Array(6 * (NMAX + 1));
    S.p.set([1, 1, 1, 1.001, 1, 1]);
    S.cur = new Float64Array([1, 1, 1, 1.001, 1, 1]);
  }
  const p = S.p, c = S.cur;
  while (S.n < n) {
    lorenzStep(c, 0, DT, rho); lorenzStep(c, 3, DT, rho); S.n++;
    p.set(c, 6 * S.n);
  }
}

export default {
  title: 'The Lorenz butterfly, two runs at once',
  hook: 'Two points that start 0.001 apart ride the same three equations and end up on opposite wings of the attractor.',
  alt: 'A slowly rotating butterfly of glowing, fading loops on a dark background. A single white trail traced by two nearly identical starting points splits into orange and violet trails that switch wings at different times.',
  tags: ['Dynamics', 'Chaos', 'Research', 'Teaching'],
  license: 'Apache-2.0',
  author: { name: 'ed.lorenz.fan' },
  modes: { desktop: true, phone: true },
  time: { length: 40, loop: true },
  context: '2d',
  libraries: [],
  params: [
    { key: 'rho', type: 'range', label: 'Rayleigh number ρ', min: 5, max: 50, step: 1, default: 28 },
  ],
  presets: [
    { id: 'fixed-point', label: 'ρ = 10, a fixed point', params: { rho: 10 }, t: 12 },
    { id: 'butterfly', label: 'ρ = 28, the butterfly', params: { rho: 28 }, t: 20 },
    { id: 'transient', label: 'ρ = 20, transient chaos', params: { rho: 20 }, t: 10 },
  ],

  draw(ctx, t, params, env, S) {
    const C = env.colors, { w, h } = env.box, rho = params.rho;
    const n = Math.max(0, Math.min(NMAX, Math.floor(t * RATE + 1e-6)));
    advance(S, rho, n);
    const p = S.p;

    // the attractor fills the box: H is about the widest the projection gets, 1.75ρ about its height
    const H = 3.3 * Math.sqrt(8 / 3 * (rho - 1)) + 2, sc = Math.max(0.5, Math.min(w / (2 * H), h / (1.75 * rho)) * 0.94);
    const cx = w / 2, cy = h / 2, zc = 0.87 * rho, ph = t * 0.12, ca = Math.cos(ph), sa = Math.sin(ph);
    const X = j => cx + sc * (p[j] * ca + p[j + 1] * sa), Y = j => cy - sc * (p[j + 2] - zc);
    const near = j => Math.max(0, Math.min(1, 0.5 + 0.5 * (p[j + 1] * ca - p[j] * sa) / H));   // 1 toward the viewer

    // a faint pool of light behind the attractor
    const bgl = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.hypot(w, h) * 0.6);
    bgl.addColorStop(0, rgba(C.secondary, 0.06)); bgl.addColorStop(0.5, rgba(C.secondary, 0.02)); bgl.addColorStop(1, rgba(C.bg, 0));
    ctx.fillStyle = bgl; ctx.fillRect(0, 0, w, h);

    // everything from here on adds light. (The rings below are thick strokes in that mode from the very first
    // frame, so a software-rendered canvas prepares that kind of drawing before the trails need it.)
    ctx.globalCompositeOperation = 'lighter';

    // the fixed points C± = (±√(β(ρ − 1)), ±√(β(ρ − 1)), ρ − 1), the centers of the two wings
    if (rho > 1) {
      const q = Math.sqrt(8 / 3 * (rho - 1)), r = Math.max(2.5, Math.min(w, h) / 160);
      ctx.strokeStyle = rgba(C.fg, 0.3); ctx.lineWidth = 1.5;
      for (const sg of [1, -1]) {
        const x = cx + sc * sg * q * (ca + sa), y = cy - sc * (rho - 1 - zc);
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
      }
    }

    ctx.lineJoin = 'round'; ctx.lineCap = 'butt';
    const last = n - n % EVERY;

    // everything both runs have traced since t = 0, very faint and fading with age: the attractor building up,
    // while the first approach from (1, 1, 1) slowly disappears. One vertex every G steps and a few long strokes
    // keep it cheap for software-rendered canvases.
    const G = 6;
    const ghost = (o, col) => {
      for (let m0 = 0; m0 < last; m0 += 2 * RATE) {
        const m1 = Math.min(last, m0 + 2 * RATE), age = (n - m1) / RATE;
        ctx.strokeStyle = rgba(col, 0.012 + 0.09 * Math.exp(-age / 8)); ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(X(6 * m0 + o), Y(6 * m0 + o));
        for (let m = m0 + G; ; m += G) { const j = 6 * Math.min(m, m1) + o; ctx.lineTo(X(j), Y(j)); if (m >= m1) break; }
        ctx.stroke();
      }
    };
    ghost(3, C.secondary); ghost(0, C.main);

    // the recent trails, fading with age and brighter on the near side. Light adds, so where the two runs
    // still agree orange and violet sum to white; once they part each keeps its own color.
    const count = Math.min(TRAIL, Math.floor(last / EVERY) + 1), CH = 8;
    const trail = (o, col) => {
      for (let i0 = 0; i0 < count - 1; i0 += CH) {
        const i1 = Math.min(count - 1, i0 + CH), age = (count - 1 - i1) * EVERY / RATE, f = Math.exp(-age / 1.8);
        if (f < 0.02) continue;
        const jm = 6 * (last - (count - 1 - ((i0 + i1) >> 1)) * EVERY) + o, d = near(jm);
        ctx.strokeStyle = rgba(col, f * (0.35 + 0.5 * d)); ctx.lineWidth = 0.7 + f * (0.9 + 1.4 * d);
        ctx.beginPath();
        for (let i = i0; i <= i1; i++) {
          const j = 6 * (last - (count - 1 - i) * EVERY) + o;
          i === i0 ? ctx.moveTo(X(j), Y(j)) : ctx.lineTo(X(j), Y(j));
        }
        ctx.stroke();
      }
    };
    trail(3, C.secondary); trail(0, C.main);

    // the two current points: a soft glow, then a bright core. The cores are added onto a dark hole, so a
    // lone core shows exactly its run's color and two coinciding cores sum to white.
    const R = Math.max(2.5, Math.min(w, h) / 150), at = o => [X(6 * n + o), Y(6 * n + o)];
    for (const [o, col] of [[3, C.secondary], [0, C.main]]) {
      const [x, y] = at(o), gl = ctx.createRadialGradient(x, y, 0, x, y, R * 5);
      gl.addColorStop(0, rgba(col, 0.4)); gl.addColorStop(1, rgba(col, 0));
      ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(x, y, R * 5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = C.bg;
    for (const o of [3, 0]) { const [x, y] = at(o); ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2); ctx.fill(); }
    ctx.globalCompositeOperation = 'lighter';
    for (const [o, col] of [[3, C.secondary], [0, C.main]]) {
      const [x, y] = at(o); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  },
};

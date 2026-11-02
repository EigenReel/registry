const COLORS = {
  main: '#a3e635',
  secondary: '#d8b4fe',
  bg: '#050508',
  fg: '#ecebf5',
};

import { hex, mix, rgba } from '@eigenreel/kit';

const RUN = 10;          // seconds per run; the loop holds four runs from rotated start circles
const RATE = 45;         // descent steps per second
const MAX_STEPS = 360;   // each run stops after this many steps
const WALKERS = 12;
const BETA = 0.85;
const FADE = 0.8;        // seconds at the end of each run over which the walkers fade out
const MINIMA = [[3, 2], [-2.805118, 3.131312], [-3.779310, -3.283186], [3.584428, -1.848126]];

function himmelblau(x, y) { return (x * x + y - 11) ** 2 + (x + y * y - 7) ** 2; }
function himmelGrad(x, y) { const A = x * x + y - 11, C = x + y * y - 7; return [4 * x * A + 2 * C, 2 * A + 4 * y * C]; }

function makeCanvas(w, h) {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h);
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; return cv;
}

const LOGMAX = Math.log(891);   // log(1 + f) at the corners of [−5, 5]², where the shading reaches bg
const LEVELS = 18;              // contours at v = k / LEVELS, v = log(1 + f) / LOGMAX
const height = (x, y) => Math.log(1 + himmelblau(x, y)) / LOGMAX;   // 1 at the corners of [−5, 5]², more beyond

/* The landscape, drawn once per size and palette into a canvas the size of the box in device pixels: a smooth
   shading that glows toward the valley floors, a little hill-shading, and the contours as anti-aliased lines
   (marching squares on a grid of about 3 CSS px). The map fills the whole box; X and Y place [−5, 5]² in it. */
function landscape(w, h, dpr, C, X, Y, Xi, Yi) {
  const W = Math.max(1, Math.round(w * dpr)), H = Math.max(1, Math.round(h * dpr));
  const cv = makeCanvas(W, H), c = cv.getContext('2d');

  // shading, at a third of the resolution or less and scaled up: it has no edges, so smoothing loses nothing
  const step = Math.max(3, Math.sqrt(w * h / 60000));
  const sw = Math.max(2, Math.ceil(w / step)), sh = Math.max(2, Math.ceil(h / step));
  const sc = makeCanvas(sw, sh), sx = sc.getContext('2d'), img = sx.createImageData(sw, sh), d = img.data;
  const bg = hex(C.bg), lo = hex(C.secondary), hi = hex(C.fg);
  // a vignette, so the map fades into the page instead of ending at a border
  const cx = X(0), cy = Y(0), r0 = Math.min(w, h) * 0.42, r1 = Math.hypot(w, h) * 0.62, vig = 0.85;
  for (let j = 0; j < sh; j++) for (let i = 0; i < sw; i++) {
    const px = (i + 0.5) * w / sw, py = (j + 0.5) * h / sh, x = Xi(px), y = Yi(py), f = himmelblau(x, y), v = Math.min(1, Math.log(1 + f) / LOGMAX);
    let shade = 0;
    if (v < 1) {   // hill-shading from the gradient of v = log(1 + f) / LOGMAX, lit from the upper left
      const [gx, gy] = himmelGrad(x, y), k = 1 / ((1 + f) * LOGMAX);
      shade = Math.max(-1, Math.min(1, (-gx * 0.6 + gy * 0.8) * k * 0.9));
    }
    const glow = Math.pow(1 - v, 2.2);
    let col = mix(bg, lo, 0.10 + 0.55 * glow);
    col = mix(col, hi, 0.10 * Math.pow(1 - v, 6));
    col = shade > 0 ? mix(col, hi, 0.05 * shade * (1 - v)) : mix(col, bg, -0.35 * shade);
    col = mix(col, bg, vig * Math.min(1, Math.max(0, (Math.hypot(px - cx, py - cy) - r0) / (r1 - r0))));   // vignette
    const k = (j * sw + i) * 4;
    d[k] = col[0]; d[k + 1] = col[1]; d[k + 2] = col[2]; d[k + 3] = 255;
  }
  sx.putImageData(img, 0, 0);
  c.imageSmoothingEnabled = true;
  c.drawImage(sc, 0, 0, W, H);

  // contours by marching squares on the height field
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  const cell = 3, nx = Math.ceil(w / cell) + 1, ny = Math.ceil(h / cell) + 1;
  const g = new Float32Array(nx * ny);
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) g[j * nx + i] = height(Xi(i * cell), Yi(j * cell));
  // each cell adds its segment for every level it crosses, to that level's path; then each level is stroked once
  const NL = Math.floor(LEVELS * 1.6), segs = Array.from({ length: NL }, () => []);
  for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
    const a = g[j * nx + i], b = g[j * nx + i + 1], q = g[(j + 1) * nx + i + 1], p = g[(j + 1) * nx + i];
    const L0 = Math.max(1, Math.floor(Math.min(a, b, q, p) * LEVELS) + 1), L1 = Math.min(NL - 1, Math.floor(Math.max(a, b, q, p) * LEVELS));
    for (let L = L0; L <= L1; L++) {
      const lv = L / LEVELS, out = segs[L];
      const code = (a > lv) | (b > lv) << 1 | (q > lv) << 2 | (p > lv) << 3;
      if (code === 0 || code === 15) continue;
      const x0 = i * cell, y0 = j * cell, t = (u, v) => (lv - u) / (v - u);
      const T = () => [x0 + cell * t(a, b), y0], R = () => [x0 + cell, y0 + cell * t(b, q)];
      const B = () => [x0 + cell * t(p, q), y0 + cell], Lf = () => [x0, y0 + cell * t(a, p)];
      const seg = (m, n) => { out.push(m[0], m[1], n[0], n[1]); };
      switch (code) {
        case 1: case 14: seg(Lf(), T()); break;
        case 2: case 13: seg(T(), R()); break;
        case 3: case 12: seg(Lf(), R()); break;
        case 4: case 11: seg(R(), B()); break;
        case 6: case 9: seg(T(), B()); break;
        case 7: case 8: seg(Lf(), B()); break;
        case 5: seg(Lf(), T()); seg(R(), B()); break;
        case 10: seg(T(), R()); seg(Lf(), B()); break;
      }
    }
  }
  c.lineWidth = 0.9; c.lineCap = 'round';
  for (let L = 1; L < NL; L++) {
    const lv = L / LEVELS, sg = segs[L];
    c.strokeStyle = rgba(C.fg, lv < 1 ? 0.07 + 0.26 * Math.pow(1 - lv, 1.5) : 0.07 * Math.max(0, 1.6 - lv) / 0.6);
    c.beginPath();
    for (let k = 0; k < sg.length; k += 4) { c.moveTo(sg[k], sg[k + 1]); c.lineTo(sg[k + 2], sg[k + 3]); }
    c.stroke();
  }

  // the ring the walkers start on
  c.strokeStyle = rgba(C.fg, 0.16); c.lineWidth = 1; c.setLineDash([2, 5]);
  c.beginPath(); c.arc(X(0), Y(0), Math.abs(X(4.6) - X(0)), 0, Math.PI * 2); c.stroke();
  c.setLineDash([]);

  return cv;
}

/* Heavy-ball descent for run `cycle` with step size eta, advanced to `steps` steps. The cache S.sim is a pure
   function of (eta, cycle, steps): it is extended forward as t grows and rebuilt when eta or the run changes or
   t goes backwards. */
function simulate(S, eta, cycle, steps) {
  let sim = S.sim;
  if (!sim || sim.eta !== eta || sim.cycle !== cycle || sim.steps > steps) {
    const walkers = [];
    for (let i = 0; i < WALKERS; i++) {
      const a = 2 * Math.PI * i / WALKERS + cycle * 0.37, x = 4.6 * Math.cos(a), y = 4.6 * Math.sin(a);
      walkers.push({ x, y, vx: 0, vy: 0, trail: [[x, y]] });
    }
    sim = S.sim = { eta, cycle, steps: 0, walkers };
  }
  while (sim.steps < steps) {
    for (const p of sim.walkers) {
      const g = himmelGrad(p.x, p.y), gn = Math.hypot(g[0], g[1]);
      if (gn > 60) { g[0] *= 60 / gn; g[1] *= 60 / gn; }
      p.vx = BETA * p.vx - eta * g[0]; p.vy = BETA * p.vy - eta * g[1];
      p.x = Math.max(-6, Math.min(6, p.x + p.vx)); p.y = Math.max(-6, Math.min(6, p.y + p.vy));
      p.trail.push([p.x, p.y]);
    }
    sim.steps++;
  }
  return sim;
}

export default {
  title: 'Four valleys of Himmelblau',
  hook: 'Twelve gradient-descent walkers with momentum race toward the four minima of a nonconvex function.',
  alt: 'A softly lit contour map with four glowing valleys. Twelve bright dots start on a dotted ring and roll downhill, leaving fading green trails that spiral into the valleys.',
  tags: ['Optimization', 'Gradient descent', 'Multivariable calculus', 'Teaching'],
  license: 'MIT',
  author: { name: 'sofia.opt' },

  modes: { desktop: true, phone: true },
  time: { length: 40, loop: true },
  context: '2d',
  libraries: [],

  params: [
    { key: 'eta', type: 'range', label: 'Step size η', min: 0.001, max: 0.012, step: 0.001, default: 0.004 },
  ],
  presets: [
    { id: 'overshoot', label: 'Overshoot: η = 0.010', params: { eta: 0.01 }, t: 4 },
    { id: 'steepest', label: 'Steepest descent: η = 0.001', params: { eta: 0.001 }, t: 9 },
  ],

  draw(ctx, t, params, env, S) {
    const { w, h } = env.box, C = env.colors, dpr = env.dpr || 1;
    // [−5, 5]² fits the shorter side with a small margin; the map continues past it to fill the box
    const s = Math.max(40, Math.min(w, h) * 0.94), u = s / 10, cx = w / 2, cy = h / 2;
    const X = x => cx + x * u, Y = y => cy - y * u, Xi = px => (px - cx) / u, Yi = py => (cy - py) / u;

    // the landscape, rebuilt only when the box, the resolution or the colors change
    const key = [w, h, dpr, C.bg, C.fg, C.secondary].join();
    if (S.fieldKey !== key) { S.fieldKey = key; S.field = landscape(w, h, dpr, C, X, Y, Xi, Yi); }
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(S.field, 0, 0, w, h);

    // which run, and how far into it
    const eta = params.eta, tt = Math.min(Math.max(t, 0), 4 * RUN - 1e-9);
    const cycle = Math.floor(tt / RUN), local = tt - cycle * RUN;
    const sim = simulate(S, eta, cycle, Math.min(MAX_STEPS, Math.floor(local * RATE)));
    const fade = Math.min(1, (RUN - local) / FADE, 0.25 + local / 0.4);
    const r = Math.max(2.5, Math.min(4.5, s / 140));

    // the minima: a faint ring each, which fills with light as walkers come to rest in it
    const caught = MINIMA.map(([mx, my]) => sim.walkers.filter(p =>
      Math.hypot(p.x - mx, p.y - my) < 0.3 && Math.hypot(p.vx, p.vy) < 0.03).length);
    ctx.save();
    MINIMA.forEach(([mx, my], k) => {
      const px = X(mx), py = Y(my), n = caught[k] * fade;
      if (n > 0) {
        const R = r * (3.5 + 1.8 * Math.sqrt(n));
        const gl = ctx.createRadialGradient(px, py, 0, px, py, R);
        gl.addColorStop(0, rgba(C.main, Math.min(0.4, 0.12 + 0.06 * n))); gl.addColorStop(1, rgba(C.main, 0));
        ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(px, py, R, 0, Math.PI * 2); ctx.fill();
      }
      ctx.strokeStyle = rgba(C.fg, 0.45); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(px, py, r * 2.2, 0, Math.PI * 2); ctx.stroke();
    });

    // trails: the last second and a half bright, older steps fading to a faint record of the path
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const CH = 6;
    for (const p of sim.walkers) {
      const tr = p.trail, n = tr.length;
      for (let i0 = 0; i0 < n - 1; i0 += CH) {
        const i1 = Math.min(n - 1, i0 + CH), age = (n - 1 - i1) / RATE, k = Math.exp(-age / 1.5);
        ctx.strokeStyle = rgba(C.main, (0.3 + 0.65 * k) * fade);
        ctx.lineWidth = 1.1 + 1.3 * k;
        ctx.beginPath(); ctx.moveTo(X(tr[i0][0]), Y(tr[i0][1]));
        for (let i = i0 + 1; i <= i1; i++) ctx.lineTo(X(tr[i][0]), Y(tr[i][1]));
        ctx.stroke();
      }
    }

    // the walkers: a soft glow and a bright core
    ctx.globalCompositeOperation = 'lighter';
    for (const p of sim.walkers) {
      const sp = Math.min(1, Math.hypot(p.vx, p.vy) / 0.06), px = X(p.x), py = Y(p.y), R = r * (2.5 + 2.5 * sp);
      if (sp < 0.02) continue;
      const gl = ctx.createRadialGradient(px, py, 0, px, py, R);
      gl.addColorStop(0, rgba(C.main, 0.55 * sp * fade)); gl.addColorStop(1, rgba(C.main, 0));
      ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(px, py, R, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    for (const p of sim.walkers) {
      ctx.fillStyle = rgba(C.fg, fade); ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  },
};

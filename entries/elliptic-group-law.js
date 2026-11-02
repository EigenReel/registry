const COLORS = {
  main: '#5eead4',
  secondary: '#ff9f68',
  bg: '#050508',
  fg: '#ecebf5',
};

import { hex, mix, rgba, label, fsFor } from '@eigenreel/kit';

/* y² = x³ + A x + b, with A = −1 and b a param. */
const A = -1;
const PERIOD = 14;   // seconds for P to slide out along the branch and back
const X_OUT = 2.3;   // how far out P slides
const TRAIL = 1.2;   // seconds of motion the trails behind P and P + Q remember

function makeCanvas(w, h) {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h);
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; return cv;
}

/* The real roots of x³ − x + b, ascending (one or three). The curve lives where the cubic is ≥ 0:
   [r1, r2] ∪ [r3, ∞) with three roots, [r1, ∞) with one. */
function roots(b) {
  const p = A, q = b, D = -(4 * p * p * p + 27 * q * q);
  if (D > 0) {
    const m = 2 * Math.sqrt(-p / 3), th = Math.acos((3 * q) / (2 * p) * Math.sqrt(-3 / p)) / 3;
    return [0, 1, 2].map(k => m * Math.cos(th - (2 * Math.PI * k) / 3)).sort((u, v) => u - v);
  }
  const s = Math.sqrt(q * q / 4 + p * p * p / 27);
  return [Math.cbrt(-q / 2 + s) + Math.cbrt(-q / 2 - s)];
}
/* the nearest x where the curve exists */
function snapX(x, rs) {
  if (rs.length === 1) return Math.max(x, rs[0]);
  const [r1, r2, r3] = rs;
  if (x < r1) return r1;
  if (x > r2 && x < r3) return x - r2 < r3 - x ? r2 : r3;
  return x;
}
const pointOf = (x, s, b) => [x, s * Math.sqrt(Math.max(0, x * x * x + A * x + b))];
/* P's x while it slides with t, on the lower half of the unbounded branch: from just past the point where the
   branch crosses the x-axis out to x = X_OUT and back, once per PERIOD */
const slideX = (t, r0) => r0 + 0.06 + (X_OUT - r0 - 0.06) * (1 - Math.cos(2 * Math.PI * t / PERIOD)) / 2;

/* the third point of the line through P and Q (the tangent when they coincide), or null when that line is
   vertical and the third point is 𝒪 */
function third(xP, yP, xQ, yQ) {
  let m = null;
  if (Math.abs(xP - xQ) > 1e-4) m = (yQ - yP) / (xQ - xP);
  else if (Math.abs(yP - yQ) < 1e-6 && Math.abs(yP) > 1e-6) m = (3 * xP * xP + A) / (2 * yP);
  if (m === null) return null;
  const x3 = m * m - xP - xQ;
  return [x3, yP + m * (x3 - xP), m];
}

/* The still part of the frame, drawn once per size, b and palette at device resolution: a faint grid that fades
   toward the edges, the axes (the x-axis brighter: it is the mirror of the group law), and the curve as a crisp
   line over a soft teal glow. */
function backdrop(w, h, dpr, C, b, px, py, xl, xr, yt) {
  const cv = makeCanvas(Math.max(1, Math.round(w * dpr)), Math.max(1, Math.round(h * dpr))), c = cv.getContext('2d');
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.fillStyle = C.bg; c.fillRect(0, 0, w, h);
  const cx = w / 2, cy = h / 2, R = Math.hypot(w, h) / 2;
  const lift = c.createRadialGradient(cx, cy, 0, cx, cy, R);
  lift.addColorStop(0, rgba(C.main, 0.035)); lift.addColorStop(1, rgba(C.main, 0));
  c.fillStyle = lift; c.fillRect(0, 0, w, h);

  c.lineWidth = 1; c.strokeStyle = rgba(C.fg, 0.06); c.beginPath();
  for (let g = Math.ceil(xl); g <= xr; g++) if (g) { c.moveTo(px(g), 0); c.lineTo(px(g), h); }
  for (let g = Math.ceil(-yt); g <= yt; g++) if (g) { c.moveTo(0, py(g)); c.lineTo(w, py(g)); }
  c.stroke();
  c.strokeStyle = rgba(C.fg, 0.14); c.beginPath(); c.moveTo(px(0), 0); c.lineTo(px(0), h); c.stroke();
  c.strokeStyle = rgba(C.fg, 0.3); c.beginPath(); c.moveTo(0, py(0)); c.lineTo(w, py(0)); c.stroke();
  // the grid fades out toward the corners
  const fade = c.createRadialGradient(cx, cy, Math.min(w, h) * 0.35, cx, cy, R);
  fade.addColorStop(0, rgba(C.bg, 0)); fade.addColorStop(1, rgba(C.bg, 0.85));
  c.fillStyle = fade; c.fillRect(0, 0, w, h);

  // the curve, as runs of x where the cubic is ≥ 0, closed at the roots
  const rhs = x => x * x * x + A * x + b;
  const root = (lo, hi) => { for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if ((rhs(lo) < 0) === (rhs(mid) < 0)) lo = mid; else hi = mid; } return (lo + hi) / 2; };
  const segs = []; let run = null; const dx = (xr - xl) / 1200;
  for (let i = 0; i <= 1201; i++) {
    const x = xl + i * dx, v = rhs(x);
    if (v >= 0) { if (!run) { run = []; if (i > 0) run.push([root(x - dx, x), 0]); segs.push(run); } run.push([x, Math.sqrt(v)]); }
    else if (run) { run.push([root(x - dx, x), 0]); run = null; }
  }
  c.beginPath();
  for (const s of segs) {   // each run as one path through its roots: the upper half leftward, then the lower half back
    for (let i = s.length - 1; i >= 0; i--) i === s.length - 1 ? c.moveTo(px(s[i][0]), py(s[i][1])) : c.lineTo(px(s[i][0]), py(s[i][1]));
    for (let i = 1; i < s.length; i++) c.lineTo(px(s[i][0]), py(-s[i][1]));
    if (s[s.length - 1][1] === 0) c.closePath();   // the oval closes on itself
  }
  c.lineJoin = 'round'; c.lineCap = 'round';
  const tint = mix(hex(C.fg), hex(C.main), 0.55), tc = a => `rgba(${tint[0] | 0},${tint[1] | 0},${tint[2] | 0},${a})`;
  c.strokeStyle = tc(0.045); c.lineWidth = 16; c.stroke();
  c.strokeStyle = tc(0.08); c.lineWidth = 8; c.stroke();
  c.strokeStyle = tc(0.14); c.lineWidth = 4.5; c.stroke();
  c.strokeStyle = C.fg; c.lineWidth = 2.2; c.stroke();
  return cv;
}

export default {
  title: 'The group law on an elliptic curve',
  hook: 'A line through P and Q meets the cubic once more. Reflect that point and you have P + Q.',
  alt: 'A softly glowing cubic curve with a line through two teal points P and Q that crosses it a third time, and a dashed orange line joining that crossing to its mirror image, the glowing sum P + Q. P slides along the curve, both leaving fading trails.',
  tags: ['Algebraic geometry', 'Number theory', 'Elliptic curves', 'Teaching'],
  license: 'GPL-3.0',
  author: { name: 'kmoreau.geom' },

  modes: { desktop: true, phone: true },
  time: { length: 14, loop: true },
  context: '2d',
  libraries: [],

  params: [
    { key: 'b', type: 'range', label: 'Coefficient b', min: 0.05, max: 2, step: 0.05, default: 1 },
    { key: 'slide', type: 'toggle', label: 'P slides along the curve', default: true },
    { key: 'px', type: 'range', label: 'x-coordinate of P', min: -1.6, max: 3, step: 0.01, default: 1 },
    { key: 'pUp', type: 'toggle', label: 'P on the upper half', default: true },
    { key: 'qx', type: 'range', label: 'x-coordinate of Q', min: -1.6, max: 3, step: 0.01, default: -0.5 },
    { key: 'qUp', type: 'toggle', label: 'Q on the upper half', default: false },
  ],
  presets: [
    { id: 'split', label: 'Split the curve: b = 0.30', params: { b: 0.3 } },
    { id: 'oval', label: 'P on the oval', params: { b: 0.3, slide: false, px: -0.95, pUp: true, qx: 1, qUp: false } },
    { id: 'double', label: 'P = Q: the tangent gives 2P', params: { b: 1, slide: false, px: 0.6, pUp: false, qx: 0.6, qUp: false } },
    { id: 'slide', label: 'Let P slide again', params: { slide: true, qx: -0.5, qUp: false }, t: 0 },
  ],

  interact: { hint: 'Drag P or Q along the curve · use the panel' },

  draw(ctx, t, params, env, S) {
    const B = env.box, w = B.w, h = B.h, C = env.colors, dpr = env.dpr || 1, fs = fsFor(B), interact = env.mode === 'interact';
    const b = params.b, rs = roots(b), r0 = rs[rs.length - 1];
    const xm = 0.3, k = Math.min(w / 5.8, h / 9), ox = w / 2, oy = h / 2;
    const px = x => ox + (x - xm) * k, py = y => oy - y * k;
    const xl = xm - w / 2 / k, xr = xm + w / 2 / k, yt = h / 2 / k;
    const on = (X, Y, pad) => X > pad && X < w - pad && Y > pad && Y < h - pad;
    const num = (v, d) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(d);   // with a true minus sign

    // the grid, the axes and the curve, rebuilt only when the box, the resolution, b or the colors change
    const key = [w, h, dpr, b, C.bg, C.fg, C.main].join();
    if (S.bgKey !== key) { S.bgKey = key; S.bg = backdrop(w, h, dpr, C, b, px, py, xl, xr, yt); }
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(S.bg, 0, 0, w, h);

    // P and Q as [x, sign]: P follows t while `slide` is on, otherwise both come from the params
    const posP = tt => [slideX(tt, r0), -1];
    const cP = params.slide ? posP(t) : [snapX(params.px, rs), params.pUp ? 1 : -1];
    const cQ = [snapX(params.qx, rs), params.qUp ? 1 : -1];
    const [xP, yP] = pointOf(cP[0], cP[1], b), [xQ, yQ] = pointOf(cQ[0], cQ[1], b);
    const R3 = third(xP, yP, xQ, yQ);

    const halo = (X, Y, r, c, a) => {
      const g = ctx.createRadialGradient(X, Y, 0, X, Y, r);
      g.addColorStop(0, rgba(c, a)); g.addColorStop(1, rgba(c, 0));
      ctx.fillStyle = g; ctx.fillRect(X - r, Y - r, 2 * r, 2 * r);
    };
    const disc = (X, Y, r, fill) => { ctx.beginPath(); ctx.arc(X, Y, r, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); };
    const ring = (X, Y, r, stroke, lw) => { ctx.beginPath(); ctx.arc(X, Y, r, 0, Math.PI * 2); ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); };
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';

    // while P slides, the last TRAIL seconds of P and of P + Q, as fading strokes along the curve
    if (params.slide) {
      const n = 30, far = 0.25 * Math.min(w, h), trails = [[], []];
      for (let i = 0; i <= n; i++) {
        const [x, s] = posP(t - TRAIL * i / n), [x1, y1] = pointOf(x, s, b), r = third(x1, y1, xQ, yQ);
        trails[0].push([px(x1), py(y1)]);
        trails[1].push(r ? [px(r[0]), py(-r[1])] : null);
      }
      trails.forEach((tr, j) => {
        for (let i = 0; i < n; i++) {
          const p = tr[i], q = tr[i + 1];
          if (!p || !q || Math.hypot(p[0] - q[0], p[1] - q[1]) > far) continue;
          const f = 1 - i / n;
          ctx.strokeStyle = rgba(j ? C.secondary : C.main, 0.85 * Math.pow(f, 1.5)); ctx.lineWidth = 2 + 3.5 * f;
          ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
        }
      });
    }

    let sumTxt = 'P + Q = 𝒪', sum = null, star = null;
    if (R3) {
      const [x3, y3, m] = R3;
      // the line through P, Q and P∗Q: faint across the frame, brighter over the stretch that holds the three points
      const L = x => [px(x), py(yP + m * (x - xP))];
      ctx.strokeStyle = rgba(C.fg, 0.2); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(...L(xl)); ctx.lineTo(...L(xr)); ctx.stroke();
      const lo = Math.max(xl, Math.min(xP, xQ, x3)), hi = Math.min(xr, Math.max(xP, xQ, x3));
      if (hi > lo) { ctx.strokeStyle = rgba(C.fg, 0.6); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(...L(lo)); ctx.lineTo(...L(hi)); ctx.stroke(); }
      if (Math.abs(m) <= 40) {
        star = [px(x3), py(y3)]; sum = [px(x3), py(-y3)];
        // the reflection across the x-axis, its dashes flowing from P∗Q to P + Q (100 px per 14 s loop: seamless)
        ctx.setLineDash([5, 5]); ctx.lineDashOffset = -(t * 50 / 7) % 10;
        ctx.strokeStyle = rgba(C.secondary, 0.85); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(...star); ctx.lineTo(...sum); ctx.stroke();
        ctx.setLineDash([]); ctx.lineDashOffset = 0;
      }
      sumTxt = Math.abs(m) > 9 ? 'P + Q → 𝒪, the point at infinity'
        : `${Math.abs(xP - xQ) > 1e-4 ? 'P + Q' : '2P'} = (${num(x3, 2)}, ${num(-y3, 2)})`;
    }

    // P∗Q: a hollow ring on the curve
    if (star && on(star[0], star[1], -20)) { disc(star[0], star[1], 6.5, C.bg); ring(star[0], star[1], 5.5, rgba(C.fg, 0.9), 1.8); }
    // P + Q: an orange glow and a bright core; an arrow at the edge when it is off screen
    if (sum && on(sum[0], sum[1], 6)) {
      ctx.globalCompositeOperation = 'lighter';
      halo(sum[0], sum[1], 30, C.secondary, 0.4);
      ctx.globalCompositeOperation = 'source-over';
      ring(sum[0], sum[1], 11, rgba(C.secondary, 0.45), 1.2);
      disc(sum[0], sum[1], 7, C.secondary);
      disc(sum[0], sum[1], 2.8, rgba(C.fg, 0.9));
    } else if (sum) {
      const a = Math.atan2(sum[1] - oy, sum[0] - ox), s = Math.min((w / 2 - 18) / Math.abs(Math.cos(a) || 1e-9), (h / 2 - 18) / Math.abs(Math.sin(a) || 1e-9));
      const ax = ox + Math.cos(a) * s, ay = oy + Math.sin(a) * s;
      ctx.globalCompositeOperation = 'lighter';
      halo(ax, ay, 22, C.secondary, 0.35);
      ctx.globalCompositeOperation = 'source-over';
      ctx.save(); ctx.translate(ax, ay); ctx.rotate(a);
      ctx.fillStyle = C.secondary; ctx.beginPath(); ctx.moveTo(9, 0); ctx.lineTo(-7, -7); ctx.lineTo(-3, 0); ctx.lineTo(-7, 7); ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    // P and Q: a teal glow and core, with a ring on the one under the pointer or being dragged
    for (const [id, x, y] of [['Q', xQ, yQ], ['P', xP, yP]]) {
      const X = px(x), Y = py(y), hot = interact && (S.drag === id || S.hover === id);
      ctx.globalCompositeOperation = 'lighter';
      halo(X, Y, hot ? 28 : 20, C.main, hot ? 0.4 : 0.28);
      ctx.globalCompositeOperation = 'source-over';
      if (hot) ring(X, Y, 12, rgba(C.main, 0.7), 1.5);
      disc(X, Y, 8, rgba(C.bg, 0.7));
      disc(X, Y, 6, C.main);
    }

    // what the pointer handlers need: where P and Q were drawn (CSS px) and the map back to the plane
    S.hit = { P: [px(xP), py(yP)], Q: [px(xQ), py(yQ)], P0: cP, ox, oy, k, xm };
    S.params = params;

    // names and readouts, in interact mode only
    if (interact) {
      // P and Q are named on their left, P∗Q and P + Q on their right, each on the side away from the x-axis
      const f = fs + 1, off = (y, d) => y < 0 ? d : -d * 0.55;
      const same = Math.abs(xP - xQ) <= 1e-4 && Math.abs(yP - yQ) < 1e-6;   // then the chord is the tangent
      label(ctx, env, same ? 'P = Q' : 'P', px(xP) - 9, py(yP) + off(yP, 22), { size: f, weight: 700, color: C.main, align: 'right' });
      if (!same) label(ctx, env, 'Q', px(xQ) - 9, py(yQ) + off(yQ, 22), { size: f, weight: 700, color: C.main, align: 'right' });
      if (star && on(star[0], star[1], 0)) label(ctx, env, 'P∗Q', star[0] + 11, star[1] + (R3[1] > 0 ? -9 : 19), { size: fs, weight: 700, alpha: 0.85 });
      if (sum && on(sum[0], sum[1], 0)) label(ctx, env, same ? '2P' : 'P + Q', sum[0] + 14, sum[1] + (R3[1] > 0 ? 20 : -11), { size: f, weight: 700, color: C.secondary });
      const disc4 = 27 * b * b - 4, m2 = 14;
      label(ctx, env, `y² = x³ − x + ${b.toFixed(2)}`, m2, m2 + fs, { size: f, weight: 700 });
      label(ctx, env, `Δ = ${num(-16 * disc4, 1)}  ·  ${disc4 > 0 ? 'one real component' : disc4 < 0 ? 'two real components' : 'singular'}`, m2, m2 + fs * 2.3, { size: fs, alpha: 0.7 });
      label(ctx, env, sumTxt, m2, m2 + fs * 3.7, { size: fs, color: C.secondary, weight: 700 });
    }
  },

  onMode(env, S) {
    if (env.mode !== 'interact' || !env.ui) { S.drag = null; S.hover = null; return; }
    const p = S.params || { px: 1, qx: -0.5 };
    const phone = env.device === 'phone';

    // the panel: one slider per point's x-coordinate
    const panel = document.createElement('div');
    panel.style.position = 'absolute';
    panel.style.right = '8px';
    panel.style.bottom = phone ? '30px' : '28px';
    panel.style.padding = '6px 8px';
    panel.style.display = 'flex';
    panel.style.flexDirection = 'column';
    panel.style.gap = '4px';
    const sliders = {};
    for (const id of ['P', 'Q']) {
      const key = id.toLowerCase() + 'x';
      const row = document.createElement('label');
      row.style.display = 'flex';
      row.style.gap = '6px';
      row.style.alignItems = 'center';
      const name = document.createElement('span');
      name.textContent = `x of ${id}`;
      const s = document.createElement('input');
      s.setAttribute('type', 'range');
      s.setAttribute('min', '-1.6');
      s.setAttribute('max', '3');
      s.setAttribute('step', '0.01');
      s.setAttribute('value', String(id === 'P' && p.slide && S.hit ? S.hit.P0[0].toFixed(2) : p[key]));
      s.setAttribute('aria-label', `x-coordinate of ${id}`);
      if (phone) s.style.width = '110px';
      s.addEventListener('input', e => {
        if (id === 'P') env.setParam('slide', false);
        env.setParam(key, +e.value);
      });
      row.appendChild(name);
      row.appendChild(s);
      panel.appendChild(row);
      sliders[id] = s;
    }

    // dragging: hit-test against where draw put P and Q; x follows the pointer, its height picks the branch
    const grab = 22;
    const toWorld = (x, y) => { const H = S.hit; return [H.xm + (x - H.ox) / H.k, (H.oy - y) / H.k]; };
    const move = (id, e) => {
      const [wx, wy] = toWorld(e.x, e.y);
      if (id === 'P') env.setParam('slide', false);
      const v = env.setParam(id.toLowerCase() + 'x', wx);
      env.setParam(id === 'P' ? 'pUp' : 'qUp', wy >= 0);
      if (sliders[id]) sliders[id].setAttribute('value', String(v));
    };
    const nearest = e => {
      let best = null, bd = grab;
      for (const id of ['P', 'Q']) {
        const d = Math.hypot(e.x - S.hit[id][0], e.y - S.hit[id][1]);
        if (d < bd) { bd = d; best = id; }
      }
      return best;
    };
    env.ui.addEventListener('pointerdown', e => {
      if (!S.hit || !Number.isFinite(e.x) || !Number.isFinite(e.y)) return;
      const best = nearest(e);
      S.drag = best;
      if (best) move(best, e);
    });
    env.ui.addEventListener('pointermove', e => {
      if (!S.hit || !Number.isFinite(e.x) || !Number.isFinite(e.y)) return;
      if (!S.drag) { S.hover = nearest(e); return; }   // hover state only: which point a press would grab
      move(S.drag, e);
    });
    const end = () => { S.drag = null; };
    env.ui.addEventListener('pointerup', end);
    env.ui.addEventListener('pointercancel', end);

    env.ui.replaceChildren(panel);
  },
};

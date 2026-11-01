const COLORS = {
  main: '#92140c',       // the eight chosen points
  secondary: '#b85c77',  // the ninth point, forced by the other eight
  curve: '#71697a',      // the cubic sweeping through the pencil
  bg: '#07080d',
  fg: '#e9e7f2',         // the faint web of other cubics, and text
};

import { label, fsFor } from '@eigenreel/kit';

// ---------------------------------------------------------------------------------------------------------------
// The mathematics. A plane cubic is a vector of 10 coefficients in the monomial basis below. Asking a cubic to pass
// through a point is one linear condition, so the cubics through eight points in general position form a pencil
// {cos θ · F + sin θ · G}. Any two members meet in 9 points (Bézout); the ninth point is the extra base point.
// ---------------------------------------------------------------------------------------------------------------

// x³ x²y xy² y³ x² xy y² x y 1
const mono = (x, y) => [x * x * x, x * x * y, x * y * y, y * y * y, x * x, x * y, y * y, x, y, 1];
const evalC = (c, x, y) => ((c[0] * x + c[1] * y + c[4]) * x + c[5] * y + c[7]) * x + ((c[2] * x + c[3] * y + c[6]) * y + c[8]) * y + c[9];
const dot = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s; };

/* eigen-decomposition of a symmetric matrix (cyclic Jacobi) */
function jacobi(A) {
  const n = A.length, a = A.map(r => r.slice()), V = a.map((_, i) => a.map((_, j) => +(i === j)));
  for (let sweep = 0; sweep < 50; sweep++) {
    let off = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += a[i][j] * a[i][j];
    if (off < 1e-30) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(a[p][q]) < 1e-300) continue;
      const th = (a[q][q] - a[p][p]) / (2 * a[p][q]);
      const t = (th >= 0 ? 1 : -1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const u = a[k][p], v = a[k][q]; a[k][p] = c * u - s * v; a[k][q] = s * u + c * v; }
      for (let k = 0; k < n; k++) { const u = a[p][k], v = a[q][k]; a[p][k] = c * u - s * v; a[q][k] = s * u + c * v; }
      for (let k = 0; k < n; k++) { const u = V[k][p], v = V[k][q]; V[k][p] = c * u - s * v; V[k][q] = s * u + c * v; }
    }
  }
  return { vals: a.map((r, i) => r[i]), V };
}

/* the two-dimensional space of cubics through the points, and how close it is to being bigger */
function pencil(pts) {
  const rows = pts.map(([x, y]) => mono(x, y));
  const M = [];
  for (let i = 0; i < 10; i++) { M.push([]); for (let j = 0; j < 10; j++) { let s = 0; for (const r of rows) s += r[i] * r[j]; M[i].push(s); } }
  const { vals, V } = jacobi(M);
  const ord = vals.map((_, i) => i).sort((i, j) => vals[i] - vals[j]);
  const col = k => V.map(r => r[ord[k]]);
  return { n1: col(0), n2: col(1), gap: vals[ord[2]] / Math.max(1e-300, vals[ord[9]]) };
}

/* a basis of the pencil that moves continuously with the points: project two fixed cubics onto it */
const E1 = [0.3, -0.5, 0.2, 0.4, -0.1, 0.6, -0.3, 0.2, -0.4, 0.1];
const E2 = [-0.4, 0.1, 0.5, -0.2, 0.3, -0.1, 0.4, 0.6, 0.2, -0.3];
function basis(n1, n2) {
  const P = e => { const a = dot(n1, e), b = dot(n2, e); return n1.map((v, i) => a * v + b * n2[i]); };
  let F = P(E1); const nf = Math.hypot(...F); F = F.map(v => v / nf);
  let G = P(E2); const g = dot(G, F); G = G.map((v, i) => v - g * F[i]); const ng = Math.hypot(...G); G = G.map(v => v / ng);
  return [F, G];
}

function det(M) {
  const a = M.map(r => r.slice()), n = a.length; let d = 1;
  for (let i = 0; i < n; i++) {
    let p = i;
    for (let r = i + 1; r < n; r++) if (Math.abs(a[r][i]) > Math.abs(a[p][i])) p = r;
    if (a[p][i] === 0) return 0;
    if (p !== i) { const tmp = a[p]; a[p] = a[i]; a[i] = tmp; d = -d; }
    d *= a[i][i];
    for (let r = i + 1; r < n; r++) { const f = a[r][i] / a[i][i]; for (let k = i; k < n; k++) a[r][k] -= f * a[i][k]; }
  }
  return d;
}
/* resultant of two cubics in one variable, given their coefficients (highest first) */
function sylvester(A, B) {
  const rows = [];
  for (const c of [A, B]) for (let s = 0; s < 3; s++) { const r = [0, 0, 0, 0, 0, 0]; for (let k = 0; k < 4; k++) r[s + k] = c[k]; rows.push(r); }
  return det(rows);
}
const inY = (c, x) => [c[3], c[2] * x + c[6], c[1] * x * x + c[5] * x + c[8], ((c[0] * x + c[4]) * x + c[7]) * x + c[9]];
const inX = (c, y) => [c[0], c[1] * y + c[4], c[2] * y * y + c[5] * y + c[7], ((c[3] * y + c[6]) * y + c[8]) * y + c[9]];
/* Res(F, G) has degree 9 and vanishes at the eight known coordinates; dividing them out leaves a linear factor */
function lastRoot(F, G, known, slice) {
  const S = [-7, -5, -3.5, 3.5, 5, 7];
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (const s of S) {
    let q = sylvester(slice(F, s), slice(G, s));
    for (const k of known) q /= (s - k);
    sx += s; sy += q; sxx += s * s; sxy += s * q;
  }
  const n = S.length, a = (n * sxy - sx * sy) / (n * sxx - sx * sx), b = (sy - a * sx) / n;
  return -b / a;
}
/* the ninth base point, computed in a slightly rotated frame so no axis direction is special */
function ninth(pts) {
  const al = 0.4137, ca = Math.cos(al), sa = Math.sin(al);
  const rp = pts.map(([x, y]) => [ca * x - sa * y, sa * x + ca * y]);
  const { n1: F, n2: G } = pencil(rp);
  let x = lastRoot(F, G, rp.map(p => p[0]), inY), y = lastRoot(F, G, rp.map(p => p[1]), inX);
  for (let it = 0; it < 4 && Number.isFinite(x + y) && Math.abs(x) + Math.abs(y) < 50; it++) {   // Newton polish
    const h = 1e-6, f = evalC(F, x, y), g = evalC(G, x, y);
    const fx = (evalC(F, x + h, y) - evalC(F, x - h, y)) / (2 * h), fy = (evalC(F, x, y + h) - evalC(F, x, y - h)) / (2 * h);
    const gx = (evalC(G, x + h, y) - evalC(G, x - h, y)) / (2 * h), gy = (evalC(G, x, y + h) - evalC(G, x, y - h)) / (2 * h);
    const D = fx * gy - fy * gx;
    if (Math.abs(D) < 1e-14) break;
    x -= (f * gy - fy * g) / D; y -= (fx * g - f * gx) / D;
  }
  return [ca * x + sa * y, -sa * x + ca * y];
}

/* 'line' if four of the points are on a line, 'conic' if seven are on a conic, else null (to the params' precision) */
function fixedPart(pts) {
  const n = pts.length;
  for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) {
    const dx = pts[b][0] - pts[a][0], dy = pts[b][1] - pts[a][1], L = Math.hypot(dx, dy);
    if (L < 1e-9) continue;
    let on = 2;
    for (let c = 0; c < n; c++) if (c !== a && c !== b && Math.abs(dx * (pts[c][1] - pts[a][1]) - dy * (pts[c][0] - pts[a][0])) / L < 1.5e-4) on++;
    if (on >= 4) return 'line';
  }
  for (let skip = 0; skip < n; skip++) {
    const rows = pts.filter((_, i) => i !== skip).map(([x, y]) => [x * x, x * y, y * y, x, y, 1]);
    const M = [];
    for (let i = 0; i < 6; i++) { M.push([]); for (let j = 0; j < 6; j++) { let s = 0; for (const r of rows) s += r[i] * r[j]; M[i].push(s); } }
    const v = jacobi(M).vals.sort((p, q) => p - q);
    if (v[0] / v[5] < 2e-11) return 'conic';
  }
  return null;
}

// The eight points drift on small closed loops whose periods divide the 24-second loop, so the frame at t is
// a function of t and the params alone. Each row: x and y frequencies (cycles per loop) and phases.
const DRIFT = [[1, 1, 1.74, 0.73], [1, 1, 0.06, 4.49], [2, 1, 4.45, 5.89], [2, 2, 1.05, 6.12],
  [2, 2, 4.55, 1.92], [1, 2, 3.53, 1.48], [1, 2, 1.4, 5.29], [1, 1, 1.9, 4.48]];
const AMP = 0.08, LOOP = 24, SWEEP = 12;   // one sweep of the whole pencil every 12 s
const LIM = 1.5;

/* marching squares: the zero set of v (on an (nx+1)×(ny+1) grid of spacing `cell`) as one path */
function zeroSet(ctx, v, nx, ny, cell) {
  const W = nx + 1;
  ctx.beginPath();
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const a = v[j * W + i], b = v[j * W + i + 1], c = v[(j + 1) * W + i + 1], d = v[(j + 1) * W + i];
    const code = (a > 0) | ((b > 0) << 1) | ((c > 0) << 2) | ((d > 0) << 3);
    if (code === 0 || code === 15) continue;
    const x0 = i * cell, y0 = j * cell;
    const T = () => [x0 + cell * a / (a - b), y0];
    const R = () => [x0 + cell, y0 + cell * b / (b - c)];
    const B = () => [x0 + cell * d / (d - c), y0 + cell];
    const L = () => [x0, y0 + cell * a / (a - d)];
    const seg = (p, q) => { ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); };
    switch (code) {
      case 1: case 14: seg(L(), T()); break;
      case 2: case 13: seg(T(), R()); break;
      case 3: case 12: seg(L(), R()); break;
      case 4: case 11: seg(R(), B()); break;
      case 6: case 9: seg(T(), B()); break;
      case 7: case 8: seg(L(), B()); break;
      case 5: case 10: {
        const m = (a + b + c + d) / 4;
        if ((m > 0) === (code === 5)) { seg(L(), B()); seg(T(), R()); } else { seg(L(), T()); seg(R(), B()); }
        break;
      }
    }
  }
}

const P8 = [1, 2, 3, 4, 5, 6, 7, 8];

export default {
  title: 'Cayley–Bacharach: eight points force a ninth',
  hook: 'Pick eight points. Every cubic curve through them also passes through one more point, the same one for all of them.',
  alt: 'Eight dark red dots drift slowly while a family of cubic curves sweeps through them; every curve also threads a ninth, glowing pink dot that moves in step with the others.',
  tags: ['Algebraic geometry', 'Geometry'],
  license: 'MIT',
  author: { name: 'Thomas Brazelton' },

  modes: { desktop: true, phone: true },
  time: { length: 24, loop: true },
  context: '2d',
  libraries: [],

  params: [
    { key: 'wander', type: 'toggle', label: 'Let the eight points drift', default: true },
    { key: 'curves', type: 'range', label: 'Other cubics drawn', min: 0, max: 12, step: 1, default: 7 },
    { key: 'x1', type: 'range', label: 'Point 1, x', min: -1.5, max: 1.5, step: 0.0001, default: -0.76 },
    { key: 'y1', type: 'range', label: 'Point 1, y', min: -1.5, max: 1.5, step: 0.0001, default: 0.21 },
    { key: 'x2', type: 'range', label: 'Point 2, x', min: -1.5, max: 1.5, step: 0.0001, default: 0.76 },
    { key: 'y2', type: 'range', label: 'Point 2, y', min: -1.5, max: 1.5, step: 0.0001, default: -0.23 },
    { key: 'x3', type: 'range', label: 'Point 3, x', min: -1.5, max: 1.5, step: 0.0001, default: 0.19 },
    { key: 'y3', type: 'range', label: 'Point 3, y', min: -1.5, max: 1.5, step: 0.0001, default: 0.36 },
    { key: 'x4', type: 'range', label: 'Point 4, x', min: -1.5, max: 1.5, step: 0.0001, default: -0.41 },
    { key: 'y4', type: 'range', label: 'Point 4, y', min: -1.5, max: 1.5, step: 0.0001, default: -0.36 },
    { key: 'x5', type: 'range', label: 'Point 5, x', min: -1.5, max: 1.5, step: 0.0001, default: -0.42 },
    { key: 'y5', type: 'range', label: 'Point 5, y', min: -1.5, max: 1.5, step: 0.0001, default: 0.46 },
    { key: 'x6', type: 'range', label: 'Point 6, x', min: -1.5, max: 1.5, step: 0.0001, default: 0.36 },
    { key: 'y6', type: 'range', label: 'Point 6, y', min: -1.5, max: 1.5, step: 0.0001, default: -0.44 },
    { key: 'x7', type: 'range', label: 'Point 7, x', min: -1.5, max: 1.5, step: 0.0001, default: -0.32 },
    { key: 'y7', type: 'range', label: 'Point 7, y', min: -1.5, max: 1.5, step: 0.0001, default: -0.77 },
    { key: 'x8', type: 'range', label: 'Point 8, x', min: -1.5, max: 1.5, step: 0.0001, default: -0.01 },
    { key: 'y8', type: 'range', label: 'Point 8, y', min: -1.5, max: 1.5, step: 0.0001, default: 0.75 },
  ],
  presets: [
    { id: 'pascal', label: 'Pascal: six points on a circle', t: 5.618, params: { wander: false,
      x1: -0.5929, y1: 0.1812, x2: -0.3672, y2: 0.4996, x3: 0.4925, y3: 0.3766, x4: -0.4312, y4: -0.4455, x5: 0.1247, y5: -0.6073, x6: 0.6152, y6: -0.0772, x7: -0.9336, y7: -0.2992, x8: 0.9716, y8: 0.3081 } },
    { id: 'pappus', label: 'Pappus: two lines of three', t: 11.906, params: { wander: false,
      x1: -0.0274, y1: -0.6136, x2: -0.6907, y2: -0.5697, x3: 0.8533, y3: -0.6718, x4: 0.2858, y4: 0.4471, x5: -0.8895, y5: 0.68, x6: 0.7991, y6: 0.3454, x7: -0.3164, y7: -0.18, x8: 0.5084, y8: 0.0081 } },
    { id: 'pappus-lines', label: 'Pappus: a cubic made of three lines', t: 4.664, params: { wander: false,
      x1: -0.0274, y1: -0.6136, x2: -0.6907, y2: -0.5697, x3: 0.8533, y3: -0.6718, x4: 0.2858, y4: 0.4471, x5: -0.8895, y5: 0.68, x6: 0.7991, y6: 0.3454, x7: -0.3164, y7: -0.18, x8: 0.5084, y8: 0.0081 } },
  ],

  interact: { hint: 'Drag any of the eight red points' },

  setup(env, S) {
    S.hover = -1;    // the point under the pointer (hover state only)
    S.drag = -1;     // the point being dragged
  },

  draw(ctx, t, params, env, S) {
    const { w, h } = env.box, C = env.colors;
    const k = Math.min(w / 2.5, h / 2.75), cx = w / 2, cy = h / 2;
    const sx = x => cx + x * k, sy = y => cy - y * k;

    // the eight points at time t
    const pts = P8.map((i, n) => {
      let x = params['x' + i], y = params['y' + i];
      if (params.wander) {
        const [f, g, a, b] = DRIFT[n];
        x += AMP * Math.cos(2 * Math.PI * f * t / LOOP + a);
        y += AMP * Math.sin(2 * Math.PI * g * t / LOOP + b);
      }
      return [x, y];
    });
    // for the pointer handlers: where things are on screen (not params; draw never reads these back)
    S.view = { k, cx, cy, w, h };
    S.cur = pts;

    const { n1, n2, gap } = pencil(pts);
    const net = !(gap > 1e-9);               // five on a line or eight on a conic: a net of cubics, not a pencil
    const fixed = net ? null : fixedPart(pts); // four on a line or seven on a conic: the pencil has a fixed component
    const degenerate = net || !!fixed;
    const [F, G] = basis(n1, n2);

    // F and G on a grid covering the box
    const cell = Math.max(3, Math.min(w, h) / 160);
    const nx = Math.ceil(w / cell), ny = Math.ceil(h / cell), W = nx + 1;
    const N = W * (ny + 1);
    if (!S.grid || S.grid.F.length !== N) S.grid = { F: new Float64Array(N), G: new Float64Array(N), V: new Float64Array(N) };
    const { F: gF, G: gG, V: gV } = S.grid;
    for (let j = 0; j <= ny; j++) {
      const y = (cy - j * cell) / k;
      for (let i = 0; i <= nx; i++) {
        const x = (i * cell - cx) / k, id = j * W + i;
        gF[id] = evalC(F, x, y); gG[id] = evalC(G, x, y);
      }
    }
    const member = th => { const c = Math.cos(th), s = Math.sin(th); for (let i = 0; i < N; i++) gV[i] = c * gF[i] + s * gG[i]; return gV; };

    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    // the web: other members of the pencil, at fixed angles
    const m = params.curves;
    ctx.strokeStyle = C.fg; ctx.globalAlpha = degenerate ? 0.08 : 0.15; ctx.lineWidth = 1;
    for (let j = 0; j < m; j++) { zeroSet(ctx, member(Math.PI * (j + 0.5) / m), nx, ny, cell); ctx.stroke(); }
    ctx.globalAlpha = 1;

    // the sweeping member: one pass through the whole pencil every 12 s
    const th = Math.PI * (t % SWEEP) / SWEEP;
    ctx.strokeStyle = C.curve; ctx.lineWidth = 2.4; ctx.globalAlpha = degenerate ? 0.35 : 1;
    zeroSet(ctx, member(th), nx, ny, cell); ctx.stroke();
    ctx.globalAlpha = 1;

    const dot = (x, y, r, fill, stroke, lw) => {
      ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI);
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 2; ctx.stroke(); }
    };

    // the ninth point
    let p9 = null, off = null;
    if (!degenerate) {
      const q = ninth(pts);
      if (Number.isFinite(q[0]) && Number.isFinite(q[1])) {
        const X = sx(q[0]), Y = sy(q[1]), pad = 14;
        if (X > pad && X < w - pad && Y > pad && Y < h - pad) p9 = [X, Y, q];
        else off = Math.atan2(-(q[1]), q[0]);   // direction on screen (y down)
      }
    }
    if (p9) {
      const pulse = 0.5 + 0.5 * Math.cos(2 * Math.PI * t / 3);
      ctx.globalAlpha = 0.18 + 0.12 * pulse;
      dot(p9[0], p9[1], 13 + 3 * pulse, C.secondary);
      ctx.globalAlpha = 1;
      dot(p9[0], p9[1], 7, C.secondary, C.bg, 2);
    } else if (off !== null) {
      // the ninth point is off screen (or at infinity): an arrow at the edge points to it
      const r = Math.min(w, h) / 2 - 16, ex = cx + Math.cos(off) * r * (w / Math.min(w, h)), ey = cy + Math.sin(off) * r * (h / Math.min(w, h));
      const ax = Math.min(w - 14, Math.max(14, ex)), ay = Math.min(h - 14, Math.max(14, ey));
      ctx.save(); ctx.translate(ax, ay); ctx.rotate(off);
      ctx.fillStyle = C.secondary; ctx.beginPath(); ctx.moveTo(9, 0); ctx.lineTo(-7, -7); ctx.lineTo(-3, 0); ctx.lineTo(-7, 7); ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    // the eight points
    pts.forEach(([x, y], i) => {
      const X = sx(x), Y = sy(y);
      if (env.mode === 'interact' && (S.hover === i || S.drag === i)) dot(X, Y, 12, null, C.main, 1.5);
      dot(X, Y, 6.5, C.main, C.bg, 2);
    });

    // readouts, in interact mode only
    if (env.mode === 'interact') {
      const fs = fsFor(env.box), m2 = 14;
      const f = v => (v < 0 ? '−' : '') + Math.abs(v).toFixed(2);
      let msg;
      if (net) msg = 'a whole net of cubics passes through these eight';
      else if (fixed) msg = fixed === 'line' ? 'four points on a line: every cubic here contains it' : 'seven points on a conic: every cubic here contains it';
      else if (p9) msg = `ninth point (${f(p9[2][0])}, ${f(p9[2][1])})`;
      else msg = 'the ninth point is off screen, or at infinity';
      label(ctx, env, msg, m2, h - m2, { size: fs, color: degenerate ? C.fg : C.secondary, weight: 600 });
    }
  },

  onMode(env, S) {
    S.hover = -1; S.drag = -1;
    if (env.mode !== 'interact' || !env.ui || S.boundUi === env.ui) return;
    S.boundUi = env.ui;
    const at = e => [e.x ?? e.offsetX, e.y ?? e.offsetY];
    const nearest = (x, y) => {
      if (!S.cur || !S.view) return -1;
      const { k, cx, cy } = S.view;
      let best = -1, bd = 22;
      S.cur.forEach(([u, v], i) => { const d = Math.hypot(cx + u * k - x, cy - v * k - y); if (d < bd) { bd = d; best = i; } });
      return best;
    };
    const r3 = v => Math.round(Math.min(LIM, Math.max(-LIM, v)) * 10000) / 10000;
    env.ui.addEventListener('pointerdown', e => {
      const [x, y] = at(e), i = nearest(x, y);
      if (i < 0) return;
      // freeze the drift where it is, so nothing jumps: every point becomes its current position
      S.cur.forEach(([u, v], n) => { env.setParam('x' + (n + 1), r3(u)); env.setParam('y' + (n + 1), r3(v)); });
      env.setParam('wander', false);
      S.drag = i;
    });
    env.ui.addEventListener('pointermove', e => {
      const [x, y] = at(e);
      if (S.drag < 0) { S.hover = nearest(x, y); return; }
      const { k, cx, cy, w, h } = S.view, pad = 10;
      const u = (Math.min(w - pad, Math.max(pad, x)) - cx) / k, v = (cy - Math.min(h - pad, Math.max(pad, y))) / k;
      env.setParam('x' + (S.drag + 1), r3(u));
      env.setParam('y' + (S.drag + 1), r3(v));
    });
    const end = () => { S.drag = -1; };
    env.ui.addEventListener('pointerup', end);
    env.ui.addEventListener('pointercancel', end);
  },
};

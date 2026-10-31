// github.com/loci-viz/elliptic-group-law/src/index.js · GPL-3.0 License
// pointer: "custom". Once the viewer engages the piece, P and Q can be dragged along the curve (Picker from the kit);
// the dragged x snaps onto the curve and the sign of the pointer's y picks the branch. Until P is dragged it slides
// along the curve with t, exactly as before, and holds still while the piece is engaged so it can be grabbed.
// The dragged points are the view, so a share link keeps them.
import { rgba, label, clipBox, fsFor, Picker } from '@loci/kit';

const A = -1;                                   // y² = x³ + A x + b

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
const parsePt = v => Array.isArray(v) && v.length === 2 && Number.isFinite(v[0]) && (v[1] === 1 || v[1] === -1) ? [v[0], v[1]] : null;

export default {
  setup() {
    this.pick = new Picker();
    this.pts = { P: null, Q: null };   // dragged points as [x, sign], or null while a point follows its default
    this.sel = 'P';                     // the point the arrow keys move
    this.hold = null;                   // P's x while engaged and not yet dragged: it stops sliding so it can be grabbed
  },
  getView() {
    const v = {};
    for (const k of ['P', 'Q']) if (this.pts[k]) v[k] = this.pts[k].slice();   // exact: the view must redraw the same frame
    return v.P || v.Q ? v : null;
  },
  setView(v) { this.pts = { P: parsePt(v && v.P), Q: parsePt(v && v.Q) }; },

  draw({ ctx, t, box: B, theme: P, params, events, engaged }) {
    const b = params.b / 100, rhs = x => x * x * x + A * x + b, fs = fsFor(B), rs = roots(b), r0 = rs[rs.length - 1];
    const xm = 0.3, k = Math.min(B.w / 5.8, B.h / 9), ox = B.x + B.w / 2, oy = B.y + B.h / 2;
    const px = x => ox + (x - xm) * k, py = y => oy - y * k;
    const toWorld = (sx, sy) => [xm + (sx - ox) / k, (oy - sy) / k];
    const xl = xm - B.w / 2 / k, xr = xm + B.w / 2 / k, yt = B.h / 2 / k;

    // the default positions: P slides with t on the unbounded branch, Q sits below it
    const slide = tt => r0 + 0.04 + 1.9 * (1 - Math.cos(tt * 0.45)) / 2;
    const def = { P: [slide(t), 1], Q: [r0 + 0.85, -1] };
    const cur = id => this.pts[id] || (id === 'P' && this.hold != null ? [snapX(this.hold, rs), 1] : def[id]);
    const put = (id, x, s) => { this.pts[id] = [snapX(x, rs), s]; };

    // input since the last frame: drags (Picker), and keys for the selected point
    for (const e of events) {
      if (e.type === 'engage') this.hold = slide(e.t); else if (e.type === 'release') this.hold = null;
      const hit = this.pick.handle(e, toWorld);
      if (hit && (hit.type === 'begin' || hit.type === 'move')) { this.sel = hit.id; put(hit.id, hit.pos[0], hit.pos[1] >= 0 ? 1 : -1); }
      if (e.type === 'keydown') {
        const key = e.key.toLowerCase(), c = cur(this.sel), step = e.shift ? 0.01 : 0.05;
        if (key === 'p' || key === 'q') this.sel = key.toUpperCase();
        else if (key === 'arrowleft' || key === 'arrowright') put(this.sel, c[0] + (key === 'arrowleft' ? -step : step), c[1]);
        else if (key === 'arrowup' || key === 'arrowdown') put(this.sel, c[0], key === 'arrowup' ? 1 : -1);
        else if (key === '0' || key === 'backspace') this.pts = { P: null, Q: null };
      }
    }
    for (const id of ['P', 'Q']) if (this.pts[id]) this.pts[id][0] = snapX(this.pts[id][0], rs); // b may have changed

    const d = ctx.getTransform().a;
    ctx.fillStyle = P.bg; ctx.fillRect(0, 0, ctx.canvas.width / d, ctx.canvas.height / d);
    clipBox(ctx, B);
    ctx.strokeStyle = rgba(P.fg, 0.1); ctx.lineWidth = 1; ctx.beginPath();
    for (let g = Math.ceil(xl); g <= xr; g++) { ctx.moveTo(px(g), B.y); ctx.lineTo(px(g), B.y + B.h); }
    for (let g = Math.ceil(-yt); g <= yt; g++) { ctx.moveTo(B.x, py(g)); ctx.lineTo(B.x + B.w, py(g)); }
    ctx.stroke();
    ctx.strokeStyle = rgba(P.fg, 0.38); ctx.beginPath();
    ctx.moveTo(B.x, py(0)); ctx.lineTo(B.x + B.w, py(0)); ctx.moveTo(px(0), B.y); ctx.lineTo(px(0), B.y + B.h); ctx.stroke();
    const root = (lo, hi) => { for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if ((rhs(lo) < 0) === (rhs(mid) < 0)) lo = mid; else hi = mid; } return (lo + hi) / 2; };
    const segs = []; let run = null; const dx = (xr - xl) / 900;
    for (let x = xl; x <= xr + dx; x += dx) {
      const v = rhs(x);
      if (v >= 0) { if (!run) { run = []; if (x > xl) run.push([root(x - dx, x), 0]); segs.push(run); } run.push([x, Math.sqrt(v)]); }
      else if (run) { run.push([root(x - dx, x), 0]); run = null; }
    }
    ctx.strokeStyle = P.fg; ctx.lineWidth = P.lw * 1.6; ctx.lineJoin = 'round';
    for (const s of segs) for (const sg of [1, -1]) {
      ctx.beginPath(); s.forEach(([x, y], i) => i ? ctx.lineTo(px(x), py(sg * y)) : ctx.moveTo(px(x), py(sg * y))); ctx.stroke();
    }

    const [xP, yP] = pointOf(...cur('P'), b), [xQ, yQ] = pointOf(...cur('Q'), b);
    const dot = (x, y, r, fill, stroke) => { ctx.beginPath(); ctx.arc(px(x), py(y), r, 0, Math.PI * 2); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); } };
    // the chord through P and Q, or the tangent at P when they coincide
    let m = null, sumTxt = 'P + Q = 𝒪';
    if (Math.abs(xP - xQ) > 1e-4) m = (yQ - yP) / (xQ - xP);
    else if (Math.abs(yP - yQ) < 1e-6 && Math.abs(yP) > 1e-6) m = (3 * xP * xP + A) / (2 * yP);
    if (m !== null) {
      const x3 = m * m - xP - xQ, y3 = yP + m * (x3 - xP);
      ctx.strokeStyle = rgba(P.fg, 0.55); ctx.lineWidth = P.lw; ctx.beginPath();
      ctx.moveTo(px(xl), py(yP + m * (xl - xP))); ctx.lineTo(px(xr), py(yP + m * (xr - xP))); ctx.stroke();
      ctx.setLineDash([5, 5]); ctx.strokeStyle = P.a2; ctx.lineWidth = P.lw * 1.2;
      ctx.beginPath(); ctx.moveTo(px(x3), py(y3)); ctx.lineTo(px(x3), py(-y3)); ctx.stroke(); ctx.setLineDash([]);
      dot(x3, y3, 5, P.bg, P.fg); dot(x3, -y3, 7, P.a2);
      label(ctx, P, 'P∗Q', px(x3) + 10, py(y3) + (y3 > 0 ? -8 : 16), { size: fs, weight: 700 });
      label(ctx, P, 'P + Q', px(x3) + 12, py(-y3) + (y3 > 0 ? 18 : -10), { size: fs + 1, weight: 700, color: P.a2 });
      sumTxt = Math.abs(m) > 9 ? 'P + Q → 𝒪, the point at infinity' : `${Math.abs(xP - xQ) > 1e-4 ? 'P + Q' : '2P'} = (${x3.toFixed(2)}, ${(-y3).toFixed(2)})`;
    }
    // P and Q, with a ring on the one under the pointer (or being dragged), and on the keyboard's point while engaged
    const ring = this.pick.active || this.pick.hover || (engaged ? this.sel : null);
    for (const [id, x, y] of [['P', xP, yP], ['Q', xQ, yQ]]) {
      if (ring === id) dot(x, y, 11, null, rgba(P.a1, 0.55));
      dot(x, y, 6, P.a1);
    }
    label(ctx, P, 'P', px(xP) - 6, py(yP) - 12, { size: fs + 1, weight: 700, color: P.a1, align: 'right' });
    label(ctx, P, 'Q', px(xQ) + 10, py(yQ) + 18, { size: fs + 1, weight: 700, color: P.a1 });
    ctx.restore();
    // hit targets for the next frame's events, in CSS px
    this.pick.clear().add('P', px(xP), py(yP), 16).add('Q', px(xQ), py(yQ), 16);

    const disc = 27 * b * b - 4;
    label(ctx, P, `y² = x³ − x + ${b.toFixed(2)}`, B.x, B.y + fs, { size: fs + 1, weight: 700 });
    label(ctx, P, `Δ = ${(-16 * disc).toFixed(1)}  ·  ${disc > 0 ? 'one real component' : disc < 0 ? 'two real components' : 'singular'}`, B.x, B.y + fs * 2.3, { size: fs, alpha: 0.75 });
    label(ctx, P, sumTxt, B.x, B.y + B.h - 6, { size: fs, color: P.a2, weight: 700 });
    return { cursor: this.pick.cursor() || 'default' };
  },
};

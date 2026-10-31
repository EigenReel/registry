// github.com/loci-viz/hopf-fibers/src/mobile.js · MIT License
// The mobile target: render "canvas2d", no GPU. The same fibers, rotation and camera tilt as the three.js version,
// drawn in software: each fiber is 64 points in R³, cut into short arcs that are depth-sorted and stroked back to
// front, each over a background-colored halo so that a nearer circle visibly passes over a farther one.
// pointer: "orbit". Once tapped, one finger orbits (the kit's OrbitCamera, used for its rotation only: the
// projection stays orthographic), two fingers pinch to zoom, and a tap on a circle selects it, as on desktop.
import { hex, mix, fsFor, label, clipBox, OrbitCamera, Picker } from '@loci/kit';

const SEG = 64, CHUNK = 8, CYCLE = 40, TILT = 0.42;
const r4 = x => Math.round(x * 1e4) / 1e4;
const spin = t => [0.25 * Math.sin((2 * Math.PI * t) / CYCLE), (2 * Math.PI * t) / CYCLE];   // [about x, about y]

/* The fiber over the point of S² at latitude lat and longitude lon, as in the desktop version:
   (z1, z2) = (cos(ψ/2) e^{iα}, sin(ψ/2) e^{i(α − lon)}), ψ = π/2 − lat, stereographically projected from (0, 0, 0, 1).
   Axes: x1 → X, x3 → Y (up), x2 → Z. Returns a flat [x, y, z, x, y, z, …] array of SEG points. */
function fiber(lat, lon) {
  const psi = Math.PI / 2 - lat, a = Math.cos(psi / 2), b = Math.sin(psi / 2), pts = new Float64Array(SEG * 3);
  for (let i = 0; i < SEG; i++) {
    const al = (2 * Math.PI * i) / SEG;
    const x1 = a * Math.cos(al), x2 = a * Math.sin(al), x3 = b * Math.cos(al - lon), x4 = b * Math.sin(al - lon);
    const k = 1 / (1 - x4);
    pts[3 * i] = x1 * k; pts[3 * i + 1] = x3 * k; pts[3 * i + 2] = x2 * k;
  }
  return pts;
}

function build(params, theme) {
  const n = params.count, fibers = [];
  const rings = [{ lat: params.lat, c0: theme.a1, c1: theme.a2 }];
  if (params.second) rings.push({ lat: Math.min(85, params.lat + 35), c0: theme.fg, c1: theme.a2 });
  let R = 0;
  for (const ring of rings) for (let j = 0; j < n; j++) {
    const lon = (2 * Math.PI * j) / n, pts = fiber((ring.lat * Math.PI) / 180, lon);
    for (let i = 0; i < SEG; i++) R = Math.max(R, Math.hypot(pts[3 * i], pts[3 * i + 1], pts[3 * i + 2]));
    fibers.push({ pts, col: mix(hex(ring.c0), hex(ring.c1), 0.5 - 0.5 * Math.cos(lon)), lat: ring.lat, lon: (360 * j) / n });   // color by longitude, as on desktop
  }
  return { fibers, R: Math.min(R, 12) };
}
/* distance in px from (x, y) to fiber f's projected polyline */
function fiberDist(xy, f, x, y) {
  let best = Infinity;
  for (let i = 0; i < SEG; i++) {
    const a = f * SEG + i, b = f * SEG + ((i + 1) % SEG), ax = xy[2 * a], ay = xy[2 * a + 1], dx = xy[2 * b] - ax, dy = xy[2 * b + 1] - ay;
    const L = dx * dx + dy * dy, u = L ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / L)) : 0;
    best = Math.min(best, Math.hypot(x - ax - u * dx, y - ay - u * dy));
  }
  return best;
}

export default {
  setup() {
    this.orbit = new OrbitCamera({ yaw: 0, pitch: TILT, dist: 1, minDist: 0.3, maxDist: 4 });
    this.pick = new Picker();
    this.g = null; this.sel = null;
  },
  getView() {
    if (this.orbit.isHome() && !this.g && this.sel == null) return null;
    return { cam: this.orbit.getState(), g: this.g, sel: this.sel };
  },
  setView(v) {
    this.orbit.setState(v && v.cam);
    this.g = v && Array.isArray(v.g) && v.g.length === 2 && v.g.every(Number.isFinite) ? v.g.slice() : null;
    this.sel = v && Number.isInteger(v.sel) && v.sel >= 0 ? v.sel : null;
  },

  draw({ ctx, t, box, theme, params, state, events, engaged }) {
    const key = JSON.stringify([params.lat, params.count, params.second, theme.fg, theme.a1, theme.a2]);
    if (state.key !== key) { state.key = key; Object.assign(state, build(params, theme)); state.xy = null; }
    const { fibers, R } = state, nf = fibers.length, nc = SEG / CHUNK, O = this.orbit;
    if (this.sel != null && this.sel >= nf) this.sel = null;
    if (!state.xy) { state.xy = new Float64Array(nf * SEG * 2); state.z = new Float64Array(nf * SEG); state.order = new Array(nf * nc); }
    // orthographic: the shorter side of the box spans the fibers' radius with the desktop's 12% margin, divided by the zoom
    const sc0 = Math.min(box.w, box.h) / 2 / (R * 1.12);
    O.pxScale = 1 / sc0;   // pan: one CSS px is 1/scale world units at zoom 1

    for (const e of events) {
      const was = [O.yaw, O.pitch, ...O.target].join();
      O.handle(e);
      if (!this.g && was !== [O.yaw, O.pitch, ...O.target].join()) this.g = spin(t).map(r4);   // hold the scene still
      if (e.type === 'click') this.sel = this.pick.pick(e.x, e.y);
      if (e.type === 'keydown' && e.key === '0') { this.g = null; this.sel = null; }
    }

    // the desktop group rotation (three.js Euler XYZ: first about y, then about x), then the orbit camera's rotation
    const [rx, ry] = this.g || spin(t), V = O.view(), [Rt, Up, Bk] = V.rot, T = V.target;
    const cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx);
    const sc = sc0 / O.dist, ox = box.x + box.w / 2, oy = box.y + box.h / 2;
    const xy = state.xy, zz = state.z;
    let zmin = Infinity, zmax = -Infinity;
    for (let f = 0; f < nf; f++) {
      const p = fibers[f].pts;
      for (let i = 0; i < SEG; i++) {
        const X = p[3 * i], Y = p[3 * i + 1], Z = p[3 * i + 2];
        const x1 = X * cy + Z * sy, z1 = -X * sy + Z * cy;          // about y
        const y2 = Y * cx - z1 * sx, z2 = Y * sx + z1 * cx;         // about x
        const qx = x1 - T[0], qy = y2 - T[1], qz = z2 - T[2], o = f * SEG + i;
        xy[2 * o] = ox + sc * (qx * Rt[0] + qy * Rt[1] + qz * Rt[2]); xy[2 * o + 1] = oy - sc * (qx * Up[0] + qy * Up[1] + qz * Up[2]);
        const d = qx * Bk[0] + qy * Bk[1] + qz * Bk[2]; zz[o] = d;     // toward the camera
        if (d < zmin) zmin = d; if (d > zmax) zmax = d;
      }
    }
    // arcs of CHUNK segments, sorted back to front by mean depth
    const order = state.order;
    for (let f = 0, k = 0; f < nf; f++) for (let c = 0; c < nc; c++, k++) {
      let s = 0; for (let i = 0; i <= CHUNK; i++) s += zz[f * SEG + ((c * CHUNK + i) % SEG)];
      order[k] = { f, c, d: s / (CHUNK + 1) };
    }
    order.sort((a, b) => a.d - b.d);
    clipBox(ctx, box);
    ctx.lineJoin = 'round';
    const lw = theme.lw * 2 * Math.max(0.8, Math.min(2, Math.min(box.w, box.h) / 400)), bg = hex(theme.bg), span = Math.max(1e-6, zmax - zmin);
    for (const { f, c, d } of order) {
      ctx.beginPath();
      for (let i = 0; i <= CHUNK; i++) { const o = f * SEG + ((c * CHUNK + i) % SEG); i ? ctx.lineTo(xy[2 * o], xy[2 * o + 1]) : ctx.moveTo(xy[2 * o], xy[2 * o + 1]); }
      const on = this.sel === f, dim = this.sel != null && !on;
      ctx.lineCap = 'butt'; ctx.strokeStyle = theme.bg; ctx.lineWidth = (on ? lw * 1.8 : lw) + 3; ctx.stroke();   // the halo: nearer arcs cut farther ones (butt: never its own neighbours)
      const near = (d - zmin) / span, col = mix(bg, fibers[f].col, (0.45 + 0.55 * near) * (dim ? 0.35 : 1)); // farther arcs fade toward the background
      ctx.lineCap = 'round'; ctx.strokeStyle = `rgb(${col[0] | 0},${col[1] | 0},${col[2] | 0})`; ctx.lineWidth = on ? lw * 1.8 : lw; ctx.stroke();
    }
    // hit targets for the next events: the projected fibers
    this.pick.clear();
    for (let f = 0; f < nf; f++) this.pick.addHit(f, (x, y) => fiberDist(xy, f, x, y), 14);

    const fs = fsFor(box), n = params.count * (params.second ? 2 : 1);   // labels inside the same clip
    label(ctx, theme, 'Hopf fibration, stereographically projected', box.x, box.y + fs, { size: fs + 1, weight: 700 });
    label(ctx, theme, `${n} fibers over latitude ${params.lat}°${params.second ? ` and ${Math.min(85, params.lat + 35)}°` : ''}`, box.x, box.y + fs * 2.3, { size: fs, alpha: 0.8 });
    const F = this.sel != null && fibers[this.sel];
    if (F) {
      let top = 0; for (let i = 1; i < SEG; i++) if (xy[2 * (this.sel * SEG + i) + 1] < xy[2 * (this.sel * SEG + top) + 1]) top = i;
      const o = this.sel * SEG + top, la = (F.lat * Math.PI) / 180, lo = (F.lon * Math.PI) / 180;
      const P = [Math.cos(la) * Math.cos(lo), Math.cos(la) * Math.sin(lo), Math.sin(la)];
      const lx = Math.max(box.x + 4, Math.min(box.x + box.w - 4, xy[2 * o])), ly = Math.max(box.y + fs * 3.6, xy[2 * o + 1] - 10);
      label(ctx, theme, `the fiber over (${F.lat}°, ${+F.lon.toFixed(1)}°)`, lx, ly - fs * 1.2, { size: fs, weight: 700, color: theme.a2, align: 'center' });
      label(ctx, theme, `base point (${P.map(c => c.toFixed(2)).join(', ')}) on S²`, lx, ly, { size: fs, align: 'center' });
    }
    label(ctx, theme, F ? 'it links every other circle exactly once' : engaged ? 'tap a circle to see the point of S² it lies over' : 'every two circles link exactly once', box.x, box.y + box.h - 6, { size: fs, weight: 700, color: theme.a1 });
    ctx.restore();
    return { cursor: O.drag ? 'grabbing' : 'grab' };
  },
};

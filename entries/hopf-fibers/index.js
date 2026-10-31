// github.com/loci-viz/hopf-fibers/src/index.js · MIT License
// render: "webgl2", drawn with three.js from the host's pinned '@loci/three'.
// pointer: "orbit". Once engaged, the kit's OrbitCamera drives the three.js camera (drag to orbit, right-drag to pan,
// scroll or pinch to zoom, arrow keys, 0 to reset), and a click on a circle selects it and labels its base point on S².
import * as THREE from '@loci/three';
import { fsFor, OrbitCamera, Picker } from '@loci/kit';

const SEG = 160, CYCLE = 40, TILT = 0.42, PICK_STEP = 4;
const r4 = x => Math.round(x * 1e4) / 1e4;
/* the slow turn of the whole group when nobody is steering: [about x, about y] */
const spin = t => [0.25 * Math.sin((2 * Math.PI * t) / CYCLE), (2 * Math.PI * t) / CYCLE];

/* The fiber of the Hopf map over the point of S² at latitude lat and longitude lon, as points of R³:
   (z1, z2) = (cos(ψ/2) e^{iα}, sin(ψ/2) e^{i(α − lon)}) with ψ = π/2 − lat, then stereographic projection
   of S³ from (0, 0, 0, 1). Axes: x1 → X, x3 → Y (up), x2 → Z, so the fiber over the north pole is the
   horizontal unit circle and the fiber over the south pole is the vertical axis. */
function fiber(lat, lon) {
  const psi = Math.PI / 2 - lat, a = Math.cos(psi / 2), b = Math.sin(psi / 2), pts = [];
  for (let i = 0; i < SEG; i++) {
    const al = (2 * Math.PI * i) / SEG;
    const x1 = a * Math.cos(al), x2 = a * Math.sin(al), x3 = b * Math.cos(al - lon), x4 = b * Math.sin(al - lon);
    const k = 1 / (1 - x4);
    pts.push(new THREE.Vector3(x1 * k, x3 * k, x2 * k));
  }
  return pts;
}
/* distance in px from (x, y) to a closed polyline stored as [x0, y0, x1, y1, …] */
function polyDist(xy, x, y) {
  let best = Infinity;
  for (let i = 0, n = xy.length / 2; i < n; i++) {
    const ax = xy[2 * i], ay = xy[2 * i + 1], j = (i + 1) % n, bx = xy[2 * j], by = xy[2 * j + 1];
    const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy, u = L ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / L)) : 0;
    best = Math.min(best, Math.hypot(x - ax - u * dx, y - ay - u * dy));
  }
  return best;
}

export default {
  setup({ gl, canvas }) {
    // The host owns the canvas size: never call setSize or setPixelRatio (the pixel ratio stays 1, so the
    // viewport below is in device pixels). The host also clears the canvas, so three.js must not.
    const renderer = new THREE.WebGLRenderer({ canvas, context: gl, antialias: true });
    renderer.autoClear = false;
    const scene = new THREE.Scene(), group = new THREE.Group();
    scene.add(group);
    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const sun = new THREE.DirectionalLight(0xffffff, 2.2); sun.position.set(3, 5, 4); scene.add(sun);
    const camera = new THREE.PerspectiveCamera(35, 1, 0.05, 400);
    this.three = { renderer, scene, group, camera, key: '', R: 1, fibers: [], look: '' };
    // dist is in units of the distance that fits the whole picture in the box
    this.orbit = new OrbitCamera({ yaw: 0, pitch: TILT, dist: 1, minDist: 0.3, maxDist: 4 });
    this.pick = new Picker();
    this.g = null;      // the group's turn, frozen the first time the viewer orbits or pans (so the scene holds still)
    this.sel = null;    // the selected fiber's index
    this.hover = null;
  },

  // the view a share link keeps: camera, frozen turn, selection (null while all three are the defaults)
  getView() {
    if (this.orbit.isHome() && !this.g && this.sel == null) return null;
    return { cam: this.orbit.getState(), g: this.g, sel: this.sel };
  },
  setView(v) {
    this.orbit.setState(v && v.cam);
    this.g = v && Array.isArray(v.g) && v.g.length === 2 && v.g.every(Number.isFinite) ? v.g.slice() : null;
    this.sel = v && Number.isInteger(v.sel) && v.sel >= 0 ? v.sel : null;
  },

  rebuild(params, theme) {
    const S = this.three, lat = (params.lat * Math.PI) / 180, n = params.count;
    for (const m of S.group.children) { m.geometry.dispose(); m.material.dispose(); }
    S.group.clear(); S.fibers = [];
    const rings = [{ lat: params.lat, c0: theme.a1, c1: theme.a2 }];
    if (params.second) rings.push({ lat: Math.min(85, params.lat + 35), c0: theme.fg, c1: theme.a2 });
    let R = 0;
    for (const ring of rings) for (let j = 0; j < n; j++) {
      const lon = (2 * Math.PI * j) / n, pts = fiber((ring.lat * Math.PI) / 180, lon);
      for (const p of pts) R = Math.max(R, p.length());
      const col = new THREE.Color(ring.c0).lerp(new THREE.Color(ring.c1), 0.5 - 0.5 * Math.cos(lon));
      S.fibers.push({ pts, col, lat: ring.lat, lon: (360 * j) / n, xy: new Float32Array((2 * SEG) / PICK_STEP) });
    }
    R = Math.min(R, 12);
    for (const f of S.fibers) {
      const tube = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(f.pts, true), SEG, 0.022 * R, 8, true);
      S.group.add(new THREE.Mesh(tube, new THREE.MeshLambertMaterial({ color: f.col })));
    }
    S.R = R; S.look = '';
    if (this.sel != null && this.sel >= S.fibers.length) this.sel = null;
  },

  /* the selected fiber stands out: full color plus a glow; the others fade toward the background */
  restyle(theme) {
    const S = this.three, look = JSON.stringify([this.sel, theme.bg]);
    if (look === S.look) return; S.look = look;
    const bg = new THREE.Color(theme.bg);
    S.group.children.forEach((m, i) => {
      const f = S.fibers[i], on = this.sel === i;
      m.material.color.copy(f.col); if (this.sel != null && !on) m.material.color.lerp(bg, 0.7);
      m.material.emissive.copy(on ? f.col : new THREE.Color(0)).multiplyScalar(on ? 0.55 : 0);
    });
  },

  draw({ t, box, viewport, theme, params, events, engaged }) {
    const S = this.three, r = S.renderer, cam = S.camera, O = this.orbit;
    const key = JSON.stringify([params.lat, params.count, params.second, theme.fg, theme.a1, theme.a2]);
    if (key !== S.key) { this.rebuild(params, theme); S.key = key; }
    const aspect = box.w / box.h, half = (cam.fov * Math.PI) / 360;
    const fit = S.R / Math.tan(Math.min(half, Math.atan(Math.tan(half) * aspect))) * 1.12;
    O.unit = fit; O.pxScale = (2 * Math.tan(half)) / box.h;   // pan: one CSS px is this much of the view at distance 1

    // input since the last frame
    let hoverAt = null;
    for (const e of events) {
      const was = [O.yaw, O.pitch, ...O.target].join();
      O.handle(e);
      if (!this.g && was !== [O.yaw, O.pitch, ...O.target].join()) this.g = spin(t).map(r4);  // hold the scene still from here on
      if (e.type === 'click') this.sel = this.pick.pick(e.x, e.y);
      if (e.type === 'keydown' && e.key === '0') { this.g = null; this.sel = null; }
      if (e.type === 'pointermove' && !e.buttons) hoverAt = e;
    }
    if (hoverAt) this.hover = this.pick.pick(hoverAt.x, hoverAt.y);
    this.restyle(theme);

    // The host set viewport, scissor and clear color behind three.js's back: resync its state cache first.
    r.resetState();
    r.setViewport(...viewport); r.setScissor(...viewport); r.setScissorTest(true);
    const [rx, ry] = this.g || spin(t);
    S.group.rotation.set(rx, ry, 0);
    cam.aspect = aspect; O.applyTo(cam);
    cam.near = fit * 0.02; cam.far = fit * (O.dist + 3); cam.updateProjectionMatrix();
    r.render(S.scene, cam);

    // screen-space hit targets for the next events: every fourth point of each fiber, projected
    S.group.updateMatrixWorld(); cam.updateMatrixWorld();
    const v = new THREE.Vector3(); this.pick.clear();
    S.fibers.forEach((f, i) => {
      for (let k = 0; k < SEG / PICK_STEP; k++) {
        v.copy(f.pts[k * PICK_STEP]).applyMatrix4(S.group.matrixWorld).project(cam);
        f.xy[2 * k] = box.x + ((v.x + 1) / 2) * box.w; f.xy[2 * k + 1] = box.y + ((1 - v.y) / 2) * box.h;
      }
      this.pick.addHit(i, (x, y) => polyDist(f.xy, x, y), 9);
    });

    const fs = fsFor(box), n = params.count * (params.second ? 2 : 1);
    const labels = [
      { text: 'Hopf fibration, stereographically projected', x: box.x, y: box.y + fs, size: fs + 1, weight: 700 },
      { text: `${n} fibers over latitude ${params.lat}°${params.second ? ` and ${Math.min(85, params.lat + 35)}°` : ''}`, x: box.x, y: box.y + fs * 2.3, size: fs, alpha: 0.8 },
    ];
    const f = this.sel != null && S.fibers[this.sel];
    if (f) {
      // the label sits above the top of the selected circle on screen
      let top = 0; for (let k = 1; k < f.xy.length / 2; k++) if (f.xy[2 * k + 1] < f.xy[2 * top + 1]) top = k;
      const la = (f.lat * Math.PI) / 180, lo = (f.lon * Math.PI) / 180, P = [Math.cos(la) * Math.cos(lo), Math.cos(la) * Math.sin(lo), Math.sin(la)];
      const lx = Math.max(box.x + 4, Math.min(box.x + box.w - 4, f.xy[2 * top])), ly = Math.max(box.y + fs * 3.6, f.xy[2 * top + 1] - 10);
      labels.push({ text: `the fiber over (${f.lat}°, ${+f.lon.toFixed(1)}°)`, x: lx, y: ly - fs * 1.2, size: fs, weight: 700, color: 'a2', align: 'center' });
      labels.push({ text: `base point (${P.map(c => c.toFixed(2)).join(', ')}) on S²`, x: lx, y: ly, size: fs, align: 'center' });
    }
    labels.push({ text: f ? 'it links every other circle exactly once' : engaged ? 'click a circle to see the point of S² it lies over' : 'every two circles link exactly once', x: box.x, y: box.y + box.h - 6, size: fs, weight: 700, color: 'a1' });
    return { labels, cursor: O.drag ? 'grabbing' : this.hover != null ? 'pointer' : 'grab' };
  },

  dispose() {
    const S = this.three; if (!S) return;
    for (const m of S.group.children) { m.geometry.dispose(); m.material.dispose(); }
    S.renderer.dispose();
  },
};

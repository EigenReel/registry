const COLORS = {
  main: '#f0abfc',
  secondary: '#4ade80',
  bg: '#050508',
  fg: '#ecebf5',
};

import * as THREE from '@eigenreel/three';
import { fsFor, label, hex } from '@eigenreel/kit';

const SEG = 160, CYCLE = 40, PICK_STEP = 4, FOV = 35;

/* the slow turn of the whole group, a function of t: [about x, about y], once around per 40-second loop */
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

/* The base point at latitude lat and longitude lon (radians) on the globe in the corner: (cos lat cos lon,
   cos lat sin lon, sin lat) in S², turned half a turn about the X axis, so the north pole points down. The reason:
   the circle over longitude lon reaches farthest from the origin in the horizontal direction (cos φ, 0, −sin φ) with
   φ = −lon − π/2 (where α = lon + π/2 in fiber()). Upside down, the globe's dot over lon is at φ = −lon; with
   globe.rotation.y = −π/2 plus the picture's own turn, every dot sits on the same side as its circle. */
const onGlobe = (lat, lon, r = 1) => new THREE.Vector3(r * Math.cos(lat) * Math.cos(lon), -r * Math.sin(lat), r * Math.cos(lat) * Math.sin(lon));

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

/* the second ring's latitude */
const second = lat => Math.min(85, lat + 35);

/* empties a group, freeing its meshes' GPU buffers (all but `keep`, a geometry they share) */
const dispose = (g, keep) => { for (const m of g.children) { if (m.geometry !== keep) m.geometry.dispose(); m.material.dispose(); } g.clear(); };

/* a closed circle of latitude on the globe, as line segments */
function latCircle(pts, lat, r = 1) {
  for (let i = 0; i < 96; i++) pts.push(onGlobe(lat, (2 * Math.PI * i) / 96, r), onGlobe(lat, (2 * Math.PI * (i + 1)) / 96, r));
}

function rebuild(S, params, C) {
  dispose(S.group); dispose(S.dots, S.dotGeo); dispose(S.rings);
  S.fibers = [];
  const rings = [{ lat: params.lat, c0: C.main, c1: C.secondary }];
  if (params.second) rings.push({ lat: second(params.lat), c0: C.fg, c1: C.secondary });
  let R = 0;
  for (const ring of rings) for (let j = 0; j < params.count; j++) {
    const lon = (2 * Math.PI * j) / params.count, pts = fiber((ring.lat * Math.PI) / 180, lon);
    for (const p of pts) R = Math.max(R, p.length());
    const col = new THREE.Color(ring.c0).lerp(new THREE.Color(ring.c1), 0.5 - 0.5 * Math.cos(lon));   // color by longitude
    S.fibers.push({ pts, col, lat: ring.lat, lon: (360 * j) / params.count, xy: new Float32Array((2 * SEG) / PICK_STEP) });
  }
  R = Math.min(R, 12);
  for (const f of S.fibers) {
    const tube = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(f.pts, true), SEG, 0.022 * R, 12, true);
    S.group.add(new THREE.Mesh(tube, new THREE.MeshStandardMaterial({ color: f.col, roughness: 0.36, metalness: 0.05, emissive: f.col.clone(), emissiveIntensity: 0.08 })));
    // its base point on the globe, in the same color
    const dot = new THREE.Mesh(S.dotGeo, new THREE.MeshBasicMaterial({ color: f.col }));
    dot.position.copy(onGlobe((f.lat * Math.PI) / 180, (f.lon * Math.PI) / 180, 1.0));
    S.dots.add(dot);
  }
  // the circles of latitude the base points lie on
  const pts = [];
  for (const ring of rings) latCircle(pts, (ring.lat * Math.PI) / 180, 1.002);
  S.rings.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: C.fg, transparent: true, opacity: 0.45 })));
  S.R = R;
}

/* the highlighted fiber stands out with a glow; the others fade toward the background, on the globe as well */
function restyle(S, sel, C) {
  const bg = new THREE.Color(C.bg);
  S.group.children.forEach((m, i) => {
    const f = S.fibers[i], on = sel === i, dot = S.dots.children[i];
    m.material.color.copy(f.col);
    dot.material.color.copy(f.col);
    if (sel != null && !on) { m.material.color.lerp(bg, 0.7); dot.material.color.lerp(bg, 0.6); }
    m.material.emissive.copy(f.col);
    m.material.emissiveIntensity = on ? 0.55 : sel != null ? 0 : 0.08;
    dot.scale.setScalar(on ? 2 : 1);
  });
}

/* the backdrop: a soft glow in the middle of the box, drawn first with no depth */
const BACK_VERT = `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;
const BACK_FRAG = `precision highp float;
varying vec2 vUv;
uniform vec3 u_bg, u_a, u_b;
uniform float u_aspect;
void main() {
  vec2 q = (vUv - 0.5) * vec2(u_aspect, 1.0);
  float r = length(q);
  vec3 c = u_bg + (u_a - u_bg) * 0.05 * exp(-4.0 * r * r) + (u_b - u_bg) * 0.012 * exp(-1.5 * r * r);
  gl_FragColor = vec4(c, 1.0);
}`;

export default {
  title: 'The Hopf fibration: linked circles filling space',
  hook: 'Every point of the 2-sphere lifts to a circle in the 3-sphere, and every two of those circles are linked.',
  alt: 'Glossy colored tubes, each a closed circle, wrap around a doughnut shape so that every circle threads through all the others, and the arrangement turns slowly. A small globe in the corner shows the matching points on the sphere.',
  tags: ['Topology', 'Geometry', 'GPU'],
  license: 'MIT',
  author: { name: 'villarceau' },

  modes: { desktop: true, phone: false },
  time: { length: 40, loop: true },
  context: 'webgl2',
  libraries: [],

  params: [
    { key: 'lat', type: 'range', label: 'Latitude on S²', min: -40, max: 80, step: 1, default: 0, format: '{}°' },
    { key: 'count', type: 'range', label: 'Fibers', min: 8, max: 64, step: 1, default: 24 },
    { key: 'second', type: 'toggle', label: 'Second ring, 35° north', default: false },
    { key: 'elev', type: 'range', label: 'Camera elevation', min: -30, max: 88, step: 1, default: 24, format: '{}°' },
    { key: 'highlight', type: 'range', label: 'Highlighted fiber (0 = none)', min: 0, max: 128, step: 1, default: 0 },
  ],
  presets: [
    { id: 'one-torus', label: 'One latitude = one torus', params: { lat: 0, count: 64, second: false } },
    { id: 'two-latitudes', label: 'Two latitudes link', params: { lat: 10, count: 16, second: true } },
    { id: 'near-pole', label: 'Near the pole', params: { lat: 75, count: 24, second: false } },
    { id: 'down-the-axis', label: 'Look down the axis', params: { lat: 0, count: 24, second: false, elev: 86, highlight: 1 }, t: 0 },
    { id: 'turning', label: 'Back to the turning view', params: { elev: 24, highlight: 0 } },
  ],

  interact: { hint: 'Drag up or down to tilt · click a circle' },

  // The scenes need no GL context, so setup builds them; the renderer is made on the first frame, when draw has the context.
  setup(env, S) {
    const C = env.colors, bg = new THREE.Color(C.bg);
    S.scene = new THREE.Scene(); S.group = new THREE.Group(); S.scene.add(S.group);
    S.scene.fog = new THREE.Fog(bg, 1, 2);   // depth cue: far parts of the tubes sink toward bg; near and far are set per frame
    S.scene.add(new THREE.HemisphereLight(new THREE.Color(C.fg), bg, 0.9));
    const sun = new THREE.DirectionalLight(0xffffff, 2.4); sun.position.set(3, 5, 4); S.scene.add(sun);
    const rim = new THREE.DirectionalLight(new THREE.Color(C.main), 1.4); rim.position.set(-4, 1.5, -5); S.scene.add(rim);
    S.camera = new THREE.PerspectiveCamera(FOV, 1, 0.05, 400);

    // the backdrop, a quad over the whole box
    const rgb = c => new THREE.Vector3(...hex(c).map(x => x / 255));   // sRGB, as the shader writes it
    S.back = new THREE.Scene();
    S.backMat = new THREE.ShaderMaterial({ vertexShader: BACK_VERT, fragmentShader: BACK_FRAG, depthTest: false, depthWrite: false,
      uniforms: { u_bg: { value: rgb(C.bg) }, u_a: { value: rgb(C.main) }, u_b: { value: rgb(C.secondary) }, u_aspect: { value: 1 } } });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), S.backMat); quad.frustumCulled = false; S.back.add(quad);

    // the globe in the corner: S², the base of the fibration, with a dot at the base point of every fiber drawn
    S.globeScene = new THREE.Scene(); S.globe = new THREE.Group(); S.globeScene.add(S.globe);
    S.globe.add(new THREE.Mesh(new THREE.SphereGeometry(0.985, 48, 24), new THREE.MeshBasicMaterial({ color: bg.clone().lerp(new THREE.Color(C.fg), 0.012) })));
    const grid = [];
    for (const d of [-60, -30, 0, 30, 60]) latCircle(grid, (d * Math.PI) / 180);
    for (let m = 0; m < 12; m++) for (let i = 0; i < 48; i++) {
      const lon = (m * Math.PI) / 6, a0 = -Math.PI / 2 + (Math.PI * i) / 48, a1 = -Math.PI / 2 + (Math.PI * (i + 1)) / 48;
      grid.push(onGlobe(a0, lon), onGlobe(a1, lon));
    }
    S.globe.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(grid), new THREE.LineBasicMaterial({ color: C.fg, transparent: true, opacity: 0.13 })));
    S.dots = new THREE.Group(); S.globe.add(S.dots);
    S.rings = new THREE.Group(); S.globe.add(S.rings);
    S.dotGeo = new THREE.SphereGeometry(0.065, 12, 8);
    S.globeCam = new THREE.PerspectiveCamera(28, 1, 0.1, 20);   // placed in draw, at the main camera's elevation
    // its outline, a circle that draw turns to face the camera
    const edge = [];
    for (let i = 0; i < 96; i++) edge.push(new THREE.Vector3(Math.cos((2 * Math.PI * i) / 96), Math.sin((2 * Math.PI * i) / 96), 0).multiplyScalar(1.03),
      new THREE.Vector3(Math.cos((2 * Math.PI * (i + 1)) / 96), Math.sin((2 * Math.PI * (i + 1)) / 96), 0).multiplyScalar(1.03));
    S.outline = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(edge), new THREE.LineBasicMaterial({ color: C.fg, transparent: true, opacity: 0.3 }));
    S.globeScene.add(S.outline);

    S.key = ''; S.look = ''; S.fibers = [];
  },

  draw(gl, t, params, env, S) {
    const C = env.colors, { w, h } = env.box;
    if (!S.renderer) {
      // The page owns the canvas size: never setSize or setPixelRatio (the pixel ratio stays 1, so the viewport is in
      // device px). The page also clears the canvas, so three.js must not.
      S.renderer = new THREE.WebGLRenderer({ canvas: gl.canvas, context: gl, antialias: true });
      S.renderer.autoClear = false;
    }
    const key = [params.lat, params.count, params.second].join();
    if (key !== S.key) { rebuild(S, params, C); S.key = key; S.look = ''; }
    const sel = params.highlight > 0 && params.highlight <= S.fibers.length ? params.highlight - 1 : null;
    const look = String(sel);
    if (look !== S.look) { restyle(S, sel, C); S.look = look; }

    // the box in device px (bottom-left origin), as the page set it; read before resetState, which resets GL state
    const vp = gl.getParameter(gl.VIEWPORT), r = S.renderer, cam = S.camera;
    r.resetState();
    r.setViewport(vp[0], vp[1], vp[2], vp[3]); r.setScissor(vp[0], vp[1], vp[2], vp[3]); r.setScissorTest(true);

    const aspect = w / h;
    S.backMat.uniforms.u_aspect.value = aspect;
    r.render(S.back, cam);

    // the camera, a function of params: on a sphere around the origin at elevation `elev`, far enough to fit the fibers
    const half = (FOV * Math.PI) / 360;
    const fit = (S.R / Math.tan(Math.min(half, Math.atan(Math.tan(half) * aspect)))) * 1.12;
    const el = (params.elev * Math.PI) / 180;
    cam.aspect = aspect; cam.near = fit * 0.02; cam.far = fit * 4;
    cam.position.set(0, fit * Math.sin(el), fit * Math.cos(el)); cam.up.set(0, 1, 0); cam.lookAt(0, 0, 0);
    cam.updateProjectionMatrix();
    S.scene.fog.near = fit - S.R * 0.4; S.scene.fog.far = fit + S.R * 1.9;
    const [rx, ry] = spin(t);
    S.group.rotation.set(rx, ry, 0);
    r.render(S.scene, cam);

    // the globe, in a square in the bottom-right corner: turned with the picture and seen from the same elevation, so
    // each dot is on the same side as its circle
    const side = Math.round(Math.min(vp[2], vp[3]) * 0.18), m = Math.round(Math.min(vp[2], vp[3]) * 0.03);
    const gd = 1.12 / Math.tan((14 * Math.PI) / 180);
    S.globeCam.position.set(0, gd * Math.sin(el), gd * Math.cos(el)); S.globeCam.up.set(0, 1, 0); S.globeCam.lookAt(0, 0, 0);
    S.outline.lookAt(S.globeCam.position);
    S.globe.rotation.set(rx, ry - Math.PI / 2, 0);
    r.setViewport(vp[0] + vp[2] - side - m, vp[1] + m, side, side); r.setScissor(vp[0] + vp[2] - side - m, vp[1] + m, side, side);
    r.clearDepth();
    r.render(S.globeScene, S.globeCam);
    r.setViewport(vp[0], vp[1], vp[2], vp[3]); r.setScissor(vp[0], vp[1], vp[2], vp[3]);

    // where every fiber is on screen, in CSS px from the box's top-left: for the label and for picking in interact mode
    S.group.updateMatrixWorld(); cam.updateMatrixWorld();
    const v = new THREE.Vector3();
    for (const f of S.fibers) for (let k = 0; k < SEG / PICK_STEP; k++) {
      v.copy(f.pts[k * PICK_STEP]).applyMatrix4(S.group.matrixWorld).project(cam);
      f.xy[2 * k] = ((v.x + 1) / 2) * w; f.xy[2 * k + 1] = ((1 - v.y) / 2) * h;
    }
    S.elev = params.elev;   // only for onMode's drag, which starts from the elevation the last frame drew

    // text only for a highlighted fiber: which point of S² it lies over
    const o = env.overlay, f = sel != null && S.fibers[sel];
    if (!o || !f) return;
    const fs = fsFor(env.box);
    // the label sits above the top of the highlighted circle on screen
    let top = 0;
    for (let k = 1; k < f.xy.length / 2; k++) if (f.xy[2 * k + 1] < f.xy[2 * top + 1]) top = k;
    const la = (f.lat * Math.PI) / 180, lo = (f.lon * Math.PI) / 180;
    const P = [Math.cos(la) * Math.cos(lo), Math.cos(la) * Math.sin(lo), Math.sin(la)];
    const lx = Math.max(110, Math.min(w - 110, f.xy[2 * top])), ly = Math.min(h - fs * 2.5, Math.max(fs * 2.6, f.xy[2 * top + 1] - 10));
    label(o, env, `the fiber over (${f.lat}°, ${+f.lon.toFixed(1)}°)`, lx, ly - fs * 1.2, { size: fs, weight: 700, color: C.secondary, align: 'center' });
    label(o, env, `base point (${P.map(c => c.toFixed(2)).join(', ')}) on S²`, lx, ly, { size: fs, align: 'center' });
    if (env.mode === 'interact') label(o, env, 'it links every other circle exactly once', 10, h - 10, { size: fs, weight: 700, color: C.main });
  },

  // Interact mode: a vertical drag tilts the camera (the `elev` param), a click on a circle highlights it (the
  // `highlight` param), a click on empty space clears it. Both go through env.setParam, so a share link keeps them.
  onMode(env, S) {
    if (env.mode !== 'interact' || !env.ui) return;
    let down = null;
    env.ui.addEventListener('pointerdown', e => { down = { x: e.x, y: e.y, elev: S.elev ?? 24, moved: false }; });
    env.ui.addEventListener('pointermove', e => {
      if (!down || !e.buttons) return;
      const dy = e.y - down.y;
      if (Math.abs(dy) > 3 || Math.abs(e.x - down.x) > 3) down.moved = true;
      if (down.moved) env.setParam('elev', Math.round(down.elev + dy * 0.4));
    });
    env.ui.addEventListener('pointerup', e => {
      const d = down; down = null;
      if (!d || d.moved || !S.fibers) return;
      let best = null, bestD = 9;
      S.fibers.forEach((f, i) => { const dist = polyDist(f.xy, e.x, e.y); if (dist < bestD) { bestD = dist; best = i; } });
      env.setParam('highlight', best == null ? 0 : best + 1);
    });
    env.ui.addEventListener('pointercancel', () => { down = null; });
  },
};

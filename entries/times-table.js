const COLORS = {
  main: '#ffc65c',
  secondary: '#ff6f8e',
  bg: '#0b1836',
  fg: '#e8eefc',
};

import { hex, mix, rgba } from '@eigenreel/kit';

const BATCHES = 36;   // chords are stroked in this many color batches, by where their starting point sits

function makeCanvas(w, h) {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h);
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; return cv;
}

const LOW = 4;        // the backdrop is drawn at 1/LOW of the CSS resolution and scaled up

/* The backdrop, drawn once per size and palette, small: the navy brightening a little toward the middle of
   the circle and darkening toward the corners, with a soft halo along the circle. It has no edges, so
   drawing it small and scaling it up loses nothing. */
function backdrop(bw, bh, C, cx, cy, R) {
  const cv = makeCanvas(bw, bh), c = cv.getContext('2d');
  c.setTransform(1 / LOW, 0, 0, 1 / LOW, 0, 0);
  const bg = hex(C.bg), lift = mix(bg, hex(C.fg), 0.07), deep = mix(bg, [0, 0, 0], 0.45);
  const g = c.createRadialGradient(cx, cy, 0, cx, cy, Math.hypot(cx, cy) * 1.2);
  g.addColorStop(0, `rgb(${lift.map(Math.round).join()})`);
  g.addColorStop(0.5, C.bg);
  g.addColorStop(1, `rgb(${deep.map(Math.round).join()})`);
  c.fillStyle = g; c.fillRect(0, 0, bw * LOW, bh * LOW);
  c.strokeStyle = rgba(C.fg, 0.06); c.lineWidth = 2.5 * LOW;
  c.beginPath(); c.arc(cx, cy, R, 0, 2 * Math.PI); c.stroke();
  return cv;
}

/* The circle and its n points, at device resolution, on a transparent canvas. */
function dial(w, h, dpr, C, n, pt, R) {
  const cv = makeCanvas(Math.max(1, Math.round(w * dpr)), Math.max(1, Math.round(h * dpr))), c = cv.getContext('2d');
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  const [cx, cy] = [w / 2, h / 2];
  c.strokeStyle = rgba(C.fg, 0.28); c.lineWidth = 1;
  c.beginPath(); c.arc(cx, cy, R, 0, 2 * Math.PI); c.stroke();
  const dr = Math.max(0.7, Math.min(2.2, 2.6 * R / n));
  c.fillStyle = rgba(C.fg, 0.5);
  c.beginPath();
  for (let i = 0; i < n; i++) { const [x, y] = pt(2 * Math.PI * i / n); c.moveTo(x + dr, y); c.arc(x, y, dr, 0, 2 * Math.PI); }
  c.fill();
  return cv;
}

/* One bead: a soft glow in main around a small bright core, drawn once and stamped at each cusp. */
function bead(rb, dpr, C) {
  const s = Math.ceil(rb * 8 * dpr), cv = makeCanvas(s, s), c = cv.getContext('2d'), m = s / 2;
  const gl = c.createRadialGradient(m, m, 0, m, m, m);
  gl.addColorStop(0, rgba(C.main, 0.55)); gl.addColorStop(1, rgba(C.main, 0));
  c.fillStyle = gl; c.fillRect(0, 0, s, s);
  c.fillStyle = C.fg; c.beginPath(); c.arc(m, m, rb * dpr, 0, 2 * Math.PI); c.fill();
  return cv;
}

export default {
  title: 'Multiplication tables on a circle',
  hook: 'Connect i to k·i mod n and a cardioid appears. Keep going and it grows cusps.',
  alt: 'On a deep navy background, a ring of evenly spaced points is joined by glowing gold and rose chords. As the multiplier slowly grows, the chords crowd into a bright heart-shaped curve, then a two-lobed one, then curves with more and more cusps, each cusp marked by a small bead on the ring.',
  tags: ['Number theory', 'Modular arithmetic', 'Geometry', 'Teaching'],
  license: 'MIT',
  author: { name: 'circle-mod-n' },

  modes: { desktop: true, phone: true },
  time: { length: 300, loop: true },
  context: '2d',
  libraries: [],

  params: [
    { key: 'n', type: 'range', label: 'Points on the circle', min: 20, max: 400, step: 1, default: 200 },
  ],
  presets: [
    { id: 'cardioid', label: 'k = 2, the cardioid', params: { n: 200 }, t: 0 },
    { id: 'nephroid', label: 'k = 3, the nephroid', params: { n: 200 }, t: 5 },
    { id: 'inverse-of-two', label: 'n = 101, k = 51', params: { n: 101 }, t: 245 },
    { id: 'thirty', label: 'n = 30, chords not a curve', params: { n: 30 }, t: 0 },
  ],

  draw(ctx, t, params, env, S) {
    const { w, h } = env.box, C = env.colors, dpr = env.dpr || 1;
    const n = params.n, phone = env.device === 'phone';
    // k sweeps from 2 to 62 over the 300-second loop, 0.2 per second
    const k = 2 + 0.2 * t;
    const cx = w / 2, cy = h / 2;
    const R = Math.max(10, Math.min(w, h) * 0.45);
    const pt = a => [cx + R * Math.cos(a - Math.PI / 2), cy + R * Math.sin(a - Math.PI / 2)];

    // the backdrop, rebuilt only when the box or the colors change
    const bw = Math.max(2, Math.ceil(w / LOW)), bh = Math.max(2, Math.ceil(h / LOW));
    const key = [w, h, C.bg, C.fg].join();
    if (S.bgKey !== key) { S.bgKey = key; S.bg = backdrop(bw, bh, C, cx, cy, R); }
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(S.bg, 0, 0, bw * LOW, bh * LOW);

    // The chords, in batches colored from secondary at the ends of the labelling to main in the middle. Each
    // chord's alpha shrinks as n grows, so the total light stays about the same; where many of them crowd
    // together, along the envelope, the picture glows.
    const c1 = hex(C.main), c2 = hex(C.secondary), alpha = Math.min(0.85, 0.6 * Math.sqrt(200 / n));
    ctx.lineCap = 'round';
    ctx.lineWidth = phone ? 0.75 : 0.95;
    for (let b = 0; b < BATCHES; b++) {
      const c = mix(c1, c2, Math.abs(b - (BATCHES - 1) / 2) / ((BATCHES - 1) / 2)).map(Math.round).join();
      ctx.strokeStyle = `rgba(${c},${alpha})`;
      ctx.beginPath();
      for (let i = Math.floor(b * n / BATCHES); i < Math.floor((b + 1) * n / BATCHES); i++) {
        const p1 = pt(2 * Math.PI * i / n), p2 = pt(2 * Math.PI * ((k * i) % n) / n);
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
      }
      ctx.stroke();
    }

    // the n points, as a fine dotted ring, drawn once per n, size and palette
    const dkey = [w, h, dpr, n, C.fg].join();
    if (S.dialKey !== dkey) { S.dialKey = dkey; S.dial = dial(w, h, dpr, C, n, pt, R); }
    ctx.drawImage(S.dial, 0, 0, w, h);

    // beads where the chord from θ to kθ shrinks to a point, (k − 1)θ ∈ 2πℤ: the cusps of the limit curve,
    // which touch the circle there. For a whole number k there are k − 1 of them.
    const rb = phone ? 2.4 : 3, bkey = [rb, dpr, C.main, C.fg].join();
    if (S.beadKey !== bkey) { S.beadKey = bkey; S.bead = bead(rb, dpr, C); }
    for (let j = 0; 2 * Math.PI * j / (k - 1) < 2 * Math.PI - 1e-9; j++) {
      const [x, y] = pt(2 * Math.PI * j / (k - 1));
      ctx.drawImage(S.bead, x - rb * 4, y - rb * 4, rb * 8, rb * 8);
    }
  },
};

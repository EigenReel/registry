const COLORS = {
  main: '#ff9a76',       // the traced curve where r ≥ 0
  secondary: '#7fd6e0',  // the traced curve where r < 0
  bg: '#24102b',
  fg: '#f7e8f1',
};

import { hex, mix, rgba, label } from '@eigenreel/kit';

function makeCanvas(w, h) {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h);
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; return cv;
}

/* The still part of the picture, drawn once per box, palette and k at device resolution: the plum lifting a
   little toward the middle, a faint polar grid (circles r = 1/4, 1/2, 3/4, 1 and a spoke every 15°), and the
   whole rose as a faint ghost, so its shape is there before the trace reaches it. */
function backdrop(w, h, dpr, C, cx, cy, R, k, steps) {
  const cv = makeCanvas(Math.max(1, Math.round(w * dpr)), Math.max(1, Math.round(h * dpr))), c = cv.getContext('2d');
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  const bg = hex(C.bg), lift = mix(bg, hex(C.fg), 0.08), deep = mix(bg, [0, 0, 0], 0.4);
  const g = c.createRadialGradient(cx, cy, 0, cx, cy, Math.hypot(w, h) * 0.6);
  g.addColorStop(0, `rgb(${lift.map(Math.round).join()})`);
  g.addColorStop(0.45, C.bg);
  g.addColorStop(1, `rgb(${deep.map(Math.round).join()})`);
  c.fillStyle = g; c.fillRect(0, 0, w, h);

  c.strokeStyle = rgba(C.fg, 0.07); c.lineWidth = 1;
  c.beginPath();
  for (let i = 0; i < 24; i++) {
    const a = Math.PI * i / 12;
    c.moveTo(cx + R * 0.08 * Math.cos(a), cy - R * 0.08 * Math.sin(a));
    c.lineTo(cx + R * Math.cos(a), cy - R * Math.sin(a));
  }
  for (const r of [0.25, 0.5, 0.75]) { c.moveTo(cx + R * r, cy); c.arc(cx, cy, R * r, 0, 2 * Math.PI); }
  c.stroke();
  c.strokeStyle = rgba(C.fg, 0.22);
  c.beginPath(); c.arc(cx, cy, R, 0, 2 * Math.PI); c.stroke();

  const period = k % 2 ? Math.PI : 2 * Math.PI;
  c.beginPath();
  for (let i = 0; i <= steps; i++) {
    const th = period * i / steps, r = Math.cos(k * th), x = cx + R * r * Math.cos(th), y = cy - R * r * Math.sin(th);
    i ? c.lineTo(x, y) : c.moveTo(x, y);
  }
  c.closePath();
  c.fillStyle = rgba(C.fg, 0.035); c.fill();
  c.strokeStyle = rgba(C.fg, 0.16); c.lineWidth = 1.5; c.lineJoin = 'round'; c.stroke();
  return cv;
}

/* The tracing point: a soft glow around a bright core, drawn once and stamped each frame. */
function spark(r, dpr, C) {
  const s = Math.ceil(r * 10 * dpr), cv = makeCanvas(s, s), c = cv.getContext('2d'), m = s / 2;
  const gl = c.createRadialGradient(m, m, 0, m, m, m);
  gl.addColorStop(0, rgba(C.fg, 0.6)); gl.addColorStop(0.3, rgba(C.fg, 0.18)); gl.addColorStop(1, rgba(C.fg, 0));
  c.fillStyle = gl; c.fillRect(0, 0, s, s);
  c.fillStyle = C.fg; c.beginPath(); c.arc(m, m, r * dpr, 0, 2 * Math.PI); c.fill();
  return cv;
}

export default {
  title: 'Rose curves',
  hook: 'r = cos(kθ) draws k petals when k is odd and 2k when k is even.',
  alt: 'On a deep plum background with a faint polar grid, a flower-shaped curve is traced and erased, coral where r is positive and aqua where r is negative, with a glowing point on a radius from the center.',
  tags: ['Geometry', 'Teaching'],
  license: 'MIT',
  author: { name: 'tbrazel' },

  modes: { desktop: true, phone: true },
  time: { length: 24, loop: true },
  context: '2d',
  libraries: [],

  params: [
    { key: 'k', type: 'range', label: 'Petal number k', min: 1, max: 12, step: 1, default: 5 },
    { key: 'trace', type: 'toggle', label: 'Show the traced path', default: true },
  ],
  presets: [
    { id: 'eight', label: 'k = 4, eight petals', params: { k: 4 }, t: 6 },
  ],

  interact: { hint: 'Use the panel to change k' },

  setup(env, S) {
    S.steps = 720;
  },

  draw(ctx, t, params, env, S) {
    const { w, h } = env.box, C = env.colors, dpr = env.dpr || 1;
    const k = params.k, phone = env.device === 'phone';
    S.panelK = k;   // only for onMode, which does not receive params, to start its slider here; draw never reads it
    const cx = w / 2, cy = h / 2;
    const R = Math.max(10, Math.min(w, h) * 0.44);

    const key = [w, h, dpr, k, C.bg, C.fg].join();
    if (S.bgKey !== key) { S.bgKey = key; S.bg = backdrop(w, h, dpr, C, cx, cy, R, k, S.steps); }
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(S.bg, 0, 0, w, h);

    // The rose closes after θ = π when k is odd and 2π when k is even. Each half of the loop traces it once,
    // then erases it, so the picture at t depends on t alone.
    const period = k % 2 ? Math.PI : 2 * Math.PI;
    const u = (t % 12) / 12;                       // 12 seconds per trace, twice per 24-second loop
    const drawing = u < 0.5;
    const s = drawing ? u * 2 : (u - 0.5) * 2;     // 0..1 within the half
    const from = drawing ? 0 : s * period, to = drawing ? s * period : period;
    const point = th => { const r = Math.cos(k * th); return [cx + R * r * Math.cos(th), cy - R * r * Math.sin(th)]; };

    // the traced path, or with `trace` off only a short stretch next to the tracing point, split where r
    // changes sign (θ = (m + 1/2)π / k, where the curve passes through the origin) and colored by the sign
    const [a, b] = params.trace ? [from, to]
      : drawing ? [Math.max(0, to - period / 10), to] : [from, Math.min(period, from + period / 10)];
    const pieces = [];
    for (let m = Math.floor(a * k / Math.PI - 0.5); ; m++) {
      const lo = Math.max(a, (m + 0.5) * Math.PI / k), hi = Math.min(b, (m + 1.5) * Math.PI / k);
      if (lo >= b) break;
      if (hi > lo) pieces.push([lo, hi, Math.cos(k * (lo + hi) / 2) >= 0]);
    }
    const stroke = (width, alpha) => {
      ctx.lineWidth = width;
      for (const [lo, hi, pos] of pieces) {
        const n = Math.max(2, Math.ceil(S.steps * (hi - lo) / (2 * Math.PI)));
        ctx.strokeStyle = rgba(pos ? C.main : C.secondary, alpha);
        ctx.beginPath();
        for (let i = 0; i <= n; i++) {
          const [x, y] = point(lo + (hi - lo) * i / n);
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
    };
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    stroke(phone ? 6 : 8, 0.14);   // a soft glow under the curve
    stroke(phone ? 2.2 : 2.6, 1);

    // the direction θ, dashed out to the unit circle, and the radius to the tracing point, in the color of
    // the sign of r: when r < 0 the point sits on the opposite side of the origin from θ
    const th = drawing ? to : from, r = Math.cos(k * th);
    const [px, py] = point(th);
    ctx.setLineDash([3, 5]);
    ctx.strokeStyle = rgba(C.fg, 0.35); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + R * Math.cos(th), cy - R * Math.sin(th)); ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = r >= 0 ? C.main : C.secondary; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();
    ctx.fillStyle = rgba(C.fg, 0.8);
    ctx.beginPath(); ctx.arc(cx, cy, 2, 0, 2 * Math.PI); ctx.fill();
    const sr = phone ? 3.5 : 4, skey = [sr, dpr, C.fg].join();
    if (S.sparkKey !== skey) { S.sparkKey = skey; S.spark = spark(sr, dpr, C); }
    ctx.drawImage(S.spark, px - sr * 5, py - sr * 5, sr * 10, sr * 10);

    // the equation, the petal count and a key to the colors, only in interact mode
    if (env.mode === 'interact') {
      const fs = Math.round(Math.max(12, Math.min(16, w / 34))), x0 = fs, petals = k % 2 ? k : 2 * k;
      label(ctx, env, `r = cos(${k}θ)`, x0, fs * 1.8, { size: fs + 2, weight: 700 });
      label(ctx, env, `${petals} petal${petals === 1 ? '' : 's'}: k is ${k % 2 ? 'odd' : 'even'}`, x0, fs * 3.2, { size: fs, alpha: 0.8 });
      label(ctx, env, 'r ≥ 0', x0, fs * 4.7, { size: fs, color: C.main });
      label(ctx, env, 'r < 0', x0 + fs * 3.6, fs * 4.7, { size: fs, color: C.secondary });
    }
  },

  // onMode(env, S) runs whenever env.mode or env.fullscreen changes, and on every resize. In interact mode it
  // builds the panel; a control that changes a declared param calls env.setParam.
  onMode(env, S) {
    if (env.mode !== 'interact' || !env.ui) return;
    const C = env.colors;
    const k = S.panelK ?? 5;   // the current k, as the last frame drew it
    const panel = document.createElement('div');
    panel.style.position = 'absolute';
    panel.style.right = '12px';
    panel.style.bottom = '12px';
    panel.style.padding = '8px 12px';
    panel.style.display = 'flex';
    panel.style.gap = '10px';
    panel.style.alignItems = 'center';
    panel.style.background = rgba(C.bg, 0.82);
    panel.style.border = `1px solid ${rgba(C.fg, 0.18)}`;
    panel.style.borderRadius = '10px';
    panel.style.color = C.fg;
    panel.style.accentColor = C.main;

    const name = document.createElement('label');
    name.textContent = 'k';
    name.setAttribute('for', 'rose-k');
    name.style.fontWeight = '700';
    const slider = document.createElement('input');
    slider.setAttribute('id', 'rose-k');
    slider.setAttribute('type', 'range');
    slider.setAttribute('min', '1');
    slider.setAttribute('max', '12');
    slider.setAttribute('step', '1');
    slider.setAttribute('value', String(k));
    slider.addEventListener('input', e => { env.setParam('k', +e.value); });

    const reset = document.createElement('button');
    reset.textContent = 'Reset';
    reset.style.background = 'transparent';
    reset.style.color = C.fg;
    reset.style.border = `1px solid ${rgba(C.fg, 0.35)}`;
    reset.style.borderRadius = '6px';
    reset.style.padding = '3px 10px';
    reset.addEventListener('click', () => { env.setParam('k', 5); slider.setAttribute('value', '5'); });

    panel.appendChild(name);
    panel.appendChild(slider);
    panel.appendChild(reset);
    env.ui.replaceChildren(panel);
  },
};

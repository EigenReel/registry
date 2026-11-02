const COLORS = {
  main: '#2dd4bf',
  secondary: '#e879f9',
  bg: '#050508',
  fg: '#ecebf5',
};

import { label, hex, rgba as rgbaHex } from '@eigenreel/kit';

// The drawing is computed in C (sources/wasm-lissajous/viz.c, built into entries/wasm-lissajous.wasm). Each frame
// the module returns a list of float commands, which this half replays on the 2D context:
//   0 end · 1 fill color r g b a · 2 stroke color r g b a, width · 3 moveTo x y · 4 lineTo x y
//   5 arc x y r a0 a1 · 6 closePath · 7 beginPath · 8 fill · 9 stroke
//   10 label: pointer and length of UTF-8 text in the module's memory, x y size align (0 left, 1 center, 2 right; +4 bold)
// Coordinates are CSS px from the box's top-left corner, the same as the context's.
//
// The look is this half's. The module is told to leave out its labels (set_theme, labels 0), so the frame has no
// text, and with them off it places the square [-1, 1]² centered in the box, with side 0.9 · min(w, h − 16). Under its
// picture this half draws a faint oscilloscope graticule in the same place; then it replays every stroke and fill in
// an accent color (anything but fg) as a beam with a soft glow, added with 'lighter' so that crossings brighten as on
// a phosphor screen.

const MAX_MEM = 64 * 1024 * 1024;
const ARGS = [0, 4, 5, 2, 2, 5, 0, 0, 0, 0, 6];   // floats after each opcode
const u32 = h => { const c = hex(h); return ((c[0] << 16) | (c[1] << 8) | c[2]) >>> 0; };
const rgba = (r, g, b, a) => `rgba(${r | 0},${g | 0},${b | 0},${Math.max(0, Math.min(1, a))})`;

function makeCanvas(w, h) {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h);
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; return cv;
}

/* The screen under the figure, in CSS px on c: a faint glow behind the square, a dot every 0.25 in x and y, and
   small ticks every 0.05 along the axes. */
function screen(c, w, h, C) {
  const R = Math.max(10, Math.min(w, h - 16) * 0.45), cx = w / 2, cy = h / 2;
  const g = c.createRadialGradient(cx, cy, 0, cx, cy, R * 1.9);
  g.addColorStop(0, rgbaHex(C.main, 0.075)); g.addColorStop(0.5, rgbaHex(C.main, 0.03)); g.addColorStop(1, rgbaHex(C.main, 0));
  c.fillStyle = g; c.fillRect(0, 0, w, h);
  c.fillStyle = rgbaHex(C.fg, 0.2);
  c.beginPath();
  for (let i = -4; i <= 4; i++) for (let j = -4; j <= 4; j++) {
    if (i === 0 || j === 0) continue;   // the module draws the axes
    const x = cx + R * i / 4, y = cy - R * j / 4;
    c.moveTo(x + 1, y); c.arc(x, y, 1, 0, 2 * Math.PI);
  }
  c.fill();
  c.strokeStyle = rgbaHex(C.fg, 0.16); c.lineWidth = 1;
  c.beginPath();
  for (let k = -20; k <= 20; k++) {
    if (k === 0) continue;
    const d = R * k / 20, l = k % 5 ? 2 : 4;
    c.moveTo(cx + d, cy - l); c.lineTo(cx + d, cy + l); c.moveTo(cx - l, cy - d); c.lineTo(cx + l, cy - d);
  }
  c.stroke();
}

/* Where the time-dependent part of a command list starts: at the first color command in the tracer's color (A1, the
   palette's secondary), or at the end. viz.c emits the axes, the square, the touch points and the whole curve before
   it, none of which depend on t. */
function splitAt(a, len, A1) {
  let i = 0;
  while (i < len) {
    const op = a[i];
    if (!(op >= 0 && op <= 10) || op !== Math.floor(op)) return i;   // replay reports it
    if ((op === 1 || op === 2) && i + 3 < len && a[i + 1] === A1[0] && a[i + 2] === A1[1] && a[i + 3] === A1[2]) return i;
    i += 1 + ARGS[op];
  }
  return len;
}

/* The cached layer, in device px: the screen, then commands [0, split) with every accent stroke and fill also drawn,
   a little wider, into a quarter-resolution glow canvas, which is blurred and added on top. Wide strokes along a long
   curve are slow at full resolution and cheap at a quarter. */
function layer(a, split, w, h, dpr, env, S) {
  const C = env.colors, W = Math.max(1, Math.round(w * dpr)), H = Math.max(1, Math.round(h * dpr));
  const cv = makeCanvas(W, H), c = cv.getContext('2d');
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  screen(c, w, h, C);
  c.lineJoin = 'round'; c.lineCap = 'round';
  const q = 4, GW = Math.ceil(W / q), GH = Math.ceil(H / q);
  const gv = makeCanvas(GW, GH), g = gv.getContext('2d');
  g.setTransform(dpr / q, 0, 0, dpr / q, 0, 0);
  g.lineJoin = 'round'; g.lineCap = 'round';
  replay(c, g, a, 0, split, env, S);
  const bv = makeCanvas(GW, GH), b = bv.getContext('2d');
  b.filter = 'blur(1.5px)';   // where filter is not supported, the glow is only the scaled-up quarter-size copy
  b.drawImage(gv, 0, 0);
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalCompositeOperation = 'lighter';
  c.imageSmoothingEnabled = true;
  c.drawImage(bv, 0, 0, W, H);
  c.globalAlpha = 0.3;
  c.drawImage(gv, 0, 0, W, H);
  return cv;
}

/* Replays commands [i0, len) on ctx. With a glow context g the paths are built on both, and accent strokes and fills
   are drawn on g as well; without one, an accent stroke or fill gets its glow from wide faint strokes of its own path,
   which is cheap for the short paths of the tracer. */
function replay(ctx, g, a, i0, len, env, S) {
  const fg = S.fg, st = [fg[0], fg[1], fg[2], 1, 1.5], fl = [fg[0], fg[1], fg[2], 1];
  const accent = c => c[0] !== fg[0] || c[1] !== fg[1] || c[2] !== fg[2];
  ctx.fillStyle = env.colors.fg; ctx.strokeStyle = env.colors.fg; ctx.lineWidth = 1.5;
  let arcs = 0, ax = 0, ay = 0, ar = 0;   // the arcs in the current path, and the last one, for the tracer's core
  let i = i0;
  const need = k => { if (i + k > len) throw new Error(`command list truncated at ${i}`); };
  loop: while (i < len) {
    const op = a[i++];
    switch (op) {
      case 0: break loop;
      case 1: need(4);
        fl[0] = a[i]; fl[1] = a[i + 1]; fl[2] = a[i + 2]; fl[3] = a[i + 3];
        ctx.fillStyle = rgba(a[i], a[i + 1], a[i + 2], a[i + 3]); i += 4; break;
      case 2: need(5);
        st[0] = a[i]; st[1] = a[i + 1]; st[2] = a[i + 2]; st[3] = a[i + 3]; st[4] = Math.max(0.1, a[i + 4]);
        ctx.strokeStyle = rgba(a[i], a[i + 1], a[i + 2], a[i + 3]); ctx.lineWidth = st[4]; i += 5; break;
      case 3: need(2); ctx.moveTo(a[i], a[i + 1]); if (g) g.moveTo(a[i], a[i + 1]); i += 2; break;
      case 4: need(2); ctx.lineTo(a[i], a[i + 1]); if (g) g.lineTo(a[i], a[i + 1]); i += 2; break;
      case 5: need(5);
        ax = a[i]; ay = a[i + 1]; ar = Math.max(0, a[i + 2]); arcs++;
        ctx.arc(ax, ay, ar, a[i + 3], a[i + 4]); if (g) g.arc(ax, ay, ar, a[i + 3], a[i + 4]); i += 5; break;
      case 6: ctx.closePath(); if (g) g.closePath(); break;
      case 7: ctx.beginPath(); if (g) g.beginPath(); arcs = 0; break;
      case 8:
        ctx.fill();
        if (!accent(fl)) break;
        if (g) { g.fillStyle = g.strokeStyle = rgba(fl[0], fl[1], fl[2], fl[3]); g.lineWidth = 5; g.fill(); g.stroke(); break; }
        // a beam spot: a halo of two wide, faint strokes around its path
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = rgba(fl[0], fl[1], fl[2], fl[3] * 0.08); ctx.lineWidth = 10; ctx.stroke();
        ctx.strokeStyle = rgba(fl[0], fl[1], fl[2], fl[3] * 0.18); ctx.lineWidth = 4.5; ctx.stroke();
        // a lone opaque spot is the tracer: it gets a white-hot core
        if (arcs === 1 && fl[3] > 0.99) {
          ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = rgba(fg[0], fg[1], fg[2], 0.85);
          ctx.beginPath(); ctx.arc(ax, ay, ar * 0.5, 0, 2 * Math.PI); ctx.fill();
        }
        ctx.restore();
        break;
      case 9:
        ctx.stroke();
        if (!accent(st)) break;
        if (g) { g.strokeStyle = rgba(st[0], st[1], st[2], Math.min(1, st[3] * 0.85)); g.lineWidth = st[4] * 3; g.stroke(); break; }
        // a beam: a wide faint glow and a narrower brighter one (butt caps, so that the pieces of the trail do not
        // overlap at their joins), then the line again on top
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'butt';
        ctx.strokeStyle = rgba(st[0], st[1], st[2], st[3] * 0.09); ctx.lineWidth = st[4] * 5.5; ctx.stroke();
        ctx.strokeStyle = rgba(st[0], st[1], st[2], st[3] * 0.2); ctx.lineWidth = st[4] * 2.5; ctx.stroke();
        ctx.restore();
        ctx.stroke();
        break;
      case 10: {
        need(6);
        const bytes = new Uint8Array(S.ex.memory.buffer);
        const p = a[i] >>> 0, n = a[i + 1] >>> 0, x = a[i + 2], y = a[i + 3], size = a[i + 4], al = a[i + 5] | 0;
        i += 6;
        if (p + n > bytes.length) throw new Error('label string out of bounds');
        label(ctx, env, S.dec.decode(bytes.subarray(p, p + n)), x, y, {
          size: Math.max(6, Math.min(96, size)), weight: al & 4 ? 700 : 400,
          align: ['left', 'center', 'right'][al & 3] || 'left', color: ctx.fillStyle,
        });
        break;
      }
      default: throw new Error(`unknown opcode ${op} at index ${i - 1}`);
    }
  }
}

export default {
  title: 'Lissajous figures from two oscillators',
  hook: 'Two oscillators at right angles, one at frequency 3 and one at b. Count where the curve touches the square and you have read off their ratio.',
  alt: 'A glowing curve of interlocking lobes inside a square on a faint oscilloscope grid, with a bright point running along it and two dots on the edges showing the two oscillations that combine into it.',
  tags: ['Dynamics', 'Mechanics', 'Teaching', 'WebAssembly'],
  license: 'MIT',
  author: { name: 'wasm.curious' },

  modes: { desktop: true, phone: true },
  time: { length: 120, loop: true },
  context: '2d',
  libraries: [],

  params: [
    { key: 'b', type: 'range', label: 'Frequency b (a = 3)', min: 1, max: 6, step: 0.05, default: 2 },
    { key: 'delta', type: 'range', label: 'Phase δ', min: 0, max: 180, step: 1, default: 90, format: '{}°' },
    { key: 'square', type: 'toggle', label: 'Inscribed square', default: true },
  ],
  presets: [
    { id: 'classic', label: '3 : 2, the classic figure', params: { b: 2, delta: 90 } },
    { id: 'one-oscillator', label: 'b = a, one oscillator', params: { b: 3, delta: 90 } },
    { id: 'collapse', label: 'Collapse to a curve', params: { b: 1, delta: 0 } },
    { id: 'detuned', label: 'Nearly 3 : 3', params: { b: 3.05, delta: 90 } },
  ],

  async setup(env, S) {
    const { instance } = await WebAssembly.instantiate(await env.wasm(), { env: { sin: Math.sin, cos: Math.cos } });
    const ex = instance.exports;
    for (const k of ['memory', 'init', 'set_param', 'set_theme', 'resize', 'frame']) {
      if (!ex[k]) throw new Error(`the module does not export ${k}`);
    }
    S.ex = ex;
    S.dec = new TextDecoder();
    S.w = Math.round(env.box.w); S.h = Math.round(env.box.h);
    ex.init(S.w, S.h, env.dpr);
    const C = env.colors;
    ex.set_theme(u32(C.bg), u32(C.fg), u32(C.secondary), u32(C.main), 1.5, 0);   // labels off: no text in the frame
    S.fg = hex(C.fg); S.a1 = hex(C.secondary);
  },

  draw(ctx, t, params, env, S) {
    const ex = S.ex;
    const w = Math.round(env.box.w), h = Math.round(env.box.h);
    if (w !== S.w || h !== S.h) { S.w = w; S.h = h; ex.resize(w, h); }
    // the module keeps the params it was last given; send all three every frame, so the frame depends on params alone
    ex.set_param(0, params.b);
    ex.set_param(1, params.delta);
    ex.set_param(2, params.square ? 1 : 0);

    const ptr = ex.frame(t) >>> 0, buf = ex.memory.buffer;
    if (buf.byteLength > MAX_MEM) throw new Error('module memory grew past 64 MiB');
    if (ptr % 4 || ptr + 4 > buf.byteLength) throw new Error('command list pointer out of bounds');
    const len = new Float32Array(buf, ptr, 1)[0] >>> 0;
    if (len > (1 << 22) || ptr + 4 + len * 4 > buf.byteLength) throw new Error('command list length out of bounds');
    const a = new Float32Array(buf, ptr + 4, len);

    // Everything before the tracer (axes, square, touch points, the whole curve) depends on params and size alone. It
    // is drawn once, over the screen, into a cached layer keyed by those commands themselves (a hash of their bits),
    // so the cache can only hand back the picture they draw. The tracer and the oscillators are replayed every frame.
    const C = env.colors, dpr = env.dpr || 1, split = splitAt(a, len, S.a1);
    const words = new Uint32Array(buf, ptr + 4, split);
    let hash = 2166136261;
    for (let k = 0; k < split; k++) hash = Math.imul(hash ^ words[k], 16777619);
    const key = [w, h, dpr, C.main, C.fg, C.bg, split, hash >>> 0].join();
    if (S.layerKey !== key) { S.layerKey = null; S.layer = layer(a, split, w, h, dpr, env, S); S.layerKey = key; }
    ctx.drawImage(S.layer, 0, 0, w, h);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    replay(ctx, null, a, split, len, env, S);
  },
};

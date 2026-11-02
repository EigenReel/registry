const COLORS = {
  main: '#fde047',
  secondary: '#c084fc',
  bg: '#050508',
  fg: '#ecebf5',
};

import { hex } from '@eigenreel/kit';

const R_C = 0.7885, TH0 = 0.6, LOOP = 52;   // c = R_C·e^{iθ}, θ = TH0 + 2πt / LOOP
const SPAN = 3.2;                           // the shorter side of the box spans this much of the z-plane
const BUDGET = { desktop: 190000, phone: 130000 };   // at most this many samples per frame, whatever the box
const BAIL = 1e4;                           // |z|² past this counts as escaped (|z| > 100, so the estimates are good)
// the inset's window on the c-plane: real part −0.6 ± 1.55, imaginary part ± 1.2 (it holds the whole circle)
const MX = -0.6, MHW = 1.55, MHH = 1.2;

function makeCanvas(w, h) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; return cv;
}

/* The palette as 0..255 triples, for writing pixels. */
function palette(C) {
  return { bg: hex(C.bg), main: hex(C.main), sec: hex(C.secondary), fg: hex(C.fg) };
}

/* The Julia set of z² + c on a cols × rows grid, u units of z per sample, imaginary part up. Each sample iterates
   z and its derivative z′ (z′₀ = 1, z′ₙ₊₁ = 2zₙz′ₙ). A sample that escapes is colored by its smoothed escape time
   (a dim tint that rises toward the set) and by the distance estimate |z| ln|z| / |z′| to J_c, which lights a thin
   bright line along J_c and a soft halo around it. A sample that has not escaped after maxIt steps is in the dark
   interior. An orbit that comes back to within 1e-7 of an earlier point has settled onto an attracting cycle and
   will never escape, so it stops there (the same answer as running on to maxIt, sooner). */
function julia(img, cols, rows, u, cr, ci, maxIt, unitsPerCss, s, P) {
  const d = img.data, bg = P.bg, sec = P.sec, main = P.main, fg = P.fg;
  const inner = [bg[0] + (sec[0] - bg[0]) * 0.13, bg[1] + (sec[1] - bg[1]) * 0.13, bg[2] + (sec[2] - bg[2]) * 0.13];
  const core = Math.max(0.5, 0.55 * s);   // CSS px: the bright line is about a sample wide
  let p = 0;
  for (let j = 0; j < rows; j++) {
    const y0 = (rows / 2 - j - 0.5) * u;
    for (let i = 0; i < cols; i++) {
      let zx = (i + 0.5 - cols / 2) * u, zy = y0, dx = 1, dy = 0, n = 0, r2 = zx * zx + zy * zy;
      let sx = zx, sy = zy, lap = 0, period = 8, out = false;
      while (n < maxIt) {
        const ndx = 2 * (zx * dx - zy * dy); dy = 2 * (zx * dy + zy * dx); dx = ndx;
        const nx = zx * zx - zy * zy + cr; zy = 2 * zx * zy + ci; zx = nx; n++;
        r2 = zx * zx + zy * zy;
        if (r2 > BAIL) { out = true; break; }
        const ex = zx - sx, ey = zy - sy;
        if (ex * ex + ey * ey < 1e-14) break;            // settled onto a cycle: inside
        if (++lap === period) { lap = 0; period *= 2; sx = zx; sy = zy; }
      }
      if (!out) { d[p] = inner[0]; d[p + 1] = inner[1]; d[p + 2] = inner[2]; }
      else {
        const lz = 0.5 * Math.log(r2), mu = n + 1 - Math.log(lz) / Math.LN2;
        const dist = Math.sqrt(r2 / (dx * dx + dy * dy)) * lz / unitsPerCss;   // CSS px to J_c, roughly
        const e = 1 - Math.exp(-Math.max(0, mu) / 9), tint = 0.32 * e * e;
        const c1 = 1 / (1 + (dist / core) * (dist / core)), h1 = Math.exp(-dist / 4);
        const a = 0.26 * h1, b = 0.85 * c1, f = 0.25 * c1 * c1 * c1;
        for (let k = 0; k < 3; k++) {
          const base = bg[k] + (sec[k] - bg[k]) * tint;
          d[p + k] = base + sec[k] * a * (1 - c1) + main[k] * b + fg[k] * f;
        }
      }
      d[p + 3] = 255; p += 4;
    }
  }
}

/* The inset: the Mandelbrot set M at the same iteration limit, W × H device pixels, transparent outside. Inside is a
   pale fill, the boundary a faint line from the exterior distance estimate (z′ₙ₊₁ = 2zₙz′ₙ + 1). */
function mandel(W, H, maxIt, P) {
  const cv = makeCanvas(W, H), c = cv.getContext('2d'), img = c.createImageData(W, H), d = img.data;
  const u = 2 * MHH / H, fg = P.fg, sec = P.sec;
  let p = 0;
  for (let j = 0; j < H; j++) {
    const ci = MHH - (j + 0.5) * u;
    for (let i = 0; i < W; i++) {
      const cr = MX - MHW + (i + 0.5) * u;
      // the main cardioid and the period-2 disc are inside: no need to iterate there
      const q = (cr - 0.25) * (cr - 0.25) + ci * ci;
      let inside = q * (q + cr - 0.25) <= 0.25 * ci * ci || (cr + 1) * (cr + 1) + ci * ci <= 1 / 16, dist = 0;
      if (!inside) {
        let zx = 0, zy = 0, dx = 0, dy = 0, n = 0, r2 = 0;
        while (n < maxIt && r2 <= BAIL) {
          const ndx = 2 * (zx * dx - zy * dy) + 1; dy = 2 * (zx * dy + zy * dx); dx = ndx;
          const nx = zx * zx - zy * zy + cr; zy = 2 * zx * zy + ci; zx = nx; n++; r2 = zx * zx + zy * zy;
        }
        if (r2 <= BAIL) inside = true;
        else dist = Math.sqrt(r2 / (dx * dx + dy * dy)) * 0.5 * Math.log(r2) / u;   // device px
      }
      if (inside) { d[p] = sec[0]; d[p + 1] = sec[1]; d[p + 2] = sec[2]; d[p + 3] = 70; }
      else {
        const g = Math.exp(-dist / 1.6);
        d[p] = fg[0]; d[p + 1] = fg[1]; d[p + 2] = fg[2]; d[p + 3] = 110 * g;
      }
      p += 4;
    }
  }
  c.putImageData(img, 0, 0);
  return cv;
}

export default {
  title: 'Julia sets on a circle of parameters',
  hook: 'As c circles the origin, the Julia set of z² + c shatters into dust and reassembles.',
  alt: 'A glowing yellow fractal outline on a dark background, with two-fold symmetry. In a corner, a point circles a small Mandelbrot set; as it leaves the set the fractal tears apart into scattered dust, and joins back into one piece when it returns.',
  tags: ['Complex dynamics', 'Fractals', 'Research'],
  license: 'BSD-3-Clause',
  author: { name: 'fatou.dust' },

  modes: { desktop: true, phone: true },
  time: { length: 52, loop: true },
  context: '2d',
  libraries: [],

  params: [
    { key: 'iter', type: 'range', label: 'Iteration limit', min: 20, max: 200, step: 10, default: 70 },
  ],
  presets: [
    { id: 'connected', label: 'c = −0.7885, connected', params: { iter: 70 }, t: 21.034 },
    { id: 'dust', label: 'c = 0.7885, dust', params: { iter: 70 }, t: 47.034 },
    { id: 'edge-70', label: 'Near the edge of M, 70 iterations', params: { iter: 70 }, t: 10.54 },
    { id: 'edge-200', label: 'Same c, 200 iterations', params: { iter: 200 }, t: 10.54 },
  ],

  draw(ctx, t, params, env, S) {
    const { w, h } = env.box, C = env.colors, dpr = env.dpr || 1, maxIt = params.iter;
    const pkey = [C.bg, C.main, C.secondary, C.fg].join();
    if (S.pkey !== pkey) { S.pkey = pkey; S.P = palette(C); S.mkey = ''; }

    // the sample grid: one sample per device pixel when that fits the budget, coarser (and scaled up smoothly)
    // when it does not
    const s = Math.max(1 / dpr, Math.sqrt(w * h / BUDGET[env.device === 'phone' ? 'phone' : 'desktop']));   // CSS px per sample
    const cols = Math.max(2, Math.ceil(w / s)), rows = Math.max(2, Math.ceil(h / s));
    if (!S.cv || S.cv.width !== cols || S.cv.height !== rows) {
      S.cv = makeCanvas(cols, rows); S.c = S.cv.getContext('2d'); S.img = S.c.createImageData(cols, rows); S.key = '';
    }
    const th = TH0 + 2 * Math.PI * t / LOOP, cr = R_C * Math.cos(th), ci = R_C * Math.sin(th);
    const unitsPerCss = SPAN / Math.min(w, h), u = unitsPerCss * s;
    const key = [cols, rows, w, h, maxIt, t, pkey].join();
    if (S.key !== key) {
      S.key = key;
      julia(S.img, cols, rows, u, cr, ci, maxIt, unitsPerCss, s, S.P);
      S.c.putImageData(S.img, 0, 0);
    }
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(S.cv, (w - cols * s) / 2, (h - rows * s) / 2, cols * s, rows * s);   // centered: z = 0 in the middle

    // is c in M, as far as maxIt iterations of the critical orbit 0, c, c² + c, … can tell?
    let zr = 0, zi = 0, n = 0;
    while (n < maxIt && zr * zr + zi * zi < 4) { const tmp = zr * zr - zi * zi + cr; zi = 2 * zr * zi + ci; zr = tmp; n++; }
    const inM = n >= maxIt;

    // the inset in the lower right: M at the same iteration limit, the circle of parameters, and c on it
    const mh = Math.round(Math.max(64, Math.min(150, Math.min(w, h) * 0.2))), mw = Math.round(mh * MHW / MHH);
    const pad = Math.max(10, Math.min(w, h) * 0.035), x0 = w - pad - mw, y0 = h - pad - mh;
    const mkey = [mw, mh, dpr, maxIt].join();
    if (S.mkey !== mkey) { S.mkey = mkey; S.mcv = mandel(Math.round(mw * dpr), Math.round(mh * dpr), maxIt, S.P); }
    const k = mh / (2 * MHH), MXp = x => x0 + (x - MX + MHW) * k, MYp = y => y0 + (MHH - y) * k;
    const back = ctx.createRadialGradient(x0 + mw / 2, y0 + mh / 2, 0, x0 + mw / 2, y0 + mh / 2, mw * 0.75);
    back.addColorStop(0, `rgba(${S.P.bg.join()},0.75)`); back.addColorStop(1, `rgba(${S.P.bg.join()},0)`);
    ctx.fillStyle = back; ctx.fillRect(x0 - mw * 0.3, y0 - mh * 0.3, mw * 1.6, mh * 1.6);
    ctx.drawImage(S.mcv, x0, y0, mw, mh);
    ctx.strokeStyle = `rgba(${S.P.fg.join()},0.35)`; ctx.lineWidth = 1; ctx.setLineDash([1.5, 3]);
    ctx.beginPath(); ctx.arc(MXp(0), MYp(0), R_C * k, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
    // c: a filled dot while it is in M (J_c connected), a ring while it is outside (J_c dust)
    const px = MXp(cr), py = MYp(ci), r = Math.max(2.5, mh / 34);
    const gl = ctx.createRadialGradient(px, py, 0, px, py, r * 4);
    gl.addColorStop(0, `rgba(${S.P.main.join()},0.5)`); gl.addColorStop(1, `rgba(${S.P.main.join()},0)`);
    ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(px, py, r * 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2);
    if (inM) { ctx.fillStyle = C.main; ctx.fill(); }
    else { ctx.fillStyle = C.bg; ctx.fill(); ctx.strokeStyle = C.main; ctx.lineWidth = 1.5; ctx.stroke(); }
  },
};

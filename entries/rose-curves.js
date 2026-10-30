const COLORS = { main: '#ff2e74', secondary: '#22e0e8', bg: '#050508', fg: '#ecebf5' };
// Your visualization. Define helpers above `export default` if you need them.
// The kit helpers hex, mix, rgba, label, clipBox and fsFor are available without importing.
// Imports and network access aren't allowed; the code runs in a sandbox.
//
// draw() runs every frame:
//   ctx   canvas 2D context        w, h  size in CSS pixels        t  time in seconds
//   P     theme: P.bg, P.fg, P.a1, P.a2 (colors), P.font, P.lw (line width),
//         P.labels (show text?), P.param (the value of your slider)
//   S     an object kept between frames (cache expensive work here)
//   B     the drawing box {x, y, w, h} inside the padding
//
// title, hook, tags and license below are how the piece is listed.
export default {
  title: 'Rose curves',
  hook: 'r = cos(kθ) draws k petals when k is odd and 2k when k is even.',
  tags: ['Geometry', 'Polar coordinates'],
  license: 'MIT',
  param: { key: 'k', label: 'Petal number k', min: 1, max: 12, step: 1, value: 5 },

  draw(ctx, w, h, t, P, S, B) {
    ctx.fillStyle = P.bg;
    ctx.fillRect(0, 0, w, h);
    const k = P.param, fs = fsFor(B);
    const cx = B.x + B.w / 2, cy = B.y + B.h / 2 + (P.labels ? fs : 0);
    const R = Math.min(B.w, B.h - (P.labels ? fs * 2 : 0)) * 0.44;
    const span = k % 2 ? Math.PI : 2 * Math.PI;   // odd k closes after π
    const drawn = Math.min(1, (t % 9) / 6);        // trace for 6 s, hold for 3 s

    ctx.strokeStyle = rgba(P.fg, 0.2); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI); ctx.stroke();

    ctx.strokeStyle = P.a1; ctx.lineWidth = P.lw * 1.6; ctx.lineJoin = 'round';
    ctx.beginPath();
    for (let i = 0; i <= 720 * drawn; i++) {
      const th = span * i / 720, r = R * Math.cos(k * th);
      const x = cx + r * Math.cos(th), y = cy - r * Math.sin(th);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();

    label(ctx, P, `r = cos(${k}θ)`, B.x, B.y + fs, { size: fs + 1, weight: 700 });
    label(ctx, P, `${k % 2 ? k : 2 * k} petals`, B.x, B.y + fs * 2.3, { size: fs, alpha: 0.75, color: P.a2 });
  },
};

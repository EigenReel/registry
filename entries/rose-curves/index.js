// github.com/EigenReel/registry/tree/main/entries/rose-curves/index.js · MIT License
import { rgba, label, fsFor } from '@loci/kit';

function draw(ctx, w, h, t, P, S, B) {
  ctx.fillStyle = P.bg;
  ctx.fillRect(0, 0, w, h);
  const k = P.param, fs = fsFor(B), petals = k % 2 ? k : 2 * k;
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
  label(ctx, P, `${petals} ${petals === 1 ? 'petal' : 'petals'}`, B.x, B.y + fs * 2.3, { size: fs, alpha: 0.75, color: P.a2 });
}

// The legacy theme object P is the host theme plus this piece's one parameter as P.param.
const legacyP = (theme, params) => ({ ...theme, param: params.k });

export default {
  draw({ ctx, t, box, theme, params, state }) {
    const d = ctx.getTransform().a, w = ctx.canvas.width / d, h = ctx.canvas.height / d;
    return draw(ctx, w, h, t, legacyP(theme, params), state, box);
  }
};

// github.com/loci-viz/galton-board/src/index.js · MIT License
import { hex, mix, rgba, label, clipBox, fsFor, mulberry32 } from '@loci/kit';

function draw(ctx,w,h,t,P,S,B){
    ctx.fillStyle=P.bg; ctx.fillRect(0,0,w,h);
    const L=P.param, N=240, GAP=0.06, SPEED=8, T=20, tl=t%T;
    if(S.L!==L){
      S.L=L; const rnd=mulberry32(12345+L), W=L+1;
      S.off=new Int8Array(N*W); S.fin=new Int16Array(N); S.cnt=new Int32Array(W); S.pmf=new Float64Array(W);
      for(let i=0;i<N;i++){ let s=0; for(let k=0;k<L;k++){ s+=rnd()<0.5?1:0; S.off[i*W+k+1]=s; } S.fin[i]=s; }
      let c=1; for(let j=0;j<=L;j++){ S.pmf[j]=c/Math.pow(2,L); c=c*(L-j)/(j+1); }
    }
    const W=L+1, off=S.off, cnt=S.cnt, pmf=S.pmf, fs=fsFor(B), top=P.labels?fs*3:6, foot=P.labels?fs*1.8:4;
    const avail=B.h-top-foot, cx=B.x+B.w/2, sx=Math.min(B.w/(L+2),28), sy=avail*0.5/(L+1), y0=B.y+top;
    const hTop=y0+(L+1)*sy, hBase=B.y+B.h-foot, hH=hBase-hTop, pegR=Math.max(1.5,sx*0.09);
    ctx.fillStyle=rgba(P.fg,0.45); ctx.beginPath();
    for(let r=0;r<L;r++) for(let j=0;j<=r;j++){ const px=cx+(j-r/2)*sx, py=y0+(r+1)*sy; ctx.moveTo(px+pegR,py); ctx.arc(px,py,pegR,0,Math.PI*2); }
    ctx.fill();
    cnt.fill(0); let landed=0; const tLand=(L+1)/SPEED;
    for(let i=0;i<N;i++){ if(tl-i*GAP>=tLand){ cnt[S.fin[i]]++; landed++; } else if(tl-i*GAP<0) break; }
    const unit=hH/(N*pmf[L>>1]*1.12), bwid=sx*0.86;
    ctx.fillStyle=rgba(P.a2,0.75);
    for(let j=0;j<=L;j++){ const bh=Math.min(hH,cnt[j]*unit); ctx.fillRect(cx+(j-L/2)*sx-bwid/2,hBase-bh,bwid,bh); }
    ctx.strokeStyle=rgba(P.fg,0.5); ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(cx-(L/2+1)*sx,hBase+.5); ctx.lineTo(cx+(L/2+1)*sx,hBase+.5); ctx.stroke();
    if(landed>3){
      const sg=Math.sqrt(L)/2, amp=landed/(Math.sqrt(2*Math.PI)*sg);
      ctx.strokeStyle=P.a1; ctx.lineWidth=P.lw*1.3; ctx.beginPath();
      for(let i=0;i<=60;i++){ const u=(i/60-.5)*(L+2), y=hBase-Math.min(hH*1.1,amp*Math.exp(-u*u/(2*sg*sg))*unit); i? ctx.lineTo(cx+u*sx,y) : ctx.moveTo(cx+u*sx,y); }
      ctx.stroke();
    }
    const br=Math.max(2,sx*0.2); ctx.fillStyle=P.fg; ctx.beginPath();
    for(let i=0;i<N;i++){
      const tf=tl-i*GAP; if(tf<0) break; const p=tf*SPEED; if(p>=L+1) continue;
      const q=p-1; let bx=cx;
      if(q>=0){ const k=Math.floor(q), f=q-k, sm=f*f*(3-2*f), a=off[i*W+k]-k/2, b=off[i*W+k+1]-(k+1)/2; bx=cx+(a+(b-a)*sm)*sx; }
      const by=y0+p*sy; ctx.moveTo(bx+br,by); ctx.arc(bx,by,br,0,Math.PI*2);
    }
    ctx.fill();
    label(ctx,P,`Galton board, ${L} rows`,B.x,B.y+fs,{size:fs+1,weight:700});
    label(ctx,P,`${landed} of ${N} balls landed`,B.x,B.y+fs*2.3,{size:fs,alpha:.75});
    label(ctx,P,`Binomial(${L}, ½) ≈ N(${L/2}, ${(L/4).toString()}),  σ = ${(Math.sqrt(L)/2).toFixed(2)} bins`,B.x,B.y+B.h-6,{size:fs-1,weight:700,color:P.a1});
  }

// The legacy theme object P is the host theme plus this piece's one parameter as P.param.
const legacyP = (theme, params) => ({ ...theme, param: params.rows });

export default {
  draw({ ctx, t, box, theme, params, state }) {
    const d = ctx.getTransform().a, w = ctx.canvas.width / d, h = ctx.canvas.height / d;
    return draw(ctx, w, h, t, legacyP(theme, params), state, box);
  }
};

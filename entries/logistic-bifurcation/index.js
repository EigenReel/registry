// github.com/loci-viz/logistic-bifurcation/src/index.js · MIT License
import { hex, mix, rgba, label, clipBox, fsFor, mulberry32 } from '@loci/kit';

function logisticField(w,h,P){
  const cv=document.createElement('canvas'); cv.width=w; cv.height=h;
  const c=cv.getContext('2d'), img=c.createImageData(w,h), d=img.data, cnt=new Uint16Array(w*h);
  for(let i=0;i<w;i++){
    const r=2.5+1.5*i/(w-1); let x=0.5;
    for(let k=0;k<300;k++) x=r*x*(1-x);
    for(let k=0;k<400;k++){ x=r*x*(1-x); cnt[Math.min(h-1,Math.floor((1-x)*h))*w+i]++; }
  }
  const bg=hex(P.bg), c1=hex(P.a2), c2=hex(P.a1);
  for(let i=0;i<w;i++){
    const hue=mix(c1,c2,i/(w-1));
    for(let j=0;j<h;j++){
      const k=j*w+i, v=Math.min(1,Math.pow(cnt[k]/14,0.45)), col=mix(bg,hue,v);
      d[k*4]=col[0]; d[k*4+1]=col[1]; d[k*4+2]=col[2]; d[k*4+3]=255;
    }
  }
  c.putImageData(img,0,0); return cv;
}

function draw(ctx,w,h,t,P,S,B){
    ctx.fillStyle=P.bg; ctx.fillRect(0,0,w,h);
    const r=P.param/100, fs=fsFor(B), top=P.labels?fs*2.8:4, foot=P.labels?fs*1.8:0;
    const avail=B.h-top-foot, hb=Math.max(40,Math.round(avail*0.44)), bw=Math.max(60,Math.round(B.w)), bx=B.x, by=B.y+top;
    const key=[bw,hb,P.bg,P.a1,P.a2].join();
    if(S.key!==key){ S.key=key; S.field=logisticField(bw,hb,P); }
    ctx.imageSmoothingEnabled=true; ctx.drawImage(S.field,bx,by,B.w,hb);
    ctx.strokeStyle=rgba(P.fg,0.3); ctx.lineWidth=1; ctx.strokeRect(bx+.5,by+.5,B.w-1,hb-1);
    const RX=q=>bx+(q-2.5)/1.5*B.w;
    ctx.strokeStyle=rgba(P.fg,0.2); ctx.beginPath();
    for(const q of [3,3.5699,3.8284]){ ctx.moveTo(RX(q),by+hb); ctx.lineTo(RX(q),by+hb-6); }
    ctx.stroke();
    ctx.strokeStyle=P.fg; ctx.lineWidth=Math.max(1,P.lw*0.8); ctx.beginPath(); ctx.moveTo(RX(r),by); ctx.lineTo(RX(r),by+hb); ctx.stroke();
    label(ctx,P,'chaos begins',RX(3.5699)-4,by+fs,{size:fs-3,alpha:.7,align:'right'});
    label(ctx,P,'period 3',RX(3.8284)+5,by+hb-9,{size:fs-3,alpha:.7,align:'left'});
    // cobweb
    const cy0=by+hb+(P.labels?fs*1.2:8), hc=B.y+B.h-foot-cy0, sc=Math.max(30,Math.min(hc,B.w)), cx0=B.x+(B.w-sc)/2;
    const X=x=>cx0+x*sc, Y=y=>cy0+sc-y*sc;
    ctx.strokeStyle=rgba(P.fg,0.3); ctx.lineWidth=1; ctx.strokeRect(cx0+.5,cy0+.5,sc-1,sc-1);
    ctx.beginPath(); ctx.moveTo(X(0),Y(0)); ctx.lineTo(X(1),Y(1)); ctx.stroke();
    ctx.strokeStyle=P.fg; ctx.lineWidth=P.lw*1.3; ctx.beginPath();
    for(let i=0;i<=60;i++){ const x=i/60, y=r*x*(1-x); i? ctx.lineTo(X(x),Y(y)) : ctx.moveTo(X(x),Y(y)); } ctx.stroke();
    const steps=Math.min(60,Math.floor((t%16)*4)); let x=0.2, y;
    ctx.strokeStyle=rgba(P.a1,0.9); ctx.lineWidth=Math.max(1,P.lw*0.9); ctx.lineJoin='round'; ctx.beginPath(); ctx.moveTo(X(x),Y(0));
    for(let i=0;i<steps;i++){ y=r*x*(1-x); ctx.lineTo(X(x),Y(y)); ctx.lineTo(X(y),Y(y)); x=y; }
    ctx.stroke();
    ctx.beginPath(); ctx.arc(X(x),Y(steps? x : 0),4,0,Math.PI*2); ctx.fillStyle=P.a1; ctx.fill();
    const reg = r<3?'one stable fixed point' : r<3.4495?'period 2' : r<3.5441?'period 4' : r<3.5699?'period 8, 16, …' : (r>3.8284&&r<3.8415)?'period-3 window' : 'mostly chaotic';
    label(ctx,P,'xₙ₊₁ = r·xₙ(1 − xₙ)',B.x,B.y+fs,{size:fs+1,weight:700});
    label(ctx,P,`r = ${r.toFixed(2)}   iterate ${steps}`,B.x,B.y+fs*2.3,{size:fs,alpha:.75});
    label(ctx,P,reg,B.x,B.y+B.h-6,{size:fs,weight:700,color:P.a2});
  }

// The legacy theme object P is the host theme plus this piece's one parameter as P.param.
const legacyP = (theme, params) => ({ ...theme, param: params.r });

export default {
  draw({ ctx, t, box, theme, params, state }) {
    const d = ctx.getTransform().a, w = ctx.canvas.width / d, h = ctx.canvas.height / d;
    return draw(ctx, w, h, t, legacyP(theme, params), state, box);
  }
};

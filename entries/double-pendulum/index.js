// github.com/loci-viz/double-pendulum/src/index.js · BSD-3-Clause License
import { hex, mix, rgba, label, clipBox, fsFor, mulberry32 } from '@loci/kit';

function dpDeriv(y,o){
  const d=y[0]-y[1], den=3-Math.cos(2*d), s=Math.sin(d), c=Math.cos(d), g=9.81;
  o[0]=y[2]; o[1]=y[3];
  o[2]=(-3*g*Math.sin(y[0]) - g*Math.sin(y[0]-2*y[1]) - 2*s*(y[3]*y[3]+y[2]*y[2]*c))/den;
  o[3]=(2*s*(2*y[2]*y[2]+2*g*Math.cos(y[0])+y[3]*y[3]*c))/den;
}

function dpStep(y,dt,K){
  const k1=K[0],k2=K[1],k3=K[2],k4=K[3],u=K[4];
  dpDeriv(y,k1);
  for(let i=0;i<4;i++) u[i]=y[i]+dt/2*k1[i];
  dpDeriv(u,k2);
  for(let i=0;i<4;i++) u[i]=y[i]+dt/2*k2[i];
  dpDeriv(u,k3);
  for(let i=0;i<4;i++) u[i]=y[i]+dt*k3[i];
  dpDeriv(u,k4);
  for(let i=0;i<4;i++) y[i]+=dt/6*(k1[i]+2*k2[i]+2*k3[i]+k4[i]);
}

function draw(ctx,w,h,t,P,S,B){
    ctx.fillStyle=P.bg; ctx.fillRect(0,0,w,h);
    const T=24, dt=0.005, NT=360, cyc=Math.floor(t/T), local=t-cyc*T, key=P.param+':'+cyc;
    if(S.key!==key || local<S.sim){
      S.key=key; const a=P.param*Math.PI/180;
      S.A=new Float64Array([a,0,0,0]); S.Bp=new Float64Array([a+0.001,0,0,0]);
      S.K=[0,1,2,3,4].map(()=>new Float64Array(4));
      S.trA=new Float32Array(NT*2); S.trB=new Float32Array(NT*2); S.head=0; S.n=0; S.steps=0;
    }
    const target=Math.floor(local/dt);
    while(S.steps<target){
      dpStep(S.A,dt,S.K); dpStep(S.Bp,dt,S.K); S.steps++;
      if(S.steps%3===0){
        const hd=S.head*2, A=S.A, Bq=S.Bp;
        S.trA[hd]=Math.sin(A[0])+Math.sin(A[1]); S.trA[hd+1]=Math.cos(A[0])+Math.cos(A[1]);
        S.trB[hd]=Math.sin(Bq[0])+Math.sin(Bq[1]); S.trB[hd+1]=Math.cos(Bq[0])+Math.cos(Bq[1]);
        S.head=(S.head+1)%NT; if(S.n<NT) S.n++;
      }
    }
    S.sim=local;
    const fs=fsFor(B), top=P.labels?fs*3:4, foot=P.labels?fs*1.8:4, avail=B.h-top-foot;
    const k=Math.min(B.w,avail)/4*0.96, ox=B.x+B.w/2, oy=B.y+top+avail/2;
    clipBox(ctx,B);
    const drawTrail=(tr,col)=>{
      const n=S.n; if(n<2) return; const start=(S.head-n+NT)%NT, chunks=4, per=Math.ceil(n/chunks);
      ctx.lineWidth=Math.max(1,P.lw); ctx.lineJoin='round';
      for(let c=0;c<chunks;c++){
        const i0=c*per, i1=Math.min(n-1,(c+1)*per); if(i1<=i0) break;
        ctx.strokeStyle=rgba(col,0.12+0.22*c); ctx.beginPath();
        for(let i=i0;i<=i1;i++){ const j=(start+i)%NT, x=ox+tr[2*j]*k, y=oy+tr[2*j+1]*k; i===i0? ctx.moveTo(x,y) : ctx.lineTo(x,y); }
        ctx.stroke();
      }
    };
    drawTrail(S.trB,P.a2); drawTrail(S.trA,P.a1);
    const rod=(y,col,wd)=>{
      const x1=ox+Math.sin(y[0])*k, y1=oy+Math.cos(y[0])*k, x2=x1+Math.sin(y[1])*k, y2=y1+Math.cos(y[1])*k;
      ctx.strokeStyle=col; ctx.lineWidth=wd; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(ox,oy); ctx.lineTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
      ctx.fillStyle=col; ctx.beginPath(); ctx.arc(x1,y1,3+P.lw,0,Math.PI*2); ctx.arc(x2,y2,4+P.lw,0,Math.PI*2); ctx.fill();
      return [x2,y2];
    };
    const q2=rod(S.Bp,rgba(P.a2,0.85),Math.max(1.5,P.lw)), q1=rod(S.A,P.a1,Math.max(1.5,P.lw));
    ctx.fillStyle=P.fg; ctx.beginPath(); ctx.arc(ox,oy,4,0,Math.PI*2); ctx.fill();
    ctx.restore();
    const sep=Math.hypot(q1[0]-q2[0],q1[1]-q2[1])/k;
    label(ctx,P,'Two double pendulums, θ₁ differs by 0.001 rad',B.x,B.y+fs,{size:fs,weight:700});
    label(ctx,P,`θ₁(0) = ${P.param}°   t = ${local.toFixed(1)} s`,B.x,B.y+fs*2.3,{size:fs,alpha:.75});
    label(ctx,P,`tip separation ${sep.toFixed(3)} rod lengths`,B.x,B.y+B.h-6,{size:fs,weight:700,color:sep>0.2?P.a1:P.a2});
  }

// The legacy theme object P is the host theme plus this piece's one parameter as P.param.
const legacyP = (theme, params) => ({ ...theme, param: params.th });

export default {
  draw({ ctx, t, box, theme, params, state }) {
    const d = ctx.getTransform().a, w = ctx.canvas.width / d, h = ctx.canvas.height / d;
    return draw(ctx, w, h, t, legacyP(theme, params), state, box);
  }
};

// github.com/loci-viz/lorenz-butterfly/src/index.js · Apache-2.0 License
import { hex, mix, rgba, label, clipBox, fsFor, mulberry32 } from '@loci/kit';

function lorenzStep(s,dt,rho){
  const sg=10, be=8/3, h=dt/2, x=s[0], y=s[1], z=s[2];
  const ax=sg*(y-x), ay=x*(rho-z)-y, az=x*y-be*z;
  let X=x+h*ax, Y=y+h*ay, Z=z+h*az;
  const bx=sg*(Y-X), by=X*(rho-Z)-Y, bz=X*Y-be*Z;
  X=x+h*bx; Y=y+h*by; Z=z+h*bz;
  const cx=sg*(Y-X), cy=X*(rho-Z)-Y, cz=X*Y-be*Z;
  X=x+dt*cx; Y=y+dt*cy; Z=z+dt*cz;
  const ex=sg*(Y-X), ey=X*(rho-Z)-Y, ez=X*Y-be*Z;
  s[0]=x+dt/6*(ax+2*bx+2*cx+ex); s[1]=y+dt/6*(ay+2*by+2*cy+ey); s[2]=z+dt/6*(az+2*bz+2*cz+ez);
}

function draw(ctx,w,h,t,P,S,B){
    ctx.fillStyle=P.bg; ctx.fillRect(0,0,w,h);
    const T=40, dt=0.005, NT=900, rho=P.param, cyc=Math.floor(t/T), local=t-cyc*T, key=rho+':'+cyc;
    if(S.key!==key || local<S.sim){
      S.key=key; S.A=new Float64Array([1,1,1]); S.Bq=new Float64Array([1.001,1,1]);
      S.trA=new Float32Array(NT*3); S.trB=new Float32Array(NT*3); S.head=0; S.n=0; S.steps=0;
    }
    const target=Math.floor(local*250);
    while(S.steps<target){
      lorenzStep(S.A,dt,rho); lorenzStep(S.Bq,dt,rho); S.steps++;
      if(S.steps%2===0){
        const hd=S.head*3; for(let i=0;i<3;i++){ S.trA[hd+i]=S.A[i]; S.trB[hd+i]=S.Bq[i]; }
        S.head=(S.head+1)%NT; if(S.n<NT) S.n++;
      }
    }
    S.sim=local;
    const fs=fsFor(B), top=P.labels?fs*3:4, foot=P.labels?fs*1.8:4, avail=B.h-top-foot;
    const H=2.7*Math.sqrt(8/3*(rho-1))+2, sc=Math.min(B.w/(2*H), avail/(1.75*rho))*0.97;
    const cx=B.x+B.w/2, cy=B.y+top+avail/2, zc=0.87*rho, ph=t*0.12, ca=Math.cos(ph), sa=Math.sin(ph);
    clipBox(ctx,B);
    const drawTrail=(tr,col)=>{
      const n=S.n; if(n<2) return; const start=(S.head-n+NT)%NT, chunks=5, per=Math.ceil(n/chunks);
      ctx.lineWidth=Math.max(0.8,P.lw*0.8); ctx.lineJoin='round';
      for(let c=0;c<chunks;c++){
        const i0=c*per, i1=Math.min(n-1,(c+1)*per); if(i1<=i0) break;
        ctx.strokeStyle=rgba(col,0.1+0.22*c); ctx.beginPath();
        for(let i=i0;i<=i1;i++){
          const j=((start+i)%NT)*3, x=cx+sc*(tr[j]*ca+tr[j+1]*sa), y=cy-sc*(tr[j+2]-zc);
          i===i0? ctx.moveTo(x,y) : ctx.lineTo(x,y);
        }
        ctx.stroke();
      }
    };
    drawTrail(S.trB,P.a2); drawTrail(S.trA,P.a1);
    const head=(s,col)=>{ ctx.beginPath(); ctx.arc(cx+sc*(s[0]*ca+s[1]*sa),cy-sc*(s[2]-zc),3+P.lw,0,Math.PI*2); ctx.fillStyle=col; ctx.fill(); };
    head(S.Bq,P.a2); head(S.A,P.a1);
    ctx.restore();
    const gap=Math.hypot(S.A[0]-S.Bq[0],S.A[1]-S.Bq[1],S.A[2]-S.Bq[2]);
    label(ctx,P,'Lorenz system, σ = 10, β = 8/3',B.x,B.y+fs,{size:fs+1,weight:700});
    label(ctx,P,`ρ = ${rho}   t = ${(S.steps*dt).toFixed(1)}`,B.x,B.y+fs*2.3,{size:fs,alpha:.75});
    label(ctx,P,`gap between the two runs: ${gap.toFixed(3)}`,B.x,B.y+B.h-6,{size:fs,weight:700,color:gap>1?P.a1:P.a2});
  }

// The legacy theme object P is the host theme plus this piece's one parameter as P.param.
const legacyP = (theme, params) => ({ ...theme, param: params.rho });

export default {
  draw({ ctx, t, box, theme, params, state }) {
    const d = ctx.getTransform().a, w = ctx.canvas.width / d, h = ctx.canvas.height / d;
    return draw(ctx, w, h, t, legacyP(theme, params), state, box);
  }
};

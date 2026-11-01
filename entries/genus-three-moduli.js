const COLORS = {
  "main": "#52658a",
  "secondary": "#b65c33",
  "bg": "#ffffff",
  "fg": "#252b25",
  "olive": "#829335",
  "violet": "#81509c",
  "gold": "#c18a0d",
  "ivory": "#f3f1e9",
  "teal": "#527f7b",
  "pigment9": "#80549b",
  "pigment10": "#bd890c",
  "pigment11": "#d3a54d",
  "pigment12": "#eee9df",
  "pigment13": "#dfe5e8",
  "pigment14": "#e5e5d8",
  "pigment15": "#e8dedb",
  "pigment16": "#626a70",
  "pigment17": "#68503a",
  "pigment18": "#343639",
  "pigment19": "#b87956",
  "pigment20": "#c4c8c1",
  "pigment21": "#c4c8c2",
  "pigment22": "#c9cbc4",
  "pigment23": "#cbd0c8",
  "pigment24": "#d0d1c7",
  "pigment25": "#ece9dd",
  "pigment26": "#737a70",
  "pigment27": "#bca16c",
  "pigment28": "#8b543d",
  "pigment29": "#555a54",
  "pigment30": "#b56238",
  "pigment31": "#76508f",
  "pigment32": "#526c97",
  "pigment33": "#a692b4",
  "pigment34": "#899fc1",
  "pigment35": "#404346",
  "pigment36": "#c38f20",
  "pigment37": "#666b65",
  "pigment38": "#a47b28",
  "pigment39": "#303936",
  "pigment40": "#40577f",
  "pigment41": "#a75330",
  "pigment42": "#b88a25",
  "pigment43": "#faf8f0",
  "pigment44": "#80658e",
  "pigment45": "#727367",
  "pigment46": "#6b6177",
  "pigment47": "#595165"
};

import * as THREE from '@eigenreel/three';

// MIT © 2026 Michael Ruofan Zeng.
// Original procedural M3 artwork, adapted to the EigenReel entry contract.
// Inspired by Elliot Kienzle, featured in Jarod Alper, DOI 10.1090/noti3280.
// Spatial layout is schematic. The stable graphs and contractions are exact.
const GRAPHS = [{"id":"g3-e0-01","name":"Smooth genus 3","short":"M\u2083","weights":[3],"edges":[],"edgeCount":0,"vertexCount":1,"cycleRank":0,"dimension":6,"smoothings":[]},{"id":"g3-e1-01","name":"Irreducible one-node curve","short":"\u0394\u2080","weights":[2],"edges":[[0,0]],"edgeCount":1,"vertexCount":1,"cycleRank":1,"dimension":5,"smoothings":[{"id":"g3-e0-01","multiplicity":1}]},{"id":"g3-e1-02","name":"Elliptic tail","short":"\u0394\u2081","weights":[1,2],"edges":[[0,1]],"edgeCount":1,"vertexCount":2,"cycleRank":0,"dimension":5,"smoothings":[{"id":"g3-e0-01","multiplicity":1}]},{"id":"g3-e2-01","name":"Irreducible, 2 nodes","short":"2 nodes","weights":[1],"edges":[[0,0],[0,0]],"edgeCount":2,"vertexCount":1,"cycleRank":2,"dimension":4,"smoothings":[{"id":"g3-e1-01","multiplicity":2}]},{"id":"g3-e2-02","name":"2 components \u00b7 2 nodes","short":"2 nodes","weights":[0,2],"edges":[[0,0],[0,1]],"edgeCount":2,"vertexCount":2,"cycleRank":1,"dimension":4,"smoothings":[{"id":"g3-e1-01","multiplicity":1},{"id":"g3-e1-02","multiplicity":1}]},{"id":"g3-e2-03","name":"2 components \u00b7 2 nodes","short":"2 nodes","weights":[1,1],"edges":[[0,1],[1,1]],"edgeCount":2,"vertexCount":2,"cycleRank":1,"dimension":4,"smoothings":[{"id":"g3-e1-01","multiplicity":1},{"id":"g3-e1-02","multiplicity":1}]},{"id":"g3-e2-04","name":"2 components \u00b7 2 nodes","short":"2 nodes","weights":[1,1],"edges":[[0,1],[0,1]],"edgeCount":2,"vertexCount":2,"cycleRank":1,"dimension":4,"smoothings":[{"id":"g3-e1-01","multiplicity":2}]},{"id":"g3-e2-05","name":"Compact type \u00b7 3 components","short":"Compact type","weights":[1,1,1],"edges":[[0,2],[1,2]],"edgeCount":2,"vertexCount":3,"cycleRank":0,"dimension":4,"smoothings":[{"id":"g3-e1-02","multiplicity":2}]},{"id":"g3-e3-01","name":"Irreducible, 3 nodes","short":"3 nodes","weights":[0],"edges":[[0,0],[0,0],[0,0]],"edgeCount":3,"vertexCount":1,"cycleRank":3,"dimension":3,"smoothings":[{"id":"g3-e2-01","multiplicity":3}]},{"id":"g3-e3-02","name":"2 components \u00b7 3 nodes","short":"3 nodes","weights":[0,1],"edges":[[0,1],[0,1],[0,1]],"edgeCount":3,"vertexCount":2,"cycleRank":2,"dimension":3,"smoothings":[{"id":"g3-e2-01","multiplicity":3}]},{"id":"g3-e3-03","name":"2 components \u00b7 3 nodes","short":"3 nodes","weights":[0,1],"edges":[[0,0],[0,1],[1,1]],"edgeCount":3,"vertexCount":2,"cycleRank":2,"dimension":3,"smoothings":[{"id":"g3-e2-01","multiplicity":1},{"id":"g3-e2-02","multiplicity":1},{"id":"g3-e2-03","multiplicity":1}]},{"id":"g3-e3-04","name":"2 components \u00b7 3 nodes","short":"3 nodes","weights":[0,1],"edges":[[0,0],[0,1],[0,1]],"edgeCount":3,"vertexCount":2,"cycleRank":2,"dimension":3,"smoothings":[{"id":"g3-e2-01","multiplicity":2},{"id":"g3-e2-04","multiplicity":1}]},{"id":"g3-e3-05","name":"2 components \u00b7 3 nodes","short":"3 nodes","weights":[0,1],"edges":[[0,0],[0,0],[0,1]],"edgeCount":3,"vertexCount":2,"cycleRank":2,"dimension":3,"smoothings":[{"id":"g3-e2-01","multiplicity":1},{"id":"g3-e2-03","multiplicity":2}]},{"id":"g3-e3-06","name":"3 components \u00b7 3 nodes","short":"3 nodes","weights":[0,1,1],"edges":[[0,1],[0,2],[0,2]],"edgeCount":3,"vertexCount":3,"cycleRank":1,"dimension":3,"smoothings":[{"id":"g3-e2-03","multiplicity":2},{"id":"g3-e2-04","multiplicity":1}]},{"id":"g3-e3-07","name":"3 components \u00b7 3 nodes","short":"3 nodes","weights":[0,1,1],"edges":[[0,0],[0,2],[1,2]],"edgeCount":3,"vertexCount":3,"cycleRank":1,"dimension":3,"smoothings":[{"id":"g3-e2-02","multiplicity":1},{"id":"g3-e2-03","multiplicity":1},{"id":"g3-e2-05","multiplicity":1}]},{"id":"g3-e3-08","name":"3 components \u00b7 3 nodes","short":"3 nodes","weights":[0,1,1],"edges":[[0,0],[0,1],[0,2]],"edgeCount":3,"vertexCount":3,"cycleRank":1,"dimension":3,"smoothings":[{"id":"g3-e2-03","multiplicity":2},{"id":"g3-e2-05","multiplicity":1}]},{"id":"g3-e3-09","name":"Compact type \u00b7 4 components","short":"Compact type","weights":[0,1,1,1],"edges":[[0,1],[0,2],[0,3]],"edgeCount":3,"vertexCount":4,"cycleRank":0,"dimension":3,"smoothings":[{"id":"g3-e2-05","multiplicity":3}]},{"id":"g3-e4-01","name":"2 components \u00b7 4 nodes","short":"4 nodes","weights":[0,0],"edges":[[0,1],[0,1],[0,1],[1,1]],"edgeCount":4,"vertexCount":2,"cycleRank":3,"dimension":2,"smoothings":[{"id":"g3-e3-01","multiplicity":3},{"id":"g3-e3-02","multiplicity":1}]},{"id":"g3-e4-02","name":"2 components \u00b7 4 nodes","short":"4 nodes","weights":[0,0],"edges":[[0,1],[0,1],[0,1],[0,1]],"edgeCount":4,"vertexCount":2,"cycleRank":3,"dimension":2,"smoothings":[{"id":"g3-e3-01","multiplicity":4}]},{"id":"g3-e4-03","name":"2 components \u00b7 4 nodes","short":"4 nodes","weights":[0,0],"edges":[[0,0],[0,1],[1,1],[1,1]],"edgeCount":4,"vertexCount":2,"cycleRank":3,"dimension":2,"smoothings":[{"id":"g3-e3-01","multiplicity":1},{"id":"g3-e3-03","multiplicity":2},{"id":"g3-e3-05","multiplicity":1}]},{"id":"g3-e4-04","name":"2 components \u00b7 4 nodes","short":"4 nodes","weights":[0,0],"edges":[[0,0],[0,1],[0,1],[1,1]],"edgeCount":4,"vertexCount":2,"cycleRank":3,"dimension":2,"smoothings":[{"id":"g3-e3-01","multiplicity":2},{"id":"g3-e3-04","multiplicity":2}]},{"id":"g3-e4-05","name":"3 components \u00b7 4 nodes","short":"4 nodes","weights":[0,0,1],"edges":[[0,1],[0,2],[0,2],[1,1]],"edgeCount":4,"vertexCount":3,"cycleRank":2,"dimension":2,"smoothings":[{"id":"g3-e3-03","multiplicity":2},{"id":"g3-e3-04","multiplicity":1},{"id":"g3-e3-06","multiplicity":1}]},{"id":"g3-e4-06","name":"3 components \u00b7 4 nodes","short":"4 nodes","weights":[0,0,1],"edges":[[0,1],[0,1],[0,2],[1,2]],"edgeCount":4,"vertexCount":3,"cycleRank":2,"dimension":2,"smoothings":[{"id":"g3-e3-02","multiplicity":2},{"id":"g3-e3-04","multiplicity":2}]},{"id":"g3-e4-07","name":"3 components \u00b7 4 nodes","short":"4 nodes","weights":[0,0,1],"edges":[[0,1],[0,1],[0,2],[1,1]],"edgeCount":4,"vertexCount":3,"cycleRank":2,"dimension":2,"smoothings":[{"id":"g3-e3-04","multiplicity":1},{"id":"g3-e3-05","multiplicity":2},{"id":"g3-e3-06","multiplicity":1}]},{"id":"g3-e4-08","name":"3 components \u00b7 4 nodes","short":"4 nodes","weights":[0,0,1],"edges":[[0,1],[0,1],[0,1],[1,2]],"edgeCount":4,"vertexCount":3,"cycleRank":2,"dimension":2,"smoothings":[{"id":"g3-e3-02","multiplicity":1},{"id":"g3-e3-05","multiplicity":3}]},{"id":"g3-e4-09","name":"3 components \u00b7 4 nodes","short":"4 nodes","weights":[0,0,1],"edges":[[0,0],[0,2],[1,1],[1,2]],"edgeCount":4,"vertexCount":3,"cycleRank":2,"dimension":2,"smoothings":[{"id":"g3-e3-03","multiplicity":2},{"id":"g3-e3-07","multiplicity":2}]},{"id":"g3-e4-10","name":"3 components \u00b7 4 nodes","short":"4 nodes","weights":[0,0,1],"edges":[[0,0],[0,1],[1,1],[1,2]],"edgeCount":4,"vertexCount":3,"cycleRank":2,"dimension":2,"smoothings":[{"id":"g3-e3-03","multiplicity":1},{"id":"g3-e3-05","multiplicity":1},{"id":"g3-e3-07","multiplicity":1},{"id":"g3-e3-08","multiplicity":1}]},{"id":"g3-e4-11","name":"4 components \u00b7 4 nodes","short":"4 nodes","weights":[0,0,1,1],"edges":[[0,1],[0,2],[0,3],[1,1]],"edgeCount":4,"vertexCount":4,"cycleRank":1,"dimension":2,"smoothings":[{"id":"g3-e3-07","multiplicity":2},{"id":"g3-e3-08","multiplicity":1},{"id":"g3-e3-09","multiplicity":1}]},{"id":"g3-e4-12","name":"4 components \u00b7 4 nodes","short":"4 nodes","weights":[0,0,1,1],"edges":[[0,1],[0,1],[0,3],[1,2]],"edgeCount":4,"vertexCount":4,"cycleRank":1,"dimension":2,"smoothings":[{"id":"g3-e3-06","multiplicity":2},{"id":"g3-e3-08","multiplicity":2}]},{"id":"g3-e5-01","name":"3 components \u00b7 5 nodes","short":"5 nodes","weights":[0,0,0],"edges":[[0,2],[0,2],[0,2],[1,1],[1,2]],"edgeCount":5,"vertexCount":3,"cycleRank":3,"dimension":1,"smoothings":[{"id":"g3-e4-01","multiplicity":1},{"id":"g3-e4-03","multiplicity":3},{"id":"g3-e4-08","multiplicity":1}]},{"id":"g3-e5-02","name":"3 components \u00b7 5 nodes","short":"5 nodes","weights":[0,0,0],"edges":[[0,1],[0,2],[0,2],[1,2],[1,2]],"edgeCount":5,"vertexCount":3,"cycleRank":3,"dimension":1,"smoothings":[{"id":"g3-e4-01","multiplicity":4},{"id":"g3-e4-02","multiplicity":1}]},{"id":"g3-e5-03","name":"3 components \u00b7 5 nodes","short":"5 nodes","weights":[0,0,0],"edges":[[0,1],[0,2],[0,2],[1,1],[2,2]],"edgeCount":5,"vertexCount":3,"cycleRank":3,"dimension":1,"smoothings":[{"id":"g3-e4-03","multiplicity":2},{"id":"g3-e4-04","multiplicity":1},{"id":"g3-e4-05","multiplicity":1},{"id":"g3-e4-07","multiplicity":1}]},{"id":"g3-e5-04","name":"3 components \u00b7 5 nodes","short":"5 nodes","weights":[0,0,0],"edges":[[0,1],[0,2],[0,2],[1,1],[1,2]],"edgeCount":5,"vertexCount":3,"cycleRank":3,"dimension":1,"smoothings":[{"id":"g3-e4-01","multiplicity":2},{"id":"g3-e4-04","multiplicity":2},{"id":"g3-e4-06","multiplicity":1}]},{"id":"g3-e5-05","name":"3 components \u00b7 5 nodes","short":"5 nodes","weights":[0,0,0],"edges":[[0,0],[0,2],[1,1],[1,2],[2,2]],"edgeCount":5,"vertexCount":3,"cycleRank":3,"dimension":1,"smoothings":[{"id":"g3-e4-03","multiplicity":2},{"id":"g3-e4-09","multiplicity":1},{"id":"g3-e4-10","multiplicity":2}]},{"id":"g3-e5-06","name":"4 components \u00b7 5 nodes","short":"5 nodes","weights":[0,0,0,1],"edges":[[0,2],[0,2],[0,3],[1,1],[1,2]],"edgeCount":5,"vertexCount":4,"cycleRank":2,"dimension":1,"smoothings":[{"id":"g3-e4-05","multiplicity":1},{"id":"g3-e4-07","multiplicity":1},{"id":"g3-e4-10","multiplicity":2},{"id":"g3-e4-12","multiplicity":1}]},{"id":"g3-e5-07","name":"4 components \u00b7 5 nodes","short":"5 nodes","weights":[0,0,0,1],"edges":[[0,1],[0,2],[0,3],[1,2],[1,2]],"edgeCount":5,"vertexCount":4,"cycleRank":2,"dimension":1,"smoothings":[{"id":"g3-e4-06","multiplicity":1},{"id":"g3-e4-07","multiplicity":2},{"id":"g3-e4-08","multiplicity":2}]},{"id":"g3-e5-08","name":"4 components \u00b7 5 nodes","short":"5 nodes","weights":[0,0,0,1],"edges":[[0,1],[0,2],[0,3],[1,1],[2,2]],"edgeCount":5,"vertexCount":4,"cycleRank":2,"dimension":1,"smoothings":[{"id":"g3-e4-09","multiplicity":1},{"id":"g3-e4-10","multiplicity":2},{"id":"g3-e4-11","multiplicity":2}]},{"id":"g3-e6-01","name":"Maximally degenerate","short":"Trivalent","weights":[0,0,0,0],"edges":[[0,2],[0,3],[0,3],[1,2],[1,2],[1,3]],"edgeCount":6,"vertexCount":4,"cycleRank":3,"dimension":0,"smoothings":[{"id":"g3-e5-02","multiplicity":2},{"id":"g3-e5-04","multiplicity":4}]},{"id":"g3-e6-02","name":"Maximally degenerate","short":"Trivalent","weights":[0,0,0,0],"edges":[[0,2],[0,3],[0,3],[1,1],[1,3],[2,2]],"edgeCount":6,"vertexCount":4,"cycleRank":3,"dimension":0,"smoothings":[{"id":"g3-e5-03","multiplicity":2},{"id":"g3-e5-05","multiplicity":2},{"id":"g3-e5-06","multiplicity":2}]},{"id":"g3-e6-03","name":"Maximally degenerate","short":"Trivalent","weights":[0,0,0,0],"edges":[[0,2],[0,3],[0,3],[1,1],[1,2],[2,3]],"edgeCount":6,"vertexCount":4,"cycleRank":3,"dimension":0,"smoothings":[{"id":"g3-e5-01","multiplicity":2},{"id":"g3-e5-03","multiplicity":2},{"id":"g3-e5-04","multiplicity":1},{"id":"g3-e5-07","multiplicity":1}]},{"id":"g3-e6-04","name":"Maximally degenerate","short":"Trivalent","weights":[0,0,0,0],"edges":[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]],"edgeCount":6,"vertexCount":4,"cycleRank":3,"dimension":0,"smoothings":[{"id":"g3-e5-02","multiplicity":6}]},{"id":"g3-e6-05","name":"Maximally degenerate","short":"Trivalent","weights":[0,0,0,0],"edges":[[0,1],[0,2],[0,3],[1,1],[2,2],[3,3]],"edgeCount":6,"vertexCount":4,"cycleRank":3,"dimension":0,"smoothings":[{"id":"g3-e5-05","multiplicity":3},{"id":"g3-e5-08","multiplicity":3}]}];
function toolkit(PALETTE) { const M = {};

(function(global){
'use strict';
function createArtSurfaceData(genus=3,options={}){
  genus=Math.max(0,Math.min(3,Math.round(genus)));
  const tetrahedral=genus===3&&options.shape==='tetrahedral';
  const wheel=genus===3&&options.shape==='wheel';
  const n=options.resolution||84, ny=tetrahedral?n:Math.max(18,Math.round(n*.28));
  const lo=tetrahedral?-1.64:(wheel?-1.9:-2.52),hi=-lo,yl=tetrahedral?-1.64:(genus?-.62:-1.3),yh=-yl;
  const dx=(hi-lo)/n,dy=(yh-yl)/ny;
  const nx=n+1,nz=n+1,N=nx*nz*(ny+1);
  const field=new Float32Array(N),distance=new Float64Array(nx*nz);
  const positions=[],indices=[],edgeCache=new Map();
  const tube=.265,hub=.42,smooth=.11;
  const curves=[];
  if(genus&&!tetrahedral&&!wheel)for(let l=0;l<genus;l++){
    const theta=genus===1?0:-Math.PI/2+l*2*Math.PI/genus;
    const co=Math.cos(theta),si=Math.sin(theta),segments=100;
    const verts=[];
    for(let k=0;k<=segments;k++){
      const t=k*2*Math.PI/segments,u=1.08+.99*Math.cos(t),v=.485*Math.sin(t);
      verts.push([co*u-si*v,si*u+co*v]);
    }
    for(let k=0;k<segments;k++){
      const a=verts[k],b=verts[k+1],ux=b[0]-a[0],uz=b[1]-a[1];
      curves.push([a[0],a[1],ux,uz,1/(ux*ux+uz*uz)]);
    }
  }
  if(!tetrahedral&&!wheel)for(let z=0;z<nz;z++)for(let x=0;x<nx;x++){
    const px=lo+x*dx,pz=lo+z*dx;let best=Infinity;
    for(const e of curves){const vx=px-e[0],vz=pz-e[1],t=Math.max(0,Math.min(1,(vx*e[2]+vz*e[3])*e[4]));const sx=vx-t*e[2],sz=vz-t*e[3];best=Math.min(best,sx*sx+sz*sz)}
    distance[z*nx+x]=best;
  }
  const smoothMin=(a,b,k)=>{const h=Math.max(0,Math.min(1,.5+.5*(b-a)/k));return b+(a-b)*h-k*h*(1-h)};
  const id=(x,y,z)=>(y*nz+z)*nx+x;
  const spokes=Array.from({length:3},(_,i)=>{const angle=-Math.PI/2+i*Math.PI*2/3;return [Math.cos(angle),Math.sin(angle)]});
  const ta=1.18,tv=[[ta,ta,ta],[ta,-ta,-ta],[-ta,ta,-ta],[-ta,-ta,ta]],te=[];
  if(tetrahedral)for(let a=0;a<4;a++)for(let b=a+1;b<4;b++){const v=tv[a],w=tv[b],u=w.map((n,i)=>n-v[i]);te.push([...v,...u,1/u.reduce((sum,x)=>sum+x*x,0)])}
  for(let y=0;y<=ny;y++)for(let z=0;z<nz;z++)for(let x=0;x<nx;x++){
    const px=lo+x*dx,py=yl+y*dy,pz=lo+z*dx;
    if(wheel){
      const major=1.45,radius=.245,k=.055,r=Math.hypot(px,pz);
      const ring=Math.hypot(r-major,py)-radius;let total=Math.exp(-ring/k);
      for(const [ux,uz] of spokes){const t=Math.max(0,Math.min(major,px*ux+pz*uz));
        const d=Math.hypot(px-t*ux,py,pz-t*uz)-radius;total+=Math.exp(-d/k);
      }
      field[id(x,y,z)]=-k*Math.log(total);continue;
    }
    if(tetrahedral){


      let total=0;const k=.065;
      for(const e of te){const vx=px-e[0],vy=py-e[1],vz=pz-e[2],t=Math.max(0,Math.min(1,(vx*e[3]+vy*e[4]+vz*e[5])*e[6]));
        const sx=vx-t*e[3],sy=vy-t*e[4],sz=vz-t*e[5],d=Math.sqrt(sx*sx+sy*sy+sz*sz)-tube;total+=Math.exp(-d/k);
      }
      field[id(x,y,z)]=-k*Math.log(total);continue;
    }
    const ball=Math.sqrt(px*px+py*py+pz*pz)-(genus?hub:1.1);
    const torus=Math.sqrt(distance[z*nx+x]+py*py)-tube;
    field[id(x,y,z)]=genus?smoothMin(ball,torus,smooth):ball;
  }
  const coordinate=i=>{const x=i%nx,z=Math.floor(i/nx)%nz,y=Math.floor(i/(nx*nz));return [lo+x*dx,yl+y*dy,lo+z*dx]};
  function intersection(i,j){
    const low=Math.min(i,j),high=Math.max(i,j),key=low*N+high;
    if(edgeCache.has(key))return edgeCache.get(key);
    const a=coordinate(i),b=coordinate(j),t=field[i]/(field[i]-field[j]),idx=positions.length/3;
    positions.push(a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1]),a[2]+t*(b[2]-a[2]));edgeCache.set(key,idx);return idx;
  }
  function triangle(a,b,c,inside,outside){
    const ax=positions[a*3],ay=positions[a*3+1],az=positions[a*3+2];
    const ux=positions[b*3]-ax,uy=positions[b*3+1]-ay,uz=positions[b*3+2]-az;
    const vx=positions[c*3]-ax,vy=positions[c*3+1]-ay,vz=positions[c*3+2]-az;
    const normal=[uy*vz-uz*vy,uz*vx-ux*vz,ux*vy-uy*vx];
    if(normal[0]*(outside[0]-inside[0])+normal[1]*(outside[1]-inside[1])+normal[2]*(outside[2]-inside[2])<0)indices.push(a,c,b);else indices.push(a,b,c);
  }
  const tetrahedra=[[0,5,1,6],[0,1,2,6],[0,2,3,6],[0,3,7,6],[0,7,4,6],[0,4,5,6]];
  for(let y=0;y<ny;y++)for(let z=0;z<n;z++)for(let x=0;x<n;x++){
    const cube=[id(x,y,z),id(x+1,y,z),id(x+1,y,z+1),id(x,y,z+1),id(x,y+1,z),id(x+1,y+1,z),id(x+1,y+1,z+1),id(x,y+1,z+1)];
    let neg=0;for(const i of cube)if(field[i]<0)neg++;if(!neg||neg===8)continue;
    for(const tet of tetrahedra){
      const ins=[],outs=[];for(const k of tet)(field[cube[k]]<0?ins:outs).push(cube[k]);
      if(!ins.length||!outs.length)continue;
      const inside=coordinate(ins[0]),outside=coordinate(outs[0]);
      if(ins.length===1){const a=ins[0];triangle(intersection(a,outs[0]),intersection(a,outs[1]),intersection(a,outs[2]),inside,outside)}
      else if(outs.length===1){const a=outs[0];triangle(intersection(a,ins[0]),intersection(a,ins[1]),intersection(a,ins[2]),inside,outside)}
      else{
        const a=intersection(ins[0],outs[0]),b=intersection(ins[0],outs[1]),c=intersection(ins[1],outs[0]),d=intersection(ins[1],outs[1]);
        triangle(a,b,c,inside,outside);triangle(b,d,c,inside,outside);
      }
    }
  }
  const counts=new Map(),nv=positions.length/3;
  const parents=Int32Array.from({length:nv},(_,i)=>i);
  const root=i=>{while(parents[i]!==i){parents[i]=parents[parents[i]];i=parents[i]}return i};
  for(let i=0;i<indices.length;i+=3)for(let j=0;j<3;j++){
    const a=indices[i+j],b=indices[i+(j+1)%3],k=Math.min(a,b)*nv+Math.max(a,b);counts.set(k,(counts.get(k)||0)+1);parents[root(a)]=root(b);
  }
  const nonmanifold=[...counts.values()].filter(v=>v!==2).length;
  const chi=nv-counts.size+indices.length/3;
  const components=new Set(Array.from({length:nv},(_,i)=>root(i))).size;
  const validation={genus,shape:tetrahedral?'tetrahedral':wheel?'wheel':'petal',components,vertices:nv,edges:counts.size,faces:indices.length/3,eulerCharacteristic:chi,expectedEulerCharacteristic:2-2*genus,nonmanifoldEdges:nonmanifold};
  if(nonmanifold||components!==1||chi!==2-2*genus)throw new Error('Topological art mesh audit failed: '+JSON.stringify(validation));
  return {positions:new Float32Array(positions),indices:new Uint32Array(indices),validation};
}
function createArtSurfaceGeometry(THREE,genus=3,options={}){
  const data=createArtSurfaceData(genus,options),geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.BufferAttribute(data.positions,3));geometry.setIndex(new THREE.BufferAttribute(data.indices,1));geometry.computeVertexNormals();geometry.computeBoundingSphere();
  geometry.userData={topologicalModel:true,...data.validation};return geometry;
}
global.createArtSurfaceGeometry=createArtSurfaceGeometry;global.createArtSurfaceData=createArtSurfaceData;
})(M);


(function(global){'use strict';
const TAU=2*Math.PI;
function stabilizerModel(shape){
 const groups=[],tube=shape==='four-theta'?.16:.19,k=.038;
 const add=pts=>{const edges=[];for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],u=b.map((v,j)=>v-a[j]);edges.push([...a,...u,1/u.reduce((s,v)=>s+v*v,0)])}groups.push(edges)};
 const circle=(cx,cy,cz,r,tilt=0)=>Array.from({length:81},(_,i)=>{const t=i*TAU/80;return[cx+r*Math.cos(t),cy+r*Math.sin(t)*Math.sin(tilt),cz+r*Math.sin(t)*Math.cos(tilt)]});
 let action;
 if(shape==='three-chain'){
   const centers=[-1.78,0,1.82],radii=[.69,.79,.64];centers.forEach((x,i)=>add(circle(x,0,0,radii[i])));
   for(let i=0;i<2;i++)add([[centers[i]+radii[i],0,0],[centers[i+1]-radii[i+1],0,0]]);
   action={distinguishedAction:'Half-turn around the X axis',order:2,orientationPreserving:true,fixedSurfacePoints:8,quotientGenus:0,interpretation:'Hyperelliptic involution topological model; unequal handles avoid an artificial exchange of the two ends.'};
 }else if(shape==='bielliptic'){
   add(circle(0,0,0,.80));
   const north=circle(0,0,1.75,.64,.70),south=north.map(([x,y,z])=>[x,-y,-z]);add(north);add(south);
   const endpoint=north[60];add([[0,0,.80],endpoint]);add([[0,0,-.80],[endpoint[0],-endpoint[1],-endpoint[2]]]);
   action={distinguishedAction:'Half-turn around the X axis exchanges the tilted outer handles',order:2,orientationPreserving:true,fixedSurfacePoints:4,quotientGenus:1,interpretation:'Bielliptic involution topological model; the four fixed points lie on the central torus.'};
 }else if(shape==='four-theta'){
   for(let a=0;a<4;a++){const theta=a*Math.PI/2;add(Array.from({length:81},(_,i)=>{const t=i/80,r=.97*Math.sin(Math.PI*t);return[1.42*(2*t-1),r*Math.cos(theta),r*Math.sin(theta)]}))}
   action={distinguishedAction:'Three coordinate half-turns generating the ambient V4 rotation subgroup',orientationPreserving:true,representedOrder:4,interpretation:'Boundary of a thickened graph with 2 vertices and 4 edges. The drawn planes are invariant reference planes for the proper half-turns. The full holomorphic C₂³ action is supplied separately by sheet exchange and the exact lifted base involutions.'};
 }else throw new RangeError('Unknown stabilizer sculpture: '+shape);
 const all=groups.flat(),margin=tube+.16,lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];
 for(const e of all)for(let j=0;j<3;j++){lo[j]=Math.min(lo[j],e[j]-margin,e[j]+e[j+3]-margin);hi[j]=Math.max(hi[j],e[j]+margin,e[j]+e[j+3]+margin)}
 function field(x,y,z){
   let sum=0;for(const edges of groups){let best=Infinity;for(const e of edges){const vx=x-e[0],vy=y-e[1],vz=z-e[2],t=Math.max(0,Math.min(1,(vx*e[3]+vy*e[4]+vz*e[5])*e[6]));const a=vx-t*e[3],b=vy-t*e[4],c=vz-t*e[5],d=a*a+b*b+c*c;if(d<best)best=d}sum+=Math.exp(-(Math.sqrt(best)-tube)/k)}return-k*Math.log(sum);
 }
 if(shape!=='four-theta'){
   let roots=0,last=field(lo[0],0,0);for(let i=1;i<=5000;i++){const next=field(lo[0]+(hi[0]-lo[0])*i/5000,0,0);if(last*next<0)roots++;last=next}
   if(roots!==action.fixedSurfacePoints)throw new Error('Distinguished-action axis intersection check failed');
   let error=0;for(let i=0;i<100;i++){const x=Math.sin(i*1.17)*2,y=Math.sin(i*2.13)*.7,z=Math.cos(i*1.79)*2;error=Math.max(error,Math.abs(field(x,y,z)-field(x,-y,-z)))}
   if(error>1e-10)throw new Error('Half-turn symmetry check failed');action.axisIntersectionsVerified=roots;action.symmetryError=error;action.verification='Analytic invariant construction; fixed-axis intersections checked numerically.';
 }
 action.scope='This distinguished topological action does not certify the full automorphism group of a complex curve.';
 return{field,lo,hi,action};
}
function extract(model,resolution=64){
 const{field,lo,hi}=model,span=hi.map((x,i)=>x-lo[i]),step=Math.max(...span)/resolution,n=span.map(s=>Math.max(18,Math.ceil(s/step))),dims=n.map(v=>v+1),delta=span.map((s,i)=>s/n[i]);
 const N=dims[0]*dims[1]*dims[2],values=new Float64Array(N),positions=[],indices=[],cache=new Map();
 const id=(x,y,z)=>(z*dims[1]+y)*dims[0]+x;
 const coord=i=>{const x=i%dims[0],y=Math.floor(i/dims[0])%dims[1],z=Math.floor(i/(dims[0]*dims[1]));return[lo[0]+x*delta[0],lo[1]+y*delta[1],lo[2]+z*delta[2]]};
 for(let z=0;z<dims[2];z++)for(let y=0;y<dims[1];y++)for(let x=0;x<dims[0];x++)values[id(x,y,z)]=field(lo[0]+x*delta[0],lo[1]+y*delta[1],lo[2]+z*delta[2]);
 function vert(i,j){const a=Math.min(i,j),b=Math.max(i,j),key=a*N+b;if(cache.has(key))return cache.get(key);const p=coord(i),q=coord(j),t=values[i]/(values[i]-values[j]),index=positions.length/3;positions.push(...p.map((v,k)=>v+t*(q[k]-v)));cache.set(key,index);return index}
 function tri(a,b,c,inside,outside){const p=positions,ax=p[a*3],ay=p[a*3+1],az=p[a*3+2],ux=p[b*3]-ax,uy=p[b*3+1]-ay,uz=p[b*3+2]-az,vx=p[c*3]-ax,vy=p[c*3+1]-ay,vz=p[c*3+2]-az;if((uy*vz-uz*vy)*(outside[0]-inside[0])+(uz*vx-ux*vz)*(outside[1]-inside[1])+(ux*vy-uy*vx)*(outside[2]-inside[2])<0)indices.push(a,c,b);else indices.push(a,b,c)}
 const tets=[[0,5,1,6],[0,1,2,6],[0,2,3,6],[0,3,7,6],[0,7,4,6],[0,4,5,6]];
 for(let z=0;z<n[2];z++)for(let y=0;y<n[1];y++)for(let x=0;x<n[0];x++){
   const c=[id(x,y,z),id(x+1,y,z),id(x+1,y+1,z),id(x,y+1,z),id(x,y,z+1),id(x+1,y,z+1),id(x+1,y+1,z+1),id(x,y+1,z+1)];
   let count=0;for(const i of c)if(values[i]<0)count++;if(!count||count===8)continue;
   for(const t of tets){const ins=[],out=[];for(const k of t)(values[c[k]]<0?ins:out).push(c[k]);if(!ins.length||!out.length)continue;const ip=coord(ins[0]),op=coord(out[0]);if(ins.length===1)tri(...out.map(j=>vert(ins[0],j)),ip,op);else if(out.length===1)tri(...ins.map(j=>vert(out[0],j)),ip,op);else{const a=vert(ins[0],out[0]),b=vert(ins[0],out[1]),c=vert(ins[1],out[0]),d=vert(ins[1],out[1]);tri(a,b,c,ip,op);tri(b,d,c,ip,op)}}
 }
 const V=positions.length/3,counts=new Map(),parents=Int32Array.from({length:V},(_,i)=>i);const root=i=>{while(parents[i]!==i){parents[i]=parents[parents[i]];i=parents[i]}return i};
 for(let i=0;i<indices.length;i+=3)for(let j=0;j<3;j++){const a=indices[i+j],b=indices[i+(j+1)%3],key=Math.min(a,b)*V+Math.max(a,b);counts.set(key,(counts.get(key)||0)+1);parents[root(a)]=root(b)}
 const chi=V-counts.size+indices.length/3,components=new Set(Array.from({length:V},(_,i)=>root(i))).size,nonmanifoldEdges=[...counts.values()].filter(v=>v!==2).length;
 const validation={vertices:V,edges:counts.size,faces:indices.length/3,eulerCharacteristic:chi,genus:1-chi/2,components,nonmanifoldEdges};
 if(chi!==-4||components!==1||nonmanifoldEdges)throw new Error('Sculpture topology audit failed: '+JSON.stringify(validation));
 return{positions:new Float32Array(positions),indices:new Uint32Array(indices),validation,modelAction:model.action};
}
function createStabilizerSurfaceData(shape,options={}){
 if(shape==='chiral-wheel'){
   if(!global.createArtSurfaceData)throw new Error('Load art-surface.js first.');
   const data=global.createArtSurfaceData(3,{shape:'wheel',resolution:options.resolution||64}),R=1.45,A=.16;
   for(let i=0;i<data.positions.length;i+=3){const x=data.positions[i]/R,z=data.positions[i+2]/R,re3=x*x*x-3*x*z*z,im3=3*x*x*z-z*z*z;data.positions[i+1]+=A*(im3+.28*(re3*re3-im3*im3))}
   data.validation.shape=shape;data.modelAction={schematicOnly:true,notCompatibleWith:'N3: its order-3 action has five fixed points and quotient genus 0, whereas this ambient rotation has two fixed points and quotient genus 1.',distinguishedAction:'Rotation by 120° around Y',order:3,orientationPreserving:true,fixedSurfacePoints:2,quotientGenus:1,interpretation:'Three-fold height deformation sin(3θ)+0.28cos(6θ), with radial factors that make it smooth at the origin. The mixed harmonics remove the wheel half-turn symmetries.',scope:'A distinguished C₃ action only; the complex full stabilizer is not inferred.'};return data;
 }
 const data=extract(stabilizerModel(shape),options.resolution||64);data.validation.shape=shape;return data;
}
function createStabilizerSurfaceGeometry(THREE,shape,options={}){const data=createStabilizerSurfaceData(shape,options),g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(data.positions,3));g.setIndex(new THREE.BufferAttribute(data.indices,1));g.computeVertexNormals();g.computeBoundingSphere();g.userData={topologicalModel:true,...data.validation,modelAction:data.modelAction};return g}
global.createStabilizerSurfaceGeometry=createStabilizerSurfaceGeometry;global.createStabilizerSurfaceData=createStabilizerSurfaceData;
})(M);


(function(global){'use strict';
const TAU=2*Math.PI;
const styles={
 N3:{shape:'swept-wheel',scale:[1.03,.70,.97],shear:.045,bend:.035},
 N4:{shape:'upright-loops',scale:[.82,.92,1.16],shear:-.06,bend:.04},
 N8:{shape:'wheel',scale:[1.03,.89,.94],shear:.10,bend:.07},
 N6c:{shape:'chain',scale:[.85,.90,1.04],shear:.08,bend:.08},
 N16:{shape:'four-bridge',scale:[1.11,.86,.98],shear:-.08,bend:.045},
 N9:{shape:'triskelion',scale:[.93,.84,1.08],shear:.12,bend:.11},
 N48:{shape:'upright-loops',scale:[.97,.86,.98],shear:.08,bend:-.07},
 N96:{shape:'wheel',scale:[1.09,.82,1.02],shear:-.06,bend:.055},
 H4v:{shape:'chain',scale:[.96,.87,1.14],shear:.05,bend:.035},
 H4c:{shape:'upright-loops',scale:[.88,1.08,1.06],shear:.12,bend:-.04},
 H8c:{shape:'four-bridge',scale:[.95,1.03,1.12],shear:.14,bend:.08},
 H12:{shape:'wheel',scale:[.98,1.0,1.08],shear:.11,bend:-.06},
 H16:{shape:'chain',scale:[1.02,.96,.96],shear:-.09,bend:.09},
 H14:{shape:'triskelion',scale:[.96,.91,1.04],shear:-.13,bend:-.08},
 H24:{shape:'upright-loops',scale:[1.02,.87,.93],shear:-.11,bend:.07},
 H32:{shape:'four-bridge',scale:[1.06,.82,1.05],shear:.035,bend:-.08},
 H48:{shape:'wheel',scale:[1.03,.95,.96],shear:-.12,bend:.10},
 H2:{shape:'chain',scale:[.94,.88,1.03],shear:.065,bend:.035},
 H8v:{shape:'four-bridge',scale:[1.04,.95,1.01],shear:.07,bend:.04},
 N1:{shape:'triskelion',scale:[1.06,.93,.91],shear:.17,bend:.12},
 N2:{shape:'chain',scale:[.88,.98,1.11],shear:-.12,bend:.08},
 N24:{shape:'wheel',scale:[1.0,.93,1.0],shear:.025,bend:.025},
 N168:{shape:'four-bridge',scale:[.94,.94,1.18],shear:-.12,bend:.07}
};


styles.N6s={shape:'wheel',scale:[1.01,.90,1.0],shear:.04,bend:.04};
function roundedMinimum(values,k){let m=Infinity;for(const v of values)m=Math.min(m,v);let sum=0;for(const v of values)sum+=Math.exp((m-v)/k);return m-k*Math.log(sum)}
function ellipseTube(x,y,z,cx,cz,a,b,theta,tube){
 const dx=x-cx,dz=z-cz,c=Math.cos(theta),s=Math.sin(theta),u=c*dx+s*dz,v=-s*dx+c*dz;
 const radial=(Math.hypot(u/a,v/b)-1)*b;
 return Math.hypot(radial,y)-tube;
}
function capsule(x,y,z,ax,az,bx,bz,r){const ux=bx-ax,uz=bz-az,t=Math.max(0,Math.min(1,((x-ax)*ux+(z-az)*uz)/(ux*ux+uz*uz)));return Math.hypot(x-ax-t*ux,y,z-az-t*uz)-r}
function uniformEllipseTube(x,y,z,a,b,tube){const r=Math.hypot(x/a,z/b),gradient=r>1e-8?Math.hypot(x/(a*a),z/(b*b))/r:1/Math.min(a,b),distance=(r-1)/gradient;return Math.hypot(distance,y)-tube}
function makeModel(shape){
 const tube=.185,k=.052,loops=[],curvedSpokes=[],planarCache=new Map();
 let bounds=[[-2.65,-.57,-2.65],[2.65,.57,2.65]],spine;
 if(shape==='triskelion'){


   for(let i=0;i<3;i++){const t=-Math.PI/2+i*TAU/3+[0,.035,-.025][i],c=[1.09,1.14,1.04][i];loops.push([c*Math.cos(t),c*Math.sin(t),[.91,.94,.88][i],[.59,.61,.57][i],t])}
   spine={kind:'three loops joined through one rounded hub',vertices:1,edges:3,cycleRank:3,holes:3};
 }else if(shape==='upright-loops'){
   for(const [t,c,a,b]of [[Math.PI/2,1.17,.97,.54],[-Math.PI/2,1.10,.92,.56],[0,1.12,.91,.56]])loops.push([c*Math.cos(t),c*Math.sin(t),a,b,t]);
   bounds=[[-.95,-.57,-2.60],[2.60,.57,2.70]];
   spine={kind:'upper, lower and lateral loops joined at a rounded hub',vertices:1,edges:3,cycleRank:3,holes:3};
 }else if(shape==='chain'){
   bounds=[[-2.63,-.55,-1.12],[2.65,.55,1.12]];
   spine={kind:'three separate circles connected by two bridge edges',vertices:3,edges:5,cycleRank:3,holes:3};
 }else if(shape==='four-bridge'){
   bounds=[[-2.53,-.55,-1.72],[2.53,.55,1.72]];
   spine={kind:'four arcs connecting two vertices',vertices:2,edges:4,cycleRank:3,holes:3};
 }else if(shape==='swept-wheel'){
   bounds=[[-1.90,-.55,-1.90],[1.90,.55,1.90]];


   for(let i=0;i<3;i++){
     const theta=-Math.PI/2+i*TAU/3+[0,.030,-.026][i],phi=[.64,.58,.68][i],r=1.36;
     const control=[.91*Math.cos(theta+phi),.91*Math.sin(theta+phi)],end=[r*Math.cos(theta),r*Math.sin(theta)];
     const points=Array.from({length:49},(_,j)=>{const t=j/48;return[2*(1-t)*t*control[0]+t*t*end[0],2*(1-t)*t*control[1]+t*t*end[1]]}),edges=[];
     for(let j=0;j<48;j++){const a=points[j],b=points[j+1],dx=b[0]-a[0],dz=b[1]-a[1];edges.push([a[0],a[1],dx,dz,1/(dx*dx+dz*dz)])}curvedSpokes.push(edges);
   }
   spine={kind:'circular outer rim with three swept curved spokes',vertices:4,edges:6,cycleRank:3,holes:3,ambientC3Symmetry:false};
 }else if(shape==='wheel'){
   bounds=[[-1.90,-.55,-1.90],[1.90,.55,1.90]];
   spine={kind:'outer circle with three radial edges and a central vertex',vertices:4,edges:6,cycleRank:3,holes:3};
 }else throw Error('Unknown rounded specimen shape '+shape);
 function field(x,y,z){
   if(curvedSpokes.length){


     const key=x+','+z;let planar=planarCache.get(key);
     if(!planar){planar=curvedSpokes.map(edges=>{let best=Infinity;for(const e of edges){const vx=x-e[0],vz=z-e[1],t=Math.max(0,Math.min(1,(vx*e[2]+vz*e[3])*e[4])),dx=vx-t*e[2],dz=vz-t*e[3];best=Math.min(best,dx*dx+dz*dz)}return best});planarCache.set(key,planar)}
     const ds=planar.map(d=>Math.sqrt(d+y*y)-.185);ds.push(Math.hypot(Math.hypot(x,z)-1.36,y)-.20);return roundedMinimum(ds,.052);
   }
   if(loops.length){const ds=loops.map(([cx,cz,a,b,t])=>ellipseTube(x,y,z,cx,cz,a,b,t,tube));ds.push(Math.hypot(x,y,z)-.35);return roundedMinimum(ds,k)}
   if(shape==='chain'){
     const c=[-1.65,0,1.68],r=[.65,.74,.62],ds=c.map((cx,i)=>Math.hypot(Math.hypot(x-cx,z)-r[i],y)-tube);
     for(let i=0;i<2;i++)ds.push(capsule(x,y,z,c[i]+r[i],0,c[i+1]-r[i+1],0,tube));return roundedMinimum(ds,k);
   }
   if(shape==='four-bridge')return roundedMinimum([uniformEllipseTube(x,y,z,1.65,1.28,.17),uniformEllipseTube(x,y,z,1.65,.48,.155)],.045);
   const r=1.36,ds=[Math.hypot(Math.hypot(x,z)-r,y)-.20];
   for(let i=0;i<3;i++){const t=-Math.PI/2+i*TAU/3;ds.push(capsule(x,y,z,0,0,r*Math.cos(t),r*Math.sin(t),.20))}return roundedMinimum(ds,.054);
 }
 return {field,lo:bounds[0],hi:bounds[1],spine};
}
function extract(model,resolution){
 const field=model.field,lo=model.lo.map((v,i)=>v+[.004719,.003127,.005839][i]),hi=model.hi.map((v,i)=>v+[.004719,.003127,.005839][i]),span=hi.map((v,i)=>v-lo[i]),step=Math.max(...span)/resolution,n=span.map(s=>Math.max(22,Math.ceil(s/step))),dims=n.map(v=>v+1),delta=span.map((s,i)=>s/n[i]),N=dims[0]*dims[1]*dims[2];
 const values=new Float64Array(N),positions=[],indices=[],cache=new Map();let boundaryMin=Infinity;
 const id=(x,y,z)=>(z*dims[1]+y)*dims[0]+x;
 const coord=i=>{const x=i%dims[0],y=Math.floor(i/dims[0])%dims[1],z=Math.floor(i/(dims[0]*dims[1]));return[lo[0]+x*delta[0],lo[1]+y*delta[1],lo[2]+z*delta[2]]};
 for(let z=0;z<dims[2];z++)for(let y=0;y<dims[1];y++)for(let x=0;x<dims[0];x++){const f=field(lo[0]+x*delta[0],lo[1]+y*delta[1],lo[2]+z*delta[2]);values[id(x,y,z)]=f;if(!x||!y||!z||x===n[0]||y===n[1]||z===n[2])boundaryMin=Math.min(boundaryMin,f)}
 if(boundaryMin<=0)throw Error('Surface reaches extraction boundary.');
 function vertex(i,j){const a=Math.min(i,j),b=Math.max(i,j),key=a*N+b;if(cache.has(key))return cache.get(key);const p=coord(i),q=coord(j),t=values[i]/(values[i]-values[j]),index=positions.length/3;positions.push(...p.map((v,k)=>v+t*(q[k]-v)));cache.set(key,index);return index}
 function triangle(a,b,c,inside,outside){const p=positions,ax=p[3*a],ay=p[3*a+1],az=p[3*a+2],ux=p[3*b]-ax,uy=p[3*b+1]-ay,uz=p[3*b+2]-az,vx=p[3*c]-ax,vy=p[3*c+1]-ay,vz=p[3*c+2]-az;const sign=(uy*vz-uz*vy)*(outside[0]-inside[0])+(uz*vx-ux*vz)*(outside[1]-inside[1])+(ux*vy-uy*vx)*(outside[2]-inside[2]);indices.push(a,...(sign<0?[c,b]:[b,c]))}
 const tets=[[0,5,1,6],[0,1,2,6],[0,2,3,6],[0,3,7,6],[0,7,4,6],[0,4,5,6]];
 for(let z=0;z<n[2];z++)for(let y=0;y<n[1];y++)for(let x=0;x<n[0];x++){
   const c=[id(x,y,z),id(x+1,y,z),id(x+1,y+1,z),id(x,y+1,z),id(x,y,z+1),id(x+1,y,z+1),id(x+1,y+1,z+1),id(x,y+1,z+1)];let neg=0;for(const v of c)if(values[v]<0)neg++;if(!neg||neg===8)continue;
   for(const t of tets){const ins=[],out=[];for(const v of t)(values[c[v]]<0?ins:out).push(c[v]);if(!ins.length||!out.length)continue;const ip=coord(ins[0]),op=coord(out[0]);if(ins.length===1)triangle(...out.map(v=>vertex(ins[0],v)),ip,op);else if(out.length===1)triangle(...ins.map(v=>vertex(out[0],v)),ip,op);else{const a=vertex(ins[0],out[0]),b=vertex(ins[0],out[1]),c=vertex(ins[1],out[0]),d=vertex(ins[1],out[1]);triangle(a,b,c,ip,op);triangle(b,d,c,ip,op)}}
 }
 return {positions,indices,grid:n,boundaryMin};
}
function audit(positions,indices){
 const V=positions.length/3,edges=new Map(),parents=Int32Array.from({length:V},(_,i)=>i),links=Array.from({length:V},()=>new Map());
 const root=i=>{while(parents[i]!==i){parents[i]=parents[parents[i]];i=parents[i]}return i};let minArea=Infinity,signedVolume=0,degenerateFaces=0;
 function link(v,a,b){const m=links[v];if(!m.has(a))m.set(a,new Set());if(!m.has(b))m.set(b,new Set());m.get(a).add(b);m.get(b).add(a)}
 for(let i=0;i<indices.length;i+=3){const a=indices[i],b=indices[i+1],c=indices[i+2],ax=positions[a*3],ay=positions[a*3+1],az=positions[a*3+2],bx=positions[b*3],by=positions[b*3+1],bz=positions[b*3+2],cx=positions[c*3],cy=positions[c*3+1],cz=positions[c*3+2],ux=bx-ax,uy=by-ay,uz=bz-az,vx=cx-ax,vy=cy-ay,vz=cz-az,area=Math.hypot(uy*vz-uz*vy,uz*vx-ux*vz,ux*vy-uy*vx);minArea=Math.min(minArea,area);if(area===0||!Number.isFinite(area))degenerateFaces++;signedVolume+=(ax*(by*cz-bz*cy)+ay*(bz*cx-bx*cz)+az*(bx*cy-by*cx))/6;
   for(let j=0;j<3;j++){const u=indices[i+j],v=indices[i+(j+1)%3],k=Math.min(u,v)*V+Math.max(u,v);if(!edges.has(k))edges.set(k,{count:0,balance:0});const e=edges.get(k);e.count++;e.balance+=u<v?1:-1;parents[root(u)]=root(v)}link(a,b,c);link(b,c,a);link(c,a,b);
 }
 let badLinks=0;for(const m of links){if(!m.size||[...m.values()].some(s=>s.size!==2)){badLinks++;continue}const start=m.keys().next().value,seen=new Set([start]),todo=[start];while(todo.length)for(const v of m.get(todo.pop()))if(!seen.has(v)){seen.add(v);todo.push(v)}if(seen.size!==m.size)badLinks++}
 const E=edges.size,F=indices.length/3,chi=V-E+F,components=new Set(Array.from({length:V},(_,i)=>root(i))).size,nonmanifoldEdges=[...edges.values()].filter(e=>e.count!==2).length,orientationConflicts=[...edges.values()].filter(e=>e.balance!==0).length;
 const result={vertices:V,edges:E,faces:F,eulerCharacteristic:chi,genus:1-chi/2,components,nonmanifoldEdges,orientationConflicts,badVertexLinks:badLinks,degenerateFaces,minTwiceTriangleArea:minArea,signedVolume,closed:nonmanifoldEdges===0,orientable:orientationConflicts===0,allVertexLinksCircles:badLinks===0};
 result.passed=chi===-4&&components===1&&!nonmanifoldEdges&&!orientationConflicts&&!badLinks&&!degenerateFaces&&signedVolume>0;
 if(!result.passed)throw Error('Rounded specimen audit failed: '+JSON.stringify(result));return result;
}
function auditAffineCopy(positions,indices,base){
 let minArea=Infinity,signedVolume=0,degenerateFaces=0;
 for(let i=0;i<indices.length;i+=3){const a=indices[i]*3,b=indices[i+1]*3,c=indices[i+2]*3,ax=positions[a],ay=positions[a+1],az=positions[a+2],bx=positions[b],by=positions[b+1],bz=positions[b+2],cx=positions[c],cy=positions[c+1],cz=positions[c+2],ux=bx-ax,uy=by-ay,uz=bz-az,vx=cx-ax,vy=cy-ay,vz=cz-az,area=Math.hypot(uy*vz-uz*vy,uz*vx-ux*vz,ux*vy-uy*vx);minArea=Math.min(minArea,area);if(area===0||!Number.isFinite(area))degenerateFaces++;signedVolume+=(ax*(by*cz-bz*cy)+ay*(bz*cx-bx*cz)+az*(bx*cy-by*cx))/6}
 if(degenerateFaces||signedVolume<=0)throw Error('Affine Float32 copy has a degenerate face.');
 return {...base,minTwiceTriangleArea:minArea,signedVolume,degenerateFaces,combinatoricsReusedFromAuditedBase:true};
}
const cache=new Map();
function createSmoothSpecimenData(id,options={}){
 const style=styles[id];if(!style)throw Error('Unknown genus-three specimen '+id);
 const resolution=Math.max(48,Math.min(128,Math.round(options.resolution||80))),key=style.shape+':'+resolution;
 let base=cache.get(key);if(!base){const model=makeModel(style.shape);base={...extract(model,resolution),spine:model.spine};base.validation=audit(base.positions,base.indices);cache.set(key,base)}
 const positions=new Float32Array(base.positions.length),[sx,sy,sz]=style.scale;
 for(let i=0;i<positions.length;i+=3){const x=base.positions[i],y=base.positions[i+1],z=base.positions[i+2];positions[i]=sx*x+style.shear*z;positions[i+1]=sy*y+style.bend*x;positions[i+2]=sz*z}




 const validation=auditAffineCopy(positions,base.indices,base.validation);
 return {positions,indices:new Uint32Array(base.indices),validation:{...validation,familyId:id,shape:style.shape,resolution,grid:base.grid,extractionBoundaryMargin:base.boundaryMin,spine:base.spine,positiveDeformationJacobian:sx*sy*sz},scope:'A smooth-shaded embedded topological genus-three sculpture. The complex structure and full holomorphic automorphism action are supplied separately by the equation and exact covering construction. No ambient rigid symmetry is asserted.',embedding:{construction:'Conforming marching tetrahedra at a regular PL level; shared grid-edge intersections are welded.',deformation:'Global invertible affine triangular shear with positive constant Jacobian.',claim:'The extracted PL mesh is embedded by construction; the affine deformation preserves this embedding. Smooth shading does not change its geometry. Numeric coordinates have Float32 precision.',selfIntersectionPairTestPerformed:false}};
}
function createSmoothSpecimenGeometry(THREE,id,options={}){const data=createSmoothSpecimenData(id,options),geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(data.positions,3));geometry.setIndex(new THREE.BufferAttribute(data.indices,1));geometry.computeVertexNormals();geometry.computeBoundingBox();geometry.computeBoundingSphere();geometry.userData={topologicalModel:true,smoothSpecimen:true,...data.validation,modelAction:{schematicOnly:true,rigidActionClaim:false,scope:data.scope},embedding:data.embedding};return geometry}
global.createSmoothSpecimenData=createSmoothSpecimenData;global.createSmoothSpecimenGeometry=createSmoothSpecimenGeometry;global.SMOOTH_SPECIMEN_STYLES=styles;
})(M);


(function(global){
  'use strict';
  const mod=n=>((n%7)+7)%7;
  const canon=m=>{const a=m.map(mod),b=a.map(n=>mod(-n));return a.join('')<b.join('')?a:b};
  const key=m=>canon(m).join(',');
  const multiply=(a,b)=>canon([a[0]*b[0]+a[1]*b[2],a[0]*b[1]+a[1]*b[3],a[2]*b[0]+a[3]*b[2],a[2]*b[1]+a[3]*b[3]]);
  const I=[1,0,0,1],S=canon([0,-1,1,0]),R=canon([0,-1,1,1]),T=multiply(S,R);
  const matrices=[],keys=new Set();
  for(let a=0;a<7;a++)for(let b=0;b<7;b++)for(let c=0;c<7;c++)for(let d=0;d<7;d++){
    if(mod(a*d-b*c)!==1)continue;
    const m=canon([a,b,c,d]),k=m.join(',');if(keys.has(k))continue;keys.add(k);matrices.push(m);
  }
  matrices.sort((a,b)=>a.join('').localeCompare(b.join('')));
  const index=new Map(matrices.map((m,i)=>[m.join(','),i]));
  const right=(g,h)=>index.get(key(multiply(matrices[g],h)));
  const left=(h,g)=>index.get(key(multiply(h,matrices[g])));
  const identity=index.get(key(I));
  function partition(h,order){
    const orbits=[],map=Array(168).fill(-1);
    for(let g=0;g<168;g++){
      if(map[g]!==-1)continue;
      const orbit=[];let next=g;
      for(let k=0;k<order;k++){orbit.push(next);map[next]=orbits.length;next=right(next,h)}
      if(next!==g||new Set(orbit).size!==order)throw new Error('Incorrect coset order.');
      orbits.push(orbit);
    }
    return {orbits,map};
  }
  const vp=partition(T,7),ep=partition(S,2),fp=partition(R,3);
  const faces=fp.orbits.map(ds=>ds.map(d=>vp.map[d]));
  const edges=ep.orbits.map(ds=>ds.map(d=>vp.map[d]));
  const darts=matrices.map((_,id)=>({id,origin:vp.map[id],destination:vp.map[right(id,R)],edge:ep.map[id],face:fp.map[id],reverse:right(id,S),next:right(id,R)}));
  const vertices=vp.orbits.map((ds,id)=>({id,darts:ds,neighbors:ds.map(d=>darts[d].destination),edges:ds.map(d=>darts[d].edge),faces:ds.map(d=>darts[d].face)}));
  const edgeFaces=ep.orbits.map(ds=>ds.map(d=>fp.map[d]));
  const faceEdges=fp.orbits.map(ds=>ds.map(d=>ep.map[d]));
  function permutation(h){
    return {
      darts:matrices.map((_,g)=>left(h,g)),
      vertices:vp.orbits.map(ds=>vp.map[left(h,ds[0])]),
      edges:ep.orbits.map(ds=>ep.map[left(h,ds[0])]),
      faces:fp.orbits.map(ds=>fp.map[left(h,ds[0])])
    };
  }
  function cycles(perm){
    const found=[],seen=new Set();for(let i=0;i<perm.length;i++){
      if(seen.has(i))continue;const cycle=[];let j=i;do{seen.add(j);cycle.push(j);j=perm[j]}while(j!==i);found.push(cycle);
    }return found;
  }
  function generator(name,matrix,order,description){
    const permutations=permutation(matrix);
    return {name,matrix,order,description,permutations,cycles:{vertices:cycles(permutations.vertices),edges:cycles(permutations.edges),faces:cycles(permutations.faces)}};
  }
  const generators={
    S:generator('S',S,2,'An involution; fixes 4 edge midpoints on the Klein surface.'),
    R:generator('R',R,3,'Order 3; fixes 2 face centers on the Klein surface.'),
    T:generator('T = SR',T,7,'Order 7; fixes 3 vertices on the Klein surface.')
  };
  function assert(condition,message){if(!condition)throw new Error('Klein quotient audit: '+message)}
  function sorted(a){return a.slice().sort((x,y)=>x-y).join(',')}
  function orientedEqual(a,b){return a.some((_,k)=>a.every((x,j)=>x===b[(j+k)%a.length]))}
  function audit(){
    assert(matrices.length===168,'group cardinality');assert(vertices.length===24&&edges.length===84&&faces.length===56,'cell counts');
    const euler=vertices.length-edges.length+faces.length;assert(euler===-4,'Euler characteristic');
    assert(new Set(edges.map(sorted)).size===84,'distinct simple edges');
    assert(new Set(faces.map(sorted)).size===56,'distinct triangles');
    for(const f of faces)assert(new Set(f).size===3,'triangle has three different corners');
    for(const v of vertices)assert(new Set(v.neighbors).size===7,'vertex valence 7');
    for(const d of darts){
      const rev=darts[d.reverse];assert(rev.reverse===d.id,'opposite dart involution');
      assert(rev.origin===d.destination&&rev.destination===d.origin,'edge orientations agree');
      assert(d.face!==rev.face,'edge separates two distinct faces');
    }
    for(const v of vertices){

      const link=new Map();
      for(const f of faces){const k=f.indexOf(v.id);if(k===-1)continue;const a=f[(k+1)%3],b=f[(k+2)%3];
        if(!link.has(a))link.set(a,[]);if(!link.has(b))link.set(b,[]);link.get(a).push(b);link.get(b).push(a);
      }
      assert(link.size===7&&[...link.values()].every(ns=>ns.length===2),'vertex link degrees');
      const visited=new Set(),stack=[...link.keys()].slice(0,1);while(stack.length){const n=stack.pop();if(visited.has(n))continue;visited.add(n);stack.push(...link.get(n).filter(k=>!visited.has(k)))}
      assert(visited.size===7,'connected vertex link');
    }
    for(const [name,g]of Object.entries(generators)){
      for(const perm of Object.values(g.permutations)){assert(new Set(perm).size===perm.length,name+' bijection');
        for(let i=0;i<perm.length;i++){let j=i;for(let k=0;k<g.order;k++)j=perm[j];assert(j===i,name+' order');}}
      for(let i=0;i<faces.length;i++)assert(orientedEqual(faces[i].map(v=>g.permutations.vertices[v]),faces[g.permutations.faces[i]]),name+' preserves oriented faces');
      for(let i=0;i<edges.length;i++)assert(sorted(edges[i].map(v=>g.permutations.vertices[v]))===sorted(edges[g.permutations.edges[i]]),name+' preserves edges');
    }

    const generated=new Set([identity]),queue=[identity];for(let k=0;k<queue.length;k++)for(const h of [S,R]){const n=right(queue[k],h);if(!generated.has(n)){generated.add(n);queue.push(n)}}
    assert(generated.size===168,'S,R generate PSL(2,7)');
    const fixed={S:generators.S.permutations.edges.filter((v,i)=>v===i).length,R:generators.R.permutations.faces.filter((v,i)=>v===i).length,T:generators.T.permutations.vertices.filter((v,i)=>v===i).length};
    assert(fixed.S===4&&fixed.R===2&&fixed.T===3,'fixed special points');
    return {passed:true,groupOrder:168,vertices:24,edges:84,faces:56,eulerCharacteristic:euler,genus:1-euler/2,oriented:true,vertexValence:7,vertexLinks:'24 cycles of length 7',fixedSpecialPoints:fixed};
  }
  const data={
    name:'Klein quartic regular map',symbol:'{3,7}',dualSymbol:'{7,3}',field:'F_7',group:'PSL(2,7)',groupOrder:168,genus:3,
    equation:'x³y + y³z + z³x = 0',
    quotientOrbifold:{genus:0,signature:[2,3,7],branchOrbitSizes:[84,56,24],riemannHurwitz:'4 = 168(−2 + 1/2 + 2/3 + 6/7)'},
    metric:{curvature:-1,surfaceArea:'8π',triangleArea:'π/7',heptagonArea:'π/3',coxeterChamberArea:'π/42',coxeterChambers:336},
    vertices,edges,faces,darts,edgeFaces,faceEdges,matrices,identity,generators,
    modelNote:'Exact finite combinatorial quotient; no Euclidean embedding or hyperbolic coordinate realization is asserted.',
    sources:['https://www.gregegan.net/SCIENCE/KleinQuartic/KleinQuartic.html','https://math.ucr.edu/home/baez/klein.html'],
    audit,permutationForMatrix:permutation,

    dual:{vertices:faces.map((_,id)=>({id})),edges:edgeFaces,faces:vertices.map(v=>v.faces)}
  };
  data.validation=audit();global.KLEIN_QUOTIENT=data;
})(M);


(function(global){'use strict';
const m7=n=>((n%7)+7)%7;
const canonical=m=>{const a=m.map(m7),b=a.map(x=>m7(-x));return a.join('')<b.join('')?a:b};
const prod=(a,b)=>canonical([a[0]*b[0]+a[1]*b[2],a[0]*b[1]+a[1]*b[3],a[2]*b[0]+a[3]*b[2],a[2]*b[1]+a[3]*b[3]]);
const key=m=>m.join(',');
const eye3=[1,0,0,0,1,0,0,0,1];
const mul3=(a,b)=>Array.from({length:9},(_,i)=>{const r=Math.floor(i/3),c=i%3;return a[r*3]*b[c]+a[r*3+1]*b[c+3]+a[r*3+2]*b[c+6]});
const apply3=(a,v)=>[a[0]*v[0]+a[1]*v[1]+a[2]*v[2],a[3]*v[0]+a[4]*v[1]+a[5]*v[2],a[6]*v[0]+a[7]*v[1]+a[8]*v[2]];
function constructPlacement(){
 const Q=global.KLEIN_QUOTIENT;if(!Q)throw new Error('Load klein-quotient.js before klein-surface.js.');
 const mats=Q.matrices,index=new Map(mats.map((m,i)=>[key(m),i])),identity=index.get('1,0,0,1');
 const multiply=(i,j)=>index.get(key(prod(mats[i],mats[j])));
 const order=i=>{let p=identity;for(let n=1;n<=168;n++){p=multiply(p,i);if(p===identity)return n}return 0};
 const fours=mats.map((_,i)=>i).filter(i=>order(i)===4),threes=mats.map((_,i)=>i).filter(i=>order(i)===3);
 const A=[0,-1,0,1,0,0,0,0,1],B=[0,0,1,1,0,0,0,1,0];let found=null;
 outer:for(const a of fours)for(const b of threes){
   if(order(multiply(a,b))!==2)continue;
   const elements=[identity],rotations=[eye3],known=new Map([[identity,0]]);let consistent=true;
   for(let cursor=0;cursor<elements.length&&elements.length<=24;cursor++)for(const[g,R]of[[a,A],[b,B]]){
     const h=multiply(g,elements[cursor]),rotation=mul3(R,rotations[cursor]);
     if(known.has(h)){if(key(rotation)!==key(rotations[known.get(h)]))consistent=false}else{known.set(h,elements.length);elements.push(h);rotations.push(rotation)}
   }
   if(consistent&&elements.length===24){found={a,b,elements,rotations};break outer}
 }
 if(!found)throw new Error('Could not identify octahedral S4 subgroup.');
 const seed=[1,.54,.17],ps=Array(24),assigned=new Set();
 found.elements.forEach((h,i)=>{const v=Q.permutationForMatrix(mats[h]).vertices[0];if(assigned.has(v))throw new Error('S4 is not free on Klein vertices.');assigned.add(v);ps[v]=apply3(found.rotations[i],seed)});
 if(assigned.size!==24)throw new Error('Incomplete Klein placement.');
 return{positions:ps,subgroup:{order:24,generators:[mats[found.a],mats[found.b]],rotations:[A,B],vertexPermutations:[Q.permutationForMatrix(mats[found.a]).vertices,Q.permutationForMatrix(mats[found.b]).vertices]},Q};
}
function createKleinSurfaceData(options={}){
 const placement=constructPlacement(),Q=placement.Q,radius=options.radius||1.90,subdivisions=Math.max(0,Math.min(4,options.subdivisions??3)),rounding=options.rounding??.62;
 const factor=radius/Math.hypot(...placement.positions[0]);
 let ps=placement.positions.map(p=>p.map(x=>x*factor)),fs=Q.faces.map(f=>f.slice()),baseFace=fs.map((_,i)=>i);
 let generators=Object.fromEntries(Object.entries(Q.generators).map(([name,g])=>[name,{order:g.order,vertexPermutation:g.permutations.vertices.slice()}]));
 let subgroupPerms=placement.subgroup.vertexPermutations.map(p=>p.slice());
 let seams=Q.edges.map(e=>e.slice());
 for(let round=0;round<subdivisions;round++){
   const edges=new Map(),neighbors=ps.map(()=>new Set());
   for(const f of fs)for(let j=0;j<3;j++){const a=f[j],b=f[(j+1)%3],c=f[(j+2)%3],k=[a,b].sort((x,y)=>x-y).join(',');if(!edges.has(k))edges.set(k,{a,b,opposite:[],id:ps.length+edges.size});edges.get(k).opposite.push(c);neighbors[a].add(b);neighbors[b].add(a)}
   const next=ps.map((p,i)=>{const ns=[...neighbors[i]],beta=(ns.length===3?3/16:3/(8*ns.length))*rounding;return p.map((x,k)=>x*(1-ns.length*beta)+beta*ns.reduce((s,j)=>s+ps[j][k],0))});
   for(const e of edges.values()){const alpha=.125*rounding;next[e.id]=[0,1,2].map(k=>(ps[e.a][k]+ps[e.b][k])*(.5-alpha)+alpha*e.opposite.reduce((s,j)=>s+ps[j][k],0))}
   const extend=perm=>{const result=perm.slice();for(const e of edges.values())result[e.id]=edges.get([perm[e.a],perm[e.b]].sort((x,y)=>x-y).join(',')).id;return result};
   for(const g of Object.values(generators))g.vertexPermutation=extend(g.vertexPermutation);subgroupPerms=subgroupPerms.map(extend);
   const edgeId=(a,b)=>edges.get([a,b].sort((x,y)=>x-y).join(',')).id,nextFaces=[],nextBase=[];
   for(let i=0;i<fs.length;i++){const[a,b,c]=fs[i],ab=edgeId(a,b),bc=edgeId(b,c),ca=edgeId(c,a);nextFaces.push([a,ab,ca],[b,bc,ab],[c,ca,bc],[ab,bc,ca]);nextBase.push(...Array(4).fill(baseFace[i]))}
   seams=seams.map(path=>{const next=[];for(let i=0;i<path.length-1;i++)next.push(path[i],edgeId(path[i],path[i+1]));next.push(path[path.length-1]);return next});
   ps=next;fs=nextFaces;baseFace=nextBase;
 }

 const maxRadius=Math.max(...ps.map(p=>Math.hypot(...p))),scale=radius/maxRadius;ps=ps.map(p=>p.map(v=>v*scale));
 const faceIndex=new Map(fs.map((f,i)=>[f.slice().sort((a,b)=>a-b).join(','),i]));
 for(const g of Object.values(generators))g.facePermutation=fs.map(f=>faceIndex.get(f.map(v=>g.vertexPermutation[v]).sort((a,b)=>a-b).join(',')));
 const edgeCounts=new Map();for(const f of fs)for(let j=0;j<3;j++){const k=[f[j],f[(j+1)%3]].sort((a,b)=>a-b).join(',');edgeCounts.set(k,(edgeCounts.get(k)||0)+1)}
 const chi=ps.length-edgeCounts.size+fs.length,nonmanifoldEdges=[...edgeCounts.values()].filter(x=>x!==2).length;
 let actionErrors=0;for(const g of Object.values(generators))for(let i=0;i<ps.length;i++){let j=i;for(let k=0;k<g.order;k++)j=g.vertexPermutation[j];if(j!==i)actionErrors++}
 let rigidError=0;for(let g=0;g<2;g++)for(let i=0;i<ps.length;i++){const p=apply3(placement.subgroup.rotations[g],ps[i]),q=ps[subgroupPerms[g][i]];rigidError=Math.max(rigidError,Math.hypot(p[0]-q[0],p[1]-q[1],p[2]-q[2]))}
 const validation={vertices:ps.length,edges:edgeCounts.size,faces:fs.length,eulerCharacteristic:chi,genus:1-chi/2,nonmanifoldEdges,actionErrors,rigidSubgroupOrder:24,rigidSymmetryError:rigidError,coarse:{vertices:24,edges:84,faces:56},fullCombinatorialGroupOrder:168,embeddingCertified:false};
 if(chi!==-4||nonmanifoldEdges||actionErrors||rigidError>1e-9)throw new Error('Klein sculpture audit failed: '+JSON.stringify(validation));
 return{positions:ps,faces:fs,seams,baseFace,generators,rigidSubgroup:{...placement.subgroup,vertexPermutations:subgroupPerms},validation};
}
function createKleinSurfaceGeometry(THREE,options={}){
 const data=createKleinSurfaceData(options),geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(data.positions.flat(),3));geometry.setIndex(data.faces.flat());geometry.computeVertexNormals();geometry.computeBoundingSphere();
 geometry.userData={...data.validation,topologicalModel:true,construction:'Exact finite Klein map with rounded subdivision',drawing:'Possibly self-intersecting octahedral placement; no conformal or Euclidean embedding is asserted.',generators:data.generators,rigidSubgroup:data.rigidSubgroup,seamPaths:data.seams.map(path=>path.map(i=>new THREE.Vector3(...data.positions[i]))),coarseFaceOfTriangle:data.baseFace,modelAction:{fullGroup:'PSL₂(F₇)',fullOrder:168,action:'Exact permutations of the triangulation',rigidSubgroup:'S₄ of order24',scope:'Only the octahedral subgroup is represented by rigid motions. Full168 symmetry is combinatorial.'}};
 return geometry;
}
global.createKleinSurfaceGeometry=createKleinSurfaceGeometry;global.createKleinSurfaceData=createKleinSurfaceData;
})(M);


(function(global){'use strict';
const PI=Math.PI;
function symmetryGuideDefinition(id,options={}){
 const all=!!options.allAxes;
 if(id==='N6s'||id==='S3'||id==='D3')return{
   group:'D₃ ≅ S₃',representedOrder:6,scope:'Proper rotations realize the distinguished D3 topological action on the circular three-spoke wheel.',
   actions:[{id:'threefold',axis:[0,1,0],order:3,angle:2*PI/3,length:3.8,center:1.50,radius:.58,color:PALETTE.olive,fixedPoints:2},
     ...Array.from({length:all?3:1},(_,j)=>{const k=all?j:1,a=-PI/2+k*2*PI/3;return{id:'halfturn-'+k,axis:[Math.cos(a),0,Math.sin(a)],order:2,angle:PI,length:4.25,center:1.98,radius:.38,color:PALETTE.pigment9,fixedPoints:4}})],
   planes:[{normal:[-.5,0,Math.sqrt(3)/2],up:[0,1,0],width:4.80,height:3.00,color:PALETTE.main,containsActions:['threefold','halfturn-1']}]
 };
 if(id==='H2'||id==='N2')return{
   group:'C₂',representedOrder:2,scope:id==='H2'?'The proper X half-turn is the hyperelliptic involution topological model.':'The proper X half-turn is the bielliptic involution topological model.',
   actions:[{id:'involution',axis:[1,0,0],order:2,angle:PI,length:id==='H2'?6.05:3.10,center:id==='H2'?2.82:1.35,radius:id==='H2'?.72:.65,color:id==='H2'?PALETTE.secondary:PALETTE.main,fixedPoints:id==='H2'?8:4}],
   planes:[id==='H2'?{normal:[0,0,1],up:[0,1,0],width:1.35,height:4.50,color:PALETTE.secondary,containsActions:['involution']}:{normal:[0,1,0],up:[0,0,1],width:2.75,height:5.15,color:PALETTE.main,containsActions:['involution']}]
 };
 if(id==='N24')return{
   group:'A₄ rotational subgroup',representedOrder:12,fullLocusGroup:'S₄',scope:'These are genuine rotations of the tetrahedral sculpture. Its full Euclidean S4 includes reflections, which reverse surface orientation; the full holomorphic S4 is given by the algebraic cover, not those mirrors.',
   actions:[...[0,1,2].map(k=>({id:'halfturn-'+k,axis:[+(k===0),+(k===1),+(k===2)],order:2,angle:PI,length:4.60,center:0,radius:2.12,color:PALETTE.pigment10,fixedPoints:4})),
     ...(all?[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]]:[[1,1,1]]).map((axis,k)=>({id:'threefold-'+k,axis,order:3,angle:2*PI/3,length:4.9,center:0,radius:2.23,color:PALETTE.pigment10,fixedPoints:2}))],planes:[]
 };
 if(id==='H8v')return{
   group:'D₂ ≅ C₂ × C₂ ambient rotation subgroup',representedOrder:4,fullLocusGroup:'C₂ × C₂ × C₂',scope:'The three proper half-turns are actual symmetries of the four-theta sculpture. The full holomorphic C2^3 action is NOT represented by three ambient reflections. Its hyperelliptic h is sheet exchange in the exact cover inset.',
   actions:[{id:'theta-x',axis:[1,0,0],order:2,angle:PI,length:3.7,center:1.72,radius:.40,color:PALETTE.pigment9,fixedPoints:4},{id:'theta-y',axis:[0,1,0],order:2,angle:PI,length:2.9,center:1.35,radius:.36,color:PALETTE.secondary,fixedPoints:4},{id:'theta-z',axis:[0,0,1],order:2,angle:PI,length:2.9,center:1.35,radius:.36,color:PALETTE.main,fixedPoints:4}],
   planes:[{normal:[0,0,1],up:[0,1,0],width:3.65,height:2.55,color:PALETTE.main,containsActions:['theta-x','theta-y']},{normal:[0,1,0],up:[0,0,1],width:3.65,height:2.55,color:PALETTE.secondary,containsActions:['theta-x','theta-z']}],
   exactCoverActions:[{id:'h',kind:'sheet exchange',map:'(x,y) → (x,−y)',fixedPoints:8},{id:'s',kind:'base-sphere rotation with lift',axis:[0,0,1],angle:PI,map:'(x,y) → (−x,y)',fixedPoints:4},{id:'t',kind:'base-sphere rotation with lift',axis:[1,0,0],angle:PI,map:'(x,y) → (1/x,y/x⁴)',fixedPoints:4}]
 };
 return{group:id==='N3'?'C₃':id==='N4'?'C₂ × C₂':'unspecified',representedOrder:1,actions:[],planes:[],scope:id==='N3'?'Use the exact three-sheet deck cycle, with five fixed ramification points. No rigid three-fold axis is asserted on the cover drawing.':id==='N4'?'Use the two commuting sign-change deck permutations of the conic cover. No rigid axes are asserted on its arbitrary sheet layout.':'No certified rigid guide is available for this drawing.'};
}
function createSymmetryGuides(THREE,id,options={}){
 const definition=symmetryGuideDefinition(id,options),group=new THREE.Group(),actions=[],pickables=[];
 group.name='Local symmetry guides '+id;group.userData={familyId:id,scope:definition.scope,coordinateSpace:'form-local'};
 const vector=v=>new THREE.Vector3(...v),Y=vector([0,1,0]);
 const material=(color,opacity=1)=>new THREE.MeshBasicMaterial({color,transparent:opacity<1,opacity,depthWrite:false,depthTest:true,toneMapped:false});
 function tube(points,color,radius=.010,opacity=.85){const curve=new THREE.CatmullRomCurve3(points),mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,Math.max(24,points.length),radius,5,false),material(color,opacity));mesh.userData.symmetryGuide=true;return mesh}
 function segment(a,b,color,radius=.009,opacity=.82){const delta=b.clone().sub(a),mesh=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,delta.length(),8),material(color,opacity));mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(Y,delta.normalize());mesh.userData.symmetryGuide=true;return mesh}
 for(const spec of definition.actions){
   const axis=vector(spec.axis).normalize(),center=axis.clone().multiplyScalar(spec.center),seed=Math.abs(axis.y)<.85?Y:vector([0,0,1]),e1=new THREE.Vector3().crossVectors(seed,axis).normalize(),e2=new THREE.Vector3().crossVectors(axis,e1).normalize(),angle=spec.angle;
   const action={id:spec.id,familyId:id,axis:axis.toArray(),angle,order:spec.order,origin:[0,0,0],coordinateSpace:'form-local',orientationPreserving:true,fixedPoints:spec.fixedPoints,scope:definition.scope};
   const shaft=segment(axis.clone().multiplyScalar(-spec.length/2),axis.clone().multiplyScalar(spec.length/2),spec.color,options.axisRadius||.017,.82);group.add(shaft);
   const start=.18,points=Array.from({length:65},(_,i)=>{const t=start+angle*i/64;return center.clone().addScaledVector(e1,spec.radius*Math.cos(t)).addScaledVector(e2,spec.radius*Math.sin(t))});
   const arc=tube(points,spec.color,options.arrowRadius||.022,.94),end=points.at(-1),a=start+angle,tangent=e1.clone().multiplyScalar(-Math.sin(a)).addScaledVector(e2,Math.cos(a)).normalize();
   const head=new THREE.Mesh(new THREE.ConeGeometry(.063,.20,8),material(spec.color));head.position.copy(end);head.quaternion.setFromUnitVectors(Y,tangent);
   for(const o of [arc,head]){o.userData.symmetryAction=action;o.userData.symmetryGuide=true;pickables.push(o)}group.add(arc,head);const radial=e1.clone().multiplyScalar(Math.cos(a)).addScaledVector(e2,Math.sin(a));for(const side of [-1,1]){const back=end.clone().addScaledVector(tangent,-.17).addScaledVector(radial,side*.085),wing=tube([back,end],spec.color,.012,.95);wing.userData.symmetryAction=action;pickables.push(wing);group.add(wing)}
   for(const sign of [-1,1]){const dot=new THREE.Mesh(new THREE.SphereGeometry(.025,8,6),material(spec.color,.87));dot.position.copy(axis).multiplyScalar(sign*spec.length/2);group.add(dot)}

   if(options.sketch!==false){const ghost=points.map((p,i)=>p.clone().addScaledVector(e1,.006*Math.sin(i*.61)).addScaledVector(e2,.005*Math.cos(i*.43)));group.add(tube(ghost,spec.color,.004,.23))}
   actions.push({...action,objects:[arc,head],shaft});
 }
 if(options.planes!==false)for(const p of definition.planes){
   const n=vector(p.normal).normalize(),v=vector(p.up).addScaledVector(n,-vector(p.up).dot(n)).normalize(),u=new THREE.Vector3().crossVectors(v,n).normalize(),frame=new THREE.Matrix4().makeBasis(u,v,n),pane=new THREE.Group();pane.setRotationFromMatrix(frame);
   const face=new THREE.Mesh(new THREE.PlaneGeometry(p.width,p.height),new THREE.ShaderMaterial({uniforms:{pigment:{value:new THREE.Color(p.color)},alpha:{value:options.planeOpacity??.14}},vertexShader:'varying vec2 washUv;void main(){washUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'precision highp float;varying vec2 washUv;uniform vec3 pigment;uniform float alpha;float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float n(vec2 p){vec2 a=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(a),h(a+vec2(1.,0.)),f.x),mix(h(a+vec2(0.,1.)),h(a+1.),f.x),f.y);}void main(){float grain=.65*n(washUv*7.)+.25*n(washUv*26.)+.10*n(washUv*210.);float edge=pow(max(abs(washUv.x-.5),abs(washUv.y-.5))*2.,18.);gl_FragColor=vec4(mix(pigment,vec3(.95,.95,.92),.14*grain),alpha*(.60+.70*grain+.16*edge));}',transparent:true,side:THREE.DoubleSide,depthWrite:false,depthTest:true}));face.renderOrder=-1;pane.add(face);
   const corners=[[-p.width/2,-p.height/2,0],[p.width/2,-p.height/2,0],[p.width/2,p.height/2,0],[-p.width/2,p.height/2,0],[-p.width/2,-p.height/2,0]].map(vector);for(let i=1;i<corners.length;i++)pane.add(segment(corners[i-1],corners[i],p.color,.022,.78));
   pane.userData={symmetryGuide:true,role:'Reference plane through displayed rotation axes',normal:n.toArray(),containsActions:p.containsActions,reflectionAction:false};group.add(pane);
 }
 function dispose(){const geoms=new Set(),mats=new Set();group.traverse(o=>{if(o.geometry)geoms.add(o.geometry);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>mats.add(m))});geoms.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());group.removeFromParent();group.clear()}
 return{group,actions,pickables,metadata:definition,dispose};
}
global.createSymmetryGuides=createSymmetryGuides;global.symmetryGuideDefinition=symmetryGuideDefinition;
})(M);


(function(global){'use strict';
function createSpecimenInk(T,id,geometry){
 const group=new T.Group();group.name='Broken ochre rim strokes';const paths=[],circle=(cx,cz,r,a,b)=>Array.from({length:23},(_,i)=>{const t=a+(b-a)*i/22;return [cx+r*Math.cos(t),cz+r*Math.sin(t)]});
 if(id==='N6s')for(const [a,b]of [[.12,.55],[2.15,2.46],[4.25,4.58]])paths.push(circle(0,0,1.56,a,b));
 if(id==='H2'){paths.push(circle(-1.78,0,.80,.10,.57));paths.push(circle(0,0,.9,3.45,3.9));paths.push(circle(1.82,0,.75,.18,.6))}
 if(id==='N2'){paths.push(circle(0,0,.91,.15,.62));paths.push(circle(0,0,.91,3.3,3.65))}
 if(id==='N1')for(let k=0;k<3;k++){const angle=-Math.PI/2+k*Math.PI*2/3,co=Math.cos(angle),si=Math.sin(angle);paths.push(Array.from({length:25},(_,i)=>{const t=.16+.5*i/24,u=1.08+1.10*Math.cos(t),v=.59*Math.sin(t);return[co*u-si*v,si*u+co*v]}))}
 if(id==='N4'){const style=global.SMOOTH_SPECIMEN_STYLES?.[id];const loops=id==='N3'?Array.from({length:3},(_,i)=>{const t=-Math.PI/2+i*2*Math.PI/3+[0,.035,-.025][i],c=[1.09,1.14,1.04][i];return [c*Math.cos(t),c*Math.sin(t),[.91,.94,.88][i],[.59,.61,.57][i],t]}):[[0,1.17,.97,.54,Math.PI/2],[0,-1.10,.92,.56,-Math.PI/2],[1.12,0,.91,.56,0]];for(const [cx,cz,a,b,t]of loops)paths.push(Array.from({length:23},(_,i)=>{const q=.18+i*.46/22,u=(a+.10)*Math.cos(q),v=(b+.08)*Math.sin(q),x=cx+Math.cos(t)*u-Math.sin(t)*v,z=cz+Math.sin(t)*u+Math.cos(t)*v;return[style.scale[0]*x+style.shear*z,style.scale[2]*z]}))}
 if(id==='N3'){const st=global.SMOOTH_SPECIMEN_STYLES.N3;for(const [a,b]of [[.08,.40],[2.05,2.34],[4.2,4.48]])paths.push(circle(0,0,1.48,a,b).map(([x,z])=>[st.scale[0]*x+st.shear*z,st.scale[2]*z]))}
 const mesh=new T.Mesh(geometry,new T.MeshBasicMaterial({side:T.DoubleSide})),ray=new T.Raycaster(),down=new T.Vector3(0,-1,0);mesh.updateMatrixWorld(true);let projected=0;
 for(const path of paths){const points=[];for(const [x,z]of path){ray.set(new T.Vector3(x,4,z),down);const hit=ray.intersectObject(mesh,false)[0];if(hit){points.push(hit.point.clone().addScaledVector(hit.face.normal,.006));projected++}}
 if(points.length<4)continue;const curve=new T.CatmullRomCurve3(points),line=new T.Mesh(new T.TubeGeometry(curve,36,.012,5,false),new T.MeshBasicMaterial({color:PALETTE.pigment11,transparent:true,opacity:.64,depthWrite:false,toneMapped:false}));group.add(line)}
 mesh.material.dispose();group.userData={surfaceProjected:true,projectedPoints:projected};return group;
}
global.createSpecimenInk=createSpecimenInk;
})(M);


(function(global){'use strict';
const TAU=2*Math.PI;
const edgeKey=(a,b)=>a<b?a+','+b:b+','+a;

function auditNormalization(positions,faces,expectedGenus){
 const nv=positions.length/3,used=new Set(),edges=new Map(),links=Array.from({length:nv},()=>[]),parent=Int32Array.from({length:nv},(_,i)=>i);
 const root=i=>{while(parent[i]!==i){parent[i]=parent[parent[i]];i=parent[i]}return i};
 let badFaces=0,minTwiceArea=Infinity;
 for(let i=0;i<faces.length;i+=3){
  const a=faces[i],b=faces[i+1],c=faces[i+2];
  if(a===b||b===c||c===a)badFaces++;
  const ax=positions[a*3],ay=positions[a*3+1],az=positions[a*3+2],ux=positions[b*3]-ax,uy=positions[b*3+1]-ay,uz=positions[b*3+2]-az,vx=positions[c*3]-ax,vy=positions[c*3+1]-ay,vz=positions[c*3+2]-az;
  minTwiceArea=Math.min(minTwiceArea,Math.hypot(uy*vz-uz*vy,uz*vx-ux*vz,ux*vy-uy*vx));
  for(const [p,q,r]of[[a,b,c],[b,c,a],[c,a,b]]){used.add(p);const k=edgeKey(p,q),e=edges.get(k)||{count:0,balance:0};e.count++;e.balance+=p<q?1:-1;edges.set(k,e);parent[root(p)]=root(q);links[p].push([q,r])}
 }
 let badLinks=0;
 for(const v of used){const adjacency=new Map();for(const[a,b]of links[v]){if(!adjacency.has(a))adjacency.set(a,[]);if(!adjacency.has(b))adjacency.set(b,[]);adjacency.get(a).push(b);adjacency.get(b).push(a)}const seen=new Set(),queue=[adjacency.keys().next().value];for(let j=0;j<queue.length;j++){const x=queue[j];if(seen.has(x))continue;seen.add(x);for(const y of adjacency.get(x)||[])if(!seen.has(y))queue.push(y)}if([...adjacency.values()].some(a=>a.length!==2)||seen.size!==adjacency.size)badLinks++}
 const chi=used.size-edges.size+faces.length/3,components=new Set([...used].map(root)).size;
 const nonmanifoldEdges=[...edges.values()].filter(e=>e.count!==2).length,orientationErrors=[...edges.values()].filter(e=>e.balance!==0).length;
 const finite=positions.every(Number.isFinite),passed=finite&&components===1&&!nonmanifoldEdges&&!orientationErrors&&!badLinks&&!badFaces&&chi===2-2*expectedGenus&&minTwiceArea>0;
 return{genus:expectedGenus,vertices:used.size,edges:edges.size,faces:faces.length/3,eulerCharacteristic:chi,expectedEulerCharacteristic:2-2*expectedGenus,components,nonmanifoldEdges,orientationErrors,badVertexLinks:badLinks,degenerateIndexFaces:badFaces,minTwiceArea,finite,passed};
}

function createNodalSpecimen(THREE,graph,options={}){
 const weights=graph.weights||graph.vertices.map(v=>v.genus),edges=graph.edges,n=weights.length;
 if(!n||!edges.length)throw new RangeError('A nodal specimen requires a nonempty nodal stable graph');
 const valence=Array(n).fill(0);for(const[a,b]of edges){valence[a]++;valence[b]++}
 const reached=new Set([0]),queue=[0];for(let j=0;j<queue.length;j++)for(const[a,b]of edges){const next=a===queue[j]?b:b===queue[j]?a:-1;if(next>=0&&!reached.has(next)){reached.add(next);queue.push(next)}}
 if(reached.size!==n)throw new Error('The stable dual graph must be connected');
 const genus=weights.reduce((a,b)=>a+b,0)+edges.length-n+1;
 if(genus!==3||weights.some((w,i)=>2*w-2+valence[i]<=0))throw new Error('Expected a stable genus-three weighted graph');
 const group=new THREE.Group();group.name='Nodal curve '+graph.id;
 group.userData={itemId:graph.id,nodalCurve:true,dualGraphId:graph.id,interpretation:'Separate normalization disks meet only at each prescribed marked node in the abstract quotient. No connecting cylinders are added.',embeddingClaim:false};
 const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z),Z=V(0,0,1),palette=options.palette||[PALETTE.pigment12,PALETTE.pigment13,PALETTE.pigment14,PALETTE.pigment15];
 const ownedMaterials=new Set(),ownedGeometries=new Set(),components=[],nodes=[],branches=[];
 const ownMaterial=m=>{ownedMaterials.add(m);return m},ownGeometry=g=>{ownedGeometries.add(g);return g};



 const centers=Array.from({length:n},()=>V()),radii=Array(n).fill(n===1?1.02:n===2?.82:n===3?.69:.60),neighbors=Array.from({length:n},()=>new Set());
 for(const[a,b]of edges)if(a!==b){neighbors[a].add(b);neighbors[b].add(a)}
 const degrees=neighbors.map(s=>s.size),simpleEdges=degrees.reduce((a,b)=>a+b,0)/2,gap=.14;
 const walkPath=start=>{const order=[start];while(order.length<n){const next=[...neighbors[order.at(-1)]].find(i=>!order.includes(i));if(next===undefined)break;order.push(next)}return order};
 if(n===2){const d=radii[0]+radii[1]+gap;centers[0].x=-d/2;centers[1].x=d/2}
 if(n===3){
  const d=radii[0]*2+gap;
  if(simpleEdges===2){const hub=degrees.indexOf(2),ends=[...neighbors[hub]];centers[ends[0]].x=-d;centers[ends[1]].x=d}
  else for(let i=0;i<n;i++){const t=Math.PI/2+TAU*i/n;centers[i].set(d/Math.sqrt(3)*Math.cos(t),d/Math.sqrt(3)*Math.sin(t),0)}
 }
 if(n===4){
  const d=radii[0]*2+gap;
  if(simpleEdges===6){const a=d/(2*Math.sqrt(2));[[a,a,a],[a,-a,-a],[-a,a,-a],[-a,-a,a]].forEach((p,i)=>centers[i].set(...p))}
  else if(simpleEdges===5){const common=degrees.flatMap((x,i)=>x===3?[i]:[]),other=degrees.flatMap((x,i)=>x===2?[i]:[]);centers[common[0]].x=-d/2;centers[common[1]].x=d/2;centers[other[0]].y=d*Math.sqrt(3)/2;centers[other[1]].y=-d*Math.sqrt(3)/2}
  else if(simpleEdges===4&&degrees.every(d=>d===2)){const order=walkPath(0);[[-d/2,d/2],[d/2,d/2],[d/2,-d/2],[-d/2,-d/2]].forEach((p,i)=>centers[order[i]].set(p[0],p[1],0))}
  else if(simpleEdges===4){const leaf=degrees.indexOf(1),hub=[...neighbors[leaf]][0],others=[...neighbors[hub]].filter(v=>v!==leaf);centers[leaf].x=-d;centers[others[0]].x=d;centers[others[1]].set(d/2,d*Math.sqrt(3)/2,0)}
  else if(degrees.includes(3)){const hub=degrees.indexOf(3);radii[hub]=.48;let j=0;for(let i=0;i<n;i++)if(i!==hub){const t=Math.PI/2+TAU*j++/3,r=radii[hub]+radii[i]+gap;centers[i].set(r*Math.cos(t),r*Math.sin(t),0)}}
  else {const order=walkPath(degrees.indexOf(1));order.forEach((v,j)=>centers[v].x=(j-1.5)*d)}
 }
 const bodies=weights.map((weight,ci)=>{
  const supplied=options.geometryFactory?options.geometryFactory(weight):ownGeometry(global.createArtSurfaceGeometry?.(THREE,weight,{resolution:options.resolution||30}));
  if(!supplied?.index||!supplied.attributes.position)throw new TypeError('geometryFactory must return an indexed closed surface');
  const raw=supplied.attributes.position,positions=[],min=V(Infinity,Infinity,Infinity),max=V(-Infinity,-Infinity,-Infinity);
  for(let j=0;j<raw.count;j++){const p=V(raw.getX(j),-raw.getZ(j),raw.getY(j));min.min(p);max.max(p);positions.push(p)}
  const midpoint=min.clone().add(max).multiplyScalar(.5),bound=positions.reduce((m,p)=>Math.max(m,p.distanceTo(midpoint)),0);
  let angle=0;if(weight>0&&neighbors[ci].size){let toward=[...neighbors[ci]].reduce((p,v)=>p.add(centers[v].clone().sub(centers[ci]).normalize()),V());if(toward.lengthSq()<.01)toward=centers[[...neighbors[ci]][0]].clone().sub(centers[ci]);angle=Math.atan2(toward.y,toward.x)-(weight===2?Math.PI/2:0)}
  positions.forEach(p=>p.sub(midpoint).multiplyScalar(radii[ci]/bound).applyAxisAngle(Z,angle));
  return{supplied,raw,positions,rotation:angle,support:direction=>positions.reduce((r,p)=>Math.max(r,p.dot(direction)),-Infinity)};
 });
 function loopDirection(ci){
  if(!neighbors[ci].size)return Math.PI/2;
  const directions=[...neighbors[ci]].map(v=>centers[v].clone().sub(centers[ci]).normalize());let best=-Infinity,angle=0;
  for(let k=0;k<32;k++){const a=TAU*k/32,d=V(Math.cos(a),Math.sin(a),0),score=Math.min(...directions.map(p=>1-d.dot(p)));if(score>best){best=score;angle=a}}
  return angle;
 }
 const parallel=new Map(),loops=Array.from({length:n},()=>[]);
 edges.forEach(([a,b],i)=>{if(a===b)loops[a].push(i);else{const k=edgeKey(a,b);if(!parallel.has(k))parallel.set(k,[]);parallel.get(k).push(i)}});
 edges.forEach(([a,b],i)=>{
  let position,axis;
  if(a===b){const family=loops[a],j=family.indexOf(i),out=loopDirection(a),angle=out+(j-(family.length-1)/2)*(n===1?TAU/family.length:1.05),radial=V(Math.cos(angle),Math.sin(angle),0);position=centers[a].clone().addScaledVector(radial,bodies[a].support(radial)+.22);position.z=centers[a].z+.10+.018*j;axis=V(-radial.y,radial.x,0)}
  else{axis=centers[b].clone().sub(centers[a]).normalize();const side=V(-axis.y,axis.x,0).normalize(),family=parallel.get(edgeKey(a,b)),j=family.indexOf(i),offset=(j-(family.length-1)/2)*.28,front=Z.clone().addScaledVector(axis,-axis.dot(Z)).normalize(),sa=bodies[a].support(axis),sb=bodies[b].support(axis.clone().negate()),free=centers[a].distanceTo(centers[b])-sa-sb;position=centers[a].clone().addScaledVector(axis,sa+free/2).addScaledVector(side,offset).addScaledVector(front,.10)}

  position.set(Math.fround(position.x),Math.fround(position.y),Math.fround(position.z));
  const node={id:i,edgeIndex:i,vertices:[a,b],position,branches:[],selfLoop:a===b};nodes.push(node);
  for(let side=0;side<2;side++){const vertex=side?b:a,terminal=axis.clone().multiplyScalar(side?-1:1);const branch={edgeIndex:i,side,vertex,node,terminal,tipVertex:-1,rootVertex:-1};node.branches.push(branch);branches.push(branch)}
 });

 for(let ci=0;ci<n;ci++){
  const {supplied,raw}=bodies[ci],baseFaces=Array.from(supplied.index.array),basePositions=bodies[ci].positions.map(p=>p.clone().add(centers[ci])),normal=[];
  const incident=Array.from({length:raw.count},()=>[]);
  for(let j=0;j<baseFaces.length;j+=3){const a=baseFaces[j],b=baseFaces[j+1],c=baseFaces[j+2],face=j/3,nn=new THREE.Vector3().subVectors(basePositions[b],basePositions[a]).cross(new THREE.Vector3().subVectors(basePositions[c],basePositions[a]));for(const v of[a,b,c]){incident[v].push(face);if(!normal[v])normal[v]=V();normal[v].add(nn)}}
  normal.forEach(p=>p.normalize());
  const blocked=new Set(),removed=new Set(),positions=basePositions.flatMap(p=>p.toArray()),faces=[],componentBranches=branches.filter(b=>b.vertex===ci);

  function boundaryOf(faceSet){
   const count=new Map(),vertices=new Set();for(const f of faceSet){const a=baseFaces[f*3],b=baseFaces[f*3+1],c=baseFaces[f*3+2];for(const[x,y]of[[a,b],[b,c],[c,a]]){vertices.add(x);const k=edgeKey(x,y);if(count.has(k))count.get(k).count++;else count.set(k,{a:x,b:y,count:1})}}
   const boundary=[...count.values()].filter(e=>e.count===1),next=new Map(),incoming=new Map();for(const e of boundary){if(next.has(e.a))return null;next.set(e.a,e.b);incoming.set(e.b,(incoming.get(e.b)||0)+1)}
   if(boundary.length<3||[...incoming.values()].some(x=>x!==1)||vertices.size-count.size+faceSet.size!==1)return null;
   const ring=[],start=boundary[0].a;let p=start;do{ring.push(p);p=next.get(p);if(p===undefined||ring.length>boundary.length)return null}while(p!==start);
   return ring.length===boundary.length?{ring,vertices}:null;
  }
  function makeCap(vertex){
   const seed=new Set(incident[vertex]);if([...seed].some(f=>removed.has(f)))return null;
   const initial=boundaryOf(seed);if(!initial||[...initial.vertices].some(v=>blocked.has(v)))return null;
   return {...initial,faces:seed};
  }

  for(const branch of componentBranches){const d=branch.node.position.clone().sub(centers[ci]);if(branch.node.selfLoop)d.addScaledVector(branch.terminal,-.34);branch.rootAngle=(Math.atan2(d.y,d.x)+TAU)%TAU}
  componentBranches.sort((a,b)=>a.rootAngle-b.rootAngle||a.side-b.side);
  let gap=-1,begin=0;for(let j=0;j<componentBranches.length;j++){const next=(j+1)%componentBranches.length,delta=componentBranches[next].rootAngle+(next===0?TAU:0)-componentBranches[j].rootAngle;if(delta>gap){gap=delta;begin=next}}
  componentBranches.push(...componentBranches.splice(0,begin));
  const originalAngles=componentBranches.map((b,j)=>{let t=b.rootAngle;if(j&&t<componentBranches[0].rootAngle)t+=TAU;return t}),adjustedAngles=originalAngles.slice();
  for(let j=1;j<adjustedAngles.length;j++)adjustedAngles[j]=Math.max(adjustedAngles[j],adjustedAngles[j-1]+.34);
  const drift=adjustedAngles.reduce((sum,t,j)=>sum+t-originalAngles[j],0)/adjustedAngles.length;componentBranches.forEach((b,j)=>b.rootAngle=adjustedAngles[j]-drift);
  for(const branch of componentBranches){
   const target=branch.node.position.clone().sub(centers[ci]),vertical=centers[ci].z!==0?target.z/Math.max(.01,Math.hypot(target.x,target.y)):.25,desired=V(Math.cos(branch.rootAngle),Math.sin(branch.rootAngle),vertical).normalize();
   const candidates=basePositions.map((p,i)=>({i,score:p.clone().sub(centers[ci]).dot(desired)+radii[ci]*.22*normal[i].dot(desired)})).sort((a,b)=>b.score-a.score);
   let cap=null;for(const c of candidates){if(blocked.has(c.i))continue;cap=makeCap(c.i);if(cap&&[...cap.vertices].every(v=>basePositions[v].clone().sub(branch.node.position).dot(branch.terminal)<-.001)){branch.rootVertex=c.i;break}else cap=null}
   if(!cap)throw new Error('Could not find distinct normalization disks for '+graph.id+' component '+ci);
   cap.faces.forEach(f=>removed.add(f));cap.vertices.forEach(v=>blocked.add(v));

   const ring=cap.ring,root=ring.reduce((s,v)=>s.add(basePositions[v]),V()).multiplyScalar(1/ring.length),distance=root.distanceTo(branch.node.position);



   branch.separatingPlaneClearance=Math.min(...ring.map(v=>-basePositions[v].clone().sub(branch.node.position).dot(branch.terminal)));
   let old=ring;
   for(const t of[.08,.17,.28,.40,.53,.66,.77,.86,.93,.975]){
    const next=[];
    for(let j=0;j<ring.length;j++){
     const p=basePositions[ring[j]].clone().lerp(branch.node.position,t);next.push(positions.length/3);positions.push(p.x,p.y,p.z);
    }
    for(let j=0;j<ring.length;j++){const k=(j+1)%ring.length;faces.push(old[j],old[k],next[j],old[k],next[k],next[j])}old=next;
   }
   branch.tipVertex=positions.length/3;positions.push(...branch.node.position.toArray());
   for(let j=0;j<ring.length;j++)faces.push(old[j],old[(j+1)%ring.length],branch.tipVertex);
   branch.rootPosition=root.clone();branch.tipDistance=distance;branch.attachmentArcLength=distance;branch.diskBoundaryVertexCount=ring.length;branch.removedFaces=cap.faces.size;
  }
  for(let j=0;j<baseFaces.length;j+=3)if(!removed.has(j/3))faces.push(baseFaces[j],baseFaces[j+1],baseFaces[j+2]);

  const remap=new Map(),compact=[],compactFaces=[];for(const index of faces){if(!remap.has(index)){remap.set(index,compact.length/3);compact.push(positions[index*3],positions[index*3+1],positions[index*3+2])}compactFaces.push(remap.get(index))}
  const typedPositions=new Float32Array(compact),validation=auditNormalization(typedPositions,compactFaces,weights[ci]);
  if(!validation.passed)throw new Error('Normalization audit failed: '+graph.id+' '+ci+' '+JSON.stringify(validation));
  const geometry=ownGeometry(new THREE.BufferGeometry());geometry.setAttribute('position',new THREE.BufferAttribute(typedPositions,3));geometry.setIndex(compactFaces);geometry.computeVertexNormals();geometry.computeBoundingSphere();
  geometry.userData={normalizationGenus:weights[ci],nodalComponent:true,dualVertex:ci,validation,notWeldedAtNodes:true};
  for(const branch of componentBranches){branch.tipVertex=remap.get(branch.tipVertex);branch.componentGeometry=geometry;branch.rootVertex=remap.get(branch.rootVertex)??null}
  const material=options.material||ownMaterial(new THREE.MeshStandardMaterial({color:palette[ci%palette.length],roughness:1,side:THREE.DoubleSide})),mesh=new THREE.Mesh(geometry,material);mesh.userData={itemId:graph.id,componentIndex:ci,normalizationGenus:weights[ci]};mesh.name='Genus '+weights[ci]+' normalization component '+ci;group.add(mesh);
  if(options.outlineMaterial){const outline=new THREE.Mesh(geometry,options.outlineMaterial);outline.userData={itemId:graph.id,componentIndex:ci,decorative:true};group.add(outline)}
  if(options.componentLabels&&options.labelFactory){const label=options.labelFactory(String(weights[ci]),{worldHeight:.18,color:PALETTE.pigment16});label.position.copy(centers[ci]).add(V(0,-radii[ci]-.16,.15));group.add(label)}
  components.push({index:ci,genus:weights[ci],center:centers[ci],radius:radii[ci],mesh,geometry,branches:componentBranches,validation});
 }
 const nodeGeometry=ownGeometry(new THREE.SphereGeometry(options.nodeRadius||.043,12,8)),nodeMaterial=ownMaterial(new THREE.MeshStandardMaterial({color:options.nodeColor||PALETTE.pigment17,roughness:.95}));
 for(const node of nodes){const mark=new THREE.Mesh(nodeGeometry,nodeMaterial);mark.position.copy(node.position);mark.userData={itemId:graph.id,nodeIndex:node.edgeIndex,nodalSingularity:true};mark.name='Shared node '+(node.edgeIndex+1);group.add(mark);node.marker=mark;node.exactCoincidence=node.branches.every(b=>{const p=b.componentGeometry.attributes.position,i=b.tipVertex;return p.getX(i)===node.position.x&&p.getY(i)===node.position.y&&p.getZ(i)===node.position.z});node.distinctNormalizationPoints=node.branches[0].vertex!==node.branches[1].vertex||node.branches[0].tipVertex!==node.branches[1].tipVertex}
 const normalizationEuler=components.reduce((s,c)=>s+c.validation.eulerCharacteristic,0),quotientEuler=normalizationEuler-edges.length;
 const validation={graphId:graph.id,normalizationComponents:n,normalizationGenera:weights.slice(),arithmeticGenus:genus,nodeCount:nodes.length,branchCount:branches.length,expectedBranches:2*edges.length,allNodesExactlyCoincident:nodes.every(p=>p.exactCoincidence),allNodesDistinct:nodes.every((p,i)=>nodes.slice(i+1).every(q=>p.position.distanceToSquared(q.position)>1e-12)),graphConnected:reached.size===n,distinctNormalizationBranches:nodes.every(p=>p.distinctNormalizationPoints),allNormalizationSurfacesValid:components.every(c=>c.validation.passed),normalizationEulerCharacteristic:normalizationEuler,nodalTopologicalEulerCharacteristic:quotientEuler,expectedNodalEulerCharacteristic:2-2*genus+edges.length,dualGraphEdges:edges.map(e=>e.slice()),loops:nodes.filter(p=>p.selfLoop).length,noCylindricalEdgeConnectors:true,placement:'compact graph-adapted component bounds with facing ports',minimumBodyBallGap:n>1?Math.min(...centers.flatMap((a,i)=>centers.slice(i+1).map((b,j)=>a.distanceTo(b)-radii[i]-radii[i+j+1]))):null,pairedBranchesSeparatedByPlane:branches.every(b=>b.separatingPlaneClearance>0),meanAttachmentLength:branches.reduce((s,b)=>s+b.attachmentArcLength,0)/branches.length,maxAttachmentLength:Math.max(...branches.map(b=>b.attachmentArcLength)),spatialEmbeddingCertified:false,coordinates:'Illustrative real-three-dimensional projection of an exact abstract nodal quotient'};
 validation.passed=(n===1||validation.minimumBodyBallGap>0)&&validation.pairedBranchesSeparatedByPlane&&validation.allNodesDistinct&&validation.graphConnected&&validation.allNodesExactlyCoincident&&validation.distinctNormalizationBranches&&validation.allNormalizationSurfacesValid&&validation.branchCount===validation.expectedBranches&&quotientEuler===validation.expectedNodalEulerCharacteristic;
 if(!validation.passed)throw new Error('Nodal incidence audit failed: '+JSON.stringify(validation));group.userData.validation=validation;
 return{group,components,nodes,branches,validation,dispose(){group.removeFromParent();ownedGeometries.forEach(g=>g.dispose());ownedMaterials.forEach(m=>m.dispose());group.clear()}};
}
global.createNodalSpecimen=createNodalSpecimen;
global.NodalSpecimens={create:createNodalSpecimen,auditNormalization};
})(M);


(function(global){'use strict';
function createModuliSheet(THREE){
 const group=new THREE.Group();group.name='Individually traced rightward sectional folds';group.userData={schematic:true,description:'A bent volume lofted through source-traced section profiles: right-leaning middle bowls and unequal upright terminal rolls. This is an artistic schematic, not a mathematical foliation or a new incidence claim.'};
 const clamp=x=>Math.max(0,Math.min(1,x)), smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t)};
 const mix=(a,b,t)=>a+(b-a)*t;
 const ease=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*t*(10+t*(-15+6*t))};
 const bez=(a,b,c,d,t)=>{const s=1-t;return a*s*s*s+3*b*s*s*t+3*c*s*t*t+d*t*t*t};
 const top=[
   [0,.28,[390,520],[570,650],[745,760],[900,825]],
   [.28,.68,[900,825],[1120,1035],[1335,1230],[1500,1100]],
   [.68,1,[1500,1100],[1725,990],[1880,875],[1970,800]]
 ];
 const bottom=[
   [0,.20,[390,520],[420,805],[460,1060],[570,1120]],
   [.20,.50,[570,1120],[770,1220],[930,1435],[1130,1420]],
   [.50,.76,[1130,1420],[1280,1505],[1410,1510],[1530,1460]],
   [.76,1,[1530,1460],[1725,1480],[1905,1425],[1960,1380]]
 ];
 function rim(path,u){const seg=path.find(p=>u<=p[1]+1e-9)||path[path.length-1],t=(u-seg[0])/(seg[1]-seg[0]);return [bez(seg[2][0],seg[3][0],seg[4][0],seg[5][0],t),bez(seg[2][1],seg[3][1],seg[4][1],seg[5][1],t)]}
 function point(u,v){
   u=clamp(u);v=clamp(v);const a=rim(bottom,u),b=rim(top,u),fan=Math.pow(u,.55),roll=smooth(.89,1,u);
   let px=mix(a[0],b[0],v),py=mix(a[1],b[1],v);

   px+=24*roll*Math.sin(2.2*Math.PI*v)+12*fan*Math.sin(Math.PI*v)*Math.sin(4*Math.PI*u);
   py+=24*fan*Math.sin(Math.PI*v)*Math.sin(3.6*Math.PI*u)-16*roll*Math.sin(2*Math.PI*v);
   const ridge=.35*Math.exp(-Math.pow((u-.23)/.055,2))+.44*Math.exp(-Math.pow((u-.49)/.065,2))+.32*Math.exp(-Math.pow((u-.73)/.055,2));
   const z=fan*(1.45*Math.sin(Math.PI*v)-.75*v)+ridge*Math.sin(Math.PI*v)+roll*.58*Math.cos(2*Math.PI*v);
   return new THREE.Vector3((px-1080)/120,(859-py)/120,z);
 }
 function normal(u,v){u=Math.max(.001,Math.min(.999,u));v=Math.max(.001,Math.min(.999,v));const e=.00025;return point(u+e,v).sub(point(u-e,v)).cross(point(u,v+e).sub(point(u,v-e))).normalize()}
 function lifted(u,v,h=.02){return point(u,v).addScaledVector(normal(u,v),h)}



 function bodyPoint(u,v,depth=0){
   const p=point(u,v),f=Math.pow(clamp(u),.67),a=Math.sin(Math.PI*v)*(1+.50*Math.cos(Math.PI*v));
   const opening=.40+2.35*Math.pow(Math.sin(Math.PI*u),.8);
   const turn=2.35-1.30*smooth(.68,1,u);
   p.x-=depth*f*a*opening;
   p.y+=depth*f*a*(.12*Math.cos(Math.PI*v)-.14*Math.sin(2*Math.PI*u)-.20*(1-v));
   p.z-=depth*f*a*turn;
   return p;
 }
 const vertexShader=`varying vec2 vUv;varying vec3 vN;void main(){vUv=uv;vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
 const fragmentShader=`precision highp float;uniform vec3 tint;uniform float opacity;uniform float pencil;uniform float foldedFace;varying vec2 vUv;varying vec3 vN;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1)),f.x),f.y);}
 void main(){float grain=.55*noise(vUv*vec2(19.,11.))+.3*noise(vUv*vec2(67.,43.))+.15*noise(vUv*vec2(510.,390.));
 float light=.70+.30*max(0.,dot(normalize(vN),normalize(vec3(-.45,.7,1.))));
 float graphite=.42*pow(1.-vUv.y,2.7);
 float hatch=smoothstep(.98,.999,sin(vUv.x*850.+vUv.y*38.+noise(vUv*25.)*2.));
 vec3 color=mix(tint,vec3(.995,.99,.975),.18+.18*grain)*light;
 color=mix(color,vec3(.22,.23,.24),graphite*.65+pencil*hatch*.09*(.18+graphite));
 float turned=smoothstep(.65,.94,vUv.x)*(.24+.76*sin(3.14159265*vUv.y));
 float edge=pow(1.-abs(normalize(vN).z),1.6);
 color=mix(color,vec3(.32,.35,.31),foldedFace*turned*edge*.28);
 float density=mix(opacity,min(.96,opacity+.30),foldedFace*turned);
 gl_FragColor=vec4(color,density*(.86+.21*grain));}`;
 function material(color,opacity,pencil=.6){return new THREE.ShaderMaterial({uniforms:{tint:{value:new THREE.Color(color)},opacity:{value:opacity},pencil:{value:pencil},foldedFace:{value:0}},vertexShader,fragmentShader,transparent:true,depthWrite:false,side:THREE.DoubleSide})}
 function membrane(map,nu=120,nv=48){const position=[],uv=[],index=[];for(let i=0;i<=nu;i++)for(let j=0;j<=nv;j++){const u=i/nu,v=j/nv,p=map(u,v);position.push(p.x,p.y,p.z);uv.push(u,v)}for(let i=0;i<nu;i++)for(let j=0;j<nv;j++){const a=i*(nv+1)+j,b=a+nv+1;index.push(a,b,a+1,a+1,b,b+1)}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(position,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(index);g.computeVertexNormals();g.computeBoundingSphere();return g}
 function face(name,map,color,opacity,order,nu=120,nv=48,pencil=.6){const mesh=new THREE.Mesh(membrane(map,nu,nv),material(color,opacity,pencil));mesh.name=name;mesh.renderOrder=order;group.add(mesh);return mesh}
 function stroke(points,{color=PALETTE.pigment18,opacity=.6,jitter=0,radius=0,order=7}={}){const pts=points.map((p,i)=>p.clone().add(new THREE.Vector3(jitter*(Math.sin(i*.37)+.3*Math.sin(i*1.8)),jitter*.65*Math.cos(i*.53),jitter*.2*Math.sin(i*.78))));let line;if(radius){const curve=new THREE.CatmullRomCurve3(pts);line=new THREE.Mesh(new THREE.TubeGeometry(curve,Math.max(80,pts.length),radius,4,false),new THREE.MeshBasicMaterial({color,transparent:opacity<1,opacity,depthWrite:false}))}else line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color,transparent:true,opacity,depthWrite:false}));line.renderOrder=order;line.userData.decorative=true;group.add(line);return line}
 const samples=(f,n=150)=>Array.from({length:n+1},(_,i)=>f(i/n));
 const layers=[],leaves=[],panels=[];



 const contourData=[
  {id:'rust',station:.12,front:[[520,925],[495,1020],[550,1130],[640,1130]],back:[[895,825],[880,1005],[730,1130],[640,1130]],depth:.64,mouth:42,mouthDepth:.48,color:PALETTE.pigment19,alpha:.39,backAlpha:.76},
  {id:'first-grey',station:.28,front:[[720,1070],[710,1155],[770,1255],[840,1255]],back:[[1030,1009],[1020,1110],[920,1255],[840,1255]],depth:.60,mouth:64,mouthDepth:.56,color:PALETTE.pigment20,alpha:.39},
  {id:'middle',station:.44,front:[[915,1145],[925,1240],[990,1350],[1065,1350]],back:[[1255,1091],[1255,1210],[1140,1350],[1065,1350]],depth:.82,mouth:70,mouthDepth:.64,color:PALETTE.pigment21,alpha:.42},
  {id:'right-middle',station:.68,front:[[1365,1150],[1364,1300],[1375,1430],[1425,1430]],back:[[1585,1140],[1600,1250],[1495,1430],[1425,1430]],depth:.94,mouth:66,mouthDepth:.70,color:PALETTE.pigment22,alpha:.45,returnVisible:.52},
  {id:'tall-terminal',station:.94,front:[[1908,796],[1888,1000],[1869,1340],[1900,1340]],back:[[1930,816],[1944,1010],[1931,1340],[1900,1340]],depth:.46,mouth:44,mouthDepth:.50,color:PALETTE.pigment23,alpha:.40},
  {id:'short-terminal',station:1,front:[[1978,946],[1965,1105],[1919,1305],[1945,1305]],back:[[2005,963],[2012,1080],[1971,1305],[1945,1305]],depth:.35,mouth:40,mouthDepth:.44,color:PALETTE.pigment24,alpha:.42}
 ];
 const sectionCuts=contourData.map(d=>d.station),apex=point(0,.5);
 function sectionProfile(i,v,back=false){
   if(i<0)return apex.clone();
   const d=contourData[i],a=back?d.back:d.front,t=1-clamp(v),xy=[0,1].map(k=>bez(a[0][k],a[1][k],a[2][k],a[3][k],t));


   const opening=ease(.55,1,v),belly=64*Math.pow(v*(1-v),3);
   xy[0]+=(back?1:-1)*(i===3&&!back?7:i<4?24:12)*belly;
   if(back)xy[0]+=d.mouth*opening;
   const z=.18*Math.pow(d.station,.6)+(back?-1:1)*(d.depth*1.24*Math.sin(Math.PI*t)+d.mouthDepth*opening);
   return new THREE.Vector3((xy[0]-1080)/120,(859-xy[1])/120,z);
 }


 function slope(a,b){return a*b>0?2*a*b/(a+b):0}
 function loftCoordinate(p,a,b,n,t){
   const d=b-a,m0=slope(a-p,d),m1=slope(d,n-b),q=t*t,r=q*t;
   return (2*r-3*q+1)*a+(r-2*q+t)*m0+(-2*r+3*q)*b+(r-q)*m1;
 }
 function panelPoint(i,t,v,back=false){
   t=clamp(t);const A=sectionProfile(i-1,v,back),B=sectionProfile(i,v,back);
   const P=i>0?sectionProfile(i-2,v,back):A.clone().multiplyScalar(2).sub(B);
   const N=i+1<contourData.length?sectionProfile(i+1,v,back):B.clone().multiplyScalar(2).sub(A);
   const p=new THREE.Vector3(...['x','y','z'].map(k=>loftCoordinate(P[k],A[k],B[k],N[k],t))),a=Math.sin(Math.PI*v);

   p.z+=(back?-1:1)*a*(.24*ease(.64,1,t)-.10*(1-ease(0,.20,t)));
   return p;
 }
 function panelRange(i,v){return[i?sectionCuts[i-1]:0,sectionCuts[i]]}


 const displayPoint=point,displayNormal=normal,attached=lifted;
 for(let i=0;i<contourData.length;i++){
   const d=contourData[i],front=(t,v)=>panelPoint(i,t,v),back=(t,v)=>panelPoint(i,t,v,true);
   const mesh=face('Traced rightward section '+d.id,front,d.color,d.alpha,-2-i,60,56,.8);mesh.userData={peeledPanel:true,index:i,sourceContour:d.id};mesh.material.uniforms.foldedFace.value=1;panels.push(mesh);
   face('Returning face of '+d.id,back,d.color,d.alpha*(d.backAlpha??.48),-10-i,60,56,.7);
   const near=samples(v=>front(1,v),180),far=samples(v=>back(1,v),180);
   stroke(near,{opacity:i<4?.76:.85,radius:i<4?.009:.008});stroke(near,{opacity:.19,jitter:.012});
   const returnEnd=d.returnVisible??1;
   stroke(samples(v=>back(1,v*returnEnd),150),{opacity:i<4?.52:.76,radius:i<4?.006:.007});
   stroke(samples(v=>back(1,v*returnEnd),150),{opacity:.15,jitter:.014});
   for(const reverse of[false,true]){
     const map=reverse?back:front;
     const lip=(v,q)=>{const p=map(1-q*.012,v);p.z+=reverse?-.006:.006;return p};
     face('Pale turned margin '+d.id+(reverse?' back':' front'),lip,PALETTE.pigment25,i<4?.63:.78,3,90,6,.45);
     const under=(v,q)=>{const p=map(1-q*.055,v);p.z-=.012;return p};
     face('Graphite inside '+d.id+(reverse?' back':' front'),under,PALETTE.pigment26,.20,-1-i,90,8,.9);
   }
   const lower=samples(t=>front(t,0),140),upper=samples(t=>front(t,1),140);
   stroke(lower,{opacity:.36,radius:.0045});stroke(lower,{opacity:.12,jitter:.016});
   stroke(lower.slice(30,125),{color:PALETTE.pigment27,opacity:.26,radius:.007});
   stroke(upper,{opacity:.30,radius:.0038});
   stroke(samples(t=>back(t,1),140),{color:i===0?PALETTE.pigment28:PALETTE.pigment29,opacity:i===0?.58:.29,radius:i===0?.006:.0038});

   for(let k=0;k<9;k++){const v=.04+k*.10;stroke(samples(q=>front(1-.018*q,Math.min(.99,v+q*.022)),10),{opacity:.22,jitter:.002})}
 }

 for(const i of[4,5])for(const reverse of[false,true]){
   const trace=samples(v=>{const p=panelPoint(i,1,v,reverse);p.x+=(reverse?.025:-.022)*Math.sin(Math.PI*v);p.z+=.018;return p},160);
   stroke(trace,{opacity:.34,radius:.0035});
 }
 stroke(samples(u=>lifted(u,1,.065)),{opacity:.60,radius:.006});
 const defs=[
   {id:'terra',color:PALETTE.pigment30,v:u=>.045+.07*Math.sin(Math.PI*u),end:.30},
   {id:'violet',color:PALETTE.pigment31,v:u=>.29+.31*Math.exp(-Math.pow((u-.18)/.085,2))-.28*Math.pow(u,4),end:1},
   {id:'olive',color:PALETTE.olive,v:u=>.70-.37*u-.06*Math.sin(Math.PI*u),end:1},
   {id:'indigo',color:PALETTE.pigment32,v:u=>.95-.025*Math.sin(Math.PI*u),start:.015,end:1}
 ];


 const sailSpecs=[
  {id:'violet',end:.68,to:u=>.92-.18*u,color:PALETTE.pigment33,opacity:.15,depth:.74,bow:-.14},
  {id:'indigo',end:1,to:u=>.46+.25*Math.sin(Math.PI*u),color:PALETTE.pigment34,opacity:.24,depth:1,bow:.12}
 ];
 for(const s of sailSpecs){const d=defs.find(d=>d.id===s.id),map=(t,q)=>{const u=t*s.end,a=attached(u,d.v(u),.012),b=bodyPoint(clamp(u+(s.id==='indigo'?.065:s.id==='violet'?-.045:0)*Math.sin(Math.PI*u)),s.to(u),s.depth),p=a.lerp(b,q);p.z+=s.bow*Math.pow(u,.6)*Math.sin(Math.PI*q);return p};
  const mesh=face('Oblique '+s.id+' stratum sail',map,s.color,s.opacity,0,130,42,.6);layers.push({id:s.id,mesh,end:s.end});leaves.push(s);
  stroke(samples(t=>map(t,1)),{color:s.color,opacity:.64,radius:.0055});
  stroke(samples(q=>map(1,q)),{color:PALETTE.pigment35,opacity:.50,radius:.0045});
  stroke(samples(q=>map(1,q)),{opacity:.15,jitter:.014});
 }
 const locusCurves=defs.map((d,k)=>{
   const parameter=t=>{const u=(d.start||.002)+(d.end-(d.start||.002))*clamp(t);return{u,v:d.v(u)}};
   const sample=t=>{const p=parameter(t);return attached(p.u,p.v,.125)};
   const points=samples(sample,240),curve=new THREE.CatmullRomCurve3(points),mesh=stroke(points,{color:d.color,opacity:.94,radius:k===3?.014:.020,order:10});
   stroke(points,{color:d.color,opacity:.24,jitter:.013,order:9});mesh.userData={locusId:d.id,schematic:true};
   return{id:d.id,color:d.color,mesh,points,curve,sample,parameter};
 });
 const specs={
   apex:{u:0,v:.5,color:PALETTE.pigment36},
   involutions:{u:.08,v:defs[1].v(.08),color:PALETTE.pigment31,locus:'violet'},
   dihedral:{u:.18,v:defs[2].v(.18),color:PALETTE.olive,locus:'olive'},
   involutionTerra:{u:.20,v:defs[0].v(.20),color:PALETTE.pigment30,locus:'terra'},
   involutionViolet:{u:.57,v:defs[1].v(.57),color:PALETTE.pigment31,locus:'violet'},
   cyclic3:{u:.73,v:defs[2].v(.73),color:PALETTE.olive,locus:'olive'},
   hyperelliptic:{u:.91,v:defs[3].v(.91),color:PALETTE.pigment32,locus:'indigo'},
   generic:{u:.91,v:.45,color:PALETTE.pigment37},
   klein:{u:.58,v:.84,color:PALETTE.pigment38}
 };
 const anchors={};for(const[id,a]of Object.entries(specs)){
   const position=attached(a.u,a.v,.145),n=displayNormal(a.u,a.v),marker=new THREE.Mesh(new THREE.SphereGeometry(id==='apex'?.095:.070,20,14),new THREE.MeshStandardMaterial({color:a.color,roughness:.78}));marker.position.copy(position);marker.name=id+' attachment';marker.userData={anchorId:id,schematic:true};marker.renderOrder=11;group.add(marker);anchors[id]={id,...a,position,normal:n,marker};
 }

 const directionAudit=contourData.map(d=>({id:d.id,entry:d.front[0],bottom:d.front[3],return:d.back[0],bottomMinusEntryX:d.front[3][0]-d.front[0][0],returnMinusBottomX:d.back[0][0]-d.front[3][0],direction:d.id.includes('terminal')?'upright or slightly left':'down-right then up-right'}));
 group.userData.volume={kind:'smooth cubic loft through full rounded sectional U profiles',sourceImageDimensions:[2160,1718],tracedContours:contourData.length,actualPeeledPanels:panels.length,angularSails:leaves.length,uncutFrontMesh:false,continuousStabilizerTracks:true,referenceChartUnchanged:true,terracottaIsPeeledLeaf:true,openUpperMouths:true,smoothLongitudinalLoft:true,roundedSectionVolume:true,contourDirections:directionAudit};
 return {group,point,normal,displayPoint,displayNormal,panelPoint,panelRange,sectionProfile,contourData,bodyPoint,panels,locusCurves,anchors,layers,leaves,sectionCuts,dispose(){group.traverse(o=>{o.geometry?.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose()}})}};
}
global.createModuliSheet=createModuliSheet;
})(M);


(function (global) {
'use strict';
function createBoundaryPoset(THREE, options = {}) {
  const data = options.data || global.BOUNDARY_DATA;
  const sheet = options.sheet;
  const labelFactory = options.labelFactory || ((text, opts) => global.createInkLabel(THREE, text, opts));
  if (!Array.isArray(data) || !sheet || typeof sheet.point !== 'function' || typeof sheet.normal !== 'function') throw new TypeError('Boundary poset needs stable graph data and a moduli sheet.');
  const group = new THREE.Group();
  group.name = 'All 42 stable graph types and exact degeneration covers';
  group.userData = {exactCombinatorics:true, schematicPositions:true, genus:3};
  const nodesMap = new Map(), edgesMap = new Map(), pickables = [], resources = new Set(), labels = [], rankLabels = [];
  let isolationProgress=0,highlightSettings={};
  const C = {ink:PALETTE.pigment39, blue:PALETTE.pigment40, rust:PALETTE.pigment41, gold:PALETTE.pigment42, ivory:PALETTE.pigment43, violet:PALETTE.pigment44};
  const own = object => { resources.add(object); return object; };
  const sphere = own(new THREE.SphereGeometry(1, 10, 8));
  const paperMaterial = own(new THREE.MeshBasicMaterial({color:C.ivory,toneMapped:false}));
  const markerMaterial = own(new THREE.MeshBasicMaterial({color:C.gold,toneMapped:false}));
  const haloGeometry = own(new THREE.RingGeometry(.199,.207,48));
  const rankGroups = Array.from({length:7},()=>[]), byId = new Map();
  for (const graph of data) {
    if (byId.has(graph.id)) throw new Error('Duplicate stable graph id '+graph.id);
    if (!Number.isInteger(graph.edgeCount) || graph.edgeCount < 0 || graph.edgeCount > 6) throw new Error('Invalid genus-three codimension.');
    if (graph.weights.reduce((a,b)=>a+b,0)+graph.edgeCount-graph.vertexCount+1 !== 3 || graph.dimension !== 6-graph.edgeCount) throw new Error('Invalid stable graph genus or dimension.');
    byId.set(graph.id,graph);rankGroups[graph.edgeCount].push(graph);
  }

  const adjacency = new Map(data.map(g=>[g.id,new Set()]));
  for (const graph of data) for (const contraction of graph.smoothings) {
    const lower = byId.get(contraction.id);
    if (!lower || lower.edgeCount !== graph.edgeCount-1) throw new Error('Invalid one-edge contraction '+graph.id+' → '+contraction.id);
    adjacency.get(graph.id).add(lower.id);adjacency.get(lower.id).add(graph.id);
  }
  const ranks = new Map();
  const indexRanks = () => rankGroups.forEach(list=>list.forEach((g,j)=>ranks.set(g.id,(j+.5)/list.length)));
  indexRanks();
  for (let sweep=0;sweep<6;sweep++) {
    const sequence = sweep%2 ? [5,4,3,2,1,0] : [1,2,3,4,5,6];
    for (const e of sequence) {
      const neighborRank = sweep%2 ? e+1 : e-1;
      const score = g => {
        const neighbors=[...adjacency.get(g.id)].filter(id=>byId.get(id).edgeCount===neighborRank);
        return neighbors.length ? neighbors.reduce((s,id)=>s+ranks.get(id),0)/neighbors.length : ranks.get(g.id);
      };
      rankGroups[e].sort((a,b)=>score(a)-score(b)||a.id.localeCompare(b.id));indexRanks();
    }
  }
  function label(text, settings) {
    const result = labelFactory(String(text), settings);
    if (!result || !result.isObject3D) throw new TypeError('labelFactory must return a THREE.Object3D.');
    labels.push(result);return result;
  }
  function elevated(u,v,h=.24) {
    const p=sheet.point(u,v),n=sheet.normal(u,v);

    if(n.z<0)n.negate();
    return p.addScaledVector(n,h).add(new THREE.Vector3(0,0,.035));
  }
  function vertexLayout(graph) {
    const n=graph.vertexCount;
    if(n===1)return [new THREE.Vector3(0,0,0)];
    if(n===2)return [new THREE.Vector3(-.115,0,0),new THREE.Vector3(.115,0,0)];
    if(n===3)return [new THREE.Vector3(-.13,-.045,0),new THREE.Vector3(.13,-.045,0),new THREE.Vector3(0,.085,0)];
    const simpleNeighbors=Array.from({length:n},()=>new Set());
    graph.edges.forEach(([a,b])=>{if(a!==b){simpleNeighbors[a].add(b);simpleNeighbors[b].add(a)}});
    const center=simpleNeighbors.findIndex(s=>s.size===3);
    if(center>=0){
      const positions=Array(n);positions[center]=new THREE.Vector3(0,0,0);
      let j=0;for(let i=0;i<n;i++)if(i!==center){const a=Math.PI/2+j++*2*Math.PI/3;positions[i]=new THREE.Vector3(.145*Math.cos(a),.105*Math.sin(a),0)}
      return positions;
    }
    return [new THREE.Vector3(-.12,.063,0),new THREE.Vector3(.12,.063,0),new THREE.Vector3(-.12,-.063,0),new THREE.Vector3(.12,-.063,0)];
  }
  function mergeTubes(curves, radius) {
    const positions=[],normals=[],indices=[];let offset=0;
    for(const curve of curves){
      const tube=new THREE.TubeGeometry(curve,18,radius,5,false),p=tube.attributes.position.array,n=tube.attributes.normal.array,ix=tube.index.array;
      for(let i=0;i<p.length;i++)positions.push(p[i]);for(let i=0;i<n.length;i++)normals.push(n[i]);for(let i=0;i<ix.length;i++)indices.push(ix[i]+offset);
      offset+=p.length/3;tube.dispose();
    }
    const geometry=own(new THREE.BufferGeometry());
    geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));geometry.setIndex(indices);geometry.computeBoundingSphere();return geometry;
  }
  function graphGlyph(graph, color) {
    const glyph=new THREE.Group(),vertices=vertexLayout(graph),bundles=new Map(),curves=[];
    graph.edges.forEach(([a,b])=>{const key=a+','+b;if(!bundles.has(key))bundles.set(key,[]);bundles.get(key).push([a,b])});
    for(const edges of bundles.values()){
      const [a,b]=edges[0],count=edges.length,A=vertices[a],B=vertices[b];
      for(let j=0;j<count;j++){
        if(a===b){
          const base=graph.vertexCount===1?Math.PI/2:(Math.hypot(A.x,A.y)>.01?Math.atan2(A.y,A.x):Math.PI/2);
          const angle=base+(graph.vertexCount===1?j*2*Math.PI/count:(j-(count-1)/2)*1.0),r=count>1?.135:.125;
          const outward=new THREE.Vector3(Math.cos(angle),Math.sin(angle),0),side=new THREE.Vector3(-outward.y,outward.x,0);
          const c1=A.clone().addScaledVector(outward,r).addScaledVector(side,r*.70),c2=A.clone().addScaledVector(outward,r).addScaledVector(side,-r*.70);
          c1.z=c2.z=.006;curves.push(new THREE.CubicBezierCurve3(A.clone(),c1,c2,A.clone()));
        }else{
          const direction=B.clone().sub(A).normalize(),normal=new THREE.Vector3(-direction.y,direction.x,0);
          const mid=A.clone().lerp(B,.5).addScaledVector(normal,(j-(count-1)/2)*.075);mid.z=.006;
          curves.push(new THREE.QuadraticBezierCurve3(A.clone(),mid,B.clone()));
        }
      }
    }
    const ink=own(new THREE.MeshBasicMaterial({color,toneMapped:false,transparent:true,opacity:.96}));
    if(curves.length){const mesh=new THREE.Mesh(mergeTubes(curves,.0085),ink);mesh.name='Loops and parallel edges of '+graph.id;mesh.renderOrder=22;glyph.add(mesh)}
    vertices.forEach((p,i)=>{
      const v=new THREE.Mesh(sphere,paperMaterial);v.scale.setScalar(.034);v.position.copy(p);v.renderOrder=23;glyph.add(v);
      const ring=new THREE.Mesh(own(new THREE.RingGeometry(.031,.036,24)),ink);ring.position.copy(p).add(new THREE.Vector3(0,0,.024));ring.renderOrder=24;glyph.add(ring);
      const weight=label(graph.weights[i],{worldHeight:.083,fontSize:80,font:'Caveat',color:graph.weights[i]===0?C.ink:color,padding:1});
      weight.userData.vertexWeight=true;weight.userData.foldedScale=weight.scale.clone();weight.position.copy(p).add(new THREE.Vector3(0,.001,.048));weight.renderOrder=25;glyph.add(weight);
    });
    return {glyph,ink,vertices};
  }
  const u0=.30,du=.105;
  for(let e=0;e<=6;e++){
    const list=rankGroups[e];
    list.forEach((graph,j)=>{
      const v=.94-e*.145,u=list.length===1?.52:.28+.69*(j+.5)/list.length,position=elevated(u,v),color=graph.cycleRank===0?C.rust:C.blue;
      const root=new THREE.Group();root.name=graph.id+' · '+graph.name;root.position.copy(position);root.userData={itemId:graph.id,stableGraph:true,graphId:graph.id,codimension:e};
      const scale=list.length>=11?1.08:list.length>=8?1.14:1.24;
      const {glyph,ink,vertices}=graphGlyph(graph,color);glyph.position.z=.025;root.add(glyph);
      const marker=new THREE.Mesh(sphere,markerMaterial);marker.scale.setScalar(.016);marker.position.z=-.012;root.add(marker);
      const haloMaterial=own(new THREE.MeshBasicMaterial({color:C.gold,transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false,toneMapped:false}));
      const halo=new THREE.Mesh(haloGeometry,haloMaterial);halo.scale.y=.78;halo.position.z=.018;halo.visible=false;halo.renderOrder=27;root.add(halo);

      const hit=new THREE.Mesh(own(new THREE.CircleGeometry(.205,32)),own(new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide})));hit.scale.y=.78;hit.position.z=.070;root.add(hit);
      root.scale.setScalar(scale);group.add(root);
      root.traverse(object=>{object.userData.itemId=graph.id;if(object.isMesh||object.isSprite)pickables.push(object)});
      const entry={id:graph.id,data:graph,root,position:position.clone(),anchor:position.clone(),foldedPosition:position.clone(),glyph,marker,halo,ink,vertices,uv:{u,v},baseScale:scale};nodesMap.set(graph.id,entry);
      if(e===0||e===1){const caption=label(e===0?'𝓜₃':graph.short,{worldHeight:.14,fontSize:80,color,padding:4});caption.position.set(0,-.19,.06);caption.userData.itemId=graph.id;caption.renderOrder=25;root.add(caption);pickables.push(caption)}
    });
    const rankLabel=label(e+' node'+(e===1?'':'s'),{worldHeight:.145,fontSize:80,color:PALETTE.pigment45,padding:3});rankLabel.position.copy(elevated(.995,.94-e*.145,.24)).add(new THREE.Vector3(.30,0,.08));rankLabel.renderOrder=20;rankLabels.push({object:rankLabel,rank:e,foldedPosition:rankLabel.position.clone(),foldedScale:rankLabel.scale.clone()});group.add(rankLabel);
  }


  const foldedBounds=new THREE.Box3();for(const n of nodesMap.values())foldedBounds.expandByPoint(n.foldedPosition);
  const layoutCenter=foldedBounds.getCenter(new THREE.Vector3()),widths=[0,4.9,7.7,9.1,9.9,8.8,7.3];
  const isolationBounds=new THREE.Box3();
  for(let e=0;e<=6;e++)rankGroups[e].forEach((graph,j)=>{
    const entry=nodesMap.get(graph.id),x=layoutCenter.x+(rankGroups[e].length===1?0:(j/(rankGroups[e].length-1)-.5)*widths[e]);
    entry.isolatedPosition=new THREE.Vector3(x,layoutCenter.y+(3-e)*1.04,3.2);
    isolationBounds.expandByPoint(entry.isolatedPosition.clone().add(new THREE.Vector3(-.40,-.38,-.10)));
    isolationBounds.expandByPoint(entry.isolatedPosition.clone().add(new THREE.Vector3(.40,.38,.10)));
  });
  for(const rank of rankLabels){rank.isolatedPosition=new THREE.Vector3(layoutCenter.x+5.65,layoutCenter.y+(3-rank.rank)*1.04,3.24);isolationBounds.expandByPoint(rank.isolatedPosition.clone().add(new THREE.Vector3(.46,.16,0)))}


  const segmentPositions=[],arrowPositions=[];
  function pushSegments(points,target){for(let i=1;i<points.length;i++)target.push(...points[i-1].toArray(),...points[i].toArray())}
  function pushArrow(points,target){
    const k=Math.floor(points.length*.71),p=points[k],tangent=points[k+1].clone().sub(points[k-1]).normalize();
    const side=new THREE.Vector3(0,0,1).cross(tangent).normalize();
    if(side.lengthSq()<.5)side.set(0,1,0);
    const tip=p.clone().addScaledVector(tangent,.025),back=p.clone().addScaledVector(tangent,-.025);
    target.push(...tip.toArray(),...back.clone().addScaledVector(side,.014).toArray(),...back.clone().addScaledVector(side,-.014).toArray());
  }
  for(const graph of data)for(const contraction of graph.smoothings){
    const from=nodesMap.get(contraction.id),to=nodesMap.get(graph.id),points=[];
    for(let k=0;k<=24;k++){
      const t=k/24,u=from.uv.u+(to.uv.u-from.uv.u)*t;
      const ease=t*t*(3-2*t),v=from.uv.v+(to.uv.v-from.uv.v)*ease;
      points.push(elevated(u,v,.18).add(new THREE.Vector3(0,0,-.010)));
    }
    const key=from.id+'>'+to.id;if(edgesMap.has(key))throw new Error('Duplicate poset cover '+key);
    edgesMap.set(key,{id:key,from:from.id,to:to.id,source:from.id,target:to.id,multiplicity:contraction.multiplicity,points,foldedPoints:points.map(p=>p.clone()),isolatedPoints:points.map((_,k)=>{
      const t=k/24,A=from.isolatedPosition,B=to.isolatedPosition,direction=B.clone().sub(A).normalize(),trim=Math.min(.25,A.distanceTo(B)*.17),start=A.clone().addScaledVector(direction,trim),end=B.clone().addScaledVector(direction,-trim),ease=t*t*(3-2*t);
      return new THREE.Vector3(start.x+(end.x-start.x)*ease,start.y+(end.y-start.y)*t,3.14);
    }),degeneration:true});
    pushSegments(points,segmentPositions);pushArrow(points,arrowPositions);
  }
  function bufferMesh(array,kind,material){const geometry=own(new THREE.BufferGeometry());geometry.setAttribute('position',new THREE.Float32BufferAttribute(array,3));geometry.computeBoundingSphere();const result=kind==='lines'?new THREE.LineSegments(geometry,material):new THREE.Mesh(geometry,material);result.renderOrder=15;result.frustumCulled=false;group.add(result);return result}
  const covers=bufferMesh(segmentPositions,'lines',own(new THREE.LineBasicMaterial({color:PALETTE.pigment46,transparent:true,opacity:.38,depthWrite:false,toneMapped:false})));
  covers.name='92 exact immediate degeneration relations';
  const arrows=bufferMesh(arrowPositions,'mesh',own(new THREE.MeshBasicMaterial({color:PALETTE.pigment47,transparent:true,opacity:.58,depthWrite:false,side:THREE.DoubleSide,toneMapped:false})));
  arrows.name='Toward increasing codimension';
  const highlightLines=bufferMesh(new Float32Array(segmentPositions.length),'lines',own(new THREE.LineBasicMaterial({color:C.gold,transparent:true,opacity:.92,depthWrite:false,toneMapped:false})));
  const highlightArrows=bufferMesh(new Float32Array(arrowPositions.length),'mesh',own(new THREE.MeshBasicMaterial({color:C.gold,transparent:true,opacity:.9,depthWrite:false,side:THREE.DoubleSide,toneMapped:false})));
  highlightLines.renderOrder=28;highlightArrows.renderOrder=28;highlightLines.visible=highlightArrows.visible=false;highlightLines.geometry.setDrawRange(0,0);highlightArrows.geometry.setDrawRange(0,0);
  function setHighlight(id, settings={}){
    highlightSettings={...settings};
    const selected=nodesMap.has(id)?id:null,related=new Set(selected?[selected]:[]),highlighted=[];
    if(selected){
      if(settings.transitive){
        for(const direction of ['from','to']){
          const pending=[selected],seen=new Set(pending);
          while(pending.length){const current=pending.pop();for(const edge of edgesMap.values())if(edge[direction]===current){const other=edge[direction==='from'?'to':'from'];if(!seen.has(other)){seen.add(other);pending.push(other);related.add(other)}}}
        }
      }else for(const neighbor of adjacency.get(selected))related.add(neighbor);
    }
    for(const entry of nodesMap.values()){
      const active=entry.id===selected,near=related.has(entry.id);
      entry.halo.visible=active;entry.root.scale.setScalar(entry.baseScale*(1+.35*isolationProgress)*(active?1.18:1));entry.ink.opacity=!selected||near?.93:.56;
    }
    const lineArray=[],arrowArray=[];
    for(const edge of edgesMap.values())if(selected&&(settings.transitive?(related.has(edge.from)&&related.has(edge.to)):(edge.from===selected||edge.to===selected))){highlighted.push(edge.id);pushSegments(edge.points,lineArray);pushArrow(edge.points,arrowArray)}
    for(const [object,array]of [[highlightLines,lineArray],[highlightArrows,arrowArray]]){const attribute=object.geometry.attributes.position;attribute.array.set(array);attribute.needsUpdate=true;object.geometry.setDrawRange(0,array.length/3);object.visible=array.length>0}
    group.userData.selected=selected;return {selected,related:[...related],edgesHighlighted:highlighted};
  }
  function setIsolation(value){
    const progress=Math.max(0,Math.min(1,Number(value)||0));if(progress===isolationProgress)return false;isolationProgress=progress;
    for(const entry of nodesMap.values()){
      entry.position.lerpVectors(entry.foldedPosition,entry.isolatedPosition,progress);entry.anchor.copy(entry.position);entry.root.position.copy(entry.position);
      entry.glyph.traverse(o=>{if(o.userData.vertexWeight)o.scale.copy(o.userData.foldedScale).multiplyScalar(1+.15*progress)});
    }
    for(const rank of rankLabels){rank.object.position.lerpVectors(rank.foldedPosition,rank.isolatedPosition,progress);rank.object.scale.copy(rank.foldedScale).multiplyScalar(1+.18*progress)}
    const lineArray=covers.geometry.attributes.position.array,arrowArray=[];let offset=0;
    for(const edge of edgesMap.values()){
      edge.points.forEach((p,i)=>p.lerpVectors(edge.foldedPoints[i],edge.isolatedPoints[i],progress));
      for(let i=1;i<edge.points.length;i++)for(const p of[edge.points[i-1],edge.points[i]]){lineArray[offset++]=p.x;lineArray[offset++]=p.y;lineArray[offset++]=p.z}
      pushArrow(edge.points,arrowArray);
    }
    covers.geometry.attributes.position.needsUpdate=true;arrows.geometry.attributes.position.array.set(arrowArray);arrows.geometry.attributes.position.needsUpdate=true;
    setHighlight(group.userData.selected,highlightSettings);group.userData.isolationProgress=progress;return true;
  }
  const counts=rankGroups.map(list=>list.length);
  const validation={nodes:nodesMap.size,covers:edgesMap.size,countsByNodes:counts,arrows:'toward degeneration / increasing node count',completeGenusThree:nodesMap.size===42&&edgesMap.size===92&&counts.join(',')==='1,2,5,9,12,8,5'};
  if(!validation.completeGenusThree)throw new Error('Incomplete genus-three stable graph poset: '+JSON.stringify(validation));
  group.userData.validation=validation;
  function dispose(){
    for(const object of resources)object.dispose?.();
    for(const object of labels){if(typeof object.userData?.dispose==='function')object.userData.dispose();else{object.material?.map?.dispose?.();object.material?.dispose?.()}}
    group.removeFromParent();group.clear();nodesMap.clear();edgesMap.clear();pickables.length=0;
  }
  return {group,nodesMap,edgesMap,pickables,covers,arrows,highlightLines,highlightArrows,validation,rankLabels,isolationBounds,setHighlight,setIsolation,dispose};
}
global.createBoundaryPoset=createBoundaryPoset;
})(M);

return M; }

// Tiny vector digits keep dual-graph weights legible without a font dependency.
function graphLabel(text, opts) {
  const group=new THREE.Group(), h=opts.worldHeight||.1;
  const paths={0:[[.2,0],[.05,.2],[.05,.8],[.2,1],[.7,1],[.85,.8],[.85,.2],[.7,0],[.2,0]],1:[[.15,.72],[.48,1],[.48,0]],2:[[.06,.8],[.24,1],[.67,1],[.85,.8],[.8,.6],[.06,0],[.85,0]],3:[[.06,.88],[.3,1],[.7,.96],[.82,.76],[.68,.54],[.33,.5],[.7,.45],[.85,.25],[.7,.03],[.25,0],[.06,.12]]};
  if(paths[text]){
    const points=paths[text].map(p=>new THREE.Vector3((p[0]-.45)*h,(p[1]-.5)*h,0));
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:opts.color,transparent:true,opacity:.95,depthTest:false})));
  }else group.userData.caption=String(text);
  return group;
}

function build(env,S){
  const T=THREE,C=env.colors,M=toolkit(C);
  S.scene=new T.Scene();S.world=new T.Group();S.scene.add(S.world);
  S.camera=new T.OrthographicCamera(-10,10,8,-8,.1,150);S.camera.position.set(0,0,40);
  S.scene.add(new T.AmbientLight(C.bg,.65));
  const key=new T.DirectionalLight(C.bg,4.1);key.position.set(-5,9,12);S.scene.add(key);
  const fill=new T.DirectionalLight(C.main,.35);fill.position.set(8,-2,-6);S.scene.add(fill);
  const skin=new T.MeshStandardMaterial({color:C.ivory,roughness:1});
  skin.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace('#include <dithering_fragment>',`#include <dithering_fragment>
float grain=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);
float rim=pow(1.-abs(normal.z),2.2);
gl_FragColor.rgb-=vec3(.19,.18,.16)*rim;
gl_FragColor.rgb+=(grain-.5)*.033;`)};
  const outline=new T.ShaderMaterial({uniforms:{ink:{value:new T.Color(C.fg)}},vertexShader:'void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position+normal*.026,1.);}',fragmentShader:'uniform vec3 ink;void main(){gl_FragColor=vec4(ink,1.);}',side:T.BackSide});
  const cache=new Map();
  const geometry=(genus=3,shape='petals',resolution=40)=>{
    const k=[genus,shape,resolution].join(':');if(cache.has(k))return cache.get(k);
    const g=['three-chain','bielliptic','four-theta'].includes(shape)?M.createStabilizerSurfaceGeometry(T,shape,{resolution:40}):M.createArtSurfaceGeometry(T,genus,{resolution,shape});cache.set(k,g);return g;
  };
  S.sheet=M.createModuliSheet(T);S.world.add(S.sheet.group);S.items=[];S.pick=[];S.labels=[];S.contextRoots=[S.sheet.group];
  function line(points,color,width=.012,opacity=.7){
    const curve=new T.CatmullRomCurve3(points),g=new T.TubeGeometry(curve,64,width,5,false);
    return new T.Mesh(g,new T.MeshBasicMaterial({color,transparent:true,opacity,depthWrite:false}));
  }
  const defs=[
    ['N24','apex',[-6.5,4.55,1],.94,C.gold,'tetrahedral',[.2,-.35,0],'S₄'],
    ['N6s','dihedral',[-.6,2.7,1.7],.85,C.fg,'wheel',[.62,.06,0],'D₃'],
    ['H8v','involutions',[-7.1,-.65,1.4],.77,C.violet,'four-theta',[Math.atan(1/3),.10,1.35],'C₂ × C₂ × C₂'],
    ['N3','cyclic3',[2.9,-.4,2.7],.66,C.olive,'N3',[1.1,.06,0],'C₃'],
    ['N2','hyperelliptic',[6.6,3.9,1.8],.66,C.main,'bielliptic',[1.02,.35,Math.PI/2],'C₂'],
    ['H2','involutionTerra',[-6,-5.25,1.1],.71,C.secondary,'three-chain',[.76,.35,0],'C₂'],
    ['N4','involutionViolet',[-1.7,-5.85,1.8],.67,C.violet,'N4',[1.1,.06,0],'C₂ × C₂'],
    ['N1','generic',[6,-6,1.8],.70,C.fg,'petals',[.62,.06,0],'trivial stabilizer'],
    ['N168','klein',[7.4,.5,2.8],.35,C.teal,'klein',[.8,.06,0],'PSL₂(𝔽₇)']
  ];
  for(const [id,anchor,pos,scale,color,shape,rotation,label] of defs){
    const pivot=new T.Group(),form=new T.Group();pivot.position.set(...pos);pivot.add(form);S.world.add(pivot);
    const geom=shape==='klein'?M.createKleinSurfaceGeometry(T,{subdivisions:3,radius:1.85}):shape==='N3'||shape==='N4'?M.createSmoothSpecimenGeometry(T,id,{resolution:48}):geometry(3,shape,id==='N24'?42:44);
    if(shape==='klein'){
      form.add(new T.Mesh(geom,new T.MeshStandardMaterial({color:C.ivory,roughness:1,side:T.DoubleSide,transparent:true,opacity:.88,depthWrite:false})));
      const positions=[];for(const path of geom.userData.seamPaths)for(let j=1;j<path.length;j++)positions.push(...path[j-1].toArray(),...path[j].toArray());
      form.add(new T.LineSegments(new T.BufferGeometry().setAttribute('position',new T.Float32BufferAttribute(positions,3)),new T.LineBasicMaterial({color:C.teal,transparent:true,opacity:.3,depthWrite:false})));
    }else form.add(new T.Mesh(geom,skin),new T.Mesh(geom,outline));
    if(['N6s','H2','N2','N1','N3','N4'].includes(id))form.add(M.createSpecimenInk(T,id,geom));
    const guides=M.createSymmetryGuides(T,id);form.add(guides.group);
    form.scale.setScalar(scale);if(id==='N1')form.scale.multiply(new T.Vector3(1,.92,.84));form.rotation.order='ZYX';form.rotation.set(...rotation);
    const a=S.sheet.anchors[anchor].position,b=pivot.position.clone().add(new T.Vector3(0,-.35,0)),d=b.clone().sub(a),mid=a.clone().lerp(b,.48);
    mid.x+=d.y*.30;mid.y-=d.x*.22;mid.z+=.2;
    const connector=new T.QuadraticBezierCurve3(a,mid,b),link=line(connector.getPoints(32),color,.011,.6);S.world.add(link);S.contextRoots.push(pivot,link);
    const item={id,pivot,form,base:form.quaternion.clone(),label,position:pivot.position.clone(),boundary:false};S.items.push(item);
    form.traverse(o=>{if(o.isMesh){o.userData.selectId=id;S.pick.push(o)}});
    S.labels.push({object:pivot,text:label,color,offset:id==='N24'?[1.9,1.1]:id==='H8v'?[0,2.0]:[0,1.8]});
  }
  S.poset=M.createBoundaryPoset(T,{data:GRAPHS,sheet:S.sheet,labelFactory:graphLabel});S.world.add(S.poset.group);
  for(const [id,node] of S.poset.nodesMap){
    for(const o of S.poset.pickables)if(o.userData.itemId===id){o.userData.selectId=id;S.pick.push(o)}
    if(!node.data.edgeCount)continue;
    // Both branches are separate normalization disks with exactly coincident tips.
    const n=M.createNodalSpecimen(T,node.data,{geometryFactory:g=>geometry(g,'petals',30),material:skin,outlineMaterial:outline,nodeColor:C.secondary,nodeRadius:.06});
    const pivot=new T.Group(),form=n.group;form.scale.setScalar(node.data.edgeCount===1?.28:.028);form.rotation.set(.14,.08,-.04);pivot.add(form);
    const offset=new T.Vector3(0,node.data.edgeCount===1?.58:.15,.43);pivot.position.copy(node.position).add(offset);S.world.add(pivot);
    const bounds=new T.Box3().setFromObject(form).getSize(new T.Vector3()).divideScalar(form.scale.x);
    const item={id,pivot,form,base:form.quaternion.clone(),position:pivot.position.clone(),label:node.data.name,boundary:true,node,offset,restScale:form.scale.x,focusScale:Math.min(.8,3/bounds.x,3/bounds.y),validation:n.validation};S.items.push(item);
    form.traverse(o=>{if(o.isMesh){o.userData.selectId=id;S.pick.push(o)}});
  }
  S.ray=new T.Raycaster();S.pointer=new T.Vector2();S.drag=null;S.yaw=0;S.pitch=0;S.zoom=1;S.center=new T.Vector3(0,-.7,0);S.time=0;
  S.neutral={center:S.center.clone(),zoom:1};S.selected=null;S.viewTime=0;
  S.boundaryCenter=S.poset.isolationBounds.getCenter(new T.Vector3());
  S.fadeMaterials=[];const copies=new Map();
  for(const root of S.contextRoots)root.traverse(o=>{if(!o.material)return;const map=m=>{if(copies.has(m))return copies.get(m);const n=m.clone();n.onBeforeCompile=m.onBeforeCompile;n.customProgramCacheKey=m.customProgramCacheKey;let uniform=n.uniforms?.opacity||n.uniforms?.alpha;
    if(n===undefined)return m;
    if(n.isShaderMaterial&&!uniform){n.uniforms.contextFade={value:1};uniform=n.uniforms.contextFade;n.fragmentShader='uniform float contextFade;\n'+n.fragmentShader.replace('gl_FragColor=vec4(ink,1.);','gl_FragColor=vec4(ink,contextFade);')}
    S.fadeMaterials.push({material:n,opacity:n.opacity,transparent:n.transparent,uniform,uniformBase:uniform?.value,depthWrite:n.depthWrite});copies.set(m,n);return n};o.material=Array.isArray(o.material)?o.material.map(map):map(o.material)});
  S.colors=Object.values(C).join('|');S.toolkit=M;S.geometryCache=cache;
  S.audit={stableGraphs:GRAPHS.length,contractions:S.poset.edgesMap.size,curves:S.items.length,smooth:S.items.filter(i=>!i.boundary).map(i=>({id:i.id,...i.form.children[0].geometry.userData})),nodal:S.items.filter(i=>i.boundary).map(i=>i.validation)};
  // Palette bindings preserve every subtle wash while allowing the host to recolor it.
  S.bindings=[];const seen=new Set(),palette=Object.entries(C).map(([k,v])=>[k,new T.Color(v)]);
  S.scene.traverse(o=>{for(const m of o.material?(Array.isArray(o.material)?o.material:[o.material]):[]){if(seen.has(m))continue;seen.add(m);const cols=[m.color,...Object.values(m.uniforms||{}).map(u=>u.value)].filter(c=>c?.isColor);for(const col of cols){const p=palette.find(([,v])=>v.equals(col));if(p)S.bindings.push([col,p[0]])}}});
}

function updateView(S){
  if(!S.flight)return;
  const u=Math.max(0,Math.min(1,(S.viewTime-S.flight.start)/1.5)),e=u*u*u*(10+u*(-15+6*u));
  S.center.lerpVectors(S.flight.from,S.flight.to,e);S.zoom=S.flight.z0+(S.flight.z1-S.flight.z0)*e;
  if(u===1)S.flight=null;
}
function focus(S,item){
  updateView(S);S.selected=item?.id||null;S.poset.setHighlight(item?.boundary?item.id:null);
  S.flight={from:S.center.clone(),to:item?item.pivot.getWorldPosition(new THREE.Vector3()):S.neutral.center.clone(),z0:S.zoom,z1:item?2.5:1,start:S.viewTime};
  for(const it of S.items)if(it.boundary)it.expansion={from:it.form.scale.x,to:item===it?it.focusScale:it.restScale,start:S.viewTime};
}

export default {
  title:'Genus three, in the moduli stack',
  hook:'One drawing gathers three-handled surfaces and the nodal curves that complete their moduli space.',
  alt:'Ivory three-handled surfaces turn around translucent folded sheets. Colored symmetry guides surround them, and a web of stable graphs traces the boundary.',
  tags:['Algebraic geometry','Geometry','Topology'],
  license:'MIT',
  author:{name:'Michael Ruofan Zeng'},
  modes:{desktop:true,phone:false},
  time:{length:30,loop:true},
  context:'webgl2',
  libraries:[],
  params:[
    {key:'rotate',type:'toggle',label:'Rotate the curves',default:true},
    {key:'boundary',type:'range',label:'Unfold the boundary poset',min:0,max:1,step:.01,default:0}
  ],
  presets:[
    {id:'drawing',label:'The whole drawing',params:{rotate:true,boundary:0},t:0},
    {id:'boundary',label:'The boundary poset',params:{rotate:false,boundary:1},t:0}
  ],
  interact:{hint:'Drag to turn · scroll to zoom · select a curve · Esc returns'},
  setup(env,S){build(env,S)},
  draw(gl,t,params,env,S){
    const C=env.colors,T=THREE;
    if(!S.renderer){
      S.renderer=new T.WebGLRenderer({canvas:gl.canvas,context:gl,antialias:true,alpha:false});
      S.renderer.outputColorSpace=T.SRGBColorSpace;S.renderer.toneMapping=T.ACESFilmicToneMapping;S.renderer.toneMappingExposure=1.1;
    }
    const signature=Object.values(C).join('|');if(signature!==S.colors){for(const [col,key] of S.bindings)col.set(C[key]);S.colors=signature}
    S.time=t;S.viewTime=typeof performance==='object'?performance.now()/1000:t;updateView(S);const r=S.renderer,b=env.box,dpr=env.dpr||1;
    r.setPixelRatio(dpr);r.setSize(env.w,env.h,false);r.setClearColor(C.bg,1);
    r.setScissorTest(false);r.clear();r.setViewport(b.x,env.h-b.y-b.h,b.w,b.h);r.setScissor(b.x,env.h-b.y-b.h,b.w,b.h);r.setScissorTest(true);
    const aspect=b.w/b.h;let ww=19.8,hh=15.4;if(aspect>ww/hh)ww=hh*aspect;else hh=ww/aspect;
    S.camera.left=-ww/2;S.camera.right=ww/2;S.camera.top=hh/2;S.camera.bottom=-hh/2;
    const interact=env.mode==='interact',q=params.boundary;
    const center=(interact?S.center:S.neutral.center).clone(),boundaryView=!interact||!S.selected;
    if(boundaryView)center.lerp(S.boundaryCenter,q);
    const zoom=(interact?S.zoom:1)*(boundaryView?1+q*.34:1);
    S.camera.position.set(center.x,center.y,40+center.z);S.camera.lookAt(center);S.camera.zoom=zoom;S.camera.updateProjectionMatrix();
    S.world.rotation.set(interact?S.pitch:0,interact?S.yaw:0,0);
    S.poset.setIsolation(q);
    const angle=params.rotate?2*Math.PI*((t%30)/30):0;
    for(const item of S.items){
      item.form.quaternion.copy(item.base).multiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),angle));
      if(item.boundary)item.pivot.position.copy(item.node.position).add(item.offset);
      item.pivot.visible=q<.999||item.boundary&&item.id===S.selected;
      if(item.boundary){
        if(!interact){item.form.scale.setScalar(item.restScale);item.expansion=null}
        else if(item.expansion){const e=item.expansion,u=Math.max(0,Math.min(1,(S.viewTime-e.start)/1.5)),v=u*u*(3-2*u);item.form.scale.setScalar(e.from+(e.to-e.from)*v)}
      }
    }
    for(const f of S.fadeMaterials){const fade=1-q;f.material.transparent=q>0||f.transparent;f.material.opacity=f.opacity*fade;if(f.uniform)f.uniform.value=f.uniformBase*fade;f.material.depthWrite=q===0&&f.depthWrite}
    S.sheet.group.visible=q<.999;
    r.render(S.scene,S.camera);
    if(interact&&env.overlay){
      const ctx=env.overlay.getContext?env.overlay.getContext('2d'):env.overlay;
      if(ctx?.fillText){ctx.save();ctx.fillStyle=C.fg;ctx.font='15px '+env.font;ctx.textAlign='center';
        for(const l of S.labels){if(!l.object.visible)continue;const p=l.object.getWorldPosition(new T.Vector3()).add(new T.Vector3(l.offset[0],l.offset[1],0)).project(S.camera);if(Math.abs(p.x)>1||Math.abs(p.y)>1)continue;ctx.fillStyle=l.color;ctx.fillText(l.text,(p.x*.5+.5)*b.w,(-p.y*.5+.5)*b.h)}ctx.restore();}
    }
  },
  onMode(env,S){
    if(env.mode!=='interact'||!env.ui){S.drag=null;S.selected=null;S.flight=null;S.center.copy(S.neutral.center);S.zoom=1;S.yaw=S.pitch=0;return}
    if(S.boundUI===env.ui)return;S.boundUI=env.ui;
    const xy=e=>[e.x??e.clientX,e.y??e.clientY];
    env.ui.addEventListener('pointerdown',e=>{const [x,y]=xy(e);S.flight=null;S.drag={x,y,startX:x,startY:y,yaw:S.yaw,pitch:S.pitch,moved:false}});
    env.ui.addEventListener('pointermove',e=>{if(!S.drag)return;const [x,y]=xy(e),d=S.drag;d.moved||=Math.hypot(x-d.startX,y-d.startY)>5;S.yaw=d.yaw+(x-d.x)*.004;S.pitch=Math.max(-.65,Math.min(.65,d.pitch+(y-d.y)*.004))});
    env.ui.addEventListener('pointerup',e=>{const d=S.drag;S.drag=null;if(!d||d.moved)return;const [x,y]=xy(e),b=env.box;S.pointer.set(x/b.w*2-1,1-y/b.h*2);S.ray.setFromCamera(S.pointer,S.camera);S.world.updateMatrixWorld(true);
      const hit=S.ray.intersectObjects(S.pick,false).find(h=>{for(let o=h.object;o;o=o.parent)if(!o.visible)return false;return true});const item=hit&&S.items.find(i=>i.id===hit.object.userData.selectId);focus(S,item&&item.id!==S.selected?item:null)});
    env.ui.addEventListener('pointercancel',()=>{S.drag=null});
    env.ui.addEventListener('wheel',e=>{S.flight=null;S.zoom=Math.max(.7,Math.min(5,S.zoom*Math.exp(-e.deltaY*.001)))});
    env.ui.addEventListener('keydown',e=>{if(e.key==='Escape'){S.yaw=S.pitch=0;focus(S,null)}});
    env.ui.addEventListener('dblclick',()=>{S.yaw=S.pitch=0;focus(S,null)});
  }
};

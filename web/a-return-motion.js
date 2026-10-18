/* Small position/velocity feedback for A presentation only. MIT. */
'use strict';
window.HalloweenAReturn=(()=>{
 const acceleration=1.6,response=4,stepLimit=1/120,epsilon=1e-4;
 const vector=v=>{if(!Array.isArray(v)||v.length!==2||v.some(x=>!Number.isFinite(x)))throw RangeError('Two finite coordinates required');return [...v];};
 function create(){
  const states=new Map();let revision=0,disposed=false,steps=0,elapsedSeconds=0;
  function initialize(id,position,velocity=[0,0]){if(disposed)throw Error('Return disposed');const p=vector(position),v=vector(velocity);states.set(id,{id,p,v,target:[...p],active:true});revision++;}
  function target(id,value){const t=vector(value);let s=states.get(id);if(!s?.active){initialize(id,t);s=states.get(id);}s.target=t;return [...s.p];}
  function moving(s){return s.active&&(Math.hypot(s.target[0]-s.p[0],s.target[1]-s.p[1])>epsilon||Math.hypot(...s.v)>epsilon*response);}
  // Bound acceleration with small time steps; arrival follows distance and velocity, not a fixed deadline.
  function advance(dt){
   if(!Number.isFinite(dt)||dt<0)throw RangeError('Nonnegative finite elapsed time required');if(disposed||!dt)return;
   elapsedSeconds+=dt;const n=Math.ceil(dt/stepLimit),h=dt/n;let changed=false;
   for(let k=0;k<n;k++)for(const s of states.values()){
    if(!moving(s))continue;const ex=s.target[0]-s.p[0],ey=s.target[1]-s.p[1],d=Math.hypot(ex,ey);
    // Far away: bounded near-constant acceleration. Slow before the target;
    // near it: damped velocity feedback. No duration or per-move deadline.
    const speed=Math.min(Math.sqrt(acceleration*d),response*d),factor=d?speed/d:0;
    let ax=(ex*factor-s.v[0])*4*response,ay=(ey*factor-s.v[1])*4*response;
    const magnitude=Math.hypot(ax,ay),limit=magnitude>acceleration?acceleration/magnitude:1;ax*=limit;ay*=limit;
    const vx=s.v[0],vy=s.v[1];s.v[0]+=ax*h;s.v[1]+=ay*h;s.p[0]+=(vx+s.v[0])*h*.5;s.p[1]+=(vy+s.v[1])*h*.5;changed=true;steps++;
    if(Math.hypot(s.target[0]-s.p[0],s.target[1]-s.p[1])<=epsilon&&Math.hypot(...s.v)<=epsilon*response){s.p=[...s.target];s.v=[0,0];}
   }
   if(changed)revision++;
  }
  return Object.freeze({initialize,target,advance,position:id=>states.has(id)?[...states.get(id).p]:null,
   retain(ids){const live=new Set(ids);for(const s of states.values())if(!live.has(s.id))s.active=false;},
   pending:()=>[...states.values()].some(moving),revision:()=>revision,
   status:()=>({units:'stage heights and seconds',acceleration,response,maximumStep:stepLimit,positionTolerance:epsilon,steps,elapsedSeconds,disposed,states:[...states.values()].map(s=>({id:s.id,position:[...s.p],velocity:[...s.v],target:[...s.target],active:s.active,moving:moving(s)})),policy:'position and velocity feedback;bounded acceleration;distance/initial velocity determine arrival;no deadline'}),
   dispose(){if(disposed)return;disposed=true;states.clear();revision++;}
  });
 }
 return Object.freeze({create});
})();

/* Presentation layout only. Original six motionMat states stay alive unchanged. */
'use strict';
window.HalloweenActorLayout=(()=>{
 // A quiet middle band for two-line text. Each row is symmetric about x=.5.
 const top=.13,bottom=.87;
 const slots=Object.freeze({
  1:[[.5,top]],2:[[.5,top],[.5,bottom]],
  3:[[.30,top],[.5,bottom],[.70,top]],
  4:[[.30,top],[.30,bottom],[.70,top],[.70,bottom]],
  5:[[.22,top],[.34,bottom],[.5,top],[.66,bottom],[.78,top]],
  6:[[.22,top],[.22,bottom],[.5,top],[.5,bottom],[.78,top],[.78,bottom]]
 });
 const duration=.28,travel=[.022,.014];
 function create(){
  let count=0,elapsed=duration,from=[],current=[],target=[];
  function sample(n,dt,paused=false){
   if(!Number.isInteger(n)||n<1||n>6)throw RangeError('Actor count1..6 required');
   if(n!==count){from=Array.from({length:6},(_,i)=>current[i]&&i<count?[...current[i]]:[...(slots[n][i]??current[i]??slots[n][0])]);target=Array.from({length:6},(_,i)=>[...(slots[n][i]??from[i])]);elapsed=count&&!paused?0:duration;count=n;}
   elapsed=paused?duration:Math.min(duration,elapsed+Math.max(0,dt));
   const f=elapsed/duration,e=f*f*(3-2*f);current=target.map((p,i)=>p.map((v,k)=>from[i][k]+(v-from[i][k])*e));
   return current.slice(0,n).map(p=>[...p]);
  }
  return Object.freeze({sample,status:()=>({count,elapsed,duration,transitioning:elapsed<duration,anchors:current.slice(0,count).map(p=>[...p]),travel:[...travel],policy:'symmetric rows around central text; layout-only smoothstep; Pause applies immediately'})});
 }
 function place(pose,anchor,bounds,width,height,size,index){
  // Uniform screen fit keeps every selected mesh inside its row, at every rotation.
  // MotionMat translation remains a smooth bounded displacement around the slot.
  const n=size,countScale=[0,.76,.72,.68,.66,.62,.60][n];
  const rowHeight=n===1?.21:n===3?(index%2===0?.1485:.21):n===5?(index%2===0?.1633:.20):.20;
  const scale=Math.min(countScale,width*(n>4?.23:.32)/Math.max(1,bounds.right-bounds.left),height*rowHeight/Math.max(1,bounds.bottom-bounds.top));
  const x=anchor[0]+travel[0]*Math.tanh(pose.position[0]/2),y=anchor[1]-travel[1]*Math.tanh(pose.position[1]/2);
  return {scale,center:[x*width,y*height],sourceCenter:[(bounds.left+bounds.right)/2,(bounds.top+bounds.bottom)/2],normalized:[x,y]};
 }
 return Object.freeze({create,place,slots,duration,travel});
})();

/* Initial projection preparation only; no timer or minimum brand duration. */
'use strict';
window.HalloweenProjectionStartup=(()=>{
 const root=document.documentElement,remote=window.HalloweenStageRole?.remote===true;
 if(!remote)return Object.freeze({ready:()=>false,status:()=>({phase:'inactive'})});
 const began=performance.now();let phase='preparing',completed=null;
 root.setAttribute('data-preparing','');
 function showError(){
  const note=document.getElementById('stage-start-note');if(note)note.textContent=root.lang==='en'?'The projection could not be prepared. Reload this window.':'映像を準備できませんでした。この窓を再読込みしてください。';
  for(const id of ['stage-fullscreen','stage-windowed']){const button=document.getElementById(id);if(button)button.disabled=true;}
 }
 function finish(next){
  if(phase!=='preparing')return false;phase=next;completed=performance.now();root.removeAttribute('data-preparing');
  document.getElementById('projection-preparing')?.setAttribute('aria-busy','false');window.removeEventListener('error',failed,true);
  if(next==='error'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',showError,{once:true});else showError();}return true;
 }
 function failed(event){if(event instanceof ErrorEvent||event.target?.tagName==='SCRIPT')finish('error');}
 window.addEventListener('error',failed,true);
 return Object.freeze({ready:()=>finish('ready'),status:()=>({phase,began,completed,elapsedMs:completed===null?null:completed-began})});
})();

/* Time-based performance cues; no independent timer or motion model. MIT. */
'use strict';
window.HalloweenPerformance=(()=>{
 const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)),copy=x=>JSON.parse(JSON.stringify(x)),wrap=x=>((x%1)+1)%1;
 const bindings=Object.freeze({motion:'1 2 3 4 5 6 7 8',look:'Q W E R T Y U I',text:'A S D F G H J K',count:'9 / 0',scene:'Z',flip:'X',mode:'C',accent:'V',baseline:'B (0.6秒)',reset:'N (0.6秒)',pause:'Space',disarm:'Esc'});
 function create(api,{batch=fn=>fn(),clock=()=>performance.now()/1000,requestUpdate=()=>false}={}){
  let scene='a',size=.625,accent=false,ended=false,revision=0;
  let profiles={a:{motion:.5,look:138/360,glow:0,mode:0},b:{motion:.5,look:2/3,rotation:.5,mode:1}},baseline={profiles:copy(profiles),size};
  const transitions=new Map(),targets=new Map(),duration=.15;
  const set=(k,v)=>api.set(k,v,{source:'performance-cue'}),key=(axis,s=scene)=>axis==='text'?'text':s+':'+axis;
  const read=(axis,s=scene)=>axis==='text'?size:profiles[s][axis];
  const write=(axis,s,v)=>{if(axis==='text')size=v;else profiles[s][axis]=axis==='look'?wrap(v):v;};
  function apply(){if(ended)return;const p=profiles[scene],f=p.motion*2;
   batch(()=>{set('text.sizeNormalized',size);if(scene==='a'){set('a.positionNoiseAmplitude',clamp(.2*f));set('a.rotationNoiseAmplitude',clamp(.28*f));set('a.jawNoiseAmplitude',clamp(2*f,0,3));set('a.motionCross',1-p.motion);set('a.motionStrength',p.motion);set('a.jawMode',['noise','closed','open'][p.mode%3]);set('a.backgroundHue',p.look);set('a.headGlowMix',p.glow);set('a.foregroundBurst',accent);}else{set('b.forceGain',accent?1:p.motion);set('b.initialSpeed',clamp(1.3*(1+p.motion)+(accent?.45:0),0,2.6));set('b.flapRate',.5+p.motion);set('b.motionMix',accent?1:p.rotation);set('b.colorHue',p.look);}});revision++;
  }
  function advance(now=clock()){if(ended)return false;if(!Number.isFinite(now))throw RangeError('Finite cue time');let changed=false;
   for(const [id,t] of transitions){const elapsed=Math.max(0,now-t.started),u=elapsed>=duration-1e-9?1:clamp(elapsed/duration),v=u===1?t.to:t.from+t.delta*u;write(t.axis,t.scene,v);if(t.scene===scene||t.axis==='text')changed=true;if(u===1)transitions.delete(id);}
   if(changed)apply();return changed;
  }
  function queue(axis,value,position=null,s=scene,now=clock()){
   const from=read(axis,s),to=axis==='look'?wrap(value):value;let delta=to-from;if(axis==='look'){if(delta>.5)delta--;if(delta<-.5)delta++;}
   targets.set(key(axis,s),{target:to,position});if(Math.abs(delta)<1e-12){write(axis,s,to);transitions.delete(key(axis,s));return;}
   transitions.set(key(axis,s),{axis,scene:s,from,to,delta,started:now});
  }
  function cue(axis,value,position=null){const now=clock();advance(now);queue(axis,value,position,scene,now);if(axis==='look'&&scene==='a')queue('glow',clamp((wrap(value)-138/360)/(1-138/360))*.7,null,'a',now);revision++;if(!requestUpdate())advance(now+duration);}
  const positions=axis=>Array.from({length:8},(_,i)=>axis==='look'?i/8:axis==='text'?.02+i*.98/7:i/7);
  function select(next){if(!['a','b'].includes(next))throw RangeError('Scene a/b required');advance();accent=false;scene=next;batch(()=>{api.select(scene);if(scene==='a'){set('a.compare.sixActors',true);set('a.compare.nativeResolution',true);}apply();});requestUpdate();return state();}
  function axisInfo(axis){const t=targets.get(key(axis))??{target:read(axis),position:null},cyclic=axis==='look',label=axis==='motion'?(scene==='a'?'ドクロの動きの激しさ':'コウモリの力・初速・羽ばたき'):axis==='look'?(scene==='a'?'背景の色相':'コウモリの色相'):'文字サイズ';return {axis,label,value:read(axis),target:t.target,position:t.position,transitioning:transitions.has(key(axis)),positions:positions(axis),keys:axis==='motion'?'12345678':axis==='look'?'QWERTYUI':'ASDFGHJK',cyclic,min:axis==='text'?.02:0,max:1,format:cyclic?'degrees':'percent'};}
  function state(){const transform=api.get('output.transformMode');return {scene,size,accent,profiles:copy(profiles),baseline:copy(baseline),revision,ended,bindings,axes:['motion','look','text'].map(axisInfo),cueDurationSeconds:duration,pendingCues:transitions.size,positionSemantics:'8 discrete targets;time-based linear real values;shortest circular hue path;precise sliders supported',orientation:{mode:((transform-1)&3)+1,label:['通常','左右反転','上下反転','上下左右反転'][(transform-1)&3]},labels:{motion:scene==='a'?'頭・顎の動き':'飛行の力＋初速＋羽ばたき',look:scene==='a'?'背景の色相':'コウモリの色相',mode:scene==='a'?'顎の動き方3状態':'渦と向きの3配分',accent:scene==='a'?'前景の光':'新個体の速さ＋回り方'},scope:'Input cue interpolation;existing motion/clock/model retained'};}
  function dispatch(c){if(ended)throw Error('Performance ended');if(!c||typeof c!=='object'||Array.isArray(c))throw TypeError('Intent object required');
   if(c.action==='scene')return select(c.value);if(c.action==='sceneToggle')return select(scene==='a'?'b':'a');
   if(c.action==='flip'){set('output.transformMode',api.get('output.transformMode')%4+1);revision++;}
   else if(c.action==='preset'){if(!['motion','look','text'].includes(c.axis)||!Number.isInteger(c.position)||c.position<1||c.position>8)throw RangeError('Axis and position1..8 required');cue(c.axis,positions(c.axis)[c.position-1],c.position);}
   else if(c.action==='setAxis'){if(!['motion','look','text'].includes(c.axis)||typeof c.value!=='number'||!Number.isFinite(c.value)||c.value<0||c.value>1)throw RangeError('Normalized axis required');cue(c.axis,c.axis==='text'?clamp(c.value,.02,1):c.value);}
   else if(c.action==='adjust'){if(!['motion','look','text'].includes(c.axis)||!Number.isFinite(c.delta)||Math.abs(c.delta)>.12)throw RangeError('Bounded relative axis');cue(c.axis,clamp(read(c.axis)+c.delta,c.axis==='text'?.02:0,1));}
   else if(c.action==='actorCountStep'){if(c.delta!==-1&&c.delta!==1)throw RangeError('Single count step');if(scene==='a')set('a.actorCount',clamp(api.get('a.actorCount')+c.delta,1,6));}
   else if(c.action==='accent'){if(typeof c.value!=='boolean')throw TypeError('Boolean accent');if(accent!==c.value){accent=c.value;apply();}}
   else if(c.action==='mode'){const p=profiles[scene];p.mode=(p.mode+1)%3;if(scene==='b')p.rotation=[0,.5,1][p.mode];apply();}
   else if(c.action==='capture'){advance();baseline={profiles:copy(profiles),size};revision++;}
   else if(c.action==='baseline'){const now=clock();advance(now);for(const s of ['a','b']){profiles[s].mode=baseline.profiles[s].mode;for(const a of ['motion','look',...(s==='a'?['glow']:['rotation'])])queue(a,baseline.profiles[s][a],null,s,now);}queue('text',baseline.size,null,scene,now);accent=false;apply();if(!requestUpdate())advance(now+duration);}
   else if(c.action==='pause')api.dispatch({type:'command',name:'transport.togglePause'},{source:'performance'});
   else if(c.action==='reset')api.dispatch({type:'command',name:'scene.reset',scene},{source:'performance'});
   else throw RangeError('Unknown performance intent');return state();
  }
  select('a');return Object.freeze({dispatch,state,advance,pending:()=>!ended&&transitions.size>0,interpolatesTargets:true,release(){if(!ended&&accent){accent=false;if(!api.getState().view.ended)apply();}},dispose(){if(!ended){this.release();ended=true;transitions.clear();}},schema:Object.freeze({version:2,actions:['scene','sceneToggle','flip','preset','setAxis','actorCountStep','adjust','accent','mode','capture','baseline','pause','reset']})});
 }
 return Object.freeze({create,bindings});
})();

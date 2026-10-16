/* Device-independent performance intentions -> existing bounded visual API. */
'use strict';
window.HalloweenPerformance=(()=>{
 const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)),copy=x=>JSON.parse(JSON.stringify(x));
 const bindings=Object.freeze({motion:'A / D',look:'J / L',text:' , / .',mode:'K',accent:'Z',baseline:'M (0.6秒)',scene:'1 / 2',pause:'Space',reset:'R',disarm:'Esc'});
 function create(api,{batch=fn=>fn()}={}){
  let scene='a',size=.625,accent=false,ended=false,revision=0;
  let profiles={a:{motion:.5,look:138/360,mode:0},b:{motion:.5,look:.5,mode:1}},baseline={profiles:copy(profiles),size};
  const set=(k,v)=>api.set(k,v,{source:'performance-macro'});
  function apply(){if(ended)return;const p=profiles[scene],f=p.motion*2;
   batch(()=>{set('text.sizeNormalized',size);
    if(scene==='a'){set('a.positionNoiseAmplitude',clamp(.2*f));set('a.rotationNoiseAmplitude',clamp(.28*f));set('a.jawNoiseAmplitude',clamp(2*f,0,3));set('a.motionCross',clamp(.25+p.motion*.5));set('a.jawMode',['noise','closed','open'][p.mode%3]);set('a.backgroundHue',p.look);set('a.headGlowMix',clamp((p.look-138/360)/(1-138/360))*.7);set('a.foregroundBurst',accent);}
    else{set('b.initialSpeed',clamp(1.3*f+(accent?.45:0),0,2.6));set('b.flapRate',.5+p.motion);set('b.motionMix',accent?1:p.look);}
   });revision++;
  }
  function select(next){if(!['a','b'].includes(next))throw new RangeError('Scene a/b required');accent=false;scene=next;batch(()=>{api.select(scene);if(scene==='a'){set('a.compare.sixActors',true);set('a.compare.nativeResolution',true);}apply();});return state();}
  function state(){return {scene,size,accent,profiles:copy(profiles),baseline:copy(baseline),revision,ended,bindings,labels:scene==='a'?{motion:'頭・顎の動き',look:'背景の色＋骨の光',mode:'顎の入力3状態',accent:'前景の光'}:{motion:'新個体の速さ＋羽ばたき',look:'回転・渦・螺旋の混合',mode:'回り方3段階',accent:'新個体の速さ＋回り方'},scope:'Existing visual parameters; no new force/physics model'};}
  function dispatch(c){if(ended)throw Error('Performance ended');if(!c||typeof c!=='object'||Array.isArray(c))throw TypeError('Intent object required');
   if(c.action==='scene')return select(c.value);
   if(c.action==='adjust'){if(!['motion','look','text'].includes(c.axis)||typeof c.delta!=='number'||!Number.isFinite(c.delta)||Math.abs(c.delta)>.12)throw RangeError('Bounded relative axis required');if(c.axis==='text')size=clamp(size+c.delta,.02,1);else profiles[scene][c.axis]=clamp(profiles[scene][c.axis]+c.delta);apply();}
   else if(c.action==='setAxis'){if(!['motion','look','text'].includes(c.axis)||typeof c.value!=='number'||!Number.isFinite(c.value)||c.value<0||c.value>1)throw RangeError('Normalized axis required');if(c.axis==='text')size=clamp(c.value,.02,1);else profiles[scene][c.axis]=c.value;apply();}
   else if(c.action==='accent'){if(typeof c.value!=='boolean')throw TypeError('Boolean accent required');if(accent!==c.value){accent=c.value;apply();}}
   else if(c.action==='mode'){const p=profiles[scene];p.mode=(p.mode+1)%3;if(scene==='b')p.look=[.15,.5,.85][p.mode];apply();}
   else if(c.action==='capture'){baseline={profiles:copy(profiles),size};revision++;}
   else if(c.action==='baseline'){profiles=copy(baseline.profiles);size=baseline.size;accent=false;apply();}
   else if(c.action==='pause')api.dispatch({type:'command',name:'transport.togglePause'},{source:'performance'});
   else if(c.action==='reset')api.dispatch({type:'command',name:'scene.reset',scene},{source:'performance'});
   else throw RangeError('Unknown performance intent');return state();
  }
  select('a');return Object.freeze({dispatch,state,release(){if(!ended&&accent){accent=false;if(!api.getState().view.ended)apply();}},dispose(){if(!ended){this.release();ended=true;}},schema:Object.freeze({version:1,actions:['scene','adjust','setAxis','accent','mode','capture','baseline','pause','reset']})});
 }
 return Object.freeze({create,bindings});
})();

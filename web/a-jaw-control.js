/* Small manual jaw presentation layer; original automatic source stays live. MIT. */
'use strict';
window.HalloweenAJaw=(()=>{
 const responseSeconds=.035,angleTolerance=.002,blendTolerance=1e-4;
 const angle=v=>{if(!Number.isFinite(v)||v<0||v>90)throw RangeError('Jaw angle0..90 required');return v;};
 function create(initial={}){
  let manual=!!initial.jawManual,target=angle(initial.jawManualAngle??0),value=target,blend=manual?1:0,revision=0,disposed=false;
  function sync(s){const next=!!s.jawManual,t=angle(s.jawManualAngle??0);if(next&&!manual&&blend===0)value=t;manual=next;target=t;}
  function pending(){return !disposed&&(blend!==(manual?1:0)||blend>0&&value!==target);}
  return Object.freeze({sync,pending,revision:()=>revision,
   advance(dt,s){if(!Number.isFinite(dt)||dt<0)throw RangeError('Nonnegative jaw presentation time');if(disposed)return;sync(s);if(!dt)return;const oldBlend=blend,oldValue=value,a=-Math.expm1(-dt/responseSeconds),goal=manual?1:0;blend+=(goal-blend)*a;value+=(target-value)*a;if(Math.abs(blend-goal)<blendTolerance)blend=goal;if(Math.abs(value-target)<angleTolerance)value=target;if(blend!==oldBlend||(blend>0||oldBlend>0)&&value!==oldValue)revision++;},
   sample(automatic){angle(automatic);return blend===0?automatic:automatic*(1-blend)+value*blend;},
   status:()=>({manual,targetAngle:target,presentedAngle:value,manualBlend:blend,responseSeconds,pending:pending(),disposed,policy:'L amount and M toggle are separate;manual display override;C restores live automatic source;pause permits manual pose edits'}),
   dispose(){disposed=true;blend=0;}
  });
 }
 return Object.freeze({create});
})();

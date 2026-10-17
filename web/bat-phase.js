/* Copyright (c) 2026 hiro-collab. MIT; see LICENSE.txt.
 * Sampler code and owner-scene fixed seed1/depth60 response data. */
'use strict';
window.HalloweenBatPhase=(()=>{
 const f=Math.fround,sequence=[-44.593814849853516, 49.967201232910156, -6.017807960510254, -0.3728914260864258, -46.62885284423828, -5.715576171875, -36.539093017578125, -20.791278839111328, 52.271732330322266, -38.516807556152344, -31.292503356933594, 11.85554313659668, 38.05150604248047, -12.441265106201172, 14.977663040161133, -46.182037353515625, -57.42768478393555, 38.57274627685547, 51.148887634277344, -1.9972765445709229, -55.568843841552734, 29.995243072509766, 56.97287368774414, 37.84394454956055, -35.927982330322266, 48.056610107421875, -22.606761932373047, -54.72067642211914, -35.50065612792969, 19.808937072753906, 40.7587776184082, 46.001129150390625, 10.214924812316895, -10.405043601989746, 8.58384895324707, 19.34980583190918, -36.008148193359375, 15.245038986206055, 44.54335021972656, 15.330984115600586, 55.616111755371094];
 function create(){let history=[],count=0,frame=0,updates=0;
  function update(particleCount,sourceFrame){
   if(!Number.isInteger(particleCount)||particleCount<0||particleCount>40)throw new RangeError('Measured particle counts0..40 required');
   if(!Number.isInteger(sourceFrame)||sourceFrame<0)throw new RangeError('Nonnegative source frame required');
   count=particleCount;frame=sourceFrame;const samples=Math.max(1,count),current=frame%60;
   if(!history.length)history=[current];
   // Original Trail resizes by holding its previous right value before shifting.
   history=Array.from({length:samples},(_,i)=>history[Math.min(i,history.length-1)]).slice(1);history.push(current);updates++;
   return indices();
  }
  function capture(particleCount,sourceFrame,elapsedSamples=1){
   if(!Number.isSafeInteger(elapsedSamples)||elapsedSamples<1)throw new RangeError('Positive elapsed sample count required');
   // Native one-sample input is held across a Time Slice, including dropped frames.
   // More than capacity repeated values fully replace the observable history.
   const repeats=Math.min(elapsedSamples,40);for(let i=0;i<repeats;i++)update(particleCount,sourceFrame);
   updates+=elapsedSamples-repeats;return indices();
  }
  function indices(lock=null){
   if(lock!==null){if(!Number.isInteger(lock)||lock<0||lock>=60)throw new RangeError('Frame lock0..59 required');return Array(40).fill(lock);}
   const samples=Math.max(1,count),trail=history.length?history:[0];
   return Array.from({length:40},(_,i)=>{const noise=sequence[40-samples+Math.min(i,samples)],locked=2*(128+Math.floor(i/2)),rolling=trail[Math.min(i,trail.length-1)];return ((Math.trunc(f(f(locked+noise)+rolling))%60)+60)%60;});
  }
  function reset(){history=[];count=frame=updates=0;}
  return Object.freeze({update,capture,indices,reset,status:()=>({count,frame,updates,samples:Math.max(1,count),rolling:[...history],capacity:40,mode:'native fixed response and resize/hold/shift Trail; capture holds current frame over elapsed Time Slice',nativeClockOriginMatched:false})});
 }
 return Object.freeze({create});
})();

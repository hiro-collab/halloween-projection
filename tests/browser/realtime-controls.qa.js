async operator=>{
 const rows=[],errors=[],test=(name,ok,data)=>rows.push({name,ok:!!ok,data});
 await operator.goto('__WEB_URI__/console.html');
 const pop=operator.waitForEvent('popup');await operator.locator('#open-stage').click();const stage=await pop;stage.on('pageerror',e=>errors.push(e.message));await stage.setViewportSize({width:1280,height:720});await operator.waitForFunction(()=>halloweenConsole?.status().connected);await stage.locator('#stage-windowed').click();
 const state=()=>stage.evaluate(()=>{const d=halloweenDiagnostics();return {wall:performance.now()/1000,phase:d.phase,a:d.skull?.scene.motionState,b:d.sprite?.motionContract,draw:d.skull?.raster.stageFrames??d.fireResources.draws,settings:d.settings};});
 for(const scene of ['a','b']){
  await stage.evaluate(scene=>halloweenPerformance.dispatch({action:'scene',value:scene}),scene);if(scene==='b')await stage.waitForFunction(()=>halloweenDiagnostics().sprite?.state==='ready');await stage.waitForTimeout(1200);
  for(const rate of [.5,2]){
   await stage.evaluate(({scene,rate})=>{if(scene==='a'){halloweenControls.set('a.headCycleRate',rate);halloweenControls.set('a.jawCycleRate',rate);}else{halloweenControls.set('b.playbackRate',rate);halloweenControls.set('b.flapRate',rate);}}, {scene,rate});
   await stage.waitForTimeout(200);const before=await state();await stage.waitForTimeout(1700);const after=await state(),seconds=after.wall-before.wall;
   if(scene==='a'){const timeRatio=(after.a.headSeconds-before.a.headSeconds)/seconds,cooks=after.a.steps-before.a.steps,draws=after.draw-before.draw;test('A realtime rate '+rate,Math.abs(timeRatio-rate)<.08&&Math.abs(cooks-draws)<=1,{seconds,timeRatio,cooks,draws});}
   else{const flightRatio=(after.b.flightTime-before.b.flightTime)/seconds,flapRatio=(after.b.flapTime-before.b.flapTime)/seconds,sampleRate=(after.b.phaseTicks-before.b.phaseTicks)/seconds,cookRate=(after.b.phaseCooks-before.b.phaseCooks)/seconds;test('B realtime rate '+rate,Math.abs(flightRatio-rate)<.06&&Math.abs(flapRatio-rate)<.06&&Math.abs(sampleRate-60)<1.5,{seconds,flightRatio,flapRatio,sampleRate,cookRate});}
  }
  await stage.evaluate(()=>halloweenControls.dispatch({type:'command',name:'transport.pause'}));const held=await state();await stage.waitForTimeout(750);const later=await state();test(scene+' Pause freezes motion clock and history',JSON.stringify(held[scene])===JSON.stringify(later[scene]),{held:held[scene],later:later[scene]});
  await stage.evaluate(()=>halloweenControls.dispatch({type:'command',name:'scene.reset'}));const reset=await state();test(scene+' Reset uses current shared clock',scene==='a'?Math.abs(reset.a.headSeconds-reset.a.jawSeconds)<.001&&reset.a.steps===0:reset.b.steps===0&&reset.b.phaseTicks===0&&reset.b.flapFrame>60,{reset:reset[scene],held:held[scene]});
  await stage.evaluate(()=>halloweenControls.dispatch({type:'command',name:'transport.resume'}));await stage.waitForTimeout(400);const resumed=await state();test(scene+' Resume advances without paused-wall catch-up',scene==='a'?resumed.a.headSeconds-reset.a.headSeconds>0&&resumed.a.headSeconds-reset.a.headSeconds<1.2:resumed.b.flapTime-reset.b.flapTime>0&&resumed.b.flapTime-reset.b.flapTime<1.2,{reset:reset[scene],resumed:resumed[scene]});
 }
 await stage.evaluate(()=>halloweenControls.dispatch({type:'command',name:'application.end'}));await stage.close();test('no browser errors',!errors.length,errors);return {passed:rows.filter(x=>x.ok).length,failed:rows.filter(x=>!x.ok).length,rows,scope:'Owned headless real-wall-time browser tests. Web rates are explicit extensions; Native root-rate semantics are separately measured.'};
}

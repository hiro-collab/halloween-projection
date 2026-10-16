async page=>{
 const rows=[],counts=[],errors=[],shots='__QA_OUT__',test=(name,ok,data)=>rows.push({name,ok:!!ok,data});let stage;
 try{
 await page.goto('__WEB_URI__/console.html');const popup=page.waitForEvent('popup');await page.locator('#open-stage').click();stage=await popup;stage.on('pageerror',e=>errors.push(e.message));await stage.setViewportSize({width:1920,height:1080});await page.waitForFunction(()=>halloweenConsole.status().connected);await stage.locator('#stage-windowed').click();await stage.evaluate(()=>halloweenControls.set('a.actorLayout','rows'));
 await stage.evaluate(()=>{for(const [k,v] of [['a.positionNoiseAmplitude',1],['a.rotationNoiseAmplitude',1],['a.jawNoiseAmplitude',3],['a.headCycleRate',2],['a.jawCycleRate',2],['a.jawMaxAngle',45],['a.scale',1.5]])halloweenControls.set(k,v);});
 const snap=()=>stage.evaluate(()=>{const d=halloweenDiagnostics();return {version:d.version,phase:d.phase,stage:d.stage,backing:d.backing,settings:d.settings,scene:d.skull.scene,actors:d.skull.actors,raster:d.skull.raster.active,post:d.skull.composite,text:d.skull.textMask,draws:d.skullRasterResources.draws,flow:d.skull.flow,resources:d.aCompositeResources};});
 for(let n=1;n<=6;n++){
  await stage.evaluate(n=>halloweenControls.set('a.actorCount',n),n);await stage.waitForTimeout(550);let clips=0,overlap=0,displacement=0;
  const start=await snap();
  for(let j=0;j<7;j++){const s=await snap();for(const p of s.actors){const b=p.bounds;clips+=+(b.left<0||b.top<0||b.right>1920||b.bottom>1080);overlap+=+(b.bottom>270&&b.top<810);}await stage.waitForTimeout(190);}
  const end=await snap();displacement=Math.hypot(...end.actors[0].position.map((v,i)=>v-start.actors[0].position[i]));
  test('FHD strong motion '+n+' mesh stays on-screen',clips===0,{clips,overlap});
  test('FHD strong motion '+n+' leaves central text band',overlap===0,{overlap});test('FHD standard text '+n+' is not clipped',end.text.clipped===false,end.text.bounds);
  test('FHD count '+n+' raster processes only selected triangles',end.raster.triangles===4548*n,end.raster);
  test('FHD count '+n+' retains natural translation and jaw/rotation',displacement>1e-6&&end.scene.motionState.steps>start.scene.motionState.steps,{displacement,start:start.actors[0],end:end.actors[0]});
  await stage.evaluate(()=>halloweenControls.set('a.foregroundBurst',true));await stage.waitForTimeout(220);const lit=await snap();
  test('FHD count '+n+' foreground has no hidden actor branches',lit.post.foregroundBranches===Math.ceil(n/2)&&!lit.post.error,lit.post.foreground);await stage.evaluate(()=>halloweenControls.set('a.foregroundBurst',false));
  counts.push({n,clips,overlap,displacement,triangles:end.raster.triangles,foregroundBranches:lit.post.foregroundBranches,text:end.text,actors:end.actors});await stage.locator('#canvas').screenshot({path:shots+'/fhd-count-'+n+'.png'});
 }
 await stage.evaluate(()=>{halloweenControls.set('a.headGlowMix',1);halloweenControls.set('text.sizeNormalized',1);});await stage.waitForTimeout(800);await stage.locator('#canvas').screenshot({path:shots+'/fhd-max-text-glow.png'});test('maximum text/Glow stays operable without renderer error',!(await snap()).post.error);
 await stage.evaluate(()=>{halloweenControls.set('a.headGlowMix',0);halloweenControls.set('text.sizeNormalized',.625);});await stage.waitForTimeout(800);
 const a=await snap(),wall=Date.now();await stage.waitForTimeout(20000);const b=await snap(),elapsed=(Date.now()-wall)/1000;
 const performance={seconds:elapsed,drawFPS:(b.draws-a.draws)/elapsed,solverHz:(b.flow.steps-a.flow.steps)/elapsed,feedbackHz:(b.scene.motionState.steps-a.scene.motionState.steps)/elapsed,droppedSeconds:b.flow.timing.droppedSeconds-a.flow.timing.droppedSeconds,postGPUBytes:[a.resources.gpuBytes,b.resources.gpuBytes],dpr:1,resolution:[1920,1080],internal:b.post.resolution,settings:b.settings};
 test('FHD six actors continuous run has bounded GPU allocation',a.resources.gpuBytes===b.resources.gpuBytes,performance);test('FHD six actors continuous run remains active',b.phase==='running'&&performance.drawFPS>20,performance);
 test('no page errors',!errors.length,errors);await stage.evaluate(()=>halloweenControls.dispatch({type:'command',name:'application.end'}));const passed=rows.filter(x=>x.ok).length;return {passed,failed:rows.length-passed,rows,counts,performance,errors,scope:'v40 ZIP FHD DPR1; scale1.5 and maximum position/rotation/jaw amplitudes, rate2; seven moving samples/count;20s final continuous run. Text size1/Glow1 reviewed separately; intentional large-text overlap remains.'};
 }catch(e){return {passed:rows.filter(x=>x.ok).length,failed:1,error:String(e),rows,counts,errors};}
}

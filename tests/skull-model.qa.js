async page=>{
 page.setDefaultTimeout(5000);const checks=[],check=(name,ok,detail={})=>checks.push({name,ok,detail});
 await page.context().setOffline(false);await page.reload();const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 const api=code=>page.evaluate(code);
 await page.locator('#skull3d').click();
 let d=await api(()=>halloweenDiagnostics());
 check('CC0 alternate loads one full separated mesh without image bitmap',d.skull?.ready&&d.skull.vertices===2435&&d.skull.triangles===4548&&d.skull.headTriangles===2656&&d.skull.jawTriangles===1892&&d.skullResources.liveScopes===1&&d.imageResources.open===0,d.skull);
 check('UI hides unused text and old speed for 3D',!(await page.locator('#text').isVisible())&&!(await page.locator('#speed').isVisible())&&await page.locator('#skull-options').isVisible());
 const rejected=await api(()=>{
  const before=JSON.stringify(halloweenControl.values('skull3d'));let rejected=0;
  for(const [k,v] of [['headRate',-1],['jawRate',NaN],['jawOpen',46],['pivotY',-2],['pivotZ',1],['jawTint',.5]])try{halloweenControl.set('skull3d',k,v);}catch(_){rejected++;}
  return {rejected,unchanged:before===JSON.stringify(halloweenControl.values('skull3d'))};
 });
 check('six invalid model controls rejected atomically',rejected.rejected===6&&rejected.unchanged,rejected);
 await page.locator('#skull-headRate').fill('0');
 check('model UI uses shared API',await api(()=>halloweenControl.values('skull3d').headRate===0));
 await api(()=>{halloweenControl.set('skull3d','jawRate',1);halloweenControl.set('skull3d','jawOpen',28);halloweenControl.reset('skull3d');});
 const headHash=()=>page.evaluate(async()=>{const c=document.getElementById('canvas'),ctx=c.getContext('2d'),bytes=ctx.getImageData(Math.floor(c.width*.4),Math.floor(c.height*.23),Math.floor(c.width*.2),Math.floor(c.height*.14)).data;return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(b=>b.toString(16).padStart(2,'0')).join('');});
 const first=await api(()=>halloweenDiagnostics().skull),headBefore=await headHash();await page.waitForTimeout(700);
 const movingJaw=await api(()=>halloweenDiagnostics().skull),headAfter=await headHash();
 check('jaw animates while head geometry and clock stay fixed',movingJaw.jawTime>first.jawTime+.4&&movingJaw.headTime===first.headTime&&headBefore===headAfter,{before:first,after:movingJaw,headPixelsEqual:headBefore===headAfter});
 await api(()=>{halloweenControl.set('skull3d','headRate',1);halloweenControl.set('skull3d','jawRate',0);halloweenControl.set('skull3d','jawOpen',0);halloweenControl.reset('skull3d');});
 const fixedJaw=await api(()=>halloweenDiagnostics().skull);await page.waitForTimeout(700);
 const movingHead=await api(()=>halloweenDiagnostics().skull);
 check('head spins while jaw clock and local opening stay fixed',movingHead.headTime>fixedJaw.headTime+.4&&movingHead.jawTime===fixedJaw.jawTime&&movingHead.jawAngle===0,{before:fixedJaw,after:movingHead});
 await api(()=>{halloweenControl.set('skull3d','headRate',0);halloweenControl.set('skull3d','jawRate',0);halloweenControl.set('skull3d','jawOpen',28);halloweenControl.set('skull3d','jawTint',1);});
 const manual=await api(()=>halloweenDiagnostics().skull);check('manual opening and verified initial pivot apply',manual.jawAngle===28&&manual.pivot[1]===-.75&&manual.pivot[2]===-.12,manual);
 const lit=await page.evaluate(async()=>{
  const c=document.getElementById('canvas'),ctx=c.getContext('2d'),counts=[];
  for(let f=0;f<12;f++){
   await new Promise(requestAnimationFrame);
   const bytes=ctx.getImageData(0,0,c.width,c.height).data;let n=0;
   for(let i=0;i<bytes.length;i+=80)if(bytes[i]+bytes[i+1]+bytes[i+2]>30)n++;
   counts.push(n);
  }return counts;
 });
 check('held frames stay visible without black flashing',lit.every(n=>n>100),lit);
 await page.screenshot({path:'output/skull-manual-open.png'});
 await api(()=>{halloweenControl.set('skull3d','headRate',1);halloweenControl.set('skull3d','jawRate',1);halloweenControl.set('skull3d','jawTint',0);halloweenControl.reset('skull3d');});
 await page.setViewportSize({width:1920,height:1080});if(await page.locator('#hide').isVisible())await page.locator('#hide').click();
 const initialFrames=await api(()=>halloweenDiagnostics().skull.performance.frames);const t=Date.now();await page.waitForTimeout(4500);
 const perf=await api(()=>halloweenDiagnostics().skull.performance),fps=(perf.frames-initialFrames)/((Date.now()-t)/1000);
 check('full 4548-triangle software geometry meets private 30Hz budget',perf.p95Ms<33.34&&fps>=20&&fps<=35,{viewport:[1920,1080],fps,...perf});
 await api(()=>halloweenControl.pause());const paused=await api(()=>halloweenDiagnostics().skull),pausePixels=await headHash();await page.waitForTimeout(250);
 const held=await api(()=>halloweenDiagnostics().skull);
 check('Pause freezes head/jaw clocks and pixels',held.headTime===paused.headTime&&held.jawTime===paused.jawTime&&await headHash()===pausePixels);
 await api(()=>halloweenControl.reset('skull3d'));d=await api(()=>halloweenDiagnostics());
 check('paused Reset restarts independent clocks without resuming',d.phase==='paused'&&d.skull.headTime===0&&d.skull.jawTime===0&&d.skull.jawAngle===0&&d.pendingRAF===0);
 await api(()=>{halloweenControl.set('skull3d','jawRate',0);halloweenControl.set('skull3d','jawOpen',45);halloweenControl.set('skull3d','size',1.5);});
 const bounds=[];
 for(const [w,h] of [[1280,720],[360,640]]){await page.setViewportSize({width:w,height:h});if(await page.locator('#hide').isVisible())await page.locator('#hide').click();await page.waitForFunction(({w,h})=>{const d=halloweenDiagnostics();return Math.abs(d.stage[0]-w)<1&&Math.abs(d.stage[1]-h)<1;},{w,h},{timeout:5000});for(const py of [-1.15,-.65])for(const pz of [-.3,.2]){
  await page.evaluate(({py,pz})=>{halloweenControl.set('skull3d','pivotY',py);halloweenControl.set('skull3d','pivotZ',pz);},{py,pz});
  bounds.push(await api(()=>{const d=halloweenDiagnostics();return {stage:d.stage,bounds:d.skull.bounds,py:d.settings.pivotY,pz:d.settings.pivotZ};}));
 }}
 check('maximum size/opening and pivot extremes fit landscape and portrait',bounds.every(x=>x.bounds.left>=0&&x.bounds.top>=0&&x.bounds.right<=x.stage[0]&&x.bounds.bottom<=x.stage[1]),bounds);
 await page.keyboard.press('Escape');await page.setViewportSize({width:1280,height:720});
 await api(()=>{halloweenControl.set('skull3d','size',1);halloweenControl.set('skull3d','pivotY',-.75);halloweenControl.set('skull3d','pivotZ',-.12);});
 // Reassigning same viewport exercises explicit dirty repaint for a frozen model.
 await page.setViewportSize({width:1280,height:720});await page.waitForTimeout(100);
 check('frozen model remains visible after resize',await api(()=>{const c=document.getElementById('canvas'),a=c.getContext('2d').getImageData(0,0,c.width,c.height).data;return a.some((v,i)=>i%4!==3&&v>40);}));
 await api(()=>{for(let i=0;i<300;i++){halloweenControl.select('skull3d');halloweenControl.select(i%2?'bats':'skeleton');}halloweenControl.stop();});
 await page.waitForFunction(()=>halloweenDiagnostics().imageResources.pending===0,{},{timeout:8000});d=await api(()=>halloweenDiagnostics());
 check('300 three-scene transitions close every mesh and keep one RAF maximum',d.skullResources.created===d.skullResources.disposed&&d.skullResources.liveScopes===0&&d.skullResources.modelBytes===0&&d.skullResources.scratchBytes===0&&d.skullResources.maxLive===1&&d.pendingRAF===0&&d.stats.maxPendingRAF===1,d.skullResources);
 await api(()=>{halloweenControl.select('skull3d');halloweenControl.stop();});d=await api(()=>halloweenDiagnostics());
 check('Stop releases model/render buffers with black 1x1 backing',d.skullResources.liveScopes===0&&d.skullResources.modelBytes===0&&d.skullResources.scratchBytes===0&&d.backing[0]===1&&d.backing[1]===1&&d.pendingRAF===0);
 await api(()=>halloweenControl.resume());d=await api(()=>halloweenDiagnostics());
 check('Resume reconstructs one mesh from embedded source',d.selected==='skull3d'&&d.skull?.ready&&d.skullResources.liveScopes===1);
 await page.locator('#quit').click();d=await api(()=>halloweenDiagnostics());
 check('End drops encoded model and all own resources',d.destroyed&&d.skullResources.encodedChars===0&&d.skullResources.liveScopes===0&&d.skullResources.modelBytes===0&&d.skullResources.scratchBytes===0&&d.imageResources.encodedBytes===0&&d.imageResources.open===0&&d.pendingRAF===0&&d.listeners===0,d.skullResources);
 check('no page exceptions',errors.length===0,errors);
 return JSON.stringify({passed:checks.filter(c=>c.ok).length,failed:checks.filter(c=>!c.ok).length,checks,scope:'CC0 alternate geometry trial; physical projector/texture/original TD A not validated'});
}
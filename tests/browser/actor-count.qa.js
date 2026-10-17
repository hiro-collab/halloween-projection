async page=>{
 const rows=[],errors=[],counts=[],shots='__QA_OUT__';
 const test=(name,ok,data)=>rows.push({name,ok:!!ok,data});
 let stage;try{
 await page.setViewportSize({width:1366,height:768});
 await page.goto('__WEB_URI__/console.html');
 const popup=page.waitForEvent('popup');await page.locator('#open-stage').click();stage=await popup;
 for(const p of [page,stage])p.on('pageerror',e=>errors.push(e.message));
 await stage.setViewportSize({width:1280,height:720});await page.waitForFunction(()=>halloweenConsole.status().connected);
 await stage.locator('#stage-windowed').click();await stage.evaluate(()=>halloweenControls.set('a.actorLayout','rows'));await stage.waitForTimeout(1200);
 const snap=()=>stage.evaluate(()=>{const d=halloweenDiagnostics();return {version:d.version,phase:d.phase,selected:d.selected,settings:d.settings,scene:d.skull?.scene,actors:d.skull?.actors,draws:d.skullRasterResources.draws,created:d.skullResources.created,scratchBytes:d.skullResources.scratchBytes,text:d.skull?.textMask,stage:d.stage,source:d.skull?.scene.motionState,flow:d.skull?.flow};});
 test('v45 deployed from final ZIP',(await snap()).version==='0.1.45-count-scale-preview');
 const validation=await stage.evaluate(()=>[0,7,1.5,NaN,Infinity,'3',null,true].map(value=>halloweenControls.validate({type:'set',key:'a.actorCount',value})));
 test('common API rejects all invalid counts',validation.every(x=>!x.valid),validation);
 test('common API schema declares integer1..6',await stage.evaluate(()=>{const d=halloweenControls.schema().settings['a.actorCount'];return d.type==='integer'&&d.min===1&&d.max===6&&d.default===3;}));
 for(let n=1;n<=6;n++){
  await page.locator('#actor-count').selectOption(String(n));await stage.waitForFunction(n=>halloweenDiagnostics().skull.scene.count===n,n);await stage.waitForTimeout(650);
  const a=await snap(),wall=Date.now();let clips=0,overlaps=0,xMean=0;
  for(let j=0;j<5;j++){
   const s=await snap();
   for(const p of s.actors){const b=p.bounds;clips+=+(b.left<0||b.top<0||b.right>1280||b.bottom>720);overlaps+=+(b.bottom>720*.25&&b.top<720*.75);}
   await stage.waitForTimeout(450);
  }
  const b=await snap(),elapsed=(Date.now()-wall)/1000;
  const entry={n,elapsed,drawFPS:(b.draws-a.draws)/elapsed,triangles:b.scene.renderedTriangles,scratchBytes:b.scratchBytes,clips,centralBandOverlaps:overlaps,anchors:b.scene.layout.anchors,actors:b.actors};counts.push(entry);
  test(n+' actors use motionMat, with N geometry',b.scene.count===n&&b.scene.geometryNodes===n*2&&b.scene.renderedTriangles===n*4548&&b.source.steps>0,entry);
  test(n+' actors stay inside viewport across moving samples',clips===0,entry);
  test(n+' baseline rows symmetric left/right',Math.abs(b.scene.layout.anchors.reduce((v,p)=>v+p[0],0)/n-.5)<1e-8,entry.anchors);
  test(n+' baseline keeps central text band free',overlaps===0,entry);
  await stage.locator('#canvas').screenshot({path:shots+'/count-'+n+'.png'});
 }
 await stage.evaluate(()=>halloweenControls.dispatch({type:'command',name:'transport.pause'}));
 const paused=await snap();
 for(const n of [1,3,6]){await stage.evaluate(n=>halloweenControls.set('a.actorCount',n),n);const after=await snap();test('Pause count '+n+' preserves source histories and surviving pose',JSON.stringify(after.source)===JSON.stringify(paused.source)&&JSON.stringify(after.actors[0].rotation)===JSON.stringify(paused.actors[0].rotation)&&after.actors[0].jaw===paused.actors[0].jaw&&after.created===paused.created,{source:after.source,layout:after.scene.layout});}
 await stage.waitForTimeout(650);const held=await snap();test('Pause holds all motion and flow',JSON.stringify(held.source)===JSON.stringify(paused.source)&&held.flow.steps===paused.flow.steps);
 await stage.evaluate(()=>halloweenControls.dispatch({type:'command',name:'transport.resume'}));await stage.waitForTimeout(400);
 const pre=await snap();await stage.evaluate(()=>halloweenControls.set('a.actorCount',4));const immediate=await snap();await stage.waitForTimeout(600);const after=await snap();
 test('running count change preserves renderer and clock',after.created===pre.created&&after.source.steps>=pre.source.steps&&after.source.headSeconds>=pre.source.headSeconds,{pre:pre.source,immediate:immediate.source,after:after.source});
 test('presence interpolates then settles',immediate.scene.presence.transitioning&&!after.scene.presence.transitioning,{immediate:immediate.scene.presence,after:after.scene.presence});

 let transitionClips=0,transitionText=0;const transitionSamples=[];
 for(const n of [3,5,2,6,1,4]){await stage.evaluate(n=>halloweenControls.set('a.actorCount',n),n);for(let j=0;j<3;j++){const s=await snap();for(const p of s.actors){transitionClips+=+(p.bounds.left<0||p.bounds.top<0||p.bounds.right>1280||p.bounds.bottom>720);transitionText+=+(p.bounds.bottom>180&&p.bounds.top<540);}transitionSamples.push({n,anchors:s.scene.layout.anchors});await stage.waitForTimeout(35);}}
 test('rapid transitions keep meshes on-screen',transitionClips===0,{transitionClips,transitionSamples});test('stable row identities keep transitions out of text band',transitionText===0,{transitionText,transitionSamples});
 await stage.evaluate(()=>halloweenControls.dispatch({type:'command',name:'scene.reset'}));await stage.waitForTimeout(350);test('Reset retains selected count',(await snap()).scene.count===4);
 await stage.evaluate(()=>halloweenPerformance.dispatch({action:'scene',value:'b'}));await stage.waitForFunction(()=>halloweenDiagnostics().sprite?.state==='ready');await stage.waitForTimeout(700);
 test('B unchanged and count retained',await stage.evaluate(()=>halloweenControls.get('a.actorCount')===4&&halloweenDiagnostics().sprite.ready!==false));
 await stage.evaluate(()=>halloweenPerformance.dispatch({action:'scene',value:'a'}));await stage.waitForTimeout(600);test('A/B roundtrip retains selected count',(await snap()).scene.count===4);
 await page.bringToFront();await page.locator('#arm').click();await page.waitForFunction(()=>halloweenConsole.status().keyboard.armed);await page.keyboard.press('e');await stage.waitForFunction(()=>halloweenControls.get('a.actorCount')===5);
 await stage.waitForFunction(()=>{const d=halloweenDiagnostics(),p=d.skull.scene.presence;return p.requestedCount===d.settings.actorCount&&!p.transitioning&&d.skull.scene.count===d.settings.actorCount;});test('E adds one through shared API',(await snap()).scene.count===5);
 await page.keyboard.press('q');await stage.waitForFunction(()=>halloweenControls.get('a.actorCount')===4);await stage.waitForFunction(()=>{const d=halloweenDiagnostics(),p=d.skull.scene.presence;return p.requestedCount===d.settings.actorCount&&!p.transitioning&&d.skull.scene.count===d.settings.actorCount;});test('Q removes one through shared API',(await snap()).scene.count===4);
 await page.locator('#main-text').focus();await page.keyboard.type('qe');test('typing q/e does not change actor count',(await snap()).scene.count===4);test('text editing disarms keys',!(await page.evaluate(()=>halloweenConsole.status().keyboard.armed)));
 await page.locator('#arm').click();await page.waitForFunction(()=>halloweenConsole.status().keyboard.armed);await page.keyboard.press('2');await stage.waitForFunction(()=>halloweenDiagnostics().selected==='bats');await page.keyboard.press('1');await stage.waitForFunction(()=>halloweenDiagnostics().selected==='skull3d');const immediateKeyScene=await snap();await stage.waitForFunction(()=>halloweenDiagnostics().skull?.scene.count>0);const renderedKeyScene=await snap(),keyCountValue=await stage.evaluate(()=>halloweenControls.get('a.actorCount'));test('1/2 scene keys remain functional',renderedKeyScene.scene.count===4&&keyCountValue===4,{immediateCount:immediateKeyScene.scene.count,renderedCount:renderedKeyScene.scene.count,canonicalCount:keyCountValue,immediateMotion:immediateKeyScene.source});
 await page.keyboard.press('Escape');
 const ui=await page.evaluate(()=>{const e=document.getElementById('actor-count'),r=e.getBoundingClientRect();return {rect:{x:r.x,y:r.y,width:r.width,height:r.height},clipped:e.scrollWidth>e.clientWidth+3,documentWidth:document.documentElement.scrollWidth,viewport:innerWidth};});
 test('operator selector fits at1366x768',!ui.clipped&&ui.documentWidth<=ui.viewport,ui);await page.locator('#actor-count').scrollIntoViewIfNeeded();await page.screenshot({path:shots+'/operator.png'});
 test('no page errors',errors.length===0,errors);await stage.evaluate(()=>halloweenControls.dispatch({type:'command',name:'application.end'}));
 const passed=rows.filter(x=>x.ok).length;return {passed,failed:rows.length-passed,rows,counts,errors,scope:'real current application; DPR1; 720p moving samples per count; common API, UI, key input, Pause/Reset/B roundtrip'};

 }catch(e){return {passed:rows.filter(x=>x.ok).length,failed:1,error:String(e),rows,errors,console:await page.evaluate(()=>({status:window.halloweenConsole?.status(),body:document.body.innerText.slice(-1000)})),stage:stage?await stage.evaluate(()=>({diagnostics:window.halloweenDiagnostics?.(),body:document.body.innerText.slice(-1000)})):null};}
}

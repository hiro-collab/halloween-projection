/* Local Chrome QA only. No external service; pass a fresh unpacked directory. */
'use strict';
const fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(process.argv[2]),out=path.resolve(process.argv[3]),minutes=Number(process.argv[4]||30);
if(!fs.statSync(root).isDirectory()||minutes<.1||minutes>35)throw Error('Unpacked directory and .1–35 minutes required');
fs.mkdirSync(out,{recursive:true});const errors=[],requests=[],checks=[],samples=[];
const write=(n,v)=>fs.writeFileSync(path.join(out,n),JSON.stringify(v,null,2));
const check=(name,ok,data)=>{checks.push({name,ok:!!ok,data});write('checks.json',checks);if(!ok)throw Error(name);};
const delay=ms=>new Promise(r=>setTimeout(r,ms));let browser;
(async()=>{
 browser=await chromium.launch({channel:'chrome',headless:true});
 const context=await browser.newContext({viewport:{width:1920,height:1080},deviceScaleFactor:1});await context.setOffline(true);
 context.on('page',p=>{p.on('pageerror',e=>errors.push(e.message));p.on('crash',()=>errors.push('page crash'));});
 context.on('request',r=>{if(/^https?:/.test(r.url()))requests.push({url:r.url(),method:r.method()});});
 const page=await context.newPage();await page.goto(pathToFileURL(path.join(root,'START-HERE.html')).href);
 check('fresh unpacked guide has no comparison launcher',await page.locator('#entry-eight-preview').count()===0);
 await page.locator('#open-console').click();await page.waitForFunction(()=>window.halloweenConsole);
 const pop=page.waitForEvent('popup');await page.locator('#open-stage').click();const stage=await pop;await stage.setViewportSize({width:1920,height:1080});
 for(const p of [page,stage]){const c=await context.newCDPSession(p);await c.send('Emulation.setFocusEmulationEnabled',{enabled:false});}
 await page.waitForFunction(()=>halloweenConsole.status().connected);await stage.locator('#stage-fullscreen').click();await stage.waitForFunction(()=>!!document.fullscreenElement);check('own-click fullscreen starts',true);
 await stage.keyboard.press('Escape');await delay(150);const syntheticEscapeExited=await stage.evaluate(()=>!document.fullscreenElement);if(!syntheticEscapeExited)await stage.evaluate(()=>document.exitFullscreen());await stage.waitForFunction(()=>!document.fullscreenElement);check('fullscreen exit retains projection isolation',await stage.evaluate(()=>getComputedStyle(document.getElementById('controls')).display==='none'),{syntheticEscapeExited,fallback:syntheticEscapeExited?null:'Headless CDP Escape does not drive native browser UI; explicit Fullscreen API exit tested. Hardware Escape unverified.'});
 await stage.waitForFunction(()=>halloweenDiagnostics().skull?.scene?.count===3);
 const initial=await stage.evaluate(()=>{const d=halloweenDiagnostics();return {version:d.version,phase:d.phase,scene:d.skull.scene,presence:d.skull.scene.presence};});
 check('default6percent200ms/default3/sourceorbit',initial.presence.overshootTarget===.06&&initial.presence.duration===.2&&!initial.presence.comparisonCandidate&&initial.scene.displayLayout==='source'&&initial.scene.count===3);
 const state=()=>stage.evaluate(()=>halloweenControls.getState());
 const settle=async()=>{await page.waitForFunction(()=>halloweenConsole.status().pending===0);await stage.waitForFunction(()=>!halloweenPerformance.pending());};
 const choose=async scene=>{if(await stage.evaluate(()=>halloweenControls.getState().scene)!==scene)await page.locator('#scene-toggle').click();await stage.waitForFunction(s=>halloweenControls.getState().scene===s,scene);};
 const reset=async()=>{await page.locator('#reset').focus();await page.keyboard.down('Enter');await delay(650);await page.keyboard.up('Enter');await settle();};
 const arm=async()=>{await page.bringToFront();await page.locator('#arm').click();await page.waitForFunction(()=>halloweenConsole.status().keyboard.armed);};
 for(const scene of ['a','b']){
  await choose(scene);await stage.waitForFunction(x=>halloweenControls.getState().scene===x,scene);if(scene==='b')await stage.waitForFunction(()=>halloweenDiagnostics().sprite?.state==='ready');
  const text='HALLOWEEN\n<img src=x onerror=alert(1)> & "文字"';await page.locator('#main-text').fill(text);await settle();check(scene+' text uses literal data, no DOM HTML injection',(await state()).settings[scene+'.text']===text&&await stage.locator('img[src="x"]').count()===0);
  await page.locator('#main-text').fill('HAPPY\nHALLOWEEN');await page.locator('#text-size').evaluate(e=>{e.value='.5';e.dispatchEvent(new Event('input',{bubbles:true}));});await settle();
  await page.locator('#pause').click();await stage.waitForFunction(()=>halloweenDiagnostics().phase==='paused');const before=await stage.evaluate(()=>({time:halloweenDiagnostics().time,frames:halloweenDiagnostics().stats.frames}));
  await arm();await page.keyboard.press('j');await settle();check(scene+' paused size key acts and source stays paused',(await state()).settings['text.sizeNormalized']>.5&&await stage.evaluate(t=>halloweenDiagnostics().time===t,before.time));
  await reset();await settle();check(scene+' Reset button retains text and paused phase',(await state()).settings[scene+'.text']==='HAPPY\nHALLOWEEN'&&await stage.evaluate(()=>halloweenDiagnostics().phase==='paused'));
  await page.locator('#pause').click();await stage.waitForFunction(()=>halloweenDiagnostics().phase==='running');await stage.screenshot({path:path.join(out,'scene-'+scene+'.png')});
 }
 await choose('a');await stage.waitForFunction(()=>halloweenDiagnostics().skull?.scene);for(let n=1;n<=6;n++){await page.locator('#actor-count').selectOption(String(n));await stage.waitForFunction(n=>{const s=halloweenDiagnostics().skull?.scene;return s?.requestedCount===n&&!s.presence.transitioning&&s.count===n;},n);check('selector count'+n,true);}
 await arm();await page.keyboard.press('9');await settle();check('9 single decrement',(await state()).settings['a.actorCount']===5);await page.keyboard.press('0');await settle();check('0 single increment',(await state()).settings['a.actorCount']===6);
 await page.locator('#main-text').focus();check('text focus disarms',await page.evaluate(()=>!halloweenConsole.status().keyboard.armed));await page.keyboard.press('2');await delay(80);check('typing2 does not change scene',(await state()).scene==='a');await page.locator('#main-text').fill('HAPPY\nHALLOWEEN');
 await arm();await page.keyboard.down('8');await delay(250);await page.keyboard.up('8');await settle();check('single target transition operates',(await stage.evaluate(()=>halloweenPerformance.state())).profiles.a.motion>.52);
 await page.locator('#actor-count').focus();check('select focus disarms',await page.evaluate(()=>!halloweenConsole.status().keyboard.armed));
 await arm();await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await delay(150);check('blur handler disarms (synthetic event)',await page.evaluate(()=>!halloweenConsole.status().keyboard.armed));await page.bringToFront();check('page return never auto-arms after blur',await page.evaluate(()=>!halloweenConsole.status().keyboard.armed));
 await arm();await page.evaluate(()=>document.dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true})));check('composition disarms (synthetic event)',await page.evaluate(()=>!halloweenConsole.status().keyboard.armed));
 await page.locator('#actor-count').selectOption('3');await page.locator('#text-size').evaluate(e=>{e.value='.625';e.dispatchEvent(new Event('input',{bubbles:true}));});await settle();
 const cdp=await context.newCDPSession(stage);await cdp.send('Performance.enable');
 const diag=()=>stage.evaluate(()=>{const d=halloweenDiagnostics(),s=d.skull;return {wall:performance.now(),scene:halloweenControls.getState().scene,phase:d.phase,frames:d.stats.frames,skullDraws:d.skullRasterResources.draws,count:s?.scene?.count??null,sourceSeconds:s?.sourceSeconds??null,flowSteps:s?.flowSteps??null,heap:performance.memory?{used:performance.memory.usedJSHeapSize,total:performance.memory.totalJSHeapSize}:null,pendingRAF:d.pendingRAF,liveEffects:d.liveEffects,resourceBalance:d.stats.created-d.stats.disposed,raster:d.skullRasterResources,fluid:d.aFluidResources,composite:d.aCompositeResources,bat:d.compositeResources,fire:d.fireResources,motion:d.motionResources,assetError:d.assetError};});
 const sample=async(label)=>{const d=await diag();const h=await cdp.send('Runtime.getHeapUsage');d.sample=label;d.jsHeap=h;d.elapsedSeconds=(Date.now()-started)/1000;samples.push(d);write('samples.json',samples);console.log(JSON.stringify({sample:label,elapsed:d.elapsedSeconds,scene:d.scene,count:d.count,frames:d.frames,heap:h.usedSize,errors:errors.length}));return d;};
 await stage.bringToFront();const started=Date.now();await sample('start');write('running.json',{startedUTC:new Date(started).toISOString(),minutes,source:root,packageOffline:true});
 // Six five-minute blocks: A3,A6,B,A3,A6,B. Short test runs scale block duration.
 const blockMs=minutes*60000/6;let previous=await diag();
 for(let block=0;block<6;block++){
  const scene=block%3===2?'b':'a',count=block%3===1?6:3;
  await page.bringToFront();await choose(scene);if(scene==='a')await page.locator('#actor-count').selectOption(String(count));
  await stage.waitForFunction(s=>halloweenControls.getState().scene===s,scene);if(scene==='b')await stage.waitForFunction(()=>halloweenDiagnostics().sprite?.state==='ready');await stage.bringToFront();
  await stage.evaluate(block=>{halloweenPerformance.dispatch({action:'preset',axis:'motion',position:block%2?5:4});halloweenPerformance.dispatch({action:'preset',axis:'look',position:block%8+1});halloweenPerformance.dispatch({action:'flip'});},block);await settle();
  const blockStart=await diag();const deadline=started+(block+1)*blockMs;let minute=0;
  while(Date.now()<deadline){await delay(Math.min(10000,Math.max(1,deadline-Date.now())));const d=await sample('block'+block+'-'+minute++);if(d.assetError)errors.push('asset:'+d.assetError);if(d.phase!=='running')errors.push('Unexpected phase:'+d.phase);if(d.resourceBalance!==1||d.liveEffects!==1)errors.push('owner balance');}
  const end=await diag(),fps=(end.frames-blockStart.frames)/((end.wall-blockStart.wall)/1000),drawFPS=scene==='a'?(end.skullDraws-blockStart.skullDraws)/((end.wall-blockStart.wall)/1000):fps;
  const blocks=fs.existsSync(path.join(out,'blocks.json'))?JSON.parse(fs.readFileSync(path.join(out,'blocks.json'))):[];blocks.push({block,scene,count:scene==='a'?count:null,seconds:(end.wall-blockStart.wall)/1000,appFramesPerSecond:fps,drawFPS,start:blockStart,end});write('blocks.json',blocks);
  check('block'+block+' running, errors0, activeOwner1',end.phase==='running'&&end.resourceBalance===1&&errors.length===0,{fps,drawFPS});
  await page.bringToFront();await page.locator('#pause').click();await stage.waitForFunction(()=>halloweenDiagnostics().phase==='paused');await reset();await settle();await page.locator('#pause').click();await stage.bringToFront();
 }
 await page.bringToFront();await choose('a');await page.locator('#actor-count').selectOption('3');await settle();await stage.bringToFront();await delay(350);
 await stage.screenshot({path:path.join(out,'end3-running.png')});
 await cdp.send('HeapProfiler.collectGarbage');const afterGC=await cdp.send('Runtime.getHeapUsage');
 await page.bringToFront();await page.locator('details').first().evaluate(e=>e.open=true);await page.locator('#stop').click();await stage.waitForFunction(()=>halloweenDiagnostics().phase==='stopped');const stopped=await diag();check('Stop frees A GPU/scopes and RAF',stopped.liveEffects===0&&stopped.pendingRAF===0&&stopped.raster.liveScopes===0&&stopped.fluid.liveScopes===0&&stopped.composite.liveScopes===0);
 const endState=await page.evaluate(()=>halloweenConsole.request({api:{type:'command',name:'application.end'}}));check('End clears owner and listeners',await stage.evaluate(()=>{const d=halloweenDiagnostics();return d.destroyed&&d.listeners===0&&d.liveEffects===0&&d.pendingRAF===0;}));check('no HTTP/HTTPS requests from offline package',requests.length===0,requests);check('no page errors or crashes',errors.length===0,errors);
 write('result.json',{passed:checks.filter(x=>x.ok).length,failed:checks.filter(x=>!x.ok).length,checks,errors,requests,minutesRequested:minutes,soakElapsedSeconds:(Date.now()-started)/1000,blocks:JSON.parse(fs.readFileSync(path.join(out,'blocks.json'))),samples:samples.length,afterGC,conditions:'Local Chrome headless;1920x1080 viewport;DPR1;internal720p;actual file ZIP;offline;no forcedGC during timed blocks;no camera/microphone;not real projector or other machine'});
 await browser.close();write('cleanup.json',{browserExit:0});
})().catch(async e=>{write('failure.json',{message:e.message,stack:e.stack,checks,errors,requests});if(browser)await browser.close().catch(()=>{});write('cleanup.json',{browserClosed:true,exit:1});console.error(e.stack);process.exitCode=1;});

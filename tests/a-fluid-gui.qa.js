async page=>{
 const checks=[],check=(name,ok,detail={})=>checks.push({name,ok,detail}),errors=[];
 await page.goto('http://127.0.0.1:60580/web-preview/');page.on('pageerror',e=>errors.push(String(e)));await page.setViewportSize({width:1280,height:720});await page.locator('#skull3d').click();
 await page.evaluate(()=>{halloweenControl.set('skull3d','rigMode',1);halloweenControl.set('skull3d','headRate',0);halloweenControl.set('skull3d','jawRate',0);halloweenControl.reset('skull3d');});
 check('old mode has no fluid allocation',await page.evaluate(()=>halloweenDiagnostics().aFluidResources.liveScopes===0));
 await page.locator('#skull-fluidMode').check();await page.locator('#hide').click();await page.waitForFunction(()=>halloweenDiagnostics().skull?.flow?.steps>=2);
 check('fluid UI uses common API and source grids',await page.evaluate(()=>{const d=halloweenDiagnostics();return d.settings.fluidMode===1&&d.skull.flow.colorResolution.join(',')==='640,360'&&d.skull.flow.velocityResolution.join(',')==='100,57'&&d.skull.flow.pressurePasses===1;}));
 const start=await page.evaluate(()=>halloweenDiagnostics().skull.flow.steps),wall=Date.now();await page.waitForTimeout(2500);const status=await page.evaluate(()=>halloweenDiagnostics().skull.flow),hz=(status.steps-start)/((Date.now()-wall)/1000);
 check('finite diagnostic CPU workload and nonempty scalar image',hz>8&&status.maxStepMs<100&&await page.evaluate(()=>{const c=document.getElementById('canvas'),a=c.getContext('2d').getImageData(0,0,c.width,c.height).data;return a.some((v,i)=>i%4===0&&v>50);}),{hz,...status});
 await page.screenshot({path:'output/a-fluid-gui-20261013/scalar-colour.png'});
 await page.evaluate(()=>halloweenControl.pause());const held=await page.evaluate(()=>halloweenDiagnostics().skull.flow.steps);await page.waitForTimeout(150);
 check('pause freezes fluid steps',await page.evaluate(held=>halloweenDiagnostics().skull.flow.steps===held,held));
 await page.evaluate(()=>halloweenControl.reset('skull3d'));check('paused reset creates one zero-state scope',await page.evaluate(()=>{const d=halloweenDiagnostics();return d.phase==='paused'&&d.skull.flow.steps===0&&d.aFluidResources.liveScopes===1&&d.pendingRAF===0;}));
 await page.evaluate(()=>halloweenControl.set('skull3d','fluidMode',0));check('disable releases flow buffer and keeps mesh',await page.evaluate(()=>{const d=halloweenDiagnostics();return d.aFluidResources.liveScopes===0&&d.aFluidResources.bufferBytes===0&&d.skullResources.liveScopes===1;}));
 await page.evaluate(()=>{for(let i=0;i<20;i++){halloweenControl.set('skull3d','fluidMode',1);halloweenControl.reset('skull3d');halloweenControl.set('skull3d','fluidMode',0);}halloweenControl.stop();});
 check('20 resets close every own scope without growth',await page.evaluate(()=>{const d=halloweenDiagnostics();return d.aFluidResources.created===d.aFluidResources.disposed&&d.aFluidResources.liveScopes===0&&d.aFluidResources.bufferBytes===0&&d.aFluidResources.maxLive===1&&d.skullResources.modelBytes===0&&d.pendingRAF===0;}));
 await page.evaluate(()=>{halloweenControl.resume();halloweenControl.set('skull3d','fluidMode',1);});check('resume reconstructs source field scope',await page.evaluate(()=>halloweenDiagnostics().aFluidResources.liveScopes===1));
 await page.keyboard.press('Escape');await page.locator('#quit').click();check('End drops static encoded field and live buffers',await page.evaluate(()=>{const d=halloweenDiagnostics();return d.destroyed&&d.aFluidResources.encodedChars===0&&d.aFluidResources.liveScopes===0&&d.aFluidResources.bufferBytes===0&&d.listeners===0;}));
 check('no page errors',errors.length===0,errors);
 return JSON.stringify({passed:checks.filter(c=>c.ok).length,failed:checks.filter(c=>!c.ok).length,checks,scope:'source scalar color solver diagnostics only; final A color/optics/text and real-time clock unmatched'});
}

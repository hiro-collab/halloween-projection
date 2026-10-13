async page=>{
 page.setDefaultTimeout(5000);const checks=[],check=(name,ok,detail={})=>checks.push({name,ok,detail});
 await page.context().setOffline(false);await page.reload();await page.locator('#bats').click();
 await page.waitForFunction(()=>window.halloweenDiagnostics().sprite?.ready,{},{timeout:8000});
 await page.evaluate(()=>{halloweenControl.pause();halloweenControl.reset('bats');});
 await page.waitForFunction(()=>window.halloweenDiagnostics().sprite?.ready,{},{timeout:8000});
 const initial=await page.evaluate(()=>halloweenDiagnostics().sprite);
 const expected=Array.from({length:40},(_,i)=>Math.trunc(2*(128+Math.floor(i/2))+55.616111755371094)%60);
 check('zero-count native Random and locked Trail phase at Reset',initial.replayFps===60&&initial.phaseModel==='source-random-rolling-locked'&&JSON.stringify(initial.instanceFrames)===JSON.stringify(expected),initial);
 await page.waitForTimeout(250);
 check('Pause freezes all instance frames',await page.evaluate(before=>JSON.stringify(halloweenDiagnostics().sprite.instanceFrames)===JSON.stringify(before),initial.instanceFrames));
 await page.evaluate(()=>halloweenControl.set('bats','frameLock',17));
 const locked=await page.evaluate(()=>halloweenDiagnostics().sprite);
 check('comparison lock overrides every instance phase',locked.frameIndex===17&&locked.instanceFrames.every(f=>f===17));
 await page.evaluate(()=>{halloweenControl.set('bats','frameLock',null);halloweenControl.set('bats','flapRate',1);halloweenControl.resume();});
 await page.waitForTimeout(650);await page.evaluate(()=>halloweenControl.pause());
 const running=await page.evaluate(()=>halloweenDiagnostics().sprite);
 check('base replay advances at saved 60fps with bounded per-slot indices',running.frameIndex===Math.floor(running.flapTime*60)%60&&running.flapTime>.4&&running.instanceFrames.length===40&&running.instanceFrames.every(f=>Number.isInteger(f)&&f>=0&&f<60),running);
 await page.screenshot({path:'output/source-phase-operator.png'});
 await page.evaluate(()=>halloweenControl.reset('bats'));await page.waitForFunction(()=>halloweenDiagnostics().sprite?.ready,{},{timeout:8000});
 check('paused Reset preserves saved reference offsets at zero clock',await page.evaluate(offsets=>halloweenDiagnostics().phase==='paused'&&halloweenDiagnostics().sprite.flapTime===0&&JSON.stringify(halloweenDiagnostics().sprite.instanceFrames)===JSON.stringify(offsets),expected));
 await page.locator('#quit').click();const ended=await page.evaluate(()=>halloweenDiagnostics());
 check('End releases all graphics and compressed bytes',ended.pendingRAF===0&&ended.imageResources.open===0&&ended.imageResources.pending===0&&ended.imageResources.encodedBytes===0);
 return JSON.stringify({passed:checks.filter(c=>c.ok).length,failed:checks.filter(c=>!c.ok).length,checks,meaning:'source finite Random/rolling/locked phase candidate; absolute source clock and final visual reproduction not matched'});
}

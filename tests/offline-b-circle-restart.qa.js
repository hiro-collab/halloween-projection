async page=>{
 const checks=[],check=(name,ok,detail={})=>checks.push({name,ok,detail});
 await page.context().setOffline(true);
 const response=await page.goto('http://127.0.0.1:8766/web-preview/');
 await page.waitForFunction(()=>halloweenDiagnostics?.().phase==='running');
 check('normal browser restart loads the packaged version offline',response.fromServiceWorker()&&await page.evaluate(()=>halloweenDiagnostics().version==='0.1.8-b-signals-fire-preview'));
 check('source control input remains memory only',await page.evaluate(()=>{const v=halloweenVJ.values();return v.initialSpeed===1.3&&v.motionMix===.5&&localStorage.length===0&&sessionStorage.length===0;}));
 await page.locator('#bats').click();await page.waitForFunction(()=>halloweenDiagnostics().sprite?.ready);
 check('offline restart decodes all 60 bat frames',await page.evaluate(()=>{const d=halloweenDiagnostics();return d.sprite.frames===60&&d.imageResources.open===1&&d.imageResources.encodedBytes===61130;}));
 await page.locator('#stage').click({position:{x:100,y:100}});await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowUp');
 check('real source keyboard remains connected offline',await page.evaluate(()=>halloweenDiagnostics().sprite.parameters.Cross===.55&&halloweenVJ.values().initialSpeed===1.4));
 await page.locator('#skull3d').click();await page.waitForTimeout(100);
 check('offline restart renders the CC0 skull candidate',await page.evaluate(()=>{const d=halloweenDiagnostics();return d.selected==='skull3d'&&d.skullResources.liveScopes===1&&d.skullResources.modelBytes===61068&&d.imageResources.open===0;}));
 await page.locator('#stop').click();
 check('offline Stop frees drawing resources',await page.evaluate(()=>{const d=halloweenDiagnostics();return d.liveEffects===0&&d.pendingRAF===0&&d.skullResources.liveScopes===0&&d.skullResources.modelBytes===0;}));
 await page.locator('#quit').click();
 check('offline End releases model image and listeners',await page.evaluate(()=>{const d=halloweenDiagnostics();return d.destroyed&&d.listeners===0&&d.imageResources.encodedBytes===0&&d.skullResources.encodedChars===0;}));
 await page.context().setOffline(false);
 return JSON.stringify({passed:checks.filter(c=>c.ok).length,failed:checks.filter(c=>!c.ok).length,checks,physicalDisconnect:false,scope:'B circle candidate: CLI closed and reopened this task-owned persistent browser before running'});
}

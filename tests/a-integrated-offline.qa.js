async page=>{
 const checks=[],check=(name,ok,detail={})=>checks.push({name,ok,detail});
 if(!/^http:\/\/127\.0\.0\.1:\d+\/web-preview\/$/.test(page.url()))throw Error('Owned loopback only');
 check('saved cache prerequisite',await page.evaluate(()=>halloweenOfflineDiagnostics().saved));
 await page.context().setOffline(true);const response=await page.reload();await page.waitForFunction(()=>halloweenDiagnostics?.().phase==='running');
 check('offline reload uses current saved build',response.fromServiceWorker()&&await page.evaluate(()=>halloweenDiagnostics().version==='0.1.16-a-integrated-preview'));
 await page.locator('#skull3d').click();await page.locator('#skull-aCompositeMode').check();await page.waitForFunction(()=>halloweenDiagnostics().skull?.flow?.steps>=2&&halloweenDiagnostics().skull?.composite?.ready,{},{timeout:10000});
 check('integrated A starts without network',await page.evaluate(()=>{const d=halloweenDiagnostics();return d.aCompositeResources.liveScopes===1&&d.skull.composite.error===''&&d.aFluidResources.liveScopes===1;}));
 await page.evaluate(()=>halloweenControl.pause());const state=await page.evaluate(()=>halloweenDiagnostics());
 check('offline source limits stay explicit',state.skull.composite.decorationNoise.startsWith('unconnected')&&!state.skull.composite.noiseGenerator&&state.skull.flow.field.includes('tz0'));
 await page.locator('#quit').click();check('offline End releases A resources',await page.evaluate(()=>{const d=halloweenDiagnostics();return d.destroyed&&d.listeners===0&&d.pendingRAF===0&&d.aCompositeResources.gpuBytes===0&&d.aCompositeResources.programs===0&&d.aCompositeResources.textures===0&&d.aFluidResources.bufferBytes===0;}));
 await page.context().setOffline(false);
 return JSON.stringify({passed:checks.filter(c=>c.ok).length,failed:checks.filter(c=>!c.ok).length,checks,physicalDisconnect:'not tested'});
}

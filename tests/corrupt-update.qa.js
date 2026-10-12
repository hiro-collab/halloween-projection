async page => {
 const checks=[],check=(name,ok,details={})=>checks.push({name,ok,details});
 const before=await page.evaluate(async()=>({keys:(await caches.keys()).filter(k=>k.startsWith('halloween-projection:'+new URL('./',location.href).href+':')),time:window.halloweenDiagnostics().time}));
 await page.locator('#offline-check').click();
 await page.waitForFunction(()=>document.getElementById('offline-status').textContent.includes('更新を保存できませんでした'),{},{timeout:30000});
 const after=await page.evaluate(async()=>({keys:(await caches.keys()).filter(k=>k.startsWith('halloween-projection:'+new URL('./',location.href).href+':')),d:window.halloweenDiagnostics(),offline:window.halloweenOfflineDiagnostics()}));
 check('corrupt asset prevents new worker activation',!after.offline.waiting&&after.keys.join('|')===before.keys.join('|'),after);
 check('failed install leaves previous display running',after.d.phase==='running'&&after.d.time>before.time&&after.d.liveEffects===1);
 await page.context().setOffline(true);const response=await page.reload();
 await page.waitForFunction(()=>window.halloweenDiagnostics?.().phase==='running');
 check('previous verified cache survives failed update',response.fromServiceWorker());
 await page.context().setOffline(false);
 return JSON.stringify({passed:checks.filter(c=>c.ok).length,failed:checks.filter(c=>!c.ok).length,checks,expectedWorkerInstallError:'Static asset integrity mismatch'});
}

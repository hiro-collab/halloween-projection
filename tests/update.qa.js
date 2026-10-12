async page => {
 const checks=[],check=(name,ok,details={})=>checks.push({name,ok,details});
 await page.context().setOffline(false);
 const old=await page.evaluate(async()=>({cache:(await caches.keys()).find(k=>k.startsWith('halloween-projection:'+new URL('./',location.href).href+':')),d:window.halloweenDiagnostics()}));
 await page.locator('#text').fill('更新前の入力は保存しません');
 await page.locator('#offline-check').click();
 await page.waitForFunction(()=>window.halloweenOfflineDiagnostics().waiting,{},{timeout:30000});
 await page.waitForTimeout(150);
 const waiting=await page.evaluate(()=>({offline:window.halloweenOfflineDiagnostics(),d:window.halloweenDiagnostics(),text:document.getElementById('text').value}));
 check('update waits while current animation continues',waiting.offline.waiting&&waiting.d.phase==='running'&&waiting.d.time>old.d.time&&waiting.text==='更新前の入力は保存しません',waiting);
 await page.evaluate(()=>{window.confirm=()=>true;});
 await page.locator('#offline-apply').click();
 await page.waitForFunction(()=>window.halloweenDiagnostics?.().phase==='running'&&window.halloweenOfflineDiagnostics?.().saved&&!window.halloweenOfflineDiagnostics?.().waiting,{},{timeout:30000});
 const updated=await page.evaluate(async()=>({keys:(await caches.keys()).filter(k=>k.startsWith('halloween-projection:'+new URL('./',location.href).href+':')),text:document.getElementById('text').value,d:window.halloweenDiagnostics()}));
 check('confirmed update reloads and resets input',updated.text==='HAPPY\nHALLOWEEN'&&updated.d.liveEffects===1&&updated.d.pendingRAF===1);
 check('activation retires old app cache',updated.keys.length===1&&updated.keys[0]!==old.cache,updated.keys);
 await page.context().setOffline(true);const response=await page.reload();
 await page.waitForFunction(()=>window.halloweenDiagnostics?.().phase==='running');
 check('updated version reloads offline',response.fromServiceWorker());
 await page.context().setOffline(false);
 return JSON.stringify({passed:checks.filter(c=>c.ok).length,failed:checks.filter(c=>!c.ok).length,checks});
}

async (page) => {
 const checks=[];
 const check=(name,ok)=>checks.push({name,ok});
 await page.context().setOffline(false);
 await page.evaluate(async()=>{if(document.fullscreenElement)await document.exitFullscreen();});
 const initial=await page.evaluate(()=>window.halloweenDiagnostics());
 check('local launcher context and heartbeat',initial.localHost&&initial.heartbeat===1);
 const token=await page.evaluate(()=>window.halloweenLocalRuntime.token);
 const origin=page.url().replace(/\/$/,'');
 const badToken=await page.request.post(origin+'/quit/invalid',{headers:{Origin:origin}});
 check('wrong exit token cannot stop server',badToken.status()===404);
 const badOrigin=await page.request.post(origin+'/quit/'+token,{headers:{Origin:'https://example.invalid'}});
 check('cross origin cannot stop server',badOrigin.status()===403);
 await page.evaluate(()=>{window.savedFullscreen=document.documentElement.requestFullscreen;document.documentElement.requestFullscreen=async()=>{};});
 await page.locator('#project').click();
 let d=await page.evaluate(()=>window.halloweenDiagnostics());
 check('silent fullscreen failure restores panel',!d.fullscreen&&!d.projection&&!!d.fullscreenError&&await page.locator('#controls').isVisible());
 await page.evaluate(()=>{document.documentElement.requestFullscreen=async()=>{throw Error('test-only denial');};});
 await page.locator('#project').click();d=await page.evaluate(()=>window.halloweenDiagnostics());
 check('rejected fullscreen request restores panel',!d.projection&&!!d.fullscreenError&&await page.locator('#controls').isVisible());
 await page.evaluate(()=>{document.documentElement.requestFullscreen=window.savedFullscreen;});
 await page.locator('#quit').click();
 await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('終了しました'));
 d=await page.evaluate(()=>window.halloweenDiagnostics());
 check('screen exit disposes renderer and heartbeat',d.destroyed&&d.liveEffects===0&&d.pendingRAF===0&&d.listeners===0&&d.heartbeat===0);
 check('screen exit leaves close-tab instruction',(await page.locator('#status').innerText()).includes('タブを閉じ'));
 let stopped=false;
 try{await page.request.get(origin+'/');}catch(e){stopped=true;}
 check('screen exit stops owned local server',stopped);
 return JSON.stringify({checks,passed:checks.filter(c=>c.ok).length,failed:checks.filter(c=>!c.ok).length,actualBrowserFrameRemoval:'not tested'});
}

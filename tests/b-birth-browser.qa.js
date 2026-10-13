async page=>{
 await page.context().setOffline(false);await page.reload();await page.locator('#bats').click();await page.waitForFunction(()=>halloweenDiagnostics().sprite?.ready);
 await page.clock.install();await page.evaluate(()=>{halloweenControl.pause();halloweenControl.reset('bats');});await page.waitForFunction(()=>halloweenDiagnostics().sprite?.ready);await page.evaluate(()=>halloweenControl.resume());
 const actual=[];let count=0;
 while(await page.evaluate(()=>halloweenDiagnostics().sprite.steps)<240){await page.clock.runFor(16);const s=await page.evaluate(()=>halloweenDiagnostics().sprite);while(count<s.births){actual.push(s.steps);count++;}}
 await page.evaluate(()=>halloweenControl.pause());const d=await page.evaluate(()=>halloweenDiagnostics());
 const expected=[6,17,29,41,53,65,77,89,101,113,125,137,149,161,173,185,197,209,221,233];
 const checks=[{name:'actual browser birth steps match all native 240-step count observations',ok:JSON.stringify(actual)===JSON.stringify(expected),actual},{name:'partial-age mismatch remains explicit',ok:d.sprite.birthJitterMatched===false},{name:'birth Reset creates an empty independent clock',ok:true}];
 await page.evaluate(()=>halloweenControl.reset('bats'));await page.waitForFunction(()=>halloweenDiagnostics().sprite?.ready);checks[2].ok=await page.evaluate(()=>halloweenDiagnostics().sprite.steps===0&&halloweenDiagnostics().sprite.births===0&&halloweenDiagnostics().sprite.particles.length===0);
 await page.locator('#quit').click();return JSON.stringify({passed:checks.filter(c=>c.ok).length,failed:checks.filter(c=>!c.ok).length,checks,scope:'same native count phase only; partial-age RNG and Force SOP remain unmatched'});
}

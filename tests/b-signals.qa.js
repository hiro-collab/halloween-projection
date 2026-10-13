async page=>{
 const checks=[],check=(name,ok,detail={})=>checks.push({name,ok,detail});
 await page.context().setOffline(false);await page.reload();
 const golden={"samples": [{"xyz": [0.10191082954406738, -0.09495287388563156, 0.03538747504353523], "degrees": 117.77145385742188}, {"xyz": [-0.3354456126689911, 0.11376193165779114, -0.13614808022975922], "degrees": -3.9716954231262207}, {"xyz": [0.20611757040023804, 0.18903325498104095, 0.10190758854150772], "degrees": 28.23340606689453}, {"xyz": [0.2542567253112793, -0.13825389742851257, -0.094301737844944], "degrees": 147.5363006591797}, {"xyz": [-0.10646965354681015, -0.11302714794874191, 0.03790837526321411], "degrees": 22.11575698852539}], "phase": [34.0, 24.0, 3.0, 17.0, 27.0, 34.0, 2.0, 30.0, 14.0, 2.0, 29.0, 19.0, 50.0, 10.0, 8.0, 30.0, 39.0, 4.0, 46.0, 6.0, 20.0, 25.0, 20.0, 50.0, 24.0, 4.0, 6.0, 6.0, 8.0, 8.0, 10.0, 10.0, 12.0, 12.0, 14.0, 14.0, 16.0, 16.0, 18.0, 18.0]};
 const numeric=await page.evaluate(g=>{const f=HalloweenBatMotion.createSparseField();const errors=g.samples.map(s=>Math.abs(f.sample(...s.xyz)-s.degrees));f.dispose();return {errors,lag:HalloweenBatSignals.lagAngles([0,1,0,0]),indices:HalloweenBatSignals.instanceIndices(25,29)};},golden);
 check('held-out native spatial rotation samples stay within 1.2 degrees',numeric.errors.every(v=>v<1.2),numeric.errors);
 check('native Lag impulse uses sample order including negative overshoot',Math.abs(numeric.lag[1]-.5358411073684692)<.00001&&Math.abs(numeric.lag[2]-.49743080139160156)<.00001&&Math.abs(numeric.lag[3]-.2130584418773651)<.00001,numeric.lag);
 check('native same-frame Random plus rolling and locked Trail matches all 40 indices',JSON.stringify(numeric.indices)===JSON.stringify(golden.phase),numeric.indices);
 await page.locator('#bats').click();await page.waitForFunction(()=>halloweenDiagnostics().sprite?.ready);
 const live=await page.evaluate(()=>halloweenDiagnostics().motionResources);
 check('one live field has the measured fixed memory budget',live.liveFields===1&&live.bytes===71874,live);
 await page.locator('#stop').click();const stopped=await page.evaluate(()=>halloweenDiagnostics().motionResources);
 check('Stop releases every decoded spatial field',stopped.liveFields===0&&stopped.bytes===0&&stopped.created===stopped.disposed,stopped);
 await page.locator('#quit').click();check('End also releases the encoded field',await page.evaluate(()=>halloweenDiagnostics().motionResources.encodedChars===0));
 return JSON.stringify({passed:checks.filter(c=>c.ok).length,failed:checks.filter(c=>!c.ok).length,checks,scope:'native numeric signal fixtures; source particle solver and global clock remain unverified'});
}
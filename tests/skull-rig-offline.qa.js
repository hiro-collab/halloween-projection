async page => {
 const checks=[],check=(name,ok,detail={})=>checks.push({name,ok,detail});
 await page.context().setOffline(true);
 try{
  const response=await page.reload();await page.waitForFunction(()=>window.halloweenDiagnostics?.().phase==='running');
  check('final 0.1.12 cached build starts offline',response.fromServiceWorker()&&await page.evaluate(()=>halloweenDiagnostics().version==='0.1.12-a-rig-registration-preview'));
  await page.evaluate(()=>{halloweenControl.select('skull3d');for(const [k,v] of [['rigMode',1],['headRate',0],['jawRate',0],['headX',20],['headY',45],['headZ',15],['jawOpen',45]])halloweenControl.set('skull3d',k,v);halloweenControl.pause();halloweenControl.reset('skull3d');});
  check('offline new mode keeps independent compound pose',await page.evaluate(()=>{const d=halloweenDiagnostics();return d.skull.rigMode===1&&d.skull.jawAngle===45&&d.skull.rig.angles.join(',')==='20,45,15'&&d.skullResources.liveScopes===1&&d.pendingRAF===0;}));
  await page.evaluate(()=>halloweenControl.stop());
  check('offline new mode Stop frees geometry',await page.evaluate(()=>{const d=halloweenDiagnostics();return d.skullResources.liveScopes===0&&d.skullResources.modelBytes===0&&d.skullResources.scratchBytes===0;}));
 }finally{await page.context().setOffline(false);await page.reload();}
 return JSON.stringify({passed:checks.filter(c=>c.ok).length,failed:checks.filter(c=>!c.ok).length,checks,scope:'same-tab offline reload of final 0.1.12; normal browser restart and physical disconnection not tested'});
}

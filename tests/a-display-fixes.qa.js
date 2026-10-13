async page=>{
 const checks=[],errors=[],check=(name,ok,detail={})=>checks.push({name,ok,detail});
 if(!/^http:\/\/127\.0\.0\.1:\d+\/web-preview\/$/.test(page.url()))throw Error('Owned loopback only');
 await page.context().setOffline(false);await page.reload();page.on('pageerror',e=>errors.push(String(e)));
 await page.locator('#skull3d').click();await page.locator('#skull-aCompositeMode').check();
 await page.evaluate(()=>{halloweenControl.pause();halloweenControl.set('skull3d','headRate',0);halloweenControl.set('skull3d','jawRate',0);});
 await page.locator('#hide').click();
 const rates=[];
 for(const [width,height] of [[1280,720],[1920,1080]]){
  await page.setViewportSize({width,height});await page.evaluate(()=>halloweenControl.reset('skull3d'));
  const start=await page.evaluate(()=>{halloweenControl.resume();return {wall:performance.now(),sim:halloweenDiagnostics().skull.flow.simulationSeconds,steps:halloweenDiagnostics().skull.flow.steps};});
  await page.waitForTimeout(3000);
  const end=await page.evaluate(()=>{halloweenControl.pause();const d=halloweenDiagnostics();return {wall:performance.now(),sim:d.skull.flow.simulationSeconds,clock:d.skull.flowTime,steps:d.skull.flow.steps,averageMs:d.skull.performance.averageMs};});
  const wall=(end.wall-start.wall)/1000,sim=end.sim-start.sim,ratio=sim/wall,rate={width,height,wallSeconds:wall,simulationSeconds:sim,ratio,stepsPerSecond:(end.steps-start.steps)/wall,averageMs:end.averageMs};rates.push(rate);
  check(`fluid Delta follows wall time at ${width}x${height}`,ratio>.93&&ratio<1.07&&Math.abs(end.clock-end.sim)<1e-6,rate);
  const held=await page.evaluate(()=>halloweenDiagnostics().skull.flow.simulationSeconds);await page.waitForTimeout(160);
  check(`Pause freezes solver time at ${width}x${height}`,held===await page.evaluate(()=>halloweenDiagnostics().skull.flow.simulationSeconds));
 }
 await page.setViewportSize({width:1280,height:720});
 const text=Array.from({length:8},(_,i)=>`ROW ${i+1} HALLOWEEN LONG TEXT WWW`).join('\n');
 await page.evaluate(t=>halloweenControl.setText('skull3d',t),text);
 const actual=await page.evaluate(()=>halloweenDiagnostics().skull.textMask);
 const glyphs=await page.evaluate(text=>{const c=document.createElement('canvas');c.width=1280;c.height=720;const ctx=c.getContext('2d'),layout=HalloweenAComposite.fitText(ctx,text,c.width,c.height);ctx.font=layout.fontSize+'px Arial';ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillStyle='#fff';text.split('\n').forEach((line,i)=>ctx.fillText(line,c.width/2,layout.firstBaseline+i*layout.lineHeight));const p=ctx.getImageData(0,0,c.width,c.height).data;let left=c.width,right=0,top=c.height,bottom=0,bands=0,inBand=false;for(let y=0;y<c.height;y++){let row=false;for(let x=0;x<c.width;x++)if(p[(y*c.width+x)*4+3]>20){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);row=true;}if(row&&!inBand)bands++;inBand=row;}return {layout,pixelBounds:{left,right,top,bottom},bands};},text);
 check('240-character eight-line input fits visible glyphs',text.length===239&&actual.lines===8&&actual.fontSize<200&&glyphs.bands===8&&glyphs.pixelBounds.left>=1280*.09-1&&glyphs.pixelBounds.right<=1280*.91+1&&glyphs.pixelBounds.top>=720*.26-1&&glyphs.pixelBounds.bottom<=720*.74+1,{chars:text.length,actual,...glyphs});
 await page.screenshot({path:'output/a-v17-fix-20261013/eight-lines.png'});
 const literal='<img src=x onerror="window.__aFixXSS=1">\nLONG HALLOWEEN';await page.evaluate(t=>halloweenControl.setText('skull3d',t),literal);
 check('long text remains literal with no DOM injection',await page.evaluate(t=>halloweenControl.values('skull3d').text===t&&halloweenDiagnostics().skull.textMask.chars===t.length&&!window.__aFixXSS&&!document.querySelector('#message-text img'),literal));
 const toggle=await page.evaluate(()=>{halloweenControl.set('skull3d','fluidMode',0);halloweenControl.set('skull3d','aCompositeMode',1);return halloweenDiagnostics().skull.flow;});
 check('new fluid scope excludes previous scope elapsed time',toggle.steps===0&&toggle.simulationSeconds===0&&toggle.lastDeltaSeconds===0,toggle);
 await page.evaluate(()=>halloweenControl.reset('skull3d'));
 check('Reset clears accumulated solver time',await page.evaluate(()=>halloweenDiagnostics().skull.flow.simulationSeconds===0&&halloweenDiagnostics().skull.flowTime===0));
 await page.evaluate(()=>halloweenControl.stop());check('Stop releases all corrected A scopes',await page.evaluate(()=>{const d=halloweenDiagnostics();return d.aFluidResources.liveScopes===0&&d.aCompositeResources.liveScopes===0;}));
 const delta=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=640;c.height=360;const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(200,100,40,160);const external=new Float32Array(100*57*2);for(let i=0;i<external.length;i+=2)external[i]=5;const a=HalloweenAFluid.create(),b=HalloweenAFluid.create();for(const f of [a,b]){f.setInput(c);f.setExternal(external);f.step();f.step();}a.step(.95,0);b.step(.95,.1);const x=a.read('color'),y=b.read('color');let changed=0;for(let i=0;i<x.length;i++)if(Math.abs(x[i]-y[i])>.01)changed++;let rejectsInvalid=false;try{b.step(.95,NaN);}catch{rejectsInvalid=true;}const result={changed,seconds:[a.status().simulationSeconds,b.status().simulationSeconds],rejectsInvalid};a.dispose();b.dispose();return result;});
 check('elapsed Delta changes actual advection and rejects invalid input',delta.changed>100&&Math.abs(delta.seconds[1]-delta.seconds[0]-.1)<1e-9&&delta.rejectsInvalid,delta);
 check('no page errors',errors.length===0,errors);
 return JSON.stringify({passed:checks.filter(c=>c.ok).length,failed:checks.filter(c=>!c.ok).length,checks,rates,scope:'elapsed Delta and eight-line fit; per-cook injection/diffusion and dynamic noise still depend on render cadence'});
}

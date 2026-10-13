async page => {
 const checks=[],errors=[];const check=(name,ok,detail={})=>checks.push({name,ok,detail});
 await page.context().setOffline(false);await page.reload();page.on('pageerror',e=>errors.push(String(e)));
 await page.setViewportSize({width:1280,height:720});await page.locator('#skull3d').click();
 check('previous comparison remains the default',await page.evaluate(()=>halloweenControl.values('skull3d').rigMode===0));
 await page.locator('#skull-rigMode').check();
 check('rig mode UI uses common API and exposes XYZ controls',await page.evaluate(()=>halloweenControl.values('skull3d').rigMode===1)&&await page.locator('#skull-headX').isVisible());
 await page.locator('#skull-headRate').fill('0');await page.locator('#skull-jawRate').fill('0');await page.locator('#hide').click();await page.evaluate(()=>{halloweenControl.pause();halloweenControl.reset('skull3d');});
 const invalid=await page.evaluate(()=>{const before=JSON.stringify(halloweenControl.values('skull3d'));let n=0;for(const [k,v] of [['rigMode',.5],['headX',NaN],['headY',181],['headZ',Infinity]])try{halloweenControl.set('skull3d',k,v);}catch(_){n++;}return {n,unchanged:before===JSON.stringify(halloweenControl.values('skull3d'))};});
 check('invalid pose controls rejected atomically',invalid.n===4&&invalid.unchanged,invalid);
 const fixtures=[{"name":"closed-front","angles":[0,0,0],"jaw":0,"headWorld":[1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0],"jawWorld":[1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0],"nativeBounds":[555,254,725,507],"originalBounds":[557,254,723,507]},{"name":"jaw30-front","angles":[0,0,0],"jaw":30,"headWorld":[1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0],"jawWorld":[1.0,0.0,0.0,0.0,0.0,0.8660253882408142,-0.5,-0.09777132695091773,0.0,0.5,0.8660253882408142,0.20299641594440443,0.0,0.0,0.0,1.0],"nativeBounds":[555,254,725,538],"originalBounds":[557,254,723,529]},{"name":"closed-yaw90","angles":[0,90,0],"jaw":0,"headWorld":[-4.371138828673793e-08,0.0,1.0,0.0,0.0,1.0,0.0,0.0,-1.0,0.0,-4.371138828673793e-08,0.0,0.0,0.0,0.0,1.0],"jawWorld":[-4.371138828673793e-08,0.0,1.0,0.0,0.0,1.0,0.0,0.0,-1.0,0.0,-4.371138828673793e-08,0.0,0.0,0.0,0.0,1.0],"nativeBounds":[509,254,734,506],"originalBounds":[503,254,740,506]},{"name":"compound-jaw45","angles":[20,45,15],"jaw":45,"headWorld":[0.6830126806090604,-0.009606262454950137,0.7303432943677808,-0.004803131227475069,0.18301269772333129,0.9702673798698639,-0.15839038566248118,-0.014866310065068056,-0.7071067690849304,0.2418447449829717,0.6644630099599098,0.12092237249148585,0.0,0.0,0.0,1.0],"jawWorld":[0.6830126806090604,0.509638033995744,0.5232233404107474,0.200502935841549,0.18301269772333129,0.5740837182683672,-0.7980815459881935,-0.23608714139711146,-0.7071067690849304,0.6408563483942779,0.29883623590412167,0.2619766419881744,0.0,0.0,0.0,1.0],"nativeBounds":[523,250,727,539],"originalBounds":[515,252,729,516]}];
 for(const pose of fixtures){
  const result=await page.evaluate(pose=>{
   for(const [key,v] of [['headX',pose.angles[0]],['headY',pose.angles[1]],['headZ',pose.angles[2]],['jawOpen',pose.jaw]])halloweenControl.set('skull3d',key,v);
   const d=halloweenDiagnostics(),c=document.getElementById('canvas'),pixels=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let left=c.width,top=c.height,right=0,bottom=0,lit=0;
   for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){const i=(y*c.width+x)*4;if(Math.max(pixels[i],pixels[i+1],pixels[i+2])>2){left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x+1);bottom=Math.max(bottom,y+1);lit++;}}
   const error=(a,b)=>Math.max(...a.map((v,i)=>Math.abs(v-b[i])));
   return {matrixMax:Math.max(error(d.skull.rig.headWorld,pose.headWorld),error(d.skull.rig.jawWorld,pose.jawWorld)),pixelBounds:[left,top,right,bottom],nativeBounds:pose.nativeBounds,boundsMax:error([left,top,right,bottom],pose.nativeBounds),lit,pose:d.skull.rig,stage:d.stage};
  },pose);
  check(pose.name+' API pose matches native matrices',result.matrixMax<2e-7,result);
  check(pose.name+' perspective silhouette bounds match same CC0 native',result.lit>1000&&result.boundsMax<=2,result);
  await page.screenshot({path:'output/a-rig-final-20261013/'+pose.name+'.png'});
 }
 await page.evaluate(()=>{for(const [k,v] of [['headX',0],['headY',0],['headZ',0],['jawOpen',0]])halloweenControl.set('skull3d',k,v);});
 const closedHash=()=>page.evaluate(async()=>{const c=document.getElementById('canvas'),pixels=c.getContext('2d').getImageData(0,0,c.width,c.height).data;return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',pixels))).join(',');});
 const closedPixels=await closedHash(),closedRig=await page.evaluate(()=>halloweenDiagnostics().skull.rig);
 await page.evaluate(()=>{halloweenControl.set('skull3d','pivotY',-1.05);halloweenControl.set('skull3d','pivotZ',.08);});
 const changedPivot=await page.evaluate(()=>halloweenDiagnostics().skull.rig);
 check('closed placement stays pixel-identical when candidate jaw pivot changes',closedPixels===await closedHash()&&JSON.stringify(closedRig.registration.translation)===JSON.stringify(changedPivot.registration.translation)&&JSON.stringify(closedRig.headWorld)===JSON.stringify(changedPivot.headWorld)&&Math.abs(changedPivot.jawPivot[1]-closedRig.jawPivot[1])>.2);
 await page.evaluate(()=>{halloweenControl.set('skull3d','pivotY',-.75);halloweenControl.set('skull3d','pivotZ',-.12);});
 const crop=()=>page.evaluate(async()=>{const c=document.getElementById('canvas'),bytes=c.getContext('2d').getImageData(600,260,80,90).data;return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).join(',');});
 const headBefore=await crop(),before=await page.evaluate(()=>halloweenDiagnostics().skull.rig.headWorld);
 await page.evaluate(()=>halloweenControl.set('skull3d','jawOpen',30));
 const after=await page.evaluate(()=>halloweenDiagnostics().skull);
 check('manual jaw alone preserves head transform and upper-head pixels',JSON.stringify(before)===JSON.stringify(after.rig.headWorld)&&headBefore===await crop()&&after.jawAngle===30);
 await page.evaluate(()=>{halloweenControl.set('skull3d','jawRate',1);halloweenControl.set('skull3d','jawOpen',28);halloweenControl.reset('skull3d');halloweenControl.resume();});
 const jawStart=await page.evaluate(()=>halloweenDiagnostics().skull);await page.waitForTimeout(700);const jawEnd=await page.evaluate(()=>halloweenDiagnostics().skull);
 check('running jaw is independent while head clock and matrix stay fixed',jawEnd.jawTime>jawStart.jawTime+.4&&jawEnd.headTime===jawStart.headTime&&JSON.stringify(jawStart.rig.headWorld)===JSON.stringify(jawEnd.rig.headWorld)&&jawEnd.jawAngle!==jawStart.jawAngle);
 await page.evaluate(()=>{halloweenControl.set('skull3d','headRate',1);halloweenControl.set('skull3d','jawRate',0);halloweenControl.set('skull3d','jawOpen',0);halloweenControl.reset('skull3d');});
 const headStart=await page.evaluate(()=>halloweenDiagnostics().skull);await page.waitForTimeout(700);const headEnd=await page.evaluate(()=>halloweenDiagnostics().skull);
 check('closed jaw follows parent while head alone spins',headEnd.headTime>headStart.headTime+.4&&headEnd.jawTime===headStart.jawTime&&headEnd.jawAngle===0&&JSON.stringify(headEnd.rig.headWorld)===JSON.stringify(headEnd.rig.jawWorld));
 await page.evaluate(()=>halloweenControl.pause());const hold=await page.evaluate(()=>halloweenDiagnostics().skull);await page.waitForTimeout(100);
 check('pause holds both independent clocks',await page.evaluate(hold=>{const p=halloweenDiagnostics().skull;return p.headTime===hold.headTime&&p.jawTime===hold.jawTime;},hold));
 await page.evaluate(()=>halloweenControl.reset('skull3d'));
 check('paused reset keeps pose controls and resets both clocks',await page.evaluate(()=>{const d=halloweenDiagnostics();return d.phase==='paused'&&d.skull.headTime===0&&d.skull.jawTime===0&&d.settings.rigMode===1&&d.pendingRAF===0;}));
 await page.evaluate(()=>{for(let i=0;i<40;i++){halloweenControl.select('skull3d');halloweenControl.set('skull3d','rigMode',i%2);halloweenControl.stop();}});
 check('mode switching and Stop release own mesh scope',await page.evaluate(()=>{const d=halloweenDiagnostics();return d.skullResources.liveScopes===0&&d.skullResources.modelBytes===0&&d.skullResources.scratchBytes===0&&d.pendingRAF===0&&d.skullResources.maxLive===1;}));
 await page.evaluate(()=>halloweenControl.resume());check('Resume restores registered mode',await page.evaluate(()=>halloweenDiagnostics().skull?.rigMode===1));
 check('no page exceptions',errors.length===0,errors);
 return JSON.stringify({passed:checks.filter(c=>c.ok).length,failed:checks.filter(c=>!c.ok).length,checks,scope:'one CC0 alternate registered pose; independent API controls; original geometry/lighting/motion/fluid/text unvalidated'});
}

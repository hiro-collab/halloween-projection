async page=>{
 const checks=[],errors=[],onError=e=>errors.push(e.message),check=(name,ok,detail={})=>checks.push({name,ok,detail});page.on('pageerror',onError);
 await page.context().setOffline(false);await page.reload();await page.locator('#bats').click();
 await page.waitForFunction(()=>halloweenDiagnostics().sprite?.fire?.mode==='source-fire-operator-candidate');
 await page.evaluate(()=>halloweenControl.setText('bats','HALLOWEEN\n比較基準'));
 const d=await page.evaluate(()=>halloweenDiagnostics());
 check('one final compositor owns bounded GPU state',d.fireResources.liveScopes===1&&d.fireResources.programs===2&&d.fireResources.textures===4&&d.fireResources.framebuffers===1,d.fireResources);
 check('original hue/value order and unmatched noise remain explicit',d.sprite.fire.hueOffset===-284&&d.sprite.fire.valueMultiplier===.5&&d.sprite.fire.matched===false,d.sprite.fire);
 const transfer=await page.evaluate(async()=>{const c=document.createElement('canvas');c.width=c.height=8;const gl=c.getContext('webgl2',{premultipliedAlpha:true,preserveDrawingBuffer:true});gl.clearColor(.125,.0625,.25,.5);gl.clear(gl.COLOR_BUFFER_BIT);const pixels=new Uint8Array(8*8*4);gl.readPixels(0,0,8,8,gl.RGBA,gl.UNSIGNED_BYTE,pixels);const bitmap=await createImageBitmap(new ImageData(new Uint8ClampedArray(pixels),8,8),{premultiplyAlpha:'none',colorSpaceConversion:'none'}),a=HalloweenBatFire.create(),b=HalloweenBatFire.create();try{a.draw(c,{premultipliedInput:true});b.draw(bitmap);const x=a.readPixels(),y=b.readPixels();return Math.max(...x.map((v,i)=>Math.abs(v-y[i])));}finally{bitmap.close();a.dispose();b.dispose();gl.getExtension('WEBGL_lose_context')?.loseContext();}});
 check('GPU Canvas transfer preserves premultiplied pixel intensities',transfer<=1,transfer);
 check('central text uses a glyph mask and no opaque DOM rectangle',await page.evaluate(()=>{const m=document.getElementById('message'),t=document.getElementById('message-text');return getComputedStyle(m).opacity==='0'&&getComputedStyle(t).backgroundColor==='rgba(0, 0, 0, 0)';}));
 await page.waitForFunction(()=>halloweenDiagnostics().sprite.flightTime>=2.2);
 await page.evaluate(()=>halloweenControl.pause());
 const ink=await page.evaluate(()=>{const c=document.querySelector('canvas'),ctx=c.getContext('2d'),a=ctx.getImageData(0,0,c.width,c.height).data;halloweenControl.setText('bats','');const b=ctx.getImageData(0,0,c.width,c.height).data;let changed=0,gap=0;const y=Math.floor(c.height/2);for(let i=0;i<a.length;i+=4){if(a[i]!==b[i]||a[i+1]!==b[i+1]||a[i+2]!==b[i+2]){changed++;if(Math.floor(i/4/c.width)===y)gap++;}}halloweenControl.setText('bats','HALLOWEEN\n比較基準');return {changed,gap};});
 check('text changes glyph pixels while the inter-line gap keeps the flock visible',ink.changed>20&&ink.gap===0,ink);
 await page.screenshot({path:'output/b-fire-text-mask-20261013.png'});
 await page.evaluate(()=>halloweenControl.pause());const hold=await page.evaluate(()=>document.querySelector('canvas').toDataURL());await page.waitForTimeout(150);
 check('Pause freezes the noise and composed text',await page.evaluate(p=>document.querySelector('canvas').toDataURL()===p,hold));
 await page.evaluate(()=>halloweenControl.setText('bats',''));
 check('empty text removes its mask',await page.evaluate(()=>halloweenDiagnostics().text.visible===false));
 await page.locator('#stop').click();check('Stop releases final GPU and motion memory',await page.evaluate(()=>{const d=halloweenDiagnostics(),f=d.fireResources;return !f.liveScopes&&!f.programs&&!f.textures&&!f.framebuffers&&d.motionResources.bytes===0;}));
 await page.evaluate(()=>{for(let i=0;i<100;i++)halloweenControl.select(i%2?'bats':'skeleton');halloweenControl.stop();});await page.waitForFunction(()=>halloweenDiagnostics().imageResources.pending===0);
 check('rapid scene switching leaves no final compositor',await page.evaluate(()=>{const f=halloweenDiagnostics().fireResources;return !f.liveScopes&&f.created===f.disposed&&!f.programs&&!f.textures&&!f.framebuffers;}));
 const fallback=await page.evaluate(()=>{const old=HTMLCanvasElement.prototype.getContext;let c;try{HTMLCanvasElement.prototype.getContext=function(t,...args){return t==='webgl2'?null:old.call(this,t,...args);};c=HalloweenBatFire.create();return c.status().mode;}finally{c?.dispose();HTMLCanvasElement.prototype.getContext=old;}});
 check('unavailable final GPU keeps circle output',fallback==='circle-only-fallback');
 await page.locator('#quit').click();check('End releases encoded motion and source bytes',await page.evaluate(()=>{const d=halloweenDiagnostics();return d.destroyed&&d.motionResources.encodedChars===0&&d.imageResources.encodedBytes===0;}));
 check('normal final rendering has no exceptions',errors.length===0,errors);page.off('pageerror',onError);
 return JSON.stringify({passed:checks.filter(c=>c.ok).length,failed:checks.filter(c=>!c.ok).length,checks,scope:'resource, mask and lifecycle tests; independent reproduction review still required'});
}

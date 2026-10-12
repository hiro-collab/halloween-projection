
(()=>{
'use strict';
const $=id=>document.getElementById(id),canvas=$('canvas'),stage=$('stage'),ctx=canvas.getContext('2d',{alpha:false});
const controls=$('controls'),message=$('message'),messageText=$('message-text');
const settings={effect:'skeleton',text:$('text').value,speed:1,size:1};
let active=null,phase='stopped',raf=0,previous=0,time=0,hiddenSuspension=false,destroyed=false;
let width=1,height=1,revision=0,fitFont=0,fullscreenError='',quitting=false;
const stats={frames:0,created:0,disposed:0,resets:0,maxPendingRAF:0};
const listeners=[];
function listen(target,event,fn){target.addEventListener(event,fn);listeners.push(()=>target.removeEventListener(event,fn));}
function cancel(){if(raf)cancelAnimationFrame(raf);raf=0;previous=0;}
function schedule(){if(raf||!active||phase!=='running'||document.hidden||destroyed)return;raf=requestAnimationFrame(tick);stats.maxPendingRAF=Math.max(stats.maxPendingRAF,1);}
function tick(now){raf=0;if(!active||phase!=='running'||document.hidden)return;const dt=previous?Math.min(.05,Math.max(0,(now-previous)/1000)):0;previous=now;time+=dt*settings.speed;render();stats.frames++;schedule();}
function fitText(){
 messageText.textContent=settings.text;
 if(settings.effect!=='bats'||!active){message.hidden=true;fitFont=0;return;}
 message.hidden=false;
 const maxHeight=height*.48,maxWidth=width*.82;
 messageText.style.width=maxWidth+'px';
 let lo=1,hi=Math.min(112,width*.13),best=lo;
 for(let i=0;i<12;i++){const n=(lo+hi)/2;messageText.style.fontSize=n+'px';if(messageText.scrollHeight<=maxHeight&&messageText.scrollWidth<=maxWidth+1){best=n;lo=n;}else hi=n;}
 fitFont=Math.floor(best*10)/10;messageText.style.fontSize=fitFont+'px';
 $('fit-note').textContent=fitFont<18&&settings.text.trim()?'文字が小さめです。文字を短くするか、全画面で確認してください。':'中央の文字はコウモリより手前に表示されます。';
}
function resize(){
 const rect=stage.getBoundingClientRect();width=Math.max(1,rect.width);height=Math.max(1,rect.height);
 if(active){const dpr=Math.min(1.5,window.devicePixelRatio||1,4096/width,4096/height);canvas.width=Math.max(1,Math.round(width*dpr));canvas.height=Math.max(1,Math.round(height*dpr));ctx.setTransform(canvas.width/width,0,0,canvas.height/height,0,0);}
 fitText();render();
}
function bone(a,b,r,color){
 ctx.strokeStyle=color;ctx.lineWidth=r*1.5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
 ctx.fillStyle=color;
 for(const p of [a,b]){ctx.beginPath();ctx.arc(p[0]-r*.4,p[1],r*.7,0,Math.PI*2);ctx.arc(p[0]+r*.4,p[1],r*.7,0,Math.PI*2);ctx.fill();}
}
function skull(x,y,s,angle){
 ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(s,s);
 ctx.fillStyle='#fff4da';ctx.beginPath();ctx.ellipse(0,-6,28,31,0,0,Math.PI*2);ctx.fill();
 ctx.beginPath();ctx.roundRect(-19,13,38,22,7);ctx.fill();
 ctx.fillStyle='#000';for(const sx of [-12,12]){ctx.beginPath();ctx.ellipse(sx,-5,8.5,11,sx*.01,0,Math.PI*2);ctx.fill();}
 ctx.beginPath();ctx.moveTo(0,6);ctx.lineTo(-6,17);ctx.lineTo(6,17);ctx.closePath();ctx.fill();
 ctx.strokeStyle='#000';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(-15,25);ctx.lineTo(15,25);for(let i=-10;i<=10;i+=5){ctx.moveTo(i,22);ctx.lineTo(i,33);}ctx.stroke();ctx.restore();
}
function makeSkeleton(){
 let ornaments=Array.from({length:8},(_,i)=>({a:i*Math.PI/4,offset:i*.53}));
 return {kind:'skeleton',resourceCount:()=>ornaments?8:0,draw(t){
 const s=Math.min(width,height)*.0019*settings.size;
 ctx.save();ctx.translate(width/2,height/2);ctx.rotate(t*.8);ctx.scale(s,s);
 const ivory='#fff4da';
 skull(0,-116,1.2,Math.sin(t*1.3)*.12);
 bone([0,-69],[0,24],6,ivory);
 for(let i=0;i<4;i++){ctx.strokeStyle=ivory;ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.ellipse(0,-53+i*16,33-i*2,12,0,.15,Math.PI-.15);ctx.stroke();}
 bone([-33,-62],[-73,-19],7,ivory);bone([-73,-19],[-105,-48-Math.sin(t*2)*12],6,ivory);
 bone([33,-62],[72,-20],7,ivory);bone([72,-20],[101,-48+Math.sin(t*2)*12],6,ivory);
 ctx.fillStyle=ivory;ctx.beginPath();ctx.ellipse(0,30,29,13,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(0,30,11,5,0,0,Math.PI*2);ctx.fill();
 bone([-16,39],[-31,91],8,ivory);bone([-31,91],[-48,149],7,ivory);bone([16,39],[36,91],8,ivory);bone([36,91],[53,149],7,ivory);
 bone([-48,149],[-68,154],5,ivory);bone([53,149],[73,154],5,ivory);
 ctx.restore();
 for(const o of ornaments){const a=o.a-t*.22,rad=Math.min(width,height)*.4;skull(width/2+Math.cos(a)*rad,height/2+Math.sin(a)*rad,.26*s,t*.6+o.offset);}
 },dispose(){ornaments=null;}};
}
function makeBats(){
 let flock=Array.from({length:24},(_,i)=>({phase:i*2.39996,ring:i%3,scale:.7+(i%5)*.1,rate:.14+(i%4)*.027}));
 return {kind:'bats',resourceCount:()=>flock?24:0,draw(t){
 for(const b of flock){
 const a=b.phase+t*b.rate;
 const x=width/2+Math.cos(a)*(width*(.37+b.ring*.045));
 const y=height/2+Math.sin(a)*(height*(.34+b.ring*.06));
 const s=Math.min(width,height)*.0017*settings.size*b.scale;
 ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(a)*.2);
 const flap=.68+.27*Math.sin(t*5+b.phase);
 ctx.scale(s,s*flap);
 const tint=b.ring===0?'#f3e4ff':b.ring===1?'#c5a4e3':'#9677b8';
 ctx.fillStyle=tint;ctx.beginPath();ctx.moveTo(-3,-4);ctx.lineTo(-28,-26);ctx.quadraticCurveTo(-37,-23,-48,-6);ctx.quadraticCurveTo(-31,-13,-29,4);ctx.quadraticCurveTo(-19,-3,-16,11);ctx.quadraticCurveTo(-8,5,-4,13);ctx.lineTo(4,13);ctx.quadraticCurveTo(8,5,16,11);ctx.quadraticCurveTo(19,-3,29,4);ctx.quadraticCurveTo(31,-13,48,-6);ctx.quadraticCurveTo(37,-23,28,-26);ctx.lineTo(3,-4);ctx.closePath();ctx.fill();
 ctx.beginPath();ctx.ellipse(0,4,6,13,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(-5,-4);ctx.lineTo(-5,-15);ctx.lineTo(0,-9);ctx.lineTo(5,-15);ctx.lineTo(5,-4);ctx.fill();
 ctx.fillStyle='#fff';ctx.fillRect(-3,-5,1.6,1.6);ctx.fillRect(1.4,-5,1.6,1.6);ctx.restore();
 }
 },dispose(){flock=null;}};
}
const factories={skeleton:makeSkeleton,bats:makeBats};
function render(){if(!ctx)return;ctx.save();ctx.setTransform(canvas.width/width,0,0,canvas.height/height,0,0);ctx.fillStyle='#000';ctx.fillRect(0,0,width,height);if(active)active.draw(time);ctx.restore();}
function disposeActive(){cancel();if(active){active.dispose();active=null;stats.disposed++;}}
function publish(){
 const label=settings.effect==='skeleton'?'くるくる骸骨':'コウモリと文字';
 $('status').textContent=label+' · '+(phase==='running'?'表示中':phase==='paused'?'一時停止':'停止・解放済み')+(fullscreenError?' · '+fullscreenError:'');
 $('pause').textContent=phase==='paused'?'再開':'一時停止';$('pause').disabled=phase==='stopped';$('reset').disabled=phase==='stopped';
 for(const b of document.querySelectorAll('[data-effect]'))b.setAttribute('aria-pressed',String(b.dataset.effect===settings.effect));
 $('speed-value').textContent=settings.speed.toFixed(1)+' ×';$('size-value').textContent=Math.round(settings.size*100)+' %';
}
function select(id){if(!factories[id]||destroyed)return;disposeActive();settings.effect=id;time=0;active=factories[id]();stats.created++;revision++;phase='running';resize();publish();schedule();}
function pause(){if(!active)return;cancel();phase=phase==='paused'?'running':'paused';publish();schedule();}
function stop(){disposeActive();phase='stopped';time=0;message.hidden=true;canvas.width=1;canvas.height=1;render();revision++;publish();}
function resume(){if(!active){select(settings.effect);return;}cancel();phase='running';publish();schedule();}
function reset(){if(!active)return;const hold=phase;select(settings.effect);if(hold==='paused'){cancel();phase='paused';}stats.resets++;publish();}
function projection(on){document.body.classList.toggle('projection',on);resize();}
function fullscreenFailed(){
 projection(false);
 fullscreenError='全画面にできませんでした。操作パネルを戻しました。ブラウザーの全画面メニューを使うか、パネルを隠して表示できます。';
 publish();
}
async function fullscreen(){
 fullscreenError='';
 try{
  if(document.fullscreenElement){await document.exitFullscreen();projection(false);publish();return;}
  if(typeof document.documentElement.requestFullscreen!=='function'){fullscreenFailed();return;}
  await document.documentElement.requestFullscreen();
  if(!document.fullscreenElement){fullscreenFailed();return;}
  projection(true);publish();
 }catch(e){fullscreenFailed();}
}
async function quit(){
 if(quitting)return;quitting=true;
 projection(false);
 if(document.fullscreenElement)await document.exitFullscreen().catch(()=>{});
 destroy();
 for(const button of controls.querySelectorAll('button:not([data-maintenance])'))button.disabled=true;
 $('status').textContent='表示を終了しました。このタブを閉じてください。もう一度使うときはページを開き直してください。';
}
window.halloweenEnd=quit;

for(const button of document.querySelectorAll('[data-effect]'))listen(button,'click',()=>select(button.dataset.effect));
listen($('text'),'input',()=>{let value=$('text').value;const lines=value.split('\n');if(lines.length>8)value=lines.slice(0,7).join('\n')+'\n'+lines.slice(7).join(' ');$('text').value=value;settings.text=value;fitText();});
listen($('speed'),'input',()=>{settings.speed=Number($('speed').value);publish();});
listen($('size'),'input',()=>{settings.size=Number($('size').value)/100;render();publish();});
listen($('pause'),'click',pause);listen($('stop'),'click',stop);listen($('resume'),'click',resume);listen($('reset'),'click',reset);
listen($('quit'),'click',quit);
listen(document,'fullscreenerror',fullscreenFailed);
listen($('project'),'click',fullscreen);listen($('hide'),'click',()=>projection(true));
listen(stage,'dblclick',()=>{projection(false);if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});});
listen($('guide'),'click',()=>$('guide-dialog').showModal());listen($('close-guide'),'click',()=>$('guide-dialog').close());
listen(document,'fullscreenchange',()=>{if(!document.fullscreenElement)projection(false);else resize();});
listen(document,'keydown',e=>{
 if(e.target.closest('input,textarea')||e.ctrlKey||e.metaKey||e.altKey||$('guide-dialog').open)return;
 if(e.repeat)return;
 if(e.key==='Escape'){projection(false);if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});return;}
 const key=e.key.toLowerCase();
 if(key==='h'){projection(!document.body.classList.contains('projection'));}
 else if(key==='f')fullscreen();else if(key===' '){e.preventDefault();if(active)pause();else resume();}else if(key==='r')reset();
});
listen(document,'visibilitychange',()=>{if(document.hidden){hiddenSuspension=true;cancel();}else{hiddenSuspension=false;previous=0;schedule();}});
listen(window,'resize',resize);
function destroy(){if(destroyed)return;stop();destroyed=true;observer.disconnect();for(const remove of listeners)remove();listeners.length=0;}
listen(window,'pagehide',e=>{if(e.persisted){stop();observer.disconnect();}else destroy();});
listen(window,'pageshow',e=>{if(e.persisted&&!destroyed){observer.observe(stage);resize();}});
const observer=new ResizeObserver(resize);observer.observe(stage);
window.halloweenDiagnostics=()=>({version:'0.1.2-web-preview',renderer:'Canvas2D',phase,selected:settings.effect,time,revision,settings:{...settings},pendingRAF:raf?1:0,liveEffects:active?1:0,liveObjects:active?.resourceCount()||0,stats:{...stats},backing:[canvas.width,canvas.height],stage:[width,height],text:{fontSize:fitFont,chars:settings.text.length,visible:!message.hidden},projection:document.body.classList.contains('projection'),fullscreen:!!document.fullscreenElement,hiddenSuspension,destroyed,listeners:listeners.length,fullscreenError,quitting,localHost:false,heartbeat:0});
if(!ctx){$('status').textContent='Canvas 2D を開始できません。別のブラウザで確認してください。';return;}
select('skeleton');
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){pause();$('fit-note').textContent='端末の動きを減らす設定に合わせて一時停止で開始しました。再開できます。';}
})();

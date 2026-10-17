'use strict';
(()=>{
 const role=window.HalloweenStageRole;if(!role?.remote)return;
 const api=window.halloweenControls,perf=HalloweenPerformance.create(api,{batch:window.halloweenRenderBatch,requestUpdate:()=>window.halloweenRequestPresentation?.()===true}),limits=HalloweenWindowSafety;window.halloweenPerformance=perf;
 let port=null,last=Date.now(),connected=false,ended=false,started=false,accepted=0,rejected=0,ownerArmed=false,lastSequence=-1;
 let lastCuePost=0;let armGeneration=0;let requiresArm=true,reason='演奏開始を押してください',epoch=0,trips=0,accentCaps=0,lastFrame=Date.now(),accentUntil=0,holdUntil=0,holdGesture=-1,checking=false;
 const start=document.getElementById('stage-start');
 function health(now=Date.now()){const surface=limits.surface(),running=api.getState().transport.phase==='running',renderAge=now-lastFrame;return {...surface,renderAge,ready:surface.available&&(!running||renderAge<=limits.renderMs),reason:surface.reason||(running&&renderAge>limits.renderMs?'描画応答を確認できません':'')};}
 function release(){accentUntil=holdUntil=0;holdGesture=-1;perf.release();}
 function trip(why){if(ownerArmed||!requiresArm||perf.state().accent){epoch++;trips++;}ownerArmed=false;requiresArm=true;reason=why;release();}
 function check(now=Date.now(),frame=false){if(checking||ended)return;checking=true;try{if(api.getState().view.ended){trip('投影終了');perf.dispose();ended=true;return;}
  if(frame){if(ownerArmed&&now-lastFrame>limits.renderMs)trip('描画の長い中断。演奏開始で戻ります');lastFrame=now;}
  const h=health(now);if(!h.ready)trip(h.reason);
  if(connected&&now-last>limits.heartbeatMs){trip('操作窓の応答が途切れました。演奏開始で戻ります');}
  if(ownerArmed&&accentUntil&&now>=accentUntil){accentUntil=0;accentCaps++;perf.dispatch({action:'accent',value:false});}
  if(ownerArmed&&holdUntil&&now>=holdUntil)trip('連続押下は最大8秒です。離して演奏開始を押してください');
  if(api.getState().transport.phase!=='running')lastFrame=now;
 }finally{checking=false;}}
 window.halloweenBeforeRender=()=>check(Date.now(),true);
 function snapshot(){check();const s=api.getState(),h=health();return {kind:'state',version:1,performance:perf.state(),app:{scene:s.scene,transport:s.transport,settings:s.settings},started,fullscreen:!!document.fullscreenElement,visible:h.available,browserVisible:h.browserVisible,connected:connected&&Date.now()-last<=limits.heartbeatMs,ownerArmed,accepted,rejected,ended,safety:{requiresArm,reason,epoch,trips,accentCaps,armGeneration,ready:h.ready,outer:h.outer,renderAge:h.renderAge,accentRemaining:Math.max(0,accentUntil-Date.now()),holdRemaining:Math.max(0,holdUntil-Date.now()),limits:{accentMs:limits.accentMs,holdMs:limits.holdMs}}};}
 function disconnect(){trip('接続が切れました');connected=false;port?.close();port=null;}
 function post(value){try{port?.postMessage(value);}catch{disconnect();}}
 function reply(id,error){post({kind:'ack',id,error:error??null,state:snapshot()});}
 function receive(e){const m=e.data;let bytes;try{bytes=JSON.stringify(m)?.length??0;}catch{rejected++;return;}if(!m||typeof m!=='object'||Array.isArray(m)||bytes>5000){rejected++;return;}check();
  if(m.kind==='ping'){if(!connected)return;last=Date.now();if(m.armGeneration!==armGeneration){post(snapshot());return;}if(m.armed!==true){if(ownerArmed){ownerArmed=false;requiresArm=true;reason='演奏停止';}release();}else if(ownerArmed){const h=m.hold;if(h?.active===true&&Number.isSafeInteger(h.gesture)&&h.gesture>=0){if(!holdUntil){holdUntil=Date.now()+limits.holdMs;holdGesture=h.gesture;}else if(holdGesture===-1)holdGesture=h.gesture;else if(h.gesture!==holdGesture)trip('押下の整合性を確認できません');}else{holdUntil=0;holdGesture=-1;}}post(snapshot());return;}
  if(m.kind!=='request'||!Number.isSafeInteger(m.id)||m.id<=lastSequence){rejected++;return;}lastSequence=m.id;last=Date.now();
  try{
   if(!connected||ended)throw Error('再接続してください');
   if(m.control){if(m.control.action!=='arm'||!started||!health().ready)throw Error('投影の表示と応答を確認してください');release();armGeneration++;requiresArm=false;ownerArmed=true;reason='演奏中';}
   else if(m.intent){const i=m.intent;if(!ownerArmed&&!['scene','sceneToggle','flip','mode','preset','setAxis','capture','baseline','pause','reset','accent'].includes(i.action))throw Error('演奏開始を押してください');if(i.action==='accent'&&i.value){if(!ownerArmed||!health().ready)throw Error('演奏停止中');if(!accentUntil)accentUntil=Date.now()+limits.accentMs;}if(i.action==='accent'&&!i.value)accentUntil=0;if(i.action==='adjust'&&!holdUntil)holdUntil=Date.now()+limits.holdMs;perf.dispatch(i);}
   else if(m.api){const c=m.api;if(c.type==='set'&&!['a.actorCount','a.actorLayout','a.text','b.text','text.width','text.height','text.sequenceEnabled','output.transformMode','output.circularMask'].includes(c.key))throw Error('操作窓の設定範囲外');if(c.type==='command'&&!['text.nextLine','text.previousLine','text.resetLine','transport.pause','transport.resume','transport.stop','scene.reset','application.end'].includes(c.name))throw Error('操作窓の命令範囲外');if(c.type==='set'&&c.key==='output.transformMode'&&(!Number.isInteger(c.value)||c.value<1||c.value>4))throw Error('投影向きは4状態です');if(!api.validate(c).valid)throw Error('無効な設定');if(c.name==='application.end'){trip('投影終了');perf.dispose();ended=true;}window.halloweenRenderBatch(()=>api.dispatch(c,{source:'console-port'}));}
   else throw Error('命令がありません');accepted++;reply(m.id);
  }catch(error){rejected++;reply(m.id,String(error.message));}
 }
 function connect(e){const m=e.data;if(!m||m.kind!=='halloween-stage-connect'||m.version!==1||m.token!==role.token||e.source!==window.opener||!e.ports?.[0]||(location.protocol!=='file:'&&e.origin!==location.origin)){rejected++;return;}trip('接続しました。演奏開始を押してください');port?.close();port=e.ports[0];port.onmessage=receive;port.start();connected=true;lastSequence=-1;last=Date.now();post(snapshot());}
 window.addEventListener('message',connect);
 document.getElementById('stage-fullscreen').addEventListener('click',async()=>{try{await document.documentElement.requestFullscreen();started=true;start.hidden=true;post(snapshot());}catch{document.getElementById('stage-start-note').textContent='全画面にできませんでした。ウィンドウで始めることもできます。';}});
 document.getElementById('stage-windowed').addEventListener('click',()=>{started=true;start.hidden=true;post(snapshot());});
 const visibility=()=>{check();post(snapshot());};document.addEventListener('visibilitychange',visibility);document.addEventListener('fullscreenchange',visibility);window.addEventListener('resize',visibility);
 window.halloweenAdvancePerformance=now=>{const changed=perf.advance(now);if(changed&&(Date.now()-lastCuePost>=33||!perf.pending())){lastCuePost=Date.now();if(connected)post(snapshot());}};
 const timer=setInterval(()=>{check();if(connected)post(snapshot());},250);
 function cleanup(){trip('投影窓を終了');perf.dispose();ended=true;clearInterval(timer);window.halloweenBeforeRender=null;window.halloweenAdvancePerformance=null;window.removeEventListener('message',connect);window.removeEventListener('resize',visibility);document.removeEventListener('visibilitychange',visibility);document.removeEventListener('fullscreenchange',visibility);port?.close();port=null;}
 window.addEventListener('pagehide',cleanup,{once:true});window.halloweenStageLink=Object.freeze({status:()=>({connected:connected&&Date.now()-last<=limits.heartbeatMs,lastAge:Date.now()-last,ownerArmed,accepted,rejected,started,ended,rendererOwners:1,safety:snapshot().safety}),snapshot,disconnect});
})();

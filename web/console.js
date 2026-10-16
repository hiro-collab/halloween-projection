'use strict';
(()=>{
 const $=id=>document.getElementById(id);let token;
 if(/^halloween-console-v42:[a-f0-9]{32}$/.test(window.name))token=window.name.split(':')[1];else{token=[...crypto.getRandomValues(new Uint32Array(4))].map(n=>n.toString(16).padStart(8,'0')).join('');window.name='halloween-console-v42:'+token;}
 const stageURL=new URL('index.html',location.href).href+'#stage='+token,targetName='halloween-stage-v42-'+token;
 let armGeneration=0;let popup=null,port=null,snapshot=null,connected=false,seq=0,lastState=0,attempt=0,connectTimer=0,destroyed=false;const pending=new Map();
 function render(){const s=snapshot,p=s?.performance,playing=keyboard?.status().armed;document.body.classList.toggle('playing',!!playing);$('arm').disabled=!connected||!s?.started||!s?.visible||!s?.safety?.ready||s?.ended;
  if(!s)return;const sc=s.app.scene,v=s.app.settings;$('actor-count').value=v['a.actorCount'];$('actor-count').disabled=sc!=='a';$('connection').textContent=s.ended?'投影終了。新しく開くと再初期化します。':!connected?'切断。再接続を押してください。':!s.visible?'投影窓の表示と大きさを確認してください。戻して演奏開始を押してください。':!s.started?'接続済み。投影窓の開始ボタンを押してください。':'接続済み · '+(s.fullscreen?'投影は全画面':'投影はウィンドウ表示')+' · '+(sc==='a'?'ドクロ':'コウモリ')+' · '+s.app.transport.phase;
  $('values').textContent=(sc==='a'?'ドクロ '+v['a.actorCount']+'体 / ':'')+'動き '+Math.round(p.profiles[p.scene].motion*100)+'% / 色・回り方 '+Math.round(p.profiles[p.scene].look*100)+'% / 文字 '+Math.round(p.size*100)+'%';
  $('motion-label').textContent=p.labels.motion+'　弱 / 強';$('look-label').textContent=p.labels.look+'　戻す / 進める';$('mode-label').textContent=p.labels.mode+'を切替';$('accent-label').textContent='押している間だけ '+p.labels.accent+'（最大3秒）';
  if(document.activeElement!==$('main-text'))$('main-text').value=v[sc+'.text']??'';if(document.activeElement!==$('text-size'))$('text-size').value=p.size;$('text-size-value').textContent=Math.round(p.size*100)+'%';
  for(const [id,key] of [['text-width','text.width'],['text-height','text.height']])if(document.activeElement!==$(id))$(id).value=v[key];$('transform').value=v['output.transformMode'];$('mask').checked=!!v['output.circularMask'];$('line-mode').checked=!!v['text.sequenceEnabled'];
 }
 function post(m){if(!port)return false;try{port.postMessage(m);return true;}catch{lost('通信が切れました');return false;}}
 function ping(){const k=keyboard?.status();post({kind:'ping',armGeneration,armed:k?.armed===true,hold:{active:(k?.pressed.length??0)>0,gesture:k?.gesture??0}});}
 function request(data){if(!connected)return Promise.reject(Error('投影窓に接続してください'));const id=++seq;return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{pending.delete(id);reject(Error('反映の返答がありません'));},2500);pending.set(id,{resolve,reject,timer});if(!post({kind:'request',id,...data})){clearTimeout(timer);pending.delete(id);reject(Error('通信が切れました'));}});}
 function sendIntent(intent){if(!connected)return;request({intent}).catch(e=>$('error').textContent=e.message);}
 function receive(e){const m=e.data;if(!m||typeof m!=='object')return;
  if(m.kind==='ack'){const p=pending.get(m.id);if(p){clearTimeout(p.timer);pending.delete(m.id);m.error?p.reject(Error(m.error)):p.resolve(m.state);}}
  const s=m.kind==='state'?m:m.state;if(!s||s.version!==1)return;snapshot=s;lastState=performance.now();connected=s.connected&&!s.ended;if(connectTimer){clearInterval(connectTimer);connectTimer=0;}
  if(!s.visible||!s.safety?.ready||s.safety?.requiresArm||s.ended){if(keyboard.status().armed)keyboard.disarm(s.ended?'投影終了':s.safety?.reason||'投影の応答を確認できないため停止');}render();
 }
 function lost(message){connected=false;port?.close();port=null;keyboard?.disarm(message);$('connection').textContent=message;$('arm').disabled=true;for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error(message));}pending.clear();}
 function connect(){if(!popup||popup.closed){lost('投影窓がありません');return;}attempt=0;if(connectTimer)clearInterval(connectTimer);
  function hello(){if(destroyed||!popup||popup.closed)return;attempt++;port?.close();const c=new MessageChannel();port=c.port1;port.onmessage=receive;port.start();popup.postMessage({kind:'halloween-stage-connect',version:1,token},location.protocol==='file:'?'*':location.origin,[c.port2]);if(attempt>8){clearInterval(connectTimer);connectTimer=0;lost('接続できません。「投影窓を開く」で開始するか、再接続を試してください。');}}
  hello();connectTimer=setInterval(hello,350);
 }
 let keyboard=HalloweenPerformanceKeyboard.create({send:sendIntent,canArm:()=>connected&&snapshot?.started&&snapshot?.visible&&snapshot?.safety?.ready&&!snapshot?.ended,onState:s=>{$('armed').textContent=s.reason;$('pressed').textContent=s.pressed.length?'押しているキー：'+s.pressed.join(' '):'';ping();render();}});
 $('open-stage').addEventListener('click',()=>{keyboard.disarm('投影準備');$('error').textContent='';if(connected&&popup&&!popup.closed){popup.focus();return;}popup=window.open(stageURL,targetName,'popup=yes,width=1280,height=720');if(!popup){lost('別窓を開けませんでした。ブラウザーのポップアップ表示を確認してください。');return;}connect();});
 $('reconnect').addEventListener('click',()=>{keyboard.disarm('再接続');popup=popup&&!popup.closed?popup:window.open('',targetName,'popup=yes,width=1280,height=720');if(popup)connect();else lost('投影窓を取得できません');});
 $('arm').addEventListener('click',async()=>{try{$('keyboard-surface').focus();const state=await request({control:{action:'arm'}});armGeneration=state.safety.armGeneration;if(!state.safety.requiresArm&&state.safety.ready&&document.hasFocus()&&HalloweenWindowSafety.surface().available){keyboard.arm();ping();}else{keyboard.disarm('操作窓へ戻って演奏開始を押してください');}}catch(e){keyboard.disarm(e.message);}});$('disarm').addEventListener('click',()=>keyboard.disarm('演奏停止。映像は続きます'));
 for(const [id,intent] of [['scene-a',{action:'scene',value:'a'}],['scene-b',{action:'scene',value:'b'}],['pause',{action:'pause'}],['capture',{action:'capture'}],['baseline',{action:'baseline'}]])$(id).addEventListener('click',()=>sendIntent(intent));
 function api(c){request({api:c}).catch(e=>$('error').textContent=e.message);}
 $('actor-count').addEventListener('change',()=>api({type:'set',key:'a.actorCount',value:Number($('actor-count').value)}));
 $('main-text').addEventListener('input',()=>{const value=$('main-text').value.slice(0,240).split('\n').slice(0,8).join('\n');$('main-text').value=value;if(snapshot)api({type:'set',key:snapshot.app.scene+'.text',value});});
 $('text-size').addEventListener('input',()=>sendIntent({action:'setAxis',axis:'text',value:Number($('text-size').value)}));
 for(const [id,key] of [['text-width','text.width'],['text-height','text.height']])$(id).addEventListener('input',()=>api({type:'set',key,value:Number($(id).value)}));
 $('line-mode').addEventListener('change',()=>api({type:'set',key:'text.sequenceEnabled',value:$('line-mode').checked}));for(const [id,name] of [['line-back','text.previousLine'],['line-next','text.nextLine'],['line-first','text.resetLine'],['stop','transport.stop'],['resume','transport.resume']])$(id).addEventListener('click',()=>api({type:'command',name}));
 $('transform').addEventListener('change',()=>api({type:'set',key:'output.transformMode',value:Number($('transform').value)}));$('mask').addEventListener('change',()=>api({type:'set',key:'output.circularMask',value:$('mask').checked}));
 $('end').addEventListener('click',async()=>{keyboard.disarm('投影終了');try{await request({api:{type:'command',name:'application.end'}});popup?.close();lost('投影を終了しました。');}catch(e){$('error').textContent=e.message;}});
 const timer=setInterval(()=>{if(popup?.closed){if(connected)lost('投影窓を閉じました。開き直すと動きは再初期化します。');return;}if(connected&&performance.now()-lastState>2600)lost('通信を確認できません。演奏停止。再接続を押してください。');if(port)ping();},500);
 window.addEventListener('pagehide',()=>{if(destroyed)return;keyboard.dispose();ping();destroyed=true;clearInterval(timer);if(connectTimer)clearInterval(connectTimer);port?.close();port=null;for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error('操作窓を終了'));}pending.clear();},{once:true});
 window.halloweenConsole=Object.freeze({status:()=>({connected,snapshot,keyboard:keyboard.status(),pending:pending.size,rendererOwners:0,version:'0.1.42-a-performance-preview'}),intent:sendIntent,request,disarm:()=>keyboard.disarm(),session:token});render();
})();

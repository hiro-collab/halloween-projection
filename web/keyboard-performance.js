/* Only this adapter interprets keyboard events; no rendering or macro parameters. */
'use strict';
window.HalloweenPerformanceKeyboard=(()=>{
 function create({send,onState=()=>{},document:doc=window.document,window:win=window,canArm=()=>true}={}){
  let armed=false,disposed=false,reason='演奏停止',timer=0,last=0,lastMode=-1,baselineDone=false,gesture=0,holdStart=0,lastWall=Date.now();const pressed=new Set(),listeners=[];
  const axes={a:['motion',-1],d:['motion',1],j:['look',-1],l:['look',1],',':['text',-1],'.':['text',1]};
  const edit=e=>!!e?.closest?.('input,textarea,select,[contenteditable]:not([contenteditable="false"])');
  const status=()=>({armed,reason,pressed:[...pressed],gesture,listeners:disposed?0:listeners.length});const publish=()=>onState(status());
  function off(why='演奏停止'){armed=false;reason=why;pressed.clear();baselineDone=false;if(timer)win.clearInterval(timer);timer=0;send({action:'accent',value:false});publish();}
  function tick(){if(!armed)return;if(!HalloweenWindowSafety.surface(win,doc).available||!doc.hasFocus()){off('操作窓のフォーカスを確認できないため停止');return;}const wall=Date.now();if(wall-lastWall>1000){off('入力確認が中断したため停止');return;}lastWall=wall;if(pressed.size&&wall-holdStart>=HalloweenWindowSafety.holdMs){off('連続押下は最大8秒です。離して演奏開始を押してください');return;}if(pressed.has('z')&&wall-(keyTimes.zWall??wall)>=HalloweenWindowSafety.accentMs){off('Zは最大3秒です。離して演奏開始を押してください');return;}const now=performance.now(),dt=Math.min(.1,Math.max(0,(now-last)/1000));last=now;for(const axis of ['motion','look','text']){let dir=0;for(const k of pressed)if(axes[k]?.[0]===axis)dir+=axes[k][1];if(dir)send({action:'adjust',axis,delta:Math.sign(dir)*dt*(axis==='text'?.22:.28)});}if(pressed.has('m')&&!baselineDone&&now-(keyTimes.m??now)>=600){baselineDone=true;send({action:'baseline'});}}
  const keyTimes={};
  function arm(){if(disposed||!canArm()||doc.hidden||edit(doc.activeElement)){reason='投影接続と入力欄を確認してください';publish();return false;}pressed.clear();baselineDone=false;armed=true;reason='演奏中';last=performance.now();lastWall=Date.now();if(timer)win.clearInterval(timer);timer=win.setInterval(tick,33);publish();return true;}
  function down(e){const k=e.key?.toLowerCase();if(k==='escape'){off('Escで演奏停止');return;}if(e.ctrlKey||e.metaKey||e.altKey||e.shiftKey||e.isComposing||e.keyCode===229){if(armed)off('修飾キー/IMEで演奏停止');return;}if(!armed||disposed||doc.hidden||edit(e.target))return;if(k===' '&&e.target?.closest?.('button,a[href]'))return;
   if(!axes[k]&&!['1','2','k','z','m',' ','r'].includes(k))return;e.preventDefault();if(e.repeat||pressed.has(k))return;if(!pressed.size){gesture++;holdStart=Date.now();}pressed.add(k);if(k==='z')keyTimes.zWall=Date.now();keyTimes[k]=performance.now();
   if(axes[k])send({action:'adjust',axis:axes[k][0],delta:axes[k][1]*(axes[k][0]==='text'?.015:.025)});
   else if(k==='1'||k==='2')send({action:'scene',value:k==='1'?'a':'b'});
   else if(k==='z')send({action:'accent',value:true});
   else if(k==='k'&&performance.now()-lastMode>=200){lastMode=performance.now();send({action:'mode'});}
   else if(k==='m')baselineDone=false;
   else if(k===' ')send({action:'pause'});else if(k==='r')send({action:'reset'});publish();
  }
  function up(e){const k=e.key?.toLowerCase();pressed.delete(k);delete keyTimes[k];if(k==='z'){delete keyTimes.zWall;send({action:'accent',value:false});}if(k==='m')baselineDone=false;publish();}
  function listen(t,n,f){t.addEventListener(n,f);listeners.push(()=>t.removeEventListener(n,f));}
  listen(doc,'keydown',down);listen(doc,'keyup',up);listen(win,'blur',()=>off('フォーカスを失ったため停止。再開を押してください'));
  listen(doc,'visibilitychange',()=>{if(doc.hidden)off('操作窓が隠れたため停止');});listen(doc,'focusin',e=>{if(edit(e.target))off('入力欄を操作中。演奏開始で戻ります');});listen(doc,'compositionstart',()=>off('日本語入力中のため停止'));
  return Object.freeze({arm,disarm:off,status,dispose(){if(disposed)return;off('終了');disposed=true;for(const remove of listeners)remove();listeners.length=0;publish();}});
 }
 return Object.freeze({create});
})();

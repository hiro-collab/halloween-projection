/* MIT: input adapters and renderer share this validated control contract. */
'use strict';
window.HalloweenControlAPI = Object.freeze({
  // Original B input contract, independent of DOM, MIDI and phone transport.
  // Initialspeed is sampled at birth; it is distinct from playback speed.
  createVJ(hooks = {}) {
    let state = {scene:'bats',paused:false,initialSpeed:1.3,motionMix:.5};
    const ranges = {initialSpeed:[0,2.6],motionMix:[0,1]};
    const parameters = s => Object.freeze({Initialspeed:s.initialSpeed,Cross:s.motionMix,
      Vortex:5-4*s.motionMix,Spiral:-1.7+.8*s.motionMix,rotationCross:.77*(1-s.motionMix)});
    const values = () => Object.freeze({...state});
    const apply = command => {
      if(!command||typeof command!=='object'||Array.isArray(command))throw new TypeError('Command must be an object');
      const next={...state};
      if(command.type==='set'){
        const r=Object.hasOwn(ranges,command.key)?ranges[command.key]:null,v=command.value;
        if(!r||typeof v!=='number'||!Number.isFinite(v)||v<r[0]||v>r[1])throw new RangeError('Source input outside comparison range');
        next[command.key]=v;
      }else if(command.type==='select'){
        if(command.scene!=='bats'&&command.scene!=='inactive')throw new RangeError('Unknown source scene');
        next.scene=command.scene;next.paused=command.scene==='inactive';
      }else if(command.type==='pause')next.paused=true;
      else if(command.type==='resume'){next.paused=false;next.scene='bats';}
      else if(command.type!=='reset')throw new RangeError('Unknown source command');
      hooks.apply?.(Object.freeze({...command}),Object.freeze({...next}),parameters(next));
      state=next;
      return values();
    };
    const keyboard = event => {
      if(!event||event.repeat||event.editable||event.ctrlKey||event.metaKey||event.altKey)return false;
      const key=event.key?.toLowerCase();
      let command;
      if(key==='arrowleft'||key==='arrowright')command={type:'set',key:'motionMix',value:Math.min(1,Math.max(0,Math.round((state.motionMix+(key==='arrowright'?.05:-.05))*100)/100))};
      else if(key==='arrowup'||key==='arrowdown')command={type:'set',key:'initialSpeed',value:Math.min(2.6,Math.max(0,Math.round((state.initialSpeed+(key==='arrowup'?.1:-.1))*100)/100))};
      else if(key===' ')command={type:state.paused?'resume':'pause'};
      else if(key==='r')command={type:'reset'};
      else return false;
      apply(command);
      return true;
    };
    // Renderer lifecycle observation also covers legacy UI/API scene changes.
    const observe = runtime => {
      if(!runtime||!['bats','inactive'].includes(runtime.scene)||typeof runtime.paused!=='boolean')throw new RangeError('Invalid runtime state');
      state={...state,scene:runtime.scene,paused:runtime.paused};
      return values();
    };
    return Object.freeze({values,parameters:()=>parameters(state),apply,keyboard,observe});
  },
  create(initialText, hooks) {
    const values = {
      skeleton:{speed:1,size:1,text:initialText},
      bats:{speed:1,size:1,text:initialText,flapRate:1,frameLock:null},
      skull3d:{size:1,text:initialText,headRate:1,jawRate:1,jawOpen:28,pivotY:-.75,pivotZ:-.12,jawTint:0,rigMode:0,headX:0,headY:0,headZ:0,jawPivotMode:0}
    };
    const assertScene = id => { if(!Object.hasOwn(values,id)) throw new RangeError('Unknown scene'); };
    const copy = id => { assertScene(id);return {...values[id]}; };
    const ranges = {speed:[.2,2],size:[.5,1.5],flapRate:[.25,2],headRate:[0,2],jawRate:[0,2],jawOpen:[0,45],pivotY:[-1.15,.2],pivotZ:[-.3,.2],jawTint:[0,1],rigMode:[0,1],headX:[-180,180],headY:[-180,180],headZ:[-180,180],jawPivotMode:[0,1]};
    const api = {
      values:copy,
      select(id){assertScene(id);hooks.select(id);return api.status();},
      set(id,key,value){
        assertScene(id);
        if(!Object.hasOwn(values[id],key)||key==='text')throw new RangeError('Unknown numeric key');
        if(key==='jawTint'||key==='rigMode'||key==='jawPivotMode'){
          if(value!==0&&value!==1)throw new RangeError('Tint must be 0 or 1');
        }else if(key==='frameLock'){
          if(value!==null&&(!Number.isInteger(value)||value<0||value>59))throw new RangeError('Frame must be null or 0..59');
        }else{
          const r=ranges[key];
          if(typeof value!=='number'||!Number.isFinite(value)||!r||value<r[0]||value>r[1])throw new RangeError('Value outside range');
        }
        values[id][key]=value;hooks.changed(id);return api.status();
      },
      setText(id,text){
        assertScene(id);if(typeof text!=='string')throw new TypeError('Text must be a string');
        let value=text.slice(0,240),lines=value.split('\n');
        if(lines.length>8)value=lines.slice(0,7).join('\n')+'\n'+lines.slice(7).join(' ');
        values[id].text=value;hooks.changed(id);return api.status();
      },
      pause(){hooks.pause();return api.status();},
      resume(){hooks.resume();return api.status();},
      reset(id){assertScene(id);hooks.reset(id);return api.status();},
      stop(){hooks.stop();return api.status();},
      status(){return {schema:1,values:{skeleton:copy('skeleton'),bats:copy('bats'),skull3d:copy('skull3d')},runtime:hooks.status()};}
    };
    return Object.freeze(api);
  }
});

// CC0 alternate registration; measurements describe coordinates, not model identity.
window.HalloweenSkullRig=(()=>{
  const scale=.6951803205280249,translation=Object.freeze([-7.301568984985352e-6,.09370309658982542,.00247608319722023]);
  const parentPivot=Object.freeze([0,-.5,0]);
  function rotateX(angle,pivot){
    const c=Math.cos(angle),s=Math.sin(angle),[x,y,z]=pivot;
    return [1,0,0,0,0,c,-s,y-c*y+s*z,0,s,c,z-s*y-c*z,0,0,0,1];
  }
  function multiply(a,b){
    const out=new Array(16).fill(0);
    for(let r=0;r<4;r++)for(let c=0;c<4;c++)for(let k=0;k<4;k++)out[r*4+c]+=a[r*4+k]*b[k*4+c];
    return out;
  }
  function pose(values,headTime,jawAngle){
    const angles=[values.headX,values.headY+headTime*.8*180/Math.PI,values.headZ],r=angles.map(v=>v*Math.PI/180);
    const [sx,sy,sz]=r.map(Math.sin),[cx,cy,cz]=r.map(Math.cos);
    // Native XYZ order: Rz * Ry * Rx, about the common parent pivot.
    const head=[cz*cy,cz*sy*sx-sz*cx,cz*sy*cx+sz*sx,0,sz*cy,sz*sy*sx+cz*cx,sz*sy*cx-cz*sx,0,-sy,cy*sx,cy*cx,0,0,0,0,1];
    for(let i=0;i<3;i++)head[i*4+3]=parentPivot[i]-head[i*4]*parentPivot[0]-head[i*4+1]*parentPivot[1]-head[i*4+2]*parentPivot[2];
    const jawPivot=values.jawPivotMode===1?[0,0,0]:[translation[0],scale*values.pivotY+translation[1],scale*values.pivotZ+translation[2]];
    return {angles,headWorld:head,jawWorld:multiply(head,rotateX(jawAngle*Math.PI/180,jawPivot)),jawPivot,parentPivot:[...parentPivot]};
  }
  function point(matrix,x,y,z,target,offset){
    x=x*scale+translation[0];y=y*scale+translation[1];z=z*scale+translation[2];
    target[offset]=matrix[0]*x+matrix[1]*y+matrix[2]*z+matrix[3];
    target[offset+1]=matrix[4]*x+matrix[5]*y+matrix[6]*z+matrix[7];
    target[offset+2]=matrix[8]*x+matrix[9]*y+matrix[10]*z+matrix[11];
  }
  return Object.freeze({pose,point,registration:Object.freeze({scale,translation,parentPivot,cameraZ:90,fov:6.4,projection:'perspective-horizontal',basis:'closed whole-body height and bbox center; separate candidate jaw pivot'})});
})();

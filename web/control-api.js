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
      skull3d:{size:1,text:initialText,headRate:1,jawRate:1,jawOpen:28,pivotY:-.75,pivotZ:-.12,jawTint:0}
    };
    const assertScene = id => { if(!Object.hasOwn(values,id)) throw new RangeError('Unknown scene'); };
    const copy = id => { assertScene(id);return {...values[id]}; };
    const ranges = {speed:[.2,2],size:[.5,1.5],flapRate:[.25,2],headRate:[0,2],jawRate:[0,2],jawOpen:[0,45],pivotY:[-1.15,-.65],pivotZ:[-.3,.2],jawTint:[0,1]};
    const api = {
      values:copy,
      select(id){assertScene(id);hooks.select(id);return api.status();},
      set(id,key,value){
        assertScene(id);
        if(!Object.hasOwn(values[id],key)||key==='text')throw new RangeError('Unknown numeric key');
        if(key==='jawTint'){
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

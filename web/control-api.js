/* MIT: input adapters and renderer share this validated control contract. */
'use strict';
window.HalloweenControlAPI = Object.freeze({
  create(initialText, hooks) {
    const values = {
      skeleton:{speed:1,size:1,text:initialText},
      bats:{speed:1,size:1,text:initialText,flapRate:1,frameLock:null}
    };
    const assertScene = id => { if(!Object.hasOwn(values,id)) throw new RangeError('Unknown scene'); };
    const copy = id => { assertScene(id);return {...values[id]}; };
    const ranges = {speed:[.2,2],size:[.5,1.5],flapRate:[.25,2]};
    const api = {
      values:copy,
      select(id){assertScene(id);hooks.select(id);return api.status();},
      set(id,key,value){
        assertScene(id);
        if(!Object.hasOwn(values[id],key)||key==='text')throw new RangeError('Unknown numeric key');
        if(key==='frameLock'){
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
      status(){return {schema:1,values:{skeleton:copy('skeleton'),bats:copy('bats')},runtime:hooks.status()};}
    };
    return Object.freeze(api);
  }
});

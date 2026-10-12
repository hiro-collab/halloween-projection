// Source input production only; no native renderer/phone transport claim.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context={window:{}};vm.createContext(context);
vm.runInContext(fs.readFileSync('web/control-api.js','utf8'),context);
const checks=[];const check=(name,fn)=>{fn();checks.push(name);};
const calls=[],model=context.window.HalloweenControlAPI.createVJ({apply:(command,state,parameters)=>calls.push(JSON.parse(JSON.stringify({command,state,parameters})))});
const plain=x=>JSON.parse(JSON.stringify(x));
check('native Cross endpoints preserve recorded force and rotation mapping',()=>{
 model.apply({type:'set',key:'motionMix',value:0});assert.deepEqual(plain(model.parameters()),{Initialspeed:1.3,Cross:0,Vortex:5,Spiral:-1.7,rotationCross:.77});
 model.apply({type:'set',key:'motionMix',value:1});const p=model.parameters();assert.equal(p.Vortex,1);assert.ok(Math.abs(p.Spiral+.9)<1e-12);assert.equal(p.rotationCross,0);
});
check('invalid commands including inherited keys leave model and consumer untouched',()=>{
 const before=JSON.stringify(model.values()),n=calls.length;
 for(const command of [null,[],{type:'set',key:'initialSpeed',value:NaN},{type:'set',key:'motionMix',value:Infinity},{type:'set',key:'motionMix',value:-.01},{type:'set',key:'motionMix',value:1.01},{type:'set',key:'initialSpeed',value:2.61},{type:'select',scene:'unknown'},{type:'unknown'},...['constructor','toString','__proto__'].map(key=>({type:'set',key,value:1}))])assert.throws(()=>model.apply(command));
 assert.equal(JSON.stringify(model.values()),before);assert.equal(calls.length,n);
});
check('all comparison Initialspeed representatives pass independently',()=>{
 const mix=model.values().motionMix;for(const v of [.65,1.3,2.6]){model.apply({type:'set',key:'initialSpeed',value:v});assert.equal(model.parameters().Initialspeed,v);assert.equal(model.values().motionMix,mix);}
});
check('keyboard uses shared validated source producer and clamps endpoints',()=>{
 model.apply({type:'set',key:'motionMix',value:.5});model.apply({type:'set',key:'initialSpeed',value:1.3});
 assert.equal(model.keyboard({key:'ArrowRight'}),true);assert.equal(model.values().motionMix,.55);
 assert.equal(model.keyboard({key:'ArrowUp'}),true);assert.equal(model.values().initialSpeed,1.4);
 for(let i=0;i<100;i++){model.keyboard({key:'ArrowRight'});model.keyboard({key:'ArrowUp'});}assert.equal(model.values().motionMix,1);assert.equal(model.values().initialSpeed,2.6);
 for(let i=0;i<100;i++){model.keyboard({key:'ArrowLeft'});model.keyboard({key:'ArrowDown'});}assert.equal(model.values().motionMix,0);assert.equal(model.values().initialSpeed,0);
});
check('text focus, modifiers, repeats and unrelated keys do not dispatch',()=>{
 const n=calls.length;for(const event of [{key:'r',editable:true},{key:'r',ctrlKey:true},{key:'r',metaKey:true},{key:'r',altKey:true},{key:'r',repeat:true},{key:'x'}])assert.equal(model.keyboard(event),false);assert.equal(calls.length,n);
});
check('Pause Resume Reset and scene selection are distinct and retain parameters',()=>{
 const v=plain(model.values());model.keyboard({key:' '});assert.equal(model.values().paused,true);model.keyboard({key:' '});assert.equal(model.values().paused,false);
 model.keyboard({key:'r'});assert.equal(calls.at(-1).command.type,'reset');model.apply({type:'select',scene:'inactive'});assert.equal(model.values().paused,true);model.apply({type:'select',scene:'bats'});assert.equal(model.values().paused,false);assert.equal(model.values().initialSpeed,v.initialSpeed);assert.equal(model.values().motionMix,v.motionMix);
});
check('consumer failure cannot commit a partial state',()=>{
 const failing=context.window.HalloweenControlAPI.createVJ({apply(){throw Error('consumer rejected');}}),before=JSON.stringify(failing.values());assert.throws(()=>failing.apply({type:'set',key:'initialSpeed',value:2}));assert.equal(JSON.stringify(failing.values()),before);
});
check('state snapshots are frozen copies and independent sessions retain values',()=>{
 const a=model.values(),other=context.window.HalloweenControlAPI.createVJ();assert.ok(Object.isFrozen(a));assert.equal(other.values().initialSpeed,1.3);assert.equal(other.values().motionMix,.5);assert.notEqual(model.values(),a);
});
console.log(JSON.stringify({passed:checks.length,failed:0,checks,scope:'isolated source API contract; browser binding tested separately, phone transport pending'}));

'use strict';
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'web/control-api.js'),'utf8'),context);
const rig=context.window.HalloweenSkullRig,scene=context.window.HalloweenSkullScene,golden=JSON.parse(fs.readFileSync(path.join(__dirname,'a-scene-golden.json'),'utf8'));let max=0,checks=0;
for(const row of golden.actors){const p=row.pose,result=rig.pose({headX:p.rotation[0],headY:p.rotation[1],headZ:p.rotation[2],jawPivotMode:1},0,p.jaw,p.position);for(const key of ['headWorld','jawWorld']){const error=Math.max(...result[key].map((v,i)=>Math.abs(v-row[key][i])));max=Math.max(max,error);assert.ok(error<3e-7,key+' actor '+row.index+': '+error);checks++;}}
const poses=JSON.parse(fs.readFileSync(path.join(__dirname,'a-scene-poses.json'),'utf8')),validated=scene.validate(poses);poses[0].position[0]=99;assert.equal(validated[0].position[0],-2);checks++;
const centers=scene.foreground(validated);assert.deepEqual(Array.from(centers,p=>p.circleActor),[0,2,4]);assert.deepEqual(Array.from(centers,p=>p.radialActor),[0,1,2]);checks+=2;
for(const bad of [[],new Array(5).fill(validated[0]),validated.map((p,i)=>i? p:{...p,jaw:91}),validated.map((p,i)=>i?p:{...p,position:[NaN,0,0]})]){assert.throws(()=>scene.validate(bad));checks++;}
console.log(JSON.stringify({passed:checks,failed:0,maxMatrixError:max,scope:golden.scope}));

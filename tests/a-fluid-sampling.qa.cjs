'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),context={window:{}};vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'web/a-fluid.js'),'utf8'),context);
const api=context.window.HalloweenAFluid,golden=JSON.parse(fs.readFileSync(path.join(__dirname,'a-fluid-sampling-golden.json'),'utf8')),f=Math.fround;
let max=0,values=0;
for(const row of golden.sampling){const [h,w,c]=row.shape,a=new Float32Array(row.input),dt=f(row.delta),[vx,vy]=row.velocity;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)for(let k=0;k<c;k++){
  const u=f(f((x+.5)/w)-f(f(dt*vx)*f(1/w))),v=f(f((y+.5)/h)-f(f(dt*vy)*f(1/h))),actual=f(api.sampleGrid(a,w,h,c,u,v,k)),error=Math.abs(actual-row.expected[(y*w+x)*c+k]);
  max=Math.max(max,error);values++;assert.ok(error<=1e-7,`${row.name} (${x},${y},${k}): ${error}`);
 }
}
// Arbitrary fractional coordinates must keep an interior constant exactly constant.
for(let i=0;i<256;i++){const v=api.sampleGrid(new Float32Array(16).fill(1),4,4,1,.26+i/1024,.47);assert.equal(v,1);}
let bodyMax=0;for(let i=0;i<golden.body.input.length;i++){const rgb=api.bodyColor(golden.body.input[i]);for(let k=0;k<3;k++)bodyMax=Math.max(bodyMax,Math.abs(rgb[k]-golden.body.expectedRGB[i*3+k]));}
assert.ok(bodyMax<=golden.body.toleranceBytes);assert.deepEqual(Array.from(api.bodyColor(-1)),[0,0,0]);assert.deepEqual(Array.from(api.bodyColor(2)),[0,68,255]);
console.log(JSON.stringify({passed:golden.sampling.length+256+3,failed:0,samplingCases:golden.sampling.length,samplingValues:values,maxSamplingError:max,bodyPixels:golden.body.input.length,maxBodyByteError:bodyMax,scope:'synthetic native sampling and partial HSV224 body branch; dynamic noise and final optics/text excluded'}));

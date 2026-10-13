// Native comparison metadata, without original geometry or screenshots.
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'web/control-api.js'),'utf8'),context);
const rig=context.window.HalloweenSkullRig,golden=JSON.parse(fs.readFileSync(path.join(__dirname,'skull-rig-golden.json'),'utf8')),checks=[];
const check=(name,ok,detail)=>checks.push({name,ok,detail}),error=(a,b)=>Math.max(...a.map((v,i)=>Math.abs(v-b[i])));
for(const row of golden.poses){
  const pose=rig.pose({headX:row.angles[0],headY:row.angles[1],headZ:row.angles[2],pivotY:-.75,pivotZ:-.12},0,row.jaw);
  for(const key of ['headWorld','jawWorld']){const max=error(pose[key],row[key]);check(row.name+' '+key+' matches native',max<2e-7,{max});}
}
check('closed body translation matches native registration',error(rig.registration.translation,golden.registration.translation)<1e-10);
const pivot=rig.pose({headX:0,headY:0,headZ:0,pivotY:-.75,pivotZ:-.12},0,0).jawPivot;
check('jaw pivot mapped independently from body position',error(pivot,golden.registration.candidateJawPivot)<1e-10&&Math.abs(pivot[1])>.4);
console.log(JSON.stringify({passed:checks.filter(c=>c.ok).length,failed:checks.filter(c=>!c.ok).length,checks}));
process.exitCode=checks.every(c=>c.ok)?0:1;

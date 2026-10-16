/* MIT code. owner-bat-atlas.png remains a separate private reference asset. */
'use strict';
window.HalloweenBatArt = (() => {
  const URL_PATH='./assets/owner-bat-atlas.png';
  const EXPECTED_SHA='9da78cbc8d5721f136f3385354ea94345f9fe5bdae4cc7ce5cc4e8f45d5a317a';
  const counts={requested:0,fetchPending:0,maxFetchPending:0,scopePending:0,created:0,closed:0,open:0,maxOpen:0,aborted:0,errors:0,fetchErrors:0};
  let encoded=null,job=null,warmup=null,released=false,lastError='';
  const transport=location.protocol==='file:'?'packaged-script':'same-origin-fetch';
  const owners=new Set();
  function startFetch() {
    const current={abort:new AbortController(),cancelled:false,promise:null};
    job=current;counts.requested++;counts.fetchPending++;
    counts.maxFetchPending=Math.max(counts.maxFetchPending,counts.fetchPending);
    current.promise=(async()=>{
      const timer=setTimeout(()=>current.abort.abort(),10000);
      try{
        let bytes;
        if(transport==='packaged-script'){
          if(!window.HalloweenBatAtlasData)throw Error('Packaged image data unavailable');
          bytes=window.HalloweenBatAtlasData.read();
          if(bytes.byteLength>131072)throw Error('Image too large');
        }else{
        const response=await fetch(URL_PATH,{signal:current.abort.signal,credentials:'same-origin',redirect:'error'});
        if(!response.ok||response.status!==200)throw Error('Image unavailable');
        const reader=response.body.getReader(),chunks=[];let size=0;
        while(true){const part=await reader.read();if(part.done)break;size+=part.value.byteLength;if(size>131072){await reader.cancel();throw Error('Image too large');}chunks.push(part.value);}
        bytes=new Uint8Array(size);let offset=0;for(const part of chunks){bytes.set(part,offset);offset+=part.byteLength;}
        }
        const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(b=>b.toString(16).padStart(2,'0')).join('');
        if(hash!==EXPECTED_SHA)throw Error('Image integrity mismatch');
        if(current.cancelled||released)return null;
        encoded=bytes;lastError='';return bytes;
      }catch(error){
        if(current.cancelled)return null;
        lastError=String(error?.message||error);counts.fetchErrors++;throw error;
      }finally{clearTimeout(timer);counts.fetchPending--;if(job===current)job=null;}
    })();
    return current;
  }
  async function readBytes(signal) {
    if(released||signal.aborted)return null;
    if(encoded)return encoded;
    const current=job||startFetch();
    const bytes=await current.promise;
    if(released||signal.aborted)return null;
    if(bytes)return bytes;
    // A live successor may retry after the cancelled predecessor has settled.
    if(current.cancelled)return readBytes(signal);
    return null;
  }
  function cancelPending() {
    warmup?.abort();warmup=null;
    if(job){job.cancelled=true;job.abort.abort();}
  }
  async function preload() {
    if(released)return false;
    if(encoded)return true;
    const own=new AbortController();warmup=own;
    try{return !!(await readBytes(own.signal));}catch(_){return false;}
    finally{if(warmup===own)warmup=null;}
  }
  function release() {for(const owner of [...owners])owner.dispose();cancelPending();encoded=null;window.HalloweenBatAtlasData?.release();released=true;}
  function create(notify) {
    let bitmap=null,disposed=false,state='loading';
    const abort=new AbortController();
    const scope={
      get ready(){return !!bitmap&&!disposed;},
      status(){return {state,ready:scope.ready,frames:60,width:160,height:90,source:'owner-cache-60-rgba-candidate'};},
      drawFrame(ctx,index,x,y,w,h){
        if(!scope.ready)return;
        const frame=Math.max(0,Math.min(59,Math.floor(index)));
        ctx.drawImage(bitmap,(frame%10)*160,Math.floor(frame/10)*90,160,90,x,y,w,h);
      },
      // World-space pose contract: final Rz in degrees, integer texture layer.
      // Motion/Noise, image index generation and later composition stay outside.
      drawInstances(ctx,poses,{width,height,orthowidth=1.26,rectangle=.24,size=1}){
        if(!scope.ready)return;
        const world=width/orthowidth,edge=rectangle*world*size;
        for(const p of poses){
          ctx.save();ctx.translate(width/2+p.tx*world,height/2-p.ty*world);
          ctx.rotate(-p.rz*Math.PI/180);ctx.scale(1,-1);
          scope.drawFrame(ctx,p.index,-edge/2,-edge/2,edge,edge);ctx.restore();
        }
      },
      dispose(){
        if(disposed)return;disposed=true;state='disposed';abort.abort();
        if(bitmap){bitmap.close();bitmap=null;counts.closed++;counts.open--;}
        owners.delete(scope);if(!owners.size)cancelPending();
      }
    };
    owners.add(scope);
    scope.readyPromise=Promise.resolve().then(async()=>{
      if(disposed)return false;
      counts.scopePending++;
      try{
        const bytes=await readBytes(abort.signal);
        if(!bytes||disposed){counts.aborted++;return false;}
        const candidate=await createImageBitmap(new Blob([bytes],{type:'image/png'}),{colorSpaceConversion:'none'});
        counts.created++;
        if(disposed){candidate.close();counts.closed++;return false;}
        if(candidate.width!==1600||candidate.height!==540){candidate.close();counts.closed++;throw Error('Image dimensions mismatch');}
        bitmap=candidate;counts.open++;counts.maxOpen=Math.max(counts.maxOpen,counts.open);state='ready';notify?.();return true;
      }catch(error){
        if(disposed||abort.signal.aborted){counts.aborted++;return false;}
        state='error';lastError=String(error?.message||error);counts.errors++;notify?.();return false;
      }finally{counts.scopePending--;}
    });
    return scope;
  }
  return Object.freeze({create,preload,cancelPending,release,diagnostics:()=>({...counts,pending:counts.fetchPending+counts.scopePending,encodedBytes:encoded?.byteLength||0,released,transport,lastError})});
})();

// MIT: locally measured circle-colour candidate, without altering the source atlas.
window.HalloweenBatComposite=(()=>{
 const counts={created:0,disposed:0,liveScopes:0,textures:0,programs:0,framebuffers:0,draws:0,failures:0};
 const vertex=`#version 300 es
 out vec2 uv;void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}`;
 const header=`#version 300 es
 precision highp float;uniform sampler2D image;uniform sampler2D glow;uniform vec2 size;uniform bool swapRB;in vec2 uv;out vec4 outputColor;
 vec4 at(vec2 delta){vec4 c=texture(image,uv+delta/size);return swapRB?c.bgra:c;}float grey(vec2 d){return dot(at(d).rgb,vec3(.299,.587,.114));}`;
 const colour=header+`void main(){vec4 s=at(vec2(0));
 float x=-grey(vec2(-1,-1))-2.*grey(vec2(-1,0))-grey(vec2(-1,1))+grey(vec2(1,-1))+2.*grey(vec2(1,0))+grey(vec2(1,1));
 float y=-grey(vec2(-1,-1))-2.*grey(vec2(0,-1))-grey(vec2(1,-1))+grey(vec2(-1,1))+2.*grey(vec2(0,1))+grey(vec2(1,1));
 // Strength 1.38; half-normalised Sobel is a measured approximation to TD Edge.
 float e=clamp(length(vec2(x,y))*.69,0.,1.);float b=.223+.777*s.b;
 vec3 body=vec3(.53,.53,1.)*b*s.a;
 outputColor=vec4(vec3(e)+body*(1.-e),e+s.a*s.a*(1.-e));}`;
 const blur=header+`void main(){vec4 c=vec4(0);for(int y=-1;y<=1;y++){for(int x=-1;x<=1;x++){
 float weight=float((x==0?2:1)*(y==0?2:1));c+=at(vec2(x,y)*4.)*weight;}}c/=16.;
 outputColor=vec4(pow(max(c.rgb*.89,vec3(0)),vec3(1./.41)),c.a);}`;
 const over=header+`void main(){vec4 c=at(vec2(0));vec4 g=texture(glow,uv);outputColor=c+g*(1.-c.a);}`;
 const copy=header+`void main(){outputColor=at(vec2(0));}`;
 function create(options={}){
  counts.created++;counts.liveScopes++;
  const canvas=document.createElement('canvas');let gl=null,disposed=false,error='',textures=[],programs=[],framebuffers=[],w=0,h=0;
  function compile(source,type){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){const error=gl.getShaderInfoLog(s);gl.deleteShader(s);throw Error(error);}return s;}
  function program(fragment){const v=compile(vertex,gl.VERTEX_SHADER),f=compile(fragment,gl.FRAGMENT_SHADER),p=gl.createProgram();gl.attachShader(p,v);gl.attachShader(p,f);gl.linkProgram(p);gl.deleteShader(v);gl.deleteShader(f);if(!gl.getProgramParameter(p,gl.LINK_STATUS)){gl.deleteProgram(p);throw Error('Colour program link failed');}programs.push(p);counts.programs++;return p;}
  function texture(){const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);textures.push(t);counts.textures++;return t;}
  function release(){if(!gl)return;for(const p of programs){gl.deleteProgram(p);counts.programs--;}for(const t of textures){gl.deleteTexture(t);counts.textures--;}for(const f of framebuffers){gl.deleteFramebuffer(f);counts.framebuffers--;}programs=[];textures=[];framebuffers=[];}
  try{gl=canvas.getContext('webgl2',{alpha:true,premultipliedAlpha:true,preserveDrawingBuffer:true,antialias:false,depth:false,stencil:false});if(!gl)throw Error('WebGL2 unavailable');
   for(const f of [colour,blur,over,copy])program(f);for(let i=0;i<3;i++)texture();for(let i=0;i<2;i++){framebuffers.push(gl.createFramebuffer());counts.framebuffers++;}
   gl.disable(gl.BLEND);gl.disable(gl.DEPTH_TEST);
  }catch(e){error='Colour candidate unavailable';counts.failures++;release();gl=null;}
  function target(i,width,height){gl.bindTexture(gl.TEXTURE_2D,textures[i+1]);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,width,height,0,gl.RGBA,gl.UNSIGNED_BYTE,null);gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffers[i]);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,textures[i+1],0);if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw Error('Colour framebuffer unavailable');}
  function pass(i,framebuffer,width,height,input){gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);gl.viewport(0,0,width,height);gl.useProgram(programs[i]);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,input);gl.uniform1i(gl.getUniformLocation(programs[i],'image'),0);gl.uniform2f(gl.getUniformLocation(programs[i],'size'),w,h);gl.uniform1i(gl.getUniformLocation(programs[i],'swapRB'),i===0&&options.swapRB!==false?1:0);if(i===2){gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,textures[2]);gl.uniform1i(gl.getUniformLocation(programs[i],'glow'),1);}gl.drawArrays(gl.TRIANGLES,0,3);}
  return {draw(source,stage='combined'){if(disposed||!gl||gl.isContextLost())return source;
    try{if(w!==source.width||h!==source.height){w=source.width;h=source.height;canvas.width=w;canvas.height=h;target(0,w,h);target(1,Math.max(1,Math.floor(w/4)),Math.max(1,Math.floor(h/4)));}
     gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,textures[0]);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);
     pass(0,framebuffers[0],w,h,textures[0]);pass(1,framebuffers[1],Math.max(1,Math.floor(w/4)),Math.max(1,Math.floor(h/4)),textures[1]);pass(stage==='color'?3:2,null,w,h,textures[1]);counts.draws++;return canvas;
    }catch(e){error='Colour candidate unavailable';counts.failures++;release();gl=null;return source;}},
   status:()=>({mode:gl&&!gl.isContextLost()?'source-circle-candidate':'original-atlas-fallback',error,width:w,height:h,channelInterpretation:options.swapRB===false?'native-RGBA-input':'source-BGRA-storage',edgeStrength:1.38,saturation:.47,blueLow:.223,blur:'quarter-same-frame-candidate',finalFireWrapMatched:false}),
   readPixels(){if(!gl)return null;const pixels=new Uint8Array(w*h*4);gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,pixels);return pixels;},
   dispose(){if(disposed)return;disposed=true;release();gl?.getExtension('WEBGL_lose_context')?.loseContext();gl=null;canvas.width=1;canvas.height=1;counts.liveScopes--;counts.disposed++;}
  };
 }
 return Object.freeze({create,diagnostics:()=>({...counts})});
})();

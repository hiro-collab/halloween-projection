/* MIT. Source operator order; noise and Blur TOP sampling remain candidates. */
'use strict';
window.HalloweenBatFire=(()=>{
 const counts={created:0,disposed:0,liveScopes:0,programs:0,textures:0,framebuffers:0,draws:0,failures:0};
 const vertex=`#version 300 es
 out vec2 uv;void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}`;
 const header=`#version 300 es
 precision highp float;uniform sampler2D image;uniform vec2 size;in vec2 uv;out vec4 outputColor;
 float luma(vec3 c){return dot(c,vec3(.2126,.7152,.0722));}`;
 const mask=header+`float weight(int i){return i==0?1.:abs(i)==1?.5625:-.0625;}
 void main(){vec3 c=vec3(0);for(int y=-2;y<=2;y++)for(int x=-2;x<=2;x++)c+=texture(image,uv+vec2(x,y)*12./size).rgb*weight(x)*weight(y)/4.;
 c=max(c,vec3(0));outputColor=vec4(clamp((c*2.-.5)*1.71+.5,0.,1.),clamp(luma(c),0.,1.));}`;
 const final=header+`uniform sampler2D maskImage;uniform sampler2D noiseImage;uniform sampler2D textImage;uniform bool hasNoise;uniform bool hasText;uniform float seconds;
 float hash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7))+1.)*43758.5453);}
 float field(vec3 p){vec3 a=floor(p),f=fract(p);f=f*f*(3.-2.*f);float c=0.;for(int z=0;z<2;z++)for(int y=0;y<2;y++)for(int x=0;x<2;x++){vec3 k=vec3(x,y,z);vec3 w=mix(1.-f,f,k);c+=hash(a+k)*w.x*w.y*w.z;}return c;}
 float candidateNoise(){vec3 p=vec3((uv-.5)*vec2(size.x/size.y,1.)/2.,seconds);float v=0.,a=1.,sum=0.;for(int i=0;i<4;i++){v+=field(p)*a;sum+=a;p*=1.7;a*=.5;}return clamp(pow(max(v/sum,0.),.21)*.55+.249,0.,1.);}
 vec3 hue(vec3 c){float hi=max(c.r,max(c.g,c.b)),lo=min(c.r,min(c.g,c.b)),d=hi-lo;if(d<.000001)return c;
 float h=hi==c.r?(c.g-c.b)/d:hi==c.g?2.+(c.b-c.r)/d:4.+(c.r-c.g)/d;h=fract(h/6.+76./360.);vec3 rgb=clamp(abs(fract(h+vec3(0.,2./3.,1./3.))*6.-3.)-1.,0.,1.);return (rgb*d+lo);}
 void main(){vec4 base=texture(image,uv);base.a=luma(base.rgb);vec4 m=texture(maskImage,uv);
 vec4 n=hasNoise?texture(noiseImage,uv):vec4(vec3(candidateNoise()),hash(vec3(floor(uv*size/4.),seconds)));
 vec4 tint=m*n;tint.rgb=hue(tint.rgb)*.5;vec4 c=base+tint*(1.-base.a);
 outputColor=c;}`;

 const copy=header+`void main(){outputColor=texture(image,uv);}`;
 // Original text branch: Res eighth -> 4x pre-shrink -> size21 Catmull
 // -> resize to eighth -> componentwise MIN -> brightness3/gamma2.02 -> back Over.
 const shrink=header+`void main(){vec4 c=vec4(0);for(int y=0;y<4;y++)for(int x=0;x<4;x++)c+=texture(image,uv+(vec2(x,y)-1.5)/size);outputColor=c/16.;}`;
 const textBlur=header+`uniform vec2 axis;
 const float weights[11]=float[11](0.08768642842497,0.08585711459323,0.08072801056620,0.07296994862017,0.06326861541451,0.05230867054402,0.04077455770284,0.02935081181772,0.01872392490276,0.00957783025612,0.00259733535834);
 void main(){vec4 c=texture(image,uv)*weights[0];for(int i=1;i<=10;i++){vec2 d=axis*float(i)/size;c+=(texture(image,uv+d)+texture(image,uv-d))*weights[i];}outputColor=c;}`;
 const textFinal=header+`uniform sampler2D broadImage;uniform sampler2D textImage;
 void main(){vec4 c=texture(image,uv),t=min(texture(broadImage,uv),texture(textImage,uv));
 t.rgb=pow(max(t.rgb*3.,vec3(0)),vec3(1./2.02));
 // Native TOP Over uses all channels directly, with foreground alpha clamped.
 outputColor=c+t*(1.-clamp(c.a,0.,1.));}`;
 function create({floatStages=false}={}){
  counts.created++;counts.liveScopes++;const canvas=document.createElement('canvas');let gl=null,disposed=false,w=0,h=0,error='',programs=[],textures=[],fbos=[],sizes=[];
  function release(){if(!gl)return;for(const p of programs){gl.deleteProgram(p);counts.programs--;}for(const t of textures){gl.deleteTexture(t);counts.textures--;}for(const f of fbos){if(f){gl.deleteFramebuffer(f);counts.framebuffers--;}}programs=[];textures=[];fbos=[];sizes=[];}
  function shader(code,type){const x=gl.createShader(type);gl.shaderSource(x,code);gl.compileShader(x);if(!gl.getShaderParameter(x,gl.COMPILE_STATUS)){gl.deleteShader(x);throw Error('Fire shader unavailable');}return x;}
  try{
   gl=canvas.getContext('webgl2',{alpha:true,premultipliedAlpha:true,preserveDrawingBuffer:true,antialias:false,depth:false,stencil:false});if(!gl)throw Error('WebGL2 unavailable');
   if(floatStages&&(!gl.getExtension('EXT_color_buffer_float')||!gl.getExtension('OES_texture_float_linear')))throw Error('Float stage QA unavailable');
   for(const fragment of [mask,final,copy,shrink,textBlur,textFinal]){const v=shader(vertex,gl.VERTEX_SHADER),f=shader(fragment,gl.FRAGMENT_SHADER),p=gl.createProgram();gl.attachShader(p,v);gl.attachShader(p,f);gl.linkProgram(p);gl.deleteShader(v);gl.deleteShader(f);if(!gl.getProgramParameter(p,gl.LINK_STATUS)){gl.deleteProgram(p);throw Error('Fire program unavailable');}programs.push(p);counts.programs++;}
   for(let i=0;i<10;i++){const t=gl.createTexture();textures.push(t);counts.textures++;gl.bindTexture(gl.TEXTURE_2D,t);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);if(i!==0&&i!==2&&i!==3){fbos[i]=gl.createFramebuffer();counts.framebuffers++;}}
   gl.disable(gl.BLEND);gl.disable(gl.DEPTH_TEST);
  }catch(e){error='Fire candidate unavailable';counts.failures++;release();gl=null;}
  function upload(i,source,premultiplied=false){gl.activeTexture(gl.TEXTURE0+i);gl.bindTexture(gl.TEXTURE_2D,textures[i]);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,premultiplied);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);}
  function target(i,tw,th){sizes[i]=[tw,th];gl.bindTexture(gl.TEXTURE_2D,textures[i]);gl.texImage2D(gl.TEXTURE_2D,0,floatStages?gl.RGBA32F:gl.RGBA8,tw,th,0,gl.RGBA,floatStages?gl.FLOAT:gl.UNSIGNED_BYTE,null);gl.bindFramebuffer(gl.FRAMEBUFFER,fbos[i]);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,textures[i],0);if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw Error('Fire framebuffer unavailable');}
  function allocate(){canvas.width=w;canvas.height=h;const ew=Math.max(1,Math.floor(w/8)),eh=Math.max(1,Math.floor(h/8)),sw=Math.max(1,Math.floor(ew/4)),sh=Math.max(1,Math.floor(eh/4));target(1,Math.max(1,w>>2),Math.max(1,h>>2));target(4,w,h);target(5,ew,eh);for(const i of [6,7,8])target(i,sw,sh);target(9,ew,eh);}
  function use(program,input){const p=programs[program];gl.useProgram(p);for(const [unit,name] of [[0,'image'],[1,'maskImage'],[2,'noiseImage'],[3,'textImage'],[9,'broadImage']]){gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,unit===0?textures[input]:textures[unit]);gl.uniform1i(gl.getUniformLocation(p,name),unit);}const sourceSize=sizes[input]??[w,h];gl.uniform2f(gl.getUniformLocation(p,'size'),...sourceSize);return p;}
  function pass(program,input,output,configure){gl.bindFramebuffer(gl.FRAMEBUFFER,output===null?null:fbos[output]);gl.viewport(0,0,...(output===null?[w,h]:sizes[output]));const p=use(program,input);configure?.(p);gl.drawArrays(gl.TRIANGLES,0,3);}
  function tiny(i){gl.activeTexture(gl.TEXTURE0+i);gl.bindTexture(gl.TEXTURE_2D,textures[i]);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array(4));}
  return {
   draw(source,{seconds=0,text=null,noise=null,mask=null,premultipliedInput=false,stage='combined'}={}){
    if(disposed||!gl||gl.isContextLost())return source;
    try{
     if(w!==source.width||h!==source.height){w=source.width;h=source.height;allocate();}
     upload(0,source,premultipliedInput);sizes[0]=[w,h];if(mask)upload(1,mask);else pass(0,0,1);
     if(noise)upload(2,noise);else tiny(2);if(text)upload(3,text);else tiny(3);
     if(stage==='text')pass(2,0,4);else pass(1,0,4,p=>{gl.uniform1i(gl.getUniformLocation(p,'hasNoise'),noise?1:0);gl.uniform1f(gl.getUniformLocation(p,'seconds'),seconds);});
     if(text){
      pass(2,4,5);pass(3,5,6);
      pass(4,6,7,p=>gl.uniform2f(gl.getUniformLocation(p,'axis'),1,0));
      pass(4,7,8,p=>gl.uniform2f(gl.getUniformLocation(p,'axis'),0,1));
      pass(2,8,9);pass(5,4,null);
     }else pass(2,4,null);
     counts.draws++;return canvas;
    }catch(e){error='Fire candidate unavailable';counts.failures++;release();gl=null;return source;}
   },
   status:()=>({mode:gl&&!gl.isContextLost()?'source-fire-operator-candidate':'circle-only-fallback',error,width:w,height:h,noise:'continuous coherent comparison Noise',blur:'fire mask: quarter Catmull sampling candidate',text:'selected fire input -> eighth -> preshrink4 Catmull21 -> RGBA minimum -> brightness3/gamma2.02 -> behind Over',textKernel:'fixed native spatial coefficients; no recorded motion',textResolution:sizes[5]??null,textPreshrinkResolution:sizes[6]??null,alpha:'RGBA TOP math preserved; text alpha is filtered alpha, not replacement luminance',matched:false}),
   readPixels(){if(!gl)return null;gl.bindFramebuffer(gl.FRAMEBUFFER,null);const bytes=new Uint8Array(w*h*4);gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,bytes);return bytes;},
   readStage(name){if(!gl)return null;const index={fire:4,eighth:5,preshrink:6,blurHorizontal:7,blur:8,broad:9}[name];if(index===undefined)return null;const [width,height]=sizes[index];gl.bindFramebuffer(gl.FRAMEBUFFER,fbos[index]);const pixels=floatStages?new Float32Array(width*height*4):new Uint8Array(width*height*4);gl.readPixels(0,0,width,height,gl.RGBA,floatStages?gl.FLOAT:gl.UNSIGNED_BYTE,pixels);return {width,height,pixels};},
   dispose(){if(disposed)return;disposed=true;release();gl?.getExtension('WEBGL_lose_context')?.loseContext();gl=null;canvas.width=1;canvas.height=1;counts.liveScopes--;counts.disposed++;}
  };
 }
 return Object.freeze({create,diagnostics:()=>({...counts})});
})();

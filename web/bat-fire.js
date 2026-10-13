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
 if(hasText){float glyph=texture(textImage,uv).a;vec4 broad=vec4(0);for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++)broad+=texture(image,uv+vec2(x,y)*64./size)/9.;broad.a=luma(broad.rgb);
 vec4 t=min(broad,vec4(glyph));t.rgb=pow(max(t.rgb*3.,vec3(0)),vec3(1./2.02));c+=t*(1.-c.a);}
 outputColor=c;}`;
 function create(){
  counts.created++;counts.liveScopes++;const canvas=document.createElement('canvas');let gl=null,disposed=false,w=0,h=0,error='',programs=[],textures=[],fbo=null;
  function release(){if(!gl)return;for(const p of programs){gl.deleteProgram(p);counts.programs--;}for(const t of textures){gl.deleteTexture(t);counts.textures--;}if(fbo){gl.deleteFramebuffer(fbo);counts.framebuffers--;fbo=null;}programs=[];textures=[];}
  function shader(code,type){const s=gl.createShader(type);gl.shaderSource(s,code);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){gl.deleteShader(s);throw Error('Fire shader unavailable');}return s;}
  try{gl=canvas.getContext('webgl2',{alpha:true,premultipliedAlpha:true,preserveDrawingBuffer:true,antialias:false,depth:false,stencil:false});if(!gl)throw Error('WebGL2 unavailable');
   for(const fragment of [mask,final]){const v=shader(vertex,gl.VERTEX_SHADER),f=shader(fragment,gl.FRAGMENT_SHADER),p=gl.createProgram();gl.attachShader(p,v);gl.attachShader(p,f);gl.linkProgram(p);gl.deleteShader(v);gl.deleteShader(f);if(!gl.getProgramParameter(p,gl.LINK_STATUS)){gl.deleteProgram(p);throw Error('Fire program unavailable');}programs.push(p);counts.programs++;}
   for(let i=0;i<4;i++){const t=gl.createTexture();textures.push(t);counts.textures++;gl.bindTexture(gl.TEXTURE_2D,t);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);}
   fbo=gl.createFramebuffer();counts.framebuffers++;gl.disable(gl.BLEND);gl.disable(gl.DEPTH_TEST);
  }catch(e){error='Fire candidate unavailable';counts.failures++;release();gl=null;}
  function upload(i,source,premultiplied=false){gl.activeTexture(gl.TEXTURE0+i);gl.bindTexture(gl.TEXTURE_2D,textures[i]);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,premultiplied);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);}
  function use(i){const p=programs[i];gl.useProgram(p);gl.uniform2f(gl.getUniformLocation(p,'size'),w,h);for(const [unit,name] of ['image','maskImage','noiseImage','textImage'].entries()){gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,textures[unit]);gl.uniform1i(gl.getUniformLocation(p,name),unit);}return p;}
  return {draw(source,{seconds=0,text=null,noise=null,mask=null,premultipliedInput=false}={}){if(disposed||!gl||gl.isContextLost())return source;
   try{if(w!==source.width||h!==source.height){w=source.width;h=source.height;canvas.width=w;canvas.height=h;gl.bindTexture(gl.TEXTURE_2D,textures[1]);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,Math.max(1,w>>2),Math.max(1,h>>2),0,gl.RGBA,gl.UNSIGNED_BYTE,null);gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,textures[1],0);if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw Error('Fire framebuffer unavailable');}
    upload(0,source,premultipliedInput);if(mask)upload(1,mask);else{gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);gl.viewport(0,0,Math.max(1,w>>2),Math.max(1,h>>2));use(0);gl.drawArrays(gl.TRIANGLES,0,3);}
    if(noise)upload(2,noise);else{gl.activeTexture(gl.TEXTURE2);gl.bindTexture(gl.TEXTURE_2D,textures[2]);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array(4));}
    if(text)upload(3,text);else{gl.activeTexture(gl.TEXTURE3);gl.bindTexture(gl.TEXTURE_2D,textures[3]);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array(4));}
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,w,h);const p=use(1);gl.uniform1i(gl.getUniformLocation(p,'hasNoise'),noise?1:0);gl.uniform1i(gl.getUniformLocation(p,'hasText'),text?1:0);gl.uniform1f(gl.getUniformLocation(p,'seconds'),seconds);gl.drawArrays(gl.TRIANGLES,0,3);counts.draws++;return canvas;
   }catch(e){error='Fire candidate unavailable';counts.failures++;release();gl=null;return source;}},
   status:()=>({mode:gl&&!gl.isContextLost()?'source-fire-operator-candidate':'circle-only-fallback',error,width:w,height:h,noise:'coherent-value-candidate; original simplex3d not matched',blur:'quarter Catmull sampling candidate',hueOffset:-284,valueMultiplier:.5,text:'minimum / brightness 3 / gamma 2.02 / behind fire candidate',matched:false}),
   readPixels(){if(!gl)return null;const bytes=new Uint8Array(w*h*4);gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,bytes);return bytes;},
   dispose(){if(disposed)return;disposed=true;release();gl?.getExtension('WEBGL_lose_context')?.loseContext();gl=null;canvas.width=1;canvas.height=1;counts.liveScopes--;counts.disposed++;}
  };
 }
 return Object.freeze({create,diagnostics:()=>({...counts})});
})();

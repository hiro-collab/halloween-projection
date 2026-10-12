/* MIT code. owner-bat-atlas.png remains a separate private reference asset. */
'use strict';
window.HalloweenBatArt = (() => {
  const URL_PATH='./assets/owner-bat-atlas.png';
  const EXPECTED_SHA='9da78cbc8d5721f136f3385354ea94345f9fe5bdae4cc7ce5cc4e8f45d5a317a';
  const counts={requested:0,fetchPending:0,maxFetchPending:0,scopePending:0,created:0,closed:0,open:0,maxOpen:0,aborted:0,errors:0,fetchErrors:0};
  let encoded=null,job=null,warmup=null,released=false;
  const owners=new Set();
  function startFetch() {
    const current={abort:new AbortController(),cancelled:false,promise:null};
    job=current;counts.requested++;counts.fetchPending++;
    counts.maxFetchPending=Math.max(counts.maxFetchPending,counts.fetchPending);
    current.promise=(async()=>{
      const timer=setTimeout(()=>current.abort.abort(),10000);
      try{
        const response=await fetch(URL_PATH,{signal:current.abort.signal,credentials:'same-origin',redirect:'error'});
        if(!response.ok||response.status!==200)throw Error('Image unavailable');
        const reader=response.body.getReader(),chunks=[];let size=0;
        while(true){const part=await reader.read();if(part.done)break;size+=part.value.byteLength;if(size>131072){await reader.cancel();throw Error('Image too large');}chunks.push(part.value);}
        const bytes=new Uint8Array(size);let offset=0;for(const part of chunks){bytes.set(part,offset);offset+=part.byteLength;}
        const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(b=>b.toString(16).padStart(2,'0')).join('');
        if(hash!==EXPECTED_SHA)throw Error('Image integrity mismatch');
        if(current.cancelled||released)return null;
        encoded=bytes;return bytes;
      }catch(error){
        if(current.cancelled)return null;
        counts.fetchErrors++;throw error;
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
  function release() {for(const owner of [...owners])owner.dispose();cancelPending();encoded=null;released=true;}
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
        state='error';counts.errors++;notify?.();return false;
      }finally{counts.scopePending--;}
    });
    return scope;
  }
  return Object.freeze({create,preload,cancelPending,release,diagnostics:()=>({...counts,pending:counts.fetchPending+counts.scopePending,encodedBytes:encoded?.byteLength||0,released})});
})();

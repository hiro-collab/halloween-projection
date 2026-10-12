/* MIT code. owner-bat-atlas.png is a separate private reference asset. */
'use strict';
window.HalloweenBatArt = (() => {
  const URL_PATH='./assets/owner-bat-atlas.png';
  const EXPECTED_SHA='9da78cbc8d5721f136f3385354ea94345f9fe5bdae4cc7ce5cc4e8f45d5a317a';
  const counts={requested:0,pending:0,created:0,closed:0,open:0,maxOpen:0,aborted:0,errors:0};
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
      }
    };
    scope.readyPromise=Promise.resolve().then(async()=>{
      if(disposed)return false;
      counts.requested++;counts.pending++;
      const timer=setTimeout(()=>abort.abort(),10000);
      try{
        const response=await fetch(URL_PATH,{signal:abort.signal,credentials:'same-origin',redirect:'error'});
        if(!response.ok||response.status!==200)throw Error('Image unavailable');
        const reader=response.body.getReader(),chunks=[];let size=0;
        while(true){const part=await reader.read();if(part.done)break;size+=part.value.byteLength;if(size>131072){await reader.cancel();throw Error('Image too large');}chunks.push(part.value);}
        if(disposed)return false;
        const bytes=new Uint8Array(size);let offset=0;for(const part of chunks){bytes.set(part,offset);offset+=part.byteLength;}
        const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(b=>b.toString(16).padStart(2,'0')).join('');
        if(hash!==EXPECTED_SHA)throw Error('Image integrity mismatch');
        if(disposed)return false;
        const candidate=await createImageBitmap(new Blob([bytes],{type:'image/png'}),{colorSpaceConversion:'none'});
        counts.created++;
        if(disposed){candidate.close();counts.closed++;return false;}
        if(candidate.width!==1600||candidate.height!==540){candidate.close();counts.closed++;throw Error('Image dimensions mismatch');}
        bitmap=candidate;counts.open++;counts.maxOpen=Math.max(counts.maxOpen,counts.open);state='ready';notify?.();return true;
      }catch(error){
        if(disposed||abort.signal.aborted){counts.aborted++;return false;}
        state='error';counts.errors++;notify?.();return false;
      }finally{clearTimeout(timer);counts.pending--;}
    });
    return scope;
  }
  return Object.freeze({create,diagnostics:()=>({...counts})});
})();

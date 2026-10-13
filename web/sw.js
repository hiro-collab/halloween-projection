'use strict';
const BUILD = "0.1.16-a-integrated-preview-b44e3615c262";
const HASHES = {
  "index.html": "72ee9447d0aaaa0b17fe4fafb3ec45d810ff59439d63f25364f360797563dc60",
  "styles.css": "b947e782dd131e0bfa50764bfed104853d22d6eadf357e1b4d3c5980cb4f2e4e",
  "app.js": "e5f86992728c46d5bb2dad615d8b3f12e3f1e314cba2eb508158b6a8a7e8d918",
  "offline.js": "da2e4fc3eb2b7785d63128f3b8dabba86ea09bdd8091502e06bcc25ccd0e28b4",
  "README.txt": "30a1a0f965fb9cf0be839f56eaec94869f379c5c8106b3de703bd26ccb2b0cc7",
  "LICENSE.txt": "a643b7235f6eeb00fdf602e729cb4b88a8f7984e7dab0bc3f5993dd5c25a95bd",
  "RIGHTS.txt": "87b231f4912c9fdd1d7e3edf02b52874ef869a8484dc92cce5e608a4dade0392",
  "control-api.js": "78a246331cd12b4eae8c6b963db4b0dba7b7d94e1be82e66c82873afd987dfcb",
  "bat-motion.js": "4fdc3410a3c236e6bfa4d381b5f88e73cd7e4b1e38d7308bdc7fe368a397bcc8",
  "bat-art.js": "a00c271c1e50d61578b510e928927e13d0658761d4b190b706ede634e0ae1da9",
  "bat-fire.js": "ab11a863b3cd540ac444bcbabe1c796ed4ffc5ad5c74a56a0de763eace8a861a",
  "a-fluid.js": "adfd53b80ab9bab8e15c5de9dc3455777878b87291147eafc923aaf91635868c",
  "a-composite.js": "f2047335fa94ea24b7ad8d8459ff3e393f49bfe6cf0cc180a3e4d71c83395220",
  "assets/owner-bat-atlas.png": "9da78cbc8d5721f136f3385354ea94345f9fe5bdae4cc7ce5cc4e8f45d5a317a",
  "assets/OWNER-BAT-ASSET.txt": "1c87dd8e950d7070b54608917fb4e9aae44abcbdb070e92d60b3bb784c6b9379"
};
const SCOPE = self.registration.scope;
const PREFIX = 'halloween-projection:' + SCOPE + ':';
const CACHE = PREFIX + BUILD;
const URLS = new Map(Object.keys(HASHES).map(name => [new URL(name, SCOPE).href, name]));
const INDEX = new URL('index.html', SCOPE).href;
function assetURL(url) {
  const u = new URL(url);
  if (u.origin !== new URL(SCOPE).origin || u.search) return null;
  return u.href === SCOPE ? INDEX : URLS.has(u.href) ? u.href : null;
}
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    try {
      for (const [url, name] of URLS) {
        const abort = new AbortController();
        const timer = setTimeout(() => abort.abort(), 10000);
        let response, data;
        try {
          response = await fetch(new Request(url, {cache:'reload', credentials:'same-origin', redirect:'error', signal:abort.signal}));
          if (!response.ok || response.status !== 200) throw Error('Static asset unavailable');
          const reader = response.clone().body.getReader();
          const chunks=[]; let size=0;
          while (true) {
            const part=await reader.read();
            if (part.done) break;
            size+=part.value.byteLength;
            if (size>262144) { await reader.cancel(); throw Error('Static asset exceeds limit'); }
            chunks.push(part.value);
          }
          const bytes=new Uint8Array(size);let offset=0;
          for (const chunk of chunks) { bytes.set(chunk,offset);offset+=chunk.byteLength; }
          data=bytes.buffer;
        } finally { clearTimeout(timer); }
        if (data.byteLength > 262144) throw Error('Static asset exceeds limit');
        const digest = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', data))).map(b => b.toString(16).padStart(2,'0')).join('');
        if (digest !== HASHES[name]) throw Error('Static asset integrity mismatch');
        await cache.put(url, response);
      }
    } catch (error) { await caches.delete(CACHE); throw error; }
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    await Promise.all((await caches.keys()).filter(k => k.startsWith(PREFIX) && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = assetURL(event.request.url);
  if (!url) return;
  event.respondWith((async () => {
    if (!(await caches.has(CACHE))) return fetch(event.request);
    const response = await (await caches.open(CACHE)).match(url);
    return response || new Response('オフライン保存が見つかりません。接続してページを開き直してください。', {status:503, headers:{'Content-Type':'text/plain; charset=utf-8'}});
  })());
});
self.addEventListener('message', event => {
  if (!event.source?.url || !assetURL(event.source.url)) return;
  if (event.data?.type === 'APPLY_UPDATE') { event.waitUntil(self.skipWaiting()); return; }
  if (event.data?.type === 'STATUS') {
    event.waitUntil((async () => {
      if (!(await caches.has(CACHE))) { event.ports[0]?.postMessage({ok:false}); return; }
      const cache = await caches.open(CACHE);
      const ready = (await cache.keys()).length === URLS.size;
      event.ports[0]?.postMessage({ok:ready, build:BUILD});
    })());
  }
});

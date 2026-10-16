'use strict';
const BUILD = "0.1.39-spatial-turbulence-preview-6ca184fe558d";
const HASHES = {
  "index.html": "2db5bd3348da6a31dbfbc63bcf5e15d85e1d86624eee225d5ff1741f25998133",
  "styles.css": "d4e5def090e660ac384b9abad6551e8d317e6d62749af9fd551c639bac364fee",
  "app.js": "54aac4bb659b885398799804f9bc8ed891af081c2908d3e8c767675c95053600",
  "offline.js": "2b41b9ffa882dad76ca179f8dea1118fff1ae451800563547e88e1de1def13aa",
  "README.txt": "79748b2c16b1b9d5e5b3f403fe0a0854cee9da5e4d7a73f52c16a13c42b99b86",
  "console.html": "8fc2ab541e40e2a45e0c8b41707c19e9430076291e4f79d9cbaba9d11b4e5aad",
  "console.css": "ec659c015f1c01b9730287d85a52110cedd68c3b7b69dd408c64cabff6b31e3f",
  "console.js": "ff97acedd4976bc8cbfcee7e736f6549c55ecfb02e93b051a36dceb48c460659",
  "stage-role.js": "2324a1b5784ac08a949953760c70bf07bfe2d17eb1be3656fbfdd98f5a5f8f67",
  "stage-receiver.js": "405e0d0cc50839267c59217fd3497464c3dfbfc3334a226ba581306cf5dd2438",
  "performance-api.js": "cb7d8dc8b6bbde1157091aaa753d3b047cab6d92ade478f427f31e1d542c2fab",
  "keyboard-performance.js": "968b16413c0114d1f495c247908c6394d97ea21b507876c4d6824be12412464f",
  "window-safety.js": "08e04346e0bed71048ca73b23a06d7b1f92fa09faf7e3f9204b4427e117b1d83",
  "START-HERE.html": "f6cd4ffe6759c84a575e03f16042551967cb8d8eb21bab493834876b0e04be06",
  "GUIDE.html": "883034b781fff2015bb71178b4ce3b103804eb9638f78af487d66c0fc0d0d6a0",
  "PERFORMANCE-PLAN.html": "323e3b4b306c02834486abc5e1669314d247db83f2df85d4f3ac4fd122c6327e",
  "guide.css": "9eb7ca9b0e43321b519b6b29363e5a626a621dcf6619ff70f1d5cbab5dd21c83",
  "LICENSE.txt": "a643b7235f6eeb00fdf602e729cb4b88a8f7984e7dab0bc3f5993dd5c25a95bd",
  "RIGHTS.txt": "9310f91a30532b614b9a3cc492f041e3b1dc3b55fe77f19511ba1509d111b7c9",
  "motion-clock.js": "52fcea2e517c25c89a9b525843d43f088f1f9ffcae0b94d6b83b21f3faf5083c",
  "control-response.js": "a6c1cc00d6d4a0eafbb0ea2af6a7a1ea0a6273e285c7014721694fa6a2e9a954",
  "a-source-blur.js": "321d86574d83503fdc4431813de60de8fe67647663a52da574fcf6788d95ba49",
  "a-motion-lag.js": "7466b1bd00fae5757448f1785151cbc9ca8ef3d0ae8fe1eeb806baab83c524ba",
  "a-motion.js": "45ed4b9b2ab06c8f9feabe47a62156bad8a9c391d9808f2168ec5d4a28984f6d",
  "a-skull-raster.js": "2f36f07ae335d8d53d2bb573388a26f2587de628b056b6c029e901454bfb72c2",
  "control-api.js": "3491dcc00eabb388e8fd0e24097b2a56bd61f19d5d33d2c11246d3bfa1ea62e0",
  "text-operators.js": "cae2c3186e9e588d7eb8878996437e6c8dd195c4bf038933fc22a0276405707a",
  "app-control-api.js": "923b7bc4578a616ce6a500a2793c5f79dfe76440d89a4d42e57aa6184696d366",
  "control-adapters.js": "c5c2c272c8ea0d3334213b0a2b595321fea146bfcae140441c1df51b793d7b5d",
  "bat-motion.js": "4c6a92858633499f9b8392c61e79d3ceb02b7b550156a47d2bf4ffb958e4ae28",
  "bat-phase.js": "b92f78f1bf2a3be283156cc193dee1560a9527428c1938a51c4c7ca4b8884961",
  "b-motion-runtime.js": "0ce6efead0a507b669935e1cc79f066d450c152334b99724d3b80c5c8dea7139",
  "bat-art.js": "296447deb08c1abd113b1b26bdd29ccf62542bc22edd8c97791ae0609498e3dc",
  "bat-atlas-data.js": "9dd654e2c6bd36e6f50d96cc412840da8aea614e7010ce03c900dae7de71caf0",
  "bat-fire.js": "be398b01f41e675cb8653f267a600843b3bf4bb0d64e98bb7b9e971df86905df",
  "text-sequence.js": "0479ed104d7171d58a13bd0dd305326b2e827542de338601985f726687d64835",
  "output-uv.js": "3f8eb08c52142de86626e9b558c835644a046611897122fc59fd547caa1871f7",
  "output-operators.js": "948b2d2d40c996c67eb949b60d270d1e47ad4b5874cde5eca6b03a054e187dde",
  "a-source-noise.js": "6555f43b09f21d11ebcb821c2170fc987e2a9ae615cc7c1bd389952c45a9bbeb",
  "a-fluid.js": "3b55a7d2d5516b35ebf2eb743914cd7be1a742f3b400f7b203052aa796937b44",
  "a-composite.js": "df3fe82340dccb214db37f4e4c5f7933778f2631f50e1d14f71396dc864d57b4",
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

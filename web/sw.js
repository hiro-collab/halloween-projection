'use strict';
const BUILD = "0.1.52-install-guide-preview-87c3741f9ba6";
const HASHES = {
  "index.html": "4d1db3ccecf7f75e8713e3b15a4110f7f3e1203fe289a6a4d724cfeb18b1230d",
  "styles.css": "d4e5def090e660ac384b9abad6551e8d317e6d62749af9fd551c639bac364fee",
  "app.js": "d456c5c23b3ab325335228e905e8b8ea5ccd1c38b7f001f859c13bf995aa0729",
  "offline.js": "8cdb2898712173809fcc8b365fc2a81072f3052526f6a470448be1aac0a7126c",
  "README.txt": "a6957c2a0bf178827db975671683c39f5866b6602758c7313b10704892ec77b9",
  "console.html": "78d7dc17655ddb63495fcf1a9d539dade17964fa183d908870f7e31a3cc2d9ca",
  "console.css": "60923926e05558a9ad43c1393a25e07e17e4dd3075bceed32ac4de9740d7b412",
  "console.js": "605c9b104cd80e5811916e702a02a01e05c58269978d9e94be6f68be089420ec",
  "stage-role.js": "2324a1b5784ac08a949953760c70bf07bfe2d17eb1be3656fbfdd98f5a5f8f67",
  "stage-receiver.js": "d64442b9d2c5f50938b2d67f0f9ac333ac486a9871789e1bbd84656f88ebfc91",
  "performance-api.js": "57dbae094848768e819255a8b98f6fcf361fe9515d004c9dfbb5ee43a26d8859",
  "keyboard-performance.js": "59e0b64e6ae66418ddc37ee7f3db73803e905f239a39c06587521dfd963fa80e",
  "window-safety.js": "08e04346e0bed71048ca73b23a06d7b1f92fa09faf7e3f9204b4427e117b1d83",
  "START-HERE.html": "4ced3eeed3f9cb436216c115517d75ab01ae59fc7ba2905993bf17daf847e97a",
  "GUIDE.html": "91e668b6def76c4c9b4cc0a42e059075e261a1df2b05291238068b614674680b",
  "PERFORMANCE-PLAN.html": "33fb9be0a1ee1704ec80fe031bd4f9927eefdc0965292e90174812e78965ffab",
  "guide.css": "d4f94d33b312751889fa8d48bf166bf31c8081788a8f599ebb7f36847e52e91b",
  "LICENSE.txt": "a643b7235f6eeb00fdf602e729cb4b88a8f7984e7dab0bc3f5993dd5c25a95bd",
  "RIGHTS.txt": "ce7a1deb21bcc42ce45d9f785e312f33389bba9327c77b1d29d78e6af1d2221b",
  "motion-clock.js": "52fcea2e517c25c89a9b525843d43f088f1f9ffcae0b94d6b83b21f3faf5083c",
  "control-response.js": "a6c1cc00d6d4a0eafbb0ea2af6a7a1ea0a6273e285c7014721694fa6a2e9a954",
  "a-source-blur.js": "321d86574d83503fdc4431813de60de8fe67647663a52da574fcf6788d95ba49",
  "a-motion-lag.js": "7466b1bd00fae5757448f1785151cbc9ca8ef3d0ae8fe1eeb806baab83c524ba",
  "a-motion.js": "45ed4b9b2ab06c8f9feabe47a62156bad8a9c391d9808f2168ec5d4a28984f6d",
  "a-actor-layout.js": "8c0f839ed94fa18b0e929182869e6d02d5b73eaf0fea02424a7aeafabd613a2f",
  "a-skull-raster.js": "2f36f07ae335d8d53d2bb573388a26f2587de628b056b6c029e901454bfb72c2",
  "control-api.js": "390cb2eecfcd8b6bc0cffacbb2957c4a221ca42fa029e0b89fd64f9a9752297f",
  "text-operators.js": "cae2c3186e9e588d7eb8878996437e6c8dd195c4bf038933fc22a0276405707a",
  "app-control-api.js": "4108256de8859bdbf1a19da96fae3151a23e41c6c5b09132cf71709e597095f1",
  "control-adapters.js": "2b861abb80f04fc743b00839e332639a4c0551640bc082ae5325be725400c87b",
  "bat-motion.js": "4c6a92858633499f9b8392c61e79d3ceb02b7b550156a47d2bf4ffb958e4ae28",
  "bat-phase.js": "b92f78f1bf2a3be283156cc193dee1560a9527428c1938a51c4c7ca4b8884961",
  "b-motion-runtime.js": "0ce6efead0a507b669935e1cc79f066d450c152334b99724d3b80c5c8dea7139",
  "bat-art.js": "cf0a608f3c3c79ddd688a2e7d82f56345356c307d8e6f0c761cc0cbc7736bfa8",
  "bat-atlas-data.js": "9dd654e2c6bd36e6f50d96cc412840da8aea614e7010ce03c900dae7de71caf0",
  "bat-fire.js": "be398b01f41e675cb8653f267a600843b3bf4bb0d64e98bb7b9e971df86905df",
  "text-sequence.js": "0479ed104d7171d58a13bd0dd305326b2e827542de338601985f726687d64835",
  "output-uv.js": "3f8eb08c52142de86626e9b558c835644a046611897122fc59fd547caa1871f7",
  "output-operators.js": "948b2d2d40c996c67eb949b60d270d1e47ad4b5874cde5eca6b03a054e187dde",
  "a-source-noise.js": "6555f43b09f21d11ebcb821c2170fc987e2a9ae615cc7c1bd389952c45a9bbeb",
  "a-fluid.js": "4d620536e1c550a49634e5ea21f64ef1a908a9374be6336fdfb8f16b1af9105f",
  "a-composite.js": "20d6839197bb59d4d5da763b81269a31210fef68b2f7b2c94d0e628ed3283bb7",
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

'use strict';
const BUILD = "0.1.55-jaw-edge-preview-b835b1dc65dc";
const HASHES = {
  "index.html": "d28c79619283b05c38b72a31a78bf4e5f5f40f4d6ab45dbadfdf6bb7c9afa94a",
  "styles.css": "f22326303cfde63790650c60acd7c1d576bcb3c0177412887b9f47d000f93d7c",
  "app.js": "1a3b3632ef36ce97405884fd8763766f71b3a86961eae08072dde5f7a9afdd46",
  "offline.js": "6e1875ea2feab8a8907add195906eae18bbb9fc67fa1622a82fae79ffc236707",
  "README.txt": "5a1033315e9d6c968f5b5123e7771ded93509eeb89e64180249b8ffc6f43d94f",
  "console.html": "8fd3716c3bba681dbba0ec77b137e699173f62904f5d44ab7d647396ca5520d3",
  "console.css": "1ef68b02708f001a9eb90fc12342f1edb7aae6f0a3a6fa03dd12684ff08e525b",
  "console.js": "2c866d3b1259e624cb8d159eea932b4bd99d0ee25447f0015f9902cdf6121b72",
  "stage-role.js": "2324a1b5784ac08a949953760c70bf07bfe2d17eb1be3656fbfdd98f5a5f8f67",
  "stage-receiver.js": "0a426e1ec4985f124236e5cb69b93ddfde30d11a7ab42250d2c7f2a6deecd9b9",
  "performance-api.js": "f7e746ff1c275b073ad4d116b45ed220fc83819b7585412a77b742010e144295",
  "keyboard-performance.js": "3b9706214956ddb6fbaf1072d47e85e3e9ffac6d2e749056a10826a54aaddec1",
  "window-safety.js": "08e04346e0bed71048ca73b23a06d7b1f92fa09faf7e3f9204b4427e117b1d83",
  "START-HERE.html": "709317b31c3f5e44739c2f626b6bad58dd3e9adf3269369b7bd5c8910e3cf6a4",
  "GUIDE.html": "a802e0244511545bbf974e1cd37fba10d6a1c26e193a400c537ba2dea6a1c250",
  "PERFORMANCE-PLAN.html": "93fb5bbfadea1afee19e8245566d26a609bd2a03fcc8e5b1beea9fecae8d4444",
  "guide.css": "9861e7bbf26008b78bba20406f7176ffbb1d2b61224cbf6913b053b6933ec440",
  "LICENSE.txt": "a643b7235f6eeb00fdf602e729cb4b88a8f7984e7dab0bc3f5993dd5c25a95bd",
  "RIGHTS.txt": "b6de1283128232e2e36d9c6f972958aae36fe88ecac0f60b61667037d6a8a4a8",
  "motion-clock.js": "52fcea2e517c25c89a9b525843d43f088f1f9ffcae0b94d6b83b21f3faf5083c",
  "control-response.js": "a6c1cc00d6d4a0eafbb0ea2af6a7a1ea0a6273e285c7014721694fa6a2e9a954",
  "a-source-blur.js": "321d86574d83503fdc4431813de60de8fe67647663a52da574fcf6788d95ba49",
  "a-motion-lag.js": "7466b1bd00fae5757448f1785151cbc9ca8ef3d0ae8fe1eeb806baab83c524ba",
  "a-motion.js": "45ed4b9b2ab06c8f9feabe47a62156bad8a9c391d9808f2168ec5d4a28984f6d",
  "a-actor-layout.js": "3b89d39e3736f86c9437edb5767d434125ae258bc37cb7290fcacec3c11aee0e",
  "a-return-motion.js": "3394b0f311f4cc609e6858ca63968fd129fbfb318df22c1ae0a2d02573b074f9",
  "a-jaw-control.js": "fc0b04bd178b41dd3d3d95f5449c6448b331c9a4c6ec0ec2164bc334fabf31d0",
  "i18n.js": "ea40b09819e8b030a6b0cb7553ec8dcdb75cf4492e52ee5ff0774057cfda4208",
  "a-skull-raster.js": "0b8bbf2a46fe0c0f08a77d5d1e93c67b8d1b4dbbc19f64aaba44b78f012d9476",
  "control-api.js": "e8566feb4fdb397af32f512230815fc931a1a2cf8e3e0dc0f5cdd2b00e6cbdb9",
  "text-operators.js": "cae2c3186e9e588d7eb8878996437e6c8dd195c4bf038933fc22a0276405707a",
  "app-control-api.js": "6fe5201e21ee468c71ea3175eb7d3c1176befe5160b7773d0f225723403d8058",
  "control-adapters.js": "2b861abb80f04fc743b00839e332639a4c0551640bc082ae5325be725400c87b",
  "bat-motion.js": "4c6a92858633499f9b8392c61e79d3ceb02b7b550156a47d2bf4ffb958e4ae28",
  "bat-phase.js": "b92f78f1bf2a3be283156cc193dee1560a9527428c1938a51c4c7ca4b8884961",
  "b-motion-runtime.js": "7677ce53099014e9cb02a70c6fbf9055645a25f5ee3c3593091c0657290ae858",
  "bat-art.js": "67c0fcea04746607cb863980db628432be2c083083be31875301fcb21e500c23",
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

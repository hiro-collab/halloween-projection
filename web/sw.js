'use strict';
const BUILD = "0.1.55-jaw-edge-preview-452e2bb99a64";
const HASHES = {
  "index.html": "f6962c20bbbf8e0e2e076dc10f381d094ce54613c3cd395c36c8c68295f6b1cd",
  "styles.css": "f22326303cfde63790650c60acd7c1d576bcb3c0177412887b9f47d000f93d7c",
  "app.js": "1a3b3632ef36ce97405884fd8763766f71b3a86961eae08072dde5f7a9afdd46",
  "offline.js": "6e1875ea2feab8a8907add195906eae18bbb9fc67fa1622a82fae79ffc236707",
  "README.txt": "b7492bf5db78c8ada95bd4296d7862f03981e96f4d2abe809f6e284e82dd8b9f",
  "console.html": "e9878dac44217d5d48339840255793b86481b62abbe0046bbaccdc218d01b87e",
  "console.css": "1ef68b02708f001a9eb90fc12342f1edb7aae6f0a3a6fa03dd12684ff08e525b",
  "console.js": "2c866d3b1259e624cb8d159eea932b4bd99d0ee25447f0015f9902cdf6121b72",
  "stage-role.js": "2324a1b5784ac08a949953760c70bf07bfe2d17eb1be3656fbfdd98f5a5f8f67",
  "stage-receiver.js": "0a426e1ec4985f124236e5cb69b93ddfde30d11a7ab42250d2c7f2a6deecd9b9",
  "performance-api.js": "ef2b6df74264b0addf9e71151f7431050e7cd341c44531e53e4f0833d4beb67d",
  "keyboard-performance.js": "9688bfe67be12c44f2852c3b0bb4dfb2db88e08ada94e36af26613bbb783ce50",
  "window-safety.js": "08e04346e0bed71048ca73b23a06d7b1f92fa09faf7e3f9204b4427e117b1d83",
  "START-HERE.html": "709317b31c3f5e44739c2f626b6bad58dd3e9adf3269369b7bd5c8910e3cf6a4",
  "GUIDE.html": "28f0322b04f8236b50588f12a156f4387f857728a731a60f9ffbf0ebd4c6c45d",
  "PERFORMANCE-PLAN.html": "93fb5bbfadea1afee19e8245566d26a609bd2a03fcc8e5b1beea9fecae8d4444",
  "guide.css": "9861e7bbf26008b78bba20406f7176ffbb1d2b61224cbf6913b053b6933ec440",
  "LICENSE.txt": "a643b7235f6eeb00fdf602e729cb4b88a8f7984e7dab0bc3f5993dd5c25a95bd",
  "RIGHTS.txt": "24067c71371f6edf714591a71bd11f02e874d27a4280ea283a05e21382fb8aaf",
  "motion-clock.js": "52fcea2e517c25c89a9b525843d43f088f1f9ffcae0b94d6b83b21f3faf5083c",
  "control-response.js": "a6c1cc00d6d4a0eafbb0ea2af6a7a1ea0a6273e285c7014721694fa6a2e9a954",
  "a-source-blur.js": "321d86574d83503fdc4431813de60de8fe67647663a52da574fcf6788d95ba49",
  "a-motion-lag.js": "7466b1bd00fae5757448f1785151cbc9ca8ef3d0ae8fe1eeb806baab83c524ba",
  "a-motion.js": "45ed4b9b2ab06c8f9feabe47a62156bad8a9c391d9808f2168ec5d4a28984f6d",
  "a-actor-layout.js": "b503272bcbc8724a44408fa4fee459f681cf54d45dd1f42cefce200fb326e096",
  "a-return-motion.js": "ed6f050453ba09545bac46bda5e6815840f6e455672e25f72052f8038753ce36",
  "a-jaw-control.js": "fc0b04bd178b41dd3d3d95f5449c6448b331c9a4c6ec0ec2164bc334fabf31d0",
  "i18n.js": "f21190037684a858a0b43a198c391598c4fd298e280a587fd43185ba826bb603",
  "a-skull-raster.js": "0b8bbf2a46fe0c0f08a77d5d1e93c67b8d1b4dbbc19f64aaba44b78f012d9476",
  "control-api.js": "e8566feb4fdb397af32f512230815fc931a1a2cf8e3e0dc0f5cdd2b00e6cbdb9",
  "text-operators.js": "cae2c3186e9e588d7eb8878996437e6c8dd195c4bf038933fc22a0276405707a",
  "app-control-api.js": "6fe5201e21ee468c71ea3175eb7d3c1176befe5160b7773d0f225723403d8058",
  "control-adapters.js": "2b861abb80f04fc743b00839e332639a4c0551640bc082ae5325be725400c87b",
  "bat-motion.js": "204440725a0228c67f171436b438a960a337ce648d1f12f259af1d312e32acfb",
  "bat-phase.js": "2bda87063082b208e816b178e8b11a212d4561293229f13ec261a091bbecdac3",
  "b-motion-runtime.js": "bae0ccf12e8513309d8a89dd07ca73ff7846c664d333ea178b183ae4d1a1e760",
  "bat-art.js": "d05cfd1bd0a95e4583a061c52d7bdd4c87cfe852988a8905c9ccfe0ac46756c2",
  "bat-atlas-data.js": "cb2d214552c1a4eb8a61ffe167e23aafdd368fa6c7214dbf7091080a8ac2a69d",
  "bat-fire.js": "be398b01f41e675cb8653f267a600843b3bf4bb0d64e98bb7b9e971df86905df",
  "text-sequence.js": "0479ed104d7171d58a13bd0dd305326b2e827542de338601985f726687d64835",
  "output-uv.js": "29c8f82abba5ccd7e349a7f431aac264416f1bb7f99060fd87c02748e616942a",
  "output-operators.js": "948b2d2d40c996c67eb949b60d270d1e47ad4b5874cde5eca6b03a054e187dde",
  "a-source-noise.js": "6555f43b09f21d11ebcb821c2170fc987e2a9ae615cc7c1bd389952c45a9bbeb",
  "a-fluid.js": "19ec098262d7f9c1dd660fa10314bb66da42cbfc80df60e5b6c76333a2b6cb48",
  "a-composite.js": "4deef40d4d63f60241a361cc8e58a4d5b89a4b8824d92dd8d6dbd13723a9769a",
  "assets/owner-bat-atlas.png": "9da78cbc8d5721f136f3385354ea94345f9fe5bdae4cc7ce5cc4e8f45d5a317a",
  "assets/OWNER-BAT-ASSET.txt": "44fff898cae99a8e4d8f13184708754df07deda56b58220e0ffd05f6ca570873"
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

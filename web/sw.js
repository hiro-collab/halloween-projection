'use strict';
const BUILD = "0.1.60-bone-whiteness-bfd157937534";
const HASHES = {
  "index.html": "6f016daf8bf7a7a2844de62e30e47d84f696622c02e6739fa69fa70bf32dd60e",
  "styles.css": "96af6f51167542c9a04b6b4515824dd47ec0baf73cd4814b8c5a2f3c81d7c459",
  "app.js": "69d2d1384568aded965746c4ec62104209d819b17a977efc3bc9594bb1a0912d",
  "offline.js": "11fb9a6e328e713863f475030dd0f66ce0d50ebdaa85d2520d65e70188fee5ed",
  "README.txt": "6a789763977d7d14fe6258ba60596af5a6737123911848195f556c052a534e39",
  "console.html": "5086983cbd31138acbab49261de9261eef429770aec7d41abee5d08b80f09c0a",
  "console.css": "eff6482700887f70b6933c71f0129d2a8bee6f32c66ec86982daf3a761a6bc14",
  "console.js": "004c54247e925a2c869c02cb17b00767d407b221370c70d490b9c551923758b9",
  "usage-copy.js": "0bcfb624e733bd1ff9e97b91e25cfb09c7d93388144d4a6ce6b1574bd7fa2e2e",
  "stage-role.js": "9b78f26574416b084ce7f72910405e455755c117e397678e3bcb6a9d39831941",
  "stage-receiver.js": "ee837700c77d453e3f0ab80a9bf8a23d6ad2e1462f3104c86d84617015e3ef6c",
  "performance-api.js": "bef6f02bc47bff988459c3a51bf890f42cbef37e6d70c62e6f3ebc6734533aa7",
  "keyboard-performance.js": "d360e588890c1bcfe3e69cba5ed4a8a6617537f836a4d9998186974ba8be1c2e",
  "window-safety.js": "710aa4fe8c8f26ddedd82e8b811ec133ce7580398cea285fed3bac25641cbcb1",
  "START-HERE.html": "ecd44f44148d522b056c965bbd9981fa1ae5c33f4f4471d8720911ccfbb67e26",
  "GUIDE.html": "be0dab7746f6a4b06e5aad64e6e0110300251d87949958e4676e37dcf9af074b",
  "PERFORMANCE-PLAN.html": "29bcbf8df11849faeb5f4a6b13b0ae886e8c3a2d3c45612e087779ddfdfa455b",
  "guide.css": "9861e7bbf26008b78bba20406f7176ffbb1d2b61224cbf6913b053b6933ec440",
  "LICENSE.txt": "a643b7235f6eeb00fdf602e729cb4b88a8f7984e7dab0bc3f5993dd5c25a95bd",
  "RIGHTS.txt": "4f2411ab8ea330db12cb95269cfe7df38ecf01da0cdaa906b4b88a5dd7cc6d6d",
  "motion-clock.js": "685b4c194616949e6cc00a6b186fb29286d348710ddd3eecfb6c38333b75e33a",
  "control-response.js": "227c68ced5aad165bf4d28fbf5d2b687fa6ef43d184acae584053dd929fba347",
  "a-source-blur.js": "26dfe1fa85413d0a98545c1c9951100c2882c21937b9759301d4cfba5c8f784f",
  "a-motion-lag.js": "1622fd19d10e430a6517b069a62bdae9cde83173bfee18c74e50323d1a52036d",
  "a-motion.js": "ac1d5c5aea2277320e54fdf5553c60b3d4da24aa5ece769d1702ed5c58e172d8",
  "a-actor-layout.js": "66652e6e6cabcec46ff349a910ea28f5832b25457a18daa2bc161d4c26c3ab6d",
  "a-return-motion.js": "8942969c36ad7dac4729c9f6940579eb42ac41b0bcb46a392383bf7ddc47619c",
  "a-jaw-control.js": "d648baccfd9017f2f8e95784537cc6e9bb17ed024b21974481ed8f528e009fc1",
  "i18n.js": "925c603ddab1995f527ec3e4c729a6b81420187753c2cda75a50baa90a34ca00",
  "a-skull-raster.js": "65d2ff55f72c2adf23bee6fc9ff1a711146d4ceb01efe48b03f81727266d3375",
  "control-api.js": "45bf7abbd934bf9f87e46acccb7a7aac256879f8dc334815e4758b3fd0c8fbb4",
  "text-operators.js": "0c1cacdb090252848c9b3c72c1c82c5640b297feb5f93502471ca89fc94b49f1",
  "app-control-api.js": "ab34730b8590276b925e980f0a50c46171b4b1a8ec68b0478f5b6cda8db8f67e",
  "control-adapters.js": "0ee9917556c13f365d8f476dfe204760c3ac5fd8fdd7174127c07db8615fb9e0",
  "bat-motion.js": "9bcc64aa275a8a8e82b04374b78e021751db25d32afe235c081ab73b9ad381b9",
  "bat-phase.js": "ff6272ed0fd2949609d3af482d1b85b8ac13ad932f7719ea32c64760f21bc2e7",
  "b-motion-runtime.js": "b3a2d0e44542a3b7a0447c7f37cfc94a8c5d25f41abeeb3af6e9c4faf04b0891",
  "bat-art.js": "f669b3b21b0d549b5b414aac679580d432f2d0d22f184d7dec0866f850ef3eee",
  "bat-atlas-data.js": "cb2d214552c1a4eb8a61ffe167e23aafdd368fa6c7214dbf7091080a8ac2a69d",
  "bat-fire.js": "e4f662d215b4f6b2a1ddaf5fa9ed9591031aa6bebf666d96eec5506ccb8c5c76",
  "text-sequence.js": "0245c8e710bfa7992f2a8c5739a5a8af319102e9c03ac022056db2a1a4abcb74",
  "output-uv.js": "52f68e981308504e78d5bcb65b4bd8cf5821a18a4f794da46cfb7f7d43fdafd0",
  "output-operators.js": "6c7e3cfc7e3c3ff6700e5188ece4c4bf708b050d746fb8e13079d89d1ebcf9f1",
  "a-source-noise.js": "026220a8c7f5ea4cd7ba2179b14f40f0df269225f435a0498c1ea0c0a518cd28",
  "a-fluid.js": "1b40d4f4527eddbd5d85612336a61fce3f98715506f8304055f910e6d3d29686",
  "a-composite.js": "21632d40876c9a081aac68bcd7d9405c577370ac122f262812438d8739620aa2",
  "assets/owner-bat-atlas.png": "9da78cbc8d5721f136f3385354ea94345f9fe5bdae4cc7ce5cc4e8f45d5a317a",
  "assets/OWNER-BAT-ASSET.txt": "44fff898cae99a8e4d8f13184708754df07deda56b58220e0ffd05f6ca570873",
  "projection-startup.js": "84a3782b37b965150e8a2758bccbb93020bc4aae8004f0ce30714403dcaf8522",
  "assets/mamo-profile.jpg": "c2595149cd55991248d4a3ab733d26d1edb0b6179493c53fbb6e7154ddec0a7e",
  "assets/MAMO-ICON-SOURCE.txt": "18aa01d0d0f23a01ede2801289ac58825fcf82dbd7af033c0ee19b8babdad8ee"
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

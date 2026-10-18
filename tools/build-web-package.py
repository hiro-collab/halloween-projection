"""Build the private, static browser bundle. Python is a maintainer tool only."""
from pathlib import Path
import hashlib
import json
import zipfile

ROOT = Path(__file__).resolve().parent.parent
WEB = ROOT / 'web'
APP_VERSION = '0.1.55-jaw-edge-preview'
ASSETS = ['index.html', 'styles.css', 'app.js', 'offline.js', 'README.txt','console.html','console.css','console.js','stage-role.js','stage-receiver.js','performance-api.js','keyboard-performance.js','window-safety.js', 'START-HERE.html', 'GUIDE.html', 'PERFORMANCE-PLAN.html', 'guide.css', 'LICENSE.txt', 'RIGHTS.txt', 'motion-clock.js','control-response.js','a-source-blur.js','a-motion-lag.js','a-motion.js','a-actor-layout.js','a-return-motion.js','a-jaw-control.js','i18n.js','a-skull-raster.js','control-api.js','text-operators.js', 'app-control-api.js', 'control-adapters.js', 'bat-motion.js','bat-phase.js','b-motion-runtime.js', 'bat-art.js', 'bat-atlas-data.js', 'bat-fire.js', 'text-sequence.js','output-uv.js','output-operators.js','a-source-noise.js','a-fluid.js', 'a-composite.js', 'assets/owner-bat-atlas.png', 'assets/OWNER-BAT-ASSET.txt', 'projection-startup.js', 'assets/mamo-profile.jpg', 'assets/MAMO-ICON-SOURCE.txt']
# The local-file route uses the same MIT-licensed owner image bytes, without file fetch/CORS.
import base64
atlas = (WEB / 'assets/owner-bat-atlas.png').read_bytes()
if hashlib.sha256(atlas).hexdigest() != '9da78cbc8d5721f136f3385354ea94345f9fe5bdae4cc7ce5cc4e8f45d5a317a':
    raise ValueError('Owner atlas integrity mismatch')
local_data = "/* Copyright (c) 2026 hiro-collab. MIT; see LICENSE.txt. Generated owner-created PNG payload, identical to assets/owner-bat-atlas.png. */\n'use strict';\n(() => {\n  if(location.protocol!=='file:')return;\n  let data='" + base64.b64encode(atlas).decode('ascii') + "';\n  window.HalloweenBatAtlasData=Object.freeze({read(){if(!data)throw Error('Packaged image data released');const raw=atob(data),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);return bytes;},release(){data='';},diagnostics:()=>({encodedChars:data.length})});\n})();\n"
(WEB / 'bat-atlas-data.js').write_text(local_data, encoding='utf-8', newline='\n')
for name in ASSETS:
    if name.endswith(('.png', '.jpg')):
        continue
    raw = (WEB / name).read_bytes()
    canonical = raw.decode('utf-8-sig').replace('\r\n', '\n').encode('utf-8')
    if raw != canonical:
        raise ValueError('Web assets must use UTF-8 without BOM and LF: ' + name)
hashes = {name: hashlib.sha256((WEB / name).read_bytes()).hexdigest() for name in ASSETS}
worker_template = r"""'use strict';
const BUILD = __BUILD__;
const HASHES = __HASHES__;
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
"""
identity = {'assets':hashes, 'workerTemplateHash':hashlib.sha256(worker_template.encode()).hexdigest()}
build = APP_VERSION + '-' + hashlib.sha256(json.dumps(identity, sort_keys=True).encode()).hexdigest()[:12]
worker = worker_template.replace('__BUILD__', json.dumps(build)).replace('__HASHES__', json.dumps(hashes, indent=2))
(WEB / 'sw.js').write_text(worker, encoding='utf-8', newline='\n')
out = ROOT / 'dist'
out.mkdir(exist_ok=True)
dest = out / 'halloween-projection-web-v0.1.55-jaw-edge-preview.zip'
names = ASSETS + ['sw.js']
prefix = 'アプリ本体/'
entry = (WEB / 'START-HERE.html').read_text(encoding='utf-8').replace('href="./', 'href="./' + prefix).replace('src="./', 'src="./' + prefix).encode('utf-8')
contents = {'はじめに_START-HERE.html': entry, '利用条件.txt': (ROOT / '利用条件.txt').read_bytes()}
contents.update({prefix + name: (WEB / name).read_bytes() for name in names})
with zipfile.ZipFile(dest, 'w', compression=zipfile.ZIP_DEFLATED) as archive:
    for name, raw in contents.items():
        info = zipfile.ZipInfo(name, date_time=(2026, 10, 17, 0, 0, 0))
        info.compress_type = zipfile.ZIP_DEFLATED
        info.create_system = 0
        info.external_attr = 0o100644 << 16
        archive.writestr(info, raw)
with zipfile.ZipFile(dest) as archive:
    assert archive.testzip() is None and archive.namelist() == list(contents)
    for name, raw in contents.items():
        assert archive.read(name) == raw
result = {'version':APP_VERSION, 'build':build, 'zip':dest.name, 'bytes':dest.stat().st_size,
          'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(), 'entries':list(contents), 'assetHashes':hashes,
          'layout':{'entry':'はじめに_START-HERE.html','application':prefix,'terms':'利用条件.txt'}}
(out / 'web-manifest.json').write_text(json.dumps(result, indent=2), encoding='utf-8')
print(json.dumps({k:v for k,v in result.items() if k not in ['assetHashes','entries']}))

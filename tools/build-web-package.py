"""Build the private, static browser bundle. Python is a maintainer tool only."""
from pathlib import Path
import hashlib
import json
import zipfile

ROOT = Path(__file__).resolve().parent.parent
WEB = ROOT / 'web'
APP_VERSION = '0.1.6-vj-input-preview'
ASSETS = ['index.html', 'styles.css', 'app.js', 'offline.js', 'README.txt', 'LICENSE.txt', 'RIGHTS.txt', 'control-api.js', 'bat-art.js', 'assets/owner-bat-atlas.png', 'assets/OWNER-BAT-ASSET.txt']
for name in ASSETS:
    if name.endswith('.png'):
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
dest = out / 'halloween-projection-web-v0.1.6-vj-input-preview.zip'
names = ASSETS + ['sw.js']
with zipfile.ZipFile(dest, 'w', compression=zipfile.ZIP_DEFLATED) as archive:
    for name in names:
        archive.write(WEB / name, name)
with zipfile.ZipFile(dest) as archive:
    assert archive.testzip() is None and archive.namelist() == names
    for name in names:
        assert archive.read(name) == (WEB / name).read_bytes()
result = {'version':APP_VERSION, 'build':build, 'zip':dest.name, 'bytes':dest.stat().st_size,
          'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(), 'entries':names, 'assetHashes':hashes}
(out / 'web-manifest.json').write_text(json.dumps(result, indent=2), encoding='utf-8')
print(json.dumps(result))

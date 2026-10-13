'use strict';
(() => {
  const scope = new URL('./', location.href).href;
  const workerURL = new URL('sw.js', scope).href;
  const prefix = 'halloween-projection:' + scope + ':';
  const supported = !!navigator.serviceWorker && isSecureContext && /^https?:$/.test(location.protocol) && !!globalThis.caches;
  const assetURLs = ['index.html','styles.css','app.js','offline.js','README.txt','LICENSE.txt','RIGHTS.txt','control-api.js','bat-motion.js','bat-art.js','bat-fire.js','a-fluid.js', 'a-composite.js','assets/owner-bat-atlas.png','assets/OWNER-BAT-ASSET.txt'].map(n => new URL(n,scope).href);
  const status = document.getElementById('offline-status');
  const save = document.getElementById('offline-save');
  const check = document.getElementById('offline-check');
  const clear = document.getElementById('offline-clear');
  const apply = document.getElementById('offline-apply');
  let registration = null, saved = false, busy = false, applying = false;
  const watched = new WeakSet();
  const setStatus = text => { status.textContent = text; };
  const owns = r => !!r && r.scope === scope &&
    [r.active, r.waiting, r.installing].filter(Boolean).every(w => w.scriptURL === workerURL);
  function controls() {
    const working = busy || !!registration?.installing;
    save.disabled = working;
    check.disabled = working || !registration;
    clear.disabled = working || !saved;
    apply.hidden = !registration?.waiting;
    apply.disabled = busy;
  }
  function ask(worker, type) {
    return new Promise((resolve, reject) => {
      if (!worker) { reject(Error('No owned worker')); return; }
      const channel = new MessageChannel();
      const timer = setTimeout(() => { channel.port1.close(); reject(Error('Worker timeout')); }, 10000);
      channel.port1.onmessage = e => {
        clearTimeout(timer); channel.port1.close();
        e.data?.ok ? resolve(e.data) : reject(Error('Worker operation failed'));
      };
      worker.postMessage({type}, [channel.port2]);
    });
  }
  async function refreshSaved() {
    const keys = await caches.keys();
    saved = false;
    for (const key of keys.filter(k => k.startsWith(prefix))) {
      const urls = (await (await caches.open(key)).keys()).map(r => r.url);
      if (urls.length === assetURLs.length && assetURLs.every(u => urls.includes(u))) saved = true;
    }
    controls();
  }
  function observe(r) {
    if (registration === r) return;
    registration = r;
    function watch(next) {
      if (!next || watched.has(next)) return;
      watched.add(next);
      next.onstatechange = async () => {
        if (next.state === 'installed') {
          await refreshSaved();
          setStatus(r.waiting ? '最新版の準備ができました。表示中は切り替わりません。' : 'オフライン準備済み。同じブラウザー・同じページで開けます。');
          controls();
        } else if (next.state === 'redundant') {
          await refreshSaved();
          setStatus(saved ? '更新を保存できませんでした。保存済みの版はそのまま使えます。' : '保存できませんでした。接続中にもう一度お試しください。');
        }
      };
    }
    r.addEventListener('updatefound', () => watch(r.installing));
    watch(r.installing);
    controls();
  }
  navigator.serviceWorker?.addEventListener('controllerchange', () => {
    if (applying) location.reload();
  });
  save.addEventListener('click', async () => {
    busy = true; controls(); setStatus('この端末へ保存しています…');
    try {
      const existing = await navigator.serviceWorker.getRegistration(scope);
      if (existing?.scope === scope && !owns(existing)) throw Error('Shared scope');
      const r = await navigator.serviceWorker.register(workerURL, {scope, updateViaCache:'none'});
      observe(r);
      if (r.installing) await new Promise((resolve,reject) => {
        const worker = r.installing;
        const timer = setTimeout(() => reject(Error('Install timeout')),120000);
        const done = () => {
          if (worker.state === 'installed' || worker.state === 'activated') { clearTimeout(timer); resolve(); }
          else if (worker.state === 'redundant') { clearTimeout(timer); reject(Error('Install failed')); }
        };
        worker.addEventListener('statechange',done); done();
      });
      if (r.active && !r.installing) {
        await ask(r.active, 'STATUS'); await refreshSaved();
        setStatus(r.waiting ? '最新版の準備ができました。表示中は切り替わりません。' : 'オフライン準備済み。同じブラウザー・同じページで開けます。');
      }
    } catch (_) { setStatus('保存できませんでした。接続中にもう一度お試しください。'); }
    finally { busy = false; controls(); }
  });
  check.addEventListener('click', async () => {
    if (!owns(registration)) return;
    busy = true; controls(); setStatus('更新を確認しています…');
    try {
      await registration.update();
      if (registration.waiting) setStatus('最新版の準備ができました。表示中は切り替わりません。');
      else if (!registration.installing) setStatus('保存済みの版で準備できています。更新があればここに表示します。');
    } catch (_) { setStatus('更新を確認できません。保存済みの版はそのまま使えます。'); }
    finally { busy = false; controls(); }
  });
  apply.addEventListener('click', async () => {
    if (!owns(registration) || !registration.waiting) return;
    if (!confirm('表示を停止して最新版を開き直します。入力した文字と調整はリセットされます。切り替えますか？')) return;
    busy = true; controls();
    await window.halloweenEnd();
    applying = true;
    registration.waiting.postMessage({type:'APPLY_UPDATE'});
  });
  clear.addEventListener('click', async () => {
    if (!confirm('このアプリのオフライン保存をこの端末から解除しますか？次回は接続が必要です。')) return;
    busy = true; controls();
    try {
      const r = await navigator.serviceWorker.getRegistration(scope);
      if (r && owns(r)) await r.unregister();
      await Promise.all((await caches.keys()).filter(k => k.startsWith(prefix)).map(k => caches.delete(k)));
      registration = null; saved = false;
      setStatus('この端末の保存を解除しました。次回は接続してページを開いてください。');
    } catch (_) { setStatus('保存を解除できませんでした。もう一度お試しください。'); }
    finally { busy = false; controls(); }
  });
  window.halloweenOfflineDiagnostics = () => ({supported, saved, busy:busy || !!registration?.installing, waiting:!!registration?.waiting, scope, applying});
  (async () => {
    if (!supported) {
      save.disabled = check.disabled = clear.disabled = true;
      setStatus('この開き方ではオフライン保存に対応していません。接続中にブラウザーで使ってください。');
      return;
    }
    try {
      const r = await navigator.serviceWorker.getRegistration(scope);
      if (owns(r)) observe(r);
      await refreshSaved();
      setStatus(saved ? 'オフライン準備済み。同じブラウザー・同じページで開けます。' : '未保存。投影前に接続中に「この端末へ保存」を押してください。');
      controls();
    } catch (_) { setStatus('保存状態を確認できません。接続中に使ってください。'); }
  })();
})();

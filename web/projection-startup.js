/* Initial preparation only. No minimum duration; a deadline reports a missing first frame. */
'use strict';
window.HalloweenProjectionStartup = (() => {
  const root = document.documentElement,
    remote = window.HalloweenStageRole?.remote === true;
  if (!remote)
    return Object.freeze({
      ready: () => false,
      fail: () => false,
      status: () => ({ phase: 'inactive' })
    });
  root.lang =
    new URLSearchParams(location.hash.slice(1)).get('lang') === 'en'
      ? 'en'
      : 'ja';
  const began = performance.now();
  let phase = 'preparing',
    completed = null;
  const deadline = setTimeout(() => finish('error'), 10000);
  root.setAttribute('data-preparing', '');
  function showError() {
    document
      .getElementById('projection-preparing')
      ?.setAttribute('aria-busy', 'false');
    const note = document.getElementById('stage-start-note');
    if (note) {
      note.setAttribute('role', 'alert');
      note.textContent =
        root.lang === 'en'
          ? 'The visuals could not be prepared. Reload this window to try again.'
          : '映像を準備できませんでした。再読込みして、もう一度お試しください。';
    }
    for (const id of ['stage-fullscreen', 'stage-windowed']) {
      const button = document.getElementById(id);
      if (button) button.disabled = true;
    }
    const retry = document.getElementById('stage-retry');
    if (retry) {
      retry.hidden = false;
      retry.textContent =
        root.lang === 'en' ? 'Reload this window' : 'この窓を再読込み';
      retry.onclick = () => location.reload();
    }
  }
  function finish(next) {
    if (phase !== 'preparing') return false;
    phase = next;
    completed = performance.now();
    clearTimeout(deadline);
    root.removeAttribute('data-preparing');
    document
      .getElementById('projection-preparing')
      ?.setAttribute('aria-busy', 'false');
    window.removeEventListener('error', failed, true);
    window.removeEventListener('unhandledrejection', failed);
    window.removeEventListener('load', loaded);
    if (next === 'error') {
      if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', showError, {
          once: true
        });
      else showError();
    }
    return true;
  }
  function failed(event) {
    if (
      event.type === 'unhandledrejection' ||
      event instanceof ErrorEvent ||
      event.target?.tagName === 'SCRIPT'
    )
      finish('error');
  }
  function loaded() {
    if (phase === 'preparing' && !window.halloweenControls) finish('error');
  }
  window.addEventListener('error', failed, true);
  window.addEventListener('unhandledrejection', failed);
  window.addEventListener('load', loaded, { once: true });
  window.addEventListener('halloween-language-change', () => {
    if (phase === 'error') showError();
  });
  return Object.freeze({
    ready: () => finish('ready'),
    fail: () => finish('error'),
    status: () => ({
      phase,
      began,
      completed,
      elapsedMs: completed === null ? null : completed - began
    })
  });
})();

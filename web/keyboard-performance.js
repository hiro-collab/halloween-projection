/* Physical QWERTY/JIS Latin rows. Only this adapter reads performance keys. */
'use strict';
window.HalloweenPerformanceKeyboard = (() => {
  function create({
    send,
    onState = () => {},
    document: doc = document,
    window: win = window,
    canArm = () => true
  } = {}) {
    let armed = false,
      disposed = false,
      reason = '演奏停止',
      timer = 0,
      lastWall = Date.now(),
      gesture = 0,
      holdStart = 0,
      baselineDone = false,
      resetDone = false,
      accentLimited = false;
    const pressed = new Set(),
      keyTimes = {},
      listeners = [];
    // Positions select targets in performance-api.js; this layer does not set
    // simulation coefficients. Keep the displayed HTML rows and bindings in sync.
    const rows = { motion: '12345678', look: 'qwertyui', text: 'asdfghjk' },
      edit = (e) =>
        !!e?.closest?.(
          'input,textarea,select,[contenteditable]:not([contenteditable="false"])'
        );
    const status = () => ({
        armed,
        reason,
        pressed: [...pressed],
        gesture,
        accentLimited,
        listeners: disposed ? 0 : listeners.length
      }),
      publish = () => onState(status());
    // Clear held keys whenever controls stop so focus changes cannot leave an accent stuck on.
    function off(why = '演奏停止') {
      armed = false;
      reason = why;
      pressed.clear();
      baselineDone = resetDone = accentLimited = false;
      for (const k of Object.keys(keyTimes)) delete keyTimes[k];
      if (timer) win.clearInterval(timer);
      timer = 0;
      send({ action: 'accent', value: false });
      publish();
    }
    function tick() {
      if (!armed) return;
      if (
        !HalloweenWindowSafety.surface(win, doc).available ||
        !doc.hasFocus()
      ) {
        off('操作窓のフォーカスを確認できないため停止');
        return;
      }
      const wall = Date.now();
      if (wall - lastWall > 1000) {
        off('入力確認が中断したため停止');
        return;
      }
      lastWall = wall;
      if (
        [...pressed].some(
          (k) =>
            k !== 'v' &&
            wall - (keyTimes[k + 'Wall'] ?? wall) >=
              HalloweenWindowSafety.holdMs
        )
      ) {
        off('連続押下は最大8秒です。離して演奏開始を押してください');
        return;
      }
      if (
        pressed.has('v') &&
        !accentLimited &&
        wall - (keyTimes.vWall ?? wall) >= HalloweenWindowSafety.accentMs
      ) {
        accentLimited = true;
        send({ action: 'accent', value: false });
        reason = '演奏中（V上限：離すと次のアクセント）';
        publish();
      }
      const now = performance.now();
      if (
        pressed.has('b') &&
        !baselineDone &&
        now - (keyTimes.b ?? now) >= 600
      ) {
        baselineDone = true;
        send({ action: 'baseline' });
      }
      if (pressed.has('n') && !resetDone && now - (keyTimes.n ?? now) >= 600) {
        resetDone = true;
        send({ action: 'reset' });
      }
    }
    function arm() {
      if (disposed || !canArm() || doc.hidden || edit(doc.activeElement)) {
        reason = '投影接続と入力欄を確認してください';
        publish();
        return false;
      }
      pressed.clear();
      baselineDone = resetDone = accentLimited = false;
      armed = true;
      reason = '演奏中';
      lastWall = Date.now();
      if (timer) win.clearInterval(timer);
      timer = win.setInterval(tick, 33);
      publish();
      return true;
    }
    // Use physical key positions so the three rows stay consistent on QWERTY and JIS keyboards.
    const physical = (e) =>
      e.code?.startsWith('Key')
        ? e.code.slice(3).toLowerCase()
        : e.code?.startsWith('Digit')
          ? e.code.slice(5)
          : e.code === 'Space'
            ? ' '
            : e.code === 'Escape'
              ? 'escape'
              : e.key?.toLowerCase();
    // Only armed performance keys are consumed; text editing, IME, modifiers and repeats keep their guards.
    function down(e) {
      const k = physical(e);
      if (k === 'escape') {
        off('Escで演奏停止');
        return;
      }
      if (
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        e.shiftKey ||
        e.isComposing ||
        e.keyCode === 229
      ) {
        if (armed) off('修飾キー/IMEで演奏停止');
        return;
      }
      if (!armed || disposed || doc.hidden || edit(e.target)) return;
      if (k === ' ' && e.target?.closest?.('button,a[href]')) return;
      const axis = Object.keys(rows).find((a) => rows[a].includes(k));
      if (
        !axis &&
        !['9', '0', 'z', 'x', 'c', 'v', 'b', 'n', 'l', 'm', ' '].includes(k)
      )
        return;
      e.preventDefault();
      if (e.repeat || pressed.has(k)) return;
      if (!pressed.size) {
        gesture++;
        holdStart = Date.now();
      }
      pressed.add(k);
      keyTimes[k] = performance.now();
      keyTimes[k + 'Wall'] = Date.now();
      if (k === 'v') {
        accentLimited = false;
        reason = '演奏中';
      }
      if (axis)
        send({ action: 'preset', axis, position: rows[axis].indexOf(k) + 1 });
      else if (k === '9' || k === '0')
        send({ action: 'actorCountStep', delta: k === '0' ? 1 : -1 });
      else if (k === 'z') send({ action: 'sceneToggle' });
      else if (k === 'x') send({ action: 'flip' });
      else if (k === 'c') send({ action: 'mode' });
      else if (k === 'l') send({ action: 'jawLevel' });
      else if (k === 'm') send({ action: 'jawToggle' });
      else if (k === 'v') send({ action: 'accent', value: true });
      else if (k === 'b') baselineDone = false;
      else if (k === 'n') resetDone = false;
      else if (k === ' ') send({ action: 'pause' });
      publish();
    }
    function up(e) {
      const k = physical(e);
      pressed.delete(k);
      delete keyTimes[k];
      delete keyTimes[k + 'Wall'];
      if (k === 'v') {
        accentLimited = false;
        if (armed) reason = '演奏中';
        send({ action: 'accent', value: false });
      }
      if (k === 'b') baselineDone = false;
      if (k === 'n') resetDone = false;
      publish();
    }
    function listen(t, n, f) {
      t.addEventListener(n, f);
      listeners.push(() => t.removeEventListener(n, f));
    }
    listen(doc, 'keydown', down);
    listen(doc, 'keyup', up);
    listen(win, 'blur', () =>
      off('フォーカスを失ったため停止。演奏開始で戻ります')
    );
    listen(doc, 'visibilitychange', () => {
      if (doc.hidden) off('操作窓が隠れたため停止');
    });
    listen(doc, 'focusin', (e) => {
      if (edit(e.target)) off('入力中。演奏開始で戻ります');
    });
    listen(doc, 'compositionstart', () => off('日本語入力中のため停止'));
    return Object.freeze({
      arm,
      disarm: off,
      status,
      dispose() {
        if (disposed) return;
        off('終了');
        disposed = true;
        for (const remove of listeners) remove();
        listeners.length = 0;
        publish();
      }
    });
  }
  return Object.freeze({ create });
})();

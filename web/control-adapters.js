/* Input/view adapters only. Renderer never interprets keyboard/DOM controls. */
'use strict';
window.HalloweenControlAdapters = (() => {
  const aliases = { skeleton: 'skeleton', bats: 'b', skull3d: 'a' };
  const skull = {
    actorCount: 'a.actorCount',
    actorLayout: 'a.actorLayout',
    dynamicFlow: 'a.dynamicFlow',
    decorationNoise: 'a.decorationNoise',
    fluidNoiseAmplitude: 'a.fluidNoiseAmplitude',
    fluidNoisePeriod: 'a.fluidNoisePeriod',
    jawMode: 'a.jawMode',
    jawActivity: 'a.jawActivity',
    positionNoiseAmplitude: 'a.positionNoiseAmplitude',
    positionNoisePeriod: 'a.positionNoisePeriod',
    rotationNoiseAmplitude: 'a.rotationNoiseAmplitude',
    rotationNoisePeriod: 'a.rotationNoisePeriod',
    jawNoiseAmplitude: 'a.jawNoiseAmplitude',
    motionCross: 'a.motionCross',
    jawPeriod: 'a.jawPeriod',
    jawExponent: 'a.jawExponent',
    headGlowMix: 'a.headGlowMix',
    boneWhiteness: 'a.boneWhiteness',
    foregroundBurst: 'a.foregroundBurst',
    headRate: 'a.headCycleRate',
    jawRate: 'a.jawCycleRate',
    jawOpen: 'a.jawMaxAngle',
    pivotY: 'a.debug.pivotY',
    pivotZ: 'a.debug.pivotZ',
    headX: 'a.headX',
    headY: 'a.headY',
    headZ: 'a.headZ',
    jawTint: 'a.debug.jawTint',
    rigMode: 'a.debug.registration',
    jawPivotMode: 'a.debug.originalJawPivot',
    fluidMode: 'a.compare.fluid',
    fluidColor: 'a.compare.blueBranch',
    aCompositeMode: 'a.compare.composite',
    aSceneMode: 'a.compare.sixActors',
    aNativeResolution: 'a.compare.nativeResolution'
  };
  function keyboard(
    api,
    {
      document: doc = window.document,
      window: win = window,
      dialogOpen = () => false
    } = {}
  ) {
    const pressed = new Set();
    let disposed = false;
    function command(event, onlyB = false) {
      if (
        !event ||
        event.repeat ||
        event.editable ||
        event.isComposing ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
      )
        return null;
      const key = event.key?.toLowerCase(),
        s = api.getState();
      if (onlyB && s.scene !== 'b') return null;
      if (
        s.scene === 'b' &&
        ['arrowleft', 'arrowright', 'arrowup', 'arrowdown'].includes(key)
      ) {
        const mix = key === 'arrowleft' || key === 'arrowright',
          name = mix ? 'b.motionMix' : 'b.initialSpeed',
          delta =
            (key === 'arrowright' || key === 'arrowup' ? 1 : -1) *
            (mix ? 0.05 : 0.1),
          max = mix ? 1 : 2.6;
        return {
          type: 'set',
          key: name,
          value: Math.min(
            max,
            Math.max(0, Math.round((s.settings[name] + delta) * 100) / 100)
          )
        };
      }
      if (onlyB) {
        if (key === ' ')
          return { type: 'command', name: 'transport.togglePause' };
        if (key === 'r') return { type: 'command', name: 'scene.reset' };
        return null;
      }
      const name = {
        ' ': 'transport.togglePause',
        escape: 'view.showControls'
      }[key];
      return name ? { type: 'command', name } : null;
    }
    function handlePlain(event, onlyB = false) {
      if (disposed) return false;
      const c = command(event, onlyB);
      if (!c) return false;
      api.dispatch(c, { source: onlyB ? 'legacy-vj-keyboard' : 'keyboard' });
      return true;
    }
    function keydown(event) {
      if (
        disposed ||
        dialogOpen() ||
        event.target?.closest?.(
          'input,textarea,select,[contenteditable]:not([contenteditable="false"])'
        ) ||
        (event.key === ' ' && event.target?.closest?.('button,a[href]'))
      )
        return;
      const id = event.code || event.key?.toLowerCase();
      if (pressed.has(id)) return;
      const c = command(event);
      if (!c) return;
      pressed.add(id);
      event.preventDefault();
      const result = api.dispatch(c, { source: 'keyboard' });
      result?.catch?.(() => {});
    }
    function keyup(event) {
      pressed.delete(event.code || event.key?.toLowerCase());
    }
    function blur() {
      pressed.clear();
    }
    doc.addEventListener('keydown', keydown);
    doc.addEventListener('keyup', keyup);
    win.addEventListener('blur', blur);
    return Object.freeze({
      handlePlain,
      diagnostics: () => ({
        pressed: pressed.size,
        listeners: disposed ? 0 : 3
      }),
      dispose() {
        if (disposed) return;
        disposed = true;
        pressed.clear();
        doc.removeEventListener('keydown', keydown);
        doc.removeEventListener('keyup', keyup);
        win.removeEventListener('blur', blur);
      }
    });
  }
  function renderStatus(d, doc, apiSnapshot) {
    const $ = (id) => doc.getElementById(id),
      settings = d.settings,
      phase = d.phase,
      fullscreenError = d.fullscreenError,
      assetError = d.assetError,
      active = d.liveEffects
        ? d.sprite || d.skull
          ? { probe: () => d.sprite || d.skull }
          : {}
        : null;
    const label =
      settings.effect === 'skull3d'
        ? '3Dドクロ（CC0別候補）'
        : settings.effect === 'skeleton'
          ? 'くるくる骸骨'
          : 'コウモリと文字';
    $('status').textContent =
      label +
      ' · ' +
      (phase === 'running'
        ? '表示中'
        : phase === 'paused'
          ? '一時停止'
          : phase === 'error'
            ? '読み込みエラー'
            : '中断中（描画・GPU資源は解放済み）') +
      (fullscreenError ? ' · ' + fullscreenError : '') +
      (assetError ? ' · ' + assetError : '');
    $('pause').textContent =
      phase === 'paused' ? '動きを再開' : '動きを一時停止';
    $('pause').disabled = !active;
    $('reset').disabled = !active;
    for (const b of doc.querySelectorAll('[data-effect]'))
      b.setAttribute(
        'aria-pressed',
        String(b.dataset.effect === settings.effect)
      );
    if ($('text').value !== settings.text) $('text').value = settings.text;
    $('speed').value = settings.speed;
    $('size').value = settings.size * 100;
    $('speed-value').textContent = settings.speed.toFixed(1) + ' ×';
    $('size-value').textContent = Math.round(settings.size * 100) + ' %';
    $('speed-label').textContent =
      settings.effect === 'bats' ? '比較再生の速さ' : '動く速さ';
    $('skull-options').hidden = settings.effect !== 'skull3d';
    $('text-options').hidden =
      settings.effect === 'skull3d' && !settings.aCompositeMode;
    $('speed').hidden = settings.effect === 'skull3d';
    $('speed-label').closest('label').hidden = settings.effect === 'skull3d';
    if (settings.effect === 'skull3d') {
      $('skull-actorCount').value = settings.actorCount;
      $('skull-actorLayout').value = settings.actorLayout;
      for (const key of [
        'fluidNoiseAmplitude',
        'fluidNoisePeriod',
        'positionNoiseAmplitude',
        'positionNoisePeriod',
        'rotationNoiseAmplitude',
        'rotationNoisePeriod',
        'jawNoiseAmplitude',
        'motionCross',
        'jawPeriod',
        'jawExponent',
        'headGlowMix',
        'boneWhiteness',
        'headRate',
        'jawRate',
        'jawOpen',
        'pivotY',
        'pivotZ',
        'headX',
        'headY',
        'headZ'
      ]) {
        $('skull-' + key).value = settings[key];
        $('skull-' + key + '-value').textContent = settings[key].toFixed(
          key === 'jawOpen' || ['headX', 'headY', 'headZ'].includes(key) ? 0 : 2
        );
      }
      $('skull-dynamicFlow').checked = !!settings.dynamicFlow;
      $('skull-decorationNoise').checked = !!settings.decorationNoise;
      $('skull-jawMode').value = settings.jawMode;
      $('skull-jawActivity').value = settings.jawActivity;
      for (const k of [
        'jawMode',
        'jawActivity',
        'positionNoiseAmplitude',
        'positionNoisePeriod',
        'rotationNoiseAmplitude',
        'rotationNoisePeriod',
        'jawNoiseAmplitude'
      ])
        $('skull-' + k).disabled =
          !settings.aSceneMode || !!settings.actorPoses;
      $('skull-foregroundBurst').checked = !!settings.foregroundBurst;
      $('skull-foregroundBurst').disabled = !settings.aCompositeMode;
      $('skull-headGlowMix').disabled = !settings.aCompositeMode;
      $('skull-boneWhiteness').disabled = !settings.aCompositeMode;
      $('skull-jawTint').checked = !!settings.jawTint;
      $('skull-rigMode').checked = !!settings.rigMode;
      $('skull-jawPivotMode').checked = !!settings.jawPivotMode;
      $('skull-fluidMode').checked = !!settings.fluidMode;
      $('skull-fluidColor').checked = !!settings.fluidColor;
      $('skull-fluidColor').disabled = !!settings.aCompositeMode;
      $('skull-aCompositeMode').checked = !!settings.aCompositeMode;
      $('skull-aSceneMode').checked = !!settings.aSceneMode;
      $('skull-aNativeResolution').checked = !!settings.aNativeResolution;
      $('skull-aNativeResolution').disabled = !settings.aCompositeMode;
      $('skull-scene-note').textContent = settings.aSceneMode
        ? settings.actorPoses
          ? '6組の頭と顎を入力された姿勢で表示しています。'
          : settings.actorCount +
            '体。' +
            (settings.actorLayout === 'source'
              ? '中央の周囲を回遊します。'
              : '上下へ整列し、移動幅を小さくします。') +
            'Q減／E増。'
        : '1組の比較を保持。6組では頭・顎がそれぞれ動きます。Noiseは連続時間で動きます。';
      for (const key of ['pivotY', 'pivotZ'])
        $('skull-' + key).disabled = !!(
          settings.rigMode && settings.jawPivotMode
        );
      $('skull-pose').hidden = !settings.rigMode;
    }
    $('bat-options').hidden = settings.effect !== 'bats';
    $('flap').value = settings.flapRate;
    $('flap-value').textContent = settings.flapRate.toFixed(2) + ' ×';
    for (const key of ['initialSpeed', 'motionMix']) {
      $('bat-' + key).value = settings[key];
      $('bat-' + key + '-value').textContent = settings[key].toFixed(2);
    }
    for (const [id, key] of [
      ['text-width', 'text.width'],
      ['text-height', 'text.height']
    ]) {
      $(id).value = apiSnapshot.settings[key];
      $(id + '-value').textContent =
        Math.round(apiSnapshot.settings[key] * 100) + '%';
      $(id).disabled = apiSnapshot.scene === 'skeleton';
    }
    const normalized = apiSnapshot.settings['text.sizeNormalized'];
    $('text-manual-size').checked = normalized !== null;
    $('text-size-normalized').disabled =
      normalized === null || apiSnapshot.scene === 'skeleton';
    $('text-manual-size').disabled = apiSnapshot.scene === 'skeleton';
    if (normalized !== null) $('text-size-normalized').value = normalized;
    $('text-size-value').textContent =
      normalized === null ? '自動調整' : Math.round(normalized * 100) + '%';
    $('a-background-hue').value = apiSnapshot.settings['a.backgroundHue'];
    $('a-background-hue').disabled =
      apiSnapshot.scene !== 'a' || !settings.aCompositeMode;
    $('a-background-hue-value').textContent =
      HalloweenTextOperators.hueDegrees(
        apiSnapshot.settings['a.backgroundHue']
      ).toFixed(1) + '°';
    $('bat-colour-note').textContent =
      active?.probe?.().composite?.mode === 'original-atlas-fallback'
        ? 'この環境では色合成を省いた旧図案を表示しています。原作の見えとの一致は未確認です。'
        : '紫の本体・白い輪郭の比較です。出生・飛翔・羽ばたきは別々に操作できます。光と文字の合成を検証しています。';
    $('bat-readiness').textContent = d.imageResources.encodedBytes
      ? '図案取得済み。このページ内では接続なしでも切り替えられます。'
      : '図案未取得のofflineでは表示できません。接続中に取得するか、先に端末へ保存してください。';
    if (active?.probe && active.probe().state === 'loading')
      $('status').textContent += ' · 原図案を準備中';
    if (active?.probe && active.probe().state === 'error')
      $('status').textContent +=
        ' · 図案を読めません。接続・保存を確認して再開してください。';
  }
  function panel(api, { document: doc = window.document, diagnostics }) {
    const $ = (id) => doc.getElementById(id),
      removers = [];
    let disposed = false;
    const listen = (target, type, fn) => {
      target.addEventListener(type, fn);
      removers.push(() => target.removeEventListener(type, fn));
    };
    const send = (c) => {
      const result = api.dispatch(c, { source: 'panel' });
      result?.catch?.(() => {});
    };
    for (const button of doc.querySelectorAll('[data-effect]'))
      listen(button, 'click', () =>
        send({
          type: 'command',
          name: 'scene.select',
          scene: aliases[button.dataset.effect]
        })
      );
    listen($('text-manual-size'), 'change', () =>
      send({
        type: 'set',
        key: 'text.sizeNormalized',
        value: $('text-manual-size').checked
          ? Number($('text-size-normalized').value)
          : null
      })
    );
    listen($('text-size-normalized'), 'input', () =>
      send({
        type: 'set',
        key: 'text.sizeNormalized',
        value: Number($('text-size-normalized').value)
      })
    );
    for (const [id, key] of [
      ['text-width', 'text.width'],
      ['text-height', 'text.height']
    ])
      listen($(id), 'input', () =>
        send({ type: 'set', key, value: Number($(id).value) })
      );
    listen($('a-background-hue'), 'input', () =>
      send({
        type: 'set',
        key: 'a.backgroundHue',
        value: Number($('a-background-hue').value)
      })
    );
    listen($('text'), 'input', () =>
      send({
        type: 'set',
        key: api.getState().scene + '.text',
        value: HalloweenAppControl.normalizeText($('text').value)
      })
    );
    for (const [id, suffix, factor] of [
      ['speed', 'playbackRate', 1],
      ['size', 'scale', 0.01]
    ])
      listen($(id), 'input', () =>
        send({
          type: 'set',
          key: api.getState().scene + '.' + suffix,
          value: Number($(id).value) * factor
        })
      );
    for (const [id, key] of [
      ['flap', 'b.flapRate'],
      ['bat-initialSpeed', 'b.initialSpeed'],
      ['bat-motionMix', 'b.motionMix']
    ])
      listen($(id), 'input', () =>
        send({ type: 'set', key, value: Number($(id).value) })
      );
    for (const [old, key] of Object.entries(skull)) {
      const element = $('skull-' + old),
        boolean = element.type === 'checkbox',
        choice = element.tagName === 'SELECT';
      listen(element, boolean || choice ? 'change' : 'input', () =>
        send({
          type: 'set',
          key,
          value: boolean
            ? element.checked
            : choice && old !== 'actorCount'
              ? element.value
              : Number(element.value)
        })
      );
    }
    for (const [id, name] of [
      ['pause', 'transport.togglePause'],
      ['stop', 'transport.stop'],
      ['resume', 'transport.resume'],
      ['reset', 'scene.reset'],
      ['quit', 'application.end'],
      ['project', 'view.fullscreen'],
      ['hide', 'view.hideControls']
    ])
      listen($(id), 'click', () => send({ type: 'command', name }));
    listen($('stage'), 'dblclick', () =>
      send({ type: 'command', name: 'view.showControls' })
    );
    listen($('guide'), 'click', () => $('guide-dialog').showModal());
    listen($('close-guide'), 'click', () => $('guide-dialog').close());
    const list = $('control-availability');
    if (list) {
      for (const [key, d] of Object.entries(api.schema().settings)) {
        if (d.status === 'implemented') continue;
        const li = doc.createElement('li');
        li.dataset.controlKey = key;
        li.textContent = d.label + '：' + api.schema().statusLabels[d.status];
        li.title = d.reason;
        list.append(li);
      }
    }
    const render = () => {
      if (!disposed) renderStatus(diagnostics(), doc, api.getState());
    };
    const unsubscribe = api.subscribe(render);
    return Object.freeze({
      render,
      diagnostics: () => ({ listeners: disposed ? 0 : removers.length }),
      dispose() {
        if (disposed) return;
        disposed = true;
        unsubscribe();
        for (const remove of removers) remove();
        removers.length = 0;
      }
    });
  }
  return Object.freeze({ keyboard, panel });
})();

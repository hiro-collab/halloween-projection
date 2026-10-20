/* Operator explanations only. No cue values, key bindings or rendering changes. */
'use strict';
window.HalloweenUsageCopy = (() => {
  const wrap = (x) => ((x % 1) + 1) % 1,
    clamp = (x) => Math.max(0, Math.min(1, x));
  const colours = [
    '赤',
    '橙',
    '黄',
    '黄緑',
    '緑',
    '青緑',
    '水色',
    '青',
    '青紫',
    '紫',
    '桃',
    '赤紫'
  ];
  const skullColours = ['水色', '青', '紫', '赤紫', '赤', '黄', '黄緑', '緑'];
  const near = (a, b) => Math.abs(((a - b + 540) % 360) - 180) < 0.6;
  function look(scene, value) {
    const h = wrap(value),
      degrees = h * 360,
      reference = scene === 'a' ? wrap(h + 0.5) : h;
    let label =
      scene === 'a'
        ? skullColours[Math.round(h * 8) % 8]
        : colours[Math.round(reference * 12) % 12];
    if (scene === 'a') {
      if (near(degrees, 138)) label = '標準の色合い';
    } else if (near(degrees, 240)) label = '元の青';
    else if (near(degrees, 60)) label = '反対側の黄';
    // A's bright fluid edge clips to cyan before rotation, then uses the existing 1.42 gain.
    // These are operator swatches only; B retains its existing pastel body tint.
    const rgb = [0, 2 / 3, 1 / 3]
      .map((offset) => clamp(Math.abs(wrap(reference + offset) * 6 - 3) - 1))
      .map((x) =>
        Math.round((scene === 'b' ? 0.53 + 0.47 * x : clamp(1.42 * x)) * 255)
      );
    return {
      label,
      degrees,
      colour: 'rgb(' + rgb.join(',') + ')',
      text: label + '（' + degrees.toFixed(1) + '°）'
    };
  }
  let lastScene = null,
    lastLanguage = null;
  function update(scene = 'a') {
    const language = window.HalloweenI18n?.getLanguage() || 'ja';
    if (scene === lastScene && language === lastLanguage) return;
    lastScene = scene;
    lastLanguage = language;
    const skull = scene === 'a',
      doc = document,
      $ = (id) => doc.getElementById(id);
    doc.body.dataset.scene = scene;
    for (const el of doc.querySelectorAll('[data-skull-only]'))
      el.hidden = !skull;
    for (const el of doc.querySelectorAll('.keycap[data-skull-key]')) {
      el.classList.toggle('unused', !skull);
      el.setAttribute('aria-disabled', String(!skull));
      el.querySelector('small').textContent = skull
        ? el.querySelector('kbd').textContent === 'O'
          ? '+25%'
          : el.dataset.skullKey
        : '未使用';
      el.setAttribute(
        'aria-label',
        el.querySelector('kbd').textContent +
          '：' +
          (skull ? el.dataset.skullKey : 'コウモリでは使いません')
      );
    }
    $('keyboard-scene-title').textContent = skull
      ? 'ドクロのキー配置'
      : 'コウモリのキー配置';
    $('keyboard-scene-note').textContent = skull
      ? '9 / 0は体数、L / Mは顎、Oは骨の白さ＋25ポイント。Cは顎の自動モード、Vは前景の光です。'
      : '9 / 0、L / M、Oはこの映像では未使用です。Cは旋回の配分、Vは新しい個体の速さと回り方です。';
    $('motion-scene-note').textContent = skull
      ? '動き0%で頭部は定位置に戻って静止します。背景は続くため、映像全体の一時停止はSpaceです。'
      : '動き0%で中央付近にたむろし、羽ばたきは続きます。映像全体の一時停止はSpaceです。';
    $('colour-scene-note').textContent = skull
      ? '背景の色合いを回します。Qは水色、Wは青です。見本は流体の明るい縁の色の目安です。背景には濃い青なども混ざり、骨Glowも連動します。'
      : 'コウモリ本体の色を選びます。元の青は240°、反対側の黄は60°です。白い輪郭や光はそのままなので、見本は本体色の目安です。';
    for (const [key, text] of [
      ['C', skull ? '顎モード' : '旋回の配分'],
      ['V', skull ? '前景の光' : '速さ・旋回']
    ])
      doc.querySelector('[data-key-label="' + key + '"] small').textContent =
        text;
    $('mode-key-description').textContent = skull
      ? '顎を動かす / 閉じる / 開く。手動の顎からは自動へ戻る。'
      : '渦寄り / 中間 / ゆるい旋回の3配分を切り替える。';
    for (let i = 0; i < 8; i++) {
      const sample = look(scene, i / 8);
      for (const el of [
        doc.querySelector(
          '[data-cue-axis="look"][data-position="' + (i + 1) + '"]'
        ),
        doc.querySelector('[data-look-position="' + (i + 1) + '"]')
      ]) {
        el.querySelector('.color-swatch').style.backgroundColor = sample.colour;
        el.querySelector('small').textContent = sample.label;
        el.title =
          (window.HalloweenI18n?.t(sample.label) || sample.label) +
          ' (' +
          sample.degrees.toFixed(1) +
          '°)';
      }
    }
  }
  return Object.freeze({ look, update });
})();

// Developer-only before/after check. Resolve the three placeholders before CLI run-code.
// Top-level loopback pages preserve the preview server's frame-denial headers.
async page => {
  const rows = [], errors = [], out = '__QA_OUT__';
  const test = (name, ok, data) => rows.push({ name, ok: !!ok, data });
  const urls = { baseline: '__BASE_URL__', formatted: '__NEW_URL__' };
  const deterministic = () => {
    let ms = 1000, next = 0, seed = 123456789;
    const callbacks = new Map();
    Object.defineProperty(performance, 'now', { value: () => ms });
    Date.now = () => 1700000000000 + ms;
    Math.random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
    window.requestAnimationFrame = fn => { callbacks.set(++next, fn); return next; };
    window.cancelAnimationFrame = id => callbacks.delete(id);
    window.__readabilityStep = count => {
      for (let i = 0; i < count; i++) {
        ms += 1000 / 60;
        const pending = [...callbacks.values()];
        callbacks.clear();
        for (const fn of pending) fn(ms);
      }
      return { ms, pending: callbacks.size };
    };
  };
  for (const config of [
    { name: 'a-three', scene: 'a', count: 3, glow: .2, hue: .37 },
    { name: 'a-six-glow', scene: 'a', count: 6, glow: .8, hue: .73 },
    { name: 'b-bats', scene: 'b', hue: .25 }
  ]) {
    const captures = {};
    for (const [version, url] of Object.entries(urls)) {
      const p = await page.context().newPage();
      p.on('pageerror', e => errors.push(version + ': ' + e.message));
      p.on('response', r => { if (r.status() >= 400 && !r.url().endsWith('favicon.ico')) errors.push(r.status() + ': ' + r.url()); });
      try {
        await p.setViewportSize({ width: 1280, height: 720 });
        await p.addInitScript(deterministic);
        await p.goto(url);
        await p.waitForFunction(() => !!window.halloweenControls, null, { polling: 100 });
        await p.evaluate(c => {
          const api = halloweenControls;
          api.select(c.scene);
          api.dispatch({ type: 'command', name: 'view.hideControls' });
          api.set(c.scene + '.text', 'HALLOWEEN 12\nabc L');
          api.set('text.sizeNormalized', .42);
          if (c.scene === 'a') {
            api.set('a.actorCount', c.count);
            api.set('a.headGlowMix', c.glow);
            api.set('a.backgroundHue', c.hue);
          } else api.set('b.colorHue', c.hue);
        }, config);
        if (config.scene === 'b') await p.waitForFunction(() => halloweenDiagnostics().sprite?.state === 'ready', null, { polling: 100, timeout: 20000 });
        await p.evaluate(() => document.fonts.ready);
        const shots = [];
        for (const frames of [1, 30, 90, 180]) {
          const previous = shots.at(-1)?.frames || 0;
          await p.evaluate(n => __readabilityStep(n), frames - previous);
          shots.push(await p.evaluate(frames => {
            const canvas = document.getElementById('canvas'), d = halloweenDiagnostics();
            return { frames, png: canvas.toDataURL(), width: canvas.width, height: canvas.height, dpr: devicePixelRatio,
              time: d.time, phase: d.phase, clock: HalloweenMotionClock.system.seconds(),
              sprite: d.sprite?.state, count: d.skull?.scene.count };
          }, frames));
        }
        await p.locator('#canvas').screenshot({ path: out + '/' + config.name + '-' + version + '.png' });
        captures[version] = shots;
        if (version === 'formatted') {
          for (let i = 0; i < shots.length; i++) {
            const a = captures.baseline[i], b = shots[i];
            const diff = await p.evaluate(async ({ a, b }) => {
              const read = async png => {
                const image = new Image(); image.src = png; await image.decode();
                const c = document.createElement('canvas'); c.width = image.width; c.height = image.height;
                const ctx = c.getContext('2d'); ctx.drawImage(image, 0, 0);
                return ctx.getImageData(0, 0, c.width, c.height).data;
              };
              const x = await read(a.png), y = await read(b.png);
              let changedPixels = 0, maxChannelDifference = 0, nonBlackPixels = 0;
              for (let j = 0; j < y.length; j += 4) {
                if (y[j] || y[j+1] || y[j+2]) nonBlackPixels++;
                let changed = false;
                for (let k = 0; k < 4; k++) {
                  const d = Math.abs(x[j+k] - y[j+k]);
                  if (d) changed = true;
                  maxChannelDifference = Math.max(maxChannelDifference, d);
                }
                if (changed) changedPixels++;
              }
              return { changedPixels, maxChannelDifference, nonBlackPixels };
            }, { a, b });
            // B has no births at elapsed zero; retain this cold-frame comparison,
            // while requiring visible output at every later checkpoint.
            const coldB = config.scene === 'b' && b.frames === 1;
            test(config.name + ' frame ' + b.frames + (coldB ? ' cold exact RGBA' : ' visible exact RGBA'),
              a.width === b.width && a.height === b.height && a.time === b.time && a.clock === b.clock &&
              b.width === 1280 && b.height === 720 && a.dpr === 1 && b.dpr === 1 && diff.changedPixels === 0 &&
              (coldB ? diff.nonBlackPixels === 0 : diff.nonBlackPixels > 100),
              { ...diff, width: b.width, height: b.height, dpr: b.dpr, time: b.time, clock: b.clock, count: b.count, sprite: b.sprite });
          }
        }
      } finally {
        await p.evaluate(() => window.halloweenControls?.dispatch({ type: 'command', name: 'application.end' })).catch(() => {});
        await p.close();
      }
    }
  }
  test('no script or asset errors', errors.length === 0, errors);
  return { passed: rows.filter(r => r.ok).length, failed: rows.filter(r => !r.ok).length, rows, errors, browser: page.context().browser().version(),
    scope: 'Same browser/GPU, top-level loopback pages, 1280x720 DPR1, seeded randomness and manually stepped 60Hz clock; full canvas RGBA at 1/30/90/180 frames. No projector or file-protocol claim.' };
}

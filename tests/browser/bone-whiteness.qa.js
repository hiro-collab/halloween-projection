async (page) => {
  const checks = [],
    check = (name, ok, data) => checks.push({ name, ok: !!ok, data });
  await page.waitForFunction(
    () => window.halloweenControls && window.HalloweenAComposite
  );
  const contract = await page.evaluate(() => {
    const a = halloweenControls,
      d = a.getSchema().settings['a.boneWhiteness'];
    return {
      d,
      initial: a.get('a.boneWhiteness'),
      valid: [0, 0.5, 1].map(
        (value) =>
          a.validate({ type: 'set', key: 'a.boneWhiteness', value }).valid
      ),
      invalid: [-0.01, 1.01, NaN, Infinity, null, '0.5'].map(
        (value) =>
          a.validate({ type: 'set', key: 'a.boneWhiteness', value }).valid
      )
    };
  });
  check(
    'bone control defaults to previous appearance and rejects invalid values',
    contract.initial === 0 &&
      contract.d.default === 0 &&
      contract.d.min === 0 &&
      contract.d.max === 1 &&
      contract.valid.every(Boolean) &&
      contract.invalid.every((v) => !v),
    contract
  );
  const pixels = await page.evaluate(() => {
    const head = document.createElement('canvas'),
      text = document.createElement('canvas');
    head.width = text.width = 256;
    head.height = text.height = 144;
    const x = head.getContext('2d');
    x.fillStyle = 'rgb(230,230,230)';
    x.fillRect(80, 36, 96, 72);
    x.clearRect(100, 58, 12, 15);
    x.clearRect(143, 58, 12, 15);
    const dye = new Float32Array(640 * 360);
    for (let y = 0; y < 360; y++)
      for (let x = 0; x < 640; x++)
        dye[y * 640 + x] = 0.1 + 0.18 * Math.sin(x * 0.02) ** 2;
    const c = HalloweenAComposite.create(),
      options = {
        headGlowMix: 0,
        foregroundEnabled: false,
        decorationEnabled: false,
        noiseSeconds: 0
      };
    const outputs = [],
      upstream = [];
    let resources;
    try {
      c.prepare(head, options);
      for (const boneWhiteness of [0, 0.5, 1]) {
        c.draw(head, dye, text, { ...options, boneWhiteness });
        outputs.push(c.read('final').data);
        upstream.push(c.read('headInput').data);
        resources = c.status();
      }
      const mask = c.read('head').data;
      let changedInside = 0,
        changedOutside = 0,
        endpointRangeError = 0,
        sourceDifferences = 0;
      const chroma = [0, 0, 0];
      for (let i = 0; i < mask.length; i += 4) {
        if (mask[i + 3] === 0) {
          for (let k = 0; k < 3; k++)
            if (outputs[0][i + k] !== outputs[2][i + k]) changedOutside++;
        } else {
          if (
            outputs[0][i] !== outputs[2][i] ||
            outputs[0][i + 1] !== outputs[2][i + 1] ||
            outputs[0][i + 2] !== outputs[2][i + 2]
          )
            changedInside++;
          for (let v = 0; v < 3; v++)
            chroma[v] +=
              Math.max(...outputs[v].subarray(i, i + 3)) -
              Math.min(...outputs[v].subarray(i, i + 3));
          for (let k = 0; k < 3; k++)
            endpointRangeError = Math.max(
              endpointRangeError,
              Math.max(
                0,
                Math.min(outputs[0][i + k], outputs[2][i + k]) -
                  outputs[1][i + k],
                outputs[1][i + k] -
                  Math.max(outputs[0][i + k], outputs[2][i + k])
              )
            );
        }
        for (let k = 0; k < 4; k++)
          if (upstream[0][i + k] !== upstream[2][i + k]) sourceDifferences++;
      }
      return {
        changedInside,
        changedOutside,
        endpointRangeError,
        sourceDifferences,
        chroma,
        extraTargets: Object.keys(resources.targets).filter((k) =>
          /bone/i.test(k)
        ),
        error: resources.error
      };
    } finally {
      c.dispose();
    }
  });
  check(
    'white material changes only skull coverage, retaining transparent holes and background',
    pixels.changedInside > 0 && pixels.changedOutside === 0,
    pixels
  );
  check(
    'middle value stays between endpoints and reduces bone tint',
    pixels.endpointRangeError <= 1 &&
      pixels.chroma[0] > pixels.chroma[1] &&
      pixels.chroma[1] > pixels.chroma[2],
    pixels
  );
  check(
    'bone display never changes fluid injection or allocates a new render target',
    pixels.sourceDifferences === 0 &&
      pixels.extraTargets.length === 0 &&
      !pixels.error,
    pixels
  );
  const textOverlap = await page.evaluate(() => {
    const head = document.createElement('canvas'),
      text = document.createElement('canvas'),
      blank = document.createElement('canvas');
    head.width = text.width = blank.width = 256;
    head.height = text.height = blank.height = 144;
    const h = head.getContext('2d');
    h.fillStyle = 'rgb(230,230,230)';
    h.fillRect(80, 36, 96, 72);
    h.clearRect(100, 58, 12, 15);
    h.clearRect(143, 58, 12, 15);
    const t = text.getContext('2d');
    t.fillStyle = '#fff';
    t.fillRect(82, 60, 92, 12);
    const dye = new Float32Array(640 * 360);
    for (let y = 0; y < 360; y++)
      for (let x = 0; x < 640; x++)
        dye[y * 640 + x] = 0.1 + 0.18 * Math.sin(x * 0.02) ** 2;
    const c = HalloweenAComposite.create(),
      pairs = [];
    try {
      c.prepare(head);
      for (const boneWhiteness of [0, 0.5, 1]) {
        const pair = {};
        for (const [label, input] of [
          ['off', blank],
          ['on', text]
        ]) {
          c.draw(head, dye, input, {
            headGlowMix: 0,
            foregroundEnabled: false,
            decorationEnabled: false,
            noiseSeconds: 0,
            boneWhiteness
          });
          pair[label] = c.read('final').data;
        }
        pairs.push(pair);
      }
      const mask = c.read('head').data,
        glyph = c.read('glyph').data,
        sums = pairs.map((pair) => {
          let sum = 0;
          for (let i = 0; i < mask.length; i += 4)
            if (mask[i + 3] > 0 && glyph[i + 3] > 0)
              for (let k = 0; k < 3; k++)
                sum += Math.abs(pair.on[i + k] - pair.off[i + k]);
          return sum;
        });
      return {
        sums,
        ratios: sums.map((v) => v / sums[0]),
        error: c.status().error
      };
    } finally {
      c.dispose();
    }
  });
  // This saturated fixture still has final Level/clipping; reject the former extra 65% text fade.
  check(
    'white bone avoids the former final-overlay text fade',
    textOverlap.sums[0] > 1000 &&
      textOverlap.ratios[1] > 0.9 &&
      textOverlap.ratios[2] > 0.6 &&
      !textOverlap.error,
    textOverlap
  );
  return {
    passed: checks.filter((x) => x.ok).length,
    failed: checks.filter((x) => !x.ok).length,
    checks,
    scope:
      'Validated API, synthetic head mask and saturated text-overlap regression; final Gamma/clipping can still change text contrast; no native model or original media fixture required. Production UI and captured-pose comparisons are checked separately.'
  };
};

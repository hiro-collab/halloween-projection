/* MIT. Source A operator contract; continuous comparison Noise provider is not native-verified. */
'use strict';
window.HalloweenAMotion = (() => {
  const f = Math.fround,
    clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const locked = [
    -0.6899999976158142, 0.0, -0.6899999976158142, 0.6899999976158142,
    -0.6899999976158142, 0.0, -0.6899999976158142, 0.6899999976158142, 0.0, 0.0,
    0.6899999976158142, 0.6899999976158142, 0.0, 0.0, 0.6899999976158142,
    0.6899999976158142, 0.6899999976158142, 0.0, 0.0, 0.6899999976158142,
    0.6899999976158142, 0.0, 0.0, 0.6899999976158142, 0.0, 0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0,
    4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0
  ];
  function finite(a, n, label) {
    if (!a || a.length !== n || Array.from(a).some((v) => !Number.isFinite(v)))
      throw new RangeError(label + ' requires ' + n + ' finite values');
  }
  function circle(frame) {
    if (!Number.isFinite(frame))
      throw new RangeError('Finite source frame required');
    const r = (frame * Math.PI) / 180,
      c = Math.cos(r),
      s = Math.sin(r),
      out = new Float32Array(24);
    for (let i = 0; i < 6; i++) {
      const angle = f((i * 2 * Math.PI) / 6),
        x = f(Math.cos(angle)),
        y = f(Math.sin(angle)),
        k = i * 4;
      out[k] = f((x * c - y * s) * 0.8);
      out[k + 1] = f((x * s + y * c) * 0.4);
      out[k + 3] = 1;
    }
    return out;
  }
  function layout(noises, frame) {
    if (!Array.isArray(noises) || noises.length !== 3)
      throw new RangeError('Three explicit Noise RGBA rows required');
    noises.forEach((a) => finite(a, 24, 'Noise row'));
    const ring = circle(frame),
      out = new Float32Array(72);
    for (let i = 0; i < 24; i++) out[i] = f(f(noises[0][i]) + ring[i]);
    out.set(noises[1], 24);
    out.set(noises[2], 48);
    return out;
  }
  function faderStep(input, baseline, previous, cross) {
    finite(input, 72, 'Layout');
    finite(baseline, 72, 'Locked');
    finite(previous, 72, 'Previous output');
    if (!Number.isFinite(cross) || cross < 0 || cross > 1)
      throw new RangeError('Finite Cross0..1 required');
    const subtract = new Float32Array(72),
      gained = new Float32Array(72),
      added = new Float32Array(72),
      out = new Float32Array(72),
      c = f(cross),
      inv = f(1 - c),
      gain = f(0.98);
    for (let i = 0; i < 72; i++) {
      subtract[i] = f(f(previous[i]) - f(baseline[i]));
      gained[i] = f(subtract[i] * gain);
      added[i] = f(gained[i] + f(baseline[i]));
      out[i] = f(f(f(input[i]) * inv) + f(added[i] * c));
    }
    return { subtract, gained, added, out };
  }
  function compose(head, jaw, mask = null) {
    finite(head, 72, 'Head');
    finite(jaw, 72, 'Jaw');
    if (mask) finite(mask, 72, 'Mask');
    const outside = new Float32Array(72),
      out = new Float32Array(72);
    for (let i = 0; i < 72; i++)
      outside[i] = f(f(head[i]) * f(1 - (mask ? mask[i] : i >= 48 ? 1 : 0)));
    for (let i = 0; i < 72; i += 4) {
      const inverse = f(1 - clamp(outside[i + 3], 0, 1));
      for (let k = 0; k < 4; k++)
        out[i + k] = f(outside[i + k] + f(f(jaw[i + k]) * inverse));
    }
    return { outside, out };
  }
  function map(rgba, { limit = true } = {}) {
    finite(rgba, 72, 'Final motion RGBA');
    return Array.from({ length: 6 }, (_, i) => {
      const p = i * 4,
        rawJaw = f(f(rgba[48 + p]) * f(30));
      return {
        position: [0, 1, 2].map((k) => f(f(rgba[p + k]) * f(3.31))),
        rotation: [0, 1, 2].map((k) => f(f(rgba[24 + p + k]) * f(180))),
        jaw: limit ? clamp(rawJaw, 0, 90) : rawJaw
      };
    });
  }
  // Independent seeded simplex3D comparison. Native period-control confirms tz is a direct Noise-space translation, not divided by spatial Period. Seed/RGB offsets/spatial coordinates remain unverified.
  const gradients = [
    [1, 1, 0],
    [-1, 1, 0],
    [1, -1, 0],
    [-1, -1, 0],
    [1, 0, 1],
    [-1, 0, 1],
    [1, 0, -1],
    [-1, 0, -1],
    [0, 1, 1],
    [0, -1, 1],
    [0, 1, -1],
    [0, -1, -1]
  ];
  function hash(i, j, k, seed) {
    let n =
      Math.imul(i, 374761393) ^
      Math.imul(j, 668265263) ^
      Math.imul(k, 2147483647) ^
      Math.imul(seed, 1274126177);
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return (n ^ (n >>> 16)) >>> 0;
  }
  function simplex(x, y, z, seed) {
    const skew = (x + y + z) / 3,
      i = Math.floor(x + skew),
      j = Math.floor(y + skew),
      k = Math.floor(z + skew),
      unskew = (i + j + k) / 6,
      x0 = x - i + unskew,
      y0 = y - j + unskew,
      z0 = z - k + unskew;
    let a, b;
    if (x0 >= y0) {
      if (y0 >= z0) {
        a = [1, 0, 0];
        b = [1, 1, 0];
      } else if (x0 >= z0) {
        a = [1, 0, 0];
        b = [1, 0, 1];
      } else {
        a = [0, 0, 1];
        b = [1, 0, 1];
      }
    } else if (y0 < z0) {
      a = [0, 0, 1];
      b = [0, 1, 1];
    } else if (x0 < z0) {
      a = [0, 1, 0];
      b = [0, 1, 1];
    } else {
      a = [0, 1, 0];
      b = [1, 1, 0];
    }
    const corners = [[0, 0, 0], a, b, [1, 1, 1]];
    let sum = 0;
    for (let n = 0; n < 4; n++) {
      const c = corners[n],
        dx = x0 - c[0] + n / 6,
        dy = y0 - c[1] + n / 6,
        dz = z0 - c[2] + n / 6,
        t = 0.6 - dx * dx - dy * dy - dz * dz;
      if (t > 0) {
        const g = gradients[hash(i + c[0], j + c[1], k + c[2], seed) % 12];
        sum += t * t * t * t * (g[0] * dx + g[1] * dy + g[2] * dz);
      }
    }
    return 32 * sum;
  }
  const noiseParameters = Object.freeze(
    [
      { seed: 1, period: 0.05, amp: 0.2, exponent: 1 },
      { seed: 2, period: 1, amp: 0.28, exponent: 1 },
      { seed: 3, period: 0.12, amp: 2, exponent: 4 }
    ].map(Object.freeze)
  );
  function comparisonNoise(seconds, options = {}) {
    if (!Number.isFinite(seconds) || seconds < 0)
      throw new RangeError('Nonnegative continuous time required');
    return noiseParameters.map((source, index) => {
      const p = { ...source };
      if (index === 0) {
        p.period = options.positionNoisePeriod ?? p.period;
        p.amp = options.positionNoiseAmplitude ?? p.amp;
      }
      if (index === 1) {
        p.period = options.rotationNoisePeriod ?? p.period;
        p.amp = options.rotationNoiseAmplitude ?? p.amp;
      }
      if (index === 2) {
        p.period = options.jawPeriod ?? p.period;
        p.exponent = options.jawExponent ?? p.exponent;
        p.amp = options.jawNoiseAmplitude ?? p.amp;
      }
      if (
        !Number.isFinite(p.period) ||
        p.period <= 0 ||
        !Number.isFinite(p.exponent) ||
        p.exponent <= 0
      )
        throw new RangeError('Positive jaw Period/Exponent required');
      const out = new Float32Array(24);
      for (let i = 0; i < 6; i++) {
        for (let c = 0; c < 3; c++) {
          const n =
            simplex((i - 2.5) / p.period, 0, -seconds, p.seed * 131 + c * 997) *
            p.amp;
          out[i * 4 + c] = f(Math.sign(n) * Math.pow(Math.abs(n), p.exponent));
        }
        out[i * 4 + 3] = 1;
      }
      return out;
    });
  }
  function jawSwitch(row, mode = 'noise') {
    finite(row, 24, 'Jaw Noise');
    if (!['noise', 'closed', 'open'].includes(mode))
      throw new RangeError('Jaw mode required');
    if (mode === 'noise') return row;
    const out = new Float32Array(24);
    for (let i = 0; i < 24; i++)
      out[i] = mode === 'open' ? 4 : i % 4 === 3 ? 1 : 0;
    return out;
  }
  function controlledLayout(noises, frame, values) {
    return layout(
      [noises[0], noises[1], jawSwitch(noises[2], values.jawMode ?? 'noise')],
      frame
    );
  }
  function create({
    noiseProvider = comparisonNoise,
    lockedHead = locked,
    lockedJaw = locked,
    sourceClock = window.HalloweenMotionClock?.system,
    motionCross = 0.5,
    controlLagState = null,
    jawPeriod = 0.12,
    jawExponent = 4,
    jawMode = 'noise',
    jawNoiseAmplitude = 2,
    positionNoiseAmplitude = 0.2,
    positionNoisePeriod = 0.05,
    rotationNoiseAmplitude = 0.28,
    rotationNoisePeriod = 1
  } = {}) {
    if (!sourceClock || !window.HalloweenAMotionLag)
      throw new TypeError(
        'Load motion-clock.js and a-motion-lag.js before a-motion.js'
      );
    if (!Number.isFinite(motionCross) || motionCross < 0 || motionCross > 1)
      throw new RangeError('Motioncross0..1 required');
    let lastSourceSeconds = sourceClock.seconds(),
      pendingSourceSeconds = 0,
      lastHeadCross = 0.7 + 0.3 * motionCross,
      lastJawCross = 0.761;
    const controlLag =
      controlLagState ?? window.HalloweenAMotionLag.create(lastHeadCross);
    if (
      !controlLag ||
      typeof controlLag.step !== 'function' ||
      typeof controlLag.value !== 'function' ||
      typeof controlLag.profile !== 'function'
    )
      throw new TypeError('Lag state interface required');
    lastHeadCross = controlLag.value();
    finite(lockedHead, 72, 'Locked head');
    finite(lockedJaw, 72, 'Locked jaw');
    const lh = new Float32Array(lockedHead),
      lj = new Float32Array(lockedJaw);
    let head = new Float32Array(lh),
      jaw = new Float32Array(lj),
      final = compose(head, jaw).out,
      poses = map(final),
      release = 0,
      wasReset = true,
      steps = 0,
      pending = 0,
      headSeconds = lastSourceSeconds,
      jawSeconds = lastSourceSeconds,
      receivedSeconds = 0,
      droppedSeconds = 0,
      disposed = false;
    function step({
      input,
      jawInput = input,
      headCross = 0.85,
      jawCross = 0.761,
      reset = false
    } = {}) {
      if (disposed) throw new Error('Motion disposed');
      finite(input, 72, 'Layout');
      finite(jawInput, 72, 'Jaw layout');
      if (typeof reset !== 'boolean')
        throw new RangeError('Reset boolean required');
      if (reset) {
        release = 0;
        wasReset = true;
      } else if (wasReset) {
        release = 0;
        wasReset = false;
      }
      const useLocked = reset || release < 2,
        consumer = map(final),
        rawConsumer = map(final, { limit: false }),
        h = faderStep(input, lh, useLocked ? lh : head, headCross),
        j = faderStep(jawInput, lj, useLocked ? lj : jaw, jawCross),
        merged = compose(h.out, j.out);
      head = h.out;
      jaw = j.out;
      final = merged.out;
      poses = consumer;
      if (!reset) release++;
      steps++;
      return {
        head: h,
        jaw: j,
        outside: merged.outside,
        final: new Float32Array(final),
        consumerPoses: consumer,
        rawConsumerPoses: rawConsumer,
        usedLocked: useLocked
      };
    }
    function advance(delta, values) {
      if (disposed) return;
      if (!Number.isFinite(delta) || delta < 0)
        throw new RangeError('Nonnegative elapsed required');
      if (
        !values ||
        !Number.isFinite(values.headRate) ||
        values.headRate < 0 ||
        !Number.isFinite(values.jawRate) ||
        values.jawRate < 0
      )
        throw new RangeError('Nonnegative finite head/jaw rates required');
      const sourceControl = values.motionCross ?? motionCross;
      if (
        !Number.isFinite(sourceControl) ||
        sourceControl < 0 ||
        sourceControl > 1
      )
        throw new RangeError('Motioncross0..1 required');
      if (
        values.resetHeld !== undefined &&
        typeof values.resetHeld !== 'boolean'
      )
        throw new RangeError('Reset hold boolean required');
      for (const key of ['headCross', 'jawCross'])
        if (
          values[key] !== undefined &&
          (!Number.isFinite(values[key]) || values[key] < 0 || values[key] > 1)
        )
          throw new RangeError(key + '0..1 required');
      const now = sourceClock.seconds();
      if (!Number.isFinite(now) || now < lastSourceSeconds)
        throw new RangeError('Monotonic source seconds required');
      pendingSourceSeconds += now - lastSourceSeconds;
      lastSourceSeconds = now;
      receivedSeconds += delta;
      pending += delta;
      const count = Math.floor((pending + 1e-9) * 60);
      pending -= count / 60;
      if (Math.abs(pending) < 1e-9) pending = 0;
      // CHOP control lag keeps elapsed 60Hz samples; TOP Feedback cooks once.
      const sourceElapsed = pendingSourceSeconds;
      pendingSourceSeconds = 0;
      headSeconds += sourceElapsed * values.headRate;
      jawSeconds += sourceElapsed * values.jawRate;
      let filteredCross = controlLag.value();
      for (let i = 0; i < count; i++)
        filteredCross = controlLag.step(0.7 + 0.3 * sourceControl);
      lastHeadCross =
        values.headCross ?? Math.min(1, Math.max(0, filteredCross));
      lastJawCross = values.jawCross ?? 0.761;
      if (delta > 0) {
        const input = controlledLayout(
            noiseProvider(headSeconds, values),
            headSeconds * 60,
            values
          ),
          jawInput =
            values.headRate === values.jawRate
              ? input
              : controlledLayout(
                  noiseProvider(jawSeconds, values),
                  headSeconds * 60,
                  values
                );
        step({
          input,
          jawInput,
          headCross: lastHeadCross,
          jawCross: lastJawCross,
          reset: values.resetHeld ?? false
        });
      }
      motionCross = sourceControl;
      return delta > 0 ? 1 : 0;
    }

    // Seed feedback independently from the app-wide absolute Noise/Circle clock.
    step({
      input: controlledLayout(
        noiseProvider(headSeconds, {
          jawPeriod,
          jawExponent,
          jawNoiseAmplitude,
          positionNoiseAmplitude,
          positionNoisePeriod,
          rotationNoiseAmplitude,
          rotationNoisePeriod
        }),
        headSeconds * 60,
        { jawMode }
      ),
      headCross: lastHeadCross,
      jawCross: lastJawCross,
      reset: true
    });
    release = 1;
    wasReset = false;
    steps = 0;
    poses = map(final);
    return Object.freeze({
      step,
      advance,
      poses: () =>
        poses.map((p) => ({
          position: [...p.position],
          rotation: [...p.rotation],
          jaw: p.jaw
        })),
      status: () => ({
        steps,
        headSeconds,
        jawSeconds,
        receivedSeconds,
        droppedSeconds,
        pendingSeconds: pending,
        sourceCircleSecondsPerTurn: 6,
        headCross: lastHeadCross,
        jawCross: lastJawCross,
        motionCross,
        controlLag: controlLag.profile(),
        sourceClock: sourceClock.kind,
        pendingSourceSeconds,
        logicCriterion:
          'operator/control/topology; stochastic samples may differ',
        feedbackGain: 0.98,
        producerDelayTicks: 1,
        resetReleaseLockedTicks: 2,
        noiseMatch:
          noiseProvider === comparisonNoise
            ? 'unverified seeded simplex3D comparison'
            : 'explicit provided function; caller must establish native match',
        operatorContract:
          'RGBA Outside/Over; Feedback once per rendered producer cook; elapsed 60Hz control-lag samples',
        feedbackCadence: 'actual producer cook',
        controlLagCadence: 'elapsed60Hz samples',
        disposed
      }),
      dispose() {
        disposed = true;
        head = jaw = final = null;
        poses = [];
      }
    });
  }
  return Object.freeze({
    circle,
    layout,
    faderStep,
    compose,
    map,
    simplex,
    comparisonNoise,
    jawSwitch,
    controlledLayout,
    noiseParameters,
    create,
    lockedState: () => new Float32Array(locked)
  });
})();

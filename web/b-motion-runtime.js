/* MIT. Continuous B candidate. Native birth RNG and turbulence remain approximations. */
'use strict';
window.HalloweenBMotion = (() => {
  const DT = 1 / 60,
    FDT = Math.fround(DT),
    LIFE = 5,
    SLOTS = 40;
  const finite = (x, label) => {
    if (!Number.isFinite(x)) throw new RangeError(label + ' must be finite');
    return x;
  };
  const nonnegative = (x, label) => {
    finite(x, label);
    if (x < 0) throw new RangeError(label + ' must be nonnegative');
    return x;
  };
  // Own deterministic per-birth RNG, never a recorded-time replay. Not TD's RNG.
  function comparisonBirthAge({ id, dt = DT, seed = 1 }) {
    let n = (id + 1) ^ Math.imul(seed, 0x9e3779b1);
    n = Math.imul(n ^ (n >>> 16), 0x7feb352d);
    n = Math.imul(n ^ (n >>> 15), 0x846ca68b);
    return (((n ^ (n >>> 16)) >>> 0) / 4294967296) * dt;
  }
  // Static seeded gradient field. Original Particle turbulence depends on world
  // position/Period, not elapsed time or a particle's current array index.
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
  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10),
    mix = (a, b, t) => a + (b - a) * t;
  function gradientHash(x, y, z, seed) {
    let n =
      Math.imul(x, 374761393) ^
      Math.imul(y, 668265263) ^
      Math.imul(z, 2147483647) ^
      Math.imul(seed, 1274126177);
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return (n ^ (n >>> 16)) >>> 0;
  }
  function spatialNoise(x, y, z, seed) {
    const ix = Math.floor(x),
      iy = Math.floor(y),
      iz = Math.floor(z),
      fx = x - ix,
      fy = y - iy,
      fz = z - iz,
      u = fade(fx),
      v = fade(fy),
      w = fade(fz),
      values = [];
    for (let dz = 0; dz < 2; dz++)
      for (let dy = 0; dy < 2; dy++)
        for (let dx = 0; dx < 2; dx++) {
          const g =
            gradients[
              gradientHash(ix + dx, iy + dy, iz + dz, seed) % gradients.length
            ];
          values.push(g[0] * (fx - dx) + g[1] * (fy - dy) + g[2] * (fz - dz));
        }
    return Math.max(
      -1,
      Math.min(
        1,
        mix(
          mix(mix(values[0], values[1], u), mix(values[2], values[3], u), v),
          mix(mix(values[4], values[5], u), mix(values[6], values[7], u), v),
          w
        )
      )
    );
  }
  function comparisonTurbulence({
    position,
    seed = 1,
    period = 0.03,
    amplitude = [0.2, 0.2, 0.2]
  }) {
    if (
      !position ||
      position.length !== 3 ||
      position.some((v) => !Number.isFinite(v))
    )
      throw new RangeError('Three finite world coordinates required');
    if (
      !Number.isFinite(period) ||
      period <= 0 ||
      !Number.isFinite(seed) ||
      !amplitude ||
      amplitude.length !== 3 ||
      amplitude.some((v) => !Number.isFinite(v) || v < 0)
    )
      throw new RangeError(
        'Positive spatial Period, finite seed and nonnegative axis amplitudes required'
      );
    const p = position.map((v) => v / period);
    return amplitude.map(
      (amp, axis) => amp * spatialNoise(...p, seed * 131 + axis * 997)
    );
  }
  function parameters(settings = {}) {
    const mix = settings.motionMix ?? 0.5,
      gain = settings.forceGain ?? 1;
    finite(mix, 'motionMix');
    finite(gain, 'forceGain');
    if (gain < 0 || gain > 1) throw new RangeError('forceGain requires0..1');
    if (mix < 0 || mix > 1) throw new RangeError('motionMix requires0..1');
    return {
      Forcegain: gain,
      Initialspeed: nonnegative(settings.initialSpeed ?? 1.3, 'initialSpeed'),
      Cross: mix,
      ForceCross: gain * mix,
      Vortex: 5 - 4 * gain * mix,
      Spiral: -1.7 + 0.8 * gain * mix,
      rotationCross: 0.77 * (1 - mix)
    };
  }
  // The measured native field is retained at full strength. Quiet circulation
  // fades, while inward force is softened near the center to avoid collapsing
  // old particles into one point. Its finite return rate uses source drag/life.
  function motionForce(api, point, p, center, quietReturnRate = 2) {
    const force = api.force(point, p.Vortex, p.Spiral, center);
    if (p.Forcegain === 1) return force;
    const x = point.x - center[0],
      y = point.y - center[1],
      r = Math.hypot(x, y);
    if (!r) return force;
    const nx = x / r,
      ny = y / r,
      tx = -ny,
      ty = nx,
      tangent = force[0] * tx + force[1] * ty,
      radial = force[0] * nx + force[1] * ny;
    const quietScale = Math.min(
        1,
        (quietReturnRate * r) / Math.max(1e-12, Math.abs(radial))
      ),
      radialScale = p.Forcegain + (1 - p.Forcegain) * quietScale;
    return [
      tangent * p.Forcegain * tx + radial * radialScale * nx,
      tangent * p.Forcegain * ty + radial * radialScale * ny,
      force[2]
    ];
  }

  function create({
    particleAPI = window.HalloweenBatParticle,
    signals = window.HalloweenBatSignals,
    sparseField,
    birthAgeProvider = comparisonBirthAge,
    turbulenceProvider = comparisonTurbulence,
    turbulencePhase = 'array-index',
    turbulenceAmplitude = [0.2, 0.2, 0.2],
    turbulencePeriod = 0.03,
    phaseAPI = window.HalloweenBatPhase,
    sourceClock = null,
    seed = 1,
    externalForce = [0.1, 0.1, 0.1],
    drag = 5,
    forceEnabled = true,
    phaseFrameOffset = 0
  } = {}) {
    if (!particleAPI || !signals || !sparseField)
      throw new TypeError('Particle, Signals and Sparse field required');
    if (!phaseAPI)
      throw new TypeError('Load bat-phase.js before b-motion-runtime.js');
    const phaseState = phaseAPI.create();
    if (!['array-index', 'birth-id'].includes(turbulencePhase))
      throw new RangeError('Explicit turbulence phase required');
    if (
      typeof birthAgeProvider !== 'function' ||
      typeof turbulenceProvider !== 'function'
    )
      throw new TypeError('Providers must be functions');
    if (
      externalForce.length !== 3 ||
      externalForce.some((v) => !Number.isFinite(v))
    )
      throw new RangeError('Three external-force values required');
    if (
      !Array.isArray(turbulenceAmplitude) ||
      turbulenceAmplitude.length !== 3 ||
      turbulenceAmplitude.some((v) => !Number.isFinite(v) || v < 0) ||
      !Number.isFinite(turbulencePeriod) ||
      turbulencePeriod <= 0
    )
      throw new RangeError(
        'Nonnegative turbulence axes and positive spatial Period required'
      );
    turbulenceAmplitude = [...turbulenceAmplitude];
    nonnegative(drag, 'drag');
    finite(seed, 'seed');
    finite(phaseFrameOffset, 'phase frame offset');
    if (
      sourceClock &&
      (typeof sourceClock.seconds !== 'function' ||
        !Number.isFinite(sourceClock.seconds()) ||
        sourceClock.seconds() < 0)
    )
      throw new TypeError('Monotonic absolute source clock required');
    let lastSourceSeconds = sourceClock ? sourceClock.seconds() : 0,
      lastCenter = [0, 0, 0.03];
    let clock = particleAPI.createBirthClock(),
      flock = [],
      births = 0,
      steps = 0,
      flightTime = 0,
      flapTime = lastSourceSeconds,
      pending = 0,
      receivedSeconds = 0,
      phasePending = 0,
      phaseTicks = 0,
      phaseCooks = 0,
      orientationExtendedSamples = 0,
      peakCount = 0,
      disposed = false,
      lastEvent = null,
      lastSettings = {};
    function orientationNoise(x, y, z, track = false) {
      const position = [x, y, z],
        edge = position.map((v) => Math.max(-0.8, Math.min(0.8, v))),
        sample = sparseField.sample(x, y, z);
      if (position.every((v, i) => v === edge[i])) return sample;
      // Keep all measured in-grid values. Beyond the measured cube, extend the
      // static field continuously from its boundary instead of freezing position.
      // The extension is an independent seeded field, not Native sample equality.
      if (track) orientationExtendedSamples++;
      return (
        sample + 360 * (spatialNoise(x, y, z, 131) - spatialNoise(...edge, 131))
      );
    }
    // Initial speed is read at birth; changing it does not overwrite velocities of bats already flying.
    function step(
      settings = {},
      aspectY = 720 / 1280,
      phaseFrame = Math.floor(flapTime * 60 + 1e-8) + phaseFrameOffset,
      updatePhase = true
    ) {
      if (disposed) throw new Error('Motion disposed');
      finite(aspectY, 'aspectY');
      const p = parameters(settings),
        center = [settings.emitterX ?? 0, settings.emitterY ?? 0, 0.03];
      center.forEach((v) => finite(v, 'Emitter center'));
      lastCenter = center;
      flightTime += DT;
      steps++;
      lastSettings = { ...settings };
      const oldIndices = new Map(flock.map((b, i) => [b.i, i]));
      // Update old occupants before freeing slots and allocating newborns.
      for (let i = 0; i < flock.length; i++) {
        const b = flock[i];
        b.age = Math.fround(b.age + FDT);
        const phase = turbulencePhase === 'birth-id' ? b.i : i;
        const noise = turbulenceProvider({
          seconds: flightTime,
          step: steps,
          phase,
          id: b.i,
          arrayIndex: i,
          position: [b.x, b.y, b.z],
          seed,
          period: turbulencePeriod,
          amplitude: turbulenceAmplitude
        });
        if (
          !noise ||
          noise.length !== 3 ||
          Array.from(noise).some((v) => !Number.isFinite(v))
        )
          throw new RangeError('Three finite turbulence values required');
        const force = forceEnabled
            ? motionForce(particleAPI, b, p, center, (2 * drag) / LIFE)
            : [0, 0, 0],
          previous = [b.x, b.y, b.z];
        particleAPI.integrate(
          b,
          ...externalForce.map((v, j) => v + force[j] + noise[j]),
          FDT,
          drag
        );
        for (const key of ['vx', 'vy', 'vz']) b[key] = Math.fround(b[key]);
        ['x', 'y', 'z'].forEach(
          (key, j) =>
            (b[key] = Math.fround(
              previous[j] + Math.fround(b[['vx', 'vy', 'vz'][j]] * FDT)
            ))
        );
      }
      const removedIds = flock.filter((b) => b.age >= LIFE).map((b) => b.i);
      flock = flock.filter((b) => b.age < LIFE);
      const born = [];
      for (let n = clock.step(); n > 0; n--) {
        const id = births,
          age = birthAgeProvider({
            id,
            step: steps,
            seconds: flightTime,
            dt: DT,
            seed
          });
        finite(age, 'birth age');
        if (age < 0 || age > DT)
          throw new RangeError('Birth age must lie inside the current tick');
        const used = new Set(flock.map((b) => b.storageSlot));
        let slot = 0;
        while (used.has(slot)) slot++;
        const point = particleAPI.birth(
          id,
          p.Initialspeed,
          Math.fround(age),
          center
        );
        flock.push({
          ...point,
          i: id,
          id,
          storageSlot: slot,
          spawnSpeed: p.Initialspeed,
          birthStep: steps,
          birthAge: Math.fround(age),
          birthSeconds: flightTime - age
        });
        born.push({ id, age: Math.fround(age), storageSlot: slot });
        births++;
      }
      flock.sort((a, b) => a.storageSlot - b.storageSlot);
      const reindexed = [];
      for (let i = 0; i < flock.length; i++) {
        const b = flock[i],
          old = oldIndices.get(b.i);
        if (old !== undefined && old !== i)
          reindexed.push({ id: b.i, from: old, to: i });
        b.directionAngle = Math.atan2(b.vy, b.vx) - Math.PI / 2;
        b.noiseAngle =
          (orientationNoise(b.x, b.y * aspectY, b.z, true) * Math.PI) / 180;
        b.angle = -(
          b.noiseAngle * (1 - p.rotationCross) +
          b.directionAngle * p.rotationCross
        );
      }
      if (updatePhase) phaseState.update(flock.length, phaseFrame);
      peakCount = Math.max(peakCount, flock.length);
      lastEvent = {
        step: steps,
        seconds: flightTime,
        removedIds,
        born,
        reindexed,
        turbulencePhase
      };
      return {
        ...lastEvent,
        born: born.map((b) => ({ ...b })),
        reindexed: reindexed.map((b) => ({ ...b }))
      };
    }
    // Flight integration and wing phase keep separate accumulators so rendering does not choose the wing frame.
    function advance(delta, settings = {}, { aspectY = 720 / 1280 } = {}) {
      if (disposed) throw new Error('Motion disposed');
      nonnegative(delta, 'elapsed');
      parameters(settings);
      const speed = nonnegative(settings.speed ?? 1, 'flight rate'),
        flapRate = nonnegative(settings.flapRate ?? 1, 'flap rate'),
        oldFlap = flapTime,
        oldPending = pending,
        oldPhasePending = phasePending;
      const locked = (settings.frameLock ?? null) !== null;
      const sourceNow = sourceClock
        ? sourceClock.seconds()
        : lastSourceSeconds + delta;
      if (!Number.isFinite(sourceNow) || sourceNow < lastSourceSeconds)
        throw new RangeError('Monotonic source seconds required');
      const sourceDelta = sourceNow - lastSourceSeconds;
      lastSourceSeconds = sourceNow;
      receivedSeconds += delta;
      if (!locked) flapTime += sourceDelta * flapRate;
      pending += delta * speed;
      const ticks = Math.floor((pending + 1e-9) / DT);
      pending -= ticks * DT;
      if (Math.abs(pending) < 1e-9) pending = 0;
      phasePending += delta;
      const cooks = Math.floor((phasePending + 1e-9) / DT);
      phasePending -= cooks * DT;
      if (Math.abs(phasePending) < 1e-9) phasePending = 0;
      // Particle solver retains fixed steps. At this actual cook, the single current
      // phase/count input is held over every elapsed Trail Time Slice sample.
      for (let i = 0; i < ticks; i++) step(settings, aspectY, 0, false);
      if (cooks) {
        phaseState.capture(
          flock.length,
          Math.floor(flapTime * 60 + 1e-8) + phaseFrameOffset,
          cooks
        );
        phaseTicks += cooks;
        phaseCooks++;
      }
      return ticks;
    }

    function poses({
      motionMix = lastSettings.motionMix ?? 0.5,
      aspectY = 720 / 1280,
      frameLock = null
    } = {}) {
      if (disposed || !flock.length) return [];
      const mix = parameters({ motionMix }).rotationCross,
        points = Array.from(
          { length: SLOTS },
          (_, i) => flock[Math.min(i, flock.length - 1)]
        );
      const lag = signals.lagAngles(
        points.map((b) => (b.directionAngle * 180) / Math.PI)
      );
      const indices = phaseState.indices(frameLock);
      return points.map((b, i) => ({
        tx: b.x,
        ty: b.y * aspectY,
        tz: b.z,
        rz:
          orientationNoise(b.x, b.y * aspectY, b.z) * (1 - mix) + lag[i] * mix,
        index: indices[i]
      }));
    }
    function status() {
      return {
        steps,
        births,
        flightTime,
        flapTime,
        flapFrame: Math.floor(flapTime * 60 + 1e-8),
        receivedSeconds,
        pendingSeconds: pending,
        phasePendingSeconds: phasePending,
        phaseTicks,
        phaseCooks,
        phaseCookHz: 60,
        phaseSampleHz: 60,
        phaseSampling: 'current input held across elapsed Time Slice',
        phaseClockDomain: sourceClock
          ? 'shared absolute transport; current-frame-hold Time Slice'
          : 'legacy integrated clock; current-frame-hold Time Slice',
        phaseUsesSharedClock: !!sourceClock,
        sourceClock: sourceClock?.kind ?? 'legacy integrated clock',
        sourceSeconds: lastSourceSeconds,
        emitterCenter: [...lastCenter],
        forceCenter: [...lastCenter],
        forceCenterMode:
          'mean of translated source sphere; follows current emitter; existing particles are not teleported',
        droppedSeconds: 0,
        particleCount: flock.length,
        peakCount,
        liveIds: flock.map((b) => b.i),
        storageSlots: flock.map((b) => b.storageSlot),
        forceParameters: parameters(lastSettings),
        forceEnvelope:
          'Fade tangent;soften native inward force near center to2*drag/life return rate;no point clamp/ring/teleport;external,turbulence,drag,clock unchanged',
        quietReturnRate: (2 * drag) / LIFE,
        dt: DT,
        solverDt: FDT,
        birthRate: 5,
        life: LIFE,
        slots: SLOTS,
        emitterCount: particleAPI.emitterCount,
        initialSpeed: parameters(lastSettings).Initialspeed,
        birthAgeMode:
          birthAgeProvider === comparisonBirthAge
            ? 'own-seeded-uniform-comparison'
            : 'explicit-provider; caller establishes native match',
        birthJitterMatched: false,
        turbulenceMode:
          turbulenceProvider === comparisonTurbulence
            ? 'seeded-spatial-gradient-comparison'
            : 'explicit-provider; caller establishes native match',
        orientationField: {
          measuredBounds: [-0.8, 0.8],
          outsideMode: 'continuous boundary-anchored seeded extension',
          extendedSamples: orientationExtendedSamples,
          nativeOutsideValuesMatched: false
        },
        turbulencePhase,
        turbulenceLogic: {
          position: 'world xyz before integration',
          period: turbulencePeriod,
          amplitude: [...turbulenceAmplitude],
          seed,
          explicitTimeDependence: false,
          indexDependence: false,
          fieldValuesMatchNative: false
        },
        phaseFrameOffset,
        phaseResponseCapacity: 40,
        phaseResponseOverflow: flock.length > 40,
        phaseState: phaseState.status(),
        nativeMotionMatched: false,
        updateOrder:
          'age/integrate existing -> delete expired -> birth into lowest free storage slot',
        storageOrderMatch: 'native659steps atBirth5/Life5',
        phaseClockOriginMatched: false,
        phaseTemporalRatesMatched: false,
        ageStorage: 'float32',
        kinematicStorage:
          'float32 dt, velocity and displacement before position addition',
        lastEvent,
        disposed
      };
    }
    function snapshot() {
      return { ...status(), particles: flock.map((b) => ({ ...b })) };
    }
    function reset() {
      if (disposed) throw new Error('Motion disposed');
      clock = particleAPI.createBirthClock();
      flock = [];
      births =
        steps =
        flightTime =
        pending =
        receivedSeconds =
        phasePending =
        phaseTicks =
        phaseCooks =
        orientationExtendedSamples =
        peakCount =
          0;
      lastSourceSeconds = sourceClock ? sourceClock.seconds() : 0;
      flapTime = lastSourceSeconds;
      lastCenter = [0, 0, 0.03];
      lastEvent = null;
      lastSettings = {};
      phaseState.reset();
    }
    function dispose() {
      if (disposed) return;
      disposed = true;
      flock = [];
      lastEvent = null;
      clock = null;
      phaseState.reset();
    }
    return Object.freeze({
      advance,
      step,
      poses,
      parameters,
      status,
      snapshot,
      reset,
      dispose
    });
  }
  return Object.freeze({
    create,
    parameters,
    motionForce,
    comparisonBirthAge,
    comparisonTurbulence
  });
})();

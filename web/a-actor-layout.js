/* Presentation layout only. Original six motionMat states stay alive unchanged. */
'use strict';
window.HalloweenActorLayout = (() => {
  // A quiet middle band for two-line text. Each row is symmetric about x=.5.
  const top = 0.13,
    bottom = 0.87;
  const slots = Object.freeze({
    1: [[0.5, top]],
    2: [
      [0.5, top],
      [0.5, bottom]
    ],
    3: [
      [0.3, top],
      [0.5, bottom],
      [0.7, top]
    ],
    4: [
      [0.3, top],
      [0.3, bottom],
      [0.7, top],
      [0.7, bottom]
    ],
    5: [
      [0.22, top],
      [0.34, bottom],
      [0.5, top],
      [0.66, bottom],
      [0.78, top]
    ],
    6: [
      [0.22, top],
      [0.22, bottom],
      [0.5, top],
      [0.5, bottom],
      [0.78, top],
      [0.78, bottom]
    ]
  });
  const sourceSlots = Object.freeze({
    1: [0],
    2: [0, 3],
    3: [0, 2, 4],
    4: [0, 1, 3, 4],
    5: [0, 1, 2, 4, 5],
    6: [0, 1, 2, 3, 4, 5]
  });
  function sourceIndices(count) {
    if (!Number.isInteger(count) || count < 1 || count > 6)
      throw RangeError('Actor count1..6 required');
    return [...sourceSlots[count]];
  }
  const duration = 0.28,
    travel = [0.007, 0.007];
  function create() {
    let count = 0,
      elapsed = duration,
      from = [],
      current = [],
      target = [];
    function sample(n, dt, paused = false) {
      if (!Number.isInteger(n) || n < 1 || n > 6)
        throw RangeError('Actor count1..6 required');
      if (n !== count) {
        from = Array.from({ length: 6 }, (_, i) =>
          current[i] && i < count
            ? [...current[i]]
            : [...(slots[n][i] ?? current[i] ?? slots[n][0])]
        );
        target = Array.from({ length: 6 }, (_, i) => [
          ...(slots[n][i] ?? from[i])
        ]);
        elapsed = count && !paused ? 0 : duration;
        count = n;
      }
      elapsed = paused
        ? duration
        : Math.min(duration, elapsed + Math.max(0, dt));
      const f = elapsed / duration,
        e = f * f * (3 - 2 * f);
      current = target.map((p, i) =>
        p.map((v, k) => from[i][k] + (v - from[i][k]) * e)
      );
      return current.slice(0, n).map((p) => [...p]);
    }
    return Object.freeze({
      sample,
      status: () => ({
        count,
        elapsed,
        duration,
        transitioning: elapsed < duration,
        anchors: current.slice(0, count).map((p) => [...p]),
        travel: [...travel],
        translationUnits: 'screen height per source world unit at Z0',
        policy:
          'symmetric rows; linear isotropic XY; layout-only smoothstep; Pause immediate'
      })
    });
  }
  // Lifecycle triggers own the target; the value channel owns elapsed interpolation.
  // Fixed slot identities keep surviving actors and all six source histories intact.
  const presenceDuration = 0.2,
    presenceSources = Object.freeze([0, 2, 4, 1, 3, 5]);
  // Quintic S curve and an analytic damped step. The tail settles exactly at .2s.
  const smootherstep = (t) =>
    Math.max(0, Math.min(1, t * t * t * (t * (t * 6 - 15) + 10)));
  // Comparison candidates share v47's200ms duration and normalized peak time.
  const springFrequency = 8 * Math.sqrt(1 - 0.75 ** 2);
  function createPresence(
    initialCount = 3,
    entryStyle = 'spring',
    springOvershoot = 0.06
  ) {
    if (![0.06, 0.08].includes(springOvershoot))
      throw RangeError('Presence overshoot6% or comparison8% required');
    const springLog = -Math.log(springOvershoot),
      springDamping = springLog / Math.hypot(Math.PI, springLog),
      springPhase = springFrequency / Math.sqrt(1 - springDamping ** 2);
    function springStep(t) {
      const response =
        1 -
        Math.exp(-springDamping * springPhase * t) *
          (Math.cos(springFrequency * t) +
            ((springDamping * springPhase) / springFrequency) *
              Math.sin(springFrequency * t));
      const tail = t <= 0.75 ? 1 : 1 - smootherstep((t - 0.75) / 0.25);
      return Math.max(0, 1 + (response - 1) * tail);
    }
    if (!['spring', 'scurve'].includes(entryStyle))
      throw RangeError('Presence style spring or scurve required');
    const validCount = (n) => {
      if (!Number.isInteger(n) || n < 1 || n > 6)
        throw RangeError('Actor count1..6 required');
    };
    validCount(initialCount);
    let requestedCount = initialCount,
      revision = 0,
      disposed = false;
    let records = Array.from({ length: 6 }, (_, id) => ({
      id,
      sourceIndex: presenceSources[id],
      scale: id < initialCount ? 1 : 0,
      from: id < initialCount ? 1 : 0,
      target: id < initialCount ? 1 : 0,
      elapsed: 0,
      duration: 0,
      state: id < initialCount ? 'visible' : 'hidden',
      entries: id < initialCount ? 1 : 0
    }));
    // Reuse each actor identity and current scale so count changes do not pop surviving actors.
    function trigger(record, show) {
      const target = show ? 1 : 0;
      if (record.target === target) return;
      if (show && record.state === 'hidden') {
        record.scale = 0;
        record.entries++;
      }
      record.from = record.scale;
      record.target = target;
      record.elapsed = 0;
      record.duration =
        presenceDuration * Math.min(1, Math.abs(target - record.scale));
      record.state = show ? 'entering' : 'exiting';
      revision++;
      if (!record.duration) settle(record);
    }
    function settle(record) {
      record.scale = record.from = record.target;
      record.elapsed = record.duration = 0;
      record.state = record.target ? 'visible' : 'hidden';
    }
    function requestCount(n) {
      validCount(n);
      if (disposed) return;
      requestedCount = n;
      for (const record of records) trigger(record, record.id < n);
    }
    function advance(seconds) {
      if (!Number.isFinite(seconds) || seconds < 0)
        throw RangeError('Finite nonnegative seconds required');
      if (disposed || !seconds) return;
      for (const record of records) {
        if (!record.duration) continue;
        record.elapsed = Math.min(record.duration, record.elapsed + seconds);
        if (record.duration - record.elapsed < 1e-12)
          record.elapsed = record.duration;
        const t = record.elapsed / record.duration,
          e =
            record.target && entryStyle === 'spring'
              ? springStep(t)
              : smootherstep(t);
        record.scale = record.from + (record.target - record.from) * e;
        revision++;
        if (record.elapsed >= record.duration) settle(record);
      }
    }
    const pending = () => records.some((record) => record.duration > 0);
    const visible = () =>
      records
        .filter((record) => record.scale > 0 || record.target === 1)
        .map((record) => ({ ...record }));
    return Object.freeze({
      requestCount,
      advance,
      pending,
      visible,
      revision: () => revision,
      status: () => ({
        requestedCount,
        revision,
        transitioning: pending(),
        duration: presenceDuration,
        entryStyle,
        entryCurve:
          entryStyle === 'spring'
            ? 'damped step, peak' +
              Math.round(springOvershoot * 100) +
              '%, 200ms, smooth finite tail'
            : 'quintic smootherstep',
        exitCurve: 'quintic smootherstep; nonnegative monotone',
        comparisonCandidate:
          entryStyle === 'spring' && springOvershoot === 0.08,
        overshootTarget: entryStyle === 'spring' ? springOvershoot : 0,
        overshootLimit:
          entryStyle === 'spring'
            ? Math.exp(
                (-Math.PI * springDamping) / Math.sqrt(1 - springDamping ** 2)
              )
            : 0,
        velocityState: false,
        disposed,
        slots: records.map((record) => ({ ...record })),
        pausePolicy: 'presentation continues; source motion and solver freeze',
        identityPolicy:
          'fixed slots/source phases 0,2,4,1,3,5; continuing actors never retrigger'
      }),
      dispose() {
        if (disposed) return;
        disposed = true;
        records = [];
        revision++;
      }
    });
  }
  // Original locked position/rotation is the rest transform. Jaw remains an
  // independent child; the performance layer controls its existing Noise input.
  // Move the displayed pose toward rest without rewriting its source motion state.
  function blendRest(pose, rest, strength = 1) {
    if (!Number.isFinite(strength) || strength < 0 || strength > 1)
      throw RangeError('Rest strength0..1 required');
    return {
      ...pose,
      position: pose.position.map(
        (v, k) => rest.position[k] + (v - rest.position[k]) * strength
      ),
      rotation: pose.rotation.map(
        (v, k) => rest.rotation[k] + (v - rest.rotation[k]) * strength
      )
    };
  }
  // The saved six-sample locked image repeats three positions in pairs. This
  // count adaptation gives1..6 visible actors a single non-overlapping rest row.
  function createRest() {
    return {
      sample(n) {
        if (!Number.isInteger(n) || n < 1 || n > 6)
          throw RangeError('Rest count1..6 required');
        return {
          anchors: Array.from({ length: 6 }, (_, i) => [
            (Math.min(i, n - 1) + 0.5) / n,
            0.5
          ]),
          capacity: n
        };
      }
    };
  }
  // Rest is a translation-only presentation channel. Never fit/resize the
  // model from strength,count,depth or its changing projected silhouette.
  function restPlacement(pose, anchor, frame, capacity, mix) {
    const { width, height, focal, pivot } = frame,
      d = 90 - pose.position[2],
      sourceCenter = [
        width / 2 + ((pose.position[0] + pivot[0]) * focal) / d,
        height / 2 - ((pose.position[1] + pivot[1]) * focal) / d
      ],
      targetCenter = [anchor[0] * width, anchor[1] * height],
      center = sourceCenter.map((v, k) => v + (targetCenter[k] - v) * mix),
      offset = center.map((v, k) => v - sourceCenter[k]);
    return {
      scale: 1,
      center,
      sourceCenter,
      offset,
      mix,
      capacity,
      targetScale: 1,
      policy:
        'translation only;native camera perspective retained;no rest/count fit'
    };
  }

  function envelope(vertices, jawVertices, registration, jawPivot) {
    const origin = registration.parentPivot;
    let radius2 = 0;
    for (let i = 0; i < jawVertices.length; i++) {
      const p = [0, 1, 2].map(
        (k) =>
          vertices[i * 3 + k] * registration.scale + registration.translation[k]
      );
      let r2;
      if (jawVertices[i]) {
        const q = jawPivot.map((v, k) => v - origin[k]),
          v = p.map((v, k) => v - jawPivot[k]),
          A = q[1] * v[1] + q[2] * v[2],
          B = -q[1] * v[2] + q[2] * v[1],
          peak = Math.max(
            A,
            B,
            A >= 0 && B >= 0 ? Math.hypot(A, B) : -Infinity
          );
        r2 =
          (q[0] + v[0]) ** 2 +
          q[1] ** 2 +
          q[2] ** 2 +
          v[1] ** 2 +
          v[2] ** 2 +
          2 * peak;
      } else r2 = p.reduce((s, v, k) => s + (v - origin[k]) ** 2, 0);
      radius2 = Math.max(radius2, r2);
    }
    return Math.sqrt(radius2);
  }
  function place(pose, anchor, frame, count, index) {
    // A fixed rig envelope, not the current silhouette, sets the view scale.
    // The original parent pivot, rotations, jaw transform and cameraZ stay intact.
    const {
        width,
        height,
        focal,
        radius,
        pivot,
        positionNoiseAmplitude = 1,
        provided = false
      } = frame,
      cameraZ = 90;
    const amp = Math.max(0, positionNoiseAmplitude),
      limits = provided
        ? [5, 5, 5]
        : [0.8, 0.4, 0].map((v) => Math.max(2.4, 3.31 * (v + amp * 1.1)));
    const near = cameraZ - limits[2],
      depthMargin = cameraZ / near,
      gain = [height * travel[0], height * travel[1]],
      move = [
        gain[0] * limits[0] * depthMargin,
        gain[1] * limits[1] * depthMargin
      ];
    const rowHalf =
      Math.min(
        anchor[1] - 0.01,
        0.99 - anchor[1],
        anchor[1] < 0.5 ? 0.25 - anchor[1] : anchor[1] - 0.75
      ) * height;
    const horizontal = (count >= 5 ? 0.14 : count >= 3 ? 0.2 : 0.48) * width;
    const available = Math.max(
      1,
      Math.min(rowHalf - move[1], horizontal - move[0])
    );
    const projectedRadius =
      ((focal * radius) / (near - radius)) *
      (1 +
        Math.max(
          limits[0] + Math.abs(pivot[0]),
          limits[1] + Math.abs(pivot[1])
        ) /
          near);
    const weight =
      count === 3
        ? index % 2 === 0
          ? Math.SQRT1_2
          : 1
        : count === 5
          ? index % 2 === 0
            ? Math.sqrt(2 / 3)
            : 1
          : 1;
    const scale =
      Math.min(
        [0, 0.76, 0.72, 0.68, 0.66, 0.62, 0.6][count],
        available / projectedRadius
      ) * weight;
    const d = cameraZ - pose.position[2],
      sourceCenter = [
        width / 2 + ((pose.position[0] + pivot[0]) * focal) / d,
        height / 2 - ((pose.position[1] + pivot[1]) * focal) / d
      ];
    const center = [
      anchor[0] * width + (gain[0] * pose.position[0] * cameraZ) / d,
      anchor[1] * height - (gain[1] * pose.position[1] * cameraZ) / d
    ];
    return {
      scale,
      center,
      sourceCenter,
      normalized: [center[0] / width, center[1] / height],
      limits,
      radius,
      policy:
        'fixed full-rotation/jaw envelope; linear XY; original perspective Z; no silhouette recenter/resize'
    };
  }
  return Object.freeze({
    create,
    place,
    envelope,
    blendRest,
    createRest,
    restPlacement,
    slots,
    duration,
    travel,
    sourceIndices,
    createPresence,
    presenceDuration
  });
})();

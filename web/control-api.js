/* MIT: input adapters and renderer share this validated control contract. */
'use strict';
window.HalloweenControlAPI = Object.freeze({
  // Original B input contract, independent of DOM, MIDI and phone transport.
  // Initialspeed is sampled at birth; it is distinct from playback speed.
  createVJ(hooks = {}) {
    let state = {
      scene: 'bats',
      paused: false,
      initialSpeed: 1.3,
      motionMix: 0.5
    };
    const ranges = { initialSpeed: [0, 2.6], motionMix: [0, 1] };
    const parameters = (s) =>
      Object.freeze({
        Initialspeed: s.initialSpeed,
        Cross: s.motionMix,
        Vortex: 5 - 4 * s.motionMix,
        Spiral: -1.7 + 0.8 * s.motionMix,
        rotationCross: 0.77 * (1 - s.motionMix)
      });
    const values = () => Object.freeze({ ...state });
    const apply = (command) => {
      if (!command || typeof command !== 'object' || Array.isArray(command))
        throw new TypeError('Command must be an object');
      const next = { ...state };
      if (command.type === 'set') {
        const r = Object.hasOwn(ranges, command.key)
            ? ranges[command.key]
            : null,
          v = command.value;
        if (
          !r ||
          typeof v !== 'number' ||
          !Number.isFinite(v) ||
          v < r[0] ||
          v > r[1]
        )
          throw new RangeError('Source input outside comparison range');
        next[command.key] = v;
      } else if (command.type === 'select') {
        if (command.scene !== 'bats' && command.scene !== 'inactive')
          throw new RangeError('Unknown source scene');
        next.scene = command.scene;
        next.paused = command.scene === 'inactive';
      } else if (command.type === 'pause') next.paused = true;
      else if (command.type === 'resume') {
        next.paused = false;
        next.scene = 'bats';
      } else if (command.type !== 'reset')
        throw new RangeError('Unknown source command');
      hooks.apply?.(
        Object.freeze({ ...command }),
        Object.freeze({ ...next }),
        parameters(next)
      );
      state = next;
      return values();
    };
    const keyboard = (event) => {
      if (
        !event ||
        event.repeat ||
        event.editable ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
      )
        return false;
      const key = event.key?.toLowerCase();
      let command;
      if (key === 'arrowleft' || key === 'arrowright')
        command = {
          type: 'set',
          key: 'motionMix',
          value: Math.min(
            1,
            Math.max(
              0,
              Math.round(
                (state.motionMix + (key === 'arrowright' ? 0.05 : -0.05)) * 100
              ) / 100
            )
          )
        };
      else if (key === 'arrowup' || key === 'arrowdown')
        command = {
          type: 'set',
          key: 'initialSpeed',
          value: Math.min(
            2.6,
            Math.max(
              0,
              Math.round(
                (state.initialSpeed + (key === 'arrowup' ? 0.1 : -0.1)) * 100
              ) / 100
            )
          )
        };
      else if (key === ' ')
        command = { type: state.paused ? 'resume' : 'pause' };
      else if (key === 'r') command = { type: 'reset' };
      else return false;
      apply(command);
      return true;
    };
    // Renderer lifecycle observation also covers legacy UI/API scene changes.
    const observe = (runtime) => {
      if (
        !runtime ||
        !['bats', 'inactive'].includes(runtime.scene) ||
        typeof runtime.paused !== 'boolean'
      )
        throw new RangeError('Invalid runtime state');
      state = { ...state, scene: runtime.scene, paused: runtime.paused };
      return values();
    };
    return Object.freeze({
      values,
      parameters: () => parameters(state),
      apply,
      keyboard,
      observe
    });
  },
  create(initialText, hooks) {
    const values = {
      skeleton: { speed: 1, size: 1, text: initialText },
      bats: {
        forceGain: 1,
        colorHue: 2 / 3,
        speed: 1,
        size: 1,
        text: initialText,
        flapRate: 1,
        frameLock: null,
        emitterX: 0,
        emitterY: 0
      },
      skull3d: {
        dynamicFlow: 1,
        fluidNoiseAmplitude: 1.08,
        fluidNoisePeriod: 1.06,
        decorationNoise: 1,
        size: 1,
        text: initialText,
        backgroundHue: 138 / 360,
        headGlowMix: 0,
        foregroundBurst: 0,
        headRate: 1,
        jawRate: 1,
        motionCross: 0.5,
        motionStrength: 1,
        jawPeriod: 0.12,
        jawExponent: 4,
        jawManual: 0,
        jawManualAngle: 0,
        jawMode: 'noise',
        jawActivity: 'custom',
        jawNoiseAmplitude: 2,
        positionNoiseAmplitude: 0.2,
        positionNoisePeriod: 0.05,
        rotationNoiseAmplitude: 0.28,
        rotationNoisePeriod: 1,
        jawOpen: 28,
        pivotY: -0.75,
        pivotZ: -0.12,
        jawTint: 0,
        rigMode: 0,
        headX: 0,
        headY: 0,
        headZ: 0,
        jawPivotMode: 0,
        fluidMode: 0,
        fluidColor: 0,
        aCompositeMode: 0,
        aSceneMode: 0,
        aNativeResolution: 0,
        actorCount: 3,
        actorLayout: 'source',
        actorPoses: null,
        actorRevision: 0
      }
    };
    const shared = { textSizeNormalized: null, textWidth: 1, textHeight: 1 };
    const assertScene = (id) => {
      if (!Object.hasOwn(values, id)) throw new RangeError('Unknown scene');
    };
    const copy = (id) => {
      assertScene(id);
      const result = { ...values[id] };
      if (id === 'skull3d' && result.actorPoses)
        result.actorPoses = result.actorPoses.map((p) => ({
          position: [...p.position],
          rotation: [...p.rotation],
          jaw: p.jaw
        }));
      return result;
    };
    const ranges = {
      forceGain: [0, 1],
      motionStrength: [0, 1],
      colorHue: [0, 1],
      emitterX: [-1, 1],
      emitterY: [-1, 1],
      fluidNoiseAmplitude: [0, 2],
      fluidNoisePeriod: [0.02, 2],
      positionNoiseAmplitude: [0, 1],
      positionNoisePeriod: [0.01, 2],
      rotationNoiseAmplitude: [0, 1],
      rotationNoisePeriod: [0.02, 3],
      jawNoiseAmplitude: [0, 3],
      headGlowMix: [0, 1],
      backgroundHue: [0, 1],
      speed: [0.2, 2],
      size: [0.5, 1.5],
      flapRate: [0.25, 2],
      headRate: [0, 2],
      motionCross: [0, 1],
      jawPeriod: [0.01, 2],
      jawExponent: [0.1, 8],
      jawRate: [0, 2],
      jawManualAngle: [0, 90],
      jawOpen: [0, 45],
      pivotY: [-1.15, 0.2],
      pivotZ: [-0.3, 0.2],
      jawTint: [0, 1],
      rigMode: [0, 1],
      headX: [-180, 180],
      headY: [-180, 180],
      headZ: [-180, 180],
      jawPivotMode: [0, 1]
    };
    const api = {
      values: copy,
      sharedValues: () => ({ ...shared }),
      setShared(key, value) {
        if (
          !['textSizeNormalized', 'textWidth', 'textHeight'].includes(key) ||
          (!(key === 'textSizeNormalized' && value === null) &&
            (typeof value !== 'number' ||
              !Number.isFinite(value) ||
              value < (key === 'textSizeNormalized' ? 0 : 0.1) ||
              value > 1))
        )
          throw new RangeError('Unknown or invalid shared text size');
        shared[key] = value;
        hooks.changed('shared');
        return api.status();
      },
      select(id) {
        assertScene(id);
        hooks.select(id);
        return api.status();
      },
      set(id, key, value) {
        assertScene(id);
        if (!Object.hasOwn(values[id], key) || key === 'text')
          throw new RangeError('Unknown numeric key');
        if (key === 'actorLayout') {
          if (!['source', 'rows'].includes(value))
            throw new RangeError('Actor layout source/rows required');
        } else if (key === 'actorCount') {
          if (!Number.isInteger(value) || value < 1 || value > 6)
            throw new RangeError('Actor count must be integer1..6');
        } else if (key === 'jawMode') {
          if (!['noise', 'closed', 'open'].includes(value))
            throw new RangeError('Unknown jaw mode');
        } else if (key === 'jawActivity') {
          if (
            ![
              'flapping',
              'violent',
              'occasional',
              'stopped',
              'custom'
            ].includes(value)
          )
            throw new RangeError('Unknown activity');
        } else if (
          key === 'jawManual' ||
          key === 'dynamicFlow' ||
          key === 'decorationNoise' ||
          key === 'foregroundBurst' ||
          key === 'jawTint' ||
          key === 'rigMode' ||
          key === 'jawPivotMode' ||
          key === 'fluidMode' ||
          key === 'fluidColor' ||
          key === 'aCompositeMode' ||
          key === 'aSceneMode' ||
          key === 'aNativeResolution'
        ) {
          if (value !== 0 && value !== 1)
            throw new RangeError('Tint must be 0 or 1');
        } else if (key === 'frameLock') {
          if (
            value !== null &&
            (!Number.isInteger(value) || value < 0 || value > 59)
          )
            throw new RangeError('Frame must be null or 0..59');
        } else {
          const r = ranges[key];
          if (
            typeof value !== 'number' ||
            !Number.isFinite(value) ||
            !r ||
            value < r[0] ||
            value > r[1]
          )
            throw new RangeError('Value outside range');
        }
        // Keep the registered CC0 jaw hinge when changing scene/count.
        // The origin pivot is an explicit legacy comparison, never a mode dependency.
        values[id][key] = value;
        if (id === 'skull3d' && key === 'actorCount')
          values[id].aSceneMode =
            values[id].aCompositeMode =
            values[id].fluidMode =
            values[id].rigMode =
              1;
        if (id === 'skull3d' && key === 'jawActivity' && value !== 'custom') {
          const preset = {
            flapping: ['noise', 0.3, 1, 1.2],
            violent: ['noise', 0.05, 1, 2],
            occasional: ['noise', 0.8, 4, 1.3],
            stopped: [
              'closed',
              values[id].jawPeriod,
              values[id].jawExponent,
              values[id].jawNoiseAmplitude
            ]
          }[value];
          [
            values[id].jawMode,
            values[id].jawPeriod,
            values[id].jawExponent,
            values[id].jawNoiseAmplitude
          ] = preset;
        } else if (
          id === 'skull3d' &&
          ['jawMode', 'jawPeriod', 'jawExponent', 'jawNoiseAmplitude'].includes(
            key
          )
        )
          values[id].jawActivity = 'custom';
        if (
          id === 'skull3d' &&
          (key === 'aCompositeMode' || key === 'aSceneMode') &&
          value === 1
        ) {
          values[id].aCompositeMode =
            values[id].fluidMode =
            values[id].rigMode =
              1;
        }
        if (id === 'skull3d' && key === 'fluidMode' && value === 0)
          values[id].aCompositeMode = 0;
        if (
          id === 'skull3d' &&
          ['fluidMode', 'aCompositeMode', 'rigMode'].includes(key) &&
          value === 0
        )
          values[id].aSceneMode = 0;
        hooks.changed(id);
        return api.status();
      },
      setActors(id, poses) {
        assertScene(id);
        if (id !== 'skull3d') throw new RangeError('Actor input belongs to A');
        const next =
          poses === null ? null : window.HalloweenSkullScene.validate(poses);
        values[id].actorPoses = next;
        values[id].actorRevision++;
        hooks.changed(id);
        return api.status();
      },
      setText(id, text) {
        assertScene(id);
        if (typeof text !== 'string')
          throw new TypeError('Text must be a string');
        let value = text.slice(0, 240),
          lines = value.split('\n');
        if (lines.length > 8)
          value =
            lines.slice(0, 7).join('\n') + '\n' + lines.slice(7).join(' ');
        values[id].text = value;
        hooks.changed(id);
        return api.status();
      },
      pause() {
        hooks.pause();
        return api.status();
      },
      resume() {
        hooks.resume();
        return api.status();
      },
      reset(id) {
        assertScene(id);
        hooks.reset(id);
        return api.status();
      },
      stop() {
        hooks.stop();
        return api.status();
      },
      status() {
        return {
          schema: 1,
          shared: { ...shared },
          values: {
            skeleton: copy('skeleton'),
            bats: copy('bats'),
            skull3d: copy('skull3d')
          },
          runtime: hooks.status()
        };
      }
    };
    return Object.freeze(api);
  }
});

// CC0 alternate registration; measurements describe coordinates, not model identity.
window.HalloweenSkullRig = (() => {
  const scale = 0.6951803205280249,
    translation = Object.freeze([
      -7.301568984985352e-6, 0.09370309658982542, 0.00247608319722023
    ]);
  const parentPivot = Object.freeze([0, -0.5, 0]);
  function rotateX(angle, pivot) {
    const c = Math.cos(angle),
      s = Math.sin(angle),
      [x, y, z] = pivot;
    return [
      1,
      0,
      0,
      0,
      0,
      c,
      -s,
      y - c * y + s * z,
      0,
      s,
      c,
      z - s * y - c * z,
      0,
      0,
      0,
      1
    ];
  }
  function multiply(a, b) {
    const out = new Array(16).fill(0);
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 4; c++)
        for (let k = 0; k < 4; k++)
          out[r * 4 + c] += a[r * 4 + k] * b[k * 4 + c];
    return out;
  }
  function pose(values, headTime, jawAngle, position = [0, 0, 0]) {
    const angles = [
        values.headX,
        values.headY + (headTime * 0.8 * 180) / Math.PI,
        values.headZ
      ],
      r = angles.map((v) => (v * Math.PI) / 180);
    const [sx, sy, sz] = r.map(Math.sin),
      [cx, cy, cz] = r.map(Math.cos);
    // Native XYZ order: Rz * Ry * Rx, about the common parent pivot.
    const head = [
      cz * cy,
      cz * sy * sx - sz * cx,
      cz * sy * cx + sz * sx,
      0,
      sz * cy,
      sz * sy * sx + cz * cx,
      sz * sy * cx - cz * sx,
      0,
      -sy,
      cy * sx,
      cy * cx,
      0,
      0,
      0,
      0,
      1
    ];
    for (let i = 0; i < 3; i++)
      head[i * 4 + 3] =
        position[i] +
        parentPivot[i] -
        head[i * 4] * parentPivot[0] -
        head[i * 4 + 1] * parentPivot[1] -
        head[i * 4 + 2] * parentPivot[2];
    const jawPivot =
      values.jawPivotMode === 1
        ? [0, 0, 0]
        : [
            translation[0],
            scale * values.pivotY + translation[1],
            scale * values.pivotZ + translation[2]
          ];
    return {
      angles,
      headWorld: head,
      jawWorld: multiply(head, rotateX((jawAngle * Math.PI) / 180, jawPivot)),
      jawPivot,
      parentPivot: [...parentPivot]
    };
  }
  function point(matrix, x, y, z, target, offset) {
    x = x * scale + translation[0];
    y = y * scale + translation[1];
    z = z * scale + translation[2];
    target[offset] = matrix[0] * x + matrix[1] * y + matrix[2] * z + matrix[3];
    target[offset + 1] =
      matrix[4] * x + matrix[5] * y + matrix[6] * z + matrix[7];
    target[offset + 2] =
      matrix[8] * x + matrix[9] * y + matrix[10] * z + matrix[11];
  }
  return Object.freeze({
    pose,
    point,
    registration: Object.freeze({
      scale,
      translation,
      parentPivot,
      cameraZ: 90,
      fov: 6.4,
      projection: 'perspective-horizontal',
      basis:
        'closed whole-body height and bbox center; separate candidate jaw pivot'
    })
  });
})();

// Verified source operators with independent continuous Noise comparison; supplied fixed poses retain precedence.
window.HalloweenSkullScene = Object.freeze({
  validate(poses) {
    if (!Array.isArray(poses) || poses.length !== 6)
      throw new RangeError('Expected six A actors');
    return poses.map((p) => {
      if (!p || typeof p !== 'object' || Array.isArray(p))
        throw new TypeError('Expected actor pose');
      for (const [key, bound] of [
        ['position', 5],
        ['rotation', 360]
      ])
        if (
          !Array.isArray(p[key]) ||
          p[key].length !== 3 ||
          p[key].some(
            (v) =>
              typeof v !== 'number' ||
              !Number.isFinite(v) ||
              Math.abs(v) > bound
          )
        )
          throw new RangeError('Actor transform outside comparison range');
      if (
        typeof p.jaw !== 'number' ||
        !Number.isFinite(p.jaw) ||
        p.jaw < 0 ||
        p.jaw > 90
      )
        throw new RangeError('Actor jaw outside0..90');
      return {
        position: [...p.position],
        rotation: [...p.rotation],
        jaw: p.jaw
      };
    });
  },
  poses(values, headTime, jawTime, motionPoses) {
    if (values.actorPoses) return values.actorPoses;
    if (!motionPoses || motionPoses.length !== 6)
      throw new Error('Continuous six-actor motion state required');
    return motionPoses.map((p) => ({
      position: [...p.position],
      rotation: p.rotation.map(
        (v, i) => v + [values.headX, values.headY, values.headZ][i]
      ),
      jaw: Math.min(90, (p.jaw * values.jawOpen) / 28)
    }));
  },
  foreground(poses) {
    const center = (i) =>
      poses[i].displayNormalized ?? [
        0.5 + poses[i].position[0] / 10,
        0.5 - poses[i].position[1] / 10
      ];
    return Array.from({ length: Math.ceil(poses.length / 2) }, (_, i) => {
      const a = [0, 2, 4][i] % poses.length,
        b = i % poses.length,
        c = center(a),
        r = center(b);
      return {
        circleActor: a,
        radialActor: b,
        circle: [c[0], 1 - c[1]],
        radial: [r[0], 1 - r[1]]
      };
    });
  }
});

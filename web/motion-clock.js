/* MIT. Shared absolute transport clock; Feedback reset does not reset this clock. */
'use strict';
window.HalloweenMotionClock = (() => {
  const wall = () =>
    globalThis.performance ? performance.now() / 1000 : Date.now() / 1000;
  let accumulated = 0,
    epoch = wall(),
    running = true;
  const seconds = () => accumulated + (running ? wall() - epoch : 0);
  const system = Object.freeze({
    seconds,
    frame: (fps = 60) => Math.floor(seconds() * fps + 1e-8),
    pause() {
      if (running) {
        accumulated = seconds();
        running = false;
      }
    },
    resume() {
      if (!running) {
        epoch = wall();
        running = true;
      }
    },
    isRunning: () => running,
    kind: 'app-wide transport clock'
  });
  function create({ seconds: initial = 0, fps = 60 } = {}) {
    if (
      !Number.isFinite(initial) ||
      initial < 0 ||
      !Number.isFinite(fps) ||
      fps <= 0
    )
      throw new RangeError('Finite clock start/rate');
    let t = initial,
      active = true;
    return Object.freeze({
      seconds: () => t,
      frame: (rate = fps) => Math.floor(t * rate + 1e-8),
      advance(delta) {
        if (!Number.isFinite(delta) || delta < 0)
          throw new RangeError('Nonnegative elapsed');
        if (active) t += delta;
        return t;
      },
      pause() {
        active = false;
      },
      resume() {
        active = true;
      },
      isRunning: () => active,
      kind: 'injected absolute transport clock'
    });
  }
  return Object.freeze({ system, create });
})();

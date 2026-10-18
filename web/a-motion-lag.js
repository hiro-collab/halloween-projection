/* MIT. Source A fixed Lag2 control profile; not a motion trajectory table. */
'use strict';
window.HalloweenAMotionLag = (() => {
  const f = Math.fround,
    a1 = 1.3706031669478154,
    a2 = -0.4641586984749819,
    b0 = 0.09355553152716656;
  function create(initial = 0.85) {
    let y1 = f(initial),
      y2 = f(initial);
    return Object.freeze({
      step(target) {
        if (!Number.isFinite(target)) throw new RangeError('Finite lag input');
        const y = f(b0 * target + a1 * y1 + a2 * y2);
        y2 = y1;
        y1 = y;
        return y;
      },
      reset(value) {
        if (!Number.isFinite(value)) throw new RangeError('Finite lag reset');
        y1 = y2 = f(value);
      },
      value: () => y1,
      profile: () => ({
        lagSeconds: 0.2,
        overshootSeconds: 0.05,
        sampleRate: 60,
        scope: 'motioncross control channel',
        individualWaveEqualityRequired: false
      })
    });
  }
  return Object.freeze({ create });
})();

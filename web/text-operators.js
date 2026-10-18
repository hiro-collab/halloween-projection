/* Native width-based text size; Web aperture is explicit and full-frame by default. */
'use strict';
window.HalloweenTextOperators = (() => {
  const valid = (v) =>
    typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 1;
  function fraction(normalized) {
    if (!valid(normalized)) throw new RangeError('Text size must be 0..1');
    return Math.fround(Math.fround(normalized) * 0.25);
  }
  function hueDegrees(normalized) {
    if (!valid(normalized)) throw new RangeError('Background hue must be 0..1');
    return Math.fround(Math.fround(normalized) * 360);
  }
  function layout(
    ctx,
    text,
    width,
    height,
    normalized,
    { rasterWidth = width, widthFraction = 1, heightFraction = 1 } = {}
  ) {
    if (
      typeof text !== 'string' ||
      !Number.isFinite(width) ||
      !Number.isFinite(height) ||
      width <= 0 ||
      height <= 0 ||
      !Number.isFinite(rasterWidth) ||
      rasterWidth <= 0
    )
      throw new RangeError('Explicit text/grid required');
    if (
      ![widthFraction, heightFraction].every(
        (v) => Number.isFinite(v) && v >= 0.1 && v <= 1
      )
    )
      throw new RangeError('Display bounds .1..1 required');
    const sourceFraction = fraction(normalized),
      fontSize = Math.max(
        ((16 / 3) * width) / rasterWidth,
        width * sourceFraction
      ),
      lines = text.split('\n'),
      metrics = [];
    let widest = 0,
      ascent = 0,
      descent = 0;
    const oldBaseline = ctx.textBaseline,
      oldAlign = ctx.textAlign;
    ctx.font = fontSize + 'px Arial';
    try {
      ctx.textBaseline = 'alphabetic';
      ctx.textAlign = 'center';
      for (const line of lines) {
        const m = ctx.measureText(line || 'M');
        widest = Math.max(widest, line ? m.width : 0);
        ascent = Math.max(ascent, m.actualBoundingBoxAscent ?? fontSize * 0.8);
        descent = Math.max(
          descent,
          m.actualBoundingBoxDescent ?? fontSize * 0.2
        );
        metrics.push({
          empty: !line,
          width: m.width,
          ascent: m.actualBoundingBoxAscent ?? fontSize * 0.8,
          descent: m.actualBoundingBoxDescent ?? fontSize * 0.2,
          left: m.actualBoundingBoxLeft ?? m.width / 2,
          right: m.actualBoundingBoxRight ?? m.width / 2
        });
      }
    } finally {
      ctx.textBaseline = oldBaseline;
      ctx.textAlign = oldAlign;
    }
    const displayBounds = {
      left: (width * (1 - widthFraction)) / 2,
      right: (width * (1 + widthFraction)) / 2,
      top: (height * (1 - heightFraction)) / 2,
      bottom: (height * (1 + heightFraction)) / 2
    };
    const lineHeight = fontSize,
      total = (lines.length - 1) * lineHeight + ascent + descent,
      top = (height - total) / 2,
      firstBaseline = top + ascent;
    const nonempty = metrics
        .map((m, i) => ({ ...m, baseline: firstBaseline + i * lineHeight }))
        .filter((m) => !m.empty),
      inkBounds = nonempty.length
        ? {
            left: Math.min(...nonempty.map((m) => width / 2 - m.left)),
            right: Math.max(...nonempty.map((m) => width / 2 + m.right)),
            top: Math.min(...nonempty.map((m) => m.baseline - m.ascent)),
            bottom: Math.max(...nonempty.map((m) => m.baseline + m.descent))
          }
        : null;
    const clipped =
      !!inkBounds &&
      (inkBounds.left < displayBounds.left ||
        inkBounds.right > displayBounds.right ||
        inkBounds.top < displayBounds.top ||
        inkBounds.bottom > displayBounds.bottom);
    return {
      mode: 'source-fraction-filtered-comparison',
      normalized,
      sourceFraction,
      fontSize,
      rasterFontPixels: (fontSize * rasterWidth) / width,
      rasterWidth,
      lineHeight,
      width: widest,
      height: total,
      ascent,
      descent,
      firstBaseline,
      bounds: {
        left: (width - widest) / 2,
        right: (width + widest) / 2,
        top,
        bottom: top + total
      },
      inkBounds,
      lines: lines.length,
      displayBounds,
      clipped,
      noFit: true,
      zeroIsNotTextOff: true,
      rasterMatch: false,
      minimumRasterProfilePixels: 16 / 3,
      measurementBaseline: 'alphabetic',
      measurementAlign: 'center'
    };
  }
  return Object.freeze({
    fraction,
    hueDegrees,
    layout,
    contract: Object.freeze({
      sizeFactor: 0.25,
      fractionReference: 'main text layer width',
      hueFactorDegrees: 360,
      temporalFilterAndLag: 'native .3s gauss Filter and .2/.1 Lag response',
      glyphRaster: 'Canvas comparison; native legacy pixels differ',
      infoAndGroupBranches: 'pending'
    })
  });
})();

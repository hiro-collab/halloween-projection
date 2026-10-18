/* MIT. Native forward/back Count and selected-row supply; operator metadata never feeds the projection. */
'use strict';
window.HalloweenTextSequence = (() => {
  function rows(text) {
    return text
      .replace(/\r\n?/g, '\n')
      .split('\n')
      .filter((s) => s.length > 0)
      .map((s) => {
        const c = s.split('\\');
        return c[1] ? c[0] + '\n' + c[1] : c[0];
      });
  }
  function create() {
    let forward = 0,
      back = 0,
      enabled = false,
      mode = 0,
      revision = 0,
      disposed = false;
    return Object.freeze({
      set(key, value) {
        if (disposed) throw Error('Text controls ended');
        if (key === 'text.sequenceEnabled') {
          if (typeof value !== 'boolean')
            throw new TypeError('Line selection boolean');
          enabled = value;
        } else if (key === 'text.displayMode') {
          if (value !== 0 && value !== 1)
            throw new RangeError('Original two layouts');
          mode = value;
        } else throw Error('Unknown text control');
        revision++;
      },
      command(name) {
        if (disposed) throw Error('Text controls ended');
        enabled = true;
        if (name === 'text.nextLine') forward++;
        else if (name === 'text.previousLine')
          back = Math.min(forward, back + 1);
        else if (name === 'text.resetLine') forward = back = 0;
        else throw Error('Unknown text command');
        revision++;
      },
      values: () => ({
        'text.sequenceEnabled': enabled,
        'text.displayMode': mode
      }),
      display(text) {
        const list = rows(text);
        return enabled ? (list[forward - back] ?? '') : text;
      },
      status(text) {
        const list = rows(text);
        return {
          enabled,
          displayMode: mode,
          index: forward - back,
          forward,
          back,
          rows: list.length,
          beyondLast: enabled && forward - back >= list.length,
          revision,
          selectedText: enabled ? (list[forward - back] ?? '') : text,
          source:
            'forwardCount - min(backCount,forwardCount); no last-row loop',
          metadataDestination: 'operator preview only',
          metadataSupply:
            'Original InfoLyricLists/BPM/item-name contents not read; no metadata projected',
          disposed
        };
      },
      preview(canvas, text, metadata = {}) {
        const c = canvas.getContext('2d'),
          w = canvas.width,
          h = canvas.height,
          main = enabled ? (rows(text)[forward - back] ?? '') : text;
        c.clearRect(0, 0, w, h);
        c.fillStyle = '#000';
        c.fillRect(0, 0, w, h);
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillStyle = '#fff';
        c.font = '32px Arial';
        const lines = main.split('\n');
        for (let i = 0; i < lines.length; i++)
          c.fillText(
            lines[i],
            w / 2,
            h / 2 + (i - (lines.length - 1) / 2) * 36,
            w * 0.82
          );
        if (mode === 1) {
          c.textAlign = 'left';
          c.textBaseline = 'top';
          c.font = '15px Arial';
          c.fillStyle = '#b5bdcd';
          c.fillText(
            '補助情報：' + (metadata.info ?? '未供給'),
            12,
            12,
            w - 24
          );
          c.fillText(
            '補助情報2：' + (metadata.info2 ?? '未供給'),
            12,
            36,
            w - 24
          );
          c.textBaseline = 'bottom';
          c.fillText('bpm ' + (metadata.bpm ?? '—'), 12, h - 12);
          c.textAlign = 'right';
          c.fillText(
            metadata.itemName ?? '項目名：未供給',
            w - 12,
            h - 12,
            w - 24
          );
        }
        return {
          mode,
          audienceMetadata: false,
          render:
            'Supply/layout inspection; not the original Lyrics visual Feedback renderer'
        };
      },
      dispose() {
        disposed = true;
      }
    });
  }
  return Object.freeze({ create, rows });
})();

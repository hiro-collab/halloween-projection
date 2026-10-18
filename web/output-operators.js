/* MIT. Native Flip -> saved Remap -> circular Ramp/Inside order. */
'use strict';
window.HalloweenOutput = (() => {
  const f = Math.fround,
    pole = 0.8254041703050563,
    counts = {
      controllers: 0,
      liveBackends: 0,
      programs: 0,
      textures: 0,
      bufferBytes: 0,
      gpuBytes: 0,
      draws: 0,
      disposed: 0
    };
  const vertex = `#version 300 es
out vec2 uv;
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  uv = p;
  gl_Position = vec4(p * 2. - 1., 0., 1.);
}
`;
  const fragment = `#version 300 es
precision highp float;
uniform sampler2D image, uvMap;
uniform bool flipX, flipY, useRemap;
uniform float phase;
in vec2 uv;
out vec4 color;
vec4 pixel(ivec2 p) {
  ivec2 n = textureSize(image, 0);
  return any(lessThan(p, ivec2(0))) || any(greaterThanEqual(p, n)) ? vec4(0) : texelFetch(image, p, 0);
}
vec4 source(vec2 p) {
  vec2 q = p * vec2(textureSize(image, 0)) - .5;
  ivec2 a = ivec2(floor(q));
  vec2 t = fract(q);
  return mix(mix(pixel(a), pixel(a + ivec2(1, 0)), t.x), mix(pixel(a + ivec2(0, 1)), pixel(a + ivec2(1, 1)), t.x), t.y);
}
float maskPixel(ivec2 p) {
  ivec2 n = ivec2(160, 90);
  if (any(lessThan(p, ivec2(0))) || any(greaterThanEqual(p, n))) return 0.;
  vec2 q = (vec2(p) + .5) / vec2(n) - .5;
  float r = length(q * vec2(1., 90. / 160.)), v = 2. * r / 2.53 - phase;
  float width = 1. / 160. / 2.53;
  return clamp((v - .5) / width + .5, 0., 1.);
}
float mask(vec2 p) {
  vec2 q = p * vec2(160, 90) - .5;
  ivec2 a = ivec2(floor(q));
  vec2 t = fract(q);
  return mix(mix(maskPixel(a), maskPixel(a + ivec2(1, 0)), t.x), mix(maskPixel(a + ivec2(0, 1)), maskPixel(a + ivec2(1, 1)), t.x), t.y);
}
void main() {
  vec2 p = useRemap ? texture(uvMap, uv).rg : uv;
  if (flipX) p.x = 1. - p.x;
  if (flipY) p.y = 1. - p.y;
  color = source(p) * mask(uv);
}
`;
  function create() {
    counts.controllers++;
    let mode = 1,
      open = true,
      value = f(1),
      pending = 0,
      ticks = 0,
      revision = 0,
      disposed = false,
      backend = null,
      error = '',
      draws = 0,
      totalMs = 0,
      maxMs = 0,
      dirty = true,
      lastSize = [0, 0];
    function close() {
      if (!backend) return;
      const { gl, program, textures, canvas, bytes } = backend;
      for (const t of textures) gl.deleteTexture(t);
      gl.deleteProgram(program);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.width = canvas.height = 1;
      counts.liveBackends--;
      counts.programs--;
      counts.textures -= textures.length;
      counts.gpuBytes -= bytes;
      backend = null;
    }
    function init() {
      if (backend) return backend;
      const canvas = document.createElement('canvas'),
        gl = canvas.getContext('webgl2', {
          alpha: false,
          preserveDrawingBuffer: true,
          antialias: false,
          depth: false
        });
      if (!gl || !gl.getExtension('OES_texture_float_linear'))
        throw Error('Output Remap requires WebGL2 float sampling');
      const compile = (code, type) => {
          const s = gl.createShader(type);
          gl.shaderSource(s, code);
          gl.compileShader(s);
          if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
            const m = gl.getShaderInfoLog(s);
            gl.deleteShader(s);
            throw Error(m);
          }
          return s;
        },
        vs = compile(vertex, gl.VERTEX_SHADER),
        fs = compile(fragment, gl.FRAGMENT_SHADER),
        program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw Error(gl.getProgramInfoLog(program));
      const textures = [gl.createTexture(), gl.createTexture()];
      for (const t of textures) {
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      }
      gl.disable(gl.BLEND);
      gl.disable(gl.DEPTH_TEST);
      backend = { canvas, gl, program, textures, bytes: 0, calibration: false };
      counts.liveBackends++;
      counts.programs++;
      counts.textures += 2;
      return backend;
    }
    const owner = {
      set(key, v) {
        if (disposed) throw Error('Output ended');
        if (key === 'output.transformMode') {
          if (!Number.isInteger(v) || v < 1 || v > 8)
            throw new RangeError('Native transform1..8');
          mode = v;
        } else if (key === 'output.circularMask') {
          if (typeof v !== 'boolean') throw new TypeError('Mask Count boolean');
          open = v;
        } else throw Error('Unknown output control');
        dirty = true;
        revision++;
      },
      command(name) {
        if (name === 'output.nextTransform')
          owner.set('output.transformMode', (mode % 8) + 1);
        else if (name === 'output.toggleMask')
          owner.set('output.circularMask', !open);
        else if (name === 'output.resetControls') {
          mode = 1;
          open = false;
          dirty = true;
          revision++;
        } else throw Error('Unknown output command');
      },
      values: () => ({
        'output.transformMode': mode,
        'output.circularMask': open
      }),
      advance(seconds) {
        if (!Number.isFinite(seconds) || seconds < 0)
          throw Error('Nonnegative output elapsed');
        pending += seconds;
        const n = Math.floor((pending + 1e-9) * 60);
        pending -= n / 60;
        let changed = false;
        for (let i = 0; i < n; i++) {
          const next = f(pole * value + (1 - pole) * (open ? 1 : 0));
          if (next !== value) {
            changed = true;
            value = next;
          }
        }
        ticks += n;
        if (changed) {
          dirty = true;
          revision++;
        }
        return changed;
      },
      needsRender: () => dirty,
      draw(input) {
        if (disposed) return input;
        const start = performance.now();
        try {
          const b = init(),
            { canvas, gl, program, textures } = b;
          if (canvas.width !== input.width) canvas.width = input.width;
          if (canvas.height !== input.height) canvas.height = input.height;
          const nextBytes =
            input.width * input.height * 4 +
            (b.calibration ? 1280 * 720 * 8 : 0);
          counts.gpuBytes += nextBytes - b.bytes;
          b.bytes = nextBytes;
          lastSize = [input.width, input.height];
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, textures[0]);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            input
          );
          if (!b.calibration) {
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, textures[1]);
            gl.texImage2D(
              gl.TEXTURE_2D,
              0,
              gl.RG32F,
              1,
              1,
              0,
              gl.RG,
              gl.FLOAT,
              new Float32Array([0, 0])
            );
          }
          if (mode > 4 && !b.calibration) {
            const data = HalloweenOutputUV.read();
            if (!data) return input;
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, textures[1]);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
            gl.texImage2D(
              gl.TEXTURE_2D,
              0,
              gl.RG32F,
              data.width,
              data.height,
              0,
              gl.RG,
              gl.FLOAT,
              data.data
            );
            b.calibration = true;
            b.bytes += data.data.byteLength;
            counts.gpuBytes += data.data.byteLength;
          }
          gl.viewport(0, 0, canvas.width, canvas.height);
          gl.useProgram(program);
          for (let i = 0; i < 2; i++) {
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, textures[i]);
            gl.uniform1i(
              gl.getUniformLocation(program, i ? 'uvMap' : 'image'),
              i
            );
          }
          gl.uniform1i(
            gl.getUniformLocation(program, 'flipX'),
            (mode - 1) & 1 ? 1 : 0
          );
          gl.uniform1i(
            gl.getUniformLocation(program, 'flipY'),
            (mode - 1) & 2 ? 1 : 0
          );
          gl.uniform1i(
            gl.getUniformLocation(program, 'useRemap'),
            mode > 4 ? 1 : 0
          );
          gl.uniform1f(gl.getUniformLocation(program, 'phase'), -value);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
          const code = gl.getError();
          if (code !== gl.NO_ERROR) throw Error('Output GL error ' + code);
          draws++;
          counts.draws++;
          dirty = false;
          const ms = performance.now() - start;
          totalMs += ms;
          maxMs = Math.max(maxMs, ms);
          return canvas;
        } catch (e) {
          error = String(e.message || e);
          return null;
        }
      },
      stop() {
        close();
        dirty = true;
      },
      status: () => ({
        ready: !disposed && !error,
        error,
        mode,
        flipX: !!((mode - 1) & 1),
        flipY: !!((mode - 1) & 2),
        remap: mode > 4,
        maskCount: open ? 1 : 0,
        maskPhase: -value,
        maskLagValue: value,
        maskLagSeconds: 0.2,
        maskOvershoot: 0,
        ticks,
        pendingSeconds: pending,
        revision,
        draws,
        averageMs: draws ? totalMs / draws : 0,
        maxMs,
        resolution: lastSize,
        liveBackend: !!backend,
        gpuBytes: backend?.bytes ?? 0,
        calibrationUploaded: backend?.calibration ?? false,
        calibration: HalloweenOutputUV.status(),
        nativeOrder:
          'Flip > optional saved Remap > circular Ramp eighth/Inside',
        maskAAMatch:
          'native operator boundary approximation; native0/-1 endpoints and bilinear zero border retained'
      }),
      dispose() {
        if (disposed) return;
        disposed = true;
        close();
        counts.controllers--;
        counts.disposed++;
      }
    };
    return owner;
  }
  return Object.freeze({
    create,
    diagnostics: () => ({ ...counts }),
    release: () => HalloweenOutputUV.release()
  });
})();

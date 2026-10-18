'use strict';
window.HalloweenSkullRaster = (() => {
  const counts = {
    created: 0,
    disposed: 0,
    liveScopes: 0,
    programs: 0,
    buffers: 0,
    vaos: 0,
    bufferBytes: 0,
    draws: 0,
    failures: 0,
    maxLive: 0
  };
  const vertex = `#version 300 es
precision highp float;
layout(location = 0) in vec2 point;
layout(location = 1) in vec2 a;
layout(location = 2) in vec2 b;
layout(location = 3) in vec2 c;
layout(location = 4) in vec2 face;
uniform vec2 size;
flat out vec2 p0;
flat out vec2 p1;
flat out vec2 p2;
flat out vec2 material;
void main() {
  gl_Position = vec4(point.x / size.x * 2. - 1., 1. - point.y / size.y * 2., 0., 1.);
  p0 = a;
  p1 = b;
  p2 = c;
  material = face;
}
`;
  const fragment = `#version 300 es
precision highp float;
flat in vec2 p0;
flat in vec2 p1;
flat in vec2 p2;
flat in vec2 material;
uniform vec2 size;
out vec4 color;
float cross2(vec2 a, vec2 b) {
  return a.x * b.y - a.y * b.x;
}
void main() {
  vec2 origin = vec2(gl_FragCoord.x - .5, size.y - gl_FragCoord.y - .5);
  vec2 poly[8];
  poly[0] = origin;
  poly[1] = origin + vec2(1., 0.);
  poly[2] = origin + vec2(1., 1.);
  poly[3] = origin + vec2(0., 1.);
  int count = 4;
  float orientation = sign(cross2(p1 - p0, p2 - p0));
  if (orientation == 0.) discard;
  for (int edge = 0; edge < 3; edge++) {
    vec2 e0 = edge == 0 ? p0 : edge == 1 ? p1 : p2;
    vec2 e1 = edge == 0 ? p1 : edge == 1 ? p2 : p0;
    vec2 next[8];
    int n = 0;
    for (int i = 0; i < 8; i++) {
      if (i >= count) break;
      vec2 u = poly[i];
      vec2 v = poly[(i + 1) % count];
      float du = orientation * cross2(e1 - e0, u - e0);
      float dv = orientation * cross2(e1 - e0, v - e0);
      bool iu = du >= 0.;
      bool iv = dv >= 0.;
      if (iu) next[n++] = u;
      if (iu != iv) next[n++] = mix(u, v, du / (du - dv));
    }
    count = n;
    for (int i = 0; i < 8; i++) {
      if (i >= count) break;
      poly[i] = next[i];
    }
    if (count < 3) discard;
  }
  float area = 0.;
  for (int i = 0; i < 8; i++) {
    if (i >= count) break;
    area += cross2(poly[i] - origin, poly[(i + 1) % count] - origin);
  }
  area = clamp(abs(area) * .5, 0., 1.);
  float alpha = material.y * area;
  float gray = material.x;
  color = vec4(vec3(gray), alpha);
}
`;

  function normals(vertices, indices, bones) {
    const out = new Float32Array(vertices.length),
      groups = new Map();
    for (let f = 0; f < indices.length; f += 3) {
      const a = indices[f] * 3,
        b = indices[f + 1] * 3,
        c = indices[f + 2] * 3,
        ux = vertices[b] - vertices[a],
        uy = vertices[b + 1] - vertices[a + 1],
        uz = vertices[b + 2] - vertices[a + 2],
        vx = vertices[c] - vertices[a],
        vy = vertices[c + 1] - vertices[a + 1],
        vz = vertices[c + 2] - vertices[a + 2],
        nx = uy * vz - uz * vy,
        ny = uz * vx - ux * vz,
        nz = ux * vy - uy * vx;
      for (let k = 0; k < 3; k++) {
        const o = indices[f + k] * 3;
        out[o] += nx;
        out[o + 1] += ny;
        out[o + 2] += nz;
      }
    }
    for (let i = 0; i < vertices.length / 3; i++) {
      const k = [
        bones[i],
        ...Array.from(vertices.subarray(i * 3, i * 3 + 3), (v) =>
          Math.round(v * 1e6)
        )
      ].join(':');
      let g = groups.get(k);
      if (!g) {
        g = { sum: [0, 0, 0], ids: [] };
        groups.set(k, g);
      }
      g.ids.push(i);
      for (let j = 0; j < 3; j++) g.sum[j] += out[i * 3 + j];
    }
    for (const g of groups.values()) {
      const length = Math.hypot(...g.sum);
      for (const i of g.ids)
        for (let j = 0; j < 3; j++)
          out[i * 3 + j] = length ? g.sum[j] / length : j === 2 ? 1 : 0;
    }
    return out;
  }
  const surfaceVertex = `#version 300 es
precision highp float;
layout(location = 0) in vec2 point;
layout(location = 1) in float cameraDistance;
layout(location = 2) in vec3 normal;
layout(location = 3) in vec3 position;
uniform vec2 size;
out vec3 N;
out vec3 P;
void main() {
  vec2 clip = vec2(point.x / size.x * 2. - 1., 1. - point.y / size.y * 2.);
  float near = 1., far = 200.;
  gl_Position = vec4(clip * cameraDistance, (far + near) / (far - near) * cameraDistance - 2. * far * near / (far - near), cameraDistance);
  N = normal;
  P = position;
}
`;
  const surfaceFragment = `#version 300 es
precision highp float;
in vec3 N;
in vec3 P;
out vec4 color;
void main() {
  vec3 n = normalize(N);
  if (! gl_FrontFacing) n = -n;
  vec3 l = normalize(vec3(0., 0., 10.) - P), v = normalize(vec3(0., 0., 90.) - P);
  float diffuse = max(0., dot(n, l)), specular = pow(max(0., dot(reflect( -l, n), v)), 157.);
  float gray = clamp(.5 + .4 * diffuse + .3 * specular, 0., 1.);
  color = vec4(vec3(gray), 1.);
}
`;
  function createSurface() {
    const canvas = document.createElement('canvas'),
      gl = canvas.getContext('webgl2', {
        alpha: true,
        premultipliedAlpha: true,
        preserveDrawingBuffer: true,
        antialias: true,
        depth: true,
        stencil: false
      });
    if (!gl) throw Error('WebGL2 surface unavailable');
    let program = null,
      vao = null,
      buffer = null,
      packed = null,
      disposed = false,
      capacity = 0,
      faces = 0,
      sx = 1,
      sy = 1,
      draws = 0;
    const shaders = [];
    counts.created++;
    counts.liveScopes++;
    counts.maxLive = Math.max(counts.maxLive, counts.liveScopes);
    function compile(source, type) {
      const shader = gl.createShader(type);
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        throw Error(gl.getShaderInfoLog(shader));
      return shader;
    }
    function release() {
      for (const shader of shaders) gl.deleteShader(shader);
      shaders.length = 0;
      if (buffer) {
        gl.deleteBuffer(buffer);
        buffer = null;
        counts.buffers--;
        counts.bufferBytes -= packed?.byteLength ?? 0;
      }
      if (vao) {
        gl.deleteVertexArray(vao);
        vao = null;
        counts.vaos--;
      }
      if (program) {
        gl.deleteProgram(program);
        program = null;
        counts.programs--;
      }
      packed = null;
      canvas.width = canvas.height = 1;
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      counts.disposed++;
      counts.liveScopes--;
    }
    try {
      const v = compile(surfaceVertex, gl.VERTEX_SHADER),
        f = compile(surfaceFragment, gl.FRAGMENT_SHADER);
      program = gl.createProgram();
      counts.programs++;
      gl.attachShader(program, v);
      gl.attachShader(program, f);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw Error(gl.getProgramInfoLog(program));
      for (const shader of shaders) gl.deleteShader(shader);
      shaders.length = 0;
      vao = gl.createVertexArray();
      counts.vaos++;
      buffer = gl.createBuffer();
      counts.buffers++;
      gl.bindVertexArray(vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      for (const [slot, size, offset] of [
        [0, 2, 0],
        [1, 1, 8],
        [2, 3, 12],
        [3, 3, 24]
      ]) {
        gl.enableVertexAttribArray(slot);
        gl.vertexAttribPointer(slot, size, gl.FLOAT, false, 36, offset);
      }
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.disable(gl.CULL_FACE);
      gl.disable(gl.BLEND);
      gl.clearColor(0, 0, 0, 0);
      gl.clearDepth(1);
    } catch (e) {
      counts.failures++;
      disposed = true;
      release();
      throw e;
    }
    const size = gl.getUniformLocation(program, 'size');
    return {
      canvas,
      begin(count, sceneWidth, sceneHeight, width, height) {
        if (disposed || gl.isContextLost())
          throw Error('GPU surface unavailable');
        if (count < 1 || count > 27288)
          throw Error('GPU surface shape invalid');
        if (count !== capacity) {
          counts.bufferBytes -= packed?.byteLength ?? 0;
          packed = new Float32Array(count * 27);
          capacity = count;
          counts.bufferBytes += packed.byteLength;
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          gl.bufferData(gl.ARRAY_BUFFER, packed.byteLength, gl.DYNAMIC_DRAW);
        }
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
        faces = 0;
        sx = width / sceneWidth;
        sy = height / sceneHeight;
      },
      surfaceFace(j, screen, world, normal, ia, ib, ic) {
        for (let k = 0; k < 3; k++) {
          const i = k === 0 ? ia : k === 1 ? ib : ic,
            o = (j * 3 + k) * 9,
            a = i * 3;
          packed[o] = screen[i * 2] * sx;
          packed[o + 1] = screen[i * 2 + 1] * sy;
          packed[o + 2] = 90 - world[a + 2];
          for (let q = 0; q < 3; q++) {
            packed[o + 3 + q] = normal[a + q];
            packed[o + 6 + q] = world[a + q];
          }
        }
        faces++;
      },
      finish(count) {
        if (disposed || count !== faces || count !== capacity)
          throw Error('Incomplete GPU surface batch');
        gl.bindVertexArray(vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, packed);
        gl.useProgram(program);
        gl.uniform2f(size, canvas.width, canvas.height);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, count * 3);
        draws++;
        counts.draws++;
      },
      status: () => ({
        mode: 'GPU smooth opaque surface',
        disposed,
        draws,
        triangles: faces,
        resolution: [canvas.width, canvas.height],
        bufferBytes: packed?.byteLength ?? 0,
        depth: true,
        cull: false,
        hardwareAA: gl.getContextAttributes().antialias,
        samples: gl.getParameter(gl.SAMPLES),
        smoothNormals: true,
        materialAlpha: 1,
        polygonIncrease: false,
        exactCanvasPixels: false
      }),
      dispose() {
        if (disposed) return;
        disposed = true;
        release();
      }
    };
  }

  function create({ surface = false } = {}) {
    if (surface) return createSurface();
    const canvas = document.createElement('canvas'),
      gl = canvas.getContext('webgl2', {
        alpha: true,
        premultipliedAlpha: true,
        preserveDrawingBuffer: true,
        antialias: false,
        depth: false,
        stencil: false
      });
    if (!gl) throw Error('WebGL2 unavailable');
    let program = null,
      vao = null,
      buffer = null,
      packed = null,
      disposed = false,
      capacity = 0,
      faces = 0,
      sx = 1,
      sy = 1,
      draws = 0;
    const shaders = [];
    counts.created++;
    counts.liveScopes++;
    counts.maxLive = Math.max(counts.maxLive, counts.liveScopes);
    function compile(source, type) {
      const sh = gl.createShader(type);
      shaders.push(sh);
      gl.shaderSource(sh, source);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS))
        throw Error(gl.getShaderInfoLog(sh));
      return sh;
    }
    function release() {
      for (const sh of shaders) gl.deleteShader(sh);
      shaders.length = 0;
      if (buffer) {
        gl.deleteBuffer(buffer);
        buffer = null;
        counts.buffers--;
        counts.bufferBytes -= packed?.byteLength ?? 0;
      }
      if (vao) {
        gl.deleteVertexArray(vao);
        vao = null;
        counts.vaos--;
      }
      if (program) {
        gl.deleteProgram(program);
        program = null;
        counts.programs--;
      }
      packed = null;
      canvas.width = canvas.height = 1;
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      counts.disposed++;
      counts.liveScopes--;
    }
    try {
      const v = compile(vertex, gl.VERTEX_SHADER),
        f = compile(fragment, gl.FRAGMENT_SHADER);
      program = gl.createProgram();
      counts.programs++;
      gl.attachShader(program, v);
      gl.attachShader(program, f);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw Error(gl.getProgramInfoLog(program));
      for (const sh of shaders) gl.deleteShader(sh);
      shaders.length = 0;
      vao = gl.createVertexArray();
      counts.vaos++;
      buffer = gl.createBuffer();
      counts.buffers++;
      gl.bindVertexArray(vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      for (let i = 0; i < 5; i++) {
        gl.enableVertexAttribArray(i);
        gl.vertexAttribPointer(i, 2, gl.FLOAT, false, 40, i * 8);
      }
      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.CULL_FACE);
      gl.disable(gl.STENCIL_TEST);
      gl.enable(gl.BLEND);
      gl.blendFuncSeparate(
        gl.SRC_ALPHA,
        gl.ONE_MINUS_SRC_ALPHA,
        gl.ONE,
        gl.ONE_MINUS_SRC_ALPHA
      );
      gl.clearColor(0, 0, 0, 0);
    } catch (e) {
      counts.failures++;
      disposed = true;
      release();
      throw e;
    }
    const size = gl.getUniformLocation(program, 'size');
    return {
      canvas,
      begin(count, sceneWidth, sceneHeight, width, height) {
        if (disposed || gl.isContextLost())
          throw Error('GPU raster unavailable');
        if (count < 1 || count > 27288) throw Error('GPU raster shape invalid');
        if (count !== capacity) {
          counts.bufferBytes -= packed?.byteLength ?? 0;
          packed = new Float32Array(count * 60);
          capacity = count;
          counts.bufferBytes += packed.byteLength;
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          gl.bufferData(gl.ARRAY_BUFFER, packed.byteLength, gl.DYNAMIC_DRAW);
        }
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
        faces = 0;
        sx = width / sceneWidth;
        sy = height / sceneHeight;
      },
      face(j, x0, y0, x1, y1, x2, y2, shade, alpha) {
        x0 *= sx;
        y0 *= sy;
        x1 *= sx;
        y1 *= sy;
        x2 *= sx;
        y2 *= sy;
        const left = Math.floor(Math.min(x0, x1, x2)) - 1,
          right = Math.ceil(Math.max(x0, x1, x2)) + 1,
          top = Math.floor(Math.min(y0, y1, y2)) - 1,
          bottom = Math.ceil(Math.max(y0, y1, y2)) + 1;
        for (let k = 0; k < 6; k++) {
          const o = (j * 6 + k) * 10;
          packed[o] = k === 1 || k === 4 || k === 5 ? right : left;
          packed[o + 1] = k === 2 || k === 3 || k === 5 ? bottom : top;
          packed[o + 2] = x0;
          packed[o + 3] = y0;
          packed[o + 4] = x1;
          packed[o + 5] = y1;
          packed[o + 6] = x2;
          packed[o + 7] = y2;
          packed[o + 8] = shade / 255;
          packed[o + 9] = alpha;
        }
        faces++;
      },
      finish(count) {
        if (disposed || count !== faces || count !== capacity)
          throw Error('Incomplete GPU triangle batch');
        gl.bindVertexArray(vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, packed);
        gl.useProgram(program);
        gl.uniform2f(size, canvas.width, canvas.height);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, count * 6);
        draws++;
        counts.draws++;
      },
      status: () => ({
        mode: 'GPU per-face area coverage',
        disposed,
        draws,
        triangles: faces,
        resolution: [canvas.width, canvas.height],
        bufferBytes: packed?.byteLength ?? 0,
        depth: false,
        cull: false,
        hardwareAA: false,
        CPUTransformLightingAndSortPreserved: true,
        exactCanvasPixels: false
      }),
      dispose() {
        if (disposed) return;
        disposed = true;
        release();
      }
    };
  }
  return Object.freeze({ create, normals, diagnostics: () => ({ ...counts }) });
})();

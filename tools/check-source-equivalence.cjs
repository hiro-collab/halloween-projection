'use strict';

// Development-only check for formatting/comment changes. Acorn is not shipped.
// Usage: node tools/check-source-equivalence.cjs <base-ref> <acorn-module-path>
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const assert = require('node:assert/strict');
const [base = 'main', parserPath] = process.argv.slice(2);
if (!parserPath)
  throw Error('Pass an installed Acorn module path as the second argument.');
const acorn = require(path.resolve(parserPath));
const root = path.resolve(__dirname, '..');

function shaderTemplate(node) {
  return (
    node.type === 'TemplateLiteral' &&
    /#version|precision highp|float source|vec[234] [A-Za-z]+\(/.test(
      node.quasis.map((q) => q.value.raw).join('${EXPRESSION}')
    )
  );
}

function glslTokens(source) {
  const tokens = [];
  let i = 0;
  while (i < source.length) {
    const s = source.slice(i);
    const whitespace = /^\s+/.exec(s);
    if (whitespace) {
      i += whitespace[0].length;
      continue;
    }
    const comment = /^(?:\/\/[^\n]*|\/\*[\s\S]*?\*\/)/.exec(s);
    if (comment) {
      i += comment[0].length;
      continue;
    }
    if (s[0] === '#') {
      const directive = /^#[^\n]*/.exec(s)[0];
      // Only #version appears in these shaders. Never normalize macro directives.
      assert.match(directive, /^#version\s+300\s+es\s*$/);
      tokens.push('#version 300 es');
      i += directive.length;
      continue;
    }
    const token =
      /^(?:[A-Za-z_]\w*|(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?[fFuU]?|<<=|>>=|\+\+|--|<<|>>|<=|>=|==|!=|&&|\|\||\^\^|[+\-*\/%&|^]=|[{}()[\];,.?:~!+\-*\/%<>=&|^])/.exec(
        s
      );
    if (!token) throw Error('Unrecognized GLSL token near: ' + s.slice(0, 30));
    tokens.push(token[0]);
    i += token[0].length;
  }
  return tokens;
}

function normalize(node) {
  if (Array.isArray(node)) return node.map(normalize);
  if (!node || typeof node !== 'object') return node;
  if (shaderTemplate(node)) {
    return {
      type: node.type,
      quasis: node.quasis.map((q) => ({
        type: q.type,
        tail: q.tail,
        tokens: glslTokens(q.value.raw)
      })),
      expressions: normalize(node.expressions)
    };
  }
  const result = {};
  for (const [key, value] of Object.entries(node)) {
    if (['start', 'end', 'loc', 'range'].includes(key)) continue;
    if (key === 'raw' && node.type === 'Literal') continue;
    result[key] = normalize(value);
  }
  return result;
}

function inspect(source) {
  const ast = acorn.parse(source, { ecmaVersion: 'latest' });
  const templates = [];
  function walk(node) {
    if (!node || typeof node !== 'object') return;
    if (shaderTemplate(node)) templates.push(node);
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(walk);
      else if (value && typeof value === 'object') walk(value);
    }
  }
  walk(ast);
  return { ast, templates };
}

if (require.main === module) {
  const files = cp
    .execFileSync('git', ['ls-tree', '-r', '--name-only', base, 'web'], {
      cwd: root,
      encoding: 'utf8'
    })
    .trim()
    .split('\n')
    .filter((f) => f.endsWith('.js') && f !== 'web/sw.js');
  let shaders = 0;
  for (const file of files) {
    const before = cp.execFileSync('git', ['show', base + ':' + file], {
      cwd: root,
      encoding: 'utf8',
      maxBuffer: 5_000_000
    });
    const after = fs.readFileSync(path.join(root, file), 'utf8');
    const a = inspect(before),
      b = inspect(after);
    assert.deepEqual(
      normalize(b.ast),
      normalize(a.ast),
      file + ': executable syntax changed'
    );
    shaders += a.templates.length;
    // Constant-selector specialization uses this exact source-text replacement.
    if (file === 'web/a-composite.js') {
      const anchor = 'uniform int stage;';
      for (const s of [a, b])
        assert.equal(
          s.templates
            .flatMap((t) => t.quasis)
            .filter((q) => q.value.raw.includes(anchor)).length,
          1
        );
    }
  }
  console.log(
    JSON.stringify({
      base,
      javascriptFiles: files.length,
      shaderTemplates: shaders,
      syntaxEquivalent: true,
      glslTokensEquivalent: true,
      generatedServiceWorkerExcluded: true
    })
  );
}

module.exports = { shaderTemplate, glslTokens, normalize, inspect };

'use strict';

// CPU-only suites. Native-window and browser/soak checks have separate setup.
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const names = fs
  .readdirSync(path.join(root, 'tests'))
  .filter((name) => name.endsWith('.qa.cjs') && name !== 'native-window.qa.cjs')
  .sort();
const results = [];
for (const name of names) {
  const result = spawnSync(process.execPath, [path.join(root, 'tests', name)], {
    cwd: root,
    encoding: 'utf8',
    timeout: 30_000
  });
  results.push({ name, passed: result.status === 0 });
  console.log((result.status === 0 ? 'PASS ' : 'FAIL ') + name);
  if (result.status !== 0) {
    process.stderr.write(
      result.stderr || result.stdout || String(result.error)
    );
  }
}
const failed = results.filter((result) => !result.passed).length;
console.log(
  JSON.stringify({
    suites: results.length,
    passed: results.length - failed,
    failed
  })
);
process.exitCode = failed ? 1 : 0;

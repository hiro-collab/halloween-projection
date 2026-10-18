"""Before/after loopback rendering check; no file URLs or product mutations.

Usage: set PLAYWRIGHT_CLI to the installed CLI entry point, then run
python tests/run-readability-qa.py <baseline-checkout>/web
"""
from pathlib import Path
import json
import os
import shutil
import subprocess
import sys
import uuid

ROOT = Path(__file__).resolve().parent.parent
baseline = Path(sys.argv[1]).resolve(strict=True)
entry = os.environ.get('PLAYWRIGHT_CLI') or shutil.which('playwright-cli')
if not entry:
    raise SystemExit('Set PLAYWRIGHT_CLI to the installed Playwright CLI entry point.')
command = ['node', entry] if entry.endswith(('.js', '.mjs', '.cjs')) else [entry]
out = ROOT / 'output/readability-desktop'
out.mkdir(parents=True, exist_ok=True)
session = 'halloween-readability-' + uuid.uuid4().hex[:8]
servers = []
cleanup = {}

def cli(*args, timeout=150):
    return subprocess.run([*command, '-s=' + session, *args], cwd=ROOT,
                          capture_output=True, timeout=timeout)

try:
    urls = []
    for directory in [baseline, ROOT / 'web']:
        server = subprocess.Popen(
            [sys.executable, str(ROOT / 'tests/serve-web-preview.py'),
             str(directory), '--port', '0', '--stdin-control'],
            stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
            text=True)
        servers.append(server)
        urls.append(json.loads(server.stdout.readline())['url'])
    opened = cli('open', 'about:blank', '--browser=chrome', '--headed', timeout=40)
    if opened.returncode:
        raise RuntimeError(opened.stderr.decode('utf-8', errors='replace'))
    source = (ROOT / 'tests/readability-render.qa.js').read_text('utf-8')
    source = source.replace('__BASE_URL__', urls[0]).replace('__NEW_URL__', urls[1])
    source = source.replace('__QA_OUT__', out.as_posix())
    resolved = out / 'resolved-render.js'
    resolved.write_text(source, 'utf-8')
    completed = cli('run-code', '--filename', str(resolved), '--raw')
    (out / 'render-result.json').write_bytes(completed.stdout)
    (out / 'render-stderr.txt').write_bytes(completed.stderr)
    if completed.returncode:
        raise RuntimeError('Browser comparison did not complete; inspect ignored output.')
    result = json.loads(completed.stdout)
    if isinstance(result, str):
        result = json.loads(result)
    print(json.dumps({'passed': result['passed'], 'failed': result['failed']}))
    if result['failed']:
        raise SystemExit(1)
finally:
    cleanup['browserCloseExit'] = cli('close', timeout=30).returncode
    for server in servers:
        if server.poll() is None:
            server.communicate('quit\n', timeout=25)
    cleanup['serverExits'] = [s.returncode for s in servers]
    (out / 'cleanup.json').write_text(json.dumps(cleanup), 'utf-8')

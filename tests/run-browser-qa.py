"""Portable CLI browser QA. Set PLAYWRIGHT_CLI to an installed CLI JS entry point."""
from pathlib import Path
import json,os,shutil,subprocess,sys,uuid
ROOT=Path(__file__).resolve().parent.parent
entry=os.environ.get('PLAYWRIGHT_CLI') or shutil.which('playwright-cli')
if not entry:raise SystemExit('Set PLAYWRIGHT_CLI to the installed Playwright CLI entry point; Node.js and Chrome are required.')
command=['node',entry] if entry.endswith(('.js','.mjs','.cjs')) else [entry]
names=sys.argv[1:] or ['common-api','resources','keyboard-lifecycle','realtime-controls','offline-unpacked','natural-motion']
results=[]
for name in names:
 out=ROOT/'output/git-qa'/name;out.mkdir(parents=True,exist_ok=True)
 server=subprocess.Popen([sys.executable,str(ROOT/'tests/serve-web-preview.py'),str(ROOT/'web'),'--port','0','--stdin-control'],cwd=ROOT,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)
 session='halloween-gitqa-'+name+'-'+uuid.uuid4().hex[:8]
 def cli(*args,timeout=150):return subprocess.run([*command,'-s='+session,*args],cwd=ROOT,capture_output=True,timeout=timeout)
 try:
  meta=json.loads(server.stdout.readline());base=meta['url'].rstrip('/')+'/'
  p=cli('open',base,'--browser=chrome',timeout=40);assert p.returncode==0,p.stderr
  source=(ROOT/'tests/browser'/(name+'.qa.js')).read_text('utf-8').replace('__WEB_URI__',(ROOT/'web').as_uri()).replace('__WEB_URL__',base.rstrip('/')).replace('__QA_OUT__',out.as_posix())
  path=out/'resolved.qa.js';path.write_text(source,'utf-8')
  p=cli('run-code','--filename',str(path),'--raw');(out/'stdout.txt').write_bytes(p.stdout);(out/'stderr.txt').write_bytes(p.stderr)
  raw=json.loads(p.stdout);result=json.loads(raw) if isinstance(raw,str) else raw
  (out/'result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),'utf-8')
  results.append({'name':name,'passed':result.get('passed'),'failed':result.get('failed')})
  print(json.dumps(results[-1]),flush=True);assert result.get('failed')==0,results[-1]
 finally:
  p=cli('close',timeout=30)
  if server.poll() is None:server.communicate('quit\n',timeout=25)
  (out/'cleanup.json').write_text(json.dumps({'serverExit':server.returncode,'browserCloseExit':p.returncode}),'utf-8')
print(json.dumps({'results':results,'passed':sum(x['passed'] for x in results),'failed':0}))

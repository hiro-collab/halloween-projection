"""Owned Chrome comparisons against Git-exported v40/v41; no user profile use."""
from pathlib import Path
import datetime,hashlib,json,os,shutil,subprocess,sys,uuid,zipfile
ROOT=Path(__file__).resolve().parent.parent
entry=os.environ.get('PLAYWRIGHT_CLI') or shutil.which('playwright-cli')
if not entry:raise SystemExit('Set PLAYWRIGHT_CLI to the installed CLI JS entry point; Node.js and Chrome are required.')
cli=['node',entry] if entry.endswith(('.js','.mjs','.cjs')) else [entry]
cases=sys.argv[1:] or ['cache-equivalence']
for name in cases:
 if not name.replace('-','').isalnum():raise SystemExit('Invalid test name')
 out=ROOT/'output/a-performance-qa'/(name+'-'+datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%S')+'-'+uuid.uuid4().hex[:6]);out.mkdir(parents=True)
 roots={'NEW':ROOT/'web'}
 for key,ref in [('V40','f23b4aa9d3a16755d10cc202437f4c6e8ea2ae44'),('V41','81971bfebb713d6693be2928bcdca9d7b4415733')]:
  folder=out/key;folder.mkdir();archive=folder/'source.zip';subprocess.run(['git','archive','--format=zip','-o',str(archive),ref,'web'],cwd=ROOT,check=True)
  with zipfile.ZipFile(archive) as z:
   for path in z.namelist():assert (folder/path).resolve().is_relative_to(folder.resolve()),path
   z.extractall(folder)
  roots[key]=folder/'web'
 servers=[];urls={};session='halloween-performance-'+uuid.uuid4().hex[:10]
 metadata={'case':name,'session':session,'runnerPID':os.getpid(),'servers':[],'phase':'starting','webSHA256':{str(f.relative_to(ROOT/'web')).replace('\\','/'):hashlib.sha256(f.read_bytes()).hexdigest() for f in (ROOT/'web').rglob('*') if f.is_file()}}
 def receipt(): (out/'SESSION.json').write_text(json.dumps(metadata,indent=2),'utf-8')
 receipt()
 def command(*args,timeout=450):return subprocess.run([*cli,'-s='+session,*args],cwd=ROOT,capture_output=True,timeout=timeout)
 try:
  for key,root in roots.items():
   server=subprocess.Popen([sys.executable,str(ROOT/'tests/serve-web-preview.py'),str(root),'--port','0','--stdin-control'],cwd=ROOT,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True);servers.append(server);urls[key]=json.loads(server.stdout.readline())['url'].rstrip('/');metadata['servers'].append({'key':key,'pid':server.pid,'url':urls[key]});receipt()
  p=command('open',urls['NEW']+'/index.html','--browser=chrome',timeout=45);assert p.returncode==0,p.stderr
  source=(ROOT/'tests/performance'/(name+'.qa.js')).read_text('utf-8')
  for key,url in urls.items():source=source.replace('__'+key+'_URL__',url)
  source=source.replace('__OUT__',out.as_posix());path=out/'resolved.qa.js';path.write_text(source,'utf-8');p=command('run-code','--filename',str(path),'--raw');(out/'stdout.txt').write_bytes(p.stdout);(out/'stderr.txt').write_bytes(p.stderr);assert p.returncode==0,p.stdout[-3000:]
  raw=json.loads(p.stdout);data=json.loads(raw) if isinstance(raw,str) else raw;(out/'result.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),'utf-8');metadata['phase']='result-saved';receipt();print(json.dumps({'name':name,'passed':data.get('passed'),'failed':data.get('failed'),'output':str(out),'mean':data.get('mean')},ensure_ascii=False),flush=True);assert data.get('failed')==0
 finally:
  p=command('close',timeout=30)
  for s in servers:
   if s.poll() is None:s.communicate('quit\n',timeout=25)
  (out/'cleanup.json').write_text(json.dumps({'serverExits':[s.returncode for s in servers],'browserCloseExit':p.returncode}),'utf-8');metadata['phase']='closed';receipt()

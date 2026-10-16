"""Rebuild a saved release with its original ZIP entry metadata, then verify bytes."""
from pathlib import Path
import base64,hashlib,json,subprocess,sys,zipfile
ROOT=Path(__file__).resolve().parent.parent
release=Path(sys.argv[1]) if len(sys.argv)>1 else next((ROOT/'releases').glob('v*.json'))
if not release.is_absolute():release=ROOT/release
saved=json.loads(release.read_text('utf-8'))
p=subprocess.run([sys.executable,str(ROOT/'tools/build-web-package.py')],cwd=ROOT,capture_output=True,check=True)
build=json.loads(p.stdout);assert build['version']==saved['version'],'Select the matching Git revision first'
assert build['build']==saved['build'],'Asset build identity changed'
dest=ROOT/'dist'/saved['zip']['filename']
with zipfile.ZipFile(dest,'w',compression=zipfile.ZIP_DEFLATED) as archive:
 archive.comment=base64.b64decode(saved['zip']['comment'])
 for item in saved['zip']['entries']:
  data=(ROOT/'web'/item['name']).read_bytes()
  assert hashlib.sha256(data).hexdigest()==item['sha256'],item['name']
  info=zipfile.ZipInfo(item['name'],tuple(item['date_time']))
  for key in ['compress_type','create_system','create_version','extract_version','reserved','flag_bits','volume','internal_attr','external_attr']:
   setattr(info,key,item[key])
  info.extra=base64.b64decode(item['extra']);info.comment=base64.b64decode(item['comment'])
  archive.writestr(info,data)
digest=hashlib.sha256(dest.read_bytes()).hexdigest()
assert digest==saved['zip']['sha256'],(digest,saved['zip']['sha256'])
assert dest.stat().st_size==saved['zip']['bytes']
build.update(sha256=digest,bytes=dest.stat().st_size)
(ROOT/'dist/web-manifest.json').write_text(json.dumps(build,indent=2),'utf-8')
print(json.dumps({'version':saved['version'],'zip':str(dest),'bytes':dest.stat().st_size,'sha256':digest,'matchesSavedZIP':True}))

from pathlib import Path
import zipfile,hashlib,json
root=Path(__file__).resolve().parent.parent
out=root/'dist';out.mkdir(exist_ok=True)
names=['START.cmd','index.html','はじめに.txt','README.txt','RIGHTS.txt','VERIFICATION.txt']
sources={n:(root/'app'/('README.txt' if n=='はじめに.txt' else n)) for n in names}
dest=out/'halloween-projection-v0.1.1-windows-preview.zip'
with zipfile.ZipFile(dest,'w',compression=zipfile.ZIP_DEFLATED) as z:
 for name in names:z.write(sources[name],name)
with zipfile.ZipFile(dest) as z:
 assert z.testzip() is None
 assert z.namelist()==names
 for name in names:assert z.read(name)==(sources[name]).read_bytes()
report={'version':'0.1.1-startup-preview','zip':dest.name,'bytes':dest.stat().st_size,'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'entries':names}
(out/'manifest.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report))

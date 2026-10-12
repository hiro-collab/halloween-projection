from pathlib import Path
import zipfile,hashlib,json
root=Path(__file__).resolve().parent.parent
out=root/'dist';out.mkdir(exist_ok=True)
names=['index.html','START.cmd','README.txt','RIGHTS.txt','VERIFICATION.txt']
dest=out/'halloween-projection-v0.1-preview.zip'
with zipfile.ZipFile(dest,'w',compression=zipfile.ZIP_DEFLATED) as z:
 for name in names:z.write(root/'app'/name,name)
with zipfile.ZipFile(dest) as z:
 assert z.testzip() is None
 assert z.namelist()==names
 for name in names:assert z.read(name)==(root/'app'/name).read_bytes()
report={'version':'0.1-technical-preview','zip':dest.name,'bytes':dest.stat().st_size,'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'entries':names}
(out/'manifest.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report))

from pathlib import Path
root=Path(__file__).resolve().parent.parent
ps=(root/'tools/launcher-source.ps1').read_text(encoding='utf-8')
if chr(34) in ps:raise ValueError('Inline source must use single quoted literals')
compact=';'.join(line.strip() for line in ps.splitlines())
for a,b in [('{;','{'),(';}', '}'),('};else','}else'),('};elseif','}elseif'),('};catch','}catch'),('};finally','}finally')]:compact=compact.replace(a,b)
command='$server={'+compact+"}; if($env:HALLOWEEN_TEST_CONSOLE -eq '1'){& $server}else{$child=Start-Process -FilePath (Join-Path $PSHOME 'powershell.exe') -WindowStyle Hidden -ArgumentList @('-NoProfile','-WindowStyle','Hidden','-Command',$server.ToString()) -PassThru; if($env:HALLOWEEN_QA -eq '1'){Write-Output $child.Id}}"
lines=['@echo off','setlocal DisableDelayedExpansion','set '+chr(34)+'HALLOWEEN_ROOT=%~dp0'+chr(34),'set '+chr(34)+'HALLOWEEN_NO_BROWSER=0'+chr(34),'set '+chr(34)+'HALLOWEEN_TEST_CONSOLE=0'+chr(34),'set '+chr(34)+'HALLOWEEN_QA=0'+chr(34),'if '+chr(34)+'%~1'+chr(34)+'=='+chr(34)+'--test-console'+chr(34)+' set '+chr(34)+'HALLOWEEN_TEST_CONSOLE=1'+chr(34),'if '+chr(34)+'%~2'+chr(34)+'=='+chr(34)+'--no-browser'+chr(34)+' set '+chr(34)+'HALLOWEEN_NO_BROWSER=1'+chr(34),'if '+chr(34)+'%~1'+chr(34)+'=='+chr(34)+'--qa'+chr(34)+' set '+chr(34)+'HALLOWEEN_QA=1'+chr(34),chr(34)+r'%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe'+chr(34)+' -NoProfile -Command '+chr(34)+command+chr(34),'endlocal']
assert max(map(len,lines))<8191
data=('\r\n'.join(lines)+'\r\n').encode('ascii')
for rel in ['START.cmd','app/START.cmd']:(root/rel).write_bytes(data)
print('Generated matching root/app Windows launchers.')

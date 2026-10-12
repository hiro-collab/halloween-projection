$ErrorActionPreference='Stop'
$root=$env:HALLOWEEN_ROOT
$path=Join-Path $root 'index.html'
if(!(Test-Path -LiteralPath $path)){ $path=Join-Path $root 'app\index.html' }
$source=[IO.File]::ReadAllText($path,[Text.Encoding]::UTF8)
$listener=[Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback,0)
$listener.Start()
$port=$listener.LocalEndpoint.Port
$origin='http://127.0.0.1:'+ $port
$token=[Guid]::NewGuid().ToString('N')
$config=@{token=$token;kind='windows-local'}|ConvertTo-Json -Compress
$html=[Text.Encoding]::UTF8.GetBytes($source.Replace('<head>','<head><script>window.halloweenLocalRuntime='+$config+';</script>'))
$quitBytes=[Text.Encoding]::UTF8.GetBytes('ok')
$failBytes=[Text.Encoding]::UTF8.GetBytes('not available')
$last=[DateTime]::UtcNow
$done=$false
function Send($status,$mime,$bytes){
 $head='HTTP/1.1 '+$status+[char]13+[char]10+'Content-Type: '+$mime+[char]13+[char]10+'Content-Length: '+$bytes.Length+[char]13+[char]10+'Cache-Control: no-store'+[char]13+[char]10+'Connection: close'+[char]13+[char]10+[char]13+[char]10
 $data=[Text.Encoding]::ASCII.GetBytes($head)
 $stream.Write($data,0,$data.Length)
 $stream.Write($bytes,0,$bytes.Length)
 $stream.Flush()
}
try{
 if($env:HALLOWEEN_NO_BROWSER -ne '1'){Start-Process ($origin+'/')}
 if($env:HALLOWEEN_TEST_CONSOLE -eq '1'){Write-Host ($origin+'/')}
 while(!$done){
  if(([DateTime]::UtcNow-$last).TotalSeconds -gt 90){break}
  if(!$listener.Pending()){Start-Sleep -Milliseconds 100;continue}
  $client=$listener.AcceptTcpClient()
  try{
   $client.ReceiveTimeout=5000;$client.SendTimeout=5000
   $stream=$client.GetStream()
   $reader=[IO.StreamReader]::new($stream,[Text.Encoding]::ASCII,$false,1024,$true)
   $line=$reader.ReadLine();$headers=@{};$length=0
   while($header=$reader.ReadLine()){
    $length+=$header.Length;if($length -gt 8192){throw 'Header too large'}
    $at=$header.IndexOf(':');if($at -gt 0){$headers[$header.Substring(0,$at).ToLower()]=$header.Substring($at+1).Trim()}
   }
   if($headers['host'] -ne ('127.0.0.1:'+ $port)){Send '403 Forbidden' 'text/plain' $failBytes;continue}
   if($line -eq 'GET / HTTP/1.1' -or $line -eq 'GET /index.html HTTP/1.1'){
    $last=[DateTime]::UtcNow;Send '200 OK' 'text/html; charset=utf-8' $html
   }elseif($line -eq ('POST /alive/'+$token+' HTTP/1.1') -or $line -eq ('POST /quit/'+$token+' HTTP/1.1')){
    if($headers['origin'] -ne $origin){Send '403 Forbidden' 'text/plain' $failBytes;continue}
    $last=[DateTime]::UtcNow
    Send '200 OK' 'text/plain' $quitBytes
    if($line -eq ('POST /quit/'+$token+' HTTP/1.1')){$done=$true}
   }else{Send '404 Not Found' 'text/plain' $failBytes}
  }catch{}finally{$client.Dispose()}
 }
}finally{$listener.Stop()}

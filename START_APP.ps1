$ErrorActionPreference = 'Stop'
$root = Join-Path $PSScriptRoot 'dist'
if (-not (Test-Path (Join-Path $root 'index.html'))) {
  Write-Host 'Ошибка: папка dist или index.html не найдены.' -ForegroundColor Red
  Read-Host 'Нажмите Enter'
  exit 1
}
$port = 4173
$prefix = "http://localhost:$port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
try { $listener.Start() } catch {
  Write-Host "Не удалось открыть порт $port. Закройте другое приложение, использующее этот порт." -ForegroundColor Red
  Read-Host 'Нажмите Enter'
  exit 1
}
Start-Process $prefix
Write-Host "РосКапСтрой запущен: $prefix" -ForegroundColor Green
Write-Host 'Не закрывайте это окно, пока работаете с приложением.'
Write-Host 'Для остановки нажмите Ctrl+C.'
$mime = @{
  '.html'='text/html; charset=utf-8'; '.js'='text/javascript; charset=utf-8'; '.css'='text/css; charset=utf-8';
  '.json'='application/json; charset=utf-8'; '.webmanifest'='application/manifest+json; charset=utf-8';
  '.svg'='image/svg+xml'; '.woff'='font/woff'; '.woff2'='font/woff2'; '.png'='image/png'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'
}
while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart('/'))
    if ([string]::IsNullOrWhiteSpace($rel)) { $rel = 'index.html' }
    $candidate = [IO.Path]::GetFullPath((Join-Path $root $rel))
    $rootFull = [IO.Path]::GetFullPath($root)
    if (-not $candidate.StartsWith($rootFull, [StringComparison]::OrdinalIgnoreCase)) { throw 'Invalid path' }
    if (-not (Test-Path $candidate -PathType Leaf)) {
      # SPA fallback for navigation requests only.
      if ($ctx.Request.Headers['Accept'] -like '*text/html*') { $candidate = Join-Path $root 'index.html' }
      else { $ctx.Response.StatusCode = 404; $ctx.Response.Close(); continue }
    }
    $ext = [IO.Path]::GetExtension($candidate).ToLowerInvariant()
    $ctx.Response.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
    $bytes = [IO.File]::ReadAllBytes($candidate)
    $ctx.Response.ContentLength64 = $bytes.Length
    $ctx.Response.OutputStream.Write($bytes,0,$bytes.Length)
    $ctx.Response.OutputStream.Close()
  } catch {
    try { $ctx.Response.StatusCode = 500; $ctx.Response.Close() } catch {}
  }
}

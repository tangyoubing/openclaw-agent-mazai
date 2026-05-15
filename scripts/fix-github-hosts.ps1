# Fix GitHub DNS - 改 hosts 文件
$hostsPath = "$env:SystemRoot\System32\drivers\etc\hosts"

$entries = @"

# GitHub DNS fix
20.205.243.166 github.com
20.205.243.166 www.github.com
159.106.121.75 github.global.ssl.fastly.net
185.199.108.153 assets-cdn.github.com
185.199.109.153 assets-cdn.github.com
185.199.110.153 assets-cdn.github.com
185.199.111.153 assets-cdn.github.com
"@

Add-Content -Path $hostsPath -Value $entries -Encoding ASCII
Write-Host "Hosts 已更新！" -ForegroundColor Green

ipconfig /flushdns | Out-Null
Write-Host "DNS 缓存已刷新！" -ForegroundColor Green

Write-Host ""
Write-Host "按任意键关闭..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

$hostsPath = "$env:SystemRoot\System32\drivers\etc\hosts"
$current = Get-Content $hostsPath -Raw

$entries = @"

# GitHub DNS fix - added $(Get-Date -Format 'yyyy-MM-dd HH:mm')
20.205.243.166 github.com
20.205.243.166 www.github.com
159.106.121.75 github.global.ssl.fastly.net
185.199.108.153 assets-cdn.github.com
185.199.109.153 assets-cdn.github.com
185.199.110.153 assets-cdn.github.com
185.199.111.153 assets-cdn.github.com
"@

if ($current -notmatch "github\.com") {
    Add-Content -Path $hostsPath -Value $entries -Encoding ASCII
    Write-Host "[OK] Hosts updated with GitHub DNS entries"
} else {
    Write-Host "[SKIP] GitHub entries already exist"
}

ipconfig /flushdns | Out-Null
Write-Host "[OK] DNS cache flushed"

Write-Host ""
Write-Host "You can now access github.com. Press any key to close..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

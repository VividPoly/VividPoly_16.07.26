@echo off
:: Run as Administrator once so your phone can reach the VividPoly preview.
cd /d "%~dp0"
title VividPoly: allow phone preview
echo.
echo  This opens Windows Firewall for TCP port 3001 on all network profiles.
echo.

net session >nul 2>&1
if errorlevel 1 (
  echo  Right-click this file and choose "Run as administrator".
  echo.
  pause
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "Get-NetFirewallRule -DisplayName 'VividPoly Dev Port 3001' -ErrorAction SilentlyContinue | Remove-NetFirewallRule -ErrorAction SilentlyContinue; ^
   New-NetFirewallRule -DisplayName 'VividPoly Dev Port 3001' -Direction Inbound -Action Allow -Protocol TCP -LocalPort 3001 -Profile Any -Description 'Allow phone/tablet LAN preview for VividPoly Next.js' | Out-Null; ^
   try { Set-NetFirewallRule -DisplayName 'VividPoly Next.js Dev' -Profile Any -ErrorAction SilentlyContinue } catch {}; ^
   try { Set-NetConnectionProfile -InterfaceAlias 'Wi-Fi' -NetworkCategory Private -ErrorAction SilentlyContinue } catch {}; ^
   Write-Host ' Firewall updated for port 3001.'; ^
   $ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike '127.*' -and $_.PrefixOrigin -ne 'WellKnown' } | Select-Object -First 1 -ExpandProperty IPAddress); ^
   Write-Host (' On your phone use: http://' + $ip + ':3001')"

echo.
pause

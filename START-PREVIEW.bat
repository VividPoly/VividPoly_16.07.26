@echo off
cd /d "%~dp0"
title VividPoly Preview
echo.
echo  VividPoly: starting preview...
echo.

if not exist "node_modules\" (
  echo  Installing dependencies ^(first time only^)...
  call npm install
  if errorlevel 1 (
    echo  npm install failed. Make sure Node.js is installed.
    pause
    exit /b 1
  )
)

echo  Stopping any old server on port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do taskkill /PID %%a /F >nul 2>&1

if exist ".next\dev\lock" del /f /q ".next\dev\lock" >nul 2>&1

for /f "delims=" %%I in ('powershell -NoProfile -Command "(Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike '127.*' -and $_.PrefixOrigin -ne 'WellKnown' } | Select-Object -First 1 -ExpandProperty IPAddress)"') do set PHONE_IP=%%I

echo  On this PC:  http://localhost:3000
echo  Desktop layout needs a wide browser window ^(1024px+^).
if defined PHONE_IP (
  echo  On your phone: http://%PHONE_IP%:3000
  echo    ^(same Wi-Fi as this PC^)
) else (
  echo  On your phone: check the "Network:" line after the server starts
)
echo.
echo  Keep this window open. Press Ctrl+C to stop.
echo.
start "" "http://localhost:3000"
call npm run dev

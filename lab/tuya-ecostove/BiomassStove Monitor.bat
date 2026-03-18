@echo off
title BiomassStove Sensor Monitor
cd /d "C:\Users\CPL\wendys-oracle\lab\tuya-ecostove"

:: Check if already running on port 3456
netstat -ano | findstr ":3456 " | findstr "LISTENING" >nul 2>&1
if %errorlevel%==0 (
    echo Already running! Opening browser...
    start http://localhost:3456
    timeout /t 3 /nobreak >nul
    exit
)

echo =========================================
echo   BiomassStove Sensor Monitor
echo   Ctrl+C to stop
echo =========================================
echo.

:loop
echo [%date% %time%] Starting server...
node sensor-monitor.js
echo.
echo [%date% %time%] Server stopped. Restarting in 5 seconds...
echo   (Ctrl+C again to exit)
timeout /t 5 /nobreak >nul
goto loop

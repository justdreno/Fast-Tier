@echo off
echo ==========================================
echo FastTiers Setup Script for Windows
echo ==========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [1/4] Installing frontend dependencies...
call npm install
if errorlevel 1 goto error

echo.
echo [2/4] Installing server dependencies...
cd server
call npm install
if errorlevel 1 goto error
cd ..

echo.
echo [3/4] Installing discord-bot dependencies...
cd discord-bot
call npm install
if errorlevel 1 goto error
cd ..

echo.
echo [4/4] Initializing database...
cd server
node init-db.js
if errorlevel 1 goto error
cd ..

echo.
echo ==========================================
echo Setup completed successfully!
echo ==========================================
echo.
echo To start the application:
echo   npm run dev
echo.
echo Or start services separately:
echo   npm run dev:server  (Backend API)
echo   npm run dev:client  (Frontend)
echo   npm run dev:bot     (Discord Bot)
echo.
pause
exit /b 0

:error
echo.
echo ==========================================
echo ERROR: Setup failed!
echo ==========================================
echo.
echo If you see errors about 'sqlite3', try:
echo   npm install --build-from-source
echo.
pause
exit /b 1

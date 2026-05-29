@echo off
REM NoteXchangE - Quick Start Batch Script

echo.
echo ================================
echo NoteXchangE - Local Development
echo ================================
echo.

REM Check Node.js
echo Checking Node.js...
node --version
npm --version
echo.

REM Install Backend
echo Setting up Backend...
cd backend
echo Installing dependencies...
call npm install --legacy-peer-deps
cd ..
echo Backend setup complete!
echo.

REM Install Frontend
echo Setting up Frontend...
cd frontend
echo Installing dependencies...
call npm install --legacy-peer-deps
cd ..
echo Frontend setup complete!
echo.

echo ================================
echo Setup Complete!
echo ================================
echo.
echo To start the application:
echo.
echo Terminal 1 - Backend ^(Port 5000^):
echo   cd backend
echo   npm run dev
echo.
echo Terminal 2 - Frontend ^(Port 5173^):
echo   cd frontend
echo   npm run dev
echo.
echo Then open: http://localhost:5173
echo.
pause

@echo off
echo ========================================
echo GrowthForge Quick Start Script
echo ========================================
echo.

echo This script will help you:
echo 1. Start the backend server
echo 2. Install the mobile app
echo 3. Test the connection
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found. Please install Python first.
    pause
    exit /b 1
)

REM Check if Node.js is available
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Dependencies found!
echo.

REM Step 1: Install Python dependencies
echo Step 1: Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Failed to install Python dependencies
    pause
    exit /b 1
)

REM Step 2: Create admin user
echo.
echo Step 2: Creating admin user...
py create_admin_user.py

REM Step 3: Start backend server
echo.
echo Step 3: Starting backend server...
echo The server will start in a new window.
echo Keep it running while you install the mobile app.
echo.

start "GrowthForge Backend" cmd /k "py -m uvicorn app.main:app --host 0.0.0.0 --port 2000 --reload"

REM Wait for server to start
echo Waiting for server to start...
timeout /t 5 /nobreak >nul

REM Step 4: Test server
echo.
echo Step 4: Testing server connection...
curl -f http://localhost:2000/api/health >nul 2>&1
if errorlevel 1 (
    echo ❌ Server not responding. Please check the server window.
    pause
    exit /b 1
)

echo ✅ Server is running!
echo.

REM Step 5: Install mobile app
echo Step 5: Installing mobile app...
echo This will open in a new window.
echo.

start "Mobile App Installation" cmd /k "install-app.bat"

echo.
echo ========================================
echo 🎉 Setup Complete!
echo ========================================
echo.
echo 📱 Your GrowthForge app is being installed!
echo.
echo 🔐 Login Credentials:
echo    Admin: admin@growthforge.app / Admin123!@#
echo    Test:  test@growthforge.app / Test123!@#
echo.
echo 🌐 Backend: http://localhost:2000
echo 📱 Mobile App: Installing on your device...
echo.
echo 📋 Next Steps:
echo 1. Wait for mobile app installation
echo 2. Open the app on your phone
echo 3. Login with the credentials above
echo 4. Start tracking your habits!
echo.
echo 📚 For detailed setup: see MOBILE_APP_SETUP.md
echo.
pause

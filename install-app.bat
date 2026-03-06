@echo off
echo GrowthForge Mobile App Installation
echo ===================================
echo.

REM Add Android SDK platform-tools to PATH
set PATH=%PATH%;C:\Users\yashk\AppData\Local\Android\Sdk\platform-tools

REM Check if device is connected
echo Checking for connected Android devices...
adb devices
echo.

REM Navigate to frontend directory
cd frontend

REM Sync project with Android
echo Syncing project with Android...
npx cap sync android

echo.
echo Building and installing app...
echo.

REM Build and install
npx cap run android --target "adb-eed5fcbd-mvSC4b._adb-tls-connect._tcp"

echo.
echo If installation fails, try manual method:
echo 1. Open Android Studio
echo 2. Import project: frontend/android
echo 3. Build ^> Build Bundle(s) / APK(s) ^> Build APK(s)
echo 4. Run on device
echo.
pause

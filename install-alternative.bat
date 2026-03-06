@echo off
echo GrowthForge Mobile App - Alternative Installation Method
echo =====================================================
echo.

REM Add Android SDK tools to PATH
set PATH=%PATH%;C:\Users\yashk\AppData\Local\Android\Sdk\platform-tools;C:\Users\yashk\AppData\Local\Android\Sdk\tools

echo Step 1: Cleaning project...
cd frontend\android
gradlew.bat clean

echo.
echo Step 2: Building APK without cache...
set GRADLE_OPTS=-Xmx2048m -Dorg.gradle.jvmargs=-Xmx2048m
gradlew.bat assembleDebug --no-configuration-cache --no-daemon

echo.
echo Step 3: Checking if APK was created...
if exist "app\build\outputs\apk\debug\app-debug.apk" (
    echo APK found! Installing to device...
    adb install -r app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo ✅ Installation complete! Check your phone for GrowthForge app.
) else (
    echo ❌ APK not found. Trying alternative method...
    echo.
    echo Please open Android Studio and:
    echo 1. Click "Sync Project with Gradle Files"
    echo 2. Go to Build ^> Build Bundle(s) / APK(s) ^> Build APK(s)
    echo 3. Once built, click Run button to install
)

echo.
echo If you need to update API URL, edit:
echo frontend\src\config\api.ts or frontend\.env.local
echo.
pause

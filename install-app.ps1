# GrowthForge Mobile App Installation Script (PowerShell)
# =====================================================

Write-Host "GrowthForge Mobile App Installation" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Add Android SDK platform-tools to PATH
$env:PATH += ";C:\Users\yashk\AppData\Local\Android\Sdk\platform-tools"

# Check if device is connected
Write-Host "Checking for connected Android devices..." -ForegroundColor Yellow
adb devices
Write-Host ""

# Navigate to frontend directory
Set-Location frontend

# Sync project with Android
Write-Host "Syncing project with Android..." -ForegroundColor Yellow
npx cap sync android

Write-Host ""
Write-Host "Building and installing app..." -ForegroundColor Yellow
Write-Host ""

# Build and install
try {
    npx cap run android --target "adb-eed5fcbd-mvSC4b._adb-tls-connect._tcp"
    Write-Host ""
    Write-Host "✅ Installation completed!" -ForegroundColor Green
} catch {
    Write-Host "❌ Installation failed. Try manual method:" -ForegroundColor Red
    Write-Host "1. Open Android Studio"
    Write-Host "2. Import project: frontend/android"
    Write-Host "3. Build > Build Bundle(s) / APK(s) > Build APK(s)"
    Write-Host "4. Run on device"
}

Write-Host ""
Write-Host "To update API URL, edit: frontend\.env.local" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to exit"

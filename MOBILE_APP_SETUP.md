# 📱 GrowthForge Mobile App Setup Guide

## 🚀 Quick Installation

### Method 1: Automatic Installation (Recommended)
```bash
# Double-click this file or run in command prompt:
install-app.bat
```

### Method 2: Alternative Installation
```bash
# If automatic fails, use:
install-alternative.bat
```

### Method 3: PowerShell Installation
```powershell
# Right-click > Run with PowerShell:
install-app.ps1
```

## 🔧 Manual Installation (If Scripts Fail)

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Configure API URL
Create/edit `frontend/.env.local`:
```javascript
NEXT_PUBLIC_API_URL=http://YOUR_PC_IP:8000/api
# For VPS: NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

### Step 3: Build and Sync
```bash
# Build the Next.js app
npm run build

# Sync with Android project
npx cap sync android
```

### Step 4: Android Studio Method
1. Open Android Studio
2. Open `frontend/android` as project
3. Wait for Gradle sync
4. Click "Run" button (green play icon)
5. Select your connected device

## 📋 Device Setup

### Enable Developer Options (Android)
1. Go to Settings > About Phone
2. Tap "Build Number" 7 times
3. Go back to Settings > Developer Options
4. Enable "USB Debugging"

### Connect Device
1. Connect phone to PC via USB
2. Allow USB debugging when prompted
3. Run installation script

## 🌐 API Configuration

### Local Development
```javascript
// frontend/.env.local
NEXT_PUBLIC_API_URL=http://YOUR_PC_IP:8000/api
```

### VPS Production
```javascript
// frontend/.env.local
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

### Find Your PC IP
```bash
# Windows
ipconfig
# Look for "IPv4 Address" under your network adapter

# Or use this command
curl ifconfig.me
```

## 🔐 Default Login Credentials

### Admin User
- **Email**: `admin@growthforge.app`
- **Password**: `Admin123!@#`

### Test User
- **Email**: `test@growthforge.app`
- **Password**: `Test123!@#`

## 🛠️ Troubleshooting

### Common Issues

#### 1. "Device Not Found"
```bash
# Check device connection
adb devices

# If no devices:
# - Enable USB debugging
# - Check USB cable
# - Try different USB port
# - Restart phone and PC
```

#### 2. "Gradle Sync Failed"
```bash
# Clean project
cd frontend/android
gradlew.bat clean

# Try alternative build
gradlew.bat assembleDebug --no-configuration-cache
```

#### 3. "API Connection Failed"
```bash
# Check if backend is running
curl http://localhost:8000/api/health

# Check your IP in frontend/.env.local
# Make sure firewall allows port 8000
```

#### 4. "Installation Failed"
```bash
# Try alternative installation method
install-alternative.bat

# Or manual APK installation
adb install -r frontend/android/app/build/outputs/apk/debug/app-debug.apk
```

### Reset Passwords
```bash
# If you forget passwords, run:
py update_passwords.py
```

## 🔄 Update Process

### When Backend Changes
1. Update backend code
2. Restart backend server
3. Update API URL in mobile app if needed
4. Reinstall mobile app

### When Mobile App Changes
1. Update frontend code
2. Run installation script again
3. App will update on your phone

## 📱 App Features

### Core Functionality
- ✅ User authentication
- ✅ Habit tracking
- ✅ Progress analytics
- ✅ Achievement system
- ✅ Community features

### Testing Checklist
- [ ] Login with admin credentials
- [ ] Create new habit
- [ ] Mark habit as complete
- [ ] View progress dashboard
- [ ] Check achievements
- [ ] Test offline functionality

## 🚀 Production Deployment

### For VPS Deployment
1. Update `frontend/.env.local` with VPS URL
2. Build and install app
3. Test all functionality
4. Distribute APK to users

### APK Location
```
frontend/android/app/build/outputs/apk/debug/app-debug.apk
```

## 📞 Support

### If Issues Persist
1. Check backend is running: `http://localhost:8000/api/health`
2. Verify API URL configuration
3. Check Android device connection
4. Review installation logs
5. Try manual installation method

### Log Files
- Backend logs: Check terminal where backend is running
- Android logs: Use Android Studio Logcat
- Installation logs: Check command prompt output

---

**🎯 Success**: When you can login and see the main dashboard, your app is working correctly!

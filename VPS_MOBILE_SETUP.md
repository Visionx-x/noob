# 🌐 VPS + Mobile App Setup Guide

## 📋 Overview
Deploy backend on VPS, then install mobile app from your local PC.

## 🚀 Step 1: VPS Backend Deployment

### On Your VPS Server:
```bash
# Clone repository
git clone <your-repo-url> /var/www/growthforge
cd /var/www/growthforge

# Follow VPS_DEPLOYMENT_GUIDE.md completely
# This will setup:
# - Python environment
# - Nginx reverse proxy
# - SSL certificate
# - Supervisor process management
# - Backend at https://yourdomain.com
```

## 📱 Step 2: Mobile App Setup (From Your PC)

### On Your LOCAL Computer:
```bash
# Clone the same repository
git clone <your-repo-url>
cd app

# Configure mobile app for VPS
echo NEXT_PUBLIC_API_URL=https://yourdomain.com/api > frontend/.env.local

# Install dependencies and build
cd frontend
npm install
npm run build

# Sync with Android
npx cap sync android

# Install on your phone
# Option 1: Use installation script
cd ..
install-app.bat

# Option 2: Manual method
cd frontend/android
gradlew.bat assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

## 🔧 Important Configuration

### Mobile App API Configuration
The mobile app needs to point to your VPS:

**File: `frontend/.env.local`**
```javascript
// For VPS deployment
NEXT_PUBLIC_API_URL=https://yourdomain.com/api

// For local testing
// NEXT_PUBLIC_API_URL=http://YOUR_PC_IP:2000/api
```

### Backend CORS Configuration
On VPS, ensure `.env` allows mobile app origins:

**File: `.env` on VPS**
```bash
ALLOWED_ORIGINS=https://yourdomain.com,http://localhost:3000,capacitor://localhost
```

## 🌐 Testing the Connection

### From Your PC:
```bash
# Test VPS API
curl https://yourdomain.com/api/health

# Test login
curl -X POST https://yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@growthforge.app","password":"Admin123!@#"}'
```

### On Mobile App:
1. Open app on phone
2. Use admin credentials: `admin@growthforge.app` / `Admin123!@#`
3. Should connect to VPS automatically

## 🔄 Update Process

### When You Update Backend Code:
```bash
# On VPS:
cd /var/www/growthforge
git pull
sudo supervisorctl restart growthforge
```

### When You Update Mobile App:
```bash
# On your PC:
cd app
git pull
install-app.bat  # Reinstall on phone
```

## 📱 Distribution to Others

### For Other Users:
1. They don't need the source code
2. Just give them the APK file:
   ```
   frontend/android/app/build/outputs/apk/debug/app-debug.apk
   ```
3. Or use `install-app.bat` on their PC

### Production APK:
```bash
# Build release APK (for distribution)
cd frontend/android
gradlew.bat assembleRelease
# APK location: app/build/outputs/apk/release/app-release.apk
```

## 🛠️ Troubleshooting

### Mobile App Can't Connect to VPS:
1. Check VPS API: `curl https://yourdomain.com/api/health`
2. Verify SSL certificate is valid
3. Check CORS settings on VPS
4. Ensure firewall allows HTTPS traffic

### Installation Issues:
1. Use `install-alternative.bat`
2. Check Android device connection
3. Verify Android SDK setup

## 📋 File Locations

### VPS Files:
- Backend: `/var/www/growthforge/`
- Config: `/var/www/growthforge/.env`
- Logs: `/var/log/growthforge.log`

### Local PC Files:
- Source: `app/`
- Mobile config: `app/frontend/.env.local`
- APK: `app/frontend/android/app/build/outputs/apk/`

## 🎯 Success Checklist

- [ ] VPS backend running at `https://yourdomain.com/api`
- [ ] API health check passes
- [ ] Mobile app configured with VPS URL
- [ ] App installs successfully on phone
- [ ] Login works with admin credentials
- [ ] App features work correctly

---

**🔑 Remember:** VPS runs the backend, your PC builds and installs the mobile app.

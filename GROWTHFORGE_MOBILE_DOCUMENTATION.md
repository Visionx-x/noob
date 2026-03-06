# 📱 GrowthForge Mobile App - Complete Documentation

## 🎯 Project Overview

**GrowthForge** is a professional mobile-only habit tracking application built with modern technologies. It has been completely converted from a web application to a production-ready Android app.

### 🏗️ Architecture

- **Backend**: FastAPI with SQLite database
- **Frontend**: Next.js 14 with Capacitor 7 for Android
- **Database**: SQLite with Alembic migrations
- **Mobile Framework**: Capacitor (Native Android App)
- **UI**: TailwindCSS with Glass-morphism design
- **Authentication**: JWT-based with mobile optimization

---

## 📁 Project Structure

```
growthforge-mobile/
├── 📄 Configuration Files
│   ├── .env                    # Environment variables
│   ├── .env.example           # Environment template
│   ├── alembic.ini            # Database migration config
│   └── requirements.txt        # Python dependencies
│
├── 🔧 Backend API (app/)
│   ├── main.py                # FastAPI application entry point
│   ├── api/                   # API route handlers
│   │   ├── auth_routes.py      # Authentication (login/signup)
│   │   ├── habit_routes.py     # Habit management
│   │   ├── analytics_routes.py  # Progress analytics
│   │   ├── achievement_routes.py # Achievement system
│   │   ├── community_routes.py  # Social features
│   │   └── debug_routes.py      # Mobile debugging
│   ├── core/                  # Core functionality
│   │   ├── config.py          # App configuration
│   │   ├── dependencies.py    # Database dependencies
│   │   └── security.py        # JWT security
│   ├── db/                    # Database layer
│   │   ├── base.py            # Database base model
│   │   └── session.py         # Database session
│   └── models/                # Data models
│       ├── user.py            # User model
│       ├── habit.py           # Habit model
│       ├── habit_log.py       # Habit tracking logs
│       ├── achievement.py     # Achievement system
│       ├── user_achievement.py # User achievements
│       └── leaderboard_snapshot.py # Leaderboard
│
├── 📱 Mobile Frontend (frontend/)
│   ├── app/                   # Next.js app pages
│   │   ├── page.tsx          # Mobile home screen
│   │   ├── auth/              # Authentication screens
│   │   ├── dashboard/         # Main dashboard
│   │   ├── tasks/             # Habit management
│   │   ├── analytics/         # Progress charts
│   │   ├── achievements/      # Achievement display
│   │   ├── community/         # Social features
│   │   └── privacy/           # Privacy policy
│   ├── lib/                   # Mobile utilities
│   │   ├── api.js             # Mobile API integration
│   │   └── mobile-debugger.js # Mobile debugging
│   ├── styles/                 # Mobile styling
│   │   └── globals.css        # Global styles
│   ├── android/               # Native Android project
│   │   ├── app/              # Android app structure
│   │   ├── gradle/           # Gradle build system
│   │   └── build.gradle       # Android build config
│   ├── capacitor.config.ts     # Capacitor configuration
│   ├── next.config.js         # Next.js mobile config
│   ├── package.json          # Mobile dependencies
│   └── tailwind.config.js    # Mobile styling config
│
└── 🗄️ Data
    ├── growthforge.db         # SQLite database
    └── logs/                 # Mobile debug logs
```

---

## 🚀 Quick Start Commands

### Backend Development
```bash
# Start API server
py -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Database migrations
alembic upgrade head
```

### Mobile Development
```bash
# Build and sync mobile app
npm run mobile:build

# Run on Android device/emulator
npm run mobile:dev

# Open in Android Studio
npm run mobile:studio

# Build release bundle for Play Store
npm run mobile:release
```

---

## 🔧 Configuration

### Environment Variables (.env)
```bash
# Application
ENVIRONMENT=development
HOST=0.0.0.0
PORT=8000

# Database
DATABASE_URL=sqlite:///./growthforge.db

# Security
SECRET_KEY=your_256_bit_secret_key_here
ACCESS_TOKEN_EXPIRE_MINUTES=1440
REFRESH_TOKEN_EXPIRE_DAYS=30

# CORS (Mobile)
ALLOWED_ORIGINS=http://localhost:3000,http://10.0.2.2:3000,capacitor://localhost

# Redis (Optional)
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=INFO

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60
```

### Mobile Configuration (capacitor.config.ts)
```typescript
{
  appId: 'com.growthforge.app',
  appName: 'GrowthForge',
  webDir: 'out',
  plugins: {
    SplashScreen: { /* Splash screen config */ },
    StatusBar: { style: 'LIGHT' },
    Haptics: { enabled: true },
    Keyboard: { resizeMode: 'ionic' }
  },
  android: {
    allowMixedContent: true,
    webContentsDebuggingEnabled: true
  }
}
```

---

## 📱 Mobile Features

### Core Features
- ✅ **User Authentication** - Mobile-optimized JWT auth
- ✅ **Habit Tracking** - Daily habit management
- ✅ **Progress Analytics** - Visual charts and insights
- ✅ **Achievement System** - Gamification and rewards
- ✅ **Community Features** - Social interaction
- ✅ **Offline Support** - Local data storage
- ✅ **Push Notifications** - Capacitor integration

### Mobile-Specific Features
- 📱 **Touch Interface** - Mobile-optimized UI
- 📱 **Haptic Feedback** - Touch responses
- 📱 **Mobile Keyboard** - Optimized input
- 📱 **Status Bar** - Custom styling
- 📱 **Splash Screen** - Professional launch
- 📱 **Network Security** - Mobile CORS handling
- 📱 **Debug Logging** - Mobile-specific debugging

---

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /signup` - User registration
- `POST /login` - User login
- `GET /me` - Get current user
- `POST /refresh` - Refresh token

### Habits (`/api`)
- `GET /habits` - List user habits
- `POST /habits` - Create new habit
- `PUT /habits/{id}` - Update habit
- `DELETE /habits/{id}` - Delete habit
- `POST /habits/{id}/logs` - Log habit completion

### Analytics (`/api/analytics`)
- `GET /progress` - User progress data
- `GET /streaks` - Habit streaks
- `GET /stats` - Overall statistics

### Achievements (`/api/achievements`)
- `GET /` - User achievements
- `POST /{id}/claim` - Claim achievement
- `GET /leaderboard` - Global leaderboard

### Community (`/api/community`)
- `GET /posts` - Community posts
- `POST /posts` - Create post
- `GET /leaderboard` - Community rankings

### Debug (`/api/debug`)
- `POST /logs` - Receive mobile logs
- `GET /logs` - View debug logs
- `DELETE /logs` - Clear logs

---

## 🛠️ Development Workflow

### 1. Backend Development
```bash
# Start API server
py -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Access API documentation
http://localhost:8000/docs
```

### 2. Mobile Development
```bash
# Install dependencies
npm install

# Build for mobile
npm run mobile:build

# Test on Android
npm run mobile:dev

# Debug in Android Studio
npm run mobile:studio
```

### 3. Testing
```bash
# Backend health check
curl http://localhost:8000/health

# Mobile logs
curl http://localhost:8000/api/debug/logs

# Android logcat
adb logcat | grep "GrowthForge"
```

---

## 📦 Build & Deployment

### Development Build
```bash
npm run mobile:dev
```

### Production Build
```bash
# Create release bundle
npm run mobile:release

# Output: frontend/android/app/build/outputs/bundle/release/app-release.aab
```

### Play Store Deployment
1. **Build Release Bundle**: `npm run mobile:release`
2. **Sign Bundle**: Use production keystore
3. **Upload to Play Console**: Submit .aab file
4. **Configure Store Listing**: App details, screenshots, privacy policy

---

## 🔍 Debugging

### Mobile Debug Tools
- **Browser Console**: `window.mobileDebugger.getStoredLogs()`
- **Android Logcat**: `adb logcat | grep "GrowthForge"`
- **Backend Logs**: `/api/debug/logs` endpoint
- **Network Debug**: Chrome DevTools for mobile WebView

### Common Issues
- **Network Errors**: Check API base URL (10.0.2.2:8000 for emulator)
- **Authentication**: Verify JWT token handling in localStorage
- **Build Errors**: Ensure Android SDK and Java are installed
- **CORS Issues**: Check allowed origins in .env

---

## 📊 Database Schema

### Core Tables
- **users** - User accounts and profiles
- **habits** - Habit definitions and settings
- **habit_logs** - Daily habit completion records
- **achievements** - Achievement definitions
- **user_achievements** - User achievement progress
- **leaderboard_snapshots** - Weekly leaderboard data

### Relationships
- Users → Habits (1:many)
- Users → User Achievements (1:many)
- Habits → Habit Logs (1:many)

---

## 🎨 UI/UX Design

### Design System
- **Theme**: Dark with glass-morphism effects
- **Colors**: Primary (#1a1a2e), Accent gradients
- **Typography**: Mobile-optimized font sizes
- **Layout**: Mobile-first responsive design
- **Animations**: Framer Motion transitions

### Mobile Patterns
- **Bottom Navigation**: Easy thumb access
- **Card-based UI**: Touch-friendly targets
- **Swipe Gestures**: Natural mobile interactions
- **Pull to Refresh**: Standard mobile pattern
- **Loading States**: Skeleton screens

---

## 🔒 Security Features

### Authentication
- **JWT Tokens**: Secure mobile authentication
- **Token Refresh**: Automatic token renewal
- **Local Storage**: Secure token persistence
- **Logout Handling**: Complete token cleanup

### API Security
- **CORS**: Mobile-origin whitelisting
- **Rate Limiting**: Request throttling
- **Input Validation**: Pydantic schemas
- **SQL Injection**: ORM protection
- **HTTPS Ready**: Production SSL support

---

## 📈 Performance Optimization

### Mobile Optimizations
- **Bundle Size**: Optimized JavaScript bundles
- **Image Optimization**: Next.js image handling
- **Caching**: Local storage for offline use
- **Lazy Loading**: Component-level code splitting
- **Minification**: Production build optimization

### Network Optimization
- **API Timeouts**: 30-second mobile timeout
- **Retry Logic**: Automatic request retry
- **Offline Mode**: Local data fallback
- **Compression**: Gzip response compression

---

## 🚀 Future Enhancements

### Planned Features
- **Push Notifications**: Real-time habit reminders
- **Offline Sync**: Background data synchronization
- **Analytics Dashboard**: Advanced progress insights
- **Social Features**: Friends and challenges
- **Custom Themes**: Personalization options
- **Export Data**: User data portability

### Technical Improvements
- **Performance**: Bundle size optimization
- **Accessibility**: Screen reader support
- **Internationalization**: Multi-language support
- **Testing**: Automated mobile testing
- **CI/CD**: Automated build pipeline

---

## 📞 Support & Maintenance

### Monitoring
- **Error Tracking**: Mobile debug logs
- **Performance Metrics**: API response times
- **User Analytics**: Feature usage tracking
- **Crash Reports**: Android crash handling

### Maintenance Tasks
- **Database Backups**: Regular SQLite backups
- **Dependency Updates**: Security patches
- **Performance Reviews**: Bundle size analysis
- **User Feedback**: App store reviews monitoring

---

## 🎯 Conclusion

GrowthForge Mobile is a **production-ready, professional Android application** with:

✅ **Complete Feature Set** - Habit tracking, analytics, achievements
✅ **Mobile-First Design** - Touch-optimized interface
✅ **Modern Tech Stack** - FastAPI, Next.js, Capacitor
✅ **Security Focused** - JWT auth, CORS, rate limiting
✅ **Performance Optimized** - Fast loading, offline support
✅ **Developer Friendly** - Comprehensive debugging tools
✅ **Production Ready** - Play Store deployment ready

**This is a clean, well-maintained mobile application built for scale and performance.** 🚀

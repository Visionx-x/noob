# 🚀 GrowthForge VPS Deployment Guide

## 📋 Overview
Complete step-by-step guide to deploy GrowthForge on a VPS for production use.

## 🔧 Prerequisites
- Ubuntu 20.04+ or CentOS 8+ VPS
- Domain name (recommended for SSL)
- SSH access to VPS
- Basic Linux command line knowledge

## 🌐 Step 1: VPS Initial Setup

### Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### Install Required Software
```bash
# Python and development tools
sudo apt install python3 python3-pip python3-venv python3-dev -y

# Nginx (reverse proxy)
sudo apt install nginx -y

# Supervisor (process management)
sudo apt install supervisor -y

# Git
sudo apt install git -y

# SSL certificate tool
sudo apt install certbot python3-certbot-nginx -y
```

### Create Application User
```bash
sudo adduser growthforge
sudo usermod -aG sudo growthforge
```

## 📁 Step 2: Deploy Application Code

### Clone Repository
```bash
# Switch to application user
sudo su - growthforge

# Clone your repository
git clone <your-github-repo-url> /home/growthforge/app
cd /home/growthforge/app
```

### Setup Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## ⚙️ Step 3: Configure Environment

### Create Production .env File
```bash
cp .env.example .env
nano .env
```

### **CRITICAL: Fill these values in .env:**

```bash
# Basic Settings
ENVIRONMENT=production
HOST=0.0.0.0
PORT=8000

# Database (SQLite for simplicity, upgrade to PostgreSQL later)
DATABASE_URL=sqlite:///./growthforge.db

# 🔐 SECURITY - MUST CHANGE!
SECRET_KEY=generate_with_openssl_rand_hex_32_command_below
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
REFRESH_TOKEN_EXPIRE_DAYS=30

# CORS - IMPORTANT for mobile app!
# Replace YOUR_DOMAIN with your actual domain
ALLOWED_ORIGINS=https://YOUR_DOMAIN.com,http://localhost:3000,capacitor://localhost

# Production security
ALLOWED_HOSTS=YOUR_DOMAIN.com,www.YOUR_DOMAIN.com

# Logging
LOG_LEVEL=INFO

# Rate limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=3600

# Mobile app settings
MOBILE_APP_NAME=GrowthForge
MOBILE_APP_ID=com.growthforge.app

# API URLs - IMPORTANT!
# Replace YOUR_DOMAIN with your actual domain
MOBILE_API_URL=https://YOUR_DOMAIN.com/api
WEB_API_URL=https://YOUR_DOMAIN.com/api
```

### Generate Secret Key
```bash
# Run this command and copy the output
openssl rand -hex 32
# Example output: a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

## 👤 Step 4: Create Admin User

```bash
# Make sure you're in the app directory
cd /home/growthforge/app
source venv/bin/activate

# Create admin user
py create_admin_user.py
```

**Default Admin Credentials:**
- Email: `admin@growthforge.app`
- Password: `Admin123!@#`

**⚠️ IMPORTANT:** Change this password after first login!

## 🔧 Step 5: Setup Supervisor

### Create Supervisor Config
```bash
sudo nano /etc/supervisor/conf.d/growthforge.conf
```

### Add this configuration:
```ini
[program:growthforge]
command=/home/growthforge/app/venv/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
directory=/home/growthforge/app
user=growthforge
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/growthforge.log
stdout_logfile_maxbytes=50MB
stdout_logfile_backups=10
environment=PATH="/home/growthforge/app/venv/bin"
```

### Start the Service
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start growthforge
```

### Check Status
```bash
sudo supervisorctl status growthforge
```

## 🌐 Step 6: Setup Nginx

### Create Nginx Config
```bash
sudo nano /etc/nginx/sites-available/growthforge
```

### Add this configuration (replace YOUR_DOMAIN):
```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN.com www.YOUR_DOMAIN.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support (if needed)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Increase upload size for file uploads
    client_max_body_size 10M;
}
```

### Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/growthforge /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔒 Step 7: Setup SSL Certificate

### Get SSL Certificate
```bash
# Replace YOUR_DOMAIN with your actual domain
sudo certbot --nginx -d YOUR_DOMAIN.com -d www.YOUR_DOMAIN.com
```

### Auto-renew SSL
```bash
sudo crontab -e
# Add this line:
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔥 Step 8: Setup Firewall

```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## ✅ Step 9: Test Deployment

### Test API
```bash
# Test health endpoint
curl -X GET http://localhost:8000/api/health

# Test from external
curl -X GET https://YOUR_DOMAIN.com/api/health
```

### Test Login
```bash
curl -X POST https://YOUR_DOMAIN.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@growthforge.app","password":"Admin123!@#"}'
```

### Check Logs
```bash
# Application logs
sudo tail -f /var/log/growthforge.log

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 📱 Step 10: Configure Mobile App

### Update Mobile App Configuration
In your mobile app's `.env.local` file:

```javascript
NEXT_PUBLIC_API_URL=https://YOUR_DOMAIN.com/api
```

### Build and Deploy Mobile App
```bash
cd frontend
npm install
npm run build
npx cap sync android
# Then build APK as usual
```

## 🔧 Maintenance Commands

### Update Application
```bash
cd /home/growthforge/app
git pull
source venv/bin/activate
pip install -r requirements.txt
sudo supervisorctl restart growthforge
```

### Backup Database
```bash
# Create backup directory
sudo mkdir -p /backup

# Backup database
sudo cp /home/growthforge/app/growthforge.db /backup/growthforge_$(date +%Y%m%d_%H%M%S).db

# Auto-backup (add to crontab)
sudo crontab -e
# Add this line for daily backup at 2 AM:
0 2 * * * cp /home/growthforge/app/growthforge.db /backup/growthforge_$(date +\%Y\%m\%d_\%H\%M\%S).db
```

### View Logs
```bash
# Real-time application logs
sudo tail -f /var/log/growthforge.log

# Supervisor logs
sudo supervisorctl tail growthforge

# Nginx logs
sudo tail -f /var/log/nginx/access.log
```

## 🚨 Troubleshooting

### Common Issues

1. **Service won't start**
   ```bash
   sudo supervisorctl status growthforge
   sudo supervisorctl restart growthforge
   ```

2. **Database permission errors**
   ```bash
   sudo chown growthforge:growthforge /home/growthforge/app/growthforge.db
   ```

3. **Port conflicts**
   ```bash
   sudo netstat -tulpn | grep :8000
   ```

4. **Nginx configuration errors**
   ```bash
   sudo nginx -t
   ```

5. **SSL certificate issues**
   ```bash
   sudo certbot certificates
   ```

### Performance Optimization

1. **Database Optimization**
   - Consider PostgreSQL for production
   - Add database indexes
   - Regular database maintenance

2. **Caching**
   - Add Redis for session storage
   - Implement API response caching

3. **Security**
   - Regular security updates
   - Monitor access logs
   - Use fail2ban for brute force protection

## 📊 Monitoring

### Basic Health Check Script
Create `/home/growthforge/health_check.sh`:
```bash
#!/bin/bash
# Check if service is running
if ! supervisorctl status growthforge | grep -q "RUNNING"; then
    echo "GrowthForge service is not running!"
    # Send notification or restart
    supervisorctl restart growthforge
fi

# Check if API is responding
if ! curl -f -s http://localhost:8000/api/health > /dev/null; then
    echo "API health check failed!"
fi
```

Make it executable and add to crontab:
```bash
chmod +x /home/growthforge/health_check.sh
# Add to crontab for every 5 minutes
*/5 * * * * /home/growthforge/health_check.sh
```

## 🎯 Success Criteria

Your deployment is successful when:
- ✅ API responds at `https://YOUR_DOMAIN.com/api/health`
- ✅ Admin login works via API
- ✅ SSL certificate is active
- ✅ Mobile app can connect to API
- ✅ Service auto-restarts on failure
- ✅ Logs are being collected

## 📞 Support

If you encounter issues:
1. Check logs first
2. Verify configuration files
3. Test each component individually
4. Check firewall settings
5. Verify domain DNS settings

---

**🔐 Security Reminder:** Always change default passwords and use strong SECRET_KEY in production!

# GrowthForge

Mobile habit tracking app (Capacitor + Next.js) with FastAPI backend.

## Quick Start

### Backend (local)

```bash
pip install -r requirements.txt
cp .env.example .env   # edit as needed
py -m uvicorn app.main:app --host 0.0.0.0 --port 2000 --reload
```

### Frontend + Android

```bash
cd frontend
npm install
# For local testing: set NEXT_PUBLIC_API_URL=http://YOUR_PC_IP:2000/api in .env.local
npm run mobile:build

cd android
.\gradlew.bat :app:assembleDebug
# Install: adb install -r app/build/outputs/apk/debug/app-debug.apk
```

## VPS Deployment

### Prerequisites
- Ubuntu 20.04+ or CentOS 8+
- Python 3.8+
- Domain name (optional, recommended for production)

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and pip
sudo apt install python3 python3-pip python3-venv -y

# Install nginx (optional, for reverse proxy)
sudo apt install nginx -y

# Install supervisor for process management
sudo apt install supervisor -y
```

### Step 2: Deploy Application

```bash
# Clone your repository
git clone <your-repo-url> /var/www/growthforge
cd /var/www/growthforge

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment file
cp .env.example .env
nano .env  # Edit with your settings
```

### Step 3: Configure Environment

Edit `.env` file with production settings:

```bash
ENVIRONMENT=production
SECRET_KEY=your_super_secret_key_change_this_32_chars_minimum
HOST=0.0.0.0
PORT=2000
DATABASE_URL=sqlite:///./growthforge.db
ALLOWED_ORIGINS=https://yourdomain.com,http://localhost:3000,capacitor://localhost
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
```

### Step 4: Create Admin User

```bash
# Create admin user
py create_admin_user.py

# Default credentials:
# Email: admin@growthforge.app
# Password: Admin123!@#
```

### Step 5: Setup Supervisor

Create supervisor config:

```bash
sudo nano /etc/supervisor/conf.d/growthforge.conf
```

Add this content:

```ini
[program:growthforge]
command=/var/www/growthforge/venv/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 2000
directory=/var/www/growthforge
user=www-data
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/growthforge.log
environment=PATH="/var/www/growthforge/venv/bin"
```

Start the service:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start growthforge
```

### Step 6: Setup Nginx (Optional)

Create nginx config:

```bash
sudo nano /etc/nginx/sites-available/growthforge
```

Add this content:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:2000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/growthforge /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: SSL Certificate (Recommended)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Step 8: Firewall Setup

```bash
# Configure UFW
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Step 9: Test Deployment

```bash
# Check service status
sudo supervisorctl status growthforge

# Check logs
tail -f /var/log/growthforge.log

# Test API
curl -X GET http://localhost:2000/api/health
```

## Default Users

After running `create_admin_user.py`, you'll have:

- **Admin User**:
  - Email: `admin@growthforge.app`
  - Password: `Admin123!@#`

- **Test User**:
  - Email: `test@growthforge.app`
  - Password: `Test123!@#`

## Mobile App Configuration

Update your mobile app's API URL to point to your VPS:

```javascript
// In your mobile app .env.local
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

## Maintenance

### Update Application

```bash
cd /var/www/growthforge
git pull
source venv/bin/activate
pip install -r requirements.txt
sudo supervisorctl restart growthforge
```

### Backup Database

```bash
# Backup sqlite database
cp /var/www/growthforge/growthforge.db /backup/growthforge_$(date +%Y%m%d).db
```

### View Logs

```bash
# Application logs
tail -f /var/log/growthforge.log

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Structure

- `app/` – FastAPI backend (auth, habits, analytics, etc.)
- `frontend/` – Next.js app (static export for Capacitor)
- `frontend/android/` – Capacitor Android project
- `deploy/` – VPS deployment script and docs

## Troubleshooting

### Common Issues

1. **Service won't start**: Check logs with `sudo supervisorctl status growthforge`
2. **Database errors**: Ensure SQLite file has proper permissions
3. **Port conflicts**: Make sure port 2000 is not in use
4. **Permission issues**: Run `sudo chown -R www-data:www-data /var/www/growthforge`

### Performance Optimization

- Use PostgreSQL for production instead of SQLite
- Add Redis for caching
- Configure nginx for gzip compression
- Set up CDN for static assets

## Security Notes

- Change default admin password immediately
- Use strong SECRET_KEY (generate with `openssl rand -hex 32`)
- Enable HTTPS with SSL certificate
- Regularly update dependencies
- Configure firewall properly
- Use environment variables for sensitive data

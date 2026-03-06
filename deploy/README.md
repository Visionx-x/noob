# GrowthForge API – Deploy on VPS (24/7)

Run the backend on a Linux VPS so the mobile app can connect from anywhere.

---

## 1. Clone and install (on VPS)

```bash
git clone <your-repo-url> growthforge
cd growthforge
python3 -m venv .venv
source .venv/bin/activate   # Linux/macOS
pip install -r requirements.txt
```

---

## 2. Environment variables

Copy the example file and edit it:

```bash
cp .env.example .env
```

Create or edit `.env` in the **project root** (same folder as `app/`):

```bash
# Required for production
ENVIRONMENT=production
SECRET_KEY=your-32-char-or-longer-secret-key-use-openssl-rand-hex-32

# Optional: bind port (default 8000)
PORT=8000

# CORS: comma-separated. Must include capacitor://localhost for the mobile app.
# Add your API domain when you use HTTPS (e.g. https://api.yourdomain.com)
ALLOWED_ORIGINS=capacitor://localhost,https://localhost,http://localhost

# Optional: restrict Host header (e.g. api.yourdomain.com). Leave empty to allow any.
# ALLOWED_HOSTS=api.yourdomain.com
```

Generate a secret key:

```bash
openssl rand -hex 32
```

---

## 3. Run the API

**Option A – script (recommended)**

```bash
chmod +x deploy/run_production.sh
./deploy/run_production.sh
```

**Option B – direct command**

```bash
export ENVIRONMENT=production
gunicorn app.main:app --workers 2 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

**Option C – run in background (systemd)**

Create `/etc/systemd/system/growthforge-api.service`:

```ini
[Unit]
Description=GrowthForge API
After=network.target

[Service]
User=www-data
WorkingDirectory=/path/to/growthforge
Environment="ENVIRONMENT=production"
EnvironmentFile=/path/to/growthforge/.env
ExecStart=/path/to/growthforge/.venv/bin/gunicorn app.main:app --workers 2 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
Restart=always

[Install]
WantedBy=multi-user.target
```

Then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable growthforge-api
sudo systemctl start growthforge-api
sudo systemctl status growthforge-api
```

---

## 4. HTTPS (recommended for production)

Put Nginx (or Caddy) in front and use HTTPS:

- Point a domain (e.g. `api.yourdomain.com`) to your VPS IP.
- In Nginx, proxy to `http://127.0.0.1:8000`.
- Use Let’s Encrypt for SSL.

Then set in `.env`:

- `ALLOWED_ORIGINS=capacitor://localhost,https://api.yourdomain.com`
- `ALLOWED_HOSTS=api.yourdomain.com` (optional)

---

## 5. Mobile app → VPS

When building the app for production, set the API URL to your VPS:

- If using HTTPS: `https://api.yourdomain.com/api`
- If using IP only: `http://YOUR_VPS_IP:8000/api`

In the frontend project:

```bash
cd frontend
# Create .env.local and set:
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
npm run mobile:build
```

Then build and install the Android APK; login/signup will use the VPS backend 24/7.

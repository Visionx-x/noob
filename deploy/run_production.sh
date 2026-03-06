#!/usr/bin/env bash
# GrowthForge API – production run script for VPS
# Run from project root: ./deploy/run_production.sh

set -e
cd "$(dirname "$0")/.."

# Optional: use a virtualenv if you created one
# source .venv/bin/activate  # Linux/macOS
# .venv\Scripts\activate    # Windows

export ENVIRONMENT=production

# Bind to all interfaces so Nginx or external clients can reach the app
HOST="${HOST:-0.0.0.0}"
PORT="${PORT:-2000}"  # Changed from 8000 to 2000
WORKERS="${WORKERS:-2}"

exec gunicorn app.main:app \
  --workers "$WORKERS" \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind "$HOST:$PORT" \
  --access-logfile - \
  --error-logfile - \
  --capture-output

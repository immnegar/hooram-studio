#!/bin/bash
# ==============================================================
# HOORAM STUDIO — PRODUCTION DEPLOYMENT / UPDATE SCRIPT
# Location on VPS: /var/www/hooram-studio/deploy/deploy.sh
# ==============================================================

set -e

PROJECT_DIR="/var/www/hooram-studio"
cd "$PROJECT_DIR"

echo "=========================================================="
echo "  Deploying Horam Studio Production Updates               "
echo "=========================================================="

# 1. Pull latest code from GitHub (if using git)
if [ -d ".git" ]; then
    echo "[1/5] Pulling latest code from origin/main..."
    git pull origin main
else
    echo "[1/5] Skipping git pull (manual file copy mode)."
fi

# 2. Install dependencies cleanly
echo "[2/5] Installing production & build dependencies..."
npm install --no-audit

# 3. Build frontend bundle
echo "[3/5] Building production client with Vite..."
npm run build

# 4. Verify directories and permissions
echo "[4/5] Verifying persistent directories and file permissions..."
mkdir -p server/data public/uploads backups/database backups/uploads logs
chmod 755 public/uploads
chmod 700 backups

# 5. Reload application with PM2 (zero-downtime)
echo "[5/5] Reloading PM2 application process..."
if pm2 describe hooram-studio > /dev/null 2>&1; then
    pm2 reload deploy/ecosystem.config.cjs --update-env
else
    pm2 start deploy/ecosystem.config.cjs
fi
pm2 save

echo "=========================================================="
echo "🎉 Horam Studio successfully deployed and running!"
echo "Status check: pm2 status hooram-studio"
echo "Log tail:     pm2 logs hooram-studio"
echo "=========================================================="


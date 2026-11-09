#!/bin/bash
# ==============================================================
# HOORAM STUDIO — UBUNTU VPS INITIAL PROVISIONING SCRIPT
# Recommended OS: Ubuntu 22.04 LTS or 24.04 LTS
# Run as root or with sudo
# ==============================================================

set -e

echo "=========================================================="
echo "  Starting Horam Studio VPS Environment Provisioning     "
echo "=========================================================="

# 1. Update system packages
echo "[1/7] Updating apt repositories..."
apt-get update -y
apt-get upgrade -y
apt-get install -y curl git ufw nginx certbot python3-certbot-nginx build-essential

# 2. Install Node.js 20.x LTS & npm
echo "[2/7] Installing Node.js 20 LTS..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# 3. Install PM2 Process Manager globally
echo "[3/7] Installing PM2..."
npm install -g pm2
pm2 startup systemd -u root --hp /root || true

# 4. Configure Firewall (UFW)
echo "[4/7] Configuring UFW Firewall..."
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw --force enable

# 5. Create Web Directories
echo "[5/7] Setting up webroot directories..."
mkdir -p /var/www/hooram-studio
mkdir -p /var/www/certbot
mkdir -p /var/www/hooram-studio/logs

# 6. Configure Automated Daily Backup Cron Job
echo "[6/7] Setting up automated daily backup cron job (03:30 AM)..."
CRON_JOB="30 3 * * * cd /var/www/hooram-studio && /usr/bin/npm run backup >> /var/log/hooram-backup.log 2>&1"
(crontab -l 2>/dev/null | grep -Fv "hooram-studio"; echo "$CRON_JOB") | crontab -

# 7. Final instructions
echo "[7/7] Provisioning completed successfully!"
echo "=========================================================="
echo "Next Steps:"
echo "1. Clone or copy project files to /var/www/hooram-studio"
echo "2. Copy production .env with your secrets to /var/www/hooram-studio/.env"
echo "3. Run 'bash deploy/deploy.sh' to build and start the app"
echo "4. Copy deploy/nginx.conf to /etc/nginx/sites-available/hooramstudio.ir"
echo "5. Issue SSL certificate: certbot --nginx -d hooramstudio.ir -d www.hooramstudio.ir"
echo "=========================================================="


# Reproducibility Guide

Complete step-by-step guide to replicate the Plaksha Living Lab monitoring system on a fresh openSUSE Linux installation.

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] Fresh openSUSE Linux installation (Leap 15.x or Tumbleweed)
- [ ] Root or sudo access
- [ ] Network connectivity
- [ ] At least 10GB free disk space
- [ ] 8GB RAM (16GB recommended)
- [ ] Access to stream server at 10.1.40.46 (or your server IP)

## Part 1: System Preparation

### Step 1: Update System

```bash
# Update package repositories
sudo zypper refresh

# Update all installed packages
sudo zypper update -y

# Reboot if kernel was updated
sudo reboot
```

### Step 2: Install Required System Packages

```bash
# Install development tools
sudo zypper install -y \
  git \
  curl \
  wget \
  vim \
  htop \
  net-tools \
  bind-utils

# Install build essentials for native modules
sudo zypper install -y \
  gcc \
  make \
  libtool \
  autoconf \
  automake
```

### Step 3: Install Node.js and npm

**Option A: Via zypper (Recommended for openSUSE)**

```bash
# Install Node.js 18.x or newer
sudo zypper install -y nodejs18 npm18

# Verify installation
node --version  # Should be v18.x.x or higher
npm --version   # Should be 9.x.x or higher
```

**Option B: Via Node Version Manager (nvm)**

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
source ~/.bashrc

# Install Node.js LTS
nvm install --lts
nvm use --lts

# Verify
node --version
npm --version
```

### Step 4: Configure Firewall (if enabled)

```bash
# Check firewall status
sudo firewall-cmd --state

# If running, allow HTTP traffic
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https

# Reload firewall
sudo firewall-cmd --reload
```

## Part 2: Install Web Server

### Option A: Nginx (Recommended)

```bash
# Install Nginx
sudo zypper install -y nginx

# Enable and start Nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Verify Nginx is running
sudo systemctl status nginx

# Test default page
curl http://localhost
```

### Option B: Apache

```bash
# Install Apache
sudo zypper install -y apache2

# Enable required modules
sudo a2enmod rewrite
sudo a2enmod deflate
sudo a2enmod headers

# Enable and start Apache
sudo systemctl enable apache2
sudo systemctl start apache2

# Verify Apache is running
sudo systemctl status apache2
```

## Part 3: Clone and Setup Application

### Step 1: Create Application Directory

```bash
# Create application directory
sudo mkdir -p /opt/plaksha-monitoring
sudo chown $USER:$USER /opt/plaksha-monitoring
cd /opt/plaksha-monitoring
```

### Step 2: Clone Repository

**If using Git repository:**

```bash
# Clone from repository
git clone <REPOSITORY_URL> .

# Or if you have the code as an archive
wget <ARCHIVE_URL>
tar -xzf plaksha-monitoring.tar.gz
```

**If setting up from scratch:**

```bash
# Initialize npm project
npm init -y

# Install Vite and React
npm install vite @vitejs/plugin-react-swc react react-dom react-router-dom

# Install all dependencies (see package.json from project)
npm install @hookform/resolvers \
  @radix-ui/react-accordion \
  @radix-ui/react-alert-dialog \
  # ... (all other dependencies)
  
# Copy source files
# (Transfer the complete src/, public/, etc. directories)
```

### Step 3: Install Dependencies

```bash
# Install all npm packages
npm install

# This should install:
# - React 18.x
# - TypeScript 5.x
# - Vite 5.x
# - Tailwind CSS
# - shadcn/ui components
# - All other dependencies
```

### Step 4: Environment Configuration

```bash
# Create .env file (if needed)
cat > .env << 'EOF'
VITE_API_BASE_URL=http://10.1.40.46
# Add any other environment variables
EOF
```

### Step 5: Build Application

```bash
# Run TypeScript type check
npm run build

# Output should be in dist/ folder
ls -la dist/

# Expected output:
# - index.html
# - assets/
#   - *.js files
#   - *.css files
#   - *.png, *.jpg files
```

## Part 4: Configure Web Server

### Configuration for Nginx

```bash
# Create Nginx config file
sudo vim /etc/nginx/conf.d/plaksha.conf
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name 10.1.40.46;  # Replace with your IP or domain
    
    root /opt/plaksha-monitoring/dist;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
    gzip_min_length 1000;

    # SPA routing - fallback to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Logging
    access_log /var/log/nginx/plaksha-access.log;
    error_log /var/log/nginx/plaksha-error.log;
}
```

```bash
# Test Nginx configuration
sudo nginx -t

# If OK, reload Nginx
sudo systemctl reload nginx
```

### Configuration for Apache

```bash
# Create Apache config file
sudo vim /etc/apache2/vhosts.d/plaksha.conf
```

Add the following configuration:

```apache
<VirtualHost *:80>
    ServerName 10.1.40.46
    DocumentRoot /opt/plaksha-monitoring/dist

    <Directory /opt/plaksha-monitoring/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted

        # SPA routing
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    # Enable compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json
    </IfModule>

    # Cache static assets
    <IfModule mod_expires.c>
        ExpiresActive On
        ExpiresByType image/jpg "access plus 1 year"
        ExpiresByType image/jpeg "access plus 1 year"
        ExpiresByType image/png "access plus 1 year"
        ExpiresByType text/css "access plus 1 month"
        ExpiresByType application/javascript "access plus 1 month"
    </IfModule>

    # Logging
    ErrorLog /var/log/apache2/plaksha-error.log
    CustomLog /var/log/apache2/plaksha-access.log combined
</VirtualHost>
```

```bash
# Test Apache configuration
sudo apachectl configtest

# If OK, reload Apache
sudo systemctl reload apache2
```

## Part 5: Verify Installation

### Step 1: Test Web Server

```bash
# Test from local machine
curl -I http://localhost

# Expected response:
# HTTP/1.1 200 OK
# Content-Type: text/html
```

### Step 2: Test from Browser

Open browser and navigate to:
```
http://10.1.40.46
```

You should see the login page.

### Step 3: Test Login

1. Username: `DixonIoT`
2. Password: `P@ssw0rd@123`

Should redirect to dashboard.

### Step 4: Test Stream Connectivity

```bash
# Test each stream endpoint
for port in 5000 5001 5002 5003; do
  echo "Testing port $port..."
  curl -I http://10.1.40.46:$port/stream
  curl http://10.1.40.46:$port/stats | jq
done
```

## Part 6: Configure Backend (Stream Servers)

### If Backend Not Yet Running

The backend consists of Flask servers running the consumer scripts. Here's how to set them up:

```bash
# SSH to stream server
ssh administrator@10.1.40.46

# Navigate to project directory
cd /home/administrator/PULKIT/Headcount_Pipeline

# Create Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install flask kafka-python opencv-python numpy torch ultralytics

# Start consumers (one terminal per camera)
# Terminal 1
python3 quick_headcount_stream.py \
  --camera gate_02_entry \
  --topic video.raw.gate_02_entry \
  --port 5000

# Terminal 2
python3 quick_headcount_stream.py \
  --camera gate1_main_entry \
  --topic video.raw.gate1_main_entry \
  --port 5001

# Terminal 3
python3 quick_headcount_stream.py \
  --camera gate1_outside_left \
  --topic video.raw.gate1_outside_left \
  --port 5002

# Terminal 4
python3 quick_headcount_stream.py \
  --camera gate2_exit \
  --topic video.raw.gate2_exit \
  --port 5003
```

### Create Systemd Services (Production)

For production, create systemd services to auto-start consumers:

```bash
# Create service file
sudo vim /etc/systemd/system/plaksha-stream@.service
```

```ini
[Unit]
Description=Plaksha Camera Stream %i
After=network.target

[Service]
Type=simple
User=administrator
WorkingDirectory=/home/administrator/PULKIT/Headcount_Pipeline
Environment="PATH=/home/administrator/PULKIT/Headcount_Pipeline/venv/bin"
ExecStart=/home/administrator/PULKIT/Headcount_Pipeline/venv/bin/python3 \
  quick_headcount_stream.py \
  --camera %i \
  --topic video.raw.%i \
  --port ${PORT}
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Create environment files for each camera
sudo mkdir -p /etc/systemd/system/plaksha-stream@gate_02_entry.service.d
echo "[Service]" | sudo tee /etc/systemd/system/plaksha-stream@gate_02_entry.service.d/port.conf
echo "Environment=PORT=5000" | sudo tee -a /etc/systemd/system/plaksha-stream@gate_02_entry.service.d/port.conf

# Repeat for other cameras...

# Enable and start services
sudo systemctl daemon-reload
sudo systemctl enable plaksha-stream@gate_02_entry
sudo systemctl enable plaksha-stream@gate1_main_entry
sudo systemctl enable plaksha-stream@gate1_outside_left
sudo systemctl enable plaksha-stream@gate2_exit

sudo systemctl start plaksha-stream@gate_02_entry
sudo systemctl start plaksha-stream@gate1_main_entry
sudo systemctl start plaksha-stream@gate1_outside_left
sudo systemctl start plaksha-stream@gate2_exit
```

## Part 7: Automated Deployment Script

Create a deployment script for easy updates:

```bash
# Create deployment script
cat > /opt/plaksha-monitoring/deploy.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 Deploying Plaksha Monitoring System..."

# Pull latest changes (if using git)
if [ -d .git ]; then
  echo "📥 Pulling latest changes..."
  git pull
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Build application
echo "🔨 Building application..."
npm run build

# Set correct permissions
echo "🔒 Setting permissions..."
chmod -R 755 dist/

# Test web server config
echo "🧪 Testing web server configuration..."
if command -v nginx &> /dev/null; then
  sudo nginx -t
  sudo systemctl reload nginx
elif command -v apachectl &> /dev/null; then
  sudo apachectl configtest
  sudo systemctl reload apache2
fi

echo "✅ Deployment complete!"
echo "🌐 Access at: http://10.1.40.46"
EOF

chmod +x /opt/plaksha-monitoring/deploy.sh
```

Usage:
```bash
cd /opt/plaksha-monitoring
./deploy.sh
```

## Part 8: Monitoring and Health Checks

### Create Health Check Script

```bash
cat > /opt/plaksha-monitoring/healthcheck.sh << 'EOF'
#!/bin/bash

echo "=== Plaksha Monitoring Health Check ==="
echo ""

# Check web server
echo "📡 Checking web server..."
if curl -sf http://localhost > /dev/null; then
  echo "✅ Web server is running"
else
  echo "❌ Web server is down"
fi

# Check stream endpoints
echo ""
echo "📹 Checking stream endpoints..."
for port in 5000 5001 5002 5003; do
  if curl -sf http://10.1.40.46:$port/stats > /dev/null; then
    echo "✅ Stream on port $port is online"
  else
    echo "❌ Stream on port $port is offline"
  fi
done

# Check disk space
echo ""
echo "💾 Disk space:"
df -h / | tail -1

# Check memory
echo ""
echo "🧠 Memory usage:"
free -h | grep Mem

echo ""
echo "=== Health Check Complete ==="
EOF

chmod +x /opt/plaksha-monitoring/healthcheck.sh
```

### Setup Cron Job for Monitoring

```bash
# Add to crontab
crontab -e

# Add this line to run health check every 5 minutes
*/5 * * * * /opt/plaksha-monitoring/healthcheck.sh >> /var/log/plaksha-health.log 2>&1
```

## Part 9: Backup and Recovery

### Create Backup Script

```bash
cat > /opt/plaksha-monitoring/backup.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="/var/backups/plaksha"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="plaksha-monitoring-$DATE.tar.gz"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
tar -czf $BACKUP_DIR/$BACKUP_NAME \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.git' \
  /opt/plaksha-monitoring/

echo "✅ Backup created: $BACKUP_DIR/$BACKUP_NAME"

# Keep only last 7 backups
ls -t $BACKUP_DIR/plaksha-monitoring-*.tar.gz | tail -n +8 | xargs -r rm

echo "🧹 Old backups cleaned up"
EOF

chmod +x /opt/plaksha-monitoring/backup.sh
```

### Schedule Daily Backups

```bash
# Add to crontab
crontab -e

# Add this line for daily backup at 2 AM
0 2 * * * /opt/plaksha-monitoring/backup.sh >> /var/log/plaksha-backup.log 2>&1
```

### Recovery Procedure

```bash
# List available backups
ls -lh /var/backups/plaksha/

# Restore from backup
cd /
sudo tar -xzf /var/backups/plaksha/plaksha-monitoring-YYYYMMDD_HHMMSS.tar.gz

# Rebuild application
cd /opt/plaksha-monitoring
npm install
npm run build

# Restart web server
sudo systemctl reload nginx  # or apache2
```

## Part 10: Security Hardening

### Step 1: SSL/TLS Configuration (Recommended for Production)

```bash
# Install certbot
sudo zypper install -y certbot python3-certbot-nginx

# Obtain certificate (if you have a domain)
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo systemctl enable certbot-renew.timer
sudo systemctl start certbot-renew.timer
```

### Step 2: Firewall Configuration

```bash
# Allow only necessary ports
sudo firewall-cmd --permanent --remove-service=ssh  # If not needed externally
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https

# Custom rate limiting (optional)
sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="0.0.0.0/0" port port="80" protocol="tcp" limit value="100/m" accept'

sudo firewall-cmd --reload
```

### Step 3: Secure Authentication

**Important**: For production, replace hardcoded credentials!

1. Implement proper backend authentication
2. Use environment variables for credentials
3. Implement password hashing
4. Add rate limiting for login attempts

## Verification Checklist

After completing all steps, verify:

- [ ] Web server is running (`systemctl status nginx`)
- [ ] Application is accessible in browser
- [ ] Login page loads correctly
- [ ] Can login with credentials
- [ ] Dashboard displays correctly
- [ ] All 4 streams are visible (or show offline status)
- [ ] Stats are updating every second
- [ ] CSV export works
- [ ] Health check script runs successfully
- [ ] Backup script creates backups
- [ ] System survives reboot (services auto-start)

## Quick Reference Commands

```bash
# Restart web server
sudo systemctl restart nginx

# View logs
sudo tail -f /var/log/nginx/plaksha-error.log

# Check application
cd /opt/plaksha-monitoring
npm run build

# Run health check
/opt/plaksha-monitoring/healthcheck.sh

# Create backup
/opt/plaksha-monitoring/backup.sh

# View stream logs (on stream server)
tail -f /home/administrator/PULKIT/Headcount_Pipeline/logs/*.log
```

## Troubleshooting

If you encounter issues during setup, refer to:
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Check system logs: `sudo journalctl -xe`
- Check web server logs
- Run health check script
- Verify all prerequisites are met

---

**Document Version**: 1.0  
**Platform**: openSUSE Linux  
**Last Updated**: 2025  
**Maintained By**: Dixon IoT Lab

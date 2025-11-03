# Complete Deployment Guide for openSUSE Linux

This comprehensive guide covers every step needed to deploy the Plaksha Living Lab monitoring system on a bare-metal openSUSE Linux system, from system preparation to ensuring streams work perfectly.

---

## Table of Contents

1. [System Prerequisites](#1-system-prerequisites)
2. [System Preparation](#2-system-preparation)
3. [Install Node.js and npm](#3-install-nodejs-and-npm)
4. [Install Web Server](#4-install-web-server)
5. [Clone and Setup Application](#5-clone-and-setup-application)
6. [Build the Application](#6-build-the-application)
7. [Configure Web Server](#7-configure-web-server)
8. [Flask Stream Server Setup](#8-flask-stream-server-setup)
9. [Configure CORS (Critical for Streams)](#9-configure-cors-critical-for-streams)
10. [Update Stream URLs](#10-update-stream-urls)
11. [Testing and Verification](#11-testing-and-verification)
12. [Enable Automatic Startup](#12-enable-automatic-startup)
13. [Troubleshooting Stream Issues](#13-troubleshooting-stream-issues)

---

## 1. System Prerequisites

### Hardware Requirements
- **CPU**: 4+ cores (Intel/AMD x86_64)
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 20GB free disk space minimum
- **GPU**: NVIDIA GPU with CUDA support (for ML models on stream server)
- **Network**: Gigabit Ethernet recommended

### Software Requirements
- **OS**: openSUSE Leap 15.3+ or Tumbleweed
- **Access**: Root or sudo privileges
- **Network**: Access to 10.1.40.46 subnet

### Network Requirements
- Port 80 (HTTP) - for web interface
- Port 443 (HTTPS) - optional, for SSL
- Ports 5000-5003 - for Flask stream servers
- Network connectivity between web server and stream server

---

## 2. System Preparation

### Step 2.1: Update System

```bash
# Refresh repositories
sudo zypper refresh

# Update all packages
sudo zypper update -y

# Reboot if kernel was updated
sudo reboot  # Optional, only if kernel updated
```

### Step 2.2: Install Essential Tools

```bash
# Install development tools
sudo zypper install -y \
    git \
    curl \
    wget \
    tar \
    gzip \
    unzip \
    vim \
    nano \
    htop \
    net-tools

# Verify installations
git --version
curl --version
```

### Step 2.3: Configure Firewall

```bash
# Check if firewalld is running
sudo systemctl status firewalld

# If not running, start and enable it
sudo systemctl start firewalld
sudo systemctl enable firewalld

# Add HTTP service
sudo firewall-cmd --permanent --add-service=http

# Add HTTPS (optional)
sudo firewall-cmd --permanent --add-service=https

# Add Flask ports (5000-5003)
sudo firewall-cmd --permanent --add-port=5000-5003/tcp

# Reload firewall
sudo firewall-cmd --reload

# Verify rules
sudo firewall-cmd --list-all
```

---

## 3. Install Node.js and npm

### Method 1: Using openSUSE Repositories (Recommended for Leap)

```bash
# Install Node.js 18
sudo zypper install -y nodejs18 npm18

# Verify installation
node --version   # Should show v18.x.x
npm --version    # Should show 9.x.x or 10.x.x
```

### Method 2: Using NodeSource Repository (For Latest LTS)

```bash
# Add NodeSource repository for Node.js 20 LTS
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -

# Install Node.js
sudo zypper install -y nodejs

# Verify installation
node --version   # Should show v20.x.x
npm --version    # Should show 10.x.x
```

### Method 3: Using nvm (Node Version Manager)

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell configuration
source ~/.bashrc

# Install Node.js LTS
nvm install --lts

# Use it
nvm use --lts

# Verify
node --version
npm --version
```

---

## 4. Install Web Server

### Option A: Nginx (Recommended)

```bash
# Install Nginx
sudo zypper install -y nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx

# Start Nginx
sudo systemctl start nginx

# Check status
sudo systemctl status nginx

# Test Nginx configuration
sudo nginx -t
```

### Option B: Apache

```bash
# Install Apache
sudo zypper install -y apache2

# Enable Apache to start on boot
sudo systemctl enable apache2

# Start Apache
sudo systemctl start apache2

# Check status
sudo systemctl status apache2

# Test Apache configuration
sudo apachectl configtest
```

---

## 5. Clone and Setup Application

### Step 5.1: Create Application Directory

```bash
# Create directory structure
sudo mkdir -p /var/www/plaksha-monitoring

# Change ownership to your user
sudo chown $USER:$USER /var/www/plaksha-monitoring

# Navigate to directory
cd /var/www/plaksha-monitoring
```

### Step 5.2: Get Application Code

#### Method 1: Clone from Git Repository

```bash
# Clone the repository (replace with your repo URL)
git clone https://github.com/your-username/plaksha-monitoring.git .

# Or if you have the repo URL
git clone <repository-url> .
```

#### Method 2: Manual File Copy

```bash
# If you have the project files on USB or another location
# Copy all files to /var/www/plaksha-monitoring
cp -r /path/to/source/* /var/www/plaksha-monitoring/

# Or use rsync for better control
rsync -av /path/to/source/ /var/www/plaksha-monitoring/
```

#### Method 3: Download ZIP Archive

```bash
# Download and extract
wget https://your-server.com/plaksha-monitoring.zip
unzip plaksha-monitoring.zip
mv plaksha-monitoring/* .
rm -rf plaksha-monitoring plaksha-monitoring.zip
```

### Step 5.3: Verify Files

```bash
# List files to verify structure
ls -la

# You should see:
# - package.json
# - src/
# - public/
# - index.html
# - vite.config.ts
# - etc.
```

---

## 6. Build the Application

### Step 6.1: Install Dependencies

```bash
# Navigate to project directory
cd /var/www/plaksha-monitoring

# Install all dependencies
npm install

# This will take 2-5 minutes depending on internet speed
```

### Step 6.2: Build Production Bundle

```bash
# Build the application
npm run build

# This creates a 'dist' directory with optimized files
```

### Step 6.3: Verify Build

```bash
# Check dist directory
ls -la dist/

# You should see:
# - index.html
# - assets/ (contains .js and .css files)
# - other static files
```

---

## 7. Configure Web Server

### Configuration A: Nginx

#### Step 7A.1: Create Nginx Configuration

```bash
# Create configuration file
sudo nano /etc/nginx/conf.d/plaksha-monitoring.conf
```

#### Step 7A.2: Add Configuration

```nginx
server {
    listen 80;
    server_name 10.1.40.46 localhost;  # Your server IP or domain
    
    root /var/www/plaksha-monitoring/dist;
    index index.html;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # SPA routing - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # CRITICAL: Proxy to Flask stream servers
    # This solves CORS issues and makes streams work
    location /api/stream/5000/ {
        proxy_pass http://10.1.40.46:5000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_buffering off;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
        
        # CORS headers (as backup)
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range' always;
    }
    
    location /api/stream/5001/ {
        proxy_pass http://10.1.40.46:5001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_buffering off;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    location /api/stream/5002/ {
        proxy_pass http://10.1.40.46:5002/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_buffering off;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    location /api/stream/5003/ {
        proxy_pass http://10.1.40.46:5003/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_buffering off;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    # Cache static assets aggressively
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
    
    # Access and error logs
    access_log /var/log/nginx/plaksha-access.log;
    error_log /var/log/nginx/plaksha-error.log warn;
}
```

#### Step 7A.3: Test and Reload Nginx

```bash
# Test configuration syntax
sudo nginx -t

# If test passes, reload Nginx
sudo systemctl reload nginx

# Check status
sudo systemctl status nginx

# View logs in real-time
sudo tail -f /var/log/nginx/plaksha-error.log
```

### Configuration B: Apache

#### Step 7B.1: Enable Required Modules

```bash
# Enable mod_rewrite for SPA routing
sudo a2enmod rewrite

# Enable proxy modules for Flask streams
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod headers
sudo a2enmod expires

# Reload Apache to apply modules
sudo systemctl reload apache2
```

#### Step 7B.2: Create Apache Configuration

```bash
# Create configuration file
sudo nano /etc/apache2/vhosts.d/plaksha-monitoring.conf
```

#### Step 7B.3: Add Configuration

```apache
<VirtualHost *:80>
    ServerName 10.1.40.46
    ServerAlias localhost
    DocumentRoot /var/www/plaksha-monitoring/dist
    
    <Directory /var/www/plaksha-monitoring/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # SPA routing - serve index.html for all routes
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # Proxy to Flask stream servers (CRITICAL for streams to work)
    ProxyPreserveHost On
    ProxyTimeout 300
    
    ProxyPass /api/stream/5000/ http://10.1.40.46:5000/
    ProxyPassReverse /api/stream/5000/ http://10.1.40.46:5000/
    
    ProxyPass /api/stream/5001/ http://10.1.40.46:5001/
    ProxyPassReverse /api/stream/5001/ http://10.1.40.46:5001/
    
    ProxyPass /api/stream/5002/ http://10.1.40.46:5002/
    ProxyPassReverse /api/stream/5002/ http://10.1.40.46:5002/
    
    ProxyPass /api/stream/5003/ http://10.1.40.46:5003/
    ProxyPassReverse /api/stream/5003/ http://10.1.40.46:5003/
    
    # Cache static assets
    <FilesMatch "\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$">
        Header set Cache-Control "max-age=31536000, public, immutable"
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
    </FilesMatch>
    
    # Compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json application/xml
    </IfModule>
    
    # Security headers
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    
    # Logs
    ErrorLog /var/log/apache2/plaksha-error.log
    CustomLog /var/log/apache2/plaksha-access.log combined
</VirtualHost>
```

#### Step 7B.4: Test and Restart Apache

```bash
# Test configuration
sudo apachectl configtest

# Restart Apache
sudo systemctl restart apache2

# Check status
sudo systemctl status apache2

# View logs
sudo tail -f /var/log/apache2/plaksha-error.log
```

---

## 8. Flask Stream Server Setup

### CRITICAL: Flask servers MUST be running for streams to work!

### Step 8.1: Verify Flask Server Location

```bash
# Navigate to the Flask server directory
cd /home/administrator/PULKIT/Headcount_Pipeline

# Check if consumer script exists
ls -la quick_headcount_stream.py
```

### Step 8.2: Install Python Dependencies

```bash
# Install Python 3 and pip
sudo zypper install -y python3 python3-pip

# Install required Python packages
pip3 install --user \
    flask \
    flask-cors \
    kafka-python \
    opencv-python \
    numpy \
    torch \
    torchvision \
    ultralytics

# Or if you have requirements.txt
pip3 install -r requirements.txt
```

### Step 8.3: Test Flask Server Manually

```bash
# Start one stream manually to test
python3 quick_headcount_stream.py \
    --camera gate_02_entry \
    --topic video.raw.gate_02_entry \
    --host 0.0.0.0 \
    --port 5000

# In another terminal, test if it works:
curl -I http://localhost:5000/stream
curl http://localhost:5000/stats

# Press Ctrl+C to stop the test
```

---

## 9. Configure CORS (Critical for Streams)

### Option 1: Add CORS to Flask (If NOT Using Proxy)

Edit your Flask consumer script:

```bash
nano /home/administrator/PULKIT/Headcount_Pipeline/quick_headcount_stream.py
```

Add CORS support at the top:

```python
from flask import Flask, Response, jsonify
from flask_cors import CORS  # Add this import

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Add this line

# ... rest of your code
```

Install flask-cors:

```bash
pip3 install flask-cors
```

### Option 2: Use Nginx/Apache Proxy (Recommended)

If you configured the proxy in Step 7, CORS is handled by the web server. No changes needed to Flask!

---

## 10. Update Stream URLs

### Step 10.1: Decide URL Strategy

**Option A: Using Proxy URLs (Recommended)**
- Streams accessed through web server proxy
- URLs: `/api/stream/5000/stream`, `/api/stream/5000/stats`
- Benefits: CORS handled, single domain, simpler

**Option B: Direct URLs**
- Streams accessed directly from Flask
- URLs: `http://10.1.40.46:5000/stream`
- Requires CORS configuration in Flask

### Step 10.2: Update Stream Configuration

```bash
# Edit streams configuration
nano /var/www/plaksha-monitoring/src/lib/streams.ts
```

**For Proxy URLs (Option A):**

```typescript
export const STREAMS: StreamConfig[] = [
  {
    id: 'gate_02_entry',
    name: 'Gate 02 Entry',
    location: 'Main Gate 02 - Entry Point',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/5000/stream',   // Proxy path
    statsUrl: '/api/stream/5000/stats'       // Proxy path
  },
  {
    id: 'gate1_main_entry',
    name: 'Gate 1 Main Entry',
    location: 'Gate 1 - Main Entry Point',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/5001/stream',
    statsUrl: '/api/stream/5001/stats'
  },
  {
    id: 'gate1_outside_left',
    name: 'Gate 1 Outside Left',
    location: 'Gate 1 - Left Exterior',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/5002/stream',
    statsUrl: '/api/stream/5002/stats'
  },
  {
    id: 'gate2_exit',
    name: 'Gate 2 Exit',
    location: 'Gate 2 - Exit Point',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: '/api/stream/5003/stream',
    statsUrl: '/api/stream/5003/stats'
  }
];
```

**For Direct URLs (Option B):**

```typescript
// Keep the original configuration with direct IPs
export const STREAMS: StreamConfig[] = [
  {
    id: 'gate_02_entry',
    name: 'Gate 02 Entry',
    location: 'Main Gate 02 - Entry Point',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: 'http://10.1.40.46:5000/stream',
    statsUrl: 'http://10.1.40.46:5000/stats'
  },
  // ... rest unchanged
];
```

### Step 10.3: Rebuild Application

```bash
# After modifying stream URLs, rebuild
cd /var/www/plaksha-monitoring
npm run build

# Reload web server
sudo systemctl reload nginx  # or apache2
```

---

## 11. Testing and Verification

### Step 11.1: Start All Flask Stream Servers

```bash
# Navigate to Flask directory
cd /home/administrator/PULKIT/Headcount_Pipeline

# Start all 4 streams in background
python3 quick_headcount_stream.py --camera gate_02_entry --topic video.raw.gate_02_entry --host 0.0.0.0 --port 5000 &
python3 quick_headcount_stream.py --camera gate1_main_entry --topic video.raw.gate1_main_entry --host 0.0.0.0 --port 5001 &
python3 quick_headcount_stream.py --camera gate1_outside_left --topic video.raw.gate1_outside_left --host 0.0.0.0 --port 5002 &
python3 quick_headcount_stream.py --camera gate2_exit --topic video.raw.gate2_exit --host 0.0.0.0 --port 5003 &

# Check if all are running
ps aux | grep python3
```

### Step 11.2: Test Stream Endpoints

```bash
# Test each stream endpoint
curl -I http://10.1.40.46:5000/stream
curl -I http://10.1.40.46:5001/stream
curl -I http://10.1.40.46:5002/stream
curl -I http://10.1.40.46:5003/stream

# Test stats endpoints
curl http://10.1.40.46:5000/stats | python3 -m json.tool
curl http://10.1.40.46:5001/stats | python3 -m json.tool
curl http://10.1.40.46:5002/stats | python3 -m json.tool
curl http://10.1.40.46:5003/stats | python3 -m json.tool

# You should see JSON output with frames, fps, head_count, etc.
```

### Step 11.3: Access Web Interface

```bash
# Get your server IP
ip addr show | grep "inet " | grep -v 127.0.0.1

# Open browser and navigate to:
# http://your-server-ip
# OR
# http://10.1.40.46
```

### Step 11.4: Complete Login and Stream Test

1. **Login**:
   - Username: `DixonIoT`
   - Password: `P@ssw0rd@123`

2. **Dashboard**:
   - Verify dashboard loads
   - See 3 cards (Dog Detection, Head Count, Entry/Exit)
   - Click "Head Count" card

3. **Streams Page**:
   - All 4 streams should display video feeds
   - Green "Online" badges should show
   - Stats should update every second
   - Try CSV export

4. **Check Browser Console** (F12):
   - No errors should appear
   - Network tab should show successful stream and stats requests

---

## 12. Enable Automatic Startup

### Step 12.1: Create Systemd Service for Each Stream

Create service files for automatic startup of Flask streams:

```bash
# Create service for gate_02_entry
sudo nano /etc/systemd/system/plaksha-stream-5000.service
```

Add:

```ini
[Unit]
Description=Plaksha Stream - Gate 02 Entry (Port 5000)
After=network.target

[Service]
Type=simple
User=administrator
WorkingDirectory=/home/administrator/PULKIT/Headcount_Pipeline
ExecStart=/usr/bin/python3 quick_headcount_stream.py --camera gate_02_entry --topic video.raw.gate_02_entry --host 0.0.0.0 --port 5000
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Repeat for other ports (5001, 5002, 5003):

```bash
# Port 5001
sudo nano /etc/systemd/system/plaksha-stream-5001.service
# (Change port, camera name, and topic accordingly)

# Port 5002
sudo nano /etc/systemd/system/plaksha-stream-5002.service

# Port 5003
sudo nano /etc/systemd/system/plaksha-stream-5003.service
```

### Step 12.2: Enable and Start Services

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable services to start on boot
sudo systemctl enable plaksha-stream-5000
sudo systemctl enable plaksha-stream-5001
sudo systemctl enable plaksha-stream-5002
sudo systemctl enable plaksha-stream-5003

# Start all services
sudo systemctl start plaksha-stream-5000
sudo systemctl start plaksha-stream-5001
sudo systemctl start plaksha-stream-5002
sudo systemctl start plaksha-stream-5003

# Check status of all
sudo systemctl status plaksha-stream-5000
sudo systemctl status plaksha-stream-5001
sudo systemctl status plaksha-stream-5002
sudo systemctl status plaksha-stream-5003

# View logs
sudo journalctl -u plaksha-stream-5000 -f
```

### Step 12.3: Test Auto-Restart

```bash
# Reboot system
sudo reboot

# After reboot, check if everything started automatically
sudo systemctl status nginx  # or apache2
sudo systemctl status plaksha-stream-5000
sudo systemctl status plaksha-stream-5001
sudo systemctl status plaksha-stream-5002
sudo systemctl status plaksha-stream-5003
```

---

## 13. Troubleshooting Stream Issues

### Issue: Streams Show "Offline"

**Diagnosis:**
```bash
# 1. Check if Flask servers are running
ps aux | grep python3 | grep quick_headcount

# 2. Check if ports are listening
sudo netstat -tulpn | grep :5000
sudo netstat -tulpn | grep :5001
sudo netstat -tulpn | grep :5002
sudo netstat -tulpn | grep :5003

# 3. Test Flask endpoints directly
curl -I http://localhost:5000/stream
curl http://localhost:5000/stats
```

**Solution:**
```bash
# Start Flask servers if not running
sudo systemctl start plaksha-stream-5000
sudo systemctl start plaksha-stream-5001
sudo systemctl start plaksha-stream-5002
sudo systemctl start plaksha-stream-5003

# Check logs for errors
sudo journalctl -u plaksha-stream-5000 -n 50
```

### Issue: CORS Errors in Browser Console

**Diagnosis:**
- Open browser console (F12)
- Look for errors like "Access-Control-Allow-Origin"

**Solution Option 1 - Use Proxy:**
```bash
# Ensure proxy is configured in Nginx/Apache (Step 7)
# Rebuild with proxy URLs (Step 10)
```

**Solution Option 2 - Add CORS to Flask:**
```bash
# Install flask-cors
pip3 install flask-cors

# Edit Flask script to add CORS (Step 9)
# Restart Flask servers
sudo systemctl restart plaksha-stream-5000
```

### Issue: Stats Not Updating

**Diagnosis:**
```bash
# Test stats endpoint
curl http://10.1.40.46:5000/stats

# Check browser network tab for failed requests
```

**Solution:**
```bash
# Verify Flask is returning valid JSON
curl http://10.1.40.46:5000/stats | python3 -m json.tool

# Check if stats polling interval is correct in code
# Should update every 1000ms (1 second)
```

### Issue: High CPU/Memory Usage

**Diagnosis:**
```bash
# Check resource usage
htop

# Check specific process
top -p $(pgrep -f quick_headcount_stream)
```

**Solution:**
```bash
# Adjust model settings (FP16, smaller batch size)
# Reduce frame rate in Kafka producer
# Consider adding GPU monitoring
nvidia-smi  # If using NVIDIA GPU
```

### Issue: Connection Refused

**Diagnosis:**
```bash
# Check if services are running
sudo systemctl status plaksha-stream-5000

# Check firewall
sudo firewall-cmd --list-all
```

**Solution:**
```bash
# Open required ports in firewall
sudo firewall-cmd --permanent --add-port=5000-5003/tcp
sudo firewall-cmd --reload

# Restart services
sudo systemctl restart plaksha-stream-5000
```

### Issue: Proxy Not Working

**Diagnosis:**
```bash
# Test proxy directly
curl -I http://10.1.40.46/api/stream/5000/stream

# Check web server error logs
sudo tail -f /var/log/nginx/plaksha-error.log
# OR
sudo tail -f /var/log/apache2/plaksha-error.log
```

**Solution:**
```bash
# Verify proxy configuration syntax
sudo nginx -t  # for Nginx
sudo apachectl configtest  # for Apache

# Reload web server
sudo systemctl reload nginx  # or apache2
```

---

## Final Verification Checklist

- [ ] System updated and essential tools installed
- [ ] Node.js and npm installed and verified
- [ ] Web server (Nginx/Apache) installed, configured, and running
- [ ] Application cloned and dependencies installed
- [ ] Production build created successfully
- [ ] Web server configuration includes stream proxies
- [ ] Flask stream servers installed and configured
- [ ] CORS configured (either via proxy or Flask)
- [ ] Stream URLs updated in code
- [ ] Application rebuilt after URL changes
- [ ] All 4 Flask servers running and accessible
- [ ] Web interface accessible via browser
- [ ] Login successful
- [ ] Dashboard displays correctly
- [ ] All 4 streams visible and online
- [ ] Stats updating every second
- [ ] CSV export functional
- [ ] Systemd services created for auto-startup
- [ ] System tested after reboot
- [ ] No errors in browser console
- [ ] No errors in web server logs
- [ ] No errors in Flask service logs

---

## Quick Command Reference

```bash
# Check web server status
sudo systemctl status nginx  # or apache2

# Check Flask servers
sudo systemctl status plaksha-stream-5000

# View logs
sudo journalctl -u plaksha-stream-5000 -f
sudo tail -f /var/log/nginx/plaksha-error.log

# Restart services
sudo systemctl restart nginx
sudo systemctl restart plaksha-stream-5000

# Test endpoints
curl -I http://10.1.40.46:5000/stream
curl http://10.1.40.46:5000/stats

# Rebuild application
cd /var/www/plaksha-monitoring
npm run build
sudo systemctl reload nginx
```

---

## Need Help?

If you encounter issues not covered here:
1. Check logs: `sudo journalctl -xe`
2. Verify network: `ping 10.1.40.46`
3. Test ports: `telnet 10.1.40.46 5000`
4. Check firewall: `sudo firewall-cmd --list-all`
5. Review Flask logs: `sudo journalctl -u plaksha-stream-5000 -n 100`

---

**Deployment Status**: Production Ready ✅  
**Last Updated**: 2025  
**Maintained by**: Dixon IoT Lab

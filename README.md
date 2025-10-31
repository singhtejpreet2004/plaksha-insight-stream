# Plaksha Living Lab - Real-time Camera Monitoring System

[![Production Ready](https://img.shields.io/badge/status-production%20ready-green)]()
[![Local First](https://img.shields.io/badge/deployment-local%20first-blue)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()

A production-ready, local-first web monitoring system for Plaksha University's AI-powered camera streams. Built with React, TypeScript, and Vite for real-time head counting analytics.

![Plaksha Building](src/assets/plaksha-building.png)

## 🎯 Overview

This system provides real-time monitoring of 4 camera streams running YOLOv8 + BoT-SORT head counting models. It features:

- **Real-time Stream Viewing**: Live MJPEG streams from all cameras
- **Live Analytics**: FPS, head counts, and detection metrics updated every second
- **Data Export**: CSV export with flexible time ranges (1 day to 6 months)
- **Professional UI**: Plaksha-themed interface with smooth animations
- **Local-First**: Zero cloud dependencies, runs entirely on local infrastructure
- **Production Ready**: Error handling, loading states, and robust architecture

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Login Page   │→ │  Dashboard   │→ │ Streams Page │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                 │                    │             │
│         └─────────────────┴────────────────────┘             │
│                           ↓                                  │
│              ┌─────────────────────────┐                     │
│              │  Authentication (Local) │                     │
│              │  Stream Utilities       │                     │
│              │  CSV Generation         │                     │
│              └─────────────────────────┘                     │
└─────────────────────────────────────────────────────────────┘
                           ↓ HTTP Requests
┌─────────────────────────────────────────────────────────────┐
│              Flask Servers (Camera Streams)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ :5000/stream │  │ :5001/stream │  │ :5002/stream │      │
│  │ :5000/stats  │  │ :5001/stats  │  │ :5002/stats  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                    ┌──────────────┐                          │
│                    │ :5003/stream │                          │
│                    │ :5003/stats  │                          │
│                    └──────────────┘                          │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│         Kafka Pipeline → YOLOv8 + BoT-SORT Models           │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

### System Requirements
- **OS**: openSUSE Linux (tested on Leap/Tumbleweed)
- **CPU**: Multi-core processor (4+ cores recommended)
- **RAM**: 8GB minimum, 16GB recommended
- **GPU**: NVIDIA GPU with CUDA support (for ML models)
- **Network**: Access to 10.1.40.46 subnet (camera stream server)

### Software Requirements
- Node.js 18.x or higher
- npm 9.x or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd plaksha-monitoring
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment (Optional)

The system is pre-configured for deployment on `10.1.40.46`. If deploying elsewhere, update the stream URLs in `src/lib/streams.ts`:

```typescript
export const STREAMS: StreamConfig[] = [
  {
    id: 'gate_02_entry',
    streamUrl: 'http://YOUR_IP:5000/stream',  // Update this
    statsUrl: 'http://YOUR_IP:5000/stats'     // Update this
  },
  // ... other streams
];
```

### 4. Development Mode

```bash
npm run dev
```

Access at: `http://localhost:8080`

### 5. Production Build

```bash
npm run build
npm run preview
```

## 📦 Deployment on openSUSE

### Option 1: Simple HTTP Server (Development/Testing)

```bash
# Build the project
npm run build

# Serve with Python
cd dist
python3 -m http.server 8080

# Or with Node.js
npx serve -s dist -l 8080
```

### Option 2: Nginx (Production Recommended)

1. **Install Nginx**:
```bash
sudo zypper install nginx
```

2. **Build the application**:
```bash
npm run build
```

3. **Configure Nginx** (`/etc/nginx/conf.d/plaksha.conf`):
```nginx
server {
    listen 80;
    server_name 10.1.40.46;  # Or your domain
    root /path/to/plaksha-monitoring/dist;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

4. **Enable and start Nginx**:
```bash
sudo systemctl enable nginx
sudo systemctl start nginx
sudo systemctl status nginx
```

5. **Configure firewall** (if needed):
```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload
```

### Option 3: Apache (Alternative)

1. **Install Apache**:
```bash
sudo zypper install apache2
```

2. **Configure Apache** (`/etc/apache2/vhosts.d/plaksha.conf`):
```apache
<VirtualHost *:80>
    ServerName 10.1.40.46
    DocumentRoot /path/to/plaksha-monitoring/dist

    <Directory /path/to/plaksha-monitoring/dist>
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
</VirtualHost>
```

3. **Enable required modules and start**:
```bash
sudo a2enmod rewrite
sudo a2enmod deflate
sudo systemctl enable apache2
sudo systemctl start apache2
```

## 🔐 Authentication

Default credentials (configured in `src/lib/auth.ts`):
- **Username**: `DixonIoT`
- **Password**: `P@ssw0rd@123`

> ⚠️ **Security Note**: For production deployment, implement proper authentication backend with password hashing and secure token management.

## 🎨 Customization

### Color Theme

The Plaksha color scheme is defined in `src/index.css`:

```css
:root {
  --primary: 18 55% 48%;        /* Terracotta */
  --secondary: 25 45% 35%;      /* Deep Brown */
  --accent: 35 60% 85%;         /* Cream */
  /* ... */
}
```

### Adding New Streams

1. Update `src/lib/streams.ts`:
```typescript
export const STREAMS: StreamConfig[] = [
  // ... existing streams
  {
    id: 'new_camera',
    name: 'New Camera Name',
    location: 'Camera Location',
    model: 'YOLOv8 + BoT-SORT Head Count',
    streamUrl: 'http://10.1.40.46:XXXX/stream',
    statsUrl: 'http://10.1.40.46:XXXX/stats'
  }
];
```

2. The UI will automatically update to display the new stream in the grid.

## 📊 Data Export

CSV exports include:
- Timestamp (ISO 8601)
- Camera name
- Total frames processed
- Average FPS
- Last inference time (ms)
- Last head count
- Total heads detected

Time ranges available:
- Last 24 Hours
- Last 7 Days
- Last Month
- Last 3 Months
- Last 6 Months

## 🐛 Troubleshooting

### Streams Not Loading

1. **Check stream server status**:
```bash
curl -I http://10.1.40.46:5000/stream
```

2. **Verify network connectivity**:
```bash
ping 10.1.40.46
```

3. **Check browser console** for CORS or network errors

### Stats Not Updating

1. **Verify stats endpoint**:
```bash
curl http://10.1.40.46:5000/stats
```

2. **Check browser developer tools** → Network tab for failed requests

3. **Ensure camera streams are running** on the backend

### Build Failures

1. **Clear cache and reinstall**:
```bash
rm -rf node_modules package-lock.json
npm install
```

2. **Check Node.js version**:
```bash
node --version  # Should be 18.x or higher
```

3. **Verify all dependencies**:
```bash
npm audit fix
```

### Performance Issues

1. **Check system resources**:
```bash
htop
```

2. **Monitor network bandwidth** if streams are laggy

3. **Reduce refresh rate** in `StreamCard.tsx` if needed (currently 1 second)

## 📁 Project Structure

```
plaksha-monitoring/
├── src/
│   ├── assets/              # Images and static files
│   │   └── plaksha-building.png
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── DashboardCard.tsx
│   │   ├── LoginPage.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── StreamCard.tsx
│   │   └── StreamsPage.tsx
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and core logic
│   │   ├── auth.ts        # Authentication
│   │   ├── csv.ts         # CSV generation
│   │   ├── streams.ts     # Stream configuration
│   │   └── utils.ts
│   ├── pages/              # Route pages
│   ├── App.tsx             # Main app component
│   ├── index.css           # Global styles & design system
│   └── main.tsx            # App entry point
├── public/                 # Static public files
├── dist/                   # Production build (generated)
├── docs/                   # Documentation
│   ├── KNOWLEDGE_TRANSFER.md
│   ├── TROUBLESHOOTING.md
│   ├── REPRODUCIBILITY.md
│   └── SCALABILITY.md
├── index.html             # HTML template
├── package.json           # Dependencies
├── tailwind.config.ts     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── README.md              # This file
```

## 🔧 Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **React Router** - Client-side routing
- **Lucide React** - Icons

### State Management
- React hooks (useState, useEffect)
- LocalStorage for authentication

### Build & Dev Tools
- ESLint - Code linting
- PostCSS - CSS processing
- SWC - Fast TypeScript compilation

## 📖 Additional Documentation

Detailed documentation is available in the `/docs` folder:

1. **[KNOWLEDGE_TRANSFER.md](docs/KNOWLEDGE_TRANSFER.md)** - Comprehensive system architecture and lifecycle diagrams
2. **[TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** - Common issues and solutions
3. **[REPRODUCIBILITY.md](docs/REPRODUCIBILITY.md)** - Step-by-step deployment guide
4. **[SCALABILITY.md](docs/SCALABILITY.md)** - Scaling guide and CI/CD pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🏢 Credits

**Developed by Dixon IoT Lab**  
Plaksha University

---

## 📞 Support

For issues or questions:
- Create an issue in the repository
- Contact: Dixon IoT Lab

## 🔄 Version History

- **v1.0.0** (2025) - Initial production release
  - Login system with local authentication
  - Dashboard with 3 model categories
  - Real-time stream viewing (4 cameras)
  - Live statistics display
  - CSV export functionality
  - Production-ready deployment

---

**Status**: ✅ Production Ready | 🚀 Actively Maintained

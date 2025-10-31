# Troubleshooting Guide

Complete troubleshooting guide for the Plaksha Living Lab monitoring system.

## Quick Diagnosis

### System Health Check

Run these checks first:

```bash
# 1. Check stream servers
curl -I http://10.1.40.46:5000/stream
curl -I http://10.1.40.46:5001/stream
curl -I http://10.1.40.46:5002/stream
curl -I http://10.1.40.46:5003/stream

# 2. Check stats endpoints
curl http://10.1.40.46:5000/stats
curl http://10.1.40.46:5001/stats
curl http://10.1.40.46:5002/stats
curl http://10.1.40.46:5003/stats

# 3. Check network connectivity
ping 10.1.40.46

# 4. Check if frontend is running
curl -I http://localhost:8080  # Dev mode
curl -I http://10.1.40.46:80   # Production
```

## Common Issues

### Issue 1: Cannot Login

#### Symptoms
- Login button doesn't respond
- "Invalid credentials" error with correct password
- Page refreshes but stays on login screen

#### Diagnosis

```bash
# Check browser console (F12)
# Look for errors related to:
# - LocalStorage access
# - JavaScript errors
# - Route navigation failures
```

#### Solutions

**A. LocalStorage Blocked**

Check if localStorage is accessible:
```javascript
// In browser console
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
  console.log('✅ LocalStorage accessible');
} catch (e) {
  console.log('❌ LocalStorage blocked:', e);
}
```

Solutions:
- Enable third-party cookies in browser settings
- Check browser privacy/security settings
- Try different browser
- Clear browser data and retry

**B. Incorrect Credentials**

Verify credentials in `src/lib/auth.ts`:
```typescript
const CREDENTIALS = {
  username: 'DixonIoT',
  password: 'P@ssw0rd@123'
};
```

**C. Router Not Working**

Check for:
- Hash fragments in URL
- Base URL configuration
- Console errors about routing

Fix:
```bash
# Rebuild application
npm run build

# Clear browser cache
# Ctrl+Shift+Delete (Chrome)
# Cmd+Shift+Delete (Mac)
```

---

### Issue 2: Streams Not Loading

#### Symptoms
- Black screen or "Loading stream..." message
- "Stream offline" with red indicator
- Image broken icon

#### Diagnosis

```bash
# Test stream directly
curl -I http://10.1.40.46:5000/stream

# Expected response:
# HTTP/1.1 200 OK
# Content-Type: multipart/x-mixed-replace; boundary=frameboundary
```

#### Solutions

**A. Flask Server Not Running**

Check if consumer scripts are running:
```bash
# On the stream server (10.1.40.46)
ps aux | grep quick_headcount

# Should see 4 processes (one per camera)
```

Start consumer if not running:
```bash
python3 quick_headcount_stream.py \
  --camera gate_02_entry \
  --topic video.raw.gate_02_entry \
  --port 5000
```

**B. Network Issues**

Test connectivity:
```bash
# From frontend server
telnet 10.1.40.46 5000

# If fails:
# - Check firewall rules
# - Verify network routing
# - Check if servers are on same subnet
```

Firewall rules (on stream server):
```bash
sudo firewall-cmd --permanent --add-port=5000-5003/tcp
sudo firewall-cmd --reload
```

**C. CORS Issues**

Check browser console for CORS errors. If present, update Flask servers:

```python
# In consumer script
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
```

**D. Browser Image Loading**

Try opening stream URL directly:
```
http://10.1.40.46:5000/stream
```

If this works but app doesn't:
- Clear browser cache
- Check for Content Security Policy errors
- Verify img tag rendering in React

---

### Issue 3: Stats Not Updating

#### Symptoms
- Metrics show "Waiting for data..."
- Numbers frozen/not changing
- FPS shows 0

#### Diagnosis

```bash
# Check stats endpoint
curl http://10.1.40.46:5000/stats | jq

# Expected output:
# {
#   "camera": "gate_02_entry",
#   "frames": 12345,
#   "avg_fps": 30.5,
#   "last_infer_ms": 25.3,
#   "last_head_count": 3,
#   "total_heads": 1234,
#   "utc": "2025-01-15T10:30:00.123456Z"
# }
```

#### Solutions

**A. Stats Endpoint Not Responding**

Check Flask route:
```python
@app.route("/stats")
def stats_route():
    return jsonify({
        "camera": app.config.get("camera"),
        "frames": stats["frames"],
        # ... rest of stats
    })
```

Restart Flask server if needed.

**B. Stats Fetch Failing**

Check browser Network tab:
- Status code (should be 200)
- Response body
- CORS headers

**C. Polling Interval Issues**

Verify polling in `StreamCard.tsx`:
```typescript
useEffect(() => {
  const statsInterval = setInterval(async () => {
    const data = await fetchStreamStats(stream.statsUrl);
    // ...
  }, 1000); // 1 second interval

  return () => clearInterval(statsInterval);
}, [stream]);
```

---

### Issue 4: High CPU/Memory Usage

#### Symptoms
- Browser becomes sluggish
- Fan spinning loudly
- System freezing

#### Diagnosis

```bash
# Check system resources
htop

# Monitor browser memory
# Chrome: chrome://memory-redirect/
# Firefox: about:memory
```

#### Solutions

**A. Too Many Streams**

If viewing all 4 streams:
- Images updated every frame
- Stats polled every second
- 4x network requests

Reduce load:
```typescript
// In StreamCard.tsx
// Increase polling interval
const statsInterval = setInterval(async () => {
  // ...
}, 2000); // 2 seconds instead of 1
```

**B. Memory Leaks**

Check for:
- Unmounted components still polling
- Event listeners not cleaned up
- Large arrays in state

Fix cleanup:
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    // ... polling logic
  }, 1000);

  // ⚠️ IMPORTANT: Cleanup
  return () => clearInterval(interval);
}, []);
```

**C. Browser Cache Overflow**

Clear cache and reload:
```
Chrome: Ctrl+Shift+Delete
Firefox: Ctrl+Shift+Delete
Safari: Cmd+Option+E
```

---

### Issue 5: CSV Export Failing

#### Symptoms
- Download button not working
- Empty CSV file
- Browser errors

#### Diagnosis

Check browser console for errors:
```javascript
// Look for:
// - Blob creation errors
// - Download trigger failures
// - Data generation issues
```

#### Solutions

**A. Popup Blocked**

Browser may block download:
- Allow popups for the site
- Click download button again
- Try different browser

**B. Data Generation Error**

Test CSV generation:
```typescript
// In browser console
import { generateCSV } from './lib/csv';
const csv = generateCSV('test', '1day', null);
console.log(csv);
```

**C. Stats Not Available**

CSV uses current stats. Ensure:
- Stream is online
- Stats endpoint responding
- Valid JSON returned

---

### Issue 6: Build Failures

#### Symptoms
- `npm run build` fails
- TypeScript errors
- Module not found errors

#### Diagnosis

```bash
# Check Node version
node --version  # Should be 18.x+

# Check npm version
npm --version   # Should be 9.x+

# List installed packages
npm list --depth=0
```

#### Solutions

**A. Clean Install**

```bash
# Remove everything
rm -rf node_modules
rm package-lock.json
rm -rf dist

# Fresh install
npm install
npm run build
```

**B. TypeScript Errors**

Common issues:
```typescript
// ❌ Missing type
const data = await fetch(url);
// ✅ Add type
const data: Response = await fetch(url);

// ❌ Implicit any
const handleClick = (e) => {};
// ✅ Type parameter
const handleClick = (e: React.MouseEvent) => {};
```

**C. Dependency Conflicts**

Check for version mismatches:
```bash
npm ls
# Look for UNMET PEER DEPENDENCY warnings
```

Fix:
```bash
npm install --legacy-peer-deps
```

**D. Module Resolution**

Verify path aliases in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

And `vite.config.ts`:
```typescript
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

---

### Issue 7: Deployment Issues

#### Symptoms
- Nginx/Apache returns 404
- Assets not loading
- Blank page after deployment

#### Diagnosis

```bash
# Check web server status
sudo systemctl status nginx
# or
sudo systemctl status apache2

# Check error logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/apache2/error_log
```

#### Solutions

**A. Wrong Document Root**

Verify Nginx config:
```nginx
server {
    root /correct/path/to/plaksha-monitoring/dist;
    # ...
}
```

Test config and reload:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

**B. SPA Routing Not Working**

Ensure fallback to index.html:

Nginx:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Apache:
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

**C. Permissions Issues**

```bash
# Fix ownership
sudo chown -R nginx:nginx /path/to/dist
# or
sudo chown -R apache:apache /path/to/dist

# Fix permissions
sudo chmod -R 755 /path/to/dist
```

**D. SELinux Blocking**

If on openSUSE with SELinux:
```bash
# Check status
sudo sestatus

# Allow web server to serve files
sudo chcon -R -t httpd_sys_content_t /path/to/dist

# Or disable SELinux (not recommended for production)
sudo setenforce 0
```

---

## Error Messages Reference

### "Failed to fetch"

**Cause**: Network request to Flask server failed

**Check**:
1. Flask server running?
2. Correct URL in `streams.ts`?
3. CORS configured?
4. Firewall blocking?

---

### "localStorage is not available"

**Cause**: Browser privacy settings block localStorage

**Solutions**:
1. Enable cookies and site data
2. Check private browsing mode
3. Try different browser
4. Check Content Security Policy

---

### "Cannot read property 'map' of undefined"

**Cause**: Expected array but got undefined

**Check**:
1. API response structure
2. Null checks in code
3. Loading states
4. Error boundaries

---

### "Module not found: Can't resolve '@/components/...'"

**Cause**: Path alias not working

**Fix**:
1. Check `tsconfig.json` paths
2. Check `vite.config.ts` alias
3. Restart dev server
4. Clear cache: `rm -rf node_modules/.vite`

---

## Performance Optimization

### Slow Initial Load

**Diagnosis**:
```bash
npm run build
npm run preview
# Open DevTools > Network tab
# Check asset sizes and timing
```

**Solutions**:
1. **Code splitting**: Already enabled by Vite
2. **Image optimization**: Use WebP format
3. **Lazy loading**: Implement for heavy components
4. **CDN**: Serve static assets from CDN

### Sluggish Stream Updates

**Diagnosis**:
- Check FPS in browser DevTools > Performance
- Monitor network waterfall

**Solutions**:
1. Increase polling interval (2-3 seconds)
2. Implement debouncing for rapid updates
3. Use RequestAnimationFrame for smoother renders
4. Consider WebSocket for push-based updates

---

## Advanced Debugging

### Enable Verbose Logging

Add to `vite.config.ts`:
```typescript
export default defineConfig({
  logLevel: 'info',
  // ...
});
```

### Network Debugging

```bash
# Capture network traffic
sudo tcpdump -i any -n port 5000 -w capture.pcap

# Analyze with Wireshark
wireshark capture.pcap
```

### React DevTools

Install React DevTools extension:
- Chrome: chrome://extensions
- Firefox: about:debugging#/runtime/this-firefox

Use to:
- Inspect component tree
- View props and state
- Profile performance
- Trace re-renders

---

## Emergency Recovery

### Complete System Reset

```bash
# 1. Stop all services
sudo systemctl stop nginx
# or
sudo systemctl stop apache2

# 2. Clean frontend
cd /path/to/plaksha-monitoring
rm -rf node_modules dist
npm install
npm run build

# 3. Restart backend services
# (SSH to stream server)
killall -9 python3
# Restart consumer scripts

# 4. Restart web server
sudo systemctl start nginx
```

### Factory Reset Authentication

```javascript
// In browser console
localStorage.removeItem('plaksha_auth_token');
location.reload();
```

---

## Getting Help

### Information to Collect

Before asking for help, gather:

1. **System info**:
```bash
uname -a
cat /etc/os-release
node --version
npm --version
```

2. **Error logs**:
```bash
# Browser console (F12)
# Web server logs
sudo tail -n 100 /var/log/nginx/error.log

# Flask logs
tail -n 100 /home/administrator/PULKIT/Headcount_Pipeline/logs/*.log
```

3. **Network diagnostics**:
```bash
curl -v http://10.1.40.46:5000/stats
```

4. **Screenshots**:
- Error messages
- Browser console
- Network tab

### Escalation Path

1. Check this troubleshooting guide
2. Review logs and error messages
3. Test with diagnostic commands
4. Document findings
5. Contact Dixon IoT Lab with collected information

---

## Preventive Maintenance

### Daily Checks

```bash
# Create monitoring script
cat > ~/check_streams.sh << 'EOF'
#!/bin/bash
for port in 5000 5001 5002 5003; do
  if curl -sf http://10.1.40.46:$port/stats > /dev/null; then
    echo "✅ Port $port OK"
  else
    echo "❌ Port $port FAILED"
  fi
done
EOF

chmod +x ~/check_streams.sh
./check_streams.sh
```

### Weekly Tasks

1. Check disk space: `df -h`
2. Review logs for errors
3. Update dependencies: `npm outdated`
4. Test backup restore procedure

### Monthly Tasks

1. Full system update: `sudo zypper update`
2. Security audit: `npm audit`
3. Performance review
4. Documentation updates

---

**Document Version**: 1.0  
**Last Updated**: 2025  
**Maintained By**: Dixon IoT Lab

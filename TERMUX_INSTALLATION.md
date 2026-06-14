# Forum Anti Penyimpangan - Termux Installation Guide

**Port:** 3003  
**Domain:** anti-penyimpangan.lombok26.biz.id  
**Environment:** Self-hosted on Android (Termux)

---

## 🎯 Table of Contents

1. [Quick Start (5 minutes)](#quick-start)
2. [Detailed Setup](#detailed-setup)
3. [Running the Server](#running-the-server)
4. [Keep Server Running 24/7](#keep-server-running-247)
5. [Troubleshooting](#troubleshooting)
6. [Useful Commands](#useful-commands)

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites Check
```bash
# Check if Termux is installed
# If not, install from Google Play Store or F-Droid

# Open Termux and run:
pkg update && pkg upgrade
```

### Clone & Setup
```bash
# 1. Clone repository
git clone https://github.com/your-username/anti-penyimpangan-forum.git
cd anti-penyimpangan-forum

# 2. Install dependencies
bash scripts/start-termux.sh
```

That's it! Server will start on **http://192.168.x.x:3003**

---

## 📋 Detailed Setup

### Step 1: Install Termux

**Option A: Google Play Store**
- Search: "Termux"
- Install official Termux app

**Option B: F-Droid**
- Open F-Droid app
- Search: "Termux"
- Install official Termux app

### Step 2: Update Termux

```bash
pkg update
pkg upgrade
```

### Step 3: Install Required Tools

```bash
# Install essential packages
pkg install nodejs-lts git curl wget vim nano

# Install Node.js
node --version  # Should show v18+

# Install pnpm (package manager)
npm install -g pnpm
pnpm --version  # Should show latest pnpm version
```

### Step 4: Setup Storage Access (Important!)

```bash
# Grant Termux access to device storage
termux-setup-storage

# This creates ~/storage/ directory
# You can now access:
# - ~/storage/downloads/
# - ~/storage/documents/
# - etc.
```

### Step 5: Clone Repository

```bash
# Navigate to storage
cd ~/storage/documents/

# Clone the repository
git clone https://github.com/your-username/anti-penyimpangan-forum.git
cd anti-penyimpangan-forum
```

### Step 6: Setup Environment Variables

```bash
# Option A: Use production config (for custom domain)
cp .env.production .env.local

# Option B: Copy from template
cp .env.example .env.local

# Edit the file
nano .env.local
```

**Required fields to update:**

```env
# Database (REQUIRED!)
DATABASE_URL=postgresql://user:password@host/dbname
# Get from: https://neon.tech (free PostgreSQL)

# Generate with: openssl rand -base64 32
BETTER_AUTH_SECRET=your-generated-secret

# For development testing on Termux:
BETTER_AUTH_URL=http://192.168.x.x:3003
NEXT_PUBLIC_APP_URL=http://192.168.x.x:3003

# For production with domain:
BETTER_AUTH_URL=https://anti-penyimpangan.lombok26.biz.id
NEXT_PUBLIC_APP_URL=https://anti-penyimpangan.lombok26.biz.id

# Optional: Vercel Blob for file uploads
BLOB_READ_WRITE_TOKEN=your-blob-token

# Set to production
NODE_ENV=production
```

### Step 7: Install Dependencies

```bash
# Using pnpm (recommended - faster)
pnpm install

# Or using npm
npm install
```

### Step 8: Build Project

```bash
# Build for production
pnpm build

# Or with npm
npm run build
```

This creates the `.next` folder with optimized production build.

### Step 9: Start Server

```bash
# Simple start
pnpm start

# This starts server on port 3003
# You should see: "ready started server on 0.0.0.0:3003"
```

---

## 🌐 Running the Server

### Method 1: Direct Start (Simple)

```bash
# Terminal 1 - Run server
cd ~/storage/documents/anti-penyimpangan-forum
pnpm start

# Server runs on port 3003
# Keep terminal open
```

### Method 2: Daemon with tmux (Best)

```bash
# Install tmux
pkg install tmux

# Start as daemon
bash scripts/start-daemon.sh

# Server runs in background
# You can close terminal
```

**Useful tmux commands:**
```bash
# View server output
tmux attach -t forum-server

# Detach (keep server running)
Ctrl+B, then D

# Kill server
tmux kill-session -t forum-server

# List all sessions
tmux list-sessions
```

### Method 3: Daemon with nohup

```bash
# Start server
nohup pnpm start > server.log 2>&1 &

# View logs
tail -f server.log

# Stop server
kill $(cat .server.pid)
```

---

## 🔄 Keep Server Running 24/7

### Option 1: Tasker (Recommended for Termux)

Install Tasker app and create a task that:
1. Runs at startup
2. Executes: `tmux attach -t forum-server` 
3. Or restarts the server if crashed

### Option 2: Cron Job

```bash
# Install cronie
pkg install cronie

# Start cron service
crond

# Edit crontab
crontab -e

# Add this line to restart server every hour:
0 * * * * cd /path/to/forum && pnpm start > /tmp/forum.log 2>&1

# Check cron jobs
crontab -l
```

### Option 3: Systemd (if available)

Create `/etc/systemd/system/forum.service`:

```ini
[Unit]
Description=Forum Anti Penyimpangan
After=network.target

[Service]
Type=simple
User=termux
WorkingDirectory=/home/termux/storage/documents/anti-penyimpangan-forum
ExecStart=/data/data/com.termux/files/usr/bin/pnpm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Then:
```bash
systemctl enable forum.service
systemctl start forum.service
```

---

## 📱 Access Your Forum

### From Same WiFi Network

```
http://192.168.x.x:3003
```

Replace `192.168.x.x` with your Termux device IP:
```bash
# Get your IP
ip addr show wlan0
# or
ifconfig wlan0
```

### From Different Network (Public Access)

**Option A: Ngrok (Easy)**

```bash
# Install ngrok
npm install -g ngrok

# Start ngrok tunnel
ngrok http 3003

# Share the public URL
https://xxxx-xx-xxx-xxx-xx.ngrok.io
```

**Option B: Cloudflare Tunnel**

```bash
# Install cloudflared
curl -L https://github.com/cloudflare/cloudflared/releases/download/latest/cloudflared-linux-arm64 -o cloudflared
chmod +x cloudflared

# Create tunnel
./cloudflared tunnel --url http://localhost:3003
```

**Option C: Custom Domain (Production)**

1. Point domain DNS to Termux IP or use cloudflare tunnel
2. Update `.env.production`:
   ```env
   BETTER_AUTH_URL=https://anti-penyimpangan.lombok26.biz.id
   NEXT_PUBLIC_APP_URL=https://anti-penyimpangan.lombok26.biz.id
   ```
3. Setup SSL certificate (use Let's Encrypt)

---

## 🔧 Troubleshooting

### Problem: "Port 3003 is already in use"

```bash
# Find what's using port 3003
lsof -i :3003

# Kill the process
kill -9 <PID>

# Or use different port in package.json
nano package.json
# Change: "start": "next start -p 3003" → "start": "next start -p 8080"
```

### Problem: "DATABASE_URL not set"

```bash
# Check .env.local
cat .env.local

# Should show: DATABASE_URL=postgresql://...
# If not, edit and add it:
nano .env.local
```

### Problem: "Database connection refused"

```bash
# Test database connection
psql postgresql://user:password@host/dbname

# If error, check:
1. DATABASE_URL is correct
2. PostgreSQL server is accessible
3. Firewall allows connection
4. Username/password is correct
```

### Problem: "Server crashes on startup"

```bash
# Check build output
rm -rf .next
pnpm build

# Check logs
tail -100 server.log

# Try running with debug
NODE_ENV=production pnpm start
```

### Problem: "Out of memory / Low disk space"

```bash
# Check disk space
df -h

# Check RAM usage
free -h

# Clear cache
rm -rf .next node_modules
pnpm install
pnpm build
```

### Problem: "Can't access from other device"

```bash
# 1. Confirm server is running on 0.0.0.0:3003
# (not just localhost)
ss -tlnp | grep 3003

# 2. Check firewall
# Termux: Usually no firewall
# Device firewall: May need to allow port 3003

# 3. Ensure both devices on same WiFi

# 4. Test with curl
curl http://192.168.x.x:3003
```

---

## 📊 Useful Commands

### Server Management

```bash
# Start server
pnpm start

# Start with debug logs
DEBUG=* pnpm start

# Build only (no start)
pnpm build

# View logs (if running with daemon)
tail -f server.log
```

### Database

```bash
# Push schema to database
pnpm db:push

# Generate migrations
pnpm db:generate

# Open Drizzle Studio (DB admin)
pnpm db:studio
```

### System Info

```bash
# Check Node version
node --version

# Check pnpm version
pnpm --version

# Check disk space
df -h

# Check RAM
free -h

# Check running processes
ps aux | grep node
ps aux | grep next

# Get device IP
ip addr show wlan0
```

### Development (Testing)

```bash
# Start in development mode (port 3000)
pnpm dev:local

# Start in production mode (port 3003)
pnpm start:termux

# Run linter
pnpm lint
```

### Git Operations

```bash
# Check git status
git status

# Commit changes
git add .
git commit -m "Your message"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main
```

---

## ⚡ Performance Optimization (Optional)

### Reduce Memory Usage

Edit `.env.local`:
```env
NODE_OPTIONS=--max-old-space-size=512
```

### Enable Compression

Already enabled in `next.config.js`:
```javascript
compress: true
```

### Limit Workers

```bash
# Run with single worker
NODE_OPTIONS="--max-workers=1" pnpm start
```

---

## 🔒 Security Notes

1. **NEVER share BETTER_AUTH_SECRET**
   - Generate unique secret: `openssl rand -base64 32`
   - Keep it safe!

2. **Use HTTPS for production**
   - Setup domain with SSL certificate
   - Use Cloudflare or Let's Encrypt

3. **Regular backups**
   - Backup database regularly
   - Backup uploaded files

4. **Update regularly**
   ```bash
   git pull origin main
   pnpm install
   pnpm build
   pnpm start
   ```

---

## 📞 Support

### Common Issues

| Issue | Solution |
|-------|----------|
| Can't clone repo | Check git is installed: `apt install git` |
| pnpm not found | Install: `npm install -g pnpm` |
| Database error | Check DATABASE_URL in .env.local |
| Port in use | Kill process: `kill $(lsof -t -i:3003)` |
| Low memory | Use smaller node allocation or optimize code |

### Debug Mode

```bash
# Run with verbose logging
DEBUG=* NODE_ENV=production pnpm start

# Run with node debug
node --inspect=0.0.0.0:9229 node_modules/.bin/next start
```

---

## 🎯 Next Steps

1. ✅ Install Termux
2. ✅ Clone repository
3. ✅ Setup .env.local
4. ✅ Run `pnpm install && pnpm build && pnpm start`
5. ✅ Access at http://192.168.x.x:3003
6. ✅ Setup domain (optional for production)
7. ✅ Keep server running 24/7 with tmux/daemon

---

## 📚 Additional Resources

- [Termux Documentation](https://termux.dev)
- [Node.js Official](https://nodejs.org)
- [Next.js Docs](https://nextjs.org/docs)
- [Neon PostgreSQL](https://neon.tech)
- [Drizzle ORM](https://orm.drizzle.team)

---

**Good luck with your Forum Anti Penyimpangan server! 🚀**

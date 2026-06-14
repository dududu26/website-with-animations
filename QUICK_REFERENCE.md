# Forum Anti Penyimpangan - Quick Reference Card

**Port:** 3003 | **Domain:** anti-penyimpangan.lombok26.biz.id | **Env:** Termux/Linux

---

## 🚀 QUICK START (Copy-Paste Ready)

### 1️⃣ First Time Setup
```bash
# Install packages
pkg update && pkg upgrade
pkg install nodejs-lts git curl pnpm

# Storage access
termux-setup-storage

# Clone & enter
cd ~/storage/documents
git clone https://github.com/your-username/anti-penyimpangan-forum.git
cd anti-penyimpangan-forum

# Setup env
cp .env.example .env.local
nano .env.local
# Edit: DATABASE_URL, BETTER_AUTH_SECRET

# Install & build
pnpm install
pnpm build

# Start!
pnpm start
```

### 2️⃣ Access Forum
- **Local WiFi:** `http://192.168.x.x:3003`
- **Get IP:** `ip addr show wlan0`
- **Test:** `curl http://localhost:3003`

---

## 🔄 Run Server (Choose One)

### Simple (Terminal stays open)
```bash
pnpm start
```

### Daemon with tmux (Recommended)
```bash
pkg install tmux
bash scripts/start-daemon.sh

# Commands:
tmux attach -t forum-server    # View output
Ctrl+B, D                       # Detach
tmux kill-session -t forum-server  # Stop
```

### Daemon with nohup
```bash
nohup pnpm start > server.log 2>&1 &
tail -f server.log
kill $(cat .server.pid)
```

---

## 📝 Environment Variables

### Development (.env.local)
```env
DATABASE_URL=postgresql://user:password@host/dbname
BETTER_AUTH_SECRET=openssl-rand-base64-32-output
BETTER_AUTH_URL=http://192.168.x.x:3003
NEXT_PUBLIC_APP_URL=http://192.168.x.x:3003
NODE_ENV=development
```

### Production (.env.production)
```env
DATABASE_URL=postgresql://user:password@host/dbname
BETTER_AUTH_SECRET=openssl-rand-base64-32-output
BETTER_AUTH_URL=https://anti-penyimpangan.lombok26.biz.id
NEXT_PUBLIC_APP_URL=https://anti-penyimpangan.lombok26.biz.id
NODE_ENV=production
```

---

## 🛠️ Common Commands

```bash
# Build only
pnpm build

# Database schema
pnpm db:push        # Push schema to DB
pnpm db:generate    # Generate migration
pnpm db:studio      # Open DB admin

# Check status
ps aux | grep "next start"    # Is server running?
ss -tlnp | grep 3003          # Port in use?
ip addr show wlan0             # Get device IP

# Stop server
kill -9 <PID>                 # Kill by PID
tmux kill-session -t forum-server  # Kill tmux
killall node                  # Kill all node processes
```

---

## ⚙️ Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| DATABASE_URL | PostgreSQL connection | `postgresql://user:pass@host/db` |
| BETTER_AUTH_SECRET | Encryption key (KEEP SAFE!) | `openssl rand -base64 32` |
| BETTER_AUTH_URL | Where app is hosted | `http://192.168.x.x:3003` |
| NEXT_PUBLIC_APP_URL | Frontend API URL | `http://192.168.x.x:3003` |
| BLOB_READ_WRITE_TOKEN | File upload (optional) | From Vercel |
| NODE_ENV | Environment | `development` or `production` |

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| **"Port 3003 in use"** | `kill $(lsof -t -i:3003)` |
| **"DATABASE_URL not set"** | `cat .env.local` then edit with `nano` |
| **"Can't access from WiFi"** | `ip addr show wlan0` get IP, then `http://IP:3003` |
| **"Server won't start"** | Check `.env.local` has DATABASE_URL |
| **"Out of memory"** | `NODE_OPTIONS=--max-old-space-size=512 pnpm start` |
| **"Git clone fails"** | `apt install git` |

---

## 📊 Useful Scripts

```bash
# View last 50 lines of log
tail -50 server.log

# Monitor server in real-time
watch -n 1 'ps aux | grep "next start"'

# Restart server (tmux)
tmux kill-session -t forum-server && bash scripts/start-daemon.sh

# Backup database
pg_dump DATABASE_URL > backup.sql

# Check disk usage
du -sh ~/storage/documents/anti-penyimpangan-forum
```

---

## 🌐 Public Access (Optional)

### Ngrok
```bash
npm install -g ngrok
ngrok http 3003
# Share the public URL
```

### Cloudflare Tunnel
```bash
curl -L https://github.com/cloudflare/cloudflared/releases/download/latest/cloudflared-linux-arm64 -o cloudflared
chmod +x cloudflared
./cloudflared tunnel --url http://localhost:3003
```

---

## 🎯 Production Checklist

- [ ] Copy `.env.example` → `.env.production`
- [ ] Update DATABASE_URL with Neon connection
- [ ] Generate BETTER_AUTH_SECRET: `openssl rand -base64 32`
- [ ] Set BETTER_AUTH_URL to domain
- [ ] Run: `pnpm install && pnpm build`
- [ ] Start with tmux: `bash scripts/start-daemon.sh`
- [ ] Test access: `http://192.168.x.x:3003`
- [ ] Setup domain DNS (optional)
- [ ] Enable HTTPS (optional)

---

## 📱 Access Points

| Device | URL | Setup |
|--------|-----|-------|
| Same WiFi | `http://192.168.x.x:3003` | No setup |
| Different WiFi | Ngrok/Tunnel | `ngrok http 3003` |
| Custom Domain | `https://anti-penyimpangan.lombok26.biz.id` | DNS + SSL |

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| TERMUX_INSTALLATION.md | Full Termux setup guide |
| QUICKSTART.md | Local development setup |
| DEPLOYMENT.md | Vercel deployment |
| README.md | Project overview |
| .env.example | Environment template |
| .env.production | Production config |

---

## 🔑 Key Commands by Scenario

### Just Starting
```bash
pnpm install && pnpm build && pnpm start
```

### Want Background Server
```bash
pkg install tmux
bash scripts/start-daemon.sh
```

### Already Running, View Output
```bash
tmux attach -t forum-server
```

### Stop Server
```bash
tmux kill-session -t forum-server
# or
kill $(lsof -t -i:3003)
```

### Update Code from GitHub
```bash
git pull origin main
pnpm install
pnpm build
pnpm start
```

---

## ✅ Everything Ready!

You have:
- ✓ Port 3003 configured
- ✓ Domain ready for DNS
- ✓ Startup scripts included
- ✓ Environment templates ready
- ✓ Documentation complete

**Next Step:** Follow TERMUX_INSTALLATION.md for full setup!

---

**Forum Anti Penyimpangan** | Termux Self-Hosted | Port 3003

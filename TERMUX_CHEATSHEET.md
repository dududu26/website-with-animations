# Termux Quick Reference - Forum Anti Penyimpangan

## One-Time Setup (First Time Only)

```bash
# 1. Update packages
pkg update && pkg upgrade -y

# 2. Install dependencies
pkg install nodejs git -y
npm install -g pnpm

# 3. Clone repo
cd /sdcard/Documents
git clone https://github.com/YOUR_USERNAME/anti-penyimpangan-forum.git
cd anti-penyimpangan-forum

# 4. Setup environment
nano .env.local
# Paste credentials, save with Ctrl+X -> Y -> Enter

# 5. Install project dependencies
pnpm install

# 6. Build project
pnpm build

# 7. Setup database (one-time)
pnpm db:push
```

---

## Daily Commands

```bash
# Start server
cd /sdcard/Documents/anti-penyimpangan-forum
pnpm start

# Access from browser
http://192.168.x.x:3000
```

---

## Keep Server Running

### Opsi 1: tmux (Recommended)
```bash
# First time
pkg install tmux -y

# Start server in background
tmux new-session -d -s forum "cd /sdcard/Documents/anti-penyimpangan-forum && pnpm start"

# Check status
tmux list-sessions

# View logs
tmux capture-pane -t forum -p

# Stop
tmux kill-session -t forum
```

### Opsi 2: PM2
```bash
# Install (first time)
npm install -g pm2

# Start
pm2 start "pnpm start" --name "forum"

# View logs
pm2 logs forum

# Stop
pm2 stop forum
```

### Opsi 3: nohup
```bash
# Start
nohup pnpm start > server.log 2>&1 &
echo $! > server.pid

# View logs
tail -f server.log

# Stop
kill $(cat server.pid)
```

---

## Troubleshooting

```bash
# Check if Node installed
node --version

# Check if port 3000 is free
lsof -i :3000

# Kill process on port 3000
kill -9 PID_NUMBER

# Check internet connection
ping neon.tech

# Clear npm cache
npm cache clean --force
pnpm store prune

# Reinstall everything
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build

# Check logs
tail -f server.log
tail -f nohup.out
```

---

## Directory Structure

```
/sdcard/Documents/
└── anti-penyimpangan-forum/
    ├── app/              (Pages & API)
    ├── components/       (React components)
    ├── lib/              (Database, auth, utils)
    ├── .env.local        (Your credentials)
    ├── .next/            (Build output)
    ├── node_modules/     (Dependencies)
    ├── package.json
    ├── pnpm-lock.yaml
    └── TERMUX_SETUP.md   (Detailed guide)
```

---

## Environment Variables Needed

```bash
# Generate BETTER_AUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# .env.local contents:
DATABASE_URL=postgresql://user:password@host/dbname
BETTER_AUTH_SECRET=<generated-secret>
BETTER_AUTH_URL=http://192.168.x.x:3000
BLOB_READ_WRITE_TOKEN=<from-vercel>
NEXT_PUBLIC_APP_URL=http://192.168.x.x:3000
```

---

## Network Access

```bash
# Find your Termux IP address
hostname -I

# Access from same WiFi
http://192.168.x.x:3000

# Access from internet (using ngrok)
npm install -g ngrok
ngrok http 3000
# Will show: https://xxxx-xxxx.ngrok.io
```

---

## Database Commands

```bash
# Check database connection
node -e "
const url = process.env.DATABASE_URL;
console.log('[v0] Database:', url ? 'OK' : 'NOT SET');
"

# Push schema to database
pnpm db:push

# Open database admin panel
pnpm db:studio
```

---

## Project Commands

```bash
# Development (with hot reload) - if needed
pnpm dev

# Production build
pnpm build

# Start production server (for Termux)
pnpm start

# Check for errors
pnpm lint
```

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "node not found" | `pkg install nodejs -y` |
| "port 3000 in use" | `kill -9 $(lsof -t -i :3000)` |
| "out of memory" | Reduce build size or upgrade phone |
| "database timeout" | Check internet, verify DATABASE_URL |
| "pnpm not found" | `npm install -g pnpm` |
| "permission denied" | `chmod +x filename` |

---

## Pro Tips

1. **Save battery**: Keep Termux in background, use screen lock
2. **Stable connection**: Use WiFi, not mobile data (if possible)
3. **Monitor storage**: `df -h` command to check disk space
4. **Update regularly**: `pkg update && pkg upgrade`
5. **Backup .env.local**: Save credentials somewhere safe
6. **Version control**: Use `git pull` to update from GitHub

---

## When to Use Termux Server

✅ Development & testing on Android device
✅ Learning how servers work
✅ Demo to friends on same WiFi
✅ 24/7 server IF phone always charged & connected

❌ NOT for production (unstable)
❌ NOT without backup power (no UPS on phone)
❌ NOT if phone has limited data plan

---

## Better Alternatives

For **production**, consider:

1. **Railway** (free tier, easiest for Next.js)
   - Deploy in 5 minutes
   - Free tier: $5/month credit
   - https://railway.app

2. **Render** (free tier available)
   - Good for Node.js apps
   - Free tier available
   - https://render.com

3. **Vercel** (built for Next.js)
   - Free tier available
   - Best performance
   - https://vercel.com

4. **Heroku** (paid but reliable)
   - $7/month minimum
   - Very reliable
   - https://www.heroku.com

---

## Final Notes

Termux is great for development, but remember:
- Your phone ≠ Data Center
- Electricity & internet must be stable
- Have backup plan for downtime

For production, use cloud server. For Termux, use for **development only**.

Good luck! 🚀

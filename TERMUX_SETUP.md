# Setup Forum Anti Penyimpangan di Termux sebagai Server

## ⚠️ PENTING: Catatan Awal

Termux adalah environment terbatas untuk development. Beberapa kendala yang perlu Anda ketahui:

1. **CPU/RAM Terbatas**: Android smartphone memiliki resource terbatas
2. **Storage**: Space di smartphone terbatas, database bisa cepat penuh
3. **Network**: Harus terhubung WiFi 24/7 atau data plan unlimited
4. **Power**: Smartphone harus stay on dengan screen lock, sangat menguras baterai
5. **Stabilitas**: Bisa restart kapan saja, server tiba-tiba offline

**Rekomendasi Lebih Baik**: Gunakan Cloud Server seperti:
- Railway (free tier tersedia)
- Render (free tier tersedia)
- Heroku (paid, tapi reliable)
- VPS murah di Hetzner/DigitalOcean

Tapi jika tetap mau pakai Termux, ikuti panduan ini.

---

## Step 1: Install Termux & Dependencies

### 1.1 Download Termux
- Download dari Google Play Store atau F-Droid
- Buka Termux

### 1.2 Update Package Manager
```bash
pkg update && pkg upgrade -y
```

### 1.3 Install Node.js (LTS)
```bash
pkg install nodejs -y
```

Verifikasi:
```bash
node --version   # harus v18+
npm --version    # atau pnpm
```

### 1.4 Install Git
```bash
pkg install git -y
```

Verifikasi:
```bash
git --version
```

### 1.5 Install PostgreSQL Client (untuk connect ke Neon)
```bash
pkg install postgresql -y
```

**CATATAN**: Termux tidak support running PostgreSQL server secara native. Anda HARUS menggunakan:
- Neon (cloud PostgreSQL) - **RECOMMENDED**
- Supabase (cloud PostgreSQL)
- Atau PostgreSQL di server lain

### 1.6 Install pnpm (Package Manager yang Lebih Cepat)
```bash
npm install -g pnpm
```

---

## Step 2: Clone Repository dari GitHub

### 2.1 Setup Git Config (First Time Only)
```bash
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"
```

### 2.2 Clone Repository
```bash
# Navigasi ke folder yang Anda ingin store repository
cd $HOME/projects
# atau
cd /sdcard/Documents

# Clone dari GitHub
git clone https://github.com/YOUR_USERNAME/anti-penyimpangan-forum.git
cd anti-penyimpangan-forum
```

### 2.3 Verify Project Structure
```bash
ls -la
cat package.json | grep -A 5 "scripts"
```

---

## Step 3: Setup Environment Variables

### 3.1 Create .env.local
```bash
nano .env.local
```

Paste ini dan edit sesuai credentials Anda:
```
# Database (dari Neon)
DATABASE_URL=postgresql://user:password@neon.tech/dbname

# Better Auth Secret
BETTER_AUTH_SECRET=your-generated-secret-here

# Better Auth URL
BETTER_AUTH_URL=http://192.168.x.x:3000

# Vercel Blob Token
BLOB_READ_WRITE_TOKEN=your-blob-token-here

# App URL
NEXT_PUBLIC_APP_URL=http://192.168.x.x:3000
```

**Cara mendapat credentials**:

**DATABASE_URL dari Neon**:
1. Go to: https://neon.tech
2. Buat project baru
3. Copy connection string dari "Connection details"
4. Format: `postgresql://user:password@neon-server.neon.tech/dbname`

**BETTER_AUTH_SECRET** (Generate random string):
```bash
# Di Termux, run ini untuk generate secret:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
Copy hasilnya ke BETTER_AUTH_SECRET

**BLOB_READ_WRITE_TOKEN dari Vercel**:
1. Go to: https://vercel.com/dashboard
2. Pilih project
3. Settings → Blob
4. Generate token

Simpan file: Press `Ctrl+X` → `Y` → `Enter`

### 3.2 Verify Environment
```bash
cat .env.local  # cek apakah sudah benar
```

---

## Step 4: Install Dependencies

```bash
pnpm install
```

⏳ **Ini akan butuh waktu 5-10 menit tergantung kecepatan internet**

Tunggu sampai selesai dengan status: `done in ...`

---

## Step 5: Build & Test Project

### 5.1 Build for Production
```bash
pnpm build
```

Verifikasi output:
```bash
ls -la .next
```

Harus ada folder `.next` yang berisi build output.

### 5.2 Test Build (Optional)
```bash
# Test apakah build berhasil tanpa error
node -e "console.log('[v0] Build test passed')"
```

---

## Step 6: Setup Database (One-Time)

### 6.1 Test Database Connection
```bash
# Pastikan DATABASE_URL di .env.local sudah benar
node -e "
const url = process.env.DATABASE_URL;
if (!url) {
  console.error('[v0] DATABASE_URL not set!');
  process.exit(1);
}
console.log('[v0] Database URL configured:', url.split('@')[1]?.split('/')[0] || 'checking...');
"
```

### 6.2 Generate & Push Database Schema
```bash
pnpm db:push
```

Ini akan:
- Generate migrations dari schema
- Push semua tables ke Neon database
- Buat indexes & relationships

**Output yang diharapkan**:
```
✓ Tables created
✓ Migrations applied
✓ Database ready
```

---

## Step 7: Run Server di Termux

### 7.1 Start Development Server
```bash
pnpm start
```

Output yang benar:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### 7.2 Test Server (Open New Termux Tab)
```bash
# Tab baru - jangan close tab server!
curl http://localhost:3000
```

Harus return HTML content (jika berhasil).

### 7.3 Access dari Browser Smartphone Lain
```
Ketahui IP Address Termux:
```bash
# Di terminal Termux yang runningnya:
hostname -I
```

Output: `192.168.x.x`

Akses dari browser smartphone lain:
```
http://192.168.x.x:3000
```

---

## Step 8: Keep Server Running 24/7

### Opsi 1: Gunakan `tmux` (Recommended)
```bash
# Install tmux
pkg install tmux -y

# Create session
tmux new-session -d -s forum "cd /home/your-username/anti-penyimpangan-forum && pnpm start"

# List sessions
tmux list-sessions

# Attach jika ingin lihat logs
tmux attach-session -t forum

# Detach: Ctrl+B kemudian D
```

### Opsi 2: Gunakan `nohup` (Simpler)
```bash
nohup pnpm start > server.log 2>&1 &
echo $! > server.pid  # save PID

# Lihat logs:
tail -f server.log

# Stop server:
kill $(cat server.pid)
```

### Opsi 3: Gunakan PM2 (Most Reliable)
```bash
# Install PM2 globally
npm install -g pm2

# Start server with PM2
pm2 start "pnpm start" --name "forum-api"

# View logs
pm2 logs forum-api

# Keep PM2 running on startup (for Linux/VPS, kurang relevant untuk Termux)
pm2 startup
pm2 save
```

---

## Step 9: Monitoring & Logs

### 9.1 View Real-time Logs
```bash
# Jika pakai tmux
tmux capture-pane -t forum -p

# Jika pakai nohup
tail -f server.log

# Jika pakai PM2
pm2 logs forum-api
```

### 9.2 Check Server Status
```bash
# Test koneksi ke database
curl -X GET http://localhost:3000/api/posts

# Harus return JSON response atau error message
```

### 9.3 Monitor Disk Space
```bash
df -h
# Database Neon tidak consume local storage (cloud-based)
# Hanya .next build files dan node_modules yang pakai storage
```

---

## Step 10: Update & Maintenance

### 10.1 Pull Latest Changes dari GitHub
```bash
git pull origin main
```

### 10.2 Reinstall Dependencies (jika ada yang berubah)
```bash
pnpm install
```

### 10.3 Rebuild & Restart
```bash
pnpm build

# Stop server (Ctrl+C) di tab yang runningnya
# Atau: kill $(cat server.pid)

# Start ulang:
pnpm start
```

---

## Troubleshooting di Termux

### Error 1: "node: command not found"
```bash
# Reinstall Node.js
pkg install nodejs -y
```

### Error 2: "DATABASE_URL not set"
```bash
# Pastikan .env.local sudah benar:
cat .env.local | grep DATABASE_URL

# Jika kosong, edit lagi:
nano .env.local
```

### Error 3: "Cannot find module X"
```bash
# Clear cache dan reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Error 4: "Port 3000 already in use"
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 PID
```

### Error 5: "Out of memory"
Ini adalah issue Termux. Solusi:
```bash
# Close other apps
# Reduce build size:
# Atau pakai cloud server sebagai alternatif
```

### Error 6: Koneksi ke Neon timeout
```bash
# Check internet connection
ping google.com

# Pastikan DATABASE_URL benar dan Neon accessible
# Coba ping Neon server:
ping neon.tech
```

---

## Network Setup: Akses dari Luar Smartphone

Jika ingin akses server Termux dari device lain:

### Opsi 1: Same WiFi Network (Recommended)
- Smartphone & device harus 1 WiFi yang sama
- Cari IP: `hostname -I`
- Akses: `http://192.168.x.x:3000`

### Opsi 2: Port Forwarding (Advanced)
- Forward port 3000 dari router ke Termux device
- Perlu static IP
- Perlu domain atau no-ip.com

### Opsi 3: Cloudflare Tunnel (Recommended untuk Publik)
```bash
# Download Cloudflare Tunnel untuk Termux (limited support)
# Atau gunakan alternative: ngrok

# Install ngrok
npm install -g ngrok

# Expose server
ngrok http 3000

# Akan dapat public URL: https://xxxx-xxxx-xxxx.ngrok.io
```

---

## Custom Domain Setup

Untuk custom domain `anti-penyimpangan.lombok26.biz.id`:

### Opsi 1: Pakai DNS Dynamic
1. Daftar di no-ip.com atau duckdns.org
2. Setup dynamic DNS di DNS provider Anda
3. Point domain ke Termux IP

### Opsi 2: Pakai Cloudflare Tunnel
1. Install Cloudflare Tunnel di Termux
2. Create tunnel pointing to localhost:3000
3. Point domain ke Cloudflare

### Opsi 3: Pakai ngrok (Simplest)
```bash
ngrok http 3000
# Akan dapat public URL
# Hanya buat testing, ngrok URLs change setiap restart
```

---

## Performance Optimization untuk Termux

### 1. Reduce Memory Usage
```bash
# Set Node memory limit
export NODE_OPTIONS="--max-old-space-size=256"
```

### 2. Optimize Build Size
```bash
# Build optimized version
NODE_ENV=production pnpm build
```

### 3. Disable Unnecessary Middleware
```bash
# Edit next.config.js untuk disable unused features
```

### 4. Cache Strategy
- Enable browser caching
- Database query caching via Redis (jika ada)
- Static asset caching

---

## Comparison: Termux vs Cloud Server

| Feature | Termux | Cloud (Recommended) |
|---------|--------|-------------------|
| Cost | Free (tapi electricity) | Free tier ada (Railway, Render) |
| Reliability | 60-70% (manual management) | 99.9% SLA |
| Uptime | Depend on you | Always on |
| Performance | Slow (limited CPU) | Fast |
| Storage | Limited | Scalable |
| Maintenance | Manual | Automated |
| Smartphone Battery | ❌ Drains fast | ✅ N/A |
| Best For | Development/Testing | Production |

**Rekomendasi**: Gunakan Termux untuk development/testing. Untuk production, gunakan:
- **Railway** (best free tier)
- **Render** (simple deployment)
- **Vercel** (best for Next.js, bisa free tier)

---

## Scripts Helpful

Simpan ini sebagai `server-start.sh`:
```bash
#!/bin/bash
export NODE_OPTIONS="--max-old-space-size=256"
export DATABASE_URL="postgresql://..."  # from .env.local
cd /home/your-username/anti-penyimpangan-forum
pnpm start
```

Jalankan:
```bash
chmod +x server-start.sh
./server-start.sh
```

---

## Support & References

- Termux Wiki: https://wiki.termux.com
- Node.js Docs: https://nodejs.org/docs
- Next.js Server: https://nextjs.org/docs/app/api-reference/cli
- Neon Docs: https://neon.tech/docs
- ngrok Docs: https://ngrok.com/docs

---

## Kesimpulan

Setup forum di Termux adalah **POSSIBLE tapi NOT RECOMMENDED** untuk production karena:
1. Resource terbatas
2. Tidak reliable 24/7
3. Menguras baterai
4. Manual maintenance

**Gunakan hanya untuk**:
- Development & Testing
- Learning purpose
- Demo lokal

**Untuk Production**: Gunakan cloud server seperti Railway atau Vercel yang free tier dan mudah setup.

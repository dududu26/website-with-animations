# Panduan Deployment Forum Anti Penyimpangan

## Quick Start Deployment ke Vercel

### 1. Persiapan

Pastikan Anda memiliki:
- GitHub account
- Vercel account
- Neon PostgreSQL database URL
- Vercel Blob token

### 2. Push ke GitHub

```bash
git init
git add .
git commit -m "Initial commit: Forum Anti Penyimpangan"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/anti-penyimpangan.git
git push -u origin main
```

### 3. Deploy ke Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. Buka [vercel.com](https://vercel.com)
2. Klik "New Project"
3. Select GitHub repository "anti-penyimpangan"
4. Vercel akan auto-detect Next.js
5. Klik "Import" dan setup environment variables

#### Option B: Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

### 4. Setup Environment Variables di Vercel

Di Vercel dashboard → Project Settings → Environment Variables, tambahkan:

```
DATABASE_URL = postgresql://...@your-neon-db
BETTER_AUTH_SECRET = your-secret-key-here
BETTER_AUTH_URL = https://anti-penyimpangan.lombok26.biz.id
BLOB_READ_WRITE_TOKEN = your-vercel-blob-token
NEXT_PUBLIC_APP_URL = https://anti-penyimpangan.lombok26.biz.id
```

**Cara generate BETTER_AUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 5. Setup Custom Domain

1. Di Vercel dashboard → Project Settings → Domains
2. Klik "Add Domain"
3. Masukkan: `anti-penyimpangan.lombok26.biz.id`
4. Pilih DNS provider Anda
5. Update DNS records sesuai instruksi Vercel:
   - Type: CNAME
   - Name: anti-penyimpangan
   - Value: cname.vercel-dns.com

**Jika menggunakan domain registrar (GoDaddy, Niagahoster, etc):**
1. Login ke dashboard domain registrar
2. Cari DNS management
3. Tambah CNAME record:
   - Subdomain: anti-penyimpangan
   - Value: cname.vercel-dns.com
4. Tunggu propagasi DNS (5-48 jam)

### 6. Database Setup

Setelah environment variables di-set, Vercel akan auto-run migrations saat deployment.

Jika perlu manual setup:

```bash
# Dengan Neon CLI
neon connection-string main > DATABASE_URL
pnpm db:push

# Atau via Vercel
vercel env pull .env.local
pnpm db:push
```

### 7. Verify Deployment

1. Buka https://anti-penyimpangan.lombok26.biz.id
2. Coba daftar akun
3. Coba buat postingan
4. Coba upload file
5. Cek console untuk errors

## Post-Deployment

### Monitoring

- **Vercel Dashboard**: View logs, deployments, analytics
- **Neon Dashboard**: Check database queries, backups
- **Error Tracking**: Setup error logging (optional)

### Updates & Maintenance

```bash
# Pull latest changes
git pull origin main

# Local testing
pnpm dev

# Push updates
git add .
git commit -m "Update: description"
git push origin main

# Vercel auto-deploys dari main branch
```

### Database Backups

Neon automatically backs up your database. Di Neon dashboard:
1. Go to Backups
2. Create manual backup sebelum big changes
3. Restore dari backup jika diperlukan

## Troubleshooting

### Error: DATABASE_URL is not set
→ Pastikan DATABASE_URL ada di Vercel environment variables

### Error: BETTER_AUTH_SECRET is not set
→ Generate baru: `openssl rand -base64 32` dan update di Vercel

### IP check tidak bekerja
→ IP mungkin kosong di test environment. Coba dari public network.

### File upload gagal
→ Cek BLOB_READ_WRITE_TOKEN di Vercel
→ Verify Vercel Blob storage sudah di-enable di project

### Domain tidak resolve
→ Tunggu 24-48 jam untuk DNS propagation
→ Verifikasi CNAME record di DNS provider
→ Clearkan cache browser (Ctrl+Shift+Del)

### Database connection timeout
→ Cek DATABASE_URL format
→ Verify Neon project active (tidak di suspend)
→ Check network access rules di Neon dashboard

## Performance Tips

1. **Enable Caching**: Vercel Edge Caching untuk static content
2. **Optimize Images**: Use Next.js Image component
3. **Database Indexes**: Sudah configured di schema
4. **Rate Limiting**: Recommend untuk API endpoints

## Security Checklist

- [ ] BETTER_AUTH_SECRET: Strong & unique
- [ ] DATABASE_URL: Use production database
- [ ] BLOB tokens: Restricted permissions only
- [ ] Enable HTTPS: Automatic via Vercel
- [ ] Security headers: Configured di vercel.json
- [ ] IP validation: Active untuk prevent multi-accounts
- [ ] Soft deletes: Implemented untuk data safety

## Scale to Production

### Untuk traffic tinggi:

1. **Database**: Upgrade Neon compute size
2. **Cache**: Add Redis (Upstash)
3. **CDN**: Vercel Edge middleware
4. **Monitor**: Setup error tracking (Sentry)
5. **Backup**: Daily backups ke storage

### Load Testing:

```bash
# Simple load test
ab -n 1000 -c 10 https://anti-penyimpangan.lombok26.biz.id/
```

## Support & Help

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Neon Docs**: https://neon.tech/docs
- **Better Auth**: https://authjs.dev

---

Deployment complete! Forum Anda siap untuk komunitas.

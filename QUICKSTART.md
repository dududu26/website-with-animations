# Quick Start Guide - Forum Anti Penyimpangan

**Panduan tercepat untuk setup & deploy forum Anda!**

## 5 Menit Setup

### 1. Install Dependencies (1 menit)

```bash
cd /path/to/anti-penyimpangan
pnpm install
```

### 2. Setup Environment (2 menit)

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL=postgresql://your-neon-db-url
BETTER_AUTH_SECRET=openssl-rand-base64-32-here
BETTER_AUTH_URL=http://localhost:3000
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

**Cara dapat credentials:**

| Variable | Cara Dapat |
|----------|-----------|
| DATABASE_URL | https://neon.tech → Create DB → Copy connection string |
| BETTER_AUTH_SECRET | Run: `openssl rand -base64 32` |
| BLOB_READ_WRITE_TOKEN | https://vercel.com → Settings → Blob → Generate token |

### 3. Run Development Server (2 menit)

```bash
pnpm dev
```

Buka: http://localhost:3000

**Fitur Aktif:**
- ✅ Forum dengan posts
- ✅ Comments & replies  
- ✅ File uploads
- ✅ Reactions
- ✅ User dashboard
- ✅ Beautiful animations

## Deploy ke Vercel (5 Menit)

### 1. Push ke GitHub

```bash
git init
git add .
git commit -m "Forum Anti Penyimpangan v1.0.0"
git remote add origin https://github.com/YOUR_USERNAME/repo-name
git push -u origin main
```

**Butuh help?** → Lihat `GITHUB_SETUP.md`

### 2. Connect ke Vercel

1. Buka https://vercel.com/dashboard
2. Click "New Project" → Select GitHub repo
3. Set environment variables (dari .env.example)
4. Click "Deploy"

**Done!** Aplikasi live dalam 2-3 menit 🎉

### 3. Setup Custom Domain (Optional)

1. Di Vercel: Project Settings → Domains → Add Domain
2. Input: `anti-penyimpangan.lombok26.biz.id`
3. Configure DNS di domain registrar Anda
4. Wait 24-48 jam untuk propagation

See `DEPLOYMENT.md` untuk detailed steps.

## Testing

### Register & Login

1. Buka aplikasi
2. Klik "Daftar"
3. Create account (setiap IP hanya bisa 1 akun!)
4. Login dengan email & password

### Create Post

1. Dari home, klik "Buat Postingan Baru"
2. Tulis judul & konten
3. (Optional) Upload file (PDF, Word, Excel, etc)
4. Click "Buat Postingan"

### Comment & React

1. Buka post apapun
2. Add comment di section bawah
3. Click emoji reaction (👍 ❤️ 🤩 😢 😠)
4. Reply ke komentar orang

## File Structure Overview

```
anti-penyimpangan/
├── app/              # Pages & API routes
├── components/       # React components
├── lib/              # Database & utilities
├── hooks/            # Custom React hooks
├── public/           # Static assets
└── docs/             # Documentation
```

## Key Commands

```bash
# Development
pnpm dev              # Start dev server (port 3000)
pnpm build            # Build untuk production
pnpm start            # Run production build

# Database
pnpm db:push          # Update database schema
pnpm db:generate      # Generate migrations
pnpm db:studio        # Open Drizzle Studio

# Code
pnpm lint             # Check for linting errors
pnpm format           # Format code (if configured)
```

## Troubleshooting

### Database Connection Error
```
Error: DATABASE_URL is not set
```
→ Pastikan `.env.local` ada dan DATABASE_URL diisi

### Cannot find module error
```
Error: Cannot find module 'date-fns'
```
→ Run: `pnpm install`

### Port 3000 already in use
```bash
pnpm dev --port 3003
```

### IP validation not working
→ Pastikan request dari public IP (tidak localhost)

### File upload fails
→ Cek BLOB_READ_WRITE_TOKEN di .env.local

## Architecture Overview

```
User Browser
    ↓
Next.js Frontend (React)
    ↓
Next.js API Routes
    ↓
Database (PostgreSQL/Neon)
    ↓
File Storage (Vercel Blob)
```

## Security Checklist

- [x] IP validation (1 IP = 1 account)
- [x] Password hashing (bcrypt)
- [x] SQL injection prevention (Drizzle ORM)
- [x] CSRF protection (Next.js built-in)
- [x] File upload validation
- [x] Secure session management

## Performance Features

- ✅ Mobile-first responsive design
- ✅ Smooth animations (Framer Motion)
- ✅ Database indexing
- ✅ Paginated content
- ✅ Optimized images
- ✅ Edge caching

## Next Steps

1. ✅ Local development
2. ✅ GitHub repository
3. ✅ Vercel deployment
4. ⬜ Custom domain (optional)
5. ⬜ Monitor & maintain

**Lihat dokumentasi lengkap:**
- `README.md` - Feature overview & setup
- `DEPLOYMENT.md` - Production deployment guide
- `PROJECT_SUMMARY.md` - Architecture & tech stack
- `GITHUB_SETUP.md` - GitHub repository setup

## Features Checklist

### Authentication
- [x] Register with email/password
- [x] Login
- [x] Logout
- [x] IP validation (prevent multi-account)
- [x] Session management

### Forum Posts
- [x] Create post
- [x] Edit own post
- [x] Delete own post
- [x] View all posts
- [x] Pagination

### Comments
- [x] Add comment
- [x] Reply to comment (nested)
- [x] Edit own comment
- [x] Delete own comment
- [x] Thread view

### File Management
- [x] Upload file to post
- [x] Download file
- [x] Delete attachment
- [x] File type validation
- [x] Size limits (10MB/file)

### Reactions
- [x] Like (👍)
- [x] Love (❤️)
- [x] Wow (🤩)
- [x] Sad (😢)
- [x] Angry (😠)
- [x] Real-time updates

### User Dashboard
- [x] View own posts
- [x] Statistics
- [x] Manage content

### UI/UX
- [x] Mobile responsive
- [x] Modern animations
- [x] Dark mode ready
- [x] Accessible
- [x] Fast loading

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Framer Motion |
| **Backend** | Next.js Server Actions |
| **Database** | PostgreSQL (Neon) |
| **ORM** | Drizzle |
| **Auth** | Better Auth |
| **Storage** | Vercel Blob |
| **Hosting** | Vercel |

## Getting Help

### Documentation
- Project docs: See markdown files in root
- Next.js: https://nextjs.org/docs
- Neon: https://neon.tech/docs
- Tailwind: https://tailwindcss.com/docs

### Community
- GitHub Issues: Report bugs
- GitHub Discussions: Ask questions
- Vercel Docs: Deployment help

## Common Pitfalls

❌ **Don't:**
- Push `.env.local` to GitHub
- Use localhost IP for testing
- Forget to set BETTER_AUTH_SECRET
- Skip database URL configuration

✅ **Do:**
- Keep `.env.local` in `.gitignore` (already done)
- Test from actual IP or staging environment
- Generate strong BETTER_AUTH_SECRET
- Test database connection before deploy

## License

MIT License - Free to use, modify, and distribute

---

**Questions?** Check documentation files atau open GitHub issue.

**Ready to deploy?** Go to `DEPLOYMENT.md` for production setup!

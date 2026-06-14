# Forum Anti Penyimpangan - Ringkasan Proyek

## Overview

Forum komunitas "ANTI PENYIMPANGAN" adalah platform modern untuk berbagi, melaporkan, dan mendiskusikan isu-isu anti korupsi dan penyimpangan. Aplikasi ini dibangun dengan teknologi terkini, responsive design, dan security best practices.

**Domain**: https://anti-penyimpangan.lombok26.biz.id  
**Port Development**: 3000 (bisa dikonfigurasi ke 3003)  
**Database**: Neon PostgreSQL  
**Hosting**: Vercel

## Fitur Utama

### 1. Autentikasi & Registrasi
- Register dengan email & password
- Login dengan IP address validation
- **Sistem IP unik**: 1 IP address = 1 akun maksimal (prevent multi-account abuse)
- Session management dengan Better Auth
- Secure password hashing

### 2. Forum Posting
- Buat postingan dengan judul & konten
- Edit & hapus postingan milik sendiri (soft delete)
- View postingan orang lain
- Pagination untuk list postingan
- Meta info: author, waktu posting, last update

### 3. Sistem Komentar
- Nested comments (komentar & reply)
- Edit & hapus komentar sendiri
- Reply ke komentar orang lain
- Thread view yang terstruktur

### 4. File Management
- Upload file ke postingan (PDF, Word, Excel, txt, zip, images)
- Max 10MB per file, 50MB per postingan
- Download file yang di-upload
- Hapus file milik postingan Anda
- File storage: Vercel Blob (secure & scalable)

### 5. Reaksi Postingan & Komentar
- Multiple reaction types: Like (👍), Love (❤️), Wow (🤩), Sad (😢), Angry (😠)
- Real-time reaction updates
- Toggle reactions (click for add, click again for remove)
- Reaction counter

### 6. User Dashboard
- View semua postingan Anda
- Quick stats: jumlah postingan, email, status
- Manage content dari satu tempat
- Direct access ke forum

## Arsitektur Teknis

### Frontend Stack
- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 dengan design tokens
- **Animations**: Framer Motion (smooth transitions & hover effects)
- **UI Components**: shadcn/ui
- **Form**: HTML5 + Zod validation
- **Date Formatting**: date-fns (Indonesian locale)

### Backend Stack
- **Runtime**: Node.js (Next.js Server)
- **API**: Next.js Route Handlers & Server Actions
- **Authentication**: Better Auth + Neon Auth
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM (type-safe, lightweight)
- **File Storage**: Vercel Blob
- **Validation**: Zod

### Database Schema

**Core Tables** (10 total):
- `user` - User accounts (from Better Auth)
- `user_ip` - IP tracking (enforce 1 IP = 1 account)
- `session` - User sessions
- `account` - OAuth accounts (future support)
- `verification` - Email verification
- `post` - Forum postings
- `post_attachment` - File uploads
- `comment` - Nested comments
- `post_reaction` - Post reactions
- `comment_reaction` - Comment reactions

**Relationships**:
- User 1→Many Posts
- User 1→Many Comments
- User 1→Many Reactions
- Post 1→Many Comments
- Post 1→Many Attachments
- Comment 1→Many Replies (self-referencing)

## File Structure

```
anti-penyimpangan/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── posts/             # Forum posts endpoints
│   │   ├── comments/          # Comments endpoints
│   │   ├── reactions/         # Reactions endpoints
│   │   └── files/             # File management endpoints
│   ├── auth/                  # Auth pages (login, register)
│   ├── forum/                 # Forum pages
│   │   ├── new/               # Create post page
│   │   └── [id]/              # Post detail page
│   ├── dashboard/             # User dashboard
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home/forum listing
│   └── globals.css            # Global styles & design tokens
├── components/
│   ├── navbar.tsx             # Navigation component
│   ├── post-card.tsx          # Post card component
│   ├── comment-section.tsx    # Comments component
│   ├── reaction-button.tsx    # Reaction component
│   ├── file-upload.tsx        # File upload component
│   ├── animated-elements.tsx  # Framer Motion animations
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── auth.ts                # Better Auth config
│   ├── db.ts                  # Drizzle DB client
│   ├── schema.ts              # Database schema
│   ├── ip-validator.ts        # IP validation logic
│   ├── blob.ts                # Vercel Blob utilities
│   └── utils.ts               # Utility functions
├── hooks/
│   └── use-session.ts         # Session hook
├── db/
│   └── migrations/            # Generated migrations
├── .env.example               # Environment variables template
├── drizzle.config.ts          # Drizzle ORM config
├── vercel.json                # Vercel deployment config
├── tsconfig.json              # TypeScript config
├── package.json               # Dependencies & scripts
├── README.md                  # Main documentation
├── DEPLOYMENT.md              # Deployment guide
└── PROJECT_SUMMARY.md         # This file
```

## Pages & Routes

### Public Pages
- `/` - Forum listing (home page)
- `/auth/login` - Login page
- `/auth/register` - Register page

### Protected Pages
- `/forum/new` - Create new post
- `/forum/[id]` - Post detail with comments
- `/dashboard` - User dashboard

### API Routes
See README.md untuk lengkap API documentation.

## Design System

### Color Palette
- **Primary**: Deep Blue (#0B5BA8) - Brand color
- **Secondary**: Medium Blue (#5A8FC4) - Accent
- **Accent**: Teal (#4AA097) - Highlights
- **Neutral**: White, Grays, Black
- **Total**: 5 colors (following design guidelines)

### Typography
- **Font**: Geist Sans (primary), Geist Mono (code)
- **Body**: 16px, leading-6 (line-height: 1.5)
- **Heading**: Bold variants
- **Total**: 2 font families (clean & consistent)

### Layout
- **Mobile-First**: Responsive design dari mobile ke desktop
- **Max-width**: 1024px (4xl container)
- **Spacing**: Tailwind spacing scale (consistent gaps)
- **Animations**: Smooth transitions (300-500ms)

## Security Features

### 1. IP-Based Account Control
```
- Capture IP pada registration
- Prevent: Multiple accounts dari same IP
- Uniqueness: One IP address = one user max
- Use case: Prevent abuse, sockpuppets, duplicate accounts
```

### 2. Authentication & Session
```
- Better Auth: Industry-standard session management
- Password: bcrypt hashing (automatic)
- CSRF: Built-in via Next.js
- Session: Secure HTTP-only cookies
```

### 3. Database Security
```
- Drizzle ORM: Prevent SQL injection (prepared statements)
- Soft delete: No permanent data loss
- Row-level: User-scoped queries (can only access own data)
- Indexes: Optimized for query performance
```

### 4. File Upload Security
```
- Type validation: Whitelist MIME types
- Size limits: 10MB per file, 50MB per post
- Storage: Vercel Blob (secure, encrypted)
- Access: Only authenticated users
```

### 5. HTTP Security Headers
```
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY (prevent clickjacking)
- X-XSS-Protection: Enabled
- Content-Security-Policy: Recommended for production
```

## Development Workflow

### Local Development
```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local
# Edit .env.local dengan credentials Anda

# Start dev server
pnpm dev
# Open http://localhost:3000
```

### Database Management
```bash
# Push schema changes
pnpm db:push

# Generate new migrations
pnpm db:generate

# Studio (visual DB browser)
pnpm db:studio
```

### Build & Test
```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## Deployment Process

### Step 1: GitHub Setup
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/user/repo
git push -u origin main
```

### Step 2: Vercel Deployment
- Connect GitHub repo di vercel.com
- Set environment variables
- Deploy (auto-deploy on push)

### Step 3: Domain Setup
- Add custom domain via Vercel
- Configure DNS CNAME record
- Wait for propagation (24-48 hours)

See **DEPLOYMENT.md** untuk detailed instructions.

## Performance Metrics

### Target Metrics
- **FCP** (First Contentful Paint): < 1.5s
- **LCP** (Largest Contentful Paint): < 2.5s
- **CLS** (Cumulative Layout Shift): < 0.1
- **FID** (First Input Delay): < 100ms
- **INP** (Interaction to Next Paint): < 200ms

### Optimizations
- Static rendering untuk public pages
- Image optimization (Next.js Image)
- Database indexing pada frequently-queried fields
- Edge caching untuk API responses
- Lazy loading untuk comments

## Scaling Considerations

### For Growth
- **Database**: Upgrade Neon compute tiers
- **Cache**: Add Redis untuk session/reactions
- **CDN**: Vercel Edge middleware
- **Monitoring**: Sentry untuk error tracking
- **Backup**: Daily backups ke S3/GCS

### For High Traffic
- Rate limiting pada API endpoints
- Request deduplication untuk file uploads
- Pagination limits (10-50 posts per page)
- Connection pooling di database

## Known Limitations & Future Enhancements

### Current Limitations
- No real-time notifications (websockets)
- No full-text search
- No user mentions/tags
- No admin dashboard
- No spam detection

### Planned Features (v1.1+)
- Real-time notifications via WebSockets
- Full-text search dengan Elasticsearch
- User mentions & user tagging
- Admin moderation tools
- Email notifications
- User reputation system
- Content moderation queue

## Support & Maintenance

### Regular Maintenance
- Check Vercel deployment logs weekly
- Monitor database usage (Neon dashboard)
- Update dependencies monthly
- Backup database before major changes
- Test file uploads regularly

### Bug Reporting
- Create GitHub issues untuk bugs
- Include error logs & reproduction steps
- Expected vs actual behavior

### Security Updates
- Review dependency vulnerabilities
- Apply security patches immediately
- Keep Next.js & dependencies updated

## Cost Breakdown (Approximate)

| Service | Free Tier | Paid |
|---------|-----------|------|
| **Vercel** | 100 GB bandwidth/mo | ~$20/mo |
| **Neon** | 3 GB storage | ~$15/mo |
| **Vercel Blob** | 100 GB storage | ~$0.50/GB |
| **Better Auth** | Free (self-hosted) | N/A |
| **Total (estimate)** | Covered by free tiers | ~$35-50/mo |

## License & Attribution

- **Project**: MIT License
- **Next.js**: MIT License  
- **shadcn/ui**: MIT License
- **Tailwind CSS**: MIT License
- **Framer Motion**: MIT License

## Contact & Support

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Security**: security@example.com

---

**Last Updated**: 2026  
**Version**: 1.0.0  
**Status**: Production Ready

# Forum Anti Penyimpangan

Platform forum komunitas untuk berbagi, melaporkan, dan mendiskusikan isu-isu anti penyimpangan dan korupsi.

## Fitur

- **Autentikasi & Registrasi**: Sistem user management dengan validasi IP address (1 IP = 1 akun)
- **Forum Posting**: Buat, edit, dan hapus postingan dengan konten lengkap
- **Komentar Bersarang**: Sistem komentar dengan dukungan reply/balasan bertingkat
- **Upload File**: Upload dan download file attachment (PDF, Word, Excel, dsb)
- **Reaksi Postingan**: Berbagai jenis reaksi (Like, Love, Wow, Sad, Angry)
- **Dashboard User**: Kelola postingan dan aktivitas Anda
- **Design Mobile-First**: Interface responsif dan elegan untuk semua perangkat
- **Animasi Modern**: Smooth transitions dan interactive elements dengan Framer Motion

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js Server Actions & API Routes
- **Database**: Neon PostgreSQL + Drizzle ORM
- **Auth**: Better Auth (Neon Auth)
- **Storage**: Vercel Blob
- **Animations**: Framer Motion

## Setup

### Prerequisites

- Node.js 18+ (atau pnpm/npm/yarn)
- PostgreSQL database (Neon recommended)
- Vercel account (untuk deployment)

### Installation

1. Clone repository:
```bash
git clone <repository-url>
cd anti-penyimpangan
```

2. Install dependencies:
```bash
pnpm install
```

3. Setup environment variables:
```bash
cp .env.example .env.local
```

Isi environment variables:
- `DATABASE_URL`: PostgreSQL connection string dari Neon
- `BETTER_AUTH_SECRET`: Generate dengan `openssl rand -base64 32`
- `BETTER_AUTH_URL`: URL aplikasi Anda
- `BLOB_READ_WRITE_TOKEN`: Token dari Vercel Blob

4. Setup database:
```bash
# Drizzle akan auto-create tables saat pertama kali
pnpm dev
```

5. Run development server:
```bash
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## Database Schema

### Core Tables
- **users**: User account dengan IP tracking
- **user_ips**: Track IP address per user
- **posts**: Forum postings
- **post_attachments**: File uploads
- **comments**: Nested comments/replies
- **post_reactions**: Post reactions (like, love, etc)
- **comment_reactions**: Comment reactions
- **sessions**: User sessions
- **accounts**: OAuth accounts (for future)
- **verifications**: Email verifications

## API Routes

### Auth
- `POST /api/auth/sign-up/email` - Register user
- `POST /api/auth/sign-in/email` - Login user
- `POST /api/auth/sign-out` - Logout
- `POST /api/auth/check-ip` - Validate IP availability

### Posts
- `GET /api/posts` - List posts (paginated)
- `POST /api/posts` - Create post
- `GET /api/posts/[id]` - Get post detail
- `PUT /api/posts/[id]` - Update post
- `DELETE /api/posts/[id]` - Delete post

### Comments
- `GET /api/comments?postId=...` - List comments
- `POST /api/comments` - Create comment
- `PUT /api/comments/[id]` - Update comment
- `DELETE /api/comments/[id]` - Delete comment

### Reactions
- `GET /api/reactions?type=post&targetId=...` - Get reactions
- `POST /api/reactions` - Add/remove reaction

### Files
- `POST /api/files/upload` - Upload file
- `GET /api/files/[postId]` - List attachments
- `POST /api/files/[postId]` - Add attachment to post
- `DELETE /api/files/[postId]` - Delete attachment

## Pages

- `/` - Home/Forum listing
- `/forum/new` - Create new post
- `/forum/[id]` - Post detail with comments
- `/auth/login` - Login page
- `/auth/register` - Register page
- `/dashboard` - User dashboard

## Deployment

### Deploy ke Vercel

1. Push ke GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Connect ke Vercel:
   - Buka [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select GitHub repository
   - Configure environment variables
   - Deploy!

### Custom Domain

1. Di Vercel dashboard, go to project settings
2. Domains → Add custom domain
3. Add `anti-penyimpangan.lombok26.biz.id`
4. Update DNS records sesuai instruksi Vercel

## Security Notes

- IP validation mencegah multiple accounts dari IP yang sama
- Soft delete untuk posts dan comments (tidak permanent delete)
- Row-level data access control
- Secure password hashing dengan Better Auth
- File upload validation & size limits

## Contributing

Contributions welcome! Please follow the existing code style dan conventions.

## License

MIT License

## Support

Untuk bantuan atau pertanyaan, silakan buka GitHub issue atau hubungi tim development.

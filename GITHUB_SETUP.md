# Setup GitHub Repository untuk Forum Anti Penyimpangan

Panduan lengkap untuk push project ke GitHub dan configure untuk deployment.

## Step 1: Create GitHub Repository

### Option A: Via GitHub Web

1. Buka https://github.com/new
2. Nama repository: `anti-penyimpangan-forum` (atau nama pilihan Anda)
3. Description: `Forum komunitas anti penyimpangan`
4. Private atau Public (recommend: Public untuk open source)
5. **Jangan** initialize dengan README, .gitignore, atau license (kami sudah punya)
6. Klik "Create repository"

### Option B: Via GitHub CLI

```bash
gh repo create anti-penyimpangan-forum \
  --public \
  --description "Forum komunitas anti penyimpangan" \
  --source=. \
  --remote=origin \
  --push
```

## Step 2: Initialize Git Locally

Jika belum ada git repo:

```bash
cd /path/to/anti-penyimpangan
git init
```

## Step 3: Add Remote & Push

```bash
# Add GitHub sebagai remote
git remote add origin https://github.com/YOUR_USERNAME/anti-penyimpangan-forum.git

# Verify remote
git remote -v
# Output:
# origin  https://github.com/YOUR_USERNAME/anti-penyimpangan-forum.git (fetch)
# origin  https://github.com/YOUR_USERNAME/anti-penyimpangan-forum.git (push)
```

## Step 4: Commit & Push

```bash
# Stage semua files
git add .

# Commit initial
git commit -m "Initial commit: Forum Anti Penyimpangan v1.0.0

- Complete forum platform dengan auth & IP validation
- Nested comments & file uploads
- Framer Motion animations & modern UI
- Database schema dengan Drizzle ORM
- Ready untuk deployment ke Vercel"

# Push ke main branch
git branch -M main  # Rename default branch ke 'main' jika perlu
git push -u origin main
```

## Step 5: Verify GitHub

1. Refresh https://github.com/YOUR_USERNAME/anti-penyimpangan-forum
2. Verifikasi:
   - Semua files ada
   - Proper folder structure
   - README.md terlihat
   - .env.example ada (tapi tidak .env.local!)

## Step 6: Configure GitHub Settings (Optional tapi Recommended)

### Branch Protection

1. Settings → Branches
2. Add rule untuk `main` branch
3. Enable:
   - Require pull request reviews
   - Dismiss stale pull request approvals
   - Include administrators

### GitHub Actions (CI/CD)

Untuk auto-test setiap push (optional):

1. Buat file `.github/workflows/test.yml`:

```yaml
name: Test & Build

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Type check
        run: pnpm exec tsc --noEmit
      
      - name: Build
        run: pnpm build
```

2. Push file ini:

```bash
git add .github/workflows/test.yml
git commit -m "Add GitHub Actions workflow"
git push
```

## Step 7: Setup Vercel Deployment

Sekarang GitHub repo siap untuk Vercel:

1. Buka https://vercel.com/dashboard
2. Klik "New Project"
3. Select "Import Git Repository"
4. Paste GitHub URL atau select dari account Anda
5. Configure:
   - **Project Name**: anti-penyimpangan-forum
   - **Root Directory**: ./ (default)
   - **Framework**: Next.js (auto-detected)
   - **Build Command**: `pnpm run build` (default)

6. Add Environment Variables di Vercel:
   - DATABASE_URL
   - BETTER_AUTH_SECRET
   - BETTER_AUTH_URL
   - BLOB_READ_WRITE_TOKEN
   - NEXT_PUBLIC_APP_URL

7. Klik "Deploy"!

## Ongoing Development

### Pull Latest Changes

```bash
git pull origin main
```

### Make Changes

```bash
# Edit files...

# Stage changes
git add .

# Commit
git commit -m "Feature: Add XYZ functionality"

# Push
git push origin main
```

**Vercel auto-deploys setelah push!**

### Create Feature Branches (Best Practice)

Untuk feature development:

```bash
# Create & switch ke feature branch
git checkout -b feature/add-search-functionality

# Make changes & commit
git add .
git commit -m "Add search feature"

# Push branch
git push origin feature/add-search-functionality
```

Vercel auto-creates preview deployment untuk setiap branch!

Kemudian buat Pull Request di GitHub untuk merge ke main.

## Troubleshooting

### Error: Permission denied (publickey)

Solution - Setup SSH key:

```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
# Follow prompts

# Add key ke ssh-agent
ssh-add ~/.ssh/id_ed25519

# Add public key ke GitHub
# GitHub Settings → SSH and GPG keys → New SSH key
cat ~/.ssh/id_ed25519.pub
```

Lalu update remote URL:

```bash
git remote set-url origin git@github.com:YOUR_USERNAME/anti-penyimpangan-forum.git
```

### Error: Repository not found

Causes:
- Wrong repository name
- Private repo without access
- Authentication issue

Solution:
```bash
git remote -v  # Check remote URL
git remote set-url origin <correct-url>
```

### Error: Everything up-to-date

Terjadi saat tidak ada changes untuk push:

```bash
git status  # Check status
git log     # See commit history
```

### Large files / .env included

Jika accidentally push .env atau file besar:

```bash
# Remove file dari git (but keep locally)
git rm --cached .env
echo ".env" >> .gitignore

# Commit
git commit -m "Remove .env from tracking"
git push
```

Untuk remove dari history (dangerous - use bfg-repo-cleaner):

```bash
bfg --delete-files .env  # Remove dari semua commits
git push --force
```

## Next Steps

1. ✅ Repository di GitHub
2. ✅ Connected ke Vercel
3. ✅ Environment variables configured
4. ✅ Auto-deployment working

**Selamat! Forum Anda siap untuk produksi!**

Lihat DEPLOYMENT.md untuk detailed production setup dan custom domain configuration.

## Useful GitHub Resources

- **GitHub Docs**: https://docs.github.com
- **Git Tutorial**: https://git-scm.com/book/en/v2
- **SSH Setup**: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
- **Actions**: https://docs.github.com/en/actions

## Support

Jika ada issues:
- Cek GitHub status: https://www.githubstatus.com
- Review commit message format
- Verify remote URL: `git remote -v`
- Check branch: `git branch`

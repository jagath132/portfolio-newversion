# Quick Deployment Reference

## 🚀 Quick Start

### For Admin Console (admin.yourdomain.com)
```bash
npm run build:admin
```
Deploy the `dist` folder with environment variable:
```
VITE_APP_MODE=admin
```

### For Portfolio (yourdomain.com)
```bash
npm run build:portfolio
```
Deploy the `dist` folder with environment variable:
```
VITE_APP_MODE=portfolio
```

## 📋 Vercel Deployment Checklist

### Admin Console Project
- [ ] Create new Vercel project
- [ ] Set Build Command: `npm run build:admin`
- [ ] Set Output Directory: `dist`
- [ ] Add environment variable: `VITE_APP_MODE=admin`
- [ ] Add all Firebase config variables (VITE_FIREBASE_*)
- [ ] Set custom domain: `admin.yourdomain.com`

### Portfolio Project
- [ ] Create new Vercel project
- [ ] Set Build Command: `npm run build:portfolio`
- [ ] Set Output Directory: `dist`
- [ ] Add environment variable: `VITE_APP_MODE=portfolio`
- [ ] Add all Firebase config variables (VITE_FIREBASE_*)
- [ ] Set custom domain: `yourdomain.com`

## 🔑 Required Environment Variables

Both projects need:
```env
VITE_APP_MODE=admin (or portfolio)
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender
VITE_FIREBASE_APP_ID=your_app_id
```

## ✅ Post-Deployment

1. Add domains to Firebase Console:
   - Go to Authentication → Settings → Authorized domains
   - Add: `yourdomain.com` and `admin.yourdomain.com`

2. Test admin access:
   - Visit `https://admin.yourdomain.com/login`
   - Create account or login
   - Verify dashboard loads

3. Test portfolio:
   - Visit `https://yourdomain.com`
   - Verify all sections load correctly

## 🎯 What You Get

**Admin Domain** (`admin.yourdomain.com`):
- `/login` - Admin login
- `/signup` - Create admin account
- `/` - Dashboard (protected)
- `/projects` - Manage projects
- `/experience` - Manage experience
- `/education` - Manage education
- `/skills` - Manage skills

**Portfolio Domain** (`yourdomain.com`):
- `/` - Your full portfolio site
- No admin access (security)

## 💡 Pro Tips

1. **Use the same repository** for both deployments - just different build commands
2. **Environment variables** are the key differentiator
3. **Auto-deploy** works on both - push once, both update
4. **Separate analytics** - track admin and portfolio separately
5. **Cost-effective** - one codebase, one Firebase project, two domains

For detailed instructions, see `DEPLOYMENT_GUIDE.md`

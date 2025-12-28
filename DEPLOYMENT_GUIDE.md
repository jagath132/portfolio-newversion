# Multi-Domain Deployment Guide

## Overview

Your portfolio application now supports **two separate build modes**:

- **Admin Mode**: For hosting the admin console on a separate domain
- **Portfolio Mode**: For hosting the public portfolio on the main domain

## Build Commands

### Admin Console Build

```bash
npm run build:admin
```

This creates a production build with:

- Admin routes at root (`/`, `/login`, `/signup`, `/projects`, etc.)
- No portfolio content included
- Optimized bundle size for admin features only

### Portfolio Build

```bash
npm run build:portfolio
```

This creates a production build with:

- Portfolio content at root (`/`)
- No admin routes accessible
- Full portfolio experience

## Deployment Steps

### Option 1: Vercel

#### Deploy Admin Console

1. **Create Vercel Project**:

   - Connect your GitHub repository to Vercel
   - Create a new project for the admin console

2. **Build Settings**:

   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build:admin`
   - **Output Directory**: `dist`

3. **Environment Variables**:

   ```
   VITE_APP_MODE=admin
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Domain Configuration**:

   - Set custom domain: `admin.yourdomain.com`
   - Configure DNS to point to Vercel

5. **Deploy**: Push to your repository or trigger manual deploy

#### Deploy Portfolio

1. **Create Separate Vercel Project**:

   - Create another Vercel project from the same repository
   - This ensures separate deployments for admin and portfolio

2. **Build Settings**:

   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build:portfolio`
   - **Output Directory**: `dist`

3. **Environment Variables**:

   ```
   VITE_APP_MODE=portfolio
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   VITE_WEB3FORMS_ACCESS_KEY=your_web3forms_key
   ```

4. **Domain Configuration**:

   - Set custom domain: `yourdomain.com` (main portfolio domain)

5. **Deploy**: Push to repository or trigger manual deploy

### Option 2: Netlify

#### Deploy Admin Console

1. Create new site from Git
2. Build settings:
   - **Build command**: `npm run build:admin`
   - **Publish directory**: `dist`
3. Environment variables:
   ```
   VITE_APP_MODE=admin
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```
4. Domain settings: `admin.yourdomain.com`

#### Deploy Portfolio

1. Create new site from Git
2. Build settings:
   - **Build command**: `npm run build:portfolio`
   - **Publish directory**: `dist`
3. Environment variables:
   ```
   VITE_APP_MODE=portfolio
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   VITE_WEB3FORMS_ACCESS_KEY=your_web3forms_key
   ```
4. Domain settings: `yourdomain.com`

### Option 3: Firebase Hosting

#### Admin Console

```bash
# Build admin
npm run build:admin

# Deploy to admin subdomain
firebase deploy --only hosting:admin
```

#### Portfolio

```bash
# Build portfolio
npm run build:portfolio

# Deploy to main domain
firebase deploy --only hosting:portfolio
```

Configure `firebase.json`:

```json
{
  "hosting": [
    {
      "target": "admin",
      "public": "dist",
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    },
    {
      "target": "portfolio",
      "public": "dist",
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    }
  ]
}
```

## Environment Variables Required

Both deployments need these Firebase configuration variables:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_WEB3FORMS_ACCESS_KEY` (Portfolio only)

**IMPORTANT**: Set `VITE_APP_MODE` to:

- `admin` for admin console deployment
- `portfolio` for portfolio deployment

## Access URLs After Deployment

### Admin Console

- Login: `https://admin.yourdomain.com/login`
- Signup: `https://admin.yourdomain.com/signup`
- Dashboard: `https://admin.yourdomain.com/`

### Portfolio

- Main site: `https://yourdomain.com/`

## Security Notes

1. **Firestore Rules**: Ensure your Firestore rules allow:

   - Public read access (for portfolio to display data)
   - Authenticated write access (for admin to manage data)

2. **Firebase Authentication**:

   - Add both domains to authorized domains in Firebase Console
   - Go to: Authentication → Settings → Authorized domains
   - Add: `yourdomain.com` and `admin.yourdomain.com`

3. **CORS**: Both apps use the same Firebase project, so CORS is handled automatically.

### Vercel-Specific Notes

- **Automatic Deployments**: Vercel automatically deploys on every push to your main branch
- **Preview Deployments**: Each pull request gets a preview URL for testing
- **Environment Variables**: Set them in Vercel dashboard under Project Settings → Environment
  Variables
- **Build Caching**: Vercel caches dependencies for faster builds
- **Analytics**: Vercel provides built-in analytics for your deployments

## Testing Locally

### Test Admin Mode

```bash
# Create .env.local with VITE_APP_MODE=admin
echo "VITE_APP_MODE=admin" > .env.local
npm run dev
# Visit http://localhost:5173 (will show admin console)
```

### Test Portfolio Mode

```bash
# Create .env.local with VITE_APP_MODE=portfolio
echo "VITE_APP_MODE=portfolio" > .env.local
npm run dev
# Visit http://localhost:5173 (will show portfolio)
```

## Troubleshooting

### Issue: Admin routes not working

- Verify `VITE_APP_MODE=admin` is set in deployment environment variables
- Check build logs to confirm correct mode

### Issue: Portfolio shows admin

- Verify `VITE_APP_MODE=portfolio` is set
- Clear deployment cache and rebuild

### Issue: Firebase connection errors

- Verify all Firebase environment variables are set correctly
- Check Firebase Console for authorized domains

### Issue: Vercel build fails

- Check build logs in Vercel dashboard
- Ensure `npm run build:admin` or `npm run build:portfolio` works locally
- Verify Node.js version in Vercel (should match your local version)

### Issue: Wrong mode deployed on Vercel

- Check environment variables in Vercel project settings
- Ensure each project has the correct `VITE_APP_MODE` value
- Redeploy after changing environment variables

## Maintenance

When updating code:

1. Push changes to your repository
2. Both Vercel projects will auto-deploy (if enabled)
3. Netlify projects will also auto-deploy
4. Each platform will build with its respective mode
5. No manual intervention needed

## Cost Optimization

- **Admin Console**: Smaller bundle (~500KB), fewer users, minimal bandwidth
- **Portfolio**: Larger bundle (~900KB), more traffic, but still optimized
- Both deployments share the same Firebase project (single cost)

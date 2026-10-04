# Deployment Guide - Vercel & Railway

This guide details deploying the SRC E-Voting System using **Vercel** (for the React SPA frontend) and **Railway** (for the PHP backend REST API and MySQL database).

---

## 1. Backend & Database Deployment (Railway)

### Step 1: Create Project & Connect Repository
1. Log in to [Railway.app](https://railway.app).
2. Click **New Project** → **Deploy from GitHub Repo**.
3. Select the `g3-src-evoting-system` repository.
4. Set the Root Directory to `/backend` (or use root with `railway.json`).

### Step 2: Add MySQL Database Service
1. In Railway, click **+ New** → **Database** → **Add MySQL**.
2. Railway will automatically provision MySQL and expose connection variables (`MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, `MYSQLPORT`, `MYSQL_URL`).
3. Note: `backend/config/database.php` automatically detects these variables!

### Step 3: Seed Database Schema & Demo Data
Connect to Railway MySQL using your local MySQL client or Railway CLI:
```bash
# Import schema
mysql -h <MYSQLHOST> -P <MYSQLPORT> -u <MYSQLUSER> -p<MYSQLPASSWORD> <MYSQLDATABASE> < database/schemas/schema.sql

# Seed demo data
php database/seeds/seed_demo_data.php
```

### Step 4: Configure Backend Environment Variables
In the PHP service variables tab on Railway, set:
```env
JWT_SECRET=a_very_secure_random_string_min_32_chars
JWT_EXPIRY=900
JWT_REFRESH_EXPIRY=604800
FRONTEND_URL=https://your-app-name.vercel.app
APP_ENV=production
APP_DEBUG=false
```

### Step 5: Verify Backend Health
Once deployed, verify the backend health endpoint:
```
GET https://<your-railway-url>.railway.app/api/health.php
```
Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2026-10-05T00:00:00+00:00"
}
```

---

## 2. Frontend Deployment (Vercel)

### Step 1: Import Project to Vercel
1. Log in to [Vercel.com](https://vercel.com).
2. Click **Add New** → **Project**.
3. Import your GitHub repository.
4. Set **Root Directory** to `frontend`.
5. Select **Vite** as the Framework Preset.
6. Build Command: `npm run build`
7. Output Directory: `dist`

### Step 2: Configure Environment Variables
Set the following environment variable in Vercel settings:
```env
VITE_API_URL=https://<your-railway-url>.railway.app
```

### Step 3: SPA Routing & Headers (`vercel.json`)
The project includes `frontend/vercel.json` to handle React Router client-side rewrites and security headers:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

---

## 3. Production Verification Matrix

1. **SPA Route Reloads**: Navigate to `https://your-app.vercel.app/dashboard?tab=Results` and press refresh. Verify Vercel serves `/index.html` without returning a 404 error.
2. **CORS Handling**: Log in via `https://your-app.vercel.app/login`. Check network tab for clean `200 OK` on `/api/auth/login.php` with valid CORS headers.
3. **Database Health**: Admin panel loads stats from Railway MySQL (`/api/admin/stats.php`).
4. **Theme Preference**: Toggle theme to Dark Mode, refresh browser, and verify theme mode persists via `localStorage`.

**Last Updated**: 2026-10-05

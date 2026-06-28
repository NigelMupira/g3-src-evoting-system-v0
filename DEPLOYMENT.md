# Deployment Guide

This guide covers deploying the SRC E-Voting System to production using Vercel (frontend) and Railway (backend + database).

## Prerequisites

- Railway account with $5 free credit
- Vercel account
- Git repository with the project code
- Domain name (optional)

## Backend + Database Deployment (Railway)

### 1. Create Railway Project

1. Log in to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will detect the PHP backend

### 2. Configure Environment Variables

Add these environment variables in Railway:

```env
# Database (Configure based on your MySQL service)
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASS=your_mysql_password
DB_NAME=evoting_system

# JWT (Generate a secure random string)
JWT_SECRET=your_secure_jwt_secret_here_min_32_chars
JWT_EXPIRY=900
JWT_REFRESH_EXPIRY=604800

# Frontend URL (Update after Vercel deployment)
FRONTEND_URL=https://your-vercel-app.vercel.app

# Environment
APP_ENV=production
APP_DEBUG=false
```

### 3. Database Setup

Railway can use MySQL or PostgreSQL. For this project, we recommend MySQL:

1. Create a MySQL service in Railway
2. Import the schema: `mysql -u root -p < database/schemas/schema.sql`
3. Or run the setup script: `cd database && setup.bat` (Windows) or `./setup.sh` (Linux/Mac)

### 4. Update CORS Configuration

Update `backend/index.php` to include your Vercel domain:

```php
$allowedOrigins = [
    'http://localhost:3000',   // Local development
    'https://your-vercel-app.vercel.app', // Production frontend
];
```

### 5. Test Backend Deployment

- Railway will provide a URL like `https://your-backend.railway.app`
- Test the health endpoint: `https://your-backend.railway.app/api/health.php`
- You should see: `{"status":"healthy","database":"connected"}`

## Frontend Deployment (Vercel)

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Deploy Frontend

```bash
cd frontend
vercel
```

Follow the prompts:
- **Scope**: Select your account
- **Project Name**: `src-evoting-frontend`
- **Directory**: `./` (current directory)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 3. Configure Environment Variables

Add this environment variable in Vercel:

```env
VITE_API_URL=https://your-backend.railway.app
```

### 4. Deploy to Production

```bash
vercel --prod
```

### 5. Update Backend CORS

After getting your Vercel URL, update the `$allowedOrigins` in `backend/index.php` and redeploy the backend.

## Demo Database Setup (Session-Based)

For the demo environment, we'll implement a session-based database that resets automatically:

### 1. Create Demo Database Script

Create `database/reset_demo.php`:

```php
<?php
require_once '../backend/config/database.php';

// Delete all user-created data
$pdo->exec("DELETE FROM votes WHERE timestamp < DATE_SUB(NOW(), INTERVAL 1 HOUR)");
$pdo->exec("DELETE FROM users WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 HOUR) AND role = 'user'");

// Reset elections to initial state
$pdo->exec("UPDATE elections SET is_active = FALSE");

echo "Demo database reset completed at " . date('Y-m-d H:i:s');
?>
```

### 2. Set Up Automatic Reset

Add a Railway Cron job to run this script hourly:

1. In Railway, go to your project
2. Click "New Service" → "Cron"
3. Set schedule: `0 * * * *` (every hour)
4. Command: `php database/reset_demo.php`

## Verification Steps

### 1. Test Full Integration

1. Access your Vercel frontend URL
2. Try registering a new user
3. Login with the new user
4. Check if data appears in Railway database console
5. Verify admin functionality (create admin user directly in database)

### 2. Test Security Features

1. Try accessing admin routes without authentication
2. Test rate limiting (multiple failed login attempts)
3. Verify CORS headers are properly set
4. Check security headers in browser DevTools

### 3. Test Demo Reset

1. Create test users and cast votes
2. Wait for the hourly reset
3. Verify demo data is cleared but system data remains

## Production Checklist

- [ ] Update JWT_SECRET to a secure random string
- [ ] Configure production CORS origins
- [ ] Set up SSL certificates (automatic on Vercel/Railway)
- [ ] Enable database backups (Railway automatic)
- [ ] Set up monitoring and alerts
- [ ] Test all user flows end-to-end
- [ ] Configure custom domain (optional)
- [ ] Set up error logging
- [ ] Review and test security headers
- [ ] Verify rate limiting is working
- [ ] Test demo reset functionality

## Troubleshooting

### CORS Errors

If you see CORS errors:
1. Verify your Vercel URL is in `$allowedOrigins`
2. Check that Railway is sending proper CORS headers
3. Ensure both services are using HTTPS

### Database Connection Issues

If the backend can't connect to the database:
1. Verify Railway environment variables are set
2. Check database service is running
3. Test connection in Railway console

### Build Failures

If Vercel build fails:
1. Check `package.json` scripts are correct
2. Verify all dependencies are in `package.json`
3. Check build logs for specific errors

## Maintenance

### Regular Tasks

- **Weekly**: Review audit logs for suspicious activity
- **Monthly**: Check database storage usage
- **Quarterly**: Review and update dependencies
- **As needed**: Reset demo database if it grows too large

### Monitoring

Set up monitoring for:
- API response times
- Error rates
- Database connection health
- Rate limit violations

## Cost Management

- **Vercel**: Free tier sufficient for demo (100GB bandwidth/month)
- **Railway**: Free tier includes $5 credit (sufficient for small demo)
- **Database**: PostgreSQL free tier (1GB storage)
- **Total**: Should be free for demo purposes

## Scaling Considerations

If you need to scale beyond demo:

1. **Upgrade Railway plan** for more resources
2. **Add CDN** for static assets
3. **Implement caching** (Redis)
4. **Load balance** multiple backend instances
5. **Use managed database** for better performance

# Integration Testing Guide

This guide provides comprehensive testing procedures for verifying the integration between Vercel (frontend) and Railway (backend + database).

## Pre-Deployment Testing (Local)

### 1. Backend Testing

#### Test Database Connection
```bash
cd backend
php -S localhost:8000 index.php
```

Test any endpoint to verify backend is running:
```bash
curl http://localhost:8000/api/elections/list.php
```

#### Test Authentication Endpoints

**Register a new user:**
```bash
curl -X POST http://localhost:8000/api/auth/register.php \
  -H "Content-Type: application/json" \
  -d '{
    "regNumber": "A123456B",
    "firstName": "Test",
    "lastName": "User",
    "password": "Test123!",
    "school": "Engineering",
    "course": "Computer Science"
  }'
```

**Login with the user:**
```bash
curl -X POST http://localhost:8000/api/auth/login.php \
  -H "Content-Type: application/json" \
  -d '{
    "regNumber": "A123456B",
    "password": "Test123!"
  }'
```

Save the returned token for subsequent tests.

#### Test Rate Limiting

```bash
# Try 6 login attempts in quick succession (should fail on 6th)
for i in {1..6}; do
  curl -X POST http://localhost:8000/api/auth/login.php \
    -H "Content-Type: application/json" \
    -d '{"regNumber": "A123456B", "password": "wrong"}'
  echo "Attempt $i"
done
```

Expected: 5th attempt should return rate limit error.

### 2. Frontend Testing

#### Start Frontend
```bash
cd frontend
npm install
npm run start
```

#### Test User Flow

1. **Registration Flow:**
   - Navigate to http://localhost:3000/register
   - Fill in registration form with valid data
   - Submit and verify success message
   - Try to register same reg_number again (should fail)

2. **Login Flow:**
   - Navigate to http://localhost:3000/login
   - Login with registered credentials
   - Verify redirect to user dashboard
   - Check JWT token in localStorage

3. **Voting Flow:**
   - Navigate to voting page
   - Select candidates for each position
   - Submit votes
   - Verify success message
   - Try to vote again for same position (should fail)

4. **Results Viewing:**
   - Navigate to results page
   - Verify vote counts are displayed
   - Check that your votes are included

#### Test Admin Flow

1. **Create Admin User:**
```sql
INSERT INTO users (reg_number, first_name, last_name, password_hash, role, is_active)
VALUES ('ADMIN01', 'Admin', 'User', '$2y$10$hashedpasswordhere', 'admin', TRUE);
```

2. **Admin Dashboard:**
   - Login as admin
   - Verify redirect to admin dashboard
   - Check statistics display
   - Test audit log viewer
   - Create a new election
   - Add candidates to election

## Post-Deployment Testing

### 1. Railway Backend Testing

#### Test Health Endpoint
```bash
curl https://your-backend.railway.app/api/elections/list.php
```

#### Test CORS Headers
```bash
curl -I https://your-backend.railway.app/api/elections/list.php \
  -H "Origin: https://your-vercel-app.vercel.app"
```

Check for:
- `Access-Control-Allow-Origin: https://your-vercel-app.vercel.app`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- Security headers (X-Frame-Options, CSP, etc.)

#### Test Database Connection
```bash
curl https://your-backend.railway.app/api/elections/list.php
```

### 2. Vercel Frontend Testing

#### Test Environment Variables
Check browser console for:
```javascript
console.log(import.meta.env.VITE_API_URL);
```

Should output your Railway backend URL.

#### Test Full User Flow

1. **Registration:**
   - Access https://your-vercel-app.vercel.app/register
   - Register a new user
   - Verify success

2. **Login:**
   - Login with new user
   - Check browser network tab for API calls
   - Verify requests go to Railway backend
   - Check JWT token is stored

3. **Dashboard:**
   - Verify user dashboard loads
   - Check voting history displays
   - Verify statistics are accurate

4. **Voting:**
   - Cast votes in active election
   - Verify success message
   - Check Railway database for new votes

5. **Results:**
   - View election results
   - Verify data matches database

### 3. Cross-Origin Testing

#### Test from Different Origins

```bash
# Test from command line (simulating different origin)
curl -X POST https://your-backend.railway.app/api/auth/login.php \
  -H "Content-Type: application/json" \
  -H "Origin: https://malicious-site.com" \
  -d '{"regNumber": "A123456B", "password": "Test123!"}'
```

Expected: Should be blocked or return error.

### 4. Security Testing

#### Test Security Headers
```bash
curl -I https://your-backend.railway.app/api/elections/list.php
```

Verify headers:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (if HTTPS)
- `Content-Security-Policy`

#### Test Rate Limiting
```bash
# Multiple rapid requests
for i in {1..6}; do
  curl -X POST https://your-backend.railway.app/api/auth/login.php \
    -H "Content-Type: application/json" \
    -d '{"regNumber": "test", "password": "test"}'
  echo "Attempt $i"
done
```

#### Test Input Validation
```bash
# Test XSS attempt
curl -X POST https://your-backend.railway.app/api/auth/register.php \
  -H "Content-Type: application/json" \
  -d '{
    "regNumber": "A123456B",
    "firstName": "<script>alert(\"xss\")</script>",
    "lastName": "Test",
    "password": "Test123!",
    "school": "Engineering",
    "course": "CS"
  }'
```

Expected: Script tags should be sanitized.

#### Test SQL Injection
```bash
curl -X POST https://your-backend.railway.app/api/auth/login.php \
  -H "Content-Type: application/json" \
  -d '{"regNumber": "A123456B\' OR \'1\'=\'1", "password": "test"}'
```

Expected: Should fail authentication.

### 5. Demo Reset Testing

#### Test Manual Reset
```bash
# SSH into Railway server and run
php database/reset_demo.php
```

Verify:
- Demo users are deleted
- Demo votes are removed
- Admin accounts preserved
- System elections preserved

#### Test Automatic Reset
1. Create demo data
2. Wait for cron job (1 hour)
3. Verify data is cleared

## Performance Testing

### Load Testing

```bash
# Install Apache Bench
ab -n 100 -c 10 https://your-backend.railway.app/api/health.php
```

Monitor:
- Response times
- Error rates
- Database connection pool

### Frontend Performance

1. **Lighthouse Testing:**
   - Open Chrome DevTools
   - Run Lighthouse audit
   - Check performance score
   - Verify >90 score

2. **Network Throttling:**
   - Test on 3G connection
   - Verify app still functional
   - Check loading times

## Integration Checklist

### Backend (Railway)
- [ ] Health endpoint returns 200
- [ ] Database connection successful
- [ ] CORS headers configured correctly
- [ ] Security headers present
- [ ] Rate limiting functional
- [ ] Input validation working
- [ ] JWT authentication working
- [ ] Admin endpoints protected

### Frontend (Vercel)
- [ ] Environment variables set
- [ ] API calls reach Railway backend
- [ ] JWT token stored correctly
- [ ] User authentication flow works
- [ ] Admin authentication flow works
- [ ] Voting functionality works
- [ ] Results display correctly
- [ ] Error handling functional

### Integration
- [ ] CORS allows Vercel origin
- [ ] JWT tokens accepted by backend
- [ ] Data persists in Railway database
- [ ] Real-time updates work
- [ ] Session management works
- [ ] Logout functionality works

### Security
- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] Rate limiting prevents abuse
- [ ] Input sanitization works
- [ ] SQL injection prevented
- [ ] XSS attacks prevented
- [ ] CSRF protection active
- [ ] Admin routes protected

### Demo Reset
- [ ] Manual reset works
- [ ] Automatic reset scheduled
- [ ] Admin data preserved
- [ ] System data preserved
- [ ] Demo data cleared

## Troubleshooting

### Common Issues

**CORS Errors:**
- Check Railway CORS configuration
- Verify Vercel URL in allowed origins
- Check browser console for specific error

**Authentication Failures:**
- Verify JWT_SECRET matches
- Check token expiration time
- Verify token format in Authorization header

**Database Connection Issues:**
- Check Railway environment variables
- Verify database service is running
- Test connection in Railway console

**Rate Limiting Too Aggressive:**
- Adjust rate limits in middleware
- Check IP detection logic
- Verify time window settings

**Demo Reset Not Working:**
- Check cron job schedule
- Verify script permissions
- Check error logs

## Monitoring Setup

### Railway Monitoring
1. Enable Railway metrics
2. Set up alerting for:
   - Error rate > 5%
   - Response time > 2s
   - Database connection failures

### Vercel Monitoring
1. Enable Vercel Analytics
2. Set up speed and error tracking
3. Monitor build failures

### Custom Monitoring
Consider setting up:
- Uptime monitoring (Pingdom, UptimeRobot)
- Error tracking (Sentry)
- Log aggregation (Papertrail, Loggly)

## Success Criteria

The integration is successful when:

1. **Functionality:**
   - All user flows work end-to-end
   - Admin features functional
   - Data persists correctly
   - Real-time updates work

2. **Security:**
   - All security headers present
   - Rate limiting functional
   - Input validation working
   - Authentication secure

3. **Performance:**
   - Page load time < 3s
   - API response time < 500ms
   - Lighthouse score > 90
   - No memory leaks

4. **Reliability:**
   - 99.9% uptime
   - Automatic error recovery
   - Graceful degradation
   - Proper error handling

5. **Maintainability:**
   - Clear error messages
   - Comprehensive logging
   - Easy debugging
   - Documentation complete

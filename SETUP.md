# E-Voting System - Setup & Development Guide

## ✅ Completed: Phase 1 Frontend Fixes

### 1. Fixed Merge Conflict in package.json
- Resolved react-router-dom and react-helmet version conflict
- Now using: `react-router-dom@^7.3.0` and `react-helmet@^6.1.0`

### 2. Created Global Authentication Context (`src/context/AuthContext.js`)
- `AuthProvider` wrapper for entire app
- `useAuth()` hook for accessing auth state
- Manages: user, token, isLoading, error
- Methods: login, register, logout
- Token stored in localStorage (will be improved with httpOnly cookies in backend)

### 3. Updated App.js
- Wrapped app with `<AuthProvider>`
- Added `ProtectedRoute` component for /dashboard and /admin
- Automatic redirection to /login if not authenticated
- Role-based access control (admin check)

### 4. Fixed Security Issues
- **Login.js**: Removed plain text password storage, password only sent to backend
- **Register.js**: Added auth integration, removed password storage
- Both components now use AuthContext for state management
- localStorage only stores registration number (for "Remember Me" feature)

### 5. Updated Logout
- UserDashboard.js: Now properly logs out using AuthContext
- AdminDashboard.js: Now properly logs out using AuthContext

### 6. Added Environment Configuration
- Created `.env.example` with `REACT_APP_API_URL` placeholder
- Instructs users to create `.env.local` for local development

---

## 📋 Prerequisites & Setup

### Local Development Setup

1. **Copy environment file:**
```bash
cp .env.example .env.local
# Keep REACT_APP_API_URL=http://localhost:8000 for now
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm start
# App will open at http://localhost:3000
```

---

## 🚀 Next Steps: Phase 2 - Backend Setup

The frontend is ready to connect to a PHP backend. Now you need to:

### Phase 2.1: Create PHP Backend Project
```
Create new folder: backend/
Structure as shown in plan at C:\Users\nigel\.claude\plans\mossy-questing-wreath.md
```

### Phase 2.2: Setup MySQL Database
Create the following tables in your local MySQL:
- `users` - voter accounts
- `elections` - elections data
- `positions` - voting positions
- `candidates` - candidate information
- `votes` - vote submissions (anonymized)
- `audit_log` - activity tracking

### Phase 2.3: Create PHP REST APIs
Endpoints needed:
```
POST /api/auth/register.php    - User registration
POST /api/auth/login.php       - User login (returns JWT token)
POST /api/auth/logout.php      - User logout

GET  /api/elections/list.php   - List active elections
POST /api/elections/create.php - Create election (admin only)
PUT  /api/elections/{id}.php   - Update election
DELETE /api/elections/{id}.php - Delete election

GET  /api/candidates/list.php  - List candidates
POST /api/candidates/create.php - Add candidate (admin only)
PUT  /api/candidates/{id}.php  - Update candidate
DELETE /api/candidates/{id}.php - Delete candidate

POST /api/votes/submit.php     - Submit vote
GET  /api/votes/results.php    - Get election results
```

---

## 🔐 Security Implementation (In Backend)

1. **Password Security**
   - Hash passwords with bcrypt on backend
   - Never transmit plain text passwords in response

2. **Authentication**
   - Implement JWT tokens (15 min expiry)
   - Refresh tokens (7 days expiry)
   - HTTPS only in production

3. **Vote Security**
   - Encrypt votes at rest
   - Hash voter IDs (anonymization)
   - Prevent double voting

4. **Input Validation**
   - Sanitize all inputs on backend
   - Prevent SQL injection
   - Validate registration number format

5. **Audit Logging**
   - Log all admin actions
   - Log failed login attempts
   - Track vote submission timestamps (not voter ID)

---

## 🧪 Testing Checklist

Before deploying, test:

### Frontend
- [ ] `npm start` - App loads without errors
- [ ] No console errors in browser DevTools
- [ ] Can navigate to all public pages (Home, Login, Register)
- [ ] Protected routes redirect to /login when not authenticated
- [ ] LocalStorage only contains 'token' (no passwords)

### Backend (When Ready)
- [ ] PHP server runs on http://localhost:8000
- [ ] MySQL database created with all tables
- [ ] Registration API returns success response
- [ ] Login API returns JWT token
- [ ] Protected routes check for valid token

### Integration (When Backend Complete)
- [ ] Register new user → data saved in DB
- [ ] Login with credentials → receive token → redirected to /dashboard
- [ ] Logout → token cleared → redirected to /login
- [ ] Admin can access /admin dashboard
- [ ] Regular users cannot access /admin
- [ ] Create election → Appears in voting page
- [ ] Vote submission → Vote stored in DB
- [ ] View results → Shows vote counts

---

## 📦 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repo to Vercel
3. Set `REACT_APP_API_URL` environment variable to backend URL
4. Deploy automatically on push

### Backend (Railway.app - Free Tier)
1. Create Railway account
2. Create PHP service from GitHub
3. Create PostgreSQL or MySQL service
4. Set environment variables (.env)
5. Deploy

---

## 📚 File Structure After Phase 1

```
src/
├── App.js                      (Updated: AuthProvider, ProtectedRoute)
├── index.js
├── index.css
├── context/
│   └── AuthContext.js          (NEW: Global auth state)
├── pages/
│   ├── Home.js
│   ├── Login.js                (Updated: Uses AuthContext)
│   ├── Register.js             (Updated: Uses AuthContext)
│   ├── user/
│   │   ├── UserDashboard.js   (Updated: Uses AuthContext logout)
│   │   ├── VotingPage.js
│   │   └── ResultsPage.js
│   └── admin/
│       ├── AdminDashboard.js  (Updated: Uses AuthContext logout)
│       ├── ManageElections.js (To be implemented)
│       ├── ManageCandidates.js (To be implemented)
│       └── ViewResults.js     (To be implemented)
└── .env.example                (NEW: API configuration)
```

---

## 🔗 Current Issues Fixed

| Issue | Status | Solution |
|-------|--------|----------|
| Merge conflict in package.json | ✅ Fixed | Resolved conflict, chose latest versions |
| Plain text password in localStorage | ✅ Fixed | Removed password storage, kept only reg number |
| No global auth state | ✅ Fixed | Created AuthContext & useAuth hook |
| No protected routes | ✅ Fixed | Added ProtectedRoute component |
| No backend integration | 🔄 In Progress | Ready for Phase 2 backend setup |
| Admin pages empty | 🔄 In Progress | Will implement in Phase 4 |

---

## 🎯 Next Command to Run

```bash
npm install
npm start
```

The app should now load without errors. Frontend is ready for backend integration!

**Then**: Set up PHP backend in `backend/` folder following the plan.

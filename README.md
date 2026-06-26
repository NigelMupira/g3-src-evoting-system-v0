# SRC E-Voting System

A secure, web-based election management platform for Student Representative Council (SRC) voting. Built with React, PHP, and MySQL, this system enables transparent and fair elections while ensuring voter privacy and vote integrity.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Development Phases](#development-phases)
- [Configuration](#configuration)
- [Security](#security)
- [Testing](#testing)
- [Deployment](#deployment)

---

## ✨ Features

### For Voters

- **User Registration**: Create account with validation (registration number, password strength)
- **Secure Login**: JWT-based authentication with "Remember Me" option
- **Vote Casting**: Select candidates per position in active elections
- **Vote Privacy**: Votes are anonymous and cannot be traced back to voters
- **Results Viewing**: View real-time election results
- **Candidate Info**: Access candidate profiles with bios and manifestos
- **Logout**: Secure session termination

### For Administrators

- **Election Management**: Create, edit, activate, and close elections
- **Candidate Management**: Add, edit, and manage candidates with media
- **Real-time Monitoring**: View live voting statistics and participation rates
- **Results Analytics**: Generate reports and visualize results with charts
- **Audit Logging**: Track all system activities and admin actions

> **Note on Admin Accounts**: Admins are **not** registered through the public registration page.
> They are added directly to the `users` table in the database by a superuser/initial admin
> with `role = 'admin'`. They then log in via the same login page as voters, and the system
> automatically detects their role from the database and redirects them to `/admin`.

### Security Features

- **Password Security**: Passwords hashed with bcrypt on backend
- **Authentication**: JWT tokens with 15-minute expiry
- **Vote Privacy**: Voter IDs hashed (SHA-256); votes are anonymous
- **Input Validation**: Client and server-side validation
- **Double Voting Prevention**: Backend enforces one vote per position per voter
- **HTTPS**: Enforced in production environments
- **Audit Trail**: All admin actions logged for accountability

---

## 🛠️ Technology Stack

### Frontend

- **React** `^19.0.0` - UI framework
- **Vite** `^5.4.11` - Build tool (replaced Create React App for React 19 compatibility)
- **React Router DOM** `^7.3.0` - Client-side routing
- **Material-UI (MUI)** `^6.4.6` - Component library & icons
- **React Helmet Async** `^3.0.0` - Document head management (SEO)

### Backend

- **PHP** `8.0+` - Server-side logic with RESTful API
- **MySQL** `8.0+` - 6-table relational database
- **firebase/php-jwt** `^6.8` - JWT token generation/validation
- **vlucas/phpdotenv** `^5.5` - `.env` file loading

### Hosting (Target)

- **Frontend**: Vercel (free tier) - React app deployment
- **Backend + Database**: Railway.app (free tier, $5/month credit) - PHP + MySQL

---

## 📁 Project Structure

```
g3-src-evoting-system/
├── frontend/                  # React + Vite application
│   ├── src/
│   │   ├── pages/             # Page components (Home, Login, Register, dashboards)
│   │   ├── components/        # Reusable components (Header, Sidebar, ProtectedRoute)
│   │   ├── context/           # Global state (AuthContext)
│   │   ├── services/          # API service layer (api.js, authService.js, etc.)
│   │   ├── utils/             # Helpers, constants, validators
│   │   ├── theme/             # Material-UI custom theme (school colors)
│   │   ├── App.js             # Root app with routing
│   │   └── index.js           # App entry point
│   ├── public/                # Static assets
│   ├── index.html             # Vite HTML entry (root of frontend/)
│   ├── vite.config.js         # Vite configuration
│   └── package.json
├── backend/                   # PHP API
│   ├── api/
│   │   ├── auth/              # login.php, register.php, logout.php
│   │   ├── elections/         # CRUD endpoints for elections
│   │   ├── candidates/        # CRUD endpoints for candidates
│   │   ├── votes/             # submit.php, results.php, validate.php
│   │   └── middleware/        # JWTAuth.php, AdminAuth.php
│   ├── config/                # database.php (PDO connection)
│   ├── models/                # User.php, Election.php, Candidate.php, Vote.php
│   ├── index.php              # Front controller (global CORS + request routing)
│   └── .env                   # Database & JWT secrets (not in git)
├── database/
│   ├── schemas/schema.sql     # MySQL table definitions
│   ├── seeds/                 # Sample data scripts
│   └── setup.bat / setup.sh   # One-command database setup scripts
└── README.md                  # This file
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- Node.js 18+ and npm
- PHP 8.0+ with `pdo_mysql` extension enabled
- MySQL 5.7+

### 1. Database Setup

```bash
# Create database and import schema
mysql -u root -p < database/schemas/schema.sql

# Or use the setup script (Windows):
database\setup.bat
```

### 2. Backend Setup

```bash
cd backend
# Ensure .env is configured (copy .env.example if needed)
# Start PHP server — index.php acts as the front controller
php -S localhost:8000 index.php
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run start     # Starts Vite dev server on http://localhost:3000
```

---

## 🏗️ Architecture

### Authentication Flow

```
User submits login form
  → authService.js sends POST /api/auth/login.php
  → Backend validates credentials, returns JWT token + user (id, role, name)
  → AuthContext stores token in localStorage, user object in state
  → Login.js checks user.role:
      role === 'admin' → navigate('/admin')
      role === 'user'  → navigate('/dashboard')
```

### Vote Submission Flow

```
Voter selects candidate and submits
  → voteService.js sends POST /api/votes/submit.php with JWT
  → Backend verifies token, checks election is active
  → Voter ID hashed: SHA-256(regNumber + positionId) for anonymity
  → Checks UNIQUE constraint on (voter_id_hash, position_id, election_id)
  → Stores vote — voter identity is never stored directly
```

### CORS & Routing (Backend)

```
All requests → backend/index.php (front controller)
  → Sets global CORS headers
  → Handles OPTIONS preflight
  → Routes /api/auth/login.php → backend/api/auth/login.php
  → Routes /api/elections/list.php → backend/api/elections/list.php
  → etc.
```

### Role-Based Access Control

```
Public Routes:  /  |  /login  |  /register

Voter Routes (JWT required):
  /dashboard    → voter home
  /voting       → cast votes
  /results      → view results

Admin Routes (JWT + role=admin required):
  /admin        → admin dashboard
  /admin/elections  → manage elections
  /admin/candidates → manage candidates
  /admin/results    → view vote analytics
```

---

## 📅 Development Phases

| Phase   | Status         | Description                                                    |
| ------- | -------------- | -------------------------------------------------------------- |
| Phase 1 | ✅ Complete    | Frontend foundation — AuthContext, routing, security fixes     |
| Phase 2 | ✅ Complete    | Backend — PHP API, MySQL schema, JWT auth, all CRUD endpoints  |
| Phase 3 | ✅ Complete    | Frontend-Backend integration — all pages connected to real API |
| Phase 4 | 🔄 In Progress | Fixes & deployment prep                                        |
| Phase 5 | 📋 Planned     | Advanced admin features (audit log viewer, analytics)          |
| Phase 6 | 📋 Planned     | Security hardening (rate limiting, HTTPS enforcement)          |

### Phase 4 Progress (Current)

- ✅ Fixed PHP `pdo_mysql` extension configuration (was causing 500/CORS errors locally)
- ✅ Removed `cors.php` boilerplate — CORS now handled globally in `backend/index.php`
- ✅ Fixed admin login redirect — now uses `user.role` from DB, not reg number prefix
- ✅ Migrated frontend from Create React App to **Vite** (fixes Vercel build error 126)
- ⏳ Local end-to-end testing (register → login → vote → results → admin tasks)
- ⏳ Deploy backend to Railway.app
- ⏳ Deploy frontend to Vercel
- ⏳ Connect production environments and run end-to-end test online

---

## ⚙️ Configuration

### Frontend — Environment Variables

Create `frontend/.env.local`:

```env
# Vite reads VITE_* variables (replaces REACT_APP_* from CRA era)
VITE_API_URL=http://localhost:8000
```

For production on Vercel, add `VITE_API_URL=https://your-railway-backend-url.railway.app` in Vercel project settings.

### Backend — Environment Variables

`backend/.env` (already configured locally):

```env
DB_HOST=localhost
DB_USER=evoting
DB_PASS=your_password
DB_NAME=evoting_system
JWT_SECRET=your_very_secure_random_string
JWT_EXPIRY=900        # Token expiry in seconds (900 = 15 minutes)
FRONTEND_URL=http://localhost:3000
```

For production on Railway, set these as environment variables in the Railway service dashboard.

---

## 🔐 Security

- Passwords hashed with **bcrypt** (never stored in plaintext)
- **JWT tokens** for stateless authentication (15-min expiry)
- Voter IDs hashed with **SHA-256** in votes table (vote anonymization)
- Input validation on both client and server
- **CORS restricted** to known origins (not wildcard `*`)
- Admin routes protected server-side by JWT role check (`role === 'admin'`)
- Audit logging of all admin actions in `audit_log` table

---

## 🧪 Testing Checklist

### Local Setup

- [ ] MySQL running and `evoting_system` database exists with all 6 tables
- [ ] PHP server running on `http://localhost:8000` (started with `index.php`)
- [ ] React app running on `http://localhost:3000` (started with `npm run start`)
- [ ] No console errors in browser DevTools

### User Flow

- [ ] Register new voter → data saved in `users` table
- [ ] Login with voter credentials → JWT returned → redirected to `/dashboard`
- [ ] Logout → token cleared → redirected to `/login`
- [ ] Create election (admin) → appears in voter's dashboard
- [ ] Vote submission → stored in `votes` table with hashed voter ID
- [ ] View results → shows correct vote counts per candidate

### Admin Flow

- [ ] Admin added to DB manually with `role = 'admin'`
- [ ] Admin logs in via `/login` → automatically redirected to `/admin`
- [ ] Regular voter cannot access `/admin` (redirected to `/dashboard`)
- [ ] Admin can create/edit/delete elections and candidates

---

## 🚢 Deployment

### Step 1: Backend + Database (Railway.app)

1. Create account at [railway.app](https://railway.app)
2. Create new project → add **MySQL** service
3. Import this GitHub repository as a **PHP** service
4. Set environment variables in Railway (DB_HOST, DB_USER, DB_PASS, DB_NAME, JWT_SECRET, FRONTEND_URL)
5. Import schema: run `database/schemas/schema.sql` against Railway MySQL
6. Railway generates a public URL for your backend (e.g., `https://your-app.railway.app`)

### Step 2: Frontend (Vercel)

1. Create account at [vercel.com](https://vercel.com)
2. Import this GitHub repository
3. Set **Root Directory** to `frontend/`
4. Add environment variable: `VITE_API_URL` = your Railway backend URL
5. Deploy — Vercel auto-deploys on every push to GitHub

### Result

- Frontend: `https://your-project.vercel.app`
- Backend API: `https://your-project.railway.app`
- Database: Hosted on Railway MySQL
- **Cost**: $0 (Railway's free $5/month credit covers small traffic)

---

## 📚 Documentation

- **[frontend/README.md](frontend/README.md)** — React setup, Vite config, and frontend dev guide
- **[backend/README.md](backend/README.md)** — PHP API setup and endpoint documentation
- **[database/README.md](database/README.md)** — Schema and database setup instructions

---

**Last Updated**: 2026-06-26
**Version**: 0.4.0

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
- **User Registration**: Create account with validation (registration number format, password strength)
- **Secure Login**: JWT-based authentication with "Remember Me" option
- **Vote Casting**: Select candidates per position in active elections
- **Vote Privacy**: Votes are anonymous and cannot be traced back to voters
- **Results Viewing**: View real-time election results after voting ends
- **Candidate Info**: Access candidate profiles with bios and manifestos
- **Logout**: Secure session termination

### For Administrators
- **Election Management**: Create, edit, activate, and close elections
- **Candidate Management**: Add, edit, and manage candidates with media
- **Real-time Monitoring**: View live voting statistics and participation rates
- **Results Analytics**: Generate reports and visualize results with charts
- **Audit Logging**: Track all system activities and admin actions
- **User Management**: View registered voters and participation history (anonymized)

### Security Features
- **Password Security**: Passwords hashed with bcrypt on backend
- **Authentication**: JWT tokens with 15-minute expiry for access tokens
- **Vote Privacy**: Voter IDs hashed; votes are anonymous
- **Input Validation**: Client and server-side validation of all inputs
- **Double Voting Prevention**: Backend prevents voting multiple times
- **HTTPS**: Enforced in production environments
- **Audit Trail**: All admin actions logged for accountability

---

## 🛠️ Technology Stack

### Frontend
- **React** `^19.0.0` - UI framework
- **React Router DOM** `^7.3.0` - Client-side routing
- **Material-UI (MUI)** `^6.4.6` - Component library & icons
- **React Helmet** `^6.1.0` - Document head management (SEO)

### Backend ✅ (Implemented)
- **PHP** 8.0+ - Server-side logic with RESTful API
- **MySQL** 8.0+ - 6-table database with relationships
- **JWT** - JSON Web Tokens for authentication (15-min expiry)
- **bcrypt** - Password hashing for security

### Hosting
- **Frontend**: Vercel (free tier) - React app deployment
- **Backend + Database**: Railway.app (free tier with $5/month credits) - PHP + MySQL combined
- **Why this stack**: Vercel is frontend-only; Railway provides both backend server and database in one platform, both free to start

**Alternative Free Options**:
- Database: PlanetScale (free MySQL) + Backend: Render.com (free tier)
- Full Stack: Supabase (free PostgreSQL - would need schema conversion)

### Development Tools
- **Node.js** 16+ & npm/yarn - Package management
- **Jest & React Testing Library** - Testing frameworks

---

## 📁 Project Structure

```
evoting-system/
├── frontend/                  # React application
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── theme/
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── README.md
├── backend/                   # PHP API
│   ├── api/
│   │   ├── auth/
│   │   ├── elections/
│   │   ├── candidates/
│   │   ├── votes/
│   │   └── middleware/
│   ├── config/
│   ├── models/
│   ├── index.php
│   ├── .env.example
│   └── README.md
├── database/                  # MySQL schemas & migrations
│   ├── schemas/
│   ├── migrations/
│   ├── seeds/
│   └── README.md
└── README.md                  # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- PHP 8.0+
- MySQL 5.7+
- Modern web browser

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
npm start
```
Frontend runs on `http://localhost:3000`

### Backend Setup
```bash
cd backend
cp .env.example .env
# Configure .env with database credentials
# php -S localhost:8000
```
Backend API runs on `http://localhost:8000`

### Database Setup
```bash
# Create MySQL database
mysql -u root -p < database/schemas/schema.sql
```

---

## 🏗️ Architecture

### Authentication Flow
```
User Logs In → Frontend validates input → API call to backend
Backend validates credentials → Returns JWT token → Token stored in memory
Token included in all subsequent API requests → Auto-refresh on 401
```

### Vote Submission Flow
```
Voter selects candidates → Submits votes → Backend receives votes with JWT
Backend verifies voter hasn't voted → Encrypts vote → Stores with hashed voter ID
Vote is anonymous → Results updated in real-time
```

### Role-Based Access
```
Public Routes:
  / (Home) | /login | /register

Protected Voter Routes:
  /dashboard | /voting | /results

Protected Admin Routes:
  /admin | /admin/elections | /admin/candidates | /admin/results
```

---

## 📅 Development Phases

1. ✅ **Phase 1**: Fix immediate frontend issues
   - Resolved merge conflicts, created AuthContext, fixed security issues

2. ✅ **Phase 2**: Backend setup
   - ✅ Created PHP API structure with all endpoints
   - ✅ Implemented MySQL schema (6 tables with proper relationships)
   - ✅ JWT authentication with token generation/validation
   - ✅ All CRUD operations for elections, candidates, votes

3. ✅ **Phase 3**: Frontend-Backend integration (COMPLETE)
   - ✅ Connected all frontend pages to real backend APIs
   - ✅ AuthContext integrated with backend login/register
   - ✅ VotingPage fetches elections & candidates from backend
   - ✅ ResultsPage displays real vote counts and statistics
   - ✅ Admin pages (ManageElections, ManageCandidates, ViewResults) fully functional
   - ✅ Updated frontend/backend README with Phase 3 details

4. ⏳ **Phase 4**: Database deployment & testing
   - ⏳ Set up MySQL database (local or hosted)
   - ⏳ Deploy backend to Railway.app
   - ⏳ Deploy frontend to Vercel
   - ⏳ End-to-end testing

5. 📋 **Phase 5**: Advanced admin features (optional)
   - Position management
   - Audit log viewer
   - User management dashboard
   - Advanced analytics & charts

6. 📋 **Phase 6**: Security hardening & optimization
   - Additional encryption, rate limiting
   - Performance optimization
   - HTTPS enforcement

---

## ⚙️ Configuration

### Environment Variables

**Frontend** (`.env.local`):
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development
```

**Backend** (`.env`):
```env
DB_HOST=localhost
DB_USER=root
DB_NAME=evoting_system
JWT_SECRET=your_secret_key
```

For production, update URLs and set `REACT_APP_ENV=production`

---

## 🔐 Security

- All passwords hashed with bcrypt
- JWT tokens for authentication
- Voter IDs hashed in database (anonymized)
- Input validation and sanitization
- CORS protection
- Rate limiting on authentication endpoints
- Audit logging of all admin actions
- HTTPS enforced in production

---

## 🧪 Testing Checklist

### Frontend
- [ ] `npm start` - App loads without errors
- [ ] No console errors in browser DevTools
- [ ] Can navigate to all public pages
- [ ] Protected routes redirect to /login when not authenticated
- [ ] LocalStorage only contains 'token'

### Backend
- [ ] PHP server runs on http://localhost:8000
- [ ] MySQL database created with all tables
- [ ] Registration API returns success response
- [ ] Login API returns JWT token
- [ ] Protected routes check for valid token

### Integration
- [ ] Register new user → data saved in DB
- [ ] Login with credentials → receive token → redirected to /dashboard
- [ ] Logout → token cleared → redirected to /login
- [ ] Admin can access /admin dashboard
- [ ] Regular users cannot access /admin
- [ ] Create election → Appears in voting page
- [ ] Vote submission → Vote stored in DB
- [ ] View results → Shows vote counts

---

## 🚢 Deployment (Free Stack)

### Step 1: Backend & Database (Railway.app - FREE)
1. Create Railway account at [railway.app](https://railway.app)
2. Create new project
3. Add MySQL service (Railway provisions automatically)
4. Add PHP service from GitHub repo
5. Set environment variables:
   - `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME` (from MySQL service)
   - `JWT_SECRET` (generate secure random string)
   - `FRONTEND_URL` (your Vercel domain)
6. Deploy - Railway runs your PHP backend on a public URL
7. Import database schema from `database/schemas/schema.sql`

### Step 2: Frontend (Vercel - FREE)
1. Create Vercel account at [vercel.com](https://vercel.com)
2. Connect GitHub repository
3. Set environment variable:
   - `REACT_APP_API_URL` = your Railway backend URL (e.g., https://your-project-railway.railway.app)
4. Deploy - Vercel auto-deploys on GitHub push

### Result
- Frontend: `https://your-project.vercel.app` (free domain)
- Backend: `https://your-project-railway.railway.app` (free domain)
- Database: Hosted on Railway's MySQL
- **Total Cost**: $0 (Railway's free tier includes $5/month credits)

See individual folder READMEs for detailed setup instructions.

---

## 📚 Documentation

Each folder contains detailed documentation:
- **frontend/README.md** - React setup, structure, and development guide
- **backend/README.md** - PHP API setup and API endpoint documentation
- **database/README.md** - Database schema and setup instructions

---

## 📅 Timeline

- **Phase 1**: ✅ Completed
- **Phase 2**: ✅ Completed (Backend fully implemented)
- **Phase 3**: ✅ Completed (Frontend-Backend integration)
- **Phase 4**: 🔄 Next (Database deployment & testing)
- **Phase 5-6**: Planned

---

**Last Updated**: 2026-06-12  
**Version**: 0.3.0

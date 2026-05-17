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

### Backend (To Be Implemented)
- **PHP** 8.0+ - Server-side logic
- **MySQL** 8.0+ - Database
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

### Hosting
- **Frontend**: Vercel (free tier)
- **Backend**: Railway.app (free tier) or Render
- **Database**: PlanetScale MySQL (free tier)

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

2. 🔄 **Phase 2**: Backend setup (current)
   - Create PHP API structure, MySQL schema, JWT authentication

3. **Phase 3**: Frontend-Backend integration
   - Connect frontend to real backend APIs

4. **Phase 4**: Admin functionality
   - Implement election/candidate management pages

5. **Phase 5**: Security hardening
   - Add additional security measures, encryption

6. **Phase 6**: Testing & Deployment
   - Comprehensive testing, deploy to Vercel & Railway

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

## 🚢 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set `REACT_APP_API_URL` to your backend URL
4. Deploy automatically on push

### Backend (Railway.app)
1. Create Railway account
2. Create PHP service from GitHub
3. Create MySQL service
4. Set environment variables
5. Deploy

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
- **Phase 2**: 🔄 In Progress (Backend setup)
- **Phase 3-6**: Planned

---

**Last Updated**: 2026-05-17  
**Version**: 0.2.0

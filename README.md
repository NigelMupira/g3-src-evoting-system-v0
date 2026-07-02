# SRC E-Voting System

A secure, web-based election management platform for Student Representative Council (SRC) voting. Built with React, PHP, and MySQL, this system enables transparent and fair elections while ensuring voter privacy and vote integrity.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Security](#security)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### For Voters

- **User Registration**: Create account with validation (registration number, password strength)
- **Secure Login**: JWT-based authentication with rate limiting
- **Vote Casting**: Select candidates per position in active elections
- **Vote Privacy**: Votes are anonymous and cannot be traced back to voters
- **Results Viewing**: View real-time election results with detailed analytics
- **Candidate Info**: Access candidate profiles with bios and manifestos
- **Voting History**: Track participation in elections
- **Dark/Light Theme**: Toggle between dark and light themes for comfortable viewing

### For Administrators

- **Election Management**: Create, edit, activate, and close elections
- **Candidate Management**: Add, edit, and manage candidates with media
- **Real-time Monitoring**: View live voting statistics and participation rates
- **Results Analytics**: Generate reports and visualize results with charts
- **Audit Logging**: Track all system activities and admin actions
- **Enhanced Dashboard**: Comprehensive admin interface with activity feeds
- **Activity Timeline**: View recent system activities and user actions
- **Admin Statistics**: Real-time metrics on users, elections, and votes

> **Note on Admin Accounts**: Admins are **not** registered through the public registration page.
> They are added directly to the `users` table in the database by a superuser/initial admin
> with `role = 'admin'`. They then log in via the same login page as voters, and the system
> automatically detects their role from the database and redirects them to `/admin`.

### Security Features

- **Password Security**: Passwords hashed with bcrypt on backend
- **Authentication**: JWT tokens with 15-minute expiry
- **Rate Limiting**: Brute force protection on sensitive endpoints
- **Input Validation**: Comprehensive client and server-side validation
- **Security Headers**: OWASP-compliant headers (CSP, HSTS, XSS protection)
- **Vote Privacy**: Voter IDs hashed (SHA-256); votes are anonymous
- **Double Voting Prevention**: Backend enforces one vote per position per voter
- **Audit Trail**: All admin actions logged for accountability
- **Token Blacklisting**: Secure session management and revocation
- **Clean URLs**: Client-side routing prevents file path exposure

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
- **MySQL** `8.0+` - 8-table relational database (core + security)
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
│   │   ├── components/        # Reusable components (Header, Sidebar, ProtectedRoute, ThemeToggle)
│   │   ├── context/           # Global state (AuthContext, ThemeContext)
│   │   ├── services/          # API service layer (api.js, authService.js, etc.)
│   │   ├── utils/             # Helpers, constants, validators
│   │   ├── theme/             # Material-UI custom theme (light + dark themes)
│   │   ├── App.js             # Root app with routing
│   │   └── index.js           # App entry point
│   ├── public/                # Static assets
│   ├── index.html             # Vite HTML entry (root of frontend/)
│   ├── vite.config.js         # Vite configuration
│   ├── .env.example           # Environment variables template
│   └── package.json
├── backend/                   # PHP API
│   ├── api/
│   │   ├── auth/              # login.php, register.php, logout.php
│   │   ├── elections/         # CRUD endpoints for elections
│   │   ├── candidates/        # CRUD endpoints for candidates
│   │   ├── votes/             # submit.php, results.php, validate.php, history.php
│   │   ├── admin/             # stats.php, activity.php, audit-logs.php
│   │   └── middleware/        # JWTAuth.php, AdminAuth.php, RateLimiter.php, etc.
│   ├── config/                # database.php (PDO connection)
│   ├── models/                # User.php, Election.php, Candidate.php, Vote.php
│   ├── index.php              # Front controller (global CORS + request routing)
│   ├── .env.example           # Environment variables template
│   └── composer.json
├── database/
│   ├── schemas/schema.sql     # MySQL table definitions
│   ├── migrations/            # Database migration scripts
│   ├── seeds/                 # Sample data scripts (including admin user creation)
│   ├── setup.bat / setup.sh   # One-command database setup scripts
│   └── README.md              # Database documentation
├── TESTING.md                 # Comprehensive testing guide
├── DEPLOYMENT.md              # Deployment instructions
└── README.md                  # This file
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- Node.js 18+ and npm
- PHP 8.0+ with `pdo_mysql` extension enabled
- MySQL 5.7+ or 8.0+
- Composer (for PHP dependencies)

### 1. Clone and Setup Repository

```bash
git clone <your-repo-url>
cd g3-src-evoting-system
```

### 2. Database Setup

#### Option A: Automated Setup (Recommended)

**Windows:**
```bash
cd database
setup.bat
```

**Linux/macOS:**
```bash
cd database
chmod +x setup.sh
./setup.sh
```

#### Option B: Manual Setup

```bash
# Create database
mysql -u root -p
```
```sql
CREATE DATABASE evoting_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit
```

```bash
# Import schema
mysql -u root -p evoting_system < database/schemas/schema.sql

# Create default admin user
# Windows CMD:
type database/seeds/create_admin.sql | mysql -u root -p evoting_system
# Windows PowerShell:
Get-Content database/seeds/create_admin.sql | mysql -u root -p evoting_system
# Linux/macOS:
cat database/seeds/create_admin.sql | mysql -u root -p evoting_system
```

**Note:** The automated setup scripts handle both schema import and admin user creation automatically.

### 3. Backend Setup

```bash
cd backend

# Install PHP dependencies
composer install

# Copy environment template
cp .env.example .env

# Edit .env with your database credentials
# Default admin user will be created automatically:
# Registration: A999999Z
# Password: #adm!n@sup3r
```

**Edit `.env` file:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=evoting_system
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRY=900
FRONTEND_URL=http://localhost:3000
APP_ENV=development
APP_DEBUG=true
```

**Start PHP server:**
```bash
php -S localhost:8000 index.php
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env to point to backend
# Default: VITE_API_URL=http://localhost:8000
```

**Start Vite dev server:**
```bash
npm run start
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Default Admin**: A999999Z / #adm!n@sup3r

### New Features

- **Dark/Light Theme Toggle**: Icon button in header allows switching between themes
- **Improved Admin Dashboard**: Real-time statistics and activity timeline
- **Consistent Navigation**: Icon + text header links across all pages
- **Enhanced Security**: Clean URLs prevent file path exposure

---

## 🏗️ Architecture

### Authentication Flow

```
User submits login form
  → authService.js sends POST /api/auth/login.php
  → Backend validates credentials, applies rate limiting
  → Returns JWT token + user (id, role, name)
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
  → Logs action to audit_log table
```

### CORS & Routing (Backend)

```
All requests → backend/index.php (front controller)
  → Sets global security headers
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
  /dashboard    → voter home with voting history
  /voting       → cast votes
  /results      → view results

Admin Routes (JWT + role=admin required):
  /admin        → admin dashboard with real-time stats
  /admin/elections  → manage elections
  /admin/candidates → manage candidates
  /admin/results    → view vote analytics
  /admin/audit-logs → view system audit logs
```

---

## ⚙️ Configuration

### Backend Environment Variables

Edit `backend/.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=evoting_system

# JWT Configuration
JWT_SECRET=your_very_long_random_secret_min_32_chars
JWT_EXPIRY=900           # 15 minutes
JWT_REFRESH_EXPIRY=604800 # 7 days

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Environment
APP_ENV=development
APP_DEBUG=true
```

### Frontend Environment Variables

Edit `frontend/.env`:

```env
# Backend API URL
VITE_API_URL=http://localhost:8000

# Legacy support (optional)
REACT_APP_API_URL=http://localhost:8000
```

---

## 🔒 Security

### Implemented Security Measures

1. **Password Security**: bcrypt hashing with salt
2. **JWT Authentication**: Token-based auth with expiry
3. **Rate Limiting**: 5 requests per minute on login endpoint
4. **Input Validation**: Sanitization of all user inputs
5. **Security Headers**: CSP, HSTS, XSS protection, clickjacking prevention
6. **Audit Logging**: All admin actions tracked
7. **Vote Anonymity**: SHA-256 hashing of voter IDs
8. **Double Voting Prevention**: Database constraints
9. **CORS Protection**: Whitelisted origins only
10. **SQL Injection Prevention**: Prepared statements

### Security Best Practices

- Change default admin password immediately
- Use strong JWT secrets in production
- Enable HTTPS in production
- Regular security audits
- Keep dependencies updated
- Monitor audit logs regularly

---

## 🧪 Testing

See [TESTING.md](TESTING.md) for comprehensive testing procedures including:

- Local development testing
- Integration testing
- Security testing
- Performance testing
- Cross-origin testing

---

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions including:

- Railway backend deployment
- Vercel frontend deployment
- Environment configuration
- Database setup
- Security configuration
- Monitoring and maintenance

---

## � Troubleshooting

### Common Issues

#### Database Connection Failed

**Error**: `SQLSTATE[HY000] [2002] Connection refused`

**Solution**:
1. Verify MySQL is running
2. Check DB_HOST, DB_USER, DB_PASS in `.env`
3. Ensure `pdo_mysql` extension is enabled in PHP

#### CORS Errors

**Error**: `Access to fetch blocked by CORS policy`

**Solution**:
1. Check FRONTEND_URL in backend `.env`
2. Verify VITE_API_URL in frontend `.env`
3. Ensure backend is running on correct port

#### PHP Extension Issues

**Error**: `Class 'PDO' not found`

**Solution**:
1. Enable `extension=pdo_mysql` in `php.ini`
2. Restart PHP server
3. Verify PHP version is 8.0+

#### Frontend Build Errors

**Error**: Module not found or build failures

**Solution**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Getting Help

1. Check existing documentation files
2. Review error logs in browser console
3. Check PHP error logs
4. Verify all environment variables are set
5. Ensure all dependencies are installed

---

## 📚 Additional Documentation

- [Database Documentation](database/README.md) - Schema details and maintenance
- [Backend Documentation](backend/README.md) - API endpoints and architecture
- [Testing Guide](TESTING.md) - Comprehensive testing procedures
- [Deployment Guide](DEPLOYMENT.md) - Production deployment instructions

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Team

Group 3 - SRC E-Voting System Project

**Last Updated**: 2026-06-28

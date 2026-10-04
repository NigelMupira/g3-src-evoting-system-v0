# SRC E-Voting System

A secure, web-based election management platform for Student Representative Council (SRC) voting. Built with React, PHP, and MySQL, this system enables transparent and fair elections while ensuring voter privacy, vote integrity, and real-time auditability.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Demo Credentials](#demo-credentials)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Security](#security)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### For Voters

- **User Registration**: Create voter account with strict client & server-side validation (registration number, school, course, password complexity).
- **Secure Login**: JWT-based authentication with rate limiting and automatic session management.
- **Dynamic Home Page**: Displays live active elections fetched from the database with automated fallbacks.
- **Vote Casting**: Select candidates per position in active elections with immediate feedback and double-voting prevention.
- **Vote Privacy**: Votes are anonymous and cannot be traced back to individual voters (SHA-256 voter hash).
- **Results & Analytics**: View real-time election results, turnout progress, candidate standings, and statistical charts.
- **Voting History**: Track all previous voting activity and participation rates.
- **Full Light/Dark Theme**: Toggle between light and dark themes with persistent localStorage preference and complete Material-UI token integration.

### For Administrators

- **Election Management**: Create, edit, activate, and close elections (automatically seeds default positions upon creation).
- **Candidate Management**: Add, edit, and delete candidates with position dropdown selection and media URLs.
- **Real-time Monitoring**: Monitor live turnout percentages, vote totals, and candidate leaderboards.
- **Audit Logging**: Comprehensive activity logs tracking logins, registration, vote submissions, and admin modifications.
- **Admin Statistics**: Instant overview metrics on registered voters, total elections, votes cast, and active positions.

> **Note on Admin Accounts**: Admins log in via the standard login page (`/login`). Their role (`admin`) is stored securely in the database, and the system automatically routes them to the `/admin` panel upon login.

---

## 🛠️ Technology Stack

### Frontend

- **React** `^19.0.0` - UI framework
- **Vite** `^5.4.11` - Ultra-fast build tool and development server
- **React Router DOM** `^7.3.0` - SPA client-side routing with URL tab synchronization
- **Material-UI (MUI)** `^6.4.6` - Component library & theme engine (light + dark mode)
- **React Helmet Async** `^3.0.0` - SEO head management

### Backend

- **PHP** `8.0+` - RESTful API micro-services
- **MySQL** `8.0+` - Relational database schema with referential constraints & security tables
- **firebase/php-jwt** `^6.8` - JWT token creation and validation
- **vlucas/phpdotenv** `^5.5` - Environment variable configuration

### Production Hosting

- **Frontend**: Vercel (SPA rewrite rules & security headers via `vercel.json`)
- **Backend & DB**: Railway.app (Dynamic `$PORT` binding via `railway.json` + automatic Railway MySQL environment detection)

---

## 📁 Project Structure

```
g3-src-evoting-system/
├── frontend/                  # React + Vite application
│   ├── src/
│   │   ├── pages/             # Page components (Home, Login, Register, User/Admin dashboards)
│   │   ├── components/        # Reusable UI components (Header, ThemeToggle, ProtectedRoute)
│   │   ├── context/           # Global state (AuthContext, ThemeContext)
│   │   ├── services/          # API service layer (api.js, authService, electionService, etc.)
│   │   ├── theme/             # Material-UI custom theme (light & dark mode configurations)
│   │   ├── App.js             # Root app with routing
│   │   └── index.js           # App entry point
│   ├── vercel.json            # Vercel SPA routing rewrites & security headers
│   ├── vite.config.js         # Vite configuration
│   └── package.json
├── backend/                   # PHP API
│   ├── api/
│   │   ├── auth/              # login.php, register.php, logout.php
│   │   ├── elections/         # list.php, get.php, create.php, update.php, delete.php
│   │   ├── candidates/        # list.php, create.php, update.php, delete.php
│   │   ├── positions/         # list.php
│   │   ├── votes/             # submit.php, validate.php, results.php, history.php
│   │   ├── admin/             # stats.php, activity.php, audit-logs.php
│   │   ├── health.php         # System health check endpoint
│   │   └── middleware/        # JWTAuth, AdminAuth, RateLimiter, SecurityHeaders, etc.
│   ├── config/                # database.php (PDO connection with Railway auto-detection)
│   ├── index.php              # Front controller (dynamic CORS + API routing)
│   ├── railway.json           # Railway build & start command configuration
│   └── composer.json
├── database/
│   ├── schemas/schema.sql     # MySQL table schema
│   ├── seeds/                 # Demo data & admin seeder scripts
│   │   ├── seed_demo_data.php # Comprehensive seeder (election, candidates, 100+ votes, logs)
│   │   └── create_admin.sql   # Standalone admin SQL script
│   └── setup.bat / setup.sh   # One-command database setup scripts
├── DEPLOYMENT.md              # Vercel & Railway deployment guide
├── TESTING.md                 # Testing procedures & verification matrix
└── README.md                  # Project overview documentation
```

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Database Setup

```bash
# Clone repository
git clone <repository-url>
cd g3-src-evoting-system

# Create MySQL database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS evoting_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Import schema
mysql -u root -p evoting_system < database/schemas/schema.sql

# Seed demo data (creates active election, candidates, sample votes, admin & voter accounts)
php database/seeds/seed_demo_data.php
```

### 2. Backend Setup

```bash
cd backend

# Install PHP dependencies
composer install

# Copy environment configuration
cp .env.example .env

# Start PHP built-in server (uses index.php front controller)
php -S localhost:8000 index.php
```

### 3. Frontend Setup

```bash
cd frontend

# Install Node modules
npm install

# Start Vite development server
cmd /c "npm run start"
```

Access the application at `http://localhost:3000`.

---

## 🔑 Demo Credentials

| Role | Registration No. / Username | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `A999999Z` | `#adm!n@sup3r` | Full admin dashboard, election/candidate management, results analytics, audit logs |
| **Sample Voter** | `H230828V` | `Student@123` | Student dashboard, vote casting, ballot validation, personal voting history |

---

## 🏗️ Architecture & Control Flow

### Dynamic CORS & Routing
All backend API traffic routes through `backend/index.php`. It applies:
1. Dynamic CORS origin matching (permits `http://localhost:3000`, `http://localhost:5173`, and any `https://*.vercel.app` domain).
2. OWASP security headers (X-Frame-Options, Content-Security-Policy, X-Content-Type-Options).
3. Expressive routing to sub-controllers in `backend/api/`.

### Railway MySQL Auto-Detection
`backend/config/database.php` automatically parses Railway's standard environment variables (`MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, `MYSQLPORT`, `MYSQL_URL`) alongside standard `.env` values, enabling seamless zero-config database connectivity on Railway deployments.

### Tab Navigation Persistence
`UserDashboard.js` and `AdminDashboard.js` synchronize active tab state (`Dashboard`, `Vote`, `Results`, `ManageElections`, `ManageCandidates`, `AuditLogs`) directly with browser URL parameters (e.g. `/dashboard?tab=Results`). This enables browser Back/Forward navigation without kicking users back to login.

---

## 🔒 Security Summary

1. **Password Hashing**: bcrypt algorithm with auto-generated salts.
2. **Anonymous Voting**: Voter identity hashed using `SHA-256(regNumber + positionId + electionId)`. Voter registration IDs are never linked to vote choices.
3. **Double Voting Prevention**: Unique composite key constraint `(voter_id_hash, position_id, election_id)` at the database level.
4. **Rate Limiting**: IP and registration-based request throttling on sensitive endpoints.
5. **Token Security**: Expirable JWT Bearer tokens with server-side validation and role verification.

---

## 🧪 Testing

Refer to [TESTING.md](TESTING.md) for full details on verifying endpoints, testing local authentication flows, and verifying production builds.

---

## 🚀 Deployment

Refer to [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step instructions on deploying the frontend to **Vercel** and the PHP backend/MySQL database to **Railway**.

---

## 📄 License & Team

Developed by **Group 3** - SRC E-Voting System Project.
Licensed under the MIT License.

**Last Updated**: 2026-10-05

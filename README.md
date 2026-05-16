# SRC E-Voting System

A secure, web-based election management platform for Student Representative Council (SRC) voting. Built with React, PHP, and MySQL, this system enables transparent and fair elections while ensuring voter privacy and vote integrity.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Development](#development)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### For Voters
- **User Registration**: Create account with validation (registration number format, password strength)
- **Secure Login**: JWT-based authentication with "Remember Me" option
- **Vote Casting**: Select one candidate per position in active elections
- **Vote Privacy**: Votes are anonymous and cannot be traced back to voters
- **Results Viewing**: View real-time election results after voting ends
- **Candidate Info**: Access candidate profiles with bios and manifestos
- **Logout**: Secure session termination

### For Administrators
- **Election Management**: Create, edit, activate, and close elections
- **Candidate Management**: Add, edit, and manage candidates with media (photos, videos, manifestos)
- **Real-time Monitoring**: View live voting statistics and participation rates
- **Results Analytics**: Generate reports and visualize results with charts
- **Audit Logging**: Track all system activities and admin actions
- **User Management**: View registered voters and participation history (anonymized)

### Security Features
- **Password Security**: Passwords hashed with bcrypt on backend
- **Authentication**: JWT tokens with 15-minute expiry for access tokens
- **Vote Privacy**: Voter IDs hashed/encrypted; votes are anonymous
- **Input Validation**: Client and server-side validation of all inputs
- **Prevention of Double Voting**: Backend prevents users from voting multiple times
- **HTTPS**: Enforced in production environments
- **Audit Trail**: All admin actions logged for accountability

---

## 🛠️ Technology Stack

### Frontend
- **React** `^19.0.0` - UI framework
- **React Router DOM** `^7.3.0` - Client-side routing
- **Material-UI (MUI)** `^6.4.6` - Component library & icons
- **Emotion** `^11.14.0` - CSS-in-JS styling
- **React Helmet** `^6.1.0` - Document head management (SEO)

### Backend (To Be Implemented)
- **PHP** 8.0+ - Server-side logic
- **MySQL** 8.0+ - Database
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

### Hosting
- **Frontend**: Vercel (free tier)
- **Backend**: Railway.app (free tier) or Render
- **Database**: PlanetScale MySQL (free tier) or managed hosting

### Development Tools
- **Node.js** 16+ & npm/yarn - Package management
- **Create React App** - Build tooling
- **Jest & React Testing Library** - Testing frameworks

---

## 📁 Project Structure

```
src/
├── components/                  # Reusable UI components
│   ├── common/                  # Shared across app
│   │   ├── Header.js           # Navigation header
│   │   ├── Sidebar.js          # Dashboard sidebar
│   │   └── ProtectedRoute.js   # Route protection wrapper
│   ├── auth/                    # Authentication components
│   ├── voting/                  # Voting-related components
│   └── admin/                   # Admin-specific components
│
├── pages/                       # Full page components
│   ├── Home.js                 # Landing page
│   ├── Login.js                # Login page
│   ├── Register.js             # Registration page
│   ├── user/                   # Voter pages
│   │   ├── UserDashboard.js   # Main dashboard
│   │   ├── VotingPage.js      # Voting interface
│   │   └── ResultsPage.js     # Results display
│   └── admin/                  # Admin pages
│       ├── AdminDashboard.js  # Admin dashboard
│       ├── ManageElections.js # Elections management
│       ├── ManageCandidates.js # Candidates management
│       └── ViewResults.js     # Results analytics
│
├── context/                     # React Context for state
│   └── AuthContext.js          # Global authentication state
│
├── hooks/                       # Custom React hooks
│   └── useAuth.js              # Authentication hook
│
├── services/                    # API communication layer
│   ├── api.js                  # Base HTTP client
│   ├── authService.js          # Auth API calls
│   ├── electionService.js      # Election API calls
│   ├── voteService.js          # Voting API calls
│   └── adminService.js         # Admin API calls
│
├── utils/                       # Utility functions
│   ├── constants.js            # App-wide constants
│   ├── validators.js           # Input validation functions
│   ├── helpers.js              # Helper utilities
│   └── formatters.js           # Data formatting
│
├── data/                        # Static/mock data
│   ├── mockData.js             # Mock elections (dev only)
│   └── schools.js              # Schools & courses data
│
├── styles/                      # CSS files
│   ├── index.css               # Global styles
│   ├── variables.css           # CSS variables
│   └── globals.css             # Global resets
│
├── assets/                      # Static files
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── App.js                       # Root component
├── index.js                     # Entry point
├── index.css                    # Global styles
├── .env.example                 # Environment variables template
└── .gitignore                   # Git ignore rules
```

### File Organization Principles
- **Components** folder: Reusable UI components organized by feature
- **Pages** folder: Full-page components (composition of smaller components)
- **Services** folder: API communication (keeps components clean)
- **Utils** folder: Shared utilities (validation, formatting, helpers)
- **Context** folder: Global state management
- **Data** folder: Static/mock data (schools, demo elections, etc.)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Modern web browser
- MySQL server (local or remote) for backend

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd g3-src-evoting-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and set the API URL (when backend is ready)

4. **Start development server**
   ```bash
   npm start
   ```
   App opens at http://localhost:3000

### Available Scripts

```bash
npm start       # Start development server (http://localhost:3000)
npm run build   # Build for production
npm test        # Run tests
npm run eject   # Eject from Create React App (irreversible)
```

---

## ⚙️ Configuration

### Environment Variables

Create `.env.local` file in project root:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8000  # PHP backend URL
REACT_APP_ENV=development                 # Environment (development, staging, production)
```

### For Production
- Set `REACT_APP_API_URL` to your deployed backend URL
- Ensure HTTPS is used for all API calls
- Set `REACT_APP_ENV=production`

---

## 🔧 Development

### Code Style & Comments

This project emphasizes readable, well-commented code:

- **Section-level comments**: Group related code with comment blocks
- **Function documentation**: Comments explain WHY, not WHAT
- **No excessive comments**: Code should be self-documenting where possible
- **Update comments with changes**: Keep comments in sync with code

Example:
```javascript
// ============================================
// Authentication Handler
// ============================================
// Handles user login and token storage

const handleLogin = async (regNumber, password) => {
  // Validate input before API call
  if (!validateForm()) return;
  
  try {
    // Backend validates credentials and returns JWT token
    const response = await login(regNumber, password);
    // ... rest of code
  } catch (error) {
    setErrors({ api: error.message });
  }
};
```

### Working with Components

1. **Creating new components**:
   - Place in `src/components/` organized by feature
   - Use functional components with hooks
   - Add prop documentation comments

2. **Using services**:
   - Import from `src/services/`
   - Services handle all API communication
   - Components stay clean and focused on UI

3. **Global state**:
   - Use `useAuth()` hook from `AuthContext`
   - Other global state should use React Context

### Adding New Features

1. Create API service in `src/services/`
2. Create component in `src/components/`
3. Create or update page in `src/pages/`
4. Add route to `App.js` if needed
5. Add comments throughout code
6. Test locally before pushing

---

## 🏗️ Architecture

### Authentication Flow
```
User Logs In → Frontend validates input → API call to backend
Backend validates credentials → Returns JWT token → Token stored in localStorage
Token included in all subsequent API requests → Automatic redirect on 401 (token expired)
```

### Vote Submission Flow
```
Voter selects candidates → Submits votes → Backend receives votes with JWT token
Backend verifies voter hasn't voted before → Encrypts vote → Stores with hashed voter ID
Vote is anonymous (voter ID not stored with vote) → Results updated in real-time
```

### Role-Based Access
```
Public Routes (no auth needed):
  / (Home)
  /login
  /register

Protected Voter Routes:
  /dashboard
  /voting
  /results

Protected Admin Routes (requires admin role):
  /admin
  /admin/elections
  /admin/candidates
  /admin/results
```

---

## 🧪 Testing

### Frontend Testing
- Component rendering
- User interactions (login, voting, form submission)
- Validation logic
- Protected routes

Run tests:
```bash
npm test
```

### Manual Testing Checklist
- [ ] Register new user account
- [ ] Login with valid credentials
- [ ] Login with invalid credentials shows error
- [ ] Logout clears authentication
- [ ] Cannot access /dashboard without login
- [ ] Can vote in active election
- [ ] Cannot vote twice in same election
- [ ] Admin can create election
- [ ] Admin can add candidates
- [ ] View results shows correct vote counts
- [ ] Responsive design works on mobile

---

## 📊 API Documentation

When backend is ready, API endpoints will include:

```
Authentication:
  POST /api/auth/register.php
  POST /api/auth/login.php
  POST /api/auth/logout.php
  POST /api/auth/forgot-password.php

Elections:
  GET  /api/elections/list.php
  GET  /api/elections/get.php?id=1
  POST /api/elections/create.php
  PUT  /api/elections/update.php?id=1
  DELETE /api/elections/delete.php?id=1

Candidates:
  GET  /api/candidates/list.php
  POST /api/candidates/create.php
  PUT  /api/candidates/update.php?id=1
  DELETE /api/candidates/delete.php?id=1

Voting:
  GET  /api/votes/check.php?electionId=1
  POST /api/votes/submit.php
  GET  /api/votes/results.php?electionId=1

Admin:
  GET  /api/admin/stats.php
  GET  /api/audit/log.php
```

---

## 🚢 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variable: `REACT_APP_API_URL=<backend-url>`
4. Deploy automatically on push

### Backend (Railway.app or similar)

See backend repository for PHP/MySQL deployment instructions.

---

## 🤝 Contributing

### Before Making Changes
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes with comments
3. Update related tests
4. Commit with clear message: `git commit -m "Add feature description"`
5. Push and create Pull Request

### Code Review Checklist
- [ ] Code is commented and understandable
- [ ] No console errors or warnings
- [ ] Follows project structure
- [ ] Tests pass
- [ ] Security best practices followed
- [ ] No hardcoded credentials or secrets

---

## 📝 License

This project is part of an academic group project. See LICENSE file for details.

---

## 💬 Support & Questions

For questions or issues:
1. Check existing documentation in SETUP.md
2. Review code comments for implementation details
3. Check error messages and logs for debugging
4. Create an issue in the repository

---

## 📅 Timeline & Milestones

- **Phase 1**: ✅ Frontend fixes & setup (current)
- **Phase 2**: Backend API development (PHP + MySQL)
- **Phase 3**: Frontend-Backend integration
- **Phase 4**: Admin functionality implementation
- **Phase 5**: Security hardening & testing
- **Phase 6**: Deployment & launch

---

**Last Updated**: 2026-05-17  
**Version**: 0.1.0

# Frontend - React E-Voting System

## Architecture
React 19+ frontend with Material-UI, integrated with PHP backend API. Features JWT-based authentication, role-based routing, and comprehensive admin/user interfaces.

## Directory Structure
```
frontend/
├── src/
│   ├── pages/                # Page components
│   │   ├── Home.js          # Landing page
│   │   ├── Login.js         # Authentication with admin routing
│   │   ├── Register.js      # User registration
│   │   ├── user/
│   │   │   ├── UserDashboard.js    # User home dashboard
│   │   │   ├── UserDashboardHome.js # Enhanced user dashboard with history
│   │   │   ├── VotingPage.js       # Cast votes interface
│   │   │   └── ResultsPage.js      # View election results
│   │   └── admin/
│   │       ├── AdminDashboard.js        # Admin overview
│   │       ├── AdminDashboardHome.js   # Enhanced admin dashboard with stats
│   │       ├── ManageElections.js       # Election CRUD
│   │       ├── ManageCandidates.js      # Candidate management
│   │       ├── ViewResults.js           # Admin results view
│   │       └── AuditLogs.js             # Audit log viewer
│   ├── components/          # Reusable UI components
│   │   └── common/
│   │       ├── Header.js               # Enhanced header with icon and navigation
│   │       └── ThemeToggle.js          # Dark/light theme toggle button
│   ├── context/             # Global state
│   │   ├── AuthContext.js              # Authentication and user role management
│   │   └── ThemeContext.js            # Theme management (dark/light mode)
│   ├── services/            # API service layer
│   │   ├── api.js          # Centralized HTTP client
│   │   ├── authService.js  # Login, register, logout
│   │   ├── electionService.js # Election CRUD
│   │   ├── voteService.js  # Voting and results
│   │   └── auditService.js # Audit log access
│   ├── theme/              # Material-UI custom theme (light + dark)
│   ├── App.js             # Root app with routing
│   └── index.js           # App entry point
├── public/                # Static assets
│   └── srcev1.ico         # App icon
├── index.html            # Vite HTML entry
├── vite.config.js        # Vite configuration
├── .env.example          # Environment variables template
└── package.json
```

## Setup

### Prerequisites
- Node.js 18+ and npm 9+

### Steps
1. **Install dependencies**:  
   ```bash  
   cd frontend  
   npm install  
   ```  
2. **Create environment file**:  
   ```env  
   VITE_API_URL=http://localhost:8000  
   ```  
3. **Start server**:  
   ```bash  
   npm start  
   ```  

## Key Components

### Authentication
- **AuthContext**: Manages JWT tokens and user role (admin/student)
- **ThemeContext**: Manages dark/light theme preference with localStorage persistence
- **api.js**: Centralized HTTP client with automatic token handling
- **authService.js**: Login, register, logout logic

### User Features
- **UserDashboardHome**: Enhanced dashboard with voting history and participation tracking
- **VotingPage**: Select candidates per position and submit votes
- **ResultsPage**: View real-time election results

### Admin Features
- **AdminDashboardHome**: Real-time statistics and activity feed
- **ManageElections**: Create/edit/delete elections
- **ManageCandidates**: Add/edit candidates for elections
- **ViewResults**: Detailed results with analytics and export
- **AuditLogs**: View system audit logs with filtering

### UI Improvements
- **Header Component**: App icon (srcev1.ico), clickable navigation links, theme toggle
- **Dark/Light Theme**: Toggle button with localStorage persistence
- **Enhanced Design**: Fixed rounded corners, better spacing, improved UX
- **Browser History**: Better back button behavior
- **Clean URLs**: Client-side routing prevents file path exposure

## Security Notes
- **JWT security**: Tokens stored in localStorage with automatic expiration
- **CORS**: Restricted to known origins
- **Input validation**: Client and server-side checks
- **HTTPS**: Enforced in production

**Last Updated**: 2026-07-02

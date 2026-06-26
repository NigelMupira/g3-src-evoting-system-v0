# Frontend - React E-Voting System  

## Architecture  
The frontend is built with React 19+ and Material-UI, integrated with a PHP backend API. Key components include:  
- **Authentication**: JWT-based login with role-based routing (admin/student).  
- **Voting flow**: Register → Login → Browse elections → Cast votes → View results.  
- **Admin panel**: Manage elections, candidates, and results.  

## Directory Structure  
```
frontend/
├── src/
│   ├── pages/                # Page components (Home, Login, Register, dashboards)
│   │   ├── Home.js          # Landing page
│   │   ├── Login.js         # Authentication with admin routing
│   │   ├── Register.js      # User registration
│   │   ├── user/
│   │   │   ├── UserDashboard.js    # User home dashboard
│   │   │   ├── VotingPage.js       # Cast votes interface
│   │   │   └── ResultsPage.js      # View election results
│   │   └── admin/
│   │       ├── AdminDashboard.js        # Admin overview
│   │       ├── ManageElections.js       # Election CRUD
│   │       ├── ManageCandidates.js      # Candidate management
│   │       └── ViewResults.js           # Admin results view
│   ├── components/          # Reusable UI components
│   ├── context/             # Global state (AuthContext)
│   ├── services/            # API service layer (api.js, authService.js, etc.)
│   ├── theme/              # Material-UI custom theme (school colors)
│   ├── App.js             # Root app with routing and protected routes
│   └── index.js           # App entry point
├── public/                # Static assets
├── index.html            # Vite HTML entry (root of frontend/)
├── vite.config.js        # Vite configuration
└── package.json
```

## Setup  
### Prerequisites  
- Node.js 18+ and npm 9+  
- Git  

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

## Frontend Components and Flow  
### Key Components  
- **AuthContext**: Manages JWT tokens and user role (admin/student).  
- **api.js**: Handles API requests with interceptors for JWT.  
- **authService.js**: Login, register, logout logic.  
- **voteService.js**: Submit votes and validate eligibility.  

### User Flow  
1. **Register**: Create account with regNumber and password.  
2. **Login**: Authenticate and receive JWT token.  
3. **Browse elections**: View active elections from the backend.  
4. **Cast votes**: Select candidates per position and submit.  
5. **View results**: Real-time results from the backend.  

### Admin Flow  
1. **Login as admin**: Redirect to `/admin` after login.  
2. **Manage elections**: Create/edit/delete elections.  
3. **Manage candidates**: Add/edit candidates for elections.  
4. **View analytics**: Detailed results and statistics.  

## Security Notes  
- **JWT security**: Tokens stored in memory and httpOnly cookies.  
- **CORS**: Restricted to known origins in `index.html`.  
- **Input validation**: Client and server-side checks to prevent invalid data.  
- **HTTPS**: Enforced in production for secure communication.  

**Last Updated**: 2026-06-26

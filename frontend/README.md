# Frontend - React E-Voting System

React-based frontend for the SRC E-Voting System using Material-UI and integrated with PHP backend API.

## Setup

1. Navigate to frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Create `.env.local` file with backend API URL:
```
REACT_APP_API_URL=http://localhost:3000
REACT_APP_ENV=development
```
4. Start development server: `npm start`

The frontend runs on `http://localhost:3000` by default and communicates with the backend PHP API.

## Project Structure

```
src/
├── pages/                # Page components
│   ├── Home.js          # Landing page
│   ├── Login.js         # Authentication with admin routing
│   ├── Register.js      # User registration
│   ├── user/
│   │   ├── UserDashboard.js    # User home dashboard
│   │   ├── VotingPage.js       # Cast votes interface
│   │   └── ResultsPage.js      # View election results
│   └── admin/
│       ├── AdminDashboard.js        # Admin overview
│       ├── ManageElections.js       # Election CRUD
│       ├── ManageCandidates.js      # Candidate management
│       └── ViewResults.js           # Admin results view
├── components/          # Reusable UI components
├── context/
│   └── AuthContext.js   # Global authentication state with JWT
├── services/            # API service layer (Phase 3 integrated)
│   ├── api.js          # Axios wrapper with interceptors
│   ├── authService.js  # Login, register, logout
│   ├── electionService.js # Election APIs
│   ├── voteService.js  # Voting and results APIs
│   └── adminService.js # Admin management APIs
├── theme/              # Material-UI theme configuration
├── App.js              # Main app with routing and protected routes
└── index.js            # React entry point
```

## Features

- **Authentication**: JWT-based login/register with role-based access (admin/student)
- **Voting**: Students cast votes for positions with progress tracking
- **Results**: Real-time view of election results with statistics
- **Admin Panel**: Manage elections, candidates, and view detailed results
- **Responsive Design**: Material-UI components with professional styling
- **API Integration**: Full backend integration with real API calls (Phase 3)

## Available Scripts

- `npm start` - Run development server (port 3000)
- `npm test` - Run test suite
- `npm run build` - Build production bundle
- `npm run eject` - Eject from Create React App (not reversible)

## API Integration (Phase 3)

The frontend is fully integrated with the PHP backend API. All components use service layer for API calls:

**Authentication**:
- Login with registration number and password
- Admin accounts (reg starting with "ADMIN") redirect to `/admin`
- JWT tokens stored in memory + httpOnly cookies

**User Flow**:
1. Register/Login → Get JWT token
2. Browse active elections
3. Select election → View candidates by position
4. Cast votes → Review and confirm
5. View results with statistics

**Admin Flow**:
1. Login with ADMIN account
2. Create/edit/delete elections
3. Manage candidates for elections
4. View detailed results and analytics

## Environment Variables

```
REACT_APP_API_URL    # Backend API URL (e.g., http://localhost:3000)
REACT_APP_ENV        # Environment (development/production)
```

## Deployment

Deploy to Vercel with the following steps:
1. Push frontend code to GitHub
2. Connect Vercel to GitHub repository
3. Set environment variables in Vercel dashboard
4. Vercel auto-deploys on push to main branch

## Testing

Test the complete flow:
1. Register new student account (e.g., `SRC001`, password)
2. Login and select an election
3. Vote for all positions
4. Submit votes and view results
5. Login as admin (`ADMIN001`) to manage elections

## Status

- ✅ Frontend UI complete
- ✅ Phase 3: API integration complete
- ⏳ Backend deployment pending
- ⏳ Database setup pending

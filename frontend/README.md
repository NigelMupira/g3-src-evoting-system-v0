# Frontend - React E-Voting System

React-based frontend for the SRC E-Voting System using Material-UI.

## Setup

1. Navigate to frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Create `.env.local` file:
```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development
```
4. Start development server: `npm start`

## Project Structure

```
src/
├── pages/              # Page components
│   ├── Home.js
│   ├── Login.js
│   ├── Register.js
│   ├── user/
│   │   ├── UserDashboard.js
│   │   ├── VotingPage.js
│   │   └── ResultsPage.js
│   └── admin/
│       ├── AdminDashboard.js
│       ├── ManageElections.js
│       ├── ManageCandidates.js
│       └── ViewResults.js
├── components/         # Reusable components
├── context/            # React Context (AuthContext)
├── services/           # API service layer
│   ├── api.js         # Axios wrapper
│   ├── authService.js
│   ├── electionService.js
│   ├── voteService.js
│   └── adminService.js
├── theme/             # Material-UI theme configuration
├── App.js             # Main app component with routing
└── index.js           # React entry point
```

## Key Features

- Authentication with JWT tokens
- Student voting interface
- Admin dashboard for election management
- Real-time results viewing
- Responsive Material-UI design

## Available Scripts

- `npm start` - Run development server
- `npm test` - Run tests
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App (not reversible)

## Deployment

Built and deployed to Vercel. Environment variables configured in Vercel dashboard.

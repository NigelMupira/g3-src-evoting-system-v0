# Frontend - SRC E-Voting System (React + Vite)

## Architecture

React 19 single-page application built with Vite and Material-UI (MUI v6). Communicates with the PHP REST backend via a centralized Axios/Fetch API client layer (`api.js`).

## Directory Structure

```
frontend/
├── src/
│   ├── pages/                # Page views
│   │   ├── Home.js           # Dynamic landing page (fetches active elections)
│   │   ├── Login.js          # Authentication with role-based routing
│   │   ├── Register.js       # Student voter account creation
│   │   ├── user/
│   │   │   ├── UserDashboard.js     # Voter layout with sidebar & URL tab state
│   │   │   ├── UserDashboardHome.js # Voter summary, stats & participation
│   │   │   ├── VotingPage.js        # Cast vote interface per position
│   │   │   └── ResultsPage.js       # Real-time election turnout & candidate counts
│   │   └── admin/
│   │       ├── AdminDashboard.js     # Admin layout with URL tab state
│   │       ├── AdminDashboardHome.js # Real-time election metrics & system health
│   │       ├── ManageElections.js    # Create/edit/delete elections
│   │       ├── ManageCandidates.js   # Manage candidates with position dropdown
│   │       ├── ViewResults.js        # Detailed vote analytics & chart statistics
│   │       └── AuditLogs.js          # System security audit log viewer
│   ├── components/           # Reusable UI components
│   │   └── common/
│   │       ├── Header.js            # Main navigation header with theme toggle
│   │       └── ThemeToggle.js       # Dark/light theme mode button
│   ├── context/              # Context Providers
│   │   ├── AuthContext.js           # Auth state, login/logout, JWT token storage
│   │   └── ThemeContext.js          # Theme mode (light/dark) with localStorage sync
│   ├── services/             # API Service layer
│   │   ├── api.js               # Centralized HTTP client
│   │   ├── authService.js       # Authentication requests
│   │   ├── electionService.js   # Election API calls
│   │   ├── voteService.js       # Vote submission & history API calls
│   │   └── auditService.js      # Audit log API calls
│   ├── theme/               # Material-UI Theme Definition
│   │   └── theme.js             # Light & Dark color palettes & MUI component overrides
│   ├── App.js                # App router and routes definition
│   └── index.js              # Application entry point
├── vercel.json               # Vercel SPA routing rewrite rules & security headers
├── vite.config.js            # Vite build configuration
├── package.json              # NPM dependencies & build scripts
└── README.md                 # Frontend documentation
```

## Setup & Running

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Create `.env` in `frontend/`:
```env
VITE_API_URL=http://localhost:8000
```

### 3. Development Server

```bash
npm run start
```
Vite will start the dev server at `http://localhost:3000`.

### 4. Build for Production

```bash
npm run build
```
Generates production assets in `frontend/dist/`.

## Key Highlights & Improvements

1. **Full Light/Dark Theme Engine**: `ThemeContext.js` applies custom MUI palettes (`lightTheme` and `darkTheme`). Components use theme tokens (`bgcolor: 'background.default'`, `bgcolor: 'background.paper'`, `color: 'text.primary'`, `borderColor: 'divider'`) ensuring sleek dark mode rendering without stark white or harsh contrast boxes.
2. **Browser History & URL Sync**: Both `UserDashboard.js` and `AdminDashboard.js` use `useSearchParams` (`?tab=Results`, `?tab=Vote`, etc.) so clicking browser back/forward buttons navigates between tabs smoothly without logging out or redirecting.
3. **Dynamic Landing Page**: `Home.js` queries `electionService.getActiveElections()` on load to display real election dates, election titles, and timeline progress.
4. **Vercel SPA Compatibility**: Includes `vercel.json` with rewrites sending all routes to `/index.html` to prevent 404 errors on deep URL reloads.

**Last Updated**: 2026-10-05

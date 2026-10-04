# Testing Guide - SRC E-Voting System

This guide outlines verification and testing procedures for the SRC E-Voting System frontend and backend APIs.

---

## 1. Local Testing Setup

### Environment Verification
1. MySQL Database running locally on `localhost:3306`.
2. Database `evoting_system` seeded using `php database/seeds/seed_demo_data.php`.
3. Backend PHP server running via `php -S localhost:8000 index.php` in `backend/`.
4. Frontend Vite dev server running via `npm run start` in `frontend/`.

---

## 2. Test Cases Matrix

### A. Authentication & Role-Based Access
- [x] **Voter Login**: Sign in with `H230828V` / `Student@123`. Redirects to `/dashboard`.
- [x] **Admin Login**: Sign in with `A999999Z` / `#adm!n@sup3r`. Redirects to `/admin`.
- [x] **Invalid Credentials**: Sign in with dummy credentials. Verify proper error message banner.
- [x] **Protected Routes**: Navigate directly to `/admin` while unauthenticated. System redirects to `/login`.

### B. Student Dashboard & Voting
- [x] **Active Election Display**: Landing page (`/`) and Dashboard (`/dashboard`) load "SRC General Elections 2026" details.
- [x] **Vote Validation**: Click "Vote Now" on an active position. Select candidate and submit. Verify vote confirmation message.
- [x] **Double-Voting Prevention**: Try voting again for the same position. System blocks submission and indicates position already voted.
- [x] **Voting History**: Check `/dashboard?tab=Dashboard`. Verify voted positions count and last vote timestamp update.

### C. Admin Dashboard & Management
- [x] **Dashboard Metrics**: Check `/admin?tab=Dashboard`. Verify total voters, active elections, candidate counts, and vote totals load dynamically.
- [x] **Candidate Position Dropdown**: Go to `/admin?tab=ManageCandidates`. Click "Add Candidate". Verify position selector renders dynamically fetched position names (President, VP, etc.) instead of raw numbers.
- [x] **Results Page Integrity**: Go to `/admin?tab=ViewResults`. Select election. Verify total vote counters and candidate vote distributions display correctly without blank screens or null reference errors.
- [x] **Audit Logs**: Go to `/admin?tab=AuditLogs`. Verify login, vote creation, and candidate management actions are logged with timestamps.

### D. UI Theme & Navigation
- [x] **Dark Mode Toggle**: Click theme toggle button in header. Page container background switches to dark theme (`#121212`), paper cards switch to `#1E1E1E`, and typography adjusts to `#FFFFFF`.
- [x] **Theme Persistence**: Refresh browser after enabling Dark Mode. Theme remains dark.
- [x] **Browser Back/Forward Buttons**: Click between "Dashboard", "Vote", and "Results" tabs. Use browser back button. Active tab updates correctly without logging out.

---

## 3. Production Build Verification

```bash
cd frontend
cmd /c "npm run build"
```
Verify build succeeds with exit code 0 and dist assets generated clean.

**Last Updated**: 2026-10-05

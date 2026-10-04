# Backend - SRC E-Voting System API (PHP + REST)

## Architecture

The backend is built with PHP 8+ and follows a Front Controller design pattern (`index.php`). All requests route through `index.php`, which handles dynamic CORS header resolution, security headers, preflight `OPTIONS` requests, and forwards requests to the targeted API script.

## Directory Structure

```
backend/
├── index.php                 # Front controller: CORS headers, routing & error catching
├── railway.json              # Railway deployment config ($PORT binding & start script)
├── config/
│   └── database.php          # PDO connection with auto-detection for Railway MySQL env vars
├── api/
│   ├── auth/
│   │   ├── login.php         # POST: Authenticate user & return JWT token
│   │   ├── register.php      # POST: Register new student voter account
│   │   └── logout.php        # POST: Revoke session token
│   ├── elections/
│   │   ├── list.php          # GET: List all elections or filter active elections
│   │   ├── get.php           # GET: Get election details by ID
│   │   ├── create.php        # POST: Create election (auto-seeds 4 default positions)
│   │   ├── update.php        # PUT: Update election parameters
│   │   └── delete.php        # DELETE: Remove election and associated data
│   ├── positions/
│   │   └── list.php          # GET: List positions for a given election
│   ├── candidates/
│   │   ├── list.php          # GET: List candidates for election/position
│   │   ├── create.php        # POST: Add new candidate
│   │   ├── update.php        # PUT: Update candidate info
│   │   └── delete.php        # DELETE: Remove candidate
│   ├── votes/
│   │   ├── submit.php        # POST: Cast anonymous vote for candidate
│   │   ├── validate.php      # GET: Check if voter is eligible for position
│   │   ├── results.php       # GET: Summarize election vote counts & percentages
│   │   └── history.php       # GET: Fetch authenticated user's voting history
│   ├── admin/
│   │   ├── stats.php         # GET: Admin system metrics summary
│   │   ├── activity.php      # GET: Activity timeline feed
│   │   └── audit-logs.php    # GET: Security audit log entries
│   ├── health.php            # GET: System health check (DB connectivity & status)
│   └── middleware/
│       ├── JWTAuth.php       # Token generation, parsing & validation
│       ├── AdminAuth.php     # Role check helpers (requireAuth, requireAdmin)
│       ├── RateLimiter.php   # IP & endpoint rate limiting
│       └── SecurityHeaders.php # HTTP security response headers
├── models/
│   ├── User.php              # User operations & password hashing
│   ├── Election.php          # Election queries
│   ├── Candidate.php         # Candidate queries
│   └── Vote.php              # Vote insertion & result aggregation
└── composer.json             # Dependencies (firebase/php-jwt, vlucas/phpdotenv)
```

## Environment Configuration

Configure `backend/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=evoting_system
JWT_SECRET=your_jwt_secret_key_at_least_32_characters
JWT_EXPIRY=900
FRONTEND_URL=http://localhost:3000
```

### Railway Deployment Auto-Detection
When running on Railway, `backend/config/database.php` automatically detects Railway's injected MySQL environment variables (`MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, `MYSQLPORT`, `MYSQL_URL`) without requiring manual `.env` file updates.

## API Endpoints Reference

### Public & Health Endpoints

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| GET | `/api/health.php` | None | Returns `{"status":"healthy","database":"connected"}` |
| POST | `/api/auth/register.php` | None | Registers a new voter account |
| POST | `/api/auth/login.php` | None | Authenticates voter/admin, returns JWT token |

### Elections & Positions

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| GET | `/api/elections/list.php` | None | Get all elections |
| GET | `/api/elections/list.php?active=true` | None | Get active elections for voting |
| GET | `/api/elections/get.php?id={id}` | None | Get single election details |
| POST | `/api/elections/create.php` | Admin | Create election (auto-seeds 4 default positions) |
| PUT | `/api/elections/update.php?id={id}` | Admin | Update election dates/status |
| DELETE | `/api/elections/delete.php?id={id}` | Admin | Delete election |
| GET | `/api/positions/list.php?election_id={id}` | None | Get positions for election |

### Candidates & Voting

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| GET | `/api/candidates/list.php?election_id={id}` | None | List candidates for election |
| POST | `/api/candidates/create.php` | Admin | Add candidate |
| PUT | `/api/candidates/update.php?id={id}` | Admin | Edit candidate |
| DELETE | `/api/candidates/delete.php?id={id}` | Admin | Delete candidate |
| POST | `/api/votes/submit.php` | Voter JWT | Cast anonymous vote for position |
| GET | `/api/votes/validate.php?election_id={id}` | Voter JWT | Check eligibility to vote |
| GET | `/api/votes/results.php?election_id={id}` | None | View vote counts & turnout stats |
| GET | `/api/votes/history.php` | Voter JWT | Fetch personal voting history |

### Admin Analytics & Audit Logs

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| GET | `/api/admin/stats.php` | Admin JWT | Real-time system metrics |
| GET | `/api/admin/activity.php` | Admin JWT | System activity timeline |
| GET | `/api/admin/audit-logs.php` | Admin JWT | Paginated security audit logs |

**Last Updated**: 2026-10-05

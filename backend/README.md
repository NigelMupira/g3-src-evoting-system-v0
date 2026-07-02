# Backend API

PHP backend for the SRC E-Voting System. Exposes a RESTful JSON API consumed by the React frontend.

## Architecture

All HTTP requests are funnelled through a single **front controller** (`index.php`) which:

1. Sets global CORS headers (no per-file `cors.php` boilerplate needed)
2. Handles OPTIONS preflight requests
3. Dynamically routes the request to the matching PHP endpoint file

**Start the server:**

```bash
# Always use index.php as the router entry point
php -S localhost:8000 index.php
```

## Directory Structure

```
backend/
├── index.php             # Front controller: global CORS + dynamic router
├── .env                  # Environment variables (DB credentials, JWT secret)
├── .env.example          # Template for setting up .env
├── composer.json         # PHP dependencies
├── api/
│   ├── auth/
│   │   ├── login.php     # POST - authenticate user, returns JWT token
│   │   ├── register.php  # POST - create new voter account
│   │   └── logout.php    # POST - validate and confirm logout
│   ├── elections/
│   │   ├── list.php      # GET  - list all/active elections
│   │   ├── get.php       # GET  - get single election by ID
│   │   ├── create.php    # POST - create election (admin only)
│   │   ├── update.php    # PUT  - update election (admin only)
│   │   └── delete.php    # DELETE - delete election (admin only)
│   ├── candidates/
│   │   ├── list.php      # GET  - list candidates for an election
│   │   ├── create.php    # POST - add candidate (admin only)
│   │   ├── update.php    # PUT  - update candidate (admin only)
│   │   └── delete.php    # DELETE - delete candidate (admin only)
│   ├── votes/
│   │   ├── submit.php    # POST - cast vote (auth required)
│   │   ├── validate.php  # GET  - check if user can vote in position (auth required)
│   │   ├── results.php   # GET  - get vote counts/statistics for election
│   │   └── history.php   # GET  - get user voting history (auth required)
│   ├── admin/
│   │   ├── stats.php     # GET  - admin dashboard statistics (admin only)
│   │   ├── activity.php  # GET  - admin activity timeline (admin only)
│   │   └── audit-logs.php # GET  - audit log viewer (admin only)
│   └── middleware/
│       ├── JWTAuth.php           # JWT token generation, validation, and header parsing
│       ├── AdminAuth.php         # Role-based auth: requireAuth() and requireAdmin()
│       ├── RateLimiter.php       # API rate limiting for brute force protection
│       ├── InputValidator.php    # Input sanitization and validation
│       └── SecurityHeaders.php   # OWASP-compliant security headers
├── config/
│   └── database.php      # PDO MySQL connection using .env variables
└── models/
    ├── User.php           # User DB operations (create, find, exists check)
    ├── Election.php       # Election DB operations (CRUD + toggle active)
    ├── Candidate.php      # Candidate DB operations (CRUD)
    └── Vote.php           # Vote submission, duplicate check, results queries
```

## Setup

### Prerequisites

- PHP 8.0+ with `pdo_mysql` extension enabled
  - On Windows: edit `php.ini`, ensure `extension_dir` is absolute and `extension=pdo_mysql` is uncommented
- MySQL 5.7+ or 8.0+
- Composer

### Installation

```bash
# Install PHP dependencies (firebase/php-jwt, vlucas/phpdotenv)
composer install

# Copy environment template and configure
cp .env.example .env
# Edit .env with your database credentials
```

### Environment Variables (`.env`)

```env
DB_HOST=localhost
DB_USER=evoting
DB_PASS=your_secure_password
DB_NAME=evoting_system
JWT_SECRET=your_very_long_random_secret
JWT_EXPIRY=900           # Seconds until token expires (900 = 15 minutes)
FRONTEND_URL=http://localhost:3000
```

### Database Setup

```bash
# Create database and import schema
mysql -u root -p evoting_system < ../database/schemas/schema.sql
```

### Start Server

```bash
php -S localhost:8000 index.php
```

Backend API will be available at `http://localhost:8000`

---

## API Endpoints

### Authentication

| Method | Endpoint                 | Auth       | Description                      |
| ------ | ------------------------ | ---------- | -------------------------------- |
| POST   | `/api/auth/register.php` | None       | Register new voter               |
| POST   | `/api/auth/login.php`    | None       | Login, returns JWT + user object |
| POST   | `/api/auth/logout.php`   | Bearer JWT | Confirm logout                   |

**Register body:**

```json
{
  "regNumber": "H230001V",
  "password": "Pass@123",
  "firstName": "John",
  "lastName": "Doe",
  "school": "Engineering",
  "course": "Software Engineering"
}
```

**Login response:**

```json
{
  "success": true,
  "token": "eyJ...",
  "user": {
    "id": 1,
    "regNumber": "H230001V",
    "role": "user",
    "firstName": "John"
  }
}
```

### Elections

| Method | Endpoint                              | Auth      | Description               |
| ------ | ------------------------------------- | --------- | ------------------------- |
| GET    | `/api/elections/list.php`             | None      | Get all elections         |
| GET    | `/api/elections/list.php?active=true` | None      | Get active elections only |
| GET    | `/api/elections/get.php?id={id}`      | None      | Get single election       |
| POST   | `/api/elections/create.php`           | Admin JWT | Create election           |
| PUT    | `/api/elections/update.php?id={id}`   | Admin JWT | Update election           |
| DELETE | `/api/elections/delete.php?id={id}`   | Admin JWT | Delete election           |

### Candidates

| Method | Endpoint                                    | Auth      | Description                  |
| ------ | ------------------------------------------- | --------- | ---------------------------- |
| GET    | `/api/candidates/list.php?election_id={id}` | None      | List candidates for election |
| POST   | `/api/candidates/create.php`                | Admin JWT | Add candidate                |
| PUT    | `/api/candidates/update.php?id={id}`        | Admin JWT | Update candidate             |
| DELETE | `/api/candidates/delete.php?id={id}`        | Admin JWT | Delete candidate             |

### Votes

| Method | Endpoint                                                    | Auth       | Description                  |
| ------ | ----------------------------------------------------------- | ---------- | ---------------------------- |
| POST   | `/api/votes/submit.php`                                     | Bearer JWT | Cast vote (one per position) |
| GET    | `/api/votes/validate.php?election_id={id}&position_id={id}` | Bearer JWT | Check if user can vote       |
| GET    | `/api/votes/results.php?election_id={id}`                   | None       | Get vote counts              |
| GET    | `/api/votes/history.php`                                   | Bearer JWT | Get user voting history      |

### Admin

| Method | Endpoint                      | Auth      | Description                      |
| ------ | ----------------------------- | --------- | -------------------------------- |
| GET    | `/api/admin/stats.php`        | Admin JWT | Dashboard statistics (users, elections, votes) |
| GET    | `/api/admin/activity.php`     | Admin JWT | Activity timeline (recent system activities) |
| GET    | `/api/admin/audit-logs.php`   | Admin JWT | Audit log viewer with filtering |

---

## Admin Accounts

Admins are **not** created through the registration endpoint.
The database setup scripts automatically create a default admin user:
- **Registration**: A999999Z
- **Password**: #adm!n@sup3r
- **Role**: admin

For manual admin creation, insert directly into the `users` table:

```sql
INSERT INTO users (reg_number, first_name, last_name, password_hash, role)
VALUES ('ADMIN001', 'Admin', 'User', '$2y$10$...bcrypt_hash...', 'admin');
```

The login endpoint returns the user's role, and the frontend automatically redirects admins to `/admin`.

---

## Security Notes

- All passwords hashed with **bcrypt** (`password_hash($password, PASSWORD_BCRYPT)`)
- JWT signed with HS256 using the `JWT_SECRET` from `.env`
- Voter IDs are hashed before storing (`SHA-256(regNumber + positionId)`) — not reversible
- CORS restricted to known origins in `index.php` (not open `*`)
- Admin endpoints verify `role === 'admin'` server-side via `AdminAuth::requireAdmin()`
- **Rate limiting**: 5 requests per minute on login endpoint
- **Input validation**: Sanitization of all user inputs
- **Security headers**: OWASP-compliant headers (CSP, HSTS, XSS protection, clickjacking prevention)
- **Audit logging**: All admin actions tracked for accountability

**Last Updated**: 2026-07-02

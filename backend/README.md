# Backend API

This folder contains the PHP backend for the E-Voting System.

## Structure

- **api/** - API endpoints organized by resource (auth, elections, candidates, votes)
- **config/** - Configuration files (database connection, constants)
- **models/** - PHP classes for database models (User, Election, Candidate, Vote)
- **middleware/** - Middleware functions (authentication, validation, error handling)

## Setup

1. Copy `.env.example` to `.env` and configure:
   ```bash
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=
   DB_NAME=evoting_system
   JWT_SECRET=your_very_secret_key_change_this
   ```

2. Install dependencies:
   ```bash
   composer install
   ```

3. Create MySQL database:
   ```bash
   mysql -u root -p < ../database/schemas/schema.sql
   ```

4. Start PHP server:
   ```bash
   php -S localhost:8000
   ```

## API Endpoints

### Authentication (Implemented ✅)
- `POST /api/auth/register.php` - Register new user
  - Body: `{ regNumber, password, firstName, lastName, school?, course? }`
  - Returns: User data
  
- `POST /api/auth/login.php` - Login user
  - Body: `{ regNumber, password }`
  - Returns: JWT token + user data
  
- `POST /api/auth/logout.php` - Logout user
  - Headers: `Authorization: Bearer {token}`
  - Returns: Success message

### Elections (To be implemented)
- `GET /api/elections/list.php` - Get all elections
- `GET /api/elections/{id}.php` - Get election details
- `POST /api/elections/create.php` - Create election (admin)
- `PUT /api/elections/update.php` - Update election (admin)
- `DELETE /api/elections/{id}.php` - Delete election (admin)

### Candidates (To be implemented)
- `GET /api/candidates/list.php?election_id={id}` - Get candidates for election
- `POST /api/candidates/create.php` - Add candidate (admin)
- `PUT /api/candidates/update.php` - Update candidate (admin)
- `DELETE /api/candidates/{id}.php` - Delete candidate (admin)

### Voting (To be implemented)
- `POST /api/votes/submit.php` - Submit vote
- `GET /api/votes/results.php?election_id={id}` - Get election results
- `POST /api/votes/validate.php` - Validate if user can vote

## Security

- All passwords hashed with bcrypt
- JWT tokens for authentication
- Voter IDs hashed in votes table (anonymized)
- Input validation and sanitization
- CORS protection
- Rate limiting on auth endpoints

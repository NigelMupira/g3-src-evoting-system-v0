# Backend API

This folder contains the PHP backend for the E-Voting System.

## Structure

- **api/** - API endpoints organized by resource (auth, elections, candidates, votes)
- **config/** - Configuration files (database connection, constants)
- **models/** - PHP classes for database models (User, Election, Candidate, Vote)
- **middleware/** - Middleware functions (authentication, validation, error handling)

## Setup

1. Copy `.env.example` to `.env` and configure database connection
2. Install dependencies: `composer install`
3. Set up MySQL database: `mysql -u root < ../database/schemas/schema.sql`
4. Run: `php -S localhost:8000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh JWT token

### Elections
- `GET /api/elections/list` - Get all elections
- `GET /api/elections/{id}` - Get election details
- `POST /api/elections/create` - Create election (admin)
- `PUT /api/elections/update` - Update election (admin)
- `DELETE /api/elections/{id}` - Delete election (admin)

### Candidates
- `GET /api/candidates/list?election_id={id}` - Get candidates for election
- `POST /api/candidates/create` - Add candidate (admin)
- `PUT /api/candidates/update` - Update candidate (admin)
- `DELETE /api/candidates/{id}` - Delete candidate (admin)

### Voting
- `POST /api/votes/submit` - Submit vote
- `GET /api/votes/results?election_id={id}` - Get election results
- `POST /api/votes/validate` - Validate if user can vote

## Security

- All passwords hashed with bcrypt
- JWT tokens for authentication
- Voter IDs hashed in votes table (anonymized)
- Input validation and sanitization
- CORS protection
- Rate limiting on auth endpoints

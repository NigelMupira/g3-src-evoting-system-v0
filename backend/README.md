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

### Elections (Implemented ✅)
- `GET /api/elections/list.php?active=true` - Get all or active elections
  - Returns: Array of elections
  
- `GET /api/elections/get.php?id={id}` - Get election details
  - Returns: Election data
  
- `POST /api/elections/create.php` - Create election (admin only)
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ name, description?, startDate, endDate }`
  - Returns: Election ID
  
- `PUT /api/elections/update.php?id={id}` - Update election (admin only)
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ name, description?, startDate, endDate }`
  - Returns: Success message
  
- `DELETE /api/elections/delete.php?id={id}` - Delete election (admin only)
  - Headers: `Authorization: Bearer {token}`
  - Returns: Success message

### Candidates (Implemented ✅)
- `GET /api/candidates/list.php?election_id={id}` - Get candidates for election
  - Returns: Array of candidates with position info
  
- `POST /api/candidates/create.php` - Add candidate (admin only)
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ electionId, positionId, name, bio?, manifesto?, photoUrl?, videoUrl? }`
  - Returns: Candidate ID
  
- `PUT /api/candidates/update.php?id={id}` - Update candidate (admin only)
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ name, bio?, manifesto?, photoUrl?, videoUrl? }`
  - Returns: Success message
  
- `DELETE /api/candidates/delete.php?id={id}` - Delete candidate (admin only)
  - Headers: `Authorization: Bearer {token}`
  - Returns: Success message

### Voting (Implemented ✅)
- `POST /api/votes/submit.php` - Submit vote (requires authentication)
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ electionId, positionId, candidateId }`
  - Returns: Success message
  - Note: Prevents double voting per position
  
- `GET /api/votes/results.php?election_id={id}&position_id={id}?` - Get election results
  - Returns: Vote counts by candidate + stats
  
- `GET /api/votes/validate.php?election_id={id}&position_id={id}` - Check if can vote (requires authentication)
  - Headers: `Authorization: Bearer {token}`
  - Returns: Can vote status + reason if unable

## Security

- All passwords hashed with bcrypt
- JWT tokens for authentication
- Voter IDs hashed in votes table (anonymized)
- Input validation and sanitization
- CORS protection
- Rate limiting on auth endpoints

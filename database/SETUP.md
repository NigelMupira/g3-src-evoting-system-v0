# Database Setup Guide

## Local Development Setup

### Option 1: Using MySQL Community Server

#### Prerequisites
- MySQL Server 5.7+ installed and running
- MySQL command-line client or MySQL Workbench

#### Steps

1. **Create the database**:
```bash
mysql -u root -p
```

2. **Enter MySQL shell and create database**:
```sql
CREATE DATABASE evoting_system;
USE evoting_system;
```

3. **Import the schema**:
```bash
mysql -u root -p evoting_system < database/schemas/schema.sql
```

4. **Create a database user** (optional but recommended):
```sql
CREATE USER 'evoting'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON evoting_system.* TO 'evoting'@'localhost';
FLUSH PRIVILEGES;
```

5. **Verify tables created**:
```sql
SHOW TABLES;
```

You should see 6 tables:
- users
- elections
- positions
- candidates
- votes
- audit_log

### Option 2: Using Docker

Create a `docker-compose.yml` in project root:

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    container_name: evoting_mysql
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: evoting_system
      MYSQL_USER: evoting
      MYSQL_PASSWORD: evoting_password
    ports:
      - "3306:3306"
    volumes:
      - ./database/schemas:/docker-entrypoint-initdb.d
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10

volumes:
  mysql_data:
```

Run with: `docker-compose up -d`

---

## Production Deployment

### Using Railway.app (Recommended)

1. **Create account** on [railway.app](https://railway.app)

2. **Create new MySQL service**:
   - Click "Create" → Select "MySQL"
   - Railway provisions a MySQL instance automatically

3. **Get connection details**:
   - Go to MySQL service
   - Click "Connect" tab
   - Copy connection string and credentials

4. **Import schema**:
```bash
mysql -h <railway_host> -u <user> -p<password> <database_name> < database/schemas/schema.sql
```

5. **Update backend `.env`**:
```
DB_HOST=railway_host
DB_USER=mysql_user
DB_PASS=mysql_password
DB_NAME=railway_db_name
```

### Using PlanetScale (Free MySQL)

1. **Create account** on [planetscale.com](https://planetscale.com)

2. **Create new database**:
   - Click "Create database"
   - Choose region close to your backend

3. **Get credentials**:
   - Main branch → Connect
   - Choose MySQL CLI
   - Copy connection string

4. **Import schema**:
```bash
mysql -h <planetscale_host> -u <user> -p<password> <database_name> < database/schemas/schema.sql
```

---

## Database Structure

### Users Table
- Stores student and admin accounts
- `reg_number`: Unique student/admin ID
- `role`: 'user' or 'admin' (admin if reg_number starts with "ADMIN")
- Indexes on reg_number and role for fast lookups

### Elections Table
- Manages elections
- `is_active`: Boolean flag for active elections
- `created_by`: Foreign key to admin who created it
- Cascade delete: Deletes all related positions, candidates, and votes when election is deleted

### Positions Table
- Positions within elections (e.g., President, Vice President)
- Linked to election
- Unique constraint on (election_id, position_name)

### Candidates Table
- Candidates running for positions
- Links to election, position, and includes bio/manifesto/photos
- Cascade delete with elections and positions

### Votes Table
- Individual votes cast
- **Key security feature**: `voter_id_hash` instead of actual voter ID
  - Hash format: SHA-256(reg_number + position_id)
  - Enables vote anonymization while preventing double voting
- Unique constraint: One vote per voter per position per election
- No voter identification, only vote counts visible

### Audit Log Table
- Tracks all admin actions
- Stores action type, user ID, details, and IP address
- JSON field for flexible detail storage

---

## Test Data (Optional)

Create sample admin account:

```sql
-- Create admin user (password: admin123)
INSERT INTO users (reg_number, first_name, last_name, password_hash, role)
VALUES (
  'ADMIN001',
  'Admin',
  'User',
  '$2y$10$YourBcryptHashHere',
  'admin'
);

-- Create student user (password: student123)
INSERT INTO users (reg_number, first_name, last_name, password_hash, role, school, course)
VALUES (
  'SRC001',
  'Student',
  'One',
  '$2y$10$YourBcryptHashHere',
  'user',
  'School of Technology',
  'Computer Science'
);
```

**Note**: Use bcrypt hashing for passwords. The backend handles this during user registration.

---

## Backup & Restore

### Backup database:
```bash
mysqldump -h <host> -u <user> -p<password> <database> > backup.sql
```

### Restore from backup:
```bash
mysql -h <host> -u <user> -p<password> <database> < backup.sql
```

---

## Environment Variables

Update `/backend/.env` with database connection:

```
DB_HOST=localhost
DB_USER=evoting
DB_PASS=your_secure_password
DB_NAME=evoting_system
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=900
FRONTEND_URL=http://localhost:3000
```

---

## Troubleshooting

**"Access denied for user"**
- Check DB_USER and DB_PASS in .env
- Verify user exists: `SELECT user FROM mysql.user;`

**"Unknown database"**
- Database not created
- Run: `CREATE DATABASE evoting_system;`

**"Foreign key constraint fails"**
- Ensure parent tables exist before inserting
- Check cascade delete settings

**"Duplicate entry"** on reg_number
- reg_number has UNIQUE constraint
- Clear test data: `TRUNCATE TABLE users;`

---

## Next Steps

1. ✅ Import schema from `database/schemas/schema.sql`
2. ⏳ Deploy backend to Railway.app
3. ⏳ Update frontend `.env` with backend API URL
4. ⏳ Test end-to-end: Register → Login → Vote → View Results

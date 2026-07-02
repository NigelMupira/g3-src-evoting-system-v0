# Database - SRC E-Voting System

## Overview
MySQL 8.0+ database with 8 tables managing users, elections, candidates, votes, and security features. Includes automated setup scripts and comprehensive schema with referential integrity.

## Directory Structure
```
database/
├── schemas/
│   └── schema.sql           # Complete table definitions with security tables
├── migrations/              # Version-controlled schema changes
├── seeds/
│   └── create_admin.sql     # Default admin user creation script
├── setup.bat                # Windows automated setup
├── setup.sh                 # Linux/macOS automated setup
└── README.md                # This file
```

## Setup

### Prerequisites
- MySQL 5.7+ or 8.0+
- MySQL client (`mysql` command)
- Administrative MySQL user (root or equivalent)

### Option 1: Automated Setup (Recommended)

**Windows:**
```bash
cd database
setup.bat
```

**Linux/macOS:**
```bash
cd database
chmod +x setup.sh
./setup.sh
```

The automated setup scripts:
- Create the database and user
- Import the schema
- Create the default admin user
- Display admin credentials upon completion
- Use secure environment variables to avoid password warnings

### Option 2: Manual Setup

```bash
# Create database
mysql -u root -p
```
```sql
CREATE DATABASE evoting_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit
```

```bash
# Import schema
mysql -u root -p evoting_system < schemas/schema.sql

# Create default admin user (Windows CMD)
type seeds/create_admin.sql | mysql -u root -p evoting_system

# Create default admin user (Windows PowerShell)
Get-Content seeds/create_admin.sql | mysql -u root -p evoting_system

# Create default admin user (Linux/macOS)
cat seeds/create_admin.sql | mysql -u root -p evoting_system
```

## Schema Overview

### Core Tables (5)
- **users**: Student/admin accounts with bcrypt password hashing
- **elections**: Election events with activation control
- **positions**: Positions within elections (President, VP, etc.)
- **candidates**: Candidates with bios, manifestos, and media
- **votes**: Anonymized votes using SHA-256 voter ID hashing

### Security Tables (3)
- **audit_log**: Tracks all admin actions with timestamps and IP addresses
- **rate_limits**: API rate limiting for brute force protection
- **token_blacklist**: Session management and token revocation

## Key Features

### Vote Integrity
- **Anonymity**: Voter IDs hashed with SHA-256(regNumber + positionId)
- **Double voting prevention**: UNIQUE constraint on (voter_id_hash, position_id, election_id)
- **Cascade deletes**: Deleting elections removes related data automatically

### Security
- **Password security**: bcrypt hashing with salt
- **Audit trail**: All admin actions logged
- **Rate limiting**: Prevents API abuse
- **Token management**: Secure session revocation

## Default Admin User

The setup scripts automatically create a default admin user:
- **Registration**: A999999Z
- **Password**: #adm!n@sup3r
- **Role**: admin

**Important**: Change this password in production.

To manually recreate the admin user:
```bash
# Windows CMD
type seeds/create_admin.sql | mysql -u your_user -p evoting_system

# Windows PowerShell
Get-Content seeds/create_admin.sql | mysql -u your_user -p evoting_system

# Linux/macOS
cat seeds/create_admin.sql | mysql -u your_user -p evoting_system
```

## Backup & Restore

```bash
# Backup
mysqldump -u root -p evoting_system > backup.sql

# Restore
mysql -u root -p evoting_system < backup.sql
```

## Maintenance

```sql
-- Clean old audit logs (30 days)
DELETE FROM audit_log WHERE timestamp < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Clean old rate limits (1 day)
DELETE FROM rate_limits WHERE timestamp < DATE_SUB(NOW(), INTERVAL 1 DAY);

-- Clean expired tokens
DELETE FROM token_blacklist WHERE expires_at < NOW();
```

**Last Updated**: 2026-07-02

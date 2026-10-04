# Database - SRC E-Voting System (MySQL)

## Overview

Relational MySQL 8.0+ database schema supporting secure election management, vote anonymization, referential integrity, and administrative audit logging.

## Directory Structure

```
database/
├── schemas/
│   └── schema.sql           # Complete table definitions (8 tables)
├── seeds/
│   ├── seed_demo_data.php   # Complete PHP demo data seeder
│   └── create_admin.sql     # SQL script for standalone admin user creation
├── setup.bat                # Windows interactive setup script
├── setup.sh                 # Linux/macOS setup script
└── README.md                # Database documentation
```

## Tables Overview

### Core Application Tables (5)
1. `users` - Stores student voters and administrators with bcrypt-hashed passwords.
2. `elections` - Manages election events, active flags, and start/end timestamps.
3. `positions` - Positions tied to elections (e.g., President, Vice President, Treasurer, General Secretary).
4. `candidates` - Candidate profiles, manifestos, school affiliations, and image URLs.
5. `votes` - Anonymized votes with SHA-256 voter hashes (`voter_id_hash`).

### Security & Audit Tables (3)
6. `audit_log` - System audit log tracking logins, candidate additions, election updates, and admin actions.
7. `rate_limits` - Endpoint IP rate limiting entries.
8. `token_blacklist` - Expired or invalidated JWT token tracking.

## Seeding Demo Data

Run the PHP seeder script to populate the database with realistic demo data:

```bash
php database/seeds/seed_demo_data.php
```

This populates:
- **Default Admin Account**: `A999999Z` / `#adm!n@sup3r`
- **Default Voter Account**: `H230828V` / `Student@123`
- **Active Election**: "SRC General Elections 2026"
- **4 Key Positions**: President, Vice President, Treasurer, General Secretary
- **8 Candidates**: Complete with manifestos and school affiliations
- **112 Anonymized Votes**: Distributed across candidates for live result analytics
- **5 Audit Log Entries**: Demonstrating administrative activity logs

## Vote Anonymity & Integrity

- **SHA-256 Voter Hashing**: `voter_id_hash = SHA256(regNumber + positionId + electionId)`. This prevents mapping a specific vote back to a student registration number.
- **Unique Constraint**: `UNIQUE KEY (voter_id_hash, position_id, election_id)` prevents double-voting at the database level.
- **Foreign Keys & Cascade Deletes**: Deleting an election automatically cleans up associated positions, candidates, and votes.

**Last Updated**: 2026-10-05

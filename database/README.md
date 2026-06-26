# Database - SRC E-Voting System  

## Architecture  
The database is designed with a 6-table relational schema to manage users, elections, positions, candidates, votes, and audit logs. Key components include:  
- **Vote anonymity**: Voter IDs are hashed using SHA-256 (regNumber + positionId) to ensure privacy.  
- **Audit trail**: All admin actions are logged with timestamps and user context.  
- **Referential integrity**: Foreign keys enforce consistency across tables.  

## Directory Structure  
```  
database/  
├── schemas/             # Full table definitions (schema.sql)  
├── migrations/          # Version-controlled schema changes  
├── seeds/               # Sample data for development  
├── setup.bat            # Windows one-command setup  
├── setup.sh             # Linux/macOS one-command setup  
└── README.md            # This file  
```  

## Setup  
### Prerequisites  
- MySQL 5.7+ or 8.0+  
- MySQL client (`mysql` command)  

### Steps  
1. **Create database**:  
   ```bash  
   mysql -u root -p  
   CREATE DATABASE evoting_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;  
   exit  
   ```  
2. **Import schema**:  
   ```bash  
   mysql -u root -p evoting_system < schemas/schema.sql  
   ```  
3. **Seed data (optional)**:  
   ```bash  
   mysql -u root -p evoting_system < seeds/sample_data.sql  
   ```  

## Schema Overview  
### Tables  
| Table       | Purpose                          | Key Columns                          |  
|-------------|----------------------------------|--------------------------------------|  
| `users`     | Student/admin accounts           | `id`, `reg_number`, `password_hash`, `role` |  
| `elections` | Election events                  | `id`, `title`, `start_date`, `is_active` |  
| `positions` | Positions within elections       | `id`, `election_id`, `title`         |  
| `candidates`| Candidates for positions         | `id`, `position_id`, `first_name`    |  
| `votes`     | Cast votes (anonymized)          | `id`, `election_id`, `voter_id_hash` |  
| `audit_log` | Admin action tracking            | `id`, `admin_id`, `action`, `created_at` |  

### Key Constraints  
- **Unique vote prevention**: `UNIQUE(voter_id_hash, position_id, election_id)`  
- **Cascade deletes**: Deleting an election removes related data.  

## Security Notes  
- **Passwords**: bcrypt-hashed in `users.password_hash` (never stored in plain text).  
- **Vote privacy**: `voter_id_hash` is irreversible.  
- **Least privilege**: Use a dedicated DB user with limited access in production.  
- **Production hardening**: Disable remote root login, enable SSL/TLS.  

**Last Updated**: 2026-06-26
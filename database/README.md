# Database

MySQL database for the E-Voting System.

## Folder Structure

- **schemas/** - Database schema and table definitions
- **migrations/** - Database migration scripts for version control
- **seeds/** - Sample data for testing and development

## Setting Up Database

1. Create MySQL database:
```bash
mysql -u root -p
CREATE DATABASE evoting_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Import schema:
```bash
mysql -u root -p evoting_system < schemas/schema.sql
```

3. (Optional) Seed sample data:
```bash
mysql -u root -p evoting_system < seeds/sample_data.sql
```

## Tables

1. **users** - Student and admin accounts
2. **elections** - Election events
3. **positions** - Positions within elections (e.g., President, Vice President)
4. **candidates** - Candidates for each position
5. **votes** - Cast votes (anonymized voter IDs)
6. **audit_log** - Admin action tracking

## Backups

Regular backups recommended. Use:
```bash
mysqldump -u root -p evoting_system > backup_$(date +%Y%m%d).sql
```

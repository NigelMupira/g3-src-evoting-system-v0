#!/bin/bash
# Database setup script for local development

echo "E-Voting System Database Setup"
echo "=============================="
echo ""

# Check if mysql is installed
if ! command -v mysql &> /dev/null; then
    echo "ERROR: MySQL client not found. Please install MySQL."
    exit 1
fi

# Get user input
read -p "Enter MySQL root password: " -s root_password
echo ""
read -p "Enter database name (default: evoting_system): " db_name
db_name=${db_name:-evoting_system}

read -p "Enter database user (default: evoting): " db_user
db_user=${db_user:-evoting}

read -p "Enter database user password: " -s db_password
echo ""

# Create database and user
echo "Creating database and user..."
export MYSQL_PWD="$root_password"
mysql -u root << EOF
CREATE DATABASE IF NOT EXISTS $db_name;
CREATE USER IF NOT EXISTS '$db_user'@'localhost' IDENTIFIED BY '$db_password';
GRANT ALL PRIVILEGES ON $db_name.* TO '$db_user'@'localhost';
FLUSH PRIVILEGES;
EOF
unset MYSQL_PWD

if [ $? -eq 0 ]; then
    echo "✓ Database and user created successfully"
else
    echo "✗ Failed to create database. Check your root password."
    exit 1
fi

# Import schema
echo "Importing schema..."
export MYSQL_PWD="$db_password"
mysql -u "$db_user" "$db_name" < database/schemas/schema.sql

if [ $? -eq 0 ]; then
    echo "✓ Schema imported successfully"
else
    echo "✗ Failed to import schema"
    unset MYSQL_PWD
    exit 1
fi

# Create default admin user
echo "Creating default admin user..."
cat database/seeds/create_admin.sql | mysql -u "$db_user" "$db_name"

if [ $? -eq 0 ]; then
    echo "✓ Default admin user created successfully"
else
    echo "✗ Failed to create admin user"
    unset MYSQL_PWD
    exit 1
fi

# Verify tables
echo ""
echo "Database Tables:"
mysql -u "$db_user" "$db_name" -e "SHOW TABLES;"
unset MYSQL_PWD

# Create .env file for backend
echo ""
read -p "Create .env file for backend? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cat > ../backend/.env << EOF
DB_HOST=localhost
DB_USER=$db_user
DB_PASS=$db_password
DB_NAME=$db_name
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRY=900
FRONTEND_URL=http://localhost:3000
EOF
    echo "✓ .env file created at ../backend/.env"
    echo "  Update JWT_SECRET if needed"
fi

echo ""
echo "✓ Database setup complete!"
echo ""
echo "Default Admin Credentials:"
echo "  Registration: A999999Z"
echo "  Password: #adm!n@sup3r"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with JWT_SECRET if needed"
echo "2. Deploy backend to Railway.app"
echo "3. Test the system with: npm start (in frontend)"

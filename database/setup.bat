@echo off
REM Database setup script for local development (Windows)

echo E-Voting System Database Setup
echo ==============================
echo.

REM Check if mysql is installed
where mysql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: MySQL not found in PATH. Please install MySQL and add it to PATH.
    pause
    exit /b 1
)

REM Get user input
set /p root_password="Enter MySQL root password: "
set db_name=evoting_system
set /p db_name="Enter database name (default: evoting_system): "

set db_user=evoting
set /p db_user="Enter database user (default: evoting): "

set /p db_password="Enter database user password: "

REM Create database and user
echo Creating database and user...
set MYSQL_PWD=%root_password%
(
    echo CREATE DATABASE IF NOT EXISTS %db_name%;
    echo CREATE USER IF NOT EXISTS '%db_user%'^@'localhost' IDENTIFIED BY '%db_password%';
    echo GRANT ALL PRIVILEGES ON %db_name%.* TO '%db_user%'^@'localhost';
    echo FLUSH PRIVILEGES;
) | mysql -u root
set MYSQL_PWD=

if %ERRORLEVEL% EQU 0 (
    echo Database and user created successfully
) else (
    echo Failed to create database. Check your root password.
    pause
    exit /b 1
)

REM Import schema
echo Importing schema...
set MYSQL_PWD=%db_password%
type schemas\schema.sql | mysql -u %db_user% %db_name%

if %ERRORLEVEL% EQU 0 (
    echo Schema imported successfully
) else (
    echo Failed to import schema
    set MYSQL_PWD=
    pause
    exit /b 1
)

REM Create default admin user
echo Creating default admin user...
type seeds\create_admin.sql | mysql -u %db_user% %db_name%

if %ERRORLEVEL% EQU 0 (
    echo Default admin user created successfully
) else (
    echo Failed to create admin user
    set MYSQL_PWD=
    pause
    exit /b 1
)

REM Verify tables
echo.
echo Database Tables:
mysql -u %db_user% %db_name% -e "SHOW TABLES;"
set MYSQL_PWD=

REM Create .env file
echo.
set /p create_env="Create .env file for backend? (y/n): "
if /i "%create_env%"=="y" (
    (
        echo DB_HOST=localhost
        echo DB_USER=%db_user%
        echo DB_PASS=%db_password%
        echo DB_NAME=%db_name%
        echo JWT_SECRET=your_jwt_secret_key_here
        echo JWT_EXPIRY=900
        echo FRONTEND_URL=http://localhost:3000
    ) > ..\backend\.env
    echo .env file created at ..\backend\.env
    echo Update JWT_SECRET with a secure random string
)

echo.
echo Database setup complete!
echo.
echo Default Admin Credentials:
echo   Registration: A999999Z
echo   Password: #adm!n@sup3r
echo.
echo Next steps:
echo 1. Update backend\.env with JWT_SECRET
echo 2. Deploy backend to Railway.app
echo 3. Run: npm start (in frontend folder)
echo.
pause

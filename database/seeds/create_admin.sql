-- Default Admin User Creation Script
-- This script creates the default admin user for the e-voting system
-- Password: #adm!n@sup3r (bcrypt hash)
-- Registration: A999999Z

INSERT INTO users (reg_number, first_name, last_name, password_hash, role, is_active)
VALUES ('A999999Z', 'Admin', 'SuperUser', '$2y$12$3wl/vSzb9gaJRvKeHPj5/OU4d3cB5GBteKAwFR5653WZi2xkCaMSO', 'admin', TRUE)
ON DUPLICATE KEY UPDATE
    first_name = 'Admin',
    last_name = 'SuperUser',
    password_hash = '$2y$12$3wl/vSzb9gaJRvKeHPj5/OU4d3cB5GBteKAwFR5653WZi2xkCaMSO',
    role = 'admin',
    is_active = TRUE;
-- E-Voting System Database Schema
-- MySQL 5.7+

-- Users Table (Students & Admins)
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reg_number VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    school VARCHAR(100),
    course VARCHAR(100),
    role ENUM('user', 'admin') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_reg_number (reg_number),
    INDEX idx_role (role)
);

-- Elections Table
CREATE TABLE IF NOT EXISTS elections (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_is_active (is_active),
    INDEX idx_dates (start_date, end_date)
);

-- Positions Table (Positions within an election)
CREATE TABLE IF NOT EXISTS positions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    election_id INT NOT NULL,
    position_name VARCHAR(50) NOT NULL,
    max_votes INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (election_id) REFERENCES elections(id) ON DELETE CASCADE,
    UNIQUE KEY unique_election_position (election_id, position_name)
);

-- Candidates Table
CREATE TABLE IF NOT EXISTS candidates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    election_id INT NOT NULL,
    position_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    bio TEXT,
    manifesto TEXT,
    photo_url VARCHAR(255),
    video_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (election_id) REFERENCES elections(id) ON DELETE CASCADE,
    FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE CASCADE,
    INDEX idx_election_position (election_id, position_id)
);

-- Votes Table (Anonymized - voter ID hashed)
CREATE TABLE IF NOT EXISTS votes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    election_id INT NOT NULL,
    position_id INT NOT NULL,
    candidate_id INT NOT NULL,
    voter_id_hash VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (election_id) REFERENCES elections(id) ON DELETE CASCADE,
    FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    UNIQUE KEY unique_voter_position (voter_id_hash, position_id, election_id),
    INDEX idx_candidate (candidate_id),
    INDEX idx_election (election_id)
);

-- Audit Log Table (Track all admin actions)
CREATE TABLE IF NOT EXISTS audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    action VARCHAR(100) NOT NULL,
    user_id INT,
    details JSON,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_timestamp (timestamp)
);

-- Rate Limiting Table (Track API request rates for security)
CREATE TABLE IF NOT EXISTS rate_limits (
    id INT PRIMARY KEY AUTO_INCREMENT,
    identifier VARCHAR(45) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    endpoint VARCHAR(255),
    INDEX idx_identifier_timestamp (identifier, timestamp),
    INDEX idx_timestamp (timestamp)
);

-- Token Blacklist Table (For logout functionality and token revocation)
CREATE TABLE IF NOT EXISTS token_blacklist (
    id INT PRIMARY KEY AUTO_INCREMENT,
    token_jti VARCHAR(255) NOT NULL UNIQUE,
    user_id INT,
    revoked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    reason VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_token_jti (token_jti),
    INDEX idx_expires_at (expires_at)
);

-- Create indexes for common queries
CREATE INDEX idx_election_active ON elections(is_active, end_date);
CREATE INDEX idx_candidate_election ON candidates(election_id);

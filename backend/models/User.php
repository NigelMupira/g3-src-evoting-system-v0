<?php
// ============================================
// User Model
// ============================================
// Database interactions for user accounts (students & admins)
// Handles user creation, retrieval, and existence checks

namespace App;

class User {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // Create new user account with registration number and credentials
    public function create($regNumber, $firstName, $lastName, $passwordHash, $school = null, $course = null) {
        try {
            $stmt = $this->pdo->prepare("
                INSERT INTO users (reg_number, first_name, last_name, password_hash, school, course, role, is_active, created_at)
                VALUES (?, ?, ?, ?, ?, ?, 'user', TRUE, CURRENT_TIMESTAMP)
            ");

            return $stmt->execute([$regNumber, $firstName, $lastName, $passwordHash, $school, $course]);
        } catch (\PDOException $e) {
            throw new \Exception("Error creating user: " . $e->getMessage());
        }
    }

    // Fetch user by registration number (only active users)
    public function getByRegNumber($regNumber) {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM users WHERE reg_number = ? AND is_active = TRUE");
            $stmt->execute([$regNumber]);
            return $stmt->fetch();
        } catch (\PDOException $e) {
            throw new \Exception("Error fetching user: " . $e->getMessage());
        }
    }

    // Fetch user by ID (only active users)
    public function getById($id) {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM users WHERE id = ? AND is_active = TRUE");
            $stmt->execute([$id]);
            return $stmt->fetch();
        } catch (\PDOException $e) {
            throw new \Exception("Error fetching user: " . $e->getMessage());
        }
    }

    // Check if registration number already registered in system
    public function emailExists($regNumber) {
        try {
            $stmt = $this->pdo->prepare("SELECT id FROM users WHERE reg_number = ?");
            $stmt->execute([$regNumber]);
            return $stmt->rowCount() > 0;
        } catch (\PDOException $e) {
            throw new \Exception("Error checking user: " . $e->getMessage());
        }
    }
}
?>

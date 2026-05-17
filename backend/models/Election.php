<?php
// ============================================
// Election Model
// ============================================
// Database operations for election management
// Handles create, retrieve, update, delete for elections

namespace App;

class Election {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // Create new election with name, dates, and admin creator
    public function create($name, $description, $startDate, $endDate, $createdBy) {
        try {
            $stmt = $this->pdo->prepare("
                INSERT INTO elections (name, description, start_date, end_date, created_by, created_at)
                VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ");
            $stmt->execute([$name, $description, $startDate, $endDate, $createdBy]);
            return $this->pdo->lastInsertId();
        } catch (\PDOException $e) {
            throw new \Exception("Error creating election: " . $e->getMessage());
        }
    }

    // Get all elections (optionally filter by active status)
    public function getAll($activeOnly = false) {
        try {
            $query = "SELECT * FROM elections";
            if ($activeOnly) {
                $query .= " WHERE is_active = TRUE";
            }
            $query .= " ORDER BY created_at DESC";
            $stmt = $this->pdo->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll();
        } catch (\PDOException $e) {
            throw new \Exception("Error fetching elections: " . $e->getMessage());
        }
    }

    // Get election by ID with full details
    public function getById($id) {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM elections WHERE id = ?");
            $stmt->execute([$id]);
            return $stmt->fetch();
        } catch (\PDOException $e) {
            throw new \Exception("Error fetching election: " . $e->getMessage());
        }
    }

    // Update election details (admin only)
    public function update($id, $name, $description, $startDate, $endDate) {
        try {
            $stmt = $this->pdo->prepare("
                UPDATE elections
                SET name = ?, description = ?, start_date = ?, end_date = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ");
            return $stmt->execute([$name, $description, $startDate, $endDate, $id]);
        } catch (\PDOException $e) {
            throw new \Exception("Error updating election: " . $e->getMessage());
        }
    }

    // Toggle election active status
    public function toggleActive($id) {
        try {
            $stmt = $this->pdo->prepare("
                UPDATE elections
                SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ");
            return $stmt->execute([$id]);
        } catch (\PDOException $e) {
            throw new \Exception("Error toggling election: " . $e->getMessage());
        }
    }

    // Delete election (admin only)
    public function delete($id) {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM elections WHERE id = ?");
            return $stmt->execute([$id]);
        } catch (\PDOException $e) {
            throw new \Exception("Error deleting election: " . $e->getMessage());
        }
    }
}
?>

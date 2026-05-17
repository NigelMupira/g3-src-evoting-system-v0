<?php
// ============================================
// Candidate Model
// ============================================
// Database operations for candidate management
// Handles create, retrieve, update, delete for candidates

namespace App;

class Candidate {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // Create new candidate for election position
    public function create($electionId, $positionId, $name, $bio, $manifesto, $photoUrl = null, $videoUrl = null) {
        try {
            $stmt = $this->pdo->prepare("
                INSERT INTO candidates (election_id, position_id, name, bio, manifesto, photo_url, video_url, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ");
            $stmt->execute([$electionId, $positionId, $name, $bio, $manifesto, $photoUrl, $videoUrl]);
            return $this->pdo->lastInsertId();
        } catch (\PDOException $e) {
            throw new \Exception("Error creating candidate: " . $e->getMessage());
        }
    }

    // Get all candidates for an election
    public function getByElectionId($electionId) {
        try {
            $stmt = $this->pdo->prepare("
                SELECT c.*, p.position_name
                FROM candidates c
                JOIN positions p ON c.position_id = p.id
                WHERE c.election_id = ?
                ORDER BY p.id, c.name
            ");
            $stmt->execute([$electionId]);
            return $stmt->fetchAll();
        } catch (\PDOException $e) {
            throw new \Exception("Error fetching candidates: " . $e->getMessage());
        }
    }

    // Get candidate by ID
    public function getById($id) {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM candidates WHERE id = ?");
            $stmt->execute([$id]);
            return $stmt->fetch();
        } catch (\PDOException $e) {
            throw new \Exception("Error fetching candidate: " . $e->getMessage());
        }
    }

    // Update candidate information
    public function update($id, $name, $bio, $manifesto, $photoUrl = null, $videoUrl = null) {
        try {
            $stmt = $this->pdo->prepare("
                UPDATE candidates
                SET name = ?, bio = ?, manifesto = ?, photo_url = ?, video_url = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ");
            return $stmt->execute([$name, $bio, $manifesto, $photoUrl, $videoUrl, $id]);
        } catch (\PDOException $e) {
            throw new \Exception("Error updating candidate: " . $e->getMessage());
        }
    }

    // Delete candidate
    public function delete($id) {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM candidates WHERE id = ?");
            return $stmt->execute([$id]);
        } catch (\PDOException $e) {
            throw new \Exception("Error deleting candidate: " . $e->getMessage());
        }
    }
}
?>

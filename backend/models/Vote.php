<?php
// ============================================
// Vote Model
// ============================================
// Database operations for vote management
// Handles vote submission and result retrieval (votes are anonymized)

namespace App;

class Vote {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // Submit vote (voter ID is hashed for anonymity)
    public function submit($electionId, $positionId, $candidateId, $voterIdHash) {
        try {
            $stmt = $this->pdo->prepare("
                INSERT INTO votes (election_id, position_id, candidate_id, voter_id_hash, timestamp)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
            ");
            return $stmt->execute([$electionId, $positionId, $candidateId, $voterIdHash]);
        } catch (\PDOException $e) {
            throw new \Exception("Error submitting vote: " . $e->getMessage());
        }
    }

    // Check if user has already voted in a position
    public function hasVoted($electionId, $positionId, $voterIdHash) {
        try {
            $stmt = $this->pdo->prepare("
                SELECT COUNT(*) as count
                FROM votes
                WHERE election_id = ? AND position_id = ? AND voter_id_hash = ?
            ");
            $stmt->execute([$electionId, $positionId, $voterIdHash]);
            $result = $stmt->fetch();
            return $result['count'] > 0;
        } catch (\PDOException $e) {
            throw new \Exception("Error checking vote: " . $e->getMessage());
        }
    }

    // Get vote counts by candidate for an election position
    public function getResults($electionId, $positionId = null) {
        try {
            $query = "
                SELECT
                    c.id,
                    c.name,
                    c.position_id,
                    p.position_name,
                    COUNT(v.id) as vote_count
                FROM candidates c
                LEFT JOIN votes v ON c.id = v.candidate_id
                JOIN positions p ON c.position_id = p.id
                WHERE c.election_id = ?
            ";

            if ($positionId) {
                $query .= " AND c.position_id = ?";
            }

            $query .= " GROUP BY c.id, p.position_name ORDER BY p.id, vote_count DESC";

            $stmt = $this->pdo->prepare($query);
            $params = [$electionId];
            if ($positionId) {
                $params[] = $positionId;
            }
            $stmt->execute($params);
            return $stmt->fetchAll();
        } catch (\PDOException $e) {
            throw new \Exception("Error fetching results: " . $e->getMessage());
        }
    }

    // Get total votes cast in an election
    public function getTotalVotes($electionId) {
        try {
            $stmt = $this->pdo->prepare("SELECT COUNT(*) as total FROM votes WHERE election_id = ?");
            $stmt->execute([$electionId]);
            $result = $stmt->fetch();
            return $result['total'];
        } catch (\PDOException $e) {
            throw new \Exception("Error counting votes: " . $e->getMessage());
        }
    }

    // Get unique voters count in an election
    public function getUniqueVoters($electionId) {
        try {
            $stmt = $this->pdo->prepare("
                SELECT COUNT(DISTINCT voter_id_hash) as unique_voters
                FROM votes
                WHERE election_id = ?
            ");
            $stmt->execute([$electionId]);
            $result = $stmt->fetch();
            return $result['unique_voters'];
        } catch (\PDOException $e) {
            throw new \Exception("Error counting voters: " . $e->getMessage());
        }
    }
}
?>

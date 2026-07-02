<?php

// ============================================
// Get Election Results Endpoint
// ============================================
// Retrieve vote counts by candidate for an election
// Public endpoint - no authentication required

header('Content-Type: application/json');

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../models/Vote.php';

use App\Vote;

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        throw new \Exception('Only GET requests allowed');
    }

    // ============================================
    // Get Election ID
    // ============================================
    $electionId = $_GET['election_id'] ?? null;
    if (empty($electionId)) {
        throw new \Exception('election_id parameter is required');
    }

    // Optional position filter
    $positionId = $_GET['position_id'] ?? null;

    // ============================================
    // Fetch Results and Statistics
    // ============================================
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    $vote = new Vote($pdo);
    $results = $vote->getResults($electionId, $positionId);
    $totalVotes = $vote->getTotalVotes($electionId);
    $uniqueVoters = $vote->getUniqueVoters($electionId);

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $results,
        'stats' => [
            'totalVotes' => $totalVotes,
            'uniqueVoters' => $uniqueVoters,
        ],
    ]);
} catch (\Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
    ]);
}
?>

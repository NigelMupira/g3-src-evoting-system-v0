<?php

// ============================================
// List Candidates Endpoint
// ============================================
// Retrieve all candidates for an election
// Public endpoint - no authentication required

header('Content-Type: application/json');

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../models/Candidate.php';

use App\Candidate;

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

    $candidate = new Candidate($pdo);
    $candidates = $candidate->getByElectionId($electionId);

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $candidates,
        'count' => count($candidates),
    ]);
} catch (\Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
    ]);
}
?>

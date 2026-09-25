<?php

// ============================================
// Submit Vote Endpoint
// ============================================
// Cast vote in election (requires authentication)
// Voter ID is hashed for anonymity, prevents double voting per position

header('Content-Type: application/json');

require_once __DIR__ . '/../../config/database.php';
$pdo = $GLOBALS['pdo'];
require_once __DIR__ . '/../../models/Vote.php';
require_once __DIR__ . '/../middleware/AdminAuth.php';

use App\Vote;
use App\AdminAuth;

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new \Exception('Only POST requests allowed');
    }

    // ============================================
    // Verify User Authentication
    // ============================================
    $adminAuth = new AdminAuth($_ENV['JWT_SECRET'] ?? 'your_secret_key');
    $user = $adminAuth->requireAuth();

    // ============================================
    // Input Validation
    // ============================================
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['electionId']) || empty($data['positionId']) || empty($data['candidateId'])) {
        throw new \Exception('Missing required fields: electionId, positionId, candidateId');
    }

    $electionId = $data['electionId'];
    $positionId = $data['positionId'];
    $candidateId = $data['candidateId'];

    // ============================================
    // Hash Voter ID for Anonymity
    // ============================================
    // Use regNumber to create anonymous voter identifier
    $voterIdHash = hash('sha256', $user->regNumber . $positionId);

    // ============================================
    // Check if Already Voted in This Position
    // ============================================
    $vote = new Vote($pdo);
    if ($vote->hasVoted($electionId, $positionId, $voterIdHash)) {
        throw new \Exception('You have already voted in this position');
    }

    // ============================================
    // Submit Vote
    // ============================================
    if ($vote->submit($electionId, $positionId, $candidateId, $voterIdHash)) {
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Vote submitted successfully',
        ]);
    } else {
        throw new \Exception('Failed to submit vote');
    }
} catch (\Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
    ]);
}
?>

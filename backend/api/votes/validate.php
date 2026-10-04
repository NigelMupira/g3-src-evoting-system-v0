<?php

// ============================================
// Validate Voter Endpoint
// ============================================
// Check if user can vote in a position (authentication required)
// Validates: user is authenticated, election is active, user hasn't voted yet

header('Content-Type: application/json');

require_once __DIR__ . '/../../config/database.php';
$pdo = $GLOBALS['pdo'];
require_once __DIR__ . '/../../models/Vote.php';
require_once __DIR__ . '/../../models/Election.php';
require_once __DIR__ . '/../middleware/AdminAuth.php';

use App\Vote;
use App\Election;
use App\AdminAuth;

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        throw new \Exception('Only GET requests allowed');
    }

    // ============================================
    // Verify User Authentication
    // ============================================
    $adminAuth = new AdminAuth($_ENV['JWT_SECRET'] ?? 'your_secret_key');
    $user = $adminAuth->requireAuth();

    // ============================================
    // Get Election and Position IDs
    // ============================================
    $electionId = $_GET['election_id'] ?? null;
    $positionId = $_GET['position_id'] ?? null;

    if (empty($electionId) || empty($positionId)) {
        throw new \Exception('Missing required parameters: election_id, position_id');
    }

    // ============================================
    // Check Election Status
    // ============================================
    $election = new Election($pdo);
    $electionData = $election->getById($electionId);

    if (!$electionData) {
        throw new \Exception('Election not found');
    }

    $now = time();
    $startTime = strtotime($electionData['start_date']);
    $endTime = strtotime($electionData['end_date']);

    $canVote = true;
    $reason = null;

    if ($now < $startTime) {
        $canVote = false;
        $reason = 'Election has not started yet';
    } elseif ($now > $endTime) {
        $canVote = false;
        $reason = 'Election has ended';
    }

    // ============================================
    // Check if Already Voted in This Position
    // ============================================
    if ($canVote) {
        $voterIdHash = hash('sha256', $user->regNumber . $positionId);
        $vote = new Vote($pdo);
        if ($vote->hasVoted($electionId, $positionId, $voterIdHash)) {
            $canVote = false;
            $reason = 'You have already voted in this position';
        }
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'canVote' => $canVote,
        'reason' => $reason,
        'election' => [
            'id' => $electionData['id'],
            'name' => $electionData['name'],
            'startDate' => $electionData['start_date'],
            'endDate' => $electionData['end_date'],
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

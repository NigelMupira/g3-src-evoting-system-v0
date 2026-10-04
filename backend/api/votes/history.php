<?php
// ============================================
// Voter History & Dashboard Activity Endpoint
// ============================================
// Returns voting history, available elections, and participation statistics
// Requires voter authentication

header('Content-Type: application/json');

require_once __DIR__ . '/../../config/database.php';
$pdo = $GLOBALS['pdo'];
require_once __DIR__ . '/../middleware/AdminAuth.php';

use App\AdminAuth;

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        throw new \Exception('Only GET requests allowed');
    }

    // Verify user is authenticated
    $adminAuth = new AdminAuth($_ENV['JWT_SECRET'] ?? 'your_secret_key');
    $user = $adminAuth->requireAuth();

    $regNumber = $user->regNumber;

    // 1. Fetch all elections with position counts
    $electionStmt = $pdo->query("
        SELECT 
            e.id as election_id,
            e.name as election_name,
            e.description,
            e.start_date,
            e.end_date,
            e.is_active,
            (SELECT COUNT(*) FROM positions p WHERE p.election_id = e.id) as total_positions
        FROM elections e
        ORDER BY e.created_at DESC
    ");
    $allElections = $electionStmt->fetchAll();

    $now = time();
    $availableElections = [];
    $totalElectionsAvailable = 0;

    foreach ($allElections as $election) {
        $startTime = strtotime($election['start_date']);
        $endTime = strtotime($election['end_date']);

        if (!$election['is_active']) {
            $status = 'ended';
        } elseif ($now < $startTime) {
            $status = 'upcoming';
        } elseif ($now > $endTime) {
            $status = 'ended';
        } else {
            $status = 'active';
            $totalElectionsAvailable++;
        }

        $availableElections[] = [
            'election_id' => (int)$election['election_id'],
            'election_name' => $election['election_name'],
            'description' => $election['description'] ?: '',
            'status' => $status,
            'is_active' => (bool)$election['is_active'],
            'total_positions' => (int)$election['total_positions'],
            'start_date' => $election['start_date'],
            'end_date' => $election['end_date']
        ];
    }

    // 2. Fetch voter's vote records using voter_id_hash
    // In submit.php, hash is: hash('sha256', $user->regNumber . $positionId)
    // We match votes where voter_id_hash = SHA2(CONCAT(:regNumber, v.position_id), 256)
    $voteStmt = $pdo->prepare("
        SELECT 
            v.election_id,
            v.position_id,
            v.timestamp,
            e.name as election_name,
            e.description,
            e.is_active
        FROM votes v
        JOIN elections e ON v.election_id = e.id
        WHERE v.voter_id_hash = SHA2(CONCAT(?, v.position_id), 256)
        ORDER BY v.timestamp DESC
    ");
    $voteStmt->execute([$regNumber]);
    $userVotes = $voteStmt->fetchAll();

    // Group votes by election
    $electionsVoted = [];
    $totalVotesCast = count($userVotes);

    foreach ($userVotes as $voteRow) {
        $eId = $voteRow['election_id'];
        if (!isset($electionsVoted[$eId])) {
            $electionsVoted[$eId] = [
                'election_id' => (int)$eId,
                'election_name' => $voteRow['election_name'],
                'description' => $voteRow['description'] ?: '',
                'is_active' => (bool)$voteRow['is_active'],
                'positions_voted' => 0,
                'last_vote_time' => $voteRow['timestamp']
            ];
        }
        $electionsVoted[$eId]['positions_voted']++;
    }

    $votingHistory = array_values($electionsVoted);
    $totalElectionsParticipated = count($votingHistory);
    $participationRate = $totalElectionsAvailable > 0 
        ? round(($totalElectionsParticipated / $totalElectionsAvailable) * 100) 
        : ($totalElectionsParticipated > 0 ? 100 : 0);

    echo json_encode([
        'success' => true,
        'data' => [
            'voting_history' => $votingHistory,
            'available_elections' => $availableElections,
            'statistics' => [
                'total_elections_participated' => $totalElectionsParticipated,
                'total_votes_cast' => $totalVotesCast,
                'total_elections_available' => $totalElectionsAvailable,
                'participation_rate' => $participationRate
            ]
        ]
    ]);
} catch (\Exception $e) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>

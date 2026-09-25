<?php
// ============================================
// Admin Statistics API Endpoint
// ============================================
// Returns comprehensive dashboard statistics
// Requires admin authentication

header('Content-Type: application/json');

require_once __DIR__ . '/../../config/database.php';
$pdo = $GLOBALS['pdo'];
require_once __DIR__ . '/../middleware/AdminAuth.php';

use App\AdminAuth;

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        throw new \Exception('Only GET requests allowed');
    }

    $adminAuth = new AdminAuth($_ENV['JWT_SECRET'] ?? 'your_secret_key');
    $user = $adminAuth->requireAdmin();

    // Get user statistics
    $userQuery = "SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN role = 'user' THEN 1 ELSE 0 END) as voters,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admins
        FROM users WHERE is_active = TRUE";
    $userStmt = $pdo->query($userQuery);
    $userStats = $userStmt->fetch() ?: ['total' => 0, 'voters' => 0, 'admins' => 0];

    // Get election statistics
    $electionQuery = "SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_active = TRUE AND start_date <= NOW() AND end_date >= NOW() THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN start_date > NOW() THEN 1 ELSE 0 END) as upcoming,
        SUM(CASE WHEN end_date < NOW() THEN 1 ELSE 0 END) as completed
        FROM elections";
    $electionStmt = $pdo->query($electionQuery);
    $electionStats = $electionStmt->fetch() ?: ['total' => 0, 'active' => 0, 'upcoming' => 0, 'completed' => 0];

    // Get vote statistics
    $voteQuery = "SELECT 
        COUNT(*) as total_votes,
        COUNT(DISTINCT voter_id_hash) as unique_voters
        FROM votes";
    $voteStmt = $pdo->query($voteQuery);
    $voteStats = $voteStmt->fetch() ?: ['total_votes' => 0, 'unique_voters' => 0];

    // Get candidate statistics
    $candidateStmt = $pdo->query("SELECT COUNT(*) as total FROM candidates");
    $candidateCount = $candidateStmt->fetch()['total'] ?? 0;

    // Get system activity (24h)
    $activityQuery = "SELECT COUNT(*) as activity_24h FROM audit_log WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)";
    $activityStmt = $pdo->query($activityQuery);
    $activityStats = $activityStmt->fetch() ?: ['activity_24h' => 0];

    echo json_encode([
        'success' => true,
        'data' => [
            'users' => $userStats,
            'elections' => $electionStats,
            'voting' => $voteStats,
            'candidates' => ['total' => (int)$candidateCount],
            'system' => $activityStats
        ]
    ]);
} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to fetch statistics: ' . $e->getMessage()
    ]);
}
?>
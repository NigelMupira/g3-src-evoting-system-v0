<?php
// ============================================
// Admin Statistics API Endpoint
// ============================================
// Returns comprehensive dashboard statistics
// Requires admin authentication

require_once __DIR__ . '/../middleware/JWTAuth.php';
require_once __DIR__ . '/../middleware/AdminAuth.php';
require_once __DIR__ . '/../../config/database.php';

use App\Middleware\JWTAuth;
use App\Middleware\AdminAuth;

// Authenticate user and verify admin role
JWTAuth::authenticate();
AdminAuth::authorize();

try {
    $db = Database::getInstance();
    
    // Get user statistics
    $userStats = [
        'total' => 0,
        'voters' => 0,
        'admins' => 0
    ];
    
    $userQuery = "SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN role = 'user' THEN 1 ELSE 0 END) as voters,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admins
        FROM users WHERE is_active = TRUE";
    
    $userResult = $db->query($userQuery);
    if ($userResult) {
        $userStats = $userResult->fetch_assoc();
    }
    
    // Get election statistics
    $electionStats = [
        'total' => 0,
        'active' => 0,
        'upcoming' => 0,
        'completed' => 0
    ];
    
    $electionQuery = "SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_active = TRUE AND start_date <= NOW() AND end_date >= NOW() THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN start_date > NOW() THEN 1 ELSE 0 END) as upcoming,
        SUM(CASE WHEN end_date < NOW() THEN 1 ELSE 0 END) as completed
        FROM elections";
    
    $electionResult = $db->query($electionQuery);
    if ($electionResult) {
        $electionStats = $electionResult->fetch_assoc();
    }
    
    // Get vote statistics
    $voteStats = [
        'total' => 0,
        'today' => 0
    ];
    
    $voteQuery = "SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN DATE(timestamp) = CURDATE() THEN 1 ELSE 0 END) as today
        FROM votes";
    
    $voteResult = $db->query($voteQuery);
    if ($voteResult) {
        $voteStats = $voteResult->fetch_assoc();
    }
    
    // Get candidate statistics
    $candidateQuery = "SELECT COUNT(*) as total FROM candidates";
    $candidateResult = $db->query($candidateQuery);
    $candidateCount = $candidateResult ? $candidateResult->fetch_assoc()['total'] : 0;
    
    $response = [
        'success' => true,
        'data' => [
            'users' => $userStats,
            'elections' => $electionStats,
            'votes' => $voteStats,
            'candidates' => ['total' => $candidateCount]
        ]
    ];
    
    echo json_encode($response);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to fetch statistics: ' . $e->getMessage()
    ]);
}
?>
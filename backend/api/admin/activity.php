<?php
// ============================================
// Activity Timeline API Endpoint
// ============================================
// Returns recent system activities for admin dashboard
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
    $hours = isset($_GET['hours']) ? intval($_GET['hours']) : 24;
    
    $db = Database::getInstance();
    
    // Get recent activities from audit log
    $query = "SELECT 
        id,
        action,
        user_id,
        details,
        ip_address,
        timestamp
        FROM audit_log
        WHERE timestamp >= DATE_SUB(NOW(), INTERVAL ? HOUR)
        ORDER BY timestamp DESC
        LIMIT 50";
    
    $stmt = $db->prepare($query);
    $stmt->bind_param('i', $hours);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $activities = [];
    while ($row = $result->fetch_assoc()) {
        $activities[] = [
            'id' => $row['id'],
            'action' => $row['action'],
            'user_id' => $row['user_id'],
            'details' => json_decode($row['details'], true),
            'ip_address' => $row['ip_address'],
            'timestamp' => $row['timestamp']
        ];
    }
    
    $response = [
        'success' => true,
        'data' => [
            'activities' => $activities,
            'count' => count($activities)
        ]
    ];
    
    echo json_encode($response);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to fetch activity timeline: ' . $e->getMessage()
    ]);
}
?>
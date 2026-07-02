<?php
// ============================================
// Audit Logs API Endpoint
// ============================================
// Returns audit logs with optional filtering
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
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
    $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;
    
    // Build query with filters
    $whereConditions = ["1=1"];
    $params = [];
    $types = "";
    
    if (isset($_GET['action']) && !empty($_GET['action'])) {
        $whereConditions[] = "action = ?";
        $params[] = $_GET['action'];
        $types .= "s";
    }
    
    if (isset($_GET['user_id']) && !empty($_GET['user_id'])) {
        $whereConditions[] = "user_id = ?";
        $params[] = intval($_GET['user_id']);
        $types .= "i";
    }
    
    if (isset($_GET['start_date']) && !empty($_GET['start_date'])) {
        $whereConditions[] = "timestamp >= ?";
        $params[] = $_GET['start_date'];
        $types .= "s";
    }
    
    if (isset($_GET['end_date']) && !empty($_GET['end_date'])) {
        $whereConditions[] = "timestamp <= ?";
        $params[] = $_GET['end_date'];
        $types .= "s";
    }
    
    $whereClause = implode(" AND ", $whereConditions);
    
    $db = Database::getInstance();
    
    // Get total count
    $countQuery = "SELECT COUNT(*) as total FROM audit_log WHERE $whereClause";
    $countStmt = $db->prepare($countQuery);
    
    if (!empty($params)) {
        $countStmt->bind_param($types, ...$params);
    }
    
    $countStmt->execute();
    $totalResult = $countStmt->get_result();
    $total = $totalResult->fetch_assoc()['total'];
    
    // Get audit logs with pagination
    $query = "SELECT 
        id,
        action,
        user_id,
        details,
        ip_address,
        timestamp
        FROM audit_log
        WHERE $whereClause
        ORDER BY timestamp DESC
        LIMIT ? OFFSET ?";
    
    $params[] = $limit;
    $params[] = $offset;
    $types .= "ii";
    
    $stmt = $db->prepare($query);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $logs = [];
    while ($row = $result->fetch_assoc()) {
        $logs[] = [
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
            'logs' => $logs,
            'total' => $total,
            'limit' => $limit,
            'offset' => $offset
        ]
    ];
    
    echo json_encode($response);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to fetch audit logs: ' . $e->getMessage()
    ]);
}
?>
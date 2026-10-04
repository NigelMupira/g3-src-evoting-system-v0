<?php
// ============================================
// Audit Logs API Endpoint
// ============================================
// Returns audit logs with optional filtering
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

    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
    $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

    $whereConditions = ["1=1"];
    $params = [];

    if (isset($_GET['action']) && !empty($_GET['action'])) {
        $whereConditions[] = "action = ?";
        $params[] = $_GET['action'];
    }

    if (isset($_GET['user_id']) && !empty($_GET['user_id'])) {
        $whereConditions[] = "user_id = ?";
        $params[] = intval($_GET['user_id']);
    }

    if (isset($_GET['start_date']) && !empty($_GET['start_date'])) {
        $whereConditions[] = "timestamp >= ?";
        $params[] = $_GET['start_date'];
    }

    if (isset($_GET['end_date']) && !empty($_GET['end_date'])) {
        $whereConditions[] = "timestamp <= ?";
        $params[] = $_GET['end_date'];
    }

    $whereClause = implode(" AND ", $whereConditions);

    // Get total count
    $countStmt = $pdo->prepare("SELECT COUNT(*) as total FROM audit_log WHERE $whereClause");
    $countStmt->execute($params);
    $total = (int)($countStmt->fetch()['total'] ?? 0);

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
        LIMIT $limit OFFSET $offset";

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    $logs = [];
    foreach ($rows as $row) {
        // Fetch user details if user_id exists
        $userDetails = null;
        if ($row['user_id']) {
            $userStmt = $pdo->prepare("SELECT first_name, last_name, reg_number, role FROM users WHERE id = ?");
            $userStmt->execute([$row['user_id']]);
            $userDetails = $userStmt->fetch();
        }

        $logs[] = [
            'id' => $row['id'],
            'action' => $row['action'],
            'user_id' => $row['user_id'],
            'first_name' => $userDetails['first_name'] ?? null,
            'last_name' => $userDetails['last_name'] ?? null,
            'reg_number' => $userDetails['reg_number'] ?? null,
            'role' => $userDetails['role'] ?? null,
            'details' => json_decode($row['details'], true),
            'ip_address' => $row['ip_address'],
            'timestamp' => $row['timestamp']
        ];
    }

    echo json_encode([
        'success' => true,
        'data' => $logs,
        'pagination' => [
            'total' => $total,
            'limit' => $limit,
            'offset' => $offset
        ]
    ]);
} catch (\Exception $e) {
    $code = str_contains($e->getMessage(), 'Authorization') || str_contains($e->getMessage(), 'token') ? 401 : 500;
    http_response_code($code);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to fetch audit logs: ' . $e->getMessage()
    ]);
}
?>
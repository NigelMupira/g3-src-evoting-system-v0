<?php
// ============================================
// Activity Timeline API Endpoint
// ============================================
// Returns recent system activities for admin dashboard
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

    $hours = isset($_GET['hours']) ? intval($_GET['hours']) : 24;

    $stmt = $pdo->prepare("SELECT 
        id,
        action,
        user_id,
        details,
        ip_address,
        timestamp
        FROM audit_log
        WHERE timestamp >= DATE_SUB(NOW(), INTERVAL ? HOUR)
        ORDER BY timestamp DESC
        LIMIT 50");
    $stmt->execute([$hours]);
    $rows = $stmt->fetchAll();

    $activities = [];
    foreach ($rows as $row) {
        // Fetch user details if user_id exists
        $userDetails = null;
        if ($row['user_id']) {
            $userStmt = $pdo->prepare("SELECT first_name, last_name, reg_number, role FROM users WHERE id = ?");
            $userStmt->execute([$row['user_id']]);
            $userDetails = $userStmt->fetch();
        }

        $activities[] = [
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
        'data' => [
            'activities' => $activities,
            'count' => count($activities)
        ]
    ]);
} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to fetch activity timeline: ' . $e->getMessage()
    ]);
}
?>
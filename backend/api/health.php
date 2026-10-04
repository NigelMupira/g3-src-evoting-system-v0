<?php
// ============================================
// System Health Check Endpoint
// ============================================
// Used by Railway, Vercel, uptime monitors and frontend to verify backend status

header('Content-Type: application/json');

try {
    require_once __DIR__ . '/../../config/database.php';
    $pdo = $GLOBALS['pdo'];

    // Verify DB query execution
    $stmt = $pdo->query("SELECT 1");
    $dbOk = (bool)$stmt->fetchColumn();

    http_response_code(200);
    echo json_encode([
        'status' => 'healthy',
        'database' => $dbOk ? 'connected' : 'unreachable',
        'timestamp' => date('Y-m-d H:i:s'),
        'service' => 'src-evoting-api',
        'version' => '1.0.0'
    ]);
} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'unhealthy',
        'database' => 'disconnected',
        'error' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
?>

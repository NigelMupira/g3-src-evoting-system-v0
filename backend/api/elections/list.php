<?php

// ============================================
// List Elections Endpoint
// ============================================
// Retrieve all elections or filter by active status
// Public endpoint - no authentication required

header('Content-Type: application/json');

require_once __DIR__ . '/../../config/database.php';
$pdo = $GLOBALS['pdo'];
require_once __DIR__ . '/../../models/Election.php';

use App\Election;

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        throw new \Exception('Only GET requests allowed');
    }

    // Optional filter for active elections only
    $activeOnly = $_GET['active'] ?? false;
    $activeOnly = filter_var($activeOnly, FILTER_VALIDATE_BOOLEAN);

    $election = new Election($pdo);
    $elections = $election->getAll($activeOnly);

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $elections,
        'count' => count($elections),
    ]);
} catch (\Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
    ]);
}
?>

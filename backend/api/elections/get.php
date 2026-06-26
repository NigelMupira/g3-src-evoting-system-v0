<?php

// ============================================
// Get Election Details Endpoint
// ============================================
// Retrieve full details for a specific election by ID
// Public endpoint - no authentication required

header('Content-Type: application/json');

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../models/Election.php';

use App\Election;

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        throw new \Exception('Only GET requests allowed');
    }

    // ============================================
    // Get Election ID from Query Parameter
    // ============================================
    $electionId = $_GET['id'] ?? null;
    if (empty($electionId)) {
        throw new \Exception('Election ID is required');
    }

    $election = new Election($pdo);
    $electionData = $election->getById($electionId);

    if (!$electionData) {
        throw new \Exception('Election not found');
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $electionData,
    ]);
} catch (\Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
    ]);
}
?>

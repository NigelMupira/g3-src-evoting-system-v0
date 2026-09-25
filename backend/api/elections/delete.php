<?php

// ============================================
// Delete Election Endpoint
// ============================================
// Delete election and all associated data (admin only)
// Requires JWT token with admin role

header('Content-Type: application/json');

require_once __DIR__ . '/../../config/database.php';
$pdo = $GLOBALS['pdo'];
require_once __DIR__ . '/../../models/Election.php';
require_once __DIR__ . '/../middleware/AdminAuth.php';

use App\Election;
use App\AdminAuth;

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
        throw new \Exception('Only DELETE requests allowed');
    }

    // ============================================
    // Verify Admin Authorization
    // ============================================
    $adminAuth = new AdminAuth($_ENV['JWT_SECRET'] ?? 'your_secret_key');
    $user = $adminAuth->requireAdmin();

    // ============================================
    // Get Election ID
    // ============================================
    $electionId = $_GET['id'] ?? null;
    if (empty($electionId)) {
        throw new \Exception('Election ID is required');
    }

    // ============================================
    // Delete Election
    // ============================================
    // Cascading delete handled by database schema (ON DELETE CASCADE)
    $election = new Election($pdo);
    if ($election->delete($electionId)) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Election deleted successfully',
        ]);
    } else {
        throw new \Exception('Failed to delete election');
    }
} catch (\Exception $e) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
    ]);
}
?>

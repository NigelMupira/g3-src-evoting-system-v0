<?php
// ============================================
// Delete Candidate Endpoint
// ============================================
// Delete candidate from election (admin only)
// Requires JWT token with admin role

header('Content-Type: application/json');

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../models/Candidate.php';
require_once __DIR__ . '/../middleware/AdminAuth.php';

use App\Candidate;
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
    // Get Candidate ID
    // ============================================
    $candidateId = $_GET['id'] ?? null;
    if (empty($candidateId)) {
        throw new \Exception('Candidate ID is required');
    }

    // ============================================
    // Delete Candidate
    // ============================================
    $candidate = new Candidate($pdo);
    if ($candidate->delete($candidateId)) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Candidate deleted successfully',
        ]);
    } else {
        throw new \Exception('Failed to delete candidate');
    }
} catch (\Exception $e) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
    ]);
}
?>

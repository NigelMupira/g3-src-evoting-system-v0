<?php

// ============================================
// Update Candidate Endpoint
// ============================================
// Update candidate information (admin only)
// Requires JWT token with admin role

header('Content-Type: application/json');

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../models/Candidate.php';
require_once __DIR__ . '/../middleware/AdminAuth.php';

use App\Candidate;
use App\AdminAuth;

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
        throw new \Exception('Only PUT requests allowed');
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
    // Input Validation
    // ============================================
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['name'])) {
        throw new \Exception('Missing required field: name');
    }

    $name = trim($data['name']);
    $bio = $data['bio'] ?? null;
    $manifesto = $data['manifesto'] ?? null;
    $photoUrl = $data['photoUrl'] ?? null;
    $videoUrl = $data['videoUrl'] ?? null;

    // ============================================
    // Update Candidate
    // ============================================
    $candidate = new Candidate($pdo);
    if ($candidate->update($candidateId, $name, $bio, $manifesto, $photoUrl, $videoUrl)) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Candidate updated successfully',
        ]);
    } else {
        throw new \Exception('Failed to update candidate');
    }
} catch (\Exception $e) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
    ]);
}
?>

<?php

// ============================================
// Create Candidate Endpoint
// ============================================
// Add new candidate to election position (admin only)
// Requires JWT token with admin role

header('Content-Type: application/json');

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../models/Candidate.php';
require_once __DIR__ . '/../middleware/AdminAuth.php';

use App\Candidate;
use App\AdminAuth;

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new \Exception('Only POST requests allowed');
    }

    // ============================================
    // Verify Admin Authorization
    // ============================================
    $adminAuth = new AdminAuth($_ENV['JWT_SECRET'] ?? 'your_secret_key');
    $user = $adminAuth->requireAdmin();

    // ============================================
    // Input Validation
    // ============================================
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['electionId']) || empty($data['positionId']) || empty($data['name'])) {
        throw new \Exception('Missing required fields: electionId, positionId, name');
    }

    $electionId = $data['electionId'];
    $positionId = $data['positionId'];
    $name = trim($data['name']);
    $bio = $data['bio'] ?? null;
    $manifesto = $data['manifesto'] ?? null;
    $photoUrl = $data['photoUrl'] ?? null;
    $videoUrl = $data['videoUrl'] ?? null;

    // ============================================
    // Create Candidate
    // ============================================
    $candidate = new Candidate($pdo);
    $candidateId = $candidate->create($electionId, $positionId, $name, $bio, $manifesto, $photoUrl, $videoUrl);

    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Candidate created successfully',
        'data' => [
            'id' => $candidateId,
            'name' => $name,
        ],
    ]);
} catch (\Exception $e) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
    ]);
}
?>

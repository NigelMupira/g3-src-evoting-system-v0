<?php

// ============================================
// Create Election Endpoint
// ============================================
// Create new election (admin only)
// Requires JWT token with admin role

header('Content-Type: application/json');

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../models/Election.php';
require_once __DIR__ . '/../middleware/AdminAuth.php';

use App\Election;
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

    if (empty($data['name']) || empty($data['startDate']) || empty($data['endDate'])) {
        throw new \Exception('Missing required fields: name, startDate, endDate');
    }

    $name = trim($data['name']);
    $description = $data['description'] ?? null;
    $startDate = $data['startDate'];
    $endDate = $data['endDate'];

    // Validate dates
    if (strtotime($startDate) >= strtotime($endDate)) {
        throw new \Exception('Start date must be before end date');
    }

    // ============================================
    // Create Election
    // ============================================
    $election = new Election($pdo);
    $electionId = $election->create($name, $description, $startDate, $endDate, $user->userId);

    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Election created successfully',
        'data' => [
            'id' => $electionId,
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

<?php
// ============================================
// Update Election Endpoint
// ============================================
// Update election details (admin only)
// Requires JWT token with admin role

header('Content-Type: application/json');

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../models/Election.php';
require_once __DIR__ . '/../middleware/AdminAuth.php';

use App\Election;
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
    // Get Election ID
    // ============================================
    $electionId = $_GET['id'] ?? null;
    if (empty($electionId)) {
        throw new \Exception('Election ID is required');
    }

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

    if (strtotime($startDate) >= strtotime($endDate)) {
        throw new \Exception('Start date must be before end date');
    }

    // ============================================
    // Update Election
    // ============================================
    $election = new Election($pdo);
    if ($election->update($electionId, $name, $description, $startDate, $endDate)) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Election updated successfully',
        ]);
    } else {
        throw new \Exception('Failed to update election');
    }
} catch (\Exception $e) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
    ]);
}
?>

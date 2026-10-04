<?php

// ============================================
// Create Election Endpoint
// ============================================
// Create new election (admin only)
// Requires JWT token with admin role

header('Content-Type: application/json');

require_once __DIR__ . '/../../config/database.php';
$pdo = $GLOBALS['pdo'];
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

    // Auto-create positions for this election
    $defaultPositions = !empty($data['positions']) && is_array($data['positions']) 
        ? $data['positions'] 
        : ['President', 'Vice President', 'Secretary General', 'Treasurer'];

    $posStmt = $pdo->prepare("INSERT IGNORE INTO positions (election_id, position_name, max_votes) VALUES (?, ?, 1)");
    foreach ($defaultPositions as $posName) {
        $posName = trim($posName);
        if (!empty($posName)) {
            $posStmt->execute([$electionId, $posName]);
        }
    }

    // Auto-activate if dates encompass current time
    $now = time();
    if (strtotime($startDate) <= $now && strtotime($endDate) >= $now) {
        $pdo->prepare("UPDATE elections SET is_active = TRUE WHERE id = ?")->execute([$electionId]);
    }

    // Log to audit log
    $clientIP = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $logStmt = $pdo->prepare("INSERT INTO audit_log (action, user_id, details, ip_address) VALUES ('ELECTION_CREATE', ?, ?, ?)");
    $logStmt->execute([
        $user->userId,
        json_encode(['election_id' => $electionId, 'name' => $name]),
        $clientIP
    ]);

    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Election created successfully with positions',
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

<?php
// ============================================
// List Positions Endpoint
// ============================================
// Returns all positions for a specific election or all elections
// Public endpoint

header('Content-Type: application/json');

require_once __DIR__ . '/../../config/database.php';
$pdo = $GLOBALS['pdo'];

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        throw new \Exception('Only GET requests allowed');
    }

    $electionId = $_GET['election_id'] ?? null;

    if (!empty($electionId)) {
        $stmt = $pdo->prepare("SELECT id, election_id, position_name, max_votes, created_at FROM positions WHERE election_id = ? ORDER BY id ASC");
        $stmt->execute([$electionId]);
    } else {
        $stmt = $pdo->query("SELECT id, election_id, position_name, max_votes, created_at FROM positions ORDER BY election_id ASC, id ASC");
    }

    $positions = $stmt->fetchAll();

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $positions,
        'count' => count($positions)
    ]);
} catch (\Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>

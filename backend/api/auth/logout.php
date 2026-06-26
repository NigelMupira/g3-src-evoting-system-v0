<?php

// ============================================
// User Logout Endpoint
// ============================================
// Validates user JWT token and confirms logout
// In production, could add token to blacklist or clear sessions

header('Content-Type: application/json');

require_once __DIR__ . '/../../api/middleware/JWTAuth.php';

use App\JWTAuth;

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new \Exception('Only POST requests allowed');
    }

    // ============================================
    // Validate JWT Token
    // ============================================
    // Ensure user is authenticated before allowing logout
    $jwtAuth = new JWTAuth($_ENV['JWT_SECRET'] ?? 'your_secret_key');
    $token = $jwtAuth->getTokenFromHeader();
    $jwtAuth->validateToken($token);

    // ============================================
    // Process Logout
    // ============================================
    // Currently logout is client-side (token removal)
    // Could add:
    // - Token blacklist in database
    // - Clear any session data
    // - Invalidate refresh tokens

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Logout successful',
    ]);
} catch (\Exception $e) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
    ]);
}
?>

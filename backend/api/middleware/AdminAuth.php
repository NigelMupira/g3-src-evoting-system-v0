<?php
// ============================================
// Admin Authorization Middleware
// ============================================
// Verifies JWT token and checks if user has admin role
// Used to protect admin-only endpoints

namespace App;

require_once __DIR__ . '/JWTAuth.php';

use Firebase\JWT\Key;
use Firebase\JWT\JWT;

class AdminAuth {
    private $jwtAuth;

    public function __construct($secretKey) {
        $this->jwtAuth = new JWTAuth($secretKey);
    }

    // Verify user is authenticated AND is admin
    public function requireAdmin() {
        try {
            $token = $this->jwtAuth->getTokenFromHeader();
            $decoded = $this->jwtAuth->validateToken($token);

            if ($decoded->role !== 'admin') {
                throw new \Exception('Admin access required');
            }

            return $decoded;
        } catch (\Exception $e) {
            throw new \Exception("Authorization failed: " . $e->getMessage());
        }
    }

    // Verify user is authenticated (for non-admin protected routes)
    public function requireAuth() {
        try {
            $token = $this->jwtAuth->getTokenFromHeader();
            return $this->jwtAuth->validateToken($token);
        } catch (\Exception $e) {
            throw new \Exception("Authorization failed: " . $e->getMessage());
        }
    }
}
?>

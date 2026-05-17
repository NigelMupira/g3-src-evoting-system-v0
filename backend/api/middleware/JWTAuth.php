<?php
// ============================================
// JWT Authentication Handler
// ============================================
// Generates and validates JWT tokens for API authentication
// Handles token encoding/decoding and Authorization header parsing

namespace App;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JWTAuth {
    private $secretKey;
    private $tokenExpiry;

    public function __construct($secretKey, $tokenExpiry = 900) {
        $this->secretKey = $secretKey;
        $this->tokenExpiry = $tokenExpiry;
    }

    // Create JWT token with user claims (userId, regNumber, role)
    // Token expires in $tokenExpiry seconds (default 15 minutes)
    public function generateToken($userId, $regNumber, $role) {
        $now = time();
        $payload = [
            'iat' => $now,
            'exp' => $now + $this->tokenExpiry,
            'userId' => $userId,
            'regNumber' => $regNumber,
            'role' => $role,
        ];

        return JWT::encode($payload, $this->secretKey, 'HS256');
    }

    // Verify and decode JWT token
    // Throws exception if token is invalid or expired
    public function validateToken($token) {
        try {
            if (empty($token)) {
                throw new \Exception("Token is missing");
            }

            $decoded = JWT::decode($token, new Key($this->secretKey, 'HS256'));
            return $decoded;
        } catch (\Exception $e) {
            throw new \Exception("Invalid token: " . $e->getMessage());
        }
    }

    // Extract JWT token from Authorization header
    // Expected format: "Authorization: Bearer {token}"
    public function getTokenFromHeader() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';

        if (empty($authHeader)) {
            throw new \Exception("Authorization header is missing");
        }

        $parts = explode(' ', $authHeader);
        if (count($parts) !== 2 || $parts[0] !== 'Bearer') {
            throw new \Exception("Invalid authorization header format");
        }

        return $parts[1];
    }
}
?>

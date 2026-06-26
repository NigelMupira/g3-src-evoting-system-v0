<?php

// ============================================
// User Login Endpoint

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../models/User.php';
require_once __DIR__ . '/../middleware/JWTAuth.php';

use App\User;
use App\JWTAuth;

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new \Exception('Only POST requests allowed');
    }

    $data = json_decode(file_get_contents('php://input'), true);

    // ============================================
    // Input Validation
    // ============================================
    if (empty($data['regNumber']) || empty($data['password'])) {
        throw new \Exception('Missing required fields: regNumber, password');
    }

    $regNumber = trim($data['regNumber']);
    $password = $data['password'];

    // ============================================
    // Authenticate User
    // ============================================
    // Look up user by registration number
    $user = new User($pdo);
    $userData = $user->getByRegNumber($regNumber);

    // Verify password matches stored hash
    if (!$userData || !password_verify($password, $userData['password_hash'])) {
        throw new \Exception('Invalid registration number or password');
    }

    // ============================================
    // Generate JWT Token
    // ============================================
    $jwtAuth = new JWTAuth($_ENV['JWT_SECRET'] ?? 'your_secret_key');
    $token = $jwtAuth->generateToken($userData['id'], $userData['reg_number'], $userData['role']);

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'token' => $token,
        'user' => [
            'id' => $userData['id'],
            'regNumber' => $userData['reg_number'],
            'firstName' => $userData['first_name'],
            'lastName' => $userData['last_name'],
            'role' => $userData['role'],
            'school' => $userData['school'],
            'course' => $userData['course'],
        ],
    ]);
} catch (\Exception $e) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
    ]);
}
?>

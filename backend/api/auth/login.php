<?php

// ============================================
// User Login Endpoint

require_once __DIR__ . '/../../config/database.php';
$pdo = $GLOBALS['pdo'];
require_once __DIR__ . '/../../models/User.php';
require_once __DIR__ . '/../middleware/JWTAuth.php';
require_once __DIR__ . '/../middleware/RateLimiter.php';

use App\User;
use App\JWTAuth;
use App\RateLimiter;

try {
    // ============================================
    // Rate Limiting
    // ============================================
    // Prevent brute force attacks on login endpoint
    $rateLimiter = new RateLimiter($pdo, 5, 60); // 5 requests per minute
    $rateLimiter->checkLimit();

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

    // ============================================
    // Log Successful Login
    // ============================================
    $clientIP = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $logStmt = $pdo->prepare("
        INSERT INTO audit_log (action, user_id, details, ip_address)
        VALUES ('LOGIN', ?, ?, ?)
    ");
    $logStmt->execute([
        $userData['id'],
        json_encode(['reg_number' => $regNumber, 'timestamp' => date('Y-m-d H:i:s')]),
        $clientIP
    ]);

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

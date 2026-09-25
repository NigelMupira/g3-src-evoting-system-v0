<?php

// ============================================
// User Registration Endpoint
// ============================================
// Creates new user account with registration number and password
// Validates input, checks for duplicates, hashes password with bcrypt

header('Content-Type: application/json');

require_once __DIR__ . '/../../config/database.php';
$pdo = $GLOBALS['pdo'];
require_once __DIR__ . '/../../models/User.php';

use App\User;

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new \Exception('Only POST requests allowed');
    }

    $data = json_decode(file_get_contents('php://input'), true);

    // ============================================
    // Input Validation
    // ============================================
    if (empty($data['regNumber']) || empty($data['password']) || empty($data['firstName']) || empty($data['lastName'])) {
        throw new \Exception('Missing required fields: regNumber, password, firstName, lastName');
    }

    $regNumber = trim($data['regNumber']);
    $password = $data['password'];
    $firstName = trim($data['firstName']);
    $lastName = trim($data['lastName']);
    $school = $data['school'] ?? null;
    $course = $data['course'] ?? null;

    // Validate registration number length
    if (strlen($regNumber) < 3) {
        throw new \Exception('Registration number must be at least 3 characters');
    }

    // Validate password strength (minimum 6 characters)
    if (strlen($password) < 6) {
        throw new \Exception('Password must be at least 6 characters');
    }

    // ============================================
    // Check for Duplicate Registration
    // ============================================
    $user = new User($pdo);
    if ($user->emailExists($regNumber)) {
        throw new \Exception('Registration number already exists');
    }

    // ============================================
    // Create User Account
    // ============================================
    // Hash password with bcrypt before storing
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    if ($user->create($regNumber, $firstName, $lastName, $passwordHash, $school, $course)) {
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'User registered successfully',
            'data' => [
                'regNumber' => $regNumber,
                'firstName' => $firstName,
                'lastName' => $lastName,
            ],
        ]);
    } else {
        throw new \Exception('Failed to create user');
    }
} catch (\Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
    ]);
}
?>

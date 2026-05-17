<?php
// Main API Router
// Central entry point for all API requests

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . ($_ENV['FRONTEND_URL'] ?? 'http://localhost:3000'));
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Route the request
$request = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$request = str_replace('/api', '', $request);
$parts = array_filter(explode('/', $request));

// TODO: Implement routing logic
// Route pattern: /api/{resource}/{action}
// Example: /api/auth/login -> api/auth/login.php

if (empty($parts)) {
    http_response_code(404);
    echo json_encode(['error' => 'Not Found']);
    exit;
}

echo json_encode(['message' => 'Backend API is running']);
?>

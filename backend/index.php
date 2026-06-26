<?php
// ============================================
// Front Controller & Global CORS Handler
// ============================================
// This is the single entry point for ALL backend API requests.
// The PHP built-in server is started with:
//   php -S localhost:8000 index.php
//
// Why this approach?
//   Previously each API endpoint required its own cors.php include,
//   leading to repeated boilerplate. Now CORS is handled once here,
//   and requests are routed dynamically to the correct script.
//
// Request flow:
//   Browser -> index.php -> CORS headers set -> route to api/auth/login.php etc.

// ============================================
// Section 1: CORS Headers
// ============================================
// Cross-Origin Resource Sharing (CORS) allows the React frontend
// (running on localhost:3000) to communicate with this backend
// (running on localhost:8000) despite being on different ports.
//
// Only origins in $allowedOrigins are permitted.
// On deployment, add the production Vercel URL to $allowedOrigins.
$allowedOrigins = [
    'http://localhost:3000',   // Local React dev server (npm run start)
    'http://127.0.0.1:3000',  // Alternate localhost address
];

// Determine the incoming request origin
$origin = $_SERVER['HTTP_ORIGIN'] ?? 'http://localhost:3000';

// Only echo back the origin if it's in our allowed list (prevents open CORS)
$allowedOrigin = in_array($origin, $allowedOrigins, true) ? $origin : 'http://localhost:3000';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . $allowedOrigin);
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
// Vary header tells caches that the response varies by Origin
header('Vary: Origin');

// ============================================
// Section 2: OPTIONS Preflight Handling
// ============================================
// Browsers send an OPTIONS "preflight" request before actual POST/PUT/DELETE
// requests to check if CORS is permitted. We must respond immediately with
// 204 No Content and the CORS headers set above.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ============================================
// Section 3: Dynamic File Router
// ============================================
// Maps the incoming URL path to the corresponding PHP endpoint file.
//
// Examples:
//   GET  /api/auth/login.php      -> backend/api/auth/login.php
//   POST /api/elections/create.php -> backend/api/elections/create.php
//   GET  /api/votes/results.php   -> backend/api/votes/results.php
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Build absolute path to the target script
$scriptPath = __DIR__ . $requestUri;

// If the URL was given without .php extension, append it automatically
// e.g. /api/auth/login -> /api/auth/login.php
if (!str_ends_with($scriptPath, '.php') && file_exists($scriptPath . '.php')) {
    $scriptPath .= '.php';
}

// Security check: confirm file exists, is a real file, and is NOT this router itself
// (prevents infinite include loops)
if (file_exists($scriptPath) && is_file($scriptPath) && realpath($scriptPath) !== __FILE__) {
    require_once $scriptPath;
    exit;
}

// ============================================
// Section 4: 404 Fallback
// ============================================
// If no matching endpoint file was found, return a JSON 404 error
http_response_code(404);
echo json_encode([
    'success' => false,
    'error'   => 'Endpoint not found',
]);
?>

<?php
// Database configuration
// Load environment variables
require_once __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->safeLoad();

// Database connection details supporting standard env and Railway variables
$db_url = $_ENV['MYSQL_URL'] ?? getenv('MYSQL_URL');
if ($db_url) {
    $parsedUrl = parse_url($db_url);
    $db_host = $parsedUrl['host'] ?? 'localhost';
    $db_port = $parsedUrl['port'] ?? 3306;
    $db_user = $parsedUrl['user'] ?? 'root';
    $db_pass = $parsedUrl['pass'] ?? '';
    $db_name = ltrim($parsedUrl['path'] ?? 'evoting_system', '/');
} else {
    $db_host = $_ENV['DB_HOST'] ?? $_ENV['MYSQLHOST'] ?? getenv('DB_HOST') ?: (getenv('MYSQLHOST') ?: 'localhost');
    $db_port = $_ENV['DB_PORT'] ?? $_ENV['MYSQLPORT'] ?? getenv('DB_PORT') ?: (getenv('MYSQLPORT') ?: '3306');
    $db_user = $_ENV['DB_USER'] ?? $_ENV['MYSQLUSER'] ?? getenv('DB_USER') ?: (getenv('MYSQLUSER') ?: 'root');
    $db_pass = $_ENV['DB_PASS'] ?? $_ENV['MYSQLPASSWORD'] ?? getenv('DB_PASS') ?: (getenv('MYSQLPASSWORD') ?: '');
    $db_name = $_ENV['DB_NAME'] ?? $_ENV['MYSQLDATABASE'] ?? getenv('DB_NAME') ?: (getenv('MYSQLDATABASE') ?: 'evoting_system');
}

try {
    $dsn = "mysql:host={$db_host};port={$db_port};dbname={$db_name};charset=utf8mb4";
    $pdo = new PDO(
        $dsn,
        $db_user,
        $db_pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database connection failed: ' . $e->getMessage()
    ]);
    exit;
}

$GLOBALS['pdo'] = $pdo;
return $pdo;
?>

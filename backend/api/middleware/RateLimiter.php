<?php
// ============================================
// Rate Limiter Middleware
// ============================================
// Prevents brute force attacks and API abuse
// Implements token bucket algorithm for rate limiting
// Configurable limits per endpoint and time window

namespace App;

class RateLimiter {
    private $pdo;
    private $maxRequests;
    private $timeWindow;
    private $identifier;

    /**
     * Constructor
     * @param PDO $pdo - Database connection for storing rate limit data
     * @param int $maxRequests - Maximum requests allowed in time window
     * @param int $timeWindow - Time window in seconds
     */
    public function __construct($pdo, $maxRequests = 100, $timeWindow = 60) {
        $this->pdo = $pdo;
        $this->maxRequests = $maxRequests;
        $this->timeWindow = $timeWindow;
        $this->identifier = $this->getClientIdentifier();
    }

    /**
     * Get client identifier (IP address)
     * Uses multiple headers to detect real IP behind proxies
     */
    private function getClientIdentifier() {
        $headers = [
            'HTTP_CF_CONNECTING_IP', // Cloudflare
            'HTTP_X_FORWARDED_FOR',  // General proxy
            'HTTP_X_REAL_IP',        // Nginx
            'REMOTE_ADDR'            // Direct connection
        ];

        foreach ($headers as $header) {
            if (!empty($_SERVER[$header])) {
                $ip = $_SERVER[$header];
                // Handle multiple IPs in X-Forwarded-For
                if (strpos($ip, ',') !== false) {
                    $ip = trim(explode(',', $ip)[0]);
                }
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                    return $ip;
                }
            }
        }

        return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    }

    /**
     * Check if request is allowed
     * @return bool - True if request is within rate limit
     * @throws \Exception - If rate limit exceeded
     */
    public function checkLimit() {
        try {
            // Clean up old entries
            $this->cleanupOldEntries();

            // Get current request count
            $currentCount = $this->getCurrentRequestCount();

            // Check if limit exceeded
            if ($currentCount >= $this->maxRequests) {
                $retryAfter = $this->getRetryAfter();
                header('X-RateLimit-Limit: ' . $this->maxRequests);
                header('X-RateLimit-Remaining: 0');
                header('X-RateLimit-Reset: ' . $retryAfter);
                header('Retry-After: ' . $retryAfter);
                
                throw new \Exception('Rate limit exceeded. Please try again later.');
            }

            // Record this request
            $this->recordRequest();

            // Set rate limit headers
            header('X-RateLimit-Limit: ' . $this->maxRequests);
            header('X-RateLimit-Remaining: ' . ($this->maxRequests - $currentCount - 1));
            header('X-RateLimit-Reset: ' . (time() + $this->timeWindow));

            return true;

        } catch (\PDOException $e) {
            // If rate limiter fails, allow request (fail-open)
            error_log("Rate limiter error: " . $e->getMessage());
            return true;
        }
    }

    /**
     * Get current request count for this identifier
     */
    private function getCurrentRequestCount() {
        // Use APCu if available for better performance
        if (function_exists('apcu_fetch')) {
            $key = 'ratelimit_' . $this->identifier;
            $data = apcu_fetch($key);
            if ($data !== false && $data['expiry'] > time()) {
                return $data['count'];
            }
            return 0;
        }

        // Fallback to database
        try {
            $stmt = $this->pdo->prepare("
                SELECT COUNT(*) as count 
                FROM rate_limits 
                WHERE identifier = ? AND timestamp > DATE_SUB(NOW(), INTERVAL ? SECOND)
            ");
            $stmt->execute([$this->identifier, $this->timeWindow]);
            return (int)$stmt->fetch()['count'];
        } catch (\PDOException $e) {
            // If rate_limits table doesn't exist yet, allow request (fail-open)
            return 0;
        }
    }

    /**
     * Record this request
     */
    private function recordRequest() {
        // Use APCu if available
        if (function_exists('apcu_store')) {
            $key = 'ratelimit_' . $this->identifier;
            $data = apcu_fetch($key);
            if ($data === false || $data['expiry'] <= time()) {
                $data = ['count' => 0, 'expiry' => time() + $this->timeWindow];
            }
            $data['count']++;
            apcu_store($key, $data, $this->timeWindow);
            return;
        }

        // Fallback to database
        try {
            $stmt = $this->pdo->prepare("
                INSERT INTO rate_limits (identifier, timestamp, endpoint)
                VALUES (?, NOW(), ?)
            ");
            $stmt->execute([$this->identifier, $_SERVER['REQUEST_URI'] ?? 'unknown']);
        } catch (\PDOException $e) {
            // If rate_limits table doesn't exist yet, fail silently
            // This allows the system to work before migration
        }
    }

    /**
     * Clean up old rate limit entries
     */
    private function cleanupOldEntries() {
        if (!function_exists('apcu_store')) {
            try {
                $stmt = $this->pdo->prepare("
                    DELETE FROM rate_limits 
                    WHERE timestamp < DATE_SUB(NOW(), INTERVAL ? SECOND)
                ");
                $stmt->execute([$this->timeWindow]);
            } catch (\PDOException $e) {
                // If rate_limits table doesn't exist yet, fail silently
                // This allows the system to work before migration
            }
        }
    }

    /**
     * Get seconds until rate limit resets
     */
    private function getRetryAfter() {
        if (function_exists('apcu_fetch')) {
            $key = 'ratelimit_' . $this->identifier;
            $data = apcu_fetch($key);
            if ($data !== false) {
                return max(1, $data['expiry'] - time());
            }
        }
        return $this->timeWindow;
    }

    /**
     * Block suspicious IP addresses
     * @param array $suspiciousIPs - Array of IPs to block
     */
    public function blockSuspiciousIPs($suspiciousIPs = []) {
        if (in_array($this->identifier, $suspiciousIPs)) {
            http_response_code(403);
            throw new \Exception('Access denied');
        }
    }
}
?>

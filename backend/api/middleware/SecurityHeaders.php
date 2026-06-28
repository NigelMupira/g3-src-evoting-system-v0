<?php
// ============================================
// Security Headers Middleware
// ============================================
// Sets security-related HTTP headers to protect against common web vulnerabilities
// Implements OWASP security best practices

namespace App;

class SecurityHeaders {
    
    /**
     * Apply all security headers
     */
    public static function applyAll() {
        self::preventClickjacking();
        self::preventXSS();
        self::preventMIMETypeSniffing();
        self::enableHSTS();
        self::preventContentSniffing();
        self::setReferrerPolicy();
        self::setPermissionsPolicy();
    }
    
    /**
     * Prevent clickjacking attacks
     * Uses X-Frame-Options and Content-Security-Policy frame-ancestors
     */
    public static function preventClickjacking() {
        // Legacy header
        header('X-Frame-Options: DENY');
        
        // Modern CSP approach
        header('Content-Security-Policy: frame-ancestors \'none\'');
    }
    
    /**
     * Prevent Cross-Site Scripting (XSS)
     * Uses Content-Security-Policy to restrict script sources
     */
    public static function preventXSS() {
        // Basic CSP - allow only same-origin scripts
        header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none';");
        
        // Enable XSS protection (legacy but still useful)
        header('X-XSS-Protection: 1; mode=block');
    }
    
    /**
     * Prevent MIME type sniffing
     * Forces browser to respect declared content type
     */
    public static function preventMIMETypeSniffing() {
        header('X-Content-Type-Options: nosniff');
    }
    
    /**
     * Enable HTTP Strict Transport Security (HSTS)
     * Forces HTTPS connections for specified time period
     * Only enable in production with HTTPS
     */
    public static function enableHSTS($maxAge = 31536000, $includeSubDomains = true) {
        $hstsValue = 'max-age=' . $maxAge;
        if ($includeSubDomains) {
            $hstsValue .= '; includeSubDomains';
        }
        
        // Only enable HSTS if already on HTTPS
        if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
            header('Strict-Transport-Security: ' . $hstsValue);
        }
    }
    
    /**
     * Prevent content sniffing in older browsers
     */
    public static function preventContentSniffing() {
        header('X-Download-Options: noopen');
    }
    
    /**
     * Set Referrer-Policy header
     * Controls how much referrer information is sent
     */
    public static function setReferrerPolicy($policy = 'strict-origin-when-cross-origin') {
        header('Referrer-Policy: ' . $policy);
    }
    
    /**
     * Set Permissions-Policy (formerly Feature-Policy)
     * Controls which browser features can be used
     */
    public static function setPermissionsPolicy() {
        // Disable unnecessary features
        $features = [
            'geolocation' => '()',
            'microphone' => '()',
            'camera' => '()',
            'payment' => '()',
            'usb' => '()',
            'magnetometer' => '()',
            'gyroscope' => '()',
        ];
        
        $policyString = implode(' ', array_map(
            fn($feature, $value) => "$feature=$value",
            array_keys($features),
            $features
        ));
        
        header('Permissions-Policy: ' . $policyString);
    }
    
    /**
     * Remove server information from headers
     * Prevents information disclosure
     */
    public static function hideServerInfo() {
        header_remove('Server');
        header_remove('X-Powered-By');
    }
    
    /**
     * Set cache control headers for sensitive data
     * Prevents caching of sensitive information
     */
    public static function preventCaching() {
        header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
        header('Cache-Control: post-check=0, pre-check=0', false);
        header('Pragma: no-cache');
        header('Expires: Wed, 11 Jan 1984 05:00:00 GMT');
    }
    
    /**
     * Set appropriate cache headers for public data
     */
    public static function enableCaching($maxAge = 3600) {
        header('Cache-Control: public, max-age=' . $maxAge);
        header('Expires: ' . gmdate('D, d M Y H:i:s', time() + $maxAge) . ' GMT');
    }
}
?>

<?php
// ============================================
// Input Validator Middleware
// ============================================
// Sanitizes and validates user input to prevent injection attacks
// Handles XSS, SQL injection prevention, and data type validation

namespace App;

class InputValidator {
    
    /**
     * Sanitize string input
     * @param string $input - Raw input string
     * @param bool $stripTags - Whether to strip HTML tags
     * @return string - Sanitized string
     */
    public static function sanitizeString($input, $stripTags = true) {
        if (!is_string($input)) {
            return '';
        }
        
        $input = trim($input);
        
        if ($stripTags) {
            $input = strip_tags($input);
        }
        
        // Convert special characters to HTML entities
        $input = htmlspecialchars($input, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        
        return $input;
    }
    
    /**
     * Validate email address
     * @param string $email - Email to validate
     * @return bool - True if valid
     */
    public static function validateEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }
    
    /**
     * Validate registration number format
     * @param string $regNumber - Registration number to validate
     * @return bool - True if valid format
     */
    public static function validateRegNumber($regNumber) {
        // Format: A000000A (letter, 6 digits, letter)
        return preg_match('/^[A-Z]\d{6}[A-Z]$/', $regNumber) === 1;
    }
    
    /**
     * Validate password strength
     * @param string $password - Password to validate
     * @return array - Validation result with 'valid' and 'message' keys
     */
    public static function validatePassword($password) {
        if (strlen($password) < 8) {
            return ['valid' => false, 'message' => 'Password must be at least 8 characters long'];
        }
        
        if (!preg_match('/[A-Z]/', $password)) {
            return ['valid' => false, 'message' => 'Password must contain at least one uppercase letter'];
        }
        
        if (!preg_match('/[a-z]/', $password)) {
            return ['valid' => false, 'message' => 'Password must contain at least one lowercase letter'];
        }
        
        if (!preg_match('/[0-9]/', $password)) {
            return ['valid' => false, 'message' => 'Password must contain at least one number'];
        }
        
        if (!preg_match('/[^A-Za-z0-9]/', $password)) {
            return ['valid' => false, 'message' => 'Password must contain at least one special character'];
        }
        
        return ['valid' => true, 'message' => 'Password is valid'];
    }
    
    /**
     * Sanitize array of inputs
     * @param array $inputs - Array of inputs to sanitize
     * @param array $rules - Array of validation rules per field
     * @return array - Sanitized inputs or validation errors
     */
    public static function sanitizeAndValidate($inputs, $rules = []) {
        $sanitized = [];
        $errors = [];
        
        foreach ($inputs as $key => $value) {
            $rule = $rules[$key] ?? [];
            
            // Apply sanitization
            if (isset($rule['sanitize'])) {
                switch ($rule['sanitize']) {
                    case 'string':
                        $sanitized[$key] = self::sanitizeString($value, $rule['stripTags'] ?? true);
                        break;
                    case 'int':
                        $sanitized[$key] = filter_var($value, FILTER_SANITIZE_NUMBER_INT);
                        break;
                    case 'email':
                        $sanitized[$key] = filter_var($value, FILTER_SANITIZE_EMAIL);
                        break;
                    default:
                        $sanitized[$key] = $value;
                }
            } else {
                $sanitized[$key] = is_string($value) ? self::sanitizeString($value) : $value;
            }
            
            // Apply validation
            if (isset($rule['validate'])) {
                switch ($rule['validate']) {
                    case 'required':
                        if (empty($sanitized[$key])) {
                            $errors[$key] = $rule['message'] ?? 'This field is required';
                        }
                        break;
                    case 'email':
                        if (!self::validateEmail($sanitized[$key])) {
                            $errors[$key] = $rule['message'] ?? 'Invalid email format';
                        }
                        break;
                    case 'reg_number':
                        if (!self::validateRegNumber($sanitized[$key])) {
                            $errors[$key] = $rule['message'] ?? 'Invalid registration number format';
                        }
                        break;
                    case 'password':
                        $passwordCheck = self::validatePassword($sanitized[$key]);
                        if (!$passwordCheck['valid']) {
                            $errors[$key] = $passwordCheck['message'];
                        }
                        break;
                }
            }
        }
        
        return [
            'sanitized' => $sanitized,
            'errors' => $errors,
            'valid' => empty($errors)
        ];
    }
    
    /**
     * Validate JSON input
     * @param string $json - JSON string to validate
     * @return bool - True if valid JSON
     */
    public static function validateJSON($json) {
        json_decode($json);
        return json_last_error() === JSON_ERROR_NONE;
    }
    
    /**
     * Prevent SQL injection by escaping values
     * Note: This should be used alongside prepared statements
     * @param string $value - Value to escape
     * @return string - Escaped value
     */
    public static function escapeSQL($value) {
        // This is a fallback - always use prepared statements in queries
        return addslashes($value);
    }
}
?>

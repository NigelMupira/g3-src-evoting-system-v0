// ============================================
// Input Validators
// ============================================
// Validation functions used across the application
// Ensures consistent validation logic and prevents code duplication

import { REG_NUMBER_PATTERN, PASSWORD_REQUIREMENTS } from "./constants";

/**
 * Validates registration number format
 * Expected format: A000000A (letter-6digits-letter)
 */
export const validateRegNumber = (regNumber) => {
  if (!regNumber || regNumber.length !== 8) {
    return "Registration number must be 8 characters long";
  }
  if (!REG_NUMBER_PATTERN.test(regNumber)) {
    return "Invalid format. Use format: A000000A";
  }
  return null;
};

/**
 * Validates password strength against requirements
 * Checks length, uppercase, lowercase, numbers, and special characters
 */
export const validatePassword = (password) => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    return `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters`;
  }
  if (PASSWORD_REQUIREMENTS.uppercase && !/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (PASSWORD_REQUIREMENTS.lowercase && !/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (PASSWORD_REQUIREMENTS.numbers && !/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }
  if (PASSWORD_REQUIREMENTS.specialChars && !/[!@#$%^&*]/.test(password)) {
    return "Password must contain at least one special character (!@#$%^&*)";
  }
  return null;
};

/**
 * Validates that two values match
 * Used for password confirmation
 */
export const validateMatch = (value1, value2, fieldName) => {
  if (value1 !== value2) {
    return `${fieldName} does not match`;
  }
  return null;
};

/**
 * Validates email format (for future use)
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return "Email is required";
  }
  if (!emailRegex.test(email)) {
    return "Invalid email format";
  }
  return null;
};

/**
 * Validates that a field is not empty
 */
export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === "") {
    return `${fieldName} is required`;
  }
  return null;
};

/**
 * Calculates password strength on a scale of 0-5
 * Used to display password strength indicator
 */
export const calculatePasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= PASSWORD_REQUIREMENTS.minLength) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*]/.test(password)) strength++;
  return strength;
};

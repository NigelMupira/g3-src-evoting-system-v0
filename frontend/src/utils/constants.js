// ============================================
// Application Constants
// ============================================
// Centralized constants used throughout the application
// Keeps values in one place for easy updates and consistency

// Registration number validation pattern
// Format: 1 letter + 6 digits + 1 letter (e.g., A123456B)
export const REG_NUMBER_PATTERN = /^[A-Za-z]\d{6}[A-Za-z]$/;
export const REG_NUMBER_LENGTH = 8;
export const REG_NUMBER_FORMAT = "Format: A000000A (letter-6 digits-letter)";

// Password validation requirements
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  uppercase: true,
  lowercase: true,
  numbers: true,
  specialChars: true,
};

// Password strength levels
export const PASSWORD_STRENGTH = {
  WEAK: { level: 1, label: "Weak", color: "#ff4444" },
  MODERATE: { level: 2, label: "Moderate", color: "#ffbb33" },
  STRONG: { level: 3, label: "Strong", color: "#00C851" },
};

// User roles
export const USER_ROLES = {
  VOTER: "voter",
  ADMIN: "admin",
};

// Election status
export const ELECTION_STATUS = {
  DRAFT: "draft",
  ACTIVE: "active",
  CLOSED: "closed",
  ARCHIVED: "archived",
};

// API configuration
export const API_TIMEOUT = 30000; // 30 seconds
export const API_RETRY_ATTEMPTS = 3;

// Token configuration (in minutes)
export const TOKEN_EXPIRY = {
  ACCESS: 15, // 15 minutes
  REFRESH: 10080, // 7 days
};

// Route paths
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  VOTING: "/voting",
  RESULTS: "/results",
  ADMIN: "/admin",
  MANAGE_ELECTIONS: "/admin/elections",
  MANAGE_CANDIDATES: "/admin/candidates",
  VIEW_RESULTS: "/admin/results",
};

// Error messages
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Invalid registration number or password",
  REGISTRATION_FAILED: "Registration failed. Please try again.",
  LOGIN_FAILED: "Login failed. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to access this resource",
  VOTE_FAILED: "Failed to submit your vote. Please try again.",
};

// Success messages
export const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESS: "Registration successful! Redirecting to login...",
  LOGIN_SUCCESS: "Login successful!",
  VOTE_SUBMITTED: "Your vote has been submitted successfully!",
  LOGOUT_SUCCESS: "You have been logged out.",
};

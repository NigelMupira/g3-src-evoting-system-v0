// ============================================
// Authentication Service
// ============================================
// API calls related to user authentication
// Handles login, registration, and logout operations

import { apiPost } from "./api";

/**
 * Registers a new user account
 * Sends user data to backend for account creation
 * Backend will hash password and store user data
 */
export const registerUser = async (userData) => {
  return apiPost("/api/auth/register.php", {
    firstName: userData.firstName,
    lastName: userData.lastName,
    regNumber: userData.regNumber,
    school: userData.school,
    course: userData.course,
    password: userData.password,
  });
};

/**
 * Authenticates user with credentials
 * Backend validates credentials and returns JWT token
 * Token is stored in localStorage by AuthContext
 */
export const loginUser = async (regNumber, password) => {
  return apiPost("/api/auth/login.php", {
    regNumber,
    password,
  });
};

/**
 * Logs out the current user
 * Notifies backend to invalidate session
 * Frontend clears token from localStorage
 */
export const logoutUser = async () => {
  try {
    await apiPost("/api/auth/logout.php", {});
  } catch (error) {
    // Logout on frontend even if backend call fails
    console.warn("Logout API call failed, clearing local session");
  }
};

/**
 * Requests a password reset
 * Backend sends reset link to user's email
 */
export const requestPasswordReset = async (regNumber) => {
  return apiPost("/api/auth/forgot-password.php", {
    regNumber,
  });
};

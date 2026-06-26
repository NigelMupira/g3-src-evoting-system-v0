// ============================================
// Authentication Context & Provider
// ============================================
// Global state management for user authentication
// Provides auth methods (login, register, logout) and auth state to entire app
// Uses React Context API to avoid prop drilling

import React, { createContext, useContext, useState, useCallback } from "react";
import { loginUser, registerUser, logoutUser } from "../services/authService";

// ============================================
// Create Context
// ============================================
// This context will be provided to all children components
const AuthContext = createContext();

// ============================================
// useAuth Custom Hook
// ============================================
// Hook to access authentication state and methods from anywhere in the app
// Usage: const { user, token, login, logout } = useAuth();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// ============================================
// AuthProvider Component
// ============================================
// Wraps the entire app to provide auth state and methods
// Should be placed at the root of the app (in App.js)

export const AuthProvider = ({ children }) => {
  // ============================================
  // State
  // ============================================
  // user: Current logged-in user object {id, regNumber, firstName, lastName, role}
  // token: JWT token for API authentication (stored in localStorage)
  // isLoading: True while API calls are in progress
  // error: Error message from authentication attempts

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ============================================
  // Login Method
  // ============================================
  // Calls backend API to authenticate user with registration number and password
  // On success: stores token in localStorage and updates user state
  // On error: sets error message that can be displayed to user

  const login = useCallback(async (regNumber, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginUser(regNumber, password);

      // Token is stored by authService, set in context
      setToken(response.token);
      setUser(response.user);
      return { user: response.user, token: response.token };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============================================
  // Register Method
  // ============================================
  // Calls backend API to create new user account with provided information
  // Returns result but does NOT automatically log user in
  // User must navigate to login page after successful registration

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await registerUser(userData);

      return { success: true, user: response.data, message: "Registration successful" };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || "Registration failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============================================
  // Logout Method
  // ============================================
  // Calls backend API to invalidate session and clears local authentication data
  // User will be redirected to login page by ProtectedRoute component

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logoutUser();
    } catch (err) {
      console.warn("Logout API call failed, clearing local session anyway");
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  }, []);

  // ============================================
  // isAuthenticated Helper
  // ============================================
  // Computed property to check if user is logged in
  // True only if BOTH token AND user data exist

  const isAuthenticated = !!token && !!user;

  // ============================================
  // Context Value
  // ============================================
  // All values and methods provided to children
  const value = {
    user, // Current user object
    token, // JWT token for API calls
    isLoading, // Loading state for async operations
    error, // Error message from auth operations
    login, // Function to login user
    register, // Function to register new user
    logout, // Function to logout user
    isAuthenticated, // Boolean indicating if user is logged in
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


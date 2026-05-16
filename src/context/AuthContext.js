// ============================================
// Authentication Context & Provider
// ============================================
// Global state management for user authentication
// Provides auth methods (login, register, logout) and auth state to entire app
// Uses React Context API to avoid prop drilling

import React, { createContext, useContext, useState, useCallback } from "react";

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
  // Authenticates user with registration number and password
  // On success: stores token in localStorage and updates user state
  // On error: sets error message that can be displayed to user

  const login = useCallback(async (regNumber, password) => {
    setIsLoading(true);
    setError(null);
    try {
      // Call backend API to authenticate user
      // Backend verifies credentials and returns JWT token
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regNumber, password }),
      });

      const data = await response.json();

      // Handle API errors
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token securely for future API calls
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============================================
  // Register Method
  // ============================================
  // Creates new user account with provided information
  // Returns result but does NOT automatically log user in
  // User must navigate to login page after successful registration

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Call backend API to register new user
      // Backend hashes password and stores user data securely
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      // Handle API errors
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============================================
  // Logout Method
  // ============================================
  // Clears all authentication data from local storage and state
  // User will be redirected to login page by ProtectedRoute component

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setError(null);
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


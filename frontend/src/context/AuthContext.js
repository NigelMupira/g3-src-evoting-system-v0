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
      // Mock login - in production, call backend API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create mock user based on input
      // Admin accounts: reg number starts with "ADMIN"
      const isAdmin = regNumber.toUpperCase().startsWith("ADMIN");

      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        regNumber,
        firstName: isAdmin ? "Admin" : regNumber.split("").slice(0, 4).join(""),
        lastName: "User",
        role: isAdmin ? "admin" : "user",
      };

      const mockToken = "mock-jwt-token-" + Math.random().toString(36).substr(2, 9);

      localStorage.setItem("token", mockToken);
      setToken(mockToken);
      setUser(mockUser);
      return { user: mockUser, token: mockToken };
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
      // Mock registration - in production, call backend API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create mock user account
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        regNumber: userData.regNumber,
        firstName: userData.firstName,
        lastName: userData.lastName,
        school: userData.school,
        course: userData.course,
        role: "user",
      };

      // In a real app, the backend would return this
      return { success: true, user: mockUser, message: "Registration successful" };
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


// ============================================
// Protected Route Component
// ============================================
// Wraps routes that require authentication
// Redirects unauthenticated users to login
// Can also enforce role-based access control (admin routes)

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute component for secure routes
 * Checks authentication and optionally validates user role
 *
 * Props:
 *   - children: Component to render if authorized
 *   - isAdmin: Optional boolean - if true, only admins can access
 */
const ProtectedRoute = ({ children, isAdmin = false }) => {
  const { isAuthenticated, user } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to dashboard if trying to access admin route without admin role
  if (isAdmin && user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // User is authorized - render the protected component
  return children;
};

export default ProtectedRoute;

// ============================================
// Root Application Component
// ============================================
// Main app component that sets up routing, authentication context, and page structure
// All routes and providers are configured here

import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserDashboard from "./pages/user/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

// ============================================
// Protected Route Component
// ============================================
// Wrapper for routes that require authentication
// Checks if user is logged in and has correct role before rendering

const ProtectedRoute = ({ children, isAdmin = false }) => {
  const { isAuthenticated, user } = useAuth();

  // Redirect to login if user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect non-admin users away from admin routes
  if (isAdmin && user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // User is authorized - render the protected component
  return children;
};

// ============================================
// Route Configuration Component
// ============================================
// Defines all available routes in the application
// Separated from App component to keep routing logic organized

const AppRoutes = () => {
  return (
    <Routes>
      {/* ============================================ */}
      {/* Public Routes - No authentication required */}
      {/* ============================================ */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* ============================================ */}
      {/* User Routes - Requires authentication */}
      {/* ============================================ */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* ============================================ */}
      {/* Admin Routes - Requires admin authentication */}
      {/* ============================================ */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute isAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch all unknown routes - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// ============================================
// Main App Component
// ============================================
// Wraps entire application with AuthProvider for global auth state
// Sets up routing with React Router

const App = () => {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
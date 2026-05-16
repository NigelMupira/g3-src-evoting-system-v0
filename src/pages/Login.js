// ============================================
// Login Page Component
// ============================================
// Handles user login functionality
// Validates registration number and password, authenticates with backend
// Security: Password is only stored in memory, NOT in localStorage

import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, Box, Paper, IconButton, InputAdornment, Checkbox, FormControlLabel, AppBar, Toolbar } from "@mui/material";
import { Visibility, VisibilityOff, Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { useAuth } from "../context/AuthContext";

// ============================================
// Styled Components
// ============================================
// Custom styled TextField with border color styling

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'black' },
    '&:hover fieldset': { borderColor: 'blue', boxShadow: '0 0 5px blue' },
    '&.Mui-focused fieldset': { borderColor: 'blue' },
  },
}));

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error: authError, isAuthenticated } = useAuth();

  // ============================================
  // State Management
  // ============================================
  // formData: Contains login form inputs (regNumber, password, etc.)
  // errors: Validation errors displayed to user
  // regNumber can be remembered via localStorage if "Remember Me" is checked

  const [formData, setFormData] = useState({
    regNumber: localStorage.getItem("regNumber") || "", // Restore saved reg number
    password: "",
    showPassword: false,
    rememberMe: !!localStorage.getItem("regNumber"),
  });

  const [errors, setErrors] = useState({});

  // ============================================
  // Effect: Redirect if already logged in
  // ============================================
  // If user successfully logs in, redirect to dashboard
  // Prevents returning to login page after authentication

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // ============================================
  // Input Validation & Change Handler
  // ============================================
  // Validates registration number format in real-time
  // Removes spaces from input for cleaner validation
  // Format: A000000A (letter-6digits-letter)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = value.replace(/\s/g, ""); // Remove spaces
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : newValue });

    // Validate registration number format
    if (name === "regNumber") {
      if (newValue.length !== 8) {
        setErrors({ ...errors, regNumber: "Reg Number must be 8 characters long." });
      } else if (!/^[A-Za-z]\d{6}[A-Za-z]$/.test(newValue)) {
        setErrors({ ...errors, regNumber: "Invalid Reg Number." });
      } else {
        setErrors({ ...errors, regNumber: "" });
      }
    }

    // Clear password error when user starts typing
    if (name === "password") {
      setErrors({ ...errors, password: newValue ? "" : "Required field" });
    }
  };

  // ============================================
  // Password Visibility Toggle
  // ============================================
  // Shows/hides password based on user preference
  // Helps when user wants to verify password before submitting

  const handleTogglePassword = () => {
    setFormData({ ...formData, showPassword: !formData.showPassword });
  };

  // ============================================
  // Form Submission Handler
  // ============================================
  // Validates all fields before submitting
  // Calls login() from AuthContext
  // On success: redirects to dashboard
  // On error: displays error message to user
  // Password is NOT stored - only sent to backend

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    // Validation: Registration number
    if (!formData.regNumber) {
      newErrors.regNumber = "Required field";
    } else if (formData.regNumber.length !== 8) {
      newErrors.regNumber = "Reg Number must be 8 characters long.";
    } else if (!/^[A-Za-z]\d{6}[A-Za-z]$/.test(formData.regNumber)) {
      newErrors.regNumber = "Invalid Reg Number.";
    }

    // Validation: Password
    if (!formData.password) newErrors.password = "Required field";

    setErrors(newErrors);

    // Submit if no validation errors
    if (Object.keys(newErrors).length === 0) {
      try {
        // Call login from AuthContext
        // Returns token and user data on success
        await login(formData.regNumber, formData.password);

        // Save registration number if "Remember Me" is checked
        // Password is NEVER stored for security
        if (formData.rememberMe) {
          localStorage.setItem("regNumber", formData.regNumber);
        } else {
          localStorage.removeItem("regNumber");
        }

        navigate("/dashboard");
      } catch (err) {
        // Display authentication error
        setErrors({ ...errors, api: err.message || "Login failed. Please try again." });
      }
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "rgba(100, 200, 225, 0.3)", backdropFilter: "blur(15px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      {/* ============================================ */}
      {/* Navigation Bar */}
      {/* ============================================ */}
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate("/")} aria-label="Home">
            <Home />
          </IconButton>
          <Typography variant="h6" onClick={() => navigate("/")} sx={{ cursor: "pointer" }}>
            SRC E-Voting System
          </Typography>
        </Toolbar>
      </AppBar>

      {/* ============================================ */}
      {/* Login Form Container */}
      {/* ============================================ */}
      <Container maxWidth="sm" sx={{ mt: 12 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Login
          </Typography>

          {/* ============================================ */}
          {/* Form Fields */}
          {/* ============================================ */}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Registration Number Input */}
            <StyledTextField
              label="Reg Number"
              name="regNumber"
              value={formData.regNumber}
              onChange={handleChange}
              required
              fullWidth
              helperText={errors.regNumber}
              error={!!errors.regNumber}
              aria-label="Registration Number"
            />

            {/* Password Input with visibility toggle */}
            <StyledTextField
              label="Password"
              name="password"
              type={formData.showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{
                endAdornment: (
                  formData.password && (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end" aria-label="Toggle password visibility">
                        {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                ),
              }}
              helperText={errors.password}
              error={!!errors.password}
              aria-label="Password"
            />

            {/* Remember Me Checkbox - Only stores reg number, NOT password */}
            <FormControlLabel
              control={<Checkbox name="rememberMe" checked={formData.rememberMe} onChange={handleChange} />}
              label="Remember Me (saves reg number only)"
            />

            {/* Forgot Password Link */}
            <Typography variant="body2" align="right">
              <a href="/forgot-password" style={{ color: "#1565c0", textDecoration: "none" }}>Forgot Password?</a>
            </Typography>

            {/* Login Button */}
            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              sx={{ height: "48px", transition: "transform 0.2s", "&:hover": { transform: "scale(1.02)" } }}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            {/* Error Messages */}
            {(errors.api || authError) && <Typography color="error" align="center">{errors.api || authError}</Typography>}

            {/* Link to Registration Page */}
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Don't have an account? <a href="/register" style={{ color: "#1565c0", textDecoration: "none" }}>Sign up</a>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
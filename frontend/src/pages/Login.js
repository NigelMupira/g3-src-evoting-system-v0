// ============================================
// Login Page
// ============================================
// User authentication page with professional form design
// Validates registration number and password
// Integrates with AuthContext for global state management

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  FormControlLabel,
  Checkbox,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";
import Header from "../components/common/Header";
import ThemeToggle from "../components/common/ThemeToggle";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, isAuthenticated, user } = useAuth();

  const [formData, setFormData] = useState({
    regNumber: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [localError, setLocalError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      const defaultPath = user.role === "admin" ? "/admin" : "/dashboard";
      const from = location.state?.from?.pathname || defaultPath;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  useEffect(() => {
    const savedRegNumber = localStorage.getItem("savedRegNumber");
    if (savedRegNumber) {
      setFormData((prev) => ({ ...prev, regNumber: savedRegNumber }));
      setRememberMe(true);
    }
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.regNumber.trim()) {
      errors.regNumber = "Registration number is required";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setLocalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (rememberMe) {
      localStorage.setItem("savedRegNumber", formData.regNumber);
    } else {
      localStorage.removeItem("savedRegNumber");
    }

    try {
      const result = await login(formData.regNumber, formData.password);
      if (result) {
        // ============================================
        // Role-Based Redirect
        // ============================================
        const isAdmin = result.user?.role === "admin";
        const defaultPath = isAdmin ? "/admin" : "/dashboard";
        const from = location.state?.from?.pathname || defaultPath;
        navigate(from);
      }
    } catch (err) {
      // Error state is handled by AuthContext and set in 'error' state
      console.error("Login attempt failed:", err.message);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary", display: "flex", flexDirection: "column" }}>
      <Helmet>
        <title>Login - SRC E-Voting System</title>
        <meta name="description" content="Login to the SRC E-Voting System to cast your vote." />
      </Helmet>

      <Header
        title="SRC E-Voting"
        showHomeButton={true}
        rightContent={<ThemeToggle />}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          p: 2,
        }}
      >
        <Container maxWidth="sm">
          <Card
            sx={{
              p: 4,
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
              borderRadius: "0.75rem",
              bgcolor: "background.paper",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: "primary.main",
                textAlign: "center",
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                color: "text.secondary",
                mb: 3,
              }}
            >
              Sign in to your account to vote
            </Typography>

            {(error || localError) && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: "0.5rem" }}>
                {error || localError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Registration Number"
                name="regNumber"
                placeholder="e.g., H230001A"
                value={formData.regNumber}
                onChange={handleChange}
                error={!!fieldErrors.regNumber}
                helperText={fieldErrors.regNumber}
                margin="normal"
                autoComplete="username"
                disabled={isLoading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "0.5rem",
                  },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                error={!!fieldErrors.password}
                helperText={fieldErrors.password}
                margin="normal"
                autoComplete="current-password"
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePassword}
                        edge="end"
                        disabled={isLoading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "0.5rem",
                  },
                }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                  />
                }
                label="Remember registration number"
                sx={{ mt: 1, mb: 2 }}
              />

              <Button
                fullWidth
                variant="contained"
                size="large"
                color="primary"
                onClick={handleSubmit}
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: "1rem",
                  textTransform: "none",
                  borderRadius: "0.5rem",
                  mb: 2,
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    Logging in...
                  </Box>
                ) : (
                  "Sign In"
                )}
              </Button>

              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  color: "text.secondary",
                  mb: 1,
                }}
              >
                Don't have an account?{" "}
                <Link
                  onClick={() => navigate("/register")}
                  sx={{
                    color: "secondary.main",
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Sign up
                </Link>
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textAlign: "center",
                  color: "text.secondary",
                  mt: 2,
                }}
              >
                Need help? Contact support@src-voting.edu
              </Typography>
            </Box>
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;
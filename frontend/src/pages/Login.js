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
  AppBar,
  Toolbar,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error } = useAuth();

  const [formData, setFormData] = useState({
    regNumber: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [localError, setLocalError] = useState("");

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

    const result = await login(formData.regNumber, formData.password);
    if (result) {
      // ============================================
      // Role-Based Redirect
      // ============================================
      // After a successful login the backend returns the user's role from the database.
      // We check result.user.role to determine where to send them:
      //   - role === 'admin'  -> /admin (Admin Dashboard)
      //   - role === 'user'   -> /dashboard (Voter Dashboard)
      //
      // Admins are NOT registered on the platform by themselves.
      // They are added directly to the database by a superuser/initial admin,
      // then log in via this same login page. The redirect happens automatically
      // once the backend confirms their role.
      //
      // If the user was trying to access a protected page before logging in,
      // location.state.from will contain that path and we redirect there instead.
      const isAdmin = result.user?.role === "admin";
      const defaultPath = isAdmin ? "/admin" : "/dashboard";
      const from = location.state?.from?.pathname || defaultPath;
      navigate(from);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F8F9FA", display: "flex", flexDirection: "column" }}>
      <Helmet>
        <title>Login - SRC E-Voting System</title>
        <meta name="description" content="Login to the SRC E-Voting System to cast your vote." />
      </Helmet>

      <AppBar position="static" sx={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            SRC E-Voting
          </Typography>
        </Toolbar>
      </AppBar>

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
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: "#003087",
                textAlign: "center",
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                color: "#666666",
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
                placeholder="e.g., STU2024001"
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
                onClick={handleSubmit}
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: "1rem",
                  textTransform: "none",
                  borderRadius: "0.5rem",
                  mb: 2,
                  background: isLoading ? "#999999" : "#003087",
                  "&:hover": {
                    background: isLoading ? "#999999" : "#0052CC",
                  },
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
                  color: "#666666",
                  mb: 1,
                }}
              >
                Don't have an account?{" "}
                <Link
                  onClick={() => navigate("/register")}
                  sx={{
                    color: "#D4A017",
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
                  color: "#999999",
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
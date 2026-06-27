// ============================================
// Registration Page
// ============================================
// User account creation with comprehensive validation
// Enforces strong password requirements and school/course selection
// Integrates with AuthContext for global state management

import React, { useState } from "react";
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  MenuItem,
  LinearProgress,
  InputAdornment,
  IconButton,
  AppBar,
  Toolbar,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";
import { SCHOOLS, COURSES } from "../data/schools";

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    regNumber: "",
    school: "",
    course: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[!@#$%^&*]/.test(password)) strength += 1;
    return strength;
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    if (!formData.regNumber.trim()) {
      errors.regNumber = "Registration number is required";
    }
    if (!formData.school) {
      errors.school = "School is required";
    }
    if (!formData.course) {
      errors.course = "Course is required";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = "Password must contain an uppercase letter";
    } else if (!/[a-z]/.test(formData.password)) {
      errors.password = "Password must contain a lowercase letter";
    } else if (!/[0-9]/.test(formData.password)) {
      errors.password = "Password must contain a number";
    } else if (!/[!@#$%^&*]/.test(formData.password)) {
      errors.password = "Password must contain a special character";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        regNumber: formData.regNumber,
        school: formData.school,
        course: formData.course,
        password: formData.password,
      });

      setSuccessMessage("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setFieldErrors((prev) => ({
        ...prev,
        api: err.message || "Registration failed",
      }));
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F8F9FA", display: "flex", flexDirection: "column" }}>
      <Helmet>
        <title>Register - SRC E-Voting System</title>
        <meta name="description" content="Create your account to participate in SRC elections." />
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
              Create Account
            </Typography>
            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                color: "#666666",
                mb: 3,
              }}
            >
              Join to vote in SRC elections
            </Typography>

            {(error || fieldErrors.api) && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: "0.5rem" }}>
                {error || fieldErrors.api}
              </Alert>
            )}

            {successMessage && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: "0.5rem" }}>
                {successMessage}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!fieldErrors.firstName}
                  helperText={fieldErrors.firstName}
                  disabled={isLoading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "0.5rem",
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!fieldErrors.lastName}
                  helperText={fieldErrors.lastName}
                  disabled={isLoading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "0.5rem",
                    },
                  }}
                />
              </Box>

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
                disabled={isLoading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "0.5rem",
                  },
                }}
              />

              <Box sx={{ display: "flex", gap: 2, mt: 2, mb: 2 }}>
                <TextField
                  select
                  fullWidth
                  label="School"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  error={!!fieldErrors.school}
                  helperText={fieldErrors.school}
                  disabled={isLoading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "0.5rem",
                    },
                  }}
                >
                  <MenuItem value="">Select School</MenuItem>
                  {SCHOOLS.map((school) => (
                    <MenuItem key={school} value={school}>
                      {school}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  fullWidth
                  label="Course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  error={!!fieldErrors.course}
                  helperText={fieldErrors.course}
                  disabled={!formData.school || isLoading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "0.5rem",
                    },
                  }}
                >
                  <MenuItem value="">Select Course</MenuItem>
                  {formData.school &&
                    COURSES[formData.school]?.map((course) => (
                      <MenuItem key={course} value={course}>
                        {course}
                      </MenuItem>
                    ))}
                </TextField>
              </Box>

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
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
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

              {formData.password && (
                <Box sx={{ my: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(passwordStrength / 5) * 100}
                    sx={{
                      height: 8,
                      borderRadius: "4px",
                      backgroundColor: "#E0E0E0",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor:
                          passwordStrength <= 2
                            ? "#EF4444"
                            : passwordStrength === 3
                            ? "#F59E0B"
                            : "#22C55E",
                        borderRadius: "4px",
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ mt: 1, display: "block", color: "#666666" }}>
                    Strength:{" "}
                    {passwordStrength <= 2
                      ? "Weak"
                      : passwordStrength === 3
                      ? "Moderate"
                      : "Strong"}
                  </Typography>
                </Box>
              )}

              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!fieldErrors.confirmPassword}
                helperText={fieldErrors.confirmPassword}
                margin="normal"
                disabled={isLoading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "0.5rem",
                  },
                }}
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
                  mt: 3,
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
                    Creating Account...
                  </Box>
                ) : (
                  "Create Account"
                )}
              </Button>

              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  color: "#666666",
                }}
              >
                Already have an account?{" "}
                <Box
                  component="span"
                  onClick={() => navigate("/login")}
                  sx={{
                    color: "#D4A017",
                    fontWeight: 600,
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Sign in
                </Box>
              </Typography>
            </Box>
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default Register;
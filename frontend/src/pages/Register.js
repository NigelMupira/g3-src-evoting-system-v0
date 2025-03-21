import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Paper, MenuItem, IconButton, InputAdornment, AppBar, Toolbar, LinearProgress } from "@mui/material";
import { Visibility, VisibilityOff, Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";

const schools = ["Engineering", "Business", "Arts"];
const courses = {
  Engineering: ["ENG101", "ENG102", "ENG103"],
  Business: ["BUS201", "BUS202", "BUS203"],
  Arts: ["ART301", "ART302", "ART303"],
};

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'black' },
    '&:hover fieldset': { borderColor: 'blue', boxShadow: '0 0 5px blue' },
    '&.Mui-focused fieldset': { borderColor: 'blue' },
  },
}));

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    regNumber: "",
    school: "",
    course: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = value.replace(/\s/g, "");
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : newValue });

    if (name === "regNumber") {
      if (newValue.length !== 8) {
        setErrors({ ...errors, regNumber: "Reg Number must be 8 characters long." });
      } else if (!/^[A-Za-z]\d{6}[A-Za-z]$/.test(newValue)) {
        setErrors({ ...errors, regNumber: "Invalid Reg Number." });
      } else {
        setErrors({ ...errors, regNumber: "" });
      }
    }

    if (name === "password") {
      setErrors({ ...errors, password: newValue ? "" : "Required field" });
    }
  };

  const handleTogglePassword = () => {
    setFormData({ ...formData, showPassword: !formData.showPassword });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.firstName) newErrors.firstName = "Required field";
    if (!formData.lastName) newErrors.lastName = "Required field";
    if (!formData.regNumber) {
      newErrors.regNumber = "Required field";
    } else if (formData.regNumber.length !== 8) {
      newErrors.regNumber = "Reg Number must be 8 characters long.";
    } else if (!/^[A-Za-z]\d{6}[A-Za-z]$/.test(formData.regNumber)) {
      newErrors.regNumber = "Invalid Reg Number.";
    }

    if (!formData.school) newErrors.school = "Required field";
    if (!formData.course) newErrors.course = "Required field";

    if (!formData.password) {
      newErrors.password = "Required field";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one lowercase letter.";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number.";
    } else if (!/[!@#$%^&*]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one special character.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Required field";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log("Form Submitted", formData);
        navigate("/login");
      } catch (error) {
        console.error("Registration failed", error);
        setErrors({ ...errors, api: "Registration failed. Please try again." });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "rgba(100, 200, 225, 0.3)", backdropFilter: "blur(15px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
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
      <Container maxWidth="sm" sx={{ mt: 12 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Registration
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <StyledTextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                fullWidth
                helperText={errors.firstName}
                error={!!errors.firstName}
                aria-label="First Name"
              />
              <StyledTextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                fullWidth
                helperText={errors.lastName}
                error={!!errors.lastName}
                aria-label="Last Name"
              />
            </Box>
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
            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <StyledTextField
                select
                label="School"
                name="school"
                value={formData.school}
                onChange={handleChange}
                required
                fullWidth
                helperText={errors.school}
                error={!!errors.school}
                aria-label="School"
              >
                {schools.map((school) => (
                  <MenuItem key={school} value={school}>
                    {school}
                  </MenuItem>
                ))}
              </StyledTextField>
              <StyledTextField
                select
                label="Course Code"
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
                fullWidth
                disabled={!formData.school}
                helperText={errors.course}
                error={!!errors.course}
                aria-label="Course Code"
              >
                {formData.school && courses[formData.school].map((course) => (
                  <MenuItem key={course} value={course}>
                    {course}
                  </MenuItem>
                ))}
              </StyledTextField>
            </Box>
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
            {formData.password && (
              <Box sx={{ width: "100%", mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={(passwordStrength / 5) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#e0e0e0",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor:
                        passwordStrength <= 2
                          ? "#ff4444"
                          : passwordStrength === 3
                          ? "#ffbb33"
                          : "#00C851",
                    },
                  }}
                />
                <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
                  Password Strength:{" "}
                  {passwordStrength <= 2
                    ? "Weak"
                    : passwordStrength === 3
                    ? "Moderate"
                    : "Strong"}
                </Typography>
              </Box>
            )}
            <StyledTextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              fullWidth
              helperText={errors.confirmPassword}
              error={!!errors.confirmPassword}
              aria-label="Confirm Password"
            />
            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              sx={{ height: "48px", transition: "transform 0.2s", "&:hover": { transform: "scale(1.02)" } }}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>
            {errors.api && <Typography color="error" align="center">{errors.api}</Typography>}
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Already have an account? <a href="/login" style={{ color: "#1565c0", textDecoration: "none" }} onClick={() => navigate("/login")}>Sign in</a>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;

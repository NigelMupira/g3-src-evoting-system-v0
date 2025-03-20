import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Paper, IconButton, InputAdornment, Checkbox, FormControlLabel, AppBar, Toolbar } from "@mui/material";
import { Visibility, VisibilityOff, Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'black' },
    '&:hover fieldset': { borderColor: 'blue', boxShadow: '0 0 5px blue' },
    '&.Mui-focused fieldset': { borderColor: 'blue' },
  },
}));

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    regNumber: "",
    password: "",
    showPassword: false,
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

    if (!formData.regNumber) {
      newErrors.regNumber = "Required field";
    } else if (formData.regNumber.length !== 8) {
      newErrors.regNumber = "Reg Number must be 8 characters long.";
    } else if (!/^[A-Za-z]\d{6}[A-Za-z]$/.test(formData.regNumber)) {
      newErrors.regNumber = "Invalid Reg Number.";
    }

    if (!formData.password) newErrors.password = "Required field";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log("Login Successful", formData);

        if (formData.rememberMe) {
          localStorage.setItem("regNumber", formData.regNumber);
          localStorage.setItem("password", formData.password);
        } else {
          localStorage.removeItem("regNumber");
          localStorage.removeItem("password");
        }

        navigate("/dashboard");
      } catch (error) {
        console.error("Login failed", error);
        setErrors({ ...errors, api: "Login failed. Please try again." });
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
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
            <FormControlLabel
              control={<Checkbox name="rememberMe" checked={formData.rememberMe} onChange={handleChange} />}
              label="Remember Me"
            />
            <Typography variant="body2" align="right">
              <a href="/forgot-password" style={{ color: "#1565c0", textDecoration: "none" }}>Forgot Password?</a>
            </Typography>
            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              sx={{ height: "48px", transition: "transform 0.2s", "&:hover": { transform: "scale(1.02)" } }}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            {errors.api && <Typography color="error" align="center">{errors.api}</Typography>}
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
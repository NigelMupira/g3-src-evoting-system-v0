import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Paper, MenuItem, IconButton, InputAdornment, AppBar, Toolbar } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
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
    '& fieldset': {
      borderColor: 'black',
    },
    '&:hover fieldset': {
      borderColor: 'blue',
      boxShadow: '0 0 5px blue',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'blue',
    },
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: value.trim() ? "" : "Required field" });
  };

  const handleTogglePassword = () => {
    setFormData({ ...formData, showPassword: !formData.showPassword });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) newErrors[key] = "Required field";
    });
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (formData.regNumber.length !== 8 || !/^[a-zA-Z0-9]+$/.test(formData.regNumber)) {
      newErrors.regNumber = "Reg Number must be exactly 8 alphanumeric characters.";
    }
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter.";
    }
    if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one lowercase letter.";
    }
    if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number.";
    }
    if (!/[!@#$%^&*]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one special character.";
    }
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        localStorage.setItem("username", formData.regNumber);
        localStorage.setItem("password", formData.password);
        console.log("Form Submitted", formData);
        navigate("/login"); // Navigate to login page after successful registration
      } catch (error) {
        console.error("Registration failed", error);
        // Handle error here (not shown)
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "rgba(100, 200, 225, 0.3)", backdropFilter: "blur(15px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <Typography variant="h6">SRC E-Voting System</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" sx={{ mt: 12 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Registration
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <StyledTextField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required fullWidth helperText={errors.firstName} error={!!errors.firstName} />
              <StyledTextField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required fullWidth helperText={errors.lastName} error={!!errors.lastName} />
            </Box>
            <StyledTextField label="Reg Number" name="regNumber" value={formData.regNumber} onChange={handleChange} required fullWidth helperText={errors.regNumber} error={!!errors.regNumber} />
            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <StyledTextField select label="School" name="school" value={formData.school} onChange={handleChange} required fullWidth helperText={errors.school} error={!!errors.school}>
                {schools.map((school) => (
                  <MenuItem key={school} value={school}>{school}</MenuItem>
                ))}
              </StyledTextField>
              <StyledTextField select label="Course Code" name="course" value={formData.course} onChange={handleChange} required fullWidth disabled={!formData.school} helperText={errors.course} error={!!errors.course}>
                {formData.school && courses[formData.school].map((course) => (
                  <MenuItem key={course} value={course}>{course}</MenuItem>
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
                      <IconButton onClick={handleTogglePassword} edge="end">
                        {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                )
              }}
              helperText={errors.password} error={!!errors.password}
              sx={{ mt: 6 }}
            />
            <StyledTextField label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required fullWidth helperText={errors.confirmPassword} error={!!errors.confirmPassword} />
            <Button type="submit" variant="contained" color="success" fullWidth sx={{ height: "48px" }} disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
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
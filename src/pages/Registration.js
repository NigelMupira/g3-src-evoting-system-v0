import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Paper, MenuItem, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const schools = ["Engineering", "Business", "Arts"];
const courses = {
  Engineering: ["ENG101", "ENG102", "ENG103"],
  Business: ["BUS201", "BUS202", "BUS203"],
  Arts: ["ART301", "ART302", "ART303"],
};

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    school: "",
    course: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTogglePassword = () => {
    setFormData({ ...formData, showPassword: !formData.showPassword });
  };

  const validatePassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validatePassword(formData.password)) {
      alert("Password must be at least 8 characters long, include a number, uppercase letter, and special character.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (formData.studentId.length !== 8 || !/^[a-zA-Z0-9]+$/.test(formData.studentId)) {
      alert("Student ID must be exactly 8 alphanumeric characters.");
      return;
    }
    console.log("Form Submitted", formData);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Register for SRC E-Voting
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required fullWidth />
            <TextField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required fullWidth />
          </Box>
          <TextField label="Student ID" name="studentId" value={formData.studentId} onChange={handleChange} required fullWidth />
          <TextField 
            select 
            label="School" 
            name="school" 
            value={formData.school} 
            onChange={handleChange} 
            required 
            fullWidth
          >
            {schools.map((school) => (
              <MenuItem key={school} value={school}>{school}</MenuItem>
            ))}
          </TextField>
          <TextField 
            select 
            label="Course Code" 
            name="course" 
            value={formData.course} 
            onChange={handleChange} 
            required 
            fullWidth
            disabled={!formData.school}
          >
            {formData.school && courses[formData.school].map((course) => (
              <MenuItem key={course} value={course}>{course}</MenuItem>
            ))}
          </TextField>
          <TextField 
            label="Password" 
            name="password" 
            type={formData.showPassword ? "text" : "password"} 
            value={formData.password} 
            onChange={handleChange} 
            required 
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required fullWidth />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;

import React from "react";
import { AppBar, Toolbar, Typography, Button, Container, Box, Paper } from "@mui/material";

const Home = () => {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5", display: "flex", flexDirection: "column" }}>
      {/* Navigation Bar */}
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">SRC E-Voting System</Typography>
          <Box>
            <Button color="inherit" sx={{ mr: 2 }}>Login</Button>
            <Button variant="contained" color="success">Sign Up</Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container sx={{ flexGrow: 1, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 3 }}>
        <Typography variant="h3" fontWeight="bold" color="textPrimary">Your Vote, Your Voice!</Typography>
        <Typography variant="h6" color="textSecondary" sx={{ mt: 2, maxWidth: "600px" }}>
          Participate in the SRC elections securely and fairly using our online e-voting system. View candidate manifestos, cast your vote, and see results in real-time.
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 4, px: 4, py: 1.5 }}>Get Started</Button>
      </Container>

      {/* Election Details Section */}
      <Paper elevation={3} sx={{ textAlign: "center", p: 3 }}>
        <Typography variant="h5" fontWeight="bold">Upcoming Elections</Typography>
        <Typography variant="body1" color="textSecondary">Voting opens on: <strong>March 15, 2025</strong></Typography>
        <Typography variant="body1" color="textSecondary">Voting closes on: <strong>March 16, 2025</strong></Typography>
      </Paper>
    </Box>
  );
};

export default Home;

// ============================================
// Home Page / Landing Page
// ============================================
// Public landing page for the SRC E-Voting System
// Displays election overview and navigation to login/register
// Uses React Helmet for SEO metadata

import React from "react";
import { AppBar, Toolbar, Typography, Button, Container, Box, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

// ============================================
// Election Timeline
// ============================================
// Hardcoded election dates for demo purposes
// In production, these would come from backend API

const electionDates = {
  start: "2025-03-15",
  end: "2025-03-16",
};

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5", display: "flex", flexDirection: "column" }}>
      {/* ============================================ */}
      {/* SEO Metadata */}
      {/* ============================================ */}
      {/* React Helmet manages the document head for better SEO */}
      {/* Title and meta description appear in search results */}
      <Helmet>
        <title>SRC E-Voting System - Home</title>
        <meta name="description" content="Participate in the SRC elections securely and fairly using our online e-voting system. View candidate manifestos, cast your vote, and see results in real-time." />
      </Helmet>

      {/* ============================================ */}
      {/* Navigation Bar */}
      {/* ============================================ */}
      {/* Fixed header with login and signup buttons */}
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">SRC E-Voting System</Typography>
          <Box>
            <Button
              color="inherit"
              sx={{ mr: 2 }}
              onClick={() => navigate("/login")}
              aria-label="Login"
            >
              Login
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => navigate("/register")}
              aria-label="Sign Up"
            >
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ============================================ */}
      {/* Hero Section */}
      {/* ============================================ */}
      {/* Main call-to-action section with app description */}
      <Container sx={{ flexGrow: 1, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 3 }}>
        <Typography variant="h3" fontWeight="bold" color="textPrimary">
          Your Vote, Your Voice!
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ mt: 2, maxWidth: "600px" }}>
          Participate in the SRC elections securely and fairly using our online e-voting system. View candidate manifestos, cast your vote, and see results in real-time.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 4, px: 4, py: 1.5, transition: "transform 0.2s", "&:hover": { transform: "scale(1.05)" } }}
          onClick={() => navigate("/register")}
          aria-label="Get Started"
        >
          Get Started
        </Button>
      </Container>

      {/* ============================================ */}
      {/* Election Information Card */}
      {/* ============================================ */}
      {/* Displays upcoming election dates for voters */}
      {/* In production, this would display actual election data from backend */}
      <Paper elevation={3} sx={{ textAlign: "center", p: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Upcoming Elections
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Voting opens on: <strong>{new Date(electionDates.start).toLocaleDateString()}</strong>
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Voting closes on: <strong>{new Date(electionDates.end).toLocaleDateString()}</strong>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Home;

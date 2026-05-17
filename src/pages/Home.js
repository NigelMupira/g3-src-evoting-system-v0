// ============================================
// Home Page / Landing Page
// ============================================
// Professional landing page for the SRC E-Voting System
// Features hero section, value propositions, and CTA
// Uses React Helmet for SEO metadata

import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Card,
  Grid,
  LinearProgress,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import SecurityIcon from "@mui/icons-material/Security";
import VerifiedIcon from "@mui/icons-material/Verified";
import SpeedIcon from "@mui/icons-material/Speed";
import AccessibilityIcon from "@mui/icons-material/Accessibility";

const electionDates = {
  start: "2025-03-15",
  end: "2025-03-16",
};

const Home = () => {
  const navigate = useNavigate();

  const valuePropositions = [
    {
      icon: <SecurityIcon sx={{ fontSize: 48, color: "#003087" }} />,
      title: "Secure Voting",
      description: "Your vote is encrypted and protected with industry-standard security protocols.",
    },
    {
      icon: <VerifiedIcon sx={{ fontSize: 48, color: "#D4A017" }} />,
      title: "Transparent Process",
      description: "Real-time results and audit logs ensure complete transparency in every election.",
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 48, color: "#003087" }} />,
      title: "Instant Results",
      description: "View election results immediately after voting concludes with detailed analytics.",
    },
    {
      icon: <AccessibilityIcon sx={{ fontSize: 48, color: "#D4A017" }} />,
      title: "Accessible Voting",
      description: "Vote anytime, anywhere. Our system is designed for ease of use and accessibility.",
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Helmet>
        <title>SRC E-Voting System - Secure Student Elections</title>
        <meta name="description" content="Participate in SRC elections securely. View candidate manifestos, cast your vote, and see results in real-time." />
      </Helmet>

      {/* ============================================ */}
      {/* Navigation Bar */}
      {/* ============================================ */}
      <AppBar position="static" sx={{ boxShadow: "0 4px 12px rgba(0, 48, 135, 0.15)" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", py: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "0.5px" }}>
            SRC E-Voting
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              color="inherit"
              onClick={() => navigate("/login")}
              sx={{
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 500,
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/register")}
              sx={{
                backgroundColor: "#D4A017",
                color: "#1A1A1A",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#B8860B" },
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ============================================ */}
      {/* Hero Section */}
      {/* ============================================ */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #003087 0%, #0052CC 100%)",
          color: "white",
          py: 8,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              letterSpacing: "-0.02em",
            }}
          >
            Your Vote, Your Voice
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              opacity: 0.95,
              fontSize: { xs: "1rem", md: "1.125rem" },
              lineHeight: 1.7,
            }}
          >
            Participate in SRC elections with confidence. Secure, transparent, and designed for every student.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/register")}
            sx={{
              backgroundColor: "#D4A017",
              color: "#1A1A1A",
              px: 4,
              py: 1.5,
              fontSize: "1.125rem",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "0.5rem",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(212, 160, 23, 0.3)",
              "&:hover": {
                backgroundColor: "#B8860B",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 20px rgba(212, 160, 23, 0.4)",
              },
            }}
          >
            Get Started Now
          </Button>
        </Container>
      </Box>

      {/* ============================================ */}
      {/* Value Propositions Section */}
      {/* ============================================ */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h4"
          sx={{ textAlign: "center", fontWeight: 700, mb: 6, color: "#1A1A1A" }}
        >
          Why Choose Our Voting System?
        </Typography>
        <Grid container spacing={3}>
          {valuePropositions.map((prop, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  p: 3,
                  textAlign: "center",
                  height: "100%",
                  transition: "all 0.3s ease",
                  border: "1px solid #E0E0E0",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 16px 32px rgba(0, 48, 135, 0.12)",
                  },
                }}
              >
                <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                  {prop.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#1A1A1A" }}>
                  {prop.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666666", lineHeight: 1.6 }}>
                  {prop.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ============================================ */}
      {/* Election Information Section */}
      {/* ============================================ */}
      <Box sx={{ backgroundColor: "#F8F9FA", py: 8 }}>
        <Container maxWidth="md">
          <Card
            sx={{
              p: 4,
              background: "linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)",
              border: "1px solid #E0E0E0",
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, mb: 3, color: "#1A1A1A", textAlign: "center" }}
            >
              Upcoming Election Timeline
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#003087", mb: 1 }}>
                Voting Opens
              </Typography>
              <Typography variant="body1" sx={{ color: "#1A1A1A", mb: 2 }}>
                {new Date(electionDates.start).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={45}
                sx={{
                  height: 8,
                  borderRadius: "4px",
                  backgroundColor: "#E0E0E0",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#22C55E",
                    borderRadius: "4px",
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#003087", mb: 1 }}>
                Voting Closes
              </Typography>
              <Typography variant="body1" sx={{ color: "#1A1A1A", mb: 2 }}>
                {new Date(electionDates.end).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={75}
                sx={{
                  height: 8,
                  borderRadius: "4px",
                  backgroundColor: "#E0E0E0",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#3B82F6",
                    borderRadius: "4px",
                  },
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 1, justifyContent: "center", flexWrap: "wrap" }}>
              <Chip label="✓ Secure" color="success" variant="outlined" />
              <Chip label="✓ Anonymous" color="info" variant="outlined" />
              <Chip label="✓ Verifiable" color="warning" variant="outlined" />
            </Box>
          </Card>
        </Container>
      </Box>

      {/* ============================================ */}
      {/* Footer Section */}
      {/* ============================================ */}
      <Box
        sx={{
          backgroundColor: "#1A1A1A",
          color: "white",
          py: 4,
          textAlign: "center",
          mt: "auto",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="body2" sx={{ mb: 1 }}>
            Need help? Contact: support@src-voting.edu
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            © 2025 Student Representative Council. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;

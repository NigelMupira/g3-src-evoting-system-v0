// ============================================
// Home Page / Landing Page
// ============================================
// Professional landing page for the SRC E-Voting System
// Features hero section, value propositions, and CTA
// Uses React Helmet for SEO metadata

import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Box,
  Card,
  Grid,
  LinearProgress,
  Chip,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "../components/common/Header";
import ThemeToggle from "../components/common/ThemeToggle";
import SecurityIcon from "@mui/icons-material/Security";
import VerifiedIcon from "@mui/icons-material/Verified";
import SpeedIcon from "@mui/icons-material/Speed";
import AccessibilityIcon from "@mui/icons-material/Accessibility";
import { getActiveElections } from "../services/electionService";

const Home = () => {
  const navigate = useNavigate();
  const [activeElection, setActiveElection] = useState({
    name: "SRC General Elections 2026",
    startDate: "2026-10-01T08:00:00",
    endDate: "2026-10-31T20:00:00",
    status: "active",
  });

  useEffect(() => {
    const fetchActive = async () => {
      try {
        const res = await getActiveElections();
        if (res.success && res.data && res.data.length > 0) {
          const election = res.data[0];
          setActiveElection({
            name: election.name || election.election_name || "SRC General Elections 2026",
            startDate: election.start_date || election.startDate || "2026-10-01T08:00:00",
            endDate: election.end_date || election.endDate || "2026-10-31T20:00:00",
            status: election.status || "active",
          });
        }
      } catch (err) {
        console.warn("Using fallback demo election data on Home page");
      }
    };
    fetchActive();
  }, []);

  const valuePropositions = [
    {
      icon: <SecurityIcon sx={{ fontSize: 48, color: "primary.main" }} />,
      title: "Secure Voting",
      description: "Your vote is encrypted and protected with industry-standard security protocols.",
    },
    {
      icon: <VerifiedIcon sx={{ fontSize: 48, color: "secondary.main" }} />,
      title: "Transparent Process",
      description: "Real-time results and audit logs ensure complete transparency in every election.",
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 48, color: "primary.main" }} />,
      title: "Instant Results",
      description: "View election results immediately after voting concludes with detailed analytics.",
    },
    {
      icon: <AccessibilityIcon sx={{ fontSize: 48, color: "secondary.main" }} />,
      title: "Accessible Voting",
      description: "Vote anytime, anywhere. Our system is designed for ease of use and accessibility.",
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default", color: "text.primary" }}>
      <Helmet>
        <title>SRC E-Voting System - Secure Student Elections</title>
        <meta name="description" content="Participate in SRC elections securely. View candidate manifestos, cast your vote, and see results in real-time." />
      </Helmet>

      {/* Navigation Bar */}
      <Header
        title="SRC E-Voting"
        showHomeButton={false}
        rightContent={
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
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
              color="secondary"
              onClick={() => navigate("/register")}
              sx={{
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              Sign Up
            </Button>
            <ThemeToggle />
          </Box>
        }
      />

      {/* Hero Section */}
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
            Participate in {activeElection.name} with confidence. Secure, transparent, and designed for every student.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate("/register")}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1.125rem",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "0.5rem",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(212, 160, 23, 0.3)",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 8px 20px rgba(212, 160, 23, 0.4)",
              },
            }}
          >
            Get Started Now
          </Button>
        </Container>
      </Box>

      {/* Value Propositions Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h4"
          sx={{ textAlign: "center", fontWeight: 700, mb: 6, color: "text.primary" }}
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
                  bgcolor: "background.paper",
                  borderColor: "divider",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 16px 32px rgba(0, 48, 135, 0.12)",
                  },
                }}
              >
                <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                  {prop.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}>
                  {prop.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                  {prop.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Election Information Section */}
      <Box sx={{ bgcolor: "action.hover", py: 8 }}>
        <Container maxWidth="md">
          <Card
            sx={{
              p: 4,
              bgcolor: "background.paper",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, mb: 3, color: "text.primary", textAlign: "center" }}
            >
              {activeElection.name} Timeline
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "primary.main", mb: 1 }}>
                Voting Opens
              </Typography>
              <Typography variant="body1" sx={{ color: "text.primary", mb: 2 }}>
                {new Date(activeElection.startDate).toLocaleDateString("en-US", {
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
                  bgcolor: "action.disabledBackground",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#22C55E",
                    borderRadius: "4px",
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "primary.main", mb: 1 }}>
                Voting Closes
              </Typography>
              <Typography variant="body1" sx={{ color: "text.primary", mb: 2 }}>
                {new Date(activeElection.endDate).toLocaleDateString("en-US", {
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
                  bgcolor: "action.disabledBackground",
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

      {/* Footer Section */}
      <Box
        sx={{
          bgcolor: "background.paper",
          borderTop: 1,
          borderColor: "divider",
          color: "text.secondary",
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
            © 2026 Student Representative Council. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;

import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useNavigate } from "react-router-dom";

// Mock election dates (replace with dynamic data from backend or config)
const electionDates = {
  start: "2025-03-15T00:00:00", // ISO format for easier parsing
};

const DashboardHome = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const targetDate = new Date(electionDates.start).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      
      if (difference <= 0) {
        clearInterval(interval);
        setCountdown("Elections are now open!");
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      {/* Welcome Text */}
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Welcome to the Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={5}>
        Manage your voting activities efficiently.
      </Typography>

      {/* Quick Access Grid */}
      <Grid container spacing={4} justifyContent="center">
        <Grid item>
          <Card 
            sx={{ 
              width: 200, 
              textAlign: "center", 
              p: 2, 
              boxShadow: 3, 
              borderRadius: "12px", 
              cursor: "pointer", 
              transition: "transform 0.2s", 
              "&:hover": { transform: "scale(1.05)" } 
            }}
            onClick={() => navigate("/vote")}
            aria-label="Vote Now"
          >
            <HowToVoteIcon sx={{ fontSize: 50, color: "primary.main" }} />
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                Vote Now
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Card 
            sx={{ 
              width: 200, 
              textAlign: "center", 
              p: 2, 
              boxShadow: 3, 
              borderRadius: "12px", 
              cursor: "pointer", 
              transition: "transform 0.2s", 
              "&:hover": { transform: "scale(1.05)" } 
            }}
            onClick={() => navigate("/profile")}
            aria-label="Profile"
          >
            <AccountCircleIcon sx={{ fontSize: 50, color: "primary.main" }} />
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                Profile
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Card 
            sx={{ 
              width: 200, 
              textAlign: "center", 
              p: 2, 
              boxShadow: 3, 
              borderRadius: "12px", 
              cursor: "pointer", 
              transition: "transform 0.2s", 
              "&:hover": { transform: "scale(1.05)" } 
            }}
            onClick={() => navigate("/results")}
            aria-label="Results"
          >
            <BarChartIcon sx={{ fontSize: 50, color: "primary.main" }} />
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                Results
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Countdown Timer */}
      <Box sx={{ mt: 5, p: 2, borderRadius: "12px", backgroundColor: "#f5f5f5", display: "inline-block" }}>
        <Typography variant="h6" fontWeight="bold">Elections Open In:</Typography>
        <Typography variant="h5" color="primary" fontWeight="bold">{countdown}</Typography>
      </Box>
    </Box>
  );
};

export default DashboardHome;

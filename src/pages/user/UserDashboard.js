// ============================================
// User Dashboard Component
// ============================================
// Main dashboard for voters after login
// Provides navigation between voting and results
// Implements tab-based UI with sidebar navigation

import React, { useState } from "react";
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Grid, Card, CardContent } from "@mui/material";
import { Dashboard as DashboardIcon, HowToVote, BarChart, ExitToApp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import VotingPage from "./VotingPage";
import ResultsPage from "./ResultsPage";

const drawerWidth = 240;

const UserDashboard = () => {
  // ============================================
  // State Management
  // ============================================
  // activeTab: Tracks which section user is viewing (Dashboard, Vote, Results)

  const [activeTab, setActiveTab] = useState("Dashboard");
  const navigate = useNavigate();
  const { logout } = useAuth();

  // ============================================
  // Logout Handler
  // ============================================
  // Clears auth state and redirects to login

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ============================================
  // Tab Change Handler
  // ============================================
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // ============================================
  // Render Content Based on Active Tab
  // ============================================
  // Dashboard: Shows quick access cards
  // Vote: Shows voting interface
  // Results: Shows election results

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h4" fontWeight="bold" mb={4}>
              Welcome to the Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" mb={5}>
              Manage your voting activities efficiently.
            </Typography>

            {/* Quick Access Cards */}
            <Grid container spacing={4} justifyContent="center">
              {/* Vote Now Card */}
              <Grid item>
                <Card
                  sx={{
                    width: 220,
                    height: 280,
                    textAlign: "center",
                    p: 2,
                    borderRadius: "16px",
                    boxShadow: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.05)" }
                  }}
                  onClick={() => setActiveTab("Vote")}
                  aria-label="Vote Now"
                >
                  <HowToVote sx={{ fontSize: 50, color: "primary.main" }} />
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      Vote Now
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Results Card */}
              <Grid item>
                <Card
                  sx={{
                    width: 220,
                    height: 280,
                    textAlign: "center",
                    p: 2,
                    borderRadius: "16px",
                    boxShadow: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.05)" }
                  }}
                  onClick={() => setActiveTab("Results")}
                  aria-label="Results"
                >
                  <BarChart sx={{ fontSize: 50, color: "primary.main" }} />
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      Results
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
      case "Vote":
        return <VotingPage />;
      case "Results":
        return <ResultsPage onNavigateToVote={() => handleTabChange("Vote")} />;
      default:
        return (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h4" fontWeight="bold" mb={4}>
              Welcome to the Dashboard
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Use the sidebar or cards to navigate.
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", overflow: "hidden", backgroundColor: "rgba(100, 200, 225, 0.3)" }}>
      {/* ============================================ */}
      {/* Top Navigation Bar */}
      {/* ============================================ */}
      <AppBar position="fixed" sx={{ width: "100%", backgroundColor: "#007bff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            SRC E-Voting System
          </Typography>
        </Toolbar>
      </AppBar>

      {/* ============================================ */}
      {/* Sidebar Navigation */}
      {/* ============================================ */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box", backgroundColor: "white", mt: 8, display: "flex", flexDirection: "column", height: "calc(100vh - 64px)", justifyContent: "space-between" },
        }}
      >
        {/* Navigation Items */}
        <Box>
          <Toolbar />
          <List>
            {/* Dashboard Link */}
            <ListItem
              button
              onClick={() => setActiveTab("Dashboard")}
              sx={{ backgroundColor: activeTab === "Dashboard" ? "#007bff" : "transparent", color: activeTab === "Dashboard" ? "white" : "black" }}
              aria-label="Dashboard"
            >
              <ListItemIcon sx={{ color: activeTab === "Dashboard" ? "white" : "black" }}><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>

            {/* Voting Link */}
            <ListItem
              button
              onClick={() => setActiveTab("Vote")}
              sx={{ backgroundColor: activeTab === "Vote" ? "#007bff" : "transparent", color: activeTab === "Vote" ? "white" : "black" }}
              aria-label="Vote"
            >
              <ListItemIcon sx={{ color: activeTab === "Vote" ? "white" : "black" }}><HowToVote /></ListItemIcon>
              <ListItemText primary="Vote" />
            </ListItem>

            {/* Results Link */}
            <ListItem
              button
              onClick={() => setActiveTab("Results")}
              sx={{ backgroundColor: activeTab === "Results" ? "#007bff" : "transparent", color: activeTab === "Results" ? "white" : "black" }}
              aria-label="Results"
            >
              <ListItemIcon sx={{ color: activeTab === "Results" ? "white" : "black" }}><BarChart /></ListItemIcon>
              <ListItemText primary="Results" />
            </ListItem>
          </List>
        </Box>

        {/* Logout Button */}
        <Box>
          <List>
            <ListItem
              button
              onClick={handleLogout}
              sx={{ color: "#d32f2f" }}
              aria-label="Logout"
            >
              <ListItemIcon sx={{ color: "#d32f2f" }}><ExitToApp /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* ============================================ */}
      {/* Main Content Area */}
      {/* ============================================ */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", pt: 8, overflowY: "auto" }}>
        <Box sx={{ flexGrow: 1, p: 3, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(100, 200, 225, 0.3)", height: "100%", overflow: "auto" }}>
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
};

export default UserDashboard;

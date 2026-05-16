// ============================================
// Admin Dashboard Component
// ============================================
// Main dashboard for administrators
// Provides navigation to election, candidate, and results management
// Similar layout to UserDashboard but with admin-specific options

import React, { useState } from "react";
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Grid, Card, CardContent } from "@mui/material";
import { Dashboard as DashboardIcon, HowToVote, People, BarChart, ExitToApp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ManageElections from "./ManageElections";
import ManageCandidates from "./ManageCandidates";
import ViewResults from "./ViewResults";

const drawerWidth = 240;

const AdminDashboard = () => {
  // ============================================
  // State Management
  // ============================================
  // activeTab: Tracks which admin section user is viewing

  const [activeTab, setActiveTab] = useState("Dashboard");
  const navigate = useNavigate();
  const { logout } = useAuth();

  // ============================================
  // Logout Handler
  // ============================================
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ============================================
  // Render Content Based on Active Tab
  // ============================================
  // Dashboard: Shows quick access cards for admin tasks
  // ManageElections: Create/edit/delete elections
  // ManageCandidates: Add/edit/delete candidates
  // ViewResults: Analytics and results viewing

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h4" fontWeight="bold" mb={4}>
              Admin Dashboard
            </Typography>

            {/* Quick Access Cards for Admin Tasks */}
            <Grid container spacing={4} justifyContent="center">
              {/* Manage Elections Card */}
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
                  onClick={() => setActiveTab("ManageElections")}
                  aria-label="Manage Elections"
                >
                  <HowToVote sx={{ fontSize: 50, color: "primary.main" }} />
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      Manage Elections
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Manage Candidates Card */}
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
                  onClick={() => setActiveTab("ManageCandidates")}
                  aria-label="Manage Candidates"
                >
                  <People sx={{ fontSize: 50, color: "primary.main" }} />
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      Manage Candidates
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* View Results Card */}
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
                  onClick={() => setActiveTab("ViewResults")}
                  aria-label="View Results"
                >
                  <BarChart sx={{ fontSize: 50, color: "primary.main" }} />
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      View Results
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
      case "ManageElections":
        return <ManageElections />;
      case "ManageCandidates":
        return <ManageCandidates />;
      case "ViewResults":
        return <ViewResults />;
      default:
        return (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h4" fontWeight="bold" mb={4}>
              Admin Dashboard
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Welcome to the Admin Dashboard. Use the sidebar or cards to navigate.
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
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* ============================================ */}
      {/* Admin Navigation Sidebar */}
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
            <ListItem
              button
              onClick={() => setActiveTab("Dashboard")}
              sx={{ backgroundColor: activeTab === "Dashboard" ? "#007bff" : "transparent", color: activeTab === "Dashboard" ? "white" : "black" }}
              aria-label="Dashboard"
            >
              <ListItemIcon sx={{ color: activeTab === "Dashboard" ? "white" : "black" }}><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem
              button
              onClick={() => setActiveTab("ManageElections")}
              sx={{ backgroundColor: activeTab === "ManageElections" ? "#007bff" : "transparent", color: activeTab === "ManageElections" ? "white" : "black" }}
              aria-label="Manage Elections"
            >
              <ListItemIcon sx={{ color: activeTab === "ManageElections" ? "white" : "black" }}><HowToVote /></ListItemIcon>
              <ListItemText primary="Manage Elections" />
            </ListItem>
            <ListItem
              button
              onClick={() => setActiveTab("ManageCandidates")}
              sx={{ backgroundColor: activeTab === "ManageCandidates" ? "#007bff" : "transparent", color: activeTab === "ManageCandidates" ? "white" : "black" }}
              aria-label="Manage Candidates"
            >
              <ListItemIcon sx={{ color: activeTab === "ManageCandidates" ? "white" : "black" }}><People /></ListItemIcon>
              <ListItemText primary="Manage Candidates" />
            </ListItem>
            <ListItem
              button
              onClick={() => setActiveTab("ViewResults")}
              sx={{ backgroundColor: activeTab === "ViewResults" ? "#007bff" : "transparent", color: activeTab === "ViewResults" ? "white" : "black" }}
              aria-label="View Results"
            >
              <ListItemIcon sx={{ color: activeTab === "ViewResults" ? "white" : "black" }}><BarChart /></ListItemIcon>
              <ListItemText primary="View Results" />
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

export default AdminDashboard;

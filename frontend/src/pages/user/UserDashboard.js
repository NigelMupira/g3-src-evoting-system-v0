// ============================================
// User Dashboard Component
// ============================================
// Main dashboard for voters showing voting and results navigation
// Professional layout with sidebar and main content area

import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Grid,
  Card,
  Button,
  Divider,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  HowToVote,
  BarChart,
  LogoutRounded,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/common/Header";
import ThemeToggle from "../../components/common/ThemeToggle";
import VotingPage from "./VotingPage";
import ResultsPage from "./ResultsPage";
import UserDashboardHome from "./UserDashboardHome";

const drawerWidth = 260;

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Handle tab changes with browser history
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Update URL without full page reload for better back button behavior
    window.history.replaceState({ tab: tabId }, '', `?tab=${tabId}`);
  };

  // Handle browser back button
  React.useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.tab) {
        setActiveTab(event.state.tab);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <UserDashboardHome onNavigate={setActiveTab} />;
      case "Vote":
        return <VotingPage />;
      case "Results":
        return <ResultsPage onNavigateToVote={() => setActiveTab("Vote")} />;
      default:
        return null;
    }
  };

  const navItems = [
    { label: "Dashboard", icon: <DashboardIcon />, id: "Dashboard" },
    { label: "Vote", icon: <HowToVote />, id: "Vote" },
    { label: "Results", icon: <BarChart />, id: "Results" },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#F8F9FA" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "white",
            borderRight: "1px solid #E0E0E0",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Logo Section */}
        <Box
          sx={{
            p: 2.5,
            background: "linear-gradient(135deg, #003087 0%, #0052CC 100%)",
            color: "white",
            cursor: "pointer",
          }}
          onClick={() => setActiveTab("Dashboard")}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "0.5px" }}>
            SRC Voting
          </Typography>
        </Box>

        {/* Navigation */}
        <List sx={{ flex: 1, pt: 2 }}>
          {navItems.map((item) => (
            <ListItemButton
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: "0.5rem",
                backgroundColor:
                  activeTab === item.id
                    ? "rgba(0, 48, 135, 0.1)"
                    : "transparent",
                color: activeTab === item.id ? "#003087" : "#666666",
                "&:hover": {
                  backgroundColor: "rgba(0, 48, 135, 0.05)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: activeTab === item.id ? "#003087" : "#666666",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  "& .MuiListItemText-primary": {
                    fontWeight: activeTab === item.id ? 600 : 500,
                  },
                }}
              />
            </ListItemButton>
          ))}
        </List>

        {/* Logout Section */}
        <Box sx={{ p: 2, borderTop: "1px solid #E0E0E0" }}>
          <Button
            fullWidth
            startIcon={<LogoutRounded />}
            onClick={handleLogout}
            sx={{
              color: "#EF4444",
              textTransform: "none",
              justifyContent: "flex-start",
              "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.05)" },
            }}
          >
            Logout
          </Button>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
            <ThemeToggle />
          </Box>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header 
          title="SRC E-Voting" 
          showHomeButton={false}
          navigateTo={() => setActiveTab("Dashboard")}
        />

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 3,
            display: "flex",
            justifyContent: "center",
            marginTop: "64px", // Offset for fixed header
          }}
        >
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
};

export default UserDashboard;

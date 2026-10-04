// ============================================
// Admin Dashboard Component
// ============================================
// Professional admin dashboard for election management
// Navigation to elections, candidates, and results management
// Admin-specific interface with enhanced features

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
  People,
  BarChart,
  LogoutRounded,
  Settings,
  Security,
} from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/common/Header";
import ThemeToggle from "../../components/common/ThemeToggle";
import ManageElections from "./ManageElections";
import ManageCandidates from "./ManageCandidates";
import ViewResults from "./ViewResults";
import AuditLogs from "./AuditLogs";
import AdminDashboardHome from "./AdminDashboardHome";

const drawerWidth = 260;

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "Dashboard";
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Handle tab changes with standard browser history
  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <AdminDashboardHome onNavigate={handleTabChange} />;
      case "ManageElections":
        return <ManageElections />;
      case "ManageCandidates":
        return <ManageCandidates />;
      case "ViewResults":
        return <ViewResults />;
      case "AuditLogs":
        return <AuditLogs />;
      default:
        return null;
    }
  };

  const navItems = [
    { label: "Dashboard", icon: <DashboardIcon />, id: "Dashboard" },
    { label: "Elections", icon: <HowToVote />, id: "ManageElections" },
    { label: "Candidates", icon: <People />, id: "ManageCandidates" },
    { label: "Results", icon: <BarChart />, id: "ViewResults" },
    { label: "Audit Logs", icon: <Security />, id: "AuditLogs" },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "background.paper",
            borderColor: "divider",
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
          onClick={() => handleTabChange("Dashboard")}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "0.5px" }}>
            Admin Panel
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
                    ? "action.selected"
                    : "transparent",
                color: activeTab === item.id ? "primary.main" : "text.secondary",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: activeTab === item.id ? "primary.main" : "text.secondary",
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
        <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
          <Button
            fullWidth
            startIcon={<LogoutRounded />}
            onClick={handleLogout}
            sx={{
              color: "error.main",
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
          navigateTo={() => handleTabChange("Dashboard")}
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

export default AdminDashboard;

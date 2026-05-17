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
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ManageElections from "./ManageElections";
import ManageCandidates from "./ManageCandidates";
import ViewResults from "./ViewResults";

const drawerWidth = 260;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <Box sx={{ width: "100%", maxWidth: 1200 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: "#1A1A1A",
              }}
            >
              Admin Dashboard
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#666666",
                mb: 4,
              }}
            >
              Manage elections, candidates, and view comprehensive results
            </Typography>

            <Grid container spacing={3}>
              {/* Manage Elections */}
              <Grid item xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    p: 3,
                    borderRadius: "0.75rem",
                    border: "1px solid #E0E0E0",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 16px 32px rgba(0, 48, 135, 0.12)",
                    },
                  }}
                  onClick={() => setActiveTab("ManageElections")}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 60,
                      height: 60,
                      borderRadius: "0.5rem",
                      backgroundColor: "rgba(0, 48, 135, 0.1)",
                      mb: 2,
                    }}
                  >
                    <HowToVote sx={{ fontSize: 32, color: "#003087" }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    Manage Elections
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666666", mb: 2 }}>
                    Create, edit, and manage election events
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      background: "#003087",
                      textTransform: "none",
                      "&:hover": { background: "#0052CC" },
                    }}
                  >
                    Manage
                  </Button>
                </Card>
              </Grid>

              {/* Manage Candidates */}
              <Grid item xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    p: 3,
                    borderRadius: "0.75rem",
                    border: "1px solid #E0E0E0",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 16px 32px rgba(0, 48, 135, 0.12)",
                    },
                  }}
                  onClick={() => setActiveTab("ManageCandidates")}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 60,
                      height: 60,
                      borderRadius: "0.5rem",
                      backgroundColor: "rgba(212, 160, 23, 0.1)",
                      mb: 2,
                    }}
                  >
                    <People sx={{ fontSize: 32, color: "#D4A017" }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    Manage Candidates
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666666", mb: 2 }}>
                    Add, edit, and remove candidates
                  </Typography>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      borderColor: "#D4A017",
                      color: "#D4A017",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "rgba(212, 160, 23, 0.05)",
                      },
                    }}
                  >
                    Manage
                  </Button>
                </Card>
              </Grid>

              {/* View Results */}
              <Grid item xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    p: 3,
                    borderRadius: "0.75rem",
                    border: "1px solid #E0E0E0",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 16px 32px rgba(0, 48, 135, 0.12)",
                    },
                  }}
                  onClick={() => setActiveTab("ViewResults")}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 60,
                      height: 60,
                      borderRadius: "0.5rem",
                      backgroundColor: "rgba(34, 197, 94, 0.1)",
                      mb: 2,
                    }}
                  >
                    <BarChart sx={{ fontSize: 32, color: "#22C55E" }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    View Results
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666666", mb: 2 }}>
                    Analyze election results and statistics
                  </Typography>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      borderColor: "#22C55E",
                      color: "#22C55E",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "rgba(34, 197, 94, 0.05)",
                      },
                    }}
                  >
                    View
                  </Button>
                </Card>
              </Grid>
            </Grid>

            {/* System Info */}
            <Card
              sx={{
                mt: 4,
                p: 3,
                borderRadius: "0.75rem",
                backgroundColor: "#F8F9FA",
                border: "1px solid #E0E0E0",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Settings sx={{ color: "#003087" }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#1A1A1A" }}>
                  System Status
                </Typography>
              </Box>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="body2" sx={{ color: "#666666" }}>
                Admin User: <strong>{user?.firstName}</strong>
              </Typography>
              <Typography variant="body2" sx={{ color: "#666666", mt: 0.5 }}>
                Role: <strong>Administrator</strong>
              </Typography>
              <Typography variant="body2" sx={{ color: "#22C55E", mt: 0.5 }}>
                ✓ System Online
              </Typography>
            </Card>
          </Box>
        );
      case "ManageElections":
        return <ManageElections />;
      case "ManageCandidates":
        return <ManageCandidates />;
      case "ViewResults":
        return <ViewResults />;
      default:
        return null;
    }
  };

  const navItems = [
    { label: "Dashboard", icon: <DashboardIcon />, id: "Dashboard" },
    { label: "Elections", icon: <HowToVote />, id: "ManageElections" },
    { label: "Candidates", icon: <People />, id: "ManageCandidates" },
    { label: "Results", icon: <BarChart />, id: "ViewResults" },
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
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "0.5px" }}>
            Admin Panel
          </Typography>
        </Box>

        {/* Navigation */}
        <List sx={{ flex: 1, pt: 2 }}>
          {navItems.map((item) => (
            <ListItem
              button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
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
            </ListItem>
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
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <AppBar
          position="static"
          sx={{
            backgroundColor: "white",
            color: "#1A1A1A",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            borderBottom: "1px solid #E0E0E0",
          }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Administration
            </Typography>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 3,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;

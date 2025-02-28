import React, { useState } from "react";
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Dashboard as DashboardIcon, HowToVote, BarChart, ExitToApp } from "@mui/icons-material";
import DashboardHome from "./DashboardHome";
import VotingPage from "./VotingPage";
import ResultsPage from "./ResultsPage";

const drawerWidth = 240;

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardHome />;
      case "Vote":
        return <VotingPage />;
      case "Results":
        return <ResultsPage />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", overflow: "hidden" }}>
      {/* Top Bar */}
      <AppBar position="fixed" sx={{ width: "100%", backgroundColor: "#007bff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            SRC E-Voting System
          </Typography>
        </Toolbar>
      </AppBar>
      
      {/* Sidebar Navigation */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box", backgroundColor: "white", mt: 8, display: "flex", flexDirection: "column", height: "calc(100vh - 64px)", justifyContent: "space-between" },
        }}
      >
        <Box>
          <Toolbar />
          <List>
            <ListItem button onClick={() => setActiveTab("Dashboard")} sx={{ backgroundColor: activeTab === "Dashboard" ? "#007bff" : "transparent", color: activeTab === "Dashboard" ? "white" : "black" }}>
              <ListItemIcon sx={{ color: activeTab === "Dashboard" ? "white" : "black" }}><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={() => setActiveTab("Vote")} sx={{ backgroundColor: activeTab === "Vote" ? "#007bff" : "transparent", color: activeTab === "Vote" ? "white" : "black" }}>
              <ListItemIcon sx={{ color: activeTab === "Vote" ? "white" : "black" }}><HowToVote /></ListItemIcon>
              <ListItemText primary="Vote" />
            </ListItem>
            <ListItem button onClick={() => setActiveTab("Results")} sx={{ backgroundColor: activeTab === "Results" ? "#007bff" : "transparent", color: activeTab === "Results" ? "white" : "black" }}>
              <ListItemIcon sx={{ color: activeTab === "Results" ? "white" : "black" }}><BarChart /></ListItemIcon>
              <ListItemText primary="Results" />
            </ListItem>
          </List>
        </Box>
        <Box>
          <List>
            <ListItem button onClick={() => setActiveTab("Logout")} sx={{ color: "#d32f2f" }}>
              <ListItemIcon sx={{ color: "#d32f2f" }}><ExitToApp /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", pt: 8, overflowY: "auto" }}>
        <Box sx={{ flexGrow: 1, p: 3, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(100, 200, 225, 0.3)", height: "100%", overflow: "auto" }}>
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;

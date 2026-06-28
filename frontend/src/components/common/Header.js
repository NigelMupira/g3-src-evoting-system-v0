// ============================================
// Application Header / Navigation Bar
// ============================================
// Reusable header component displayed across the application
// Shows app icon, title, and navigation links
// Fixed rounded corners and white background issues

import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar } from "@mui/material";
import { Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

/**
 * Header component with navigation
 *
 * Props:
 *   - title: String - Title to display in header
 *   - showHomeButton: Boolean - Show home icon button (default: true)
 *   - navigateTo: Function - Custom navigation function for dashboard navigation
 */
const Header = ({ title = "SRC E-Voting", showHomeButton = true, navigateTo }) => {
  const navigate = useNavigate();

  const handleTitleClick = () => {
    if (navigateTo) {
      navigateTo(); // Use custom navigation for dashboards
    } else if (showHomeButton) {
      navigate("/"); // Navigate to home for public pages
    }
  };

  return (
    <AppBar 
      position="fixed" 
      color="primary" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        borderRadius: 0, // Remove rounded corners to prevent white background showing
        boxShadow: 2, // Add subtle shadow for depth
      }}
    >
      <Toolbar>
        {/* App icon */}
        <Avatar 
          src="/srcev1.ico" 
          alt="SRC E-Voting"
          sx={{ 
            width: 32, 
            height: 32, 
            mr: 2,
            cursor: (navigateTo || showHomeButton) ? "pointer" : "default",
          }}
          onClick={handleTitleClick}
        />

        {/* App title - clickable */}
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            cursor: (navigateTo || showHomeButton) ? "pointer" : "default",
            fontWeight: 600,
            textDecoration: "none",
            "&:hover": {
              textDecoration: (navigateTo || showHomeButton) ? "underline" : "none",
            },
          }}
          onClick={handleTitleClick}
        >
          {title}
        </Typography>

        {/* Right side actions - can be extended with user menu, notifications, etc. */}
        <Box>{/* User menu, notifications, etc. can go here */}</Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

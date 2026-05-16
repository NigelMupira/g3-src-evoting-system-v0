// ============================================
// Application Header / Navigation Bar
// ============================================
// Reusable header component displayed across the application
// Shows app title, navigation links, and user menu

import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import { Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

/**
 * Header component with navigation
 *
 * Props:
 *   - title: String - Title to display in header
 *   - showHomeButton: Boolean - Show home icon button (default: true)
 */
const Header = ({ title = "SRC E-Voting System", showHomeButton = true }) => {
  const navigate = useNavigate();

  return (
    <AppBar position="fixed" color="primary" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {/* Home button on left */}
        {showHomeButton && (
          <IconButton edge="start" color="inherit" onClick={() => navigate("/")} aria-label="Home" sx={{ mr: 2 }}>
            <Home />
          </IconButton>
        )}

        {/* App title */}
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            cursor: showHomeButton ? "pointer" : "default",
          }}
          onClick={() => showHomeButton && navigate("/")}
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

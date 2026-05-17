// ============================================
// Sidebar Navigation Component
// ============================================
// Reusable sidebar component for dashboard layouts
// Provides navigation menu and logout functionality

import React from "react";
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { ExitToApp } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const DRAWER_WIDTH = 240;

/**
 * Sidebar component for dashboard navigation
 *
 * Props:
 *   - items: Array of menu items {icon, label, action}
 *   - activeItem: String - Currently active menu item
 *   - onItemClick: Function - Handler when menu item is clicked
 *   - onLogout: Function - Handler for logout button
 */
const Sidebar = ({ items = [], activeItem = "", onItemClick = () => {}, onLogout = () => {} }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Default logout handler
  const handleLogout = () => {
    logout();
    if (onLogout) onLogout();
    navigate("/login");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          backgroundColor: "white",
          mt: 8, // Offset for fixed AppBar
          display: "flex",
          flexDirection: "column",
          height: `calc(100vh - 64px)`,
          justifyContent: "space-between",
        },
      }}
    >
      {/* Main navigation items */}
      <Box>
        <List>
          {items.map((item) => (
            <ListItem
              button
              key={item.label}
              onClick={() => onItemClick(item.action)}
              sx={{
                backgroundColor: activeItem === item.action ? "#007bff" : "transparent",
                color: activeItem === item.action ? "white" : "black",
                "&:hover": {
                  backgroundColor: activeItem === item.action ? "#0056b3" : "#f5f5f5",
                },
              }}
              aria-label={item.label}
            >
              <ListItemIcon sx={{ color: activeItem === item.action ? "white" : "black" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Logout button at bottom */}
      <Box>
        <List>
          <ListItem
            button
            onClick={handleLogout}
            sx={{ color: "#d32f2f", "&:hover": { backgroundColor: "#ffebee" } }}
            aria-label="Logout"
          >
            <ListItemIcon sx={{ color: "#d32f2f" }}>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;

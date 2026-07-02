// ============================================
// Theme Toggle Component
// ============================================
// Icon-only button to toggle between light and dark themes
// Available on all pages for user convenience

import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useTheme as useThemeContext } from "../../context/ThemeContext";

const ThemeToggle = () => {
  const { mode, toggleTheme } = useThemeContext();

  return (
    <Tooltip title={mode === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}>
      <IconButton
        onClick={toggleTheme}
        sx={{
          color: "inherit",
          "&:hover": {
            backgroundColor: "rgba(0, 48, 135, 0.1)",
          },
        }}
        aria-label="Toggle theme"
      >
        {mode === "light" ? <Brightness4 /> : <Brightness7 />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
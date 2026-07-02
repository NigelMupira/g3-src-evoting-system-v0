// ============================================
// Material-UI Custom Theme Configuration
// ============================================
// Custom theme using school colors and modern design principles
// Applied globally to all Material-UI components
// Supports both light and dark modes

import { createTheme } from "@mui/material/styles";

// ============================================
// Color Palette
// ============================================
const colors = {
  primary: "#003087", // School Blue
  secondary: "#D4A017", // School Gold
  background: "#F8F9FA", // Light gray
  surface: "#FFFFFF", // White
  text: {
    primary: "#1A1A1A", // Dark text
    secondary: "#666666", // Gray text
    light: "#FFFFFF", // Light text
  },
  border: "#E0E0E0", // Light border
  success: "#22C55E", // Green
  error: "#EF4444", // Red
  warning: "#F59E0B", // Orange
  info: "#3B82F6", // Blue
};

// ============================================
// Dark Mode Color Palette
// ============================================
const darkColors = {
  primary: "#0052CC", // Lighter School Blue for dark mode
  secondary: "#E5B64F", // Lighter School Gold for dark mode
  background: "#121212", // Dark background
  surface: "#1E1E1E", // Dark surface
  text: {
    primary: "#FFFFFF", // Light text
    secondary: "#B0B0B0", // Gray text
    light: "#FFFFFF", // Light text
  },
  border: "#333333", // Dark border
  success: "#4ADE80", // Lighter green
  error: "#F87171", // Lighter red
  warning: "#FBBF24", // Lighter orange
  info: "#60A5FA", // Lighter blue
};

// ============================================
// Create Light Theme
// ============================================
const getLightTheme = () => createTheme({
  // ============================================
  // Color Palette Configuration
  // ============================================
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary,
      light: "#0052CC",
      dark: "#002058",
      contrastText: colors.text.light,
    },
    secondary: {
      main: colors.secondary,
      light: "#E5B64F",
      dark: "#B8860B",
      contrastText: colors.text.primary,
    },
    background: {
      default: colors.background,
      paper: colors.surface,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
    success: {
      main: colors.success,
    },
    error: {
      main: colors.error,
    },
    warning: {
      main: colors.warning,
    },
    info: {
      main: colors.info,
    },
  },

  // ============================================
  // Typography Configuration
  // ============================================
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "2.25rem",
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontSize: "1.875rem",
      fontWeight: 700,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      letterSpacing: "0.0125em",
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.57,
      letterSpacing: "0.0125em",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      fontSize: "1rem",
    },
  },

  // ============================================
  // Component Customization
  // ============================================
  components: {
    // ============================================
    // Material-UI Button Styling
    // ============================================
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
          padding: "0.75rem 1.5rem",
          transition: "all 0.3s ease",
          fontSize: "1rem",
          fontWeight: 600,
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 16px rgba(0, 48, 135, 0.2)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        },
        contained: {
          boxShadow: "0 4px 12px rgba(0, 48, 135, 0.15)",
        },
        sizeSmall: {
          padding: "0.5rem 1rem",
          fontSize: "0.875rem",
        },
        sizeLarge: {
          padding: "1rem 2rem",
          fontSize: "1.125rem",
        },
      },
    },

    // ============================================
    // Material-UI Card Styling
    // ============================================
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "0.75rem",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          border: `1px solid ${colors.border}`,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
            transform: "translateY(-4px)",
          },
        },
      },
    },

    // ============================================
    // Material-UI TextField Styling
    // ============================================
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "0.5rem",
            transition: "all 0.3s ease",
            "&:hover fieldset": {
              borderColor: colors.primary,
            },
          },
        },
      },
    },

    // ============================================
    // Material-UI AppBar Styling
    // ============================================
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          backgroundColor: colors.primary,
        },
      },
    },

    // ============================================
    // Material-UI Paper Styling
    // ============================================
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "0.75rem",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
      },
    },

    // ============================================
    // Material-UI Chip Styling
    // ============================================
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
          fontWeight: 500,
        },
      },
    },

    // ============================================
    // Material-UI List Item Styling
    // ============================================
    MuiListItem: {
      styleOverrides: {
        root: {
          transition: "all 0.2s ease",
          borderRadius: "0.5rem",
          margin: "0.25rem 0",
          "&:hover": {
            backgroundColor: "rgba(0, 48, 135, 0.05)",
          },
        },
      },
    },

    // ============================================
    // Material-UI Dialog Styling
    // ============================================
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "0.75rem",
          boxShadow: "0 20px 25px rgba(0, 0, 0, 0.15)",
        },
      },
    },
  },

  // ============================================
  // Shape Configuration
  // ============================================
  shape: {
    borderRadius: 8,
  },

  // ============================================
  // Spacing Configuration
  // ============================================
  spacing: 8,
});

// ============================================
// Create Dark Theme
// ============================================
const getDarkTheme = () => createTheme({
  // ============================================
  // Color Palette Configuration
  // ============================================
  palette: {
    mode: 'dark',
    primary: {
      main: darkColors.primary,
      light: "#3375FF",
      dark: "#003399",
      contrastText: darkColors.text.light,
    },
    secondary: {
      main: darkColors.secondary,
      light: "#FFCF75",
      dark: "#B8860B",
      contrastText: darkColors.text.primary,
    },
    background: {
      default: darkColors.background,
      paper: darkColors.surface,
    },
    text: {
      primary: darkColors.text.primary,
      secondary: darkColors.text.secondary,
    },
    success: {
      main: darkColors.success,
    },
    error: {
      main: darkColors.error,
    },
    warning: {
      main: darkColors.warning,
    },
    info: {
      main: darkColors.info,
    },
  },

  // ============================================
  // Typography Configuration
  // ============================================
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "2.25rem",
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontSize: "1.875rem",
      fontWeight: 700,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      letterSpacing: "0.0125em",
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.57,
      letterSpacing: "0.0125em",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      fontSize: "1rem",
    },
  },

  // ============================================
  // Component Customization
  // ============================================
  components: {
    // ============================================
    // Material-UI Button Styling
    // ============================================
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
          padding: "0.75rem 1.5rem",
          transition: "all 0.3s ease",
          fontSize: "1rem",
          fontWeight: 600,
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 16px rgba(0, 82, 204, 0.3)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        },
        contained: {
          boxShadow: "0 4px 12px rgba(0, 82, 204, 0.25)",
        },
        sizeSmall: {
          padding: "0.5rem 1rem",
          fontSize: "0.875rem",
        },
        sizeLarge: {
          padding: "1rem 2rem",
          fontSize: "1.125rem",
        },
      },
    },

    // ============================================
    // Material-UI Card Styling
    // ============================================
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "0.75rem",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
          border: `1px solid ${darkColors.border}`,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
            transform: "translateY(-4px)",
          },
        },
      },
    },

    // ============================================
    // Material-UI TextField Styling
    // ============================================
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "0.5rem",
            transition: "all 0.3s ease",
            "&:hover fieldset": {
              borderColor: darkColors.primary,
            },
          },
        },
      },
    },

    // ============================================
    // Material-UI AppBar Styling
    // ============================================
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
          backgroundColor: darkColors.surface,
        },
      },
    },

    // ============================================
    // Material-UI Paper Styling
    // ============================================
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "0.75rem",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
          backgroundColor: darkColors.surface,
        },
      },
    },

    // ============================================
    // Material-UI Chip Styling
    // ============================================
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
          fontWeight: 500,
        },
      },
    },

    // ============================================
    // Material-UI List Item Styling
    // ============================================
    MuiListItem: {
      styleOverrides: {
        root: {
          transition: "all 0.2s ease",
          borderRadius: "0.5rem",
          margin: "0.25rem 0",
          "&:hover": {
            backgroundColor: "rgba(0, 82, 204, 0.1)",
          },
        },
      },
    },

    // ============================================
    // Material-UI Dialog Styling
    // ============================================
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "0.75rem",
          boxShadow: "0 20px 25px rgba(0, 0, 0, 0.5)",
          backgroundColor: darkColors.surface,
        },
      },
    },
  },

  // ============================================
  // Shape Configuration
  // ============================================
  shape: {
    borderRadius: 8,
  },

  // ============================================
  // Spacing Configuration
  // ============================================
  spacing: 8,
});

// Export both themes
export const lightTheme = getLightTheme();
export const darkTheme = getDarkTheme();

// Default export for backward compatibility
export default lightTheme;

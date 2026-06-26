// ============================================
// Vite Build Configuration
// ============================================
// Vite replaced Create React App (react-scripts) to fix the Vercel deployment
// error "Command 'npm run build' exited with 126" — a permissions/compat issue
// caused by react-scripts v5 not supporting React 19 out of the box.
//
// Vite is faster, leaner, and natively supports React 19.
// Start dev server: npm run start (runs on localhost:3000)
// Build for production: npm run build (outputs to dist/)

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // ============================================
  // React Plugin
  // ============================================
  // @vitejs/plugin-react enables JSX transform and Fast Refresh (HMR)
  plugins: [react()],

  // ============================================
  // esbuild Loader for .js JSX Files
  // ============================================
  // The project uses .js extensions for JSX files (React component files)
  // instead of the conventional .jsx. This tells esbuild to treat all
  // .js files inside src/ as JSX so components don't need to be renamed.
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.js$/, // Match all .js files inside src/
    exclude: [],
  },

  // ============================================
  // Dependency Pre-bundling Options
  // ============================================
  // Also instructs the dep optimizer to treat .js files as JSX
  // so that third-party imports that contain JSX resolve correctly.
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },

  // ============================================
  // Dev Server Configuration
  // ============================================
  // Keeps the dev server on port 3000 to match the CORS allowlist
  // on the PHP backend (localhost:3000 is whitelisted in index.php).
  server: {
    port: 3000,
    open: true, // Automatically open browser when dev server starts
  },

  // ============================================
  // Global Defines (process.env polyfill)
  // ============================================
  // Some third-party libraries reference process.env in their browser builds.
  // Providing an empty object prevents "process is not defined" runtime errors.
  define: {
    "process.env": {},
  },
});


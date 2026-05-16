// ============================================
// Results Page Component
// ============================================
// Displays election results after voting ends
// Currently shows placeholder; will connect to backend for real results

import React from "react";
import { Box, Typography, Button } from "@mui/material";

const ResultsPage = ({ onNavigateToVote }) => {
  return (
    <Box sx={{ textAlign: "center", p: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Election Results
      </Typography>

      <Typography variant="h6" color="text.secondary" mb={3}>
        No results are available at this time.
      </Typography>

      {/* Button to return to voting page */}
      <Button
        variant="contained"
        color="primary"
        onClick={onNavigateToVote}
        sx={{ mt: 2, px: 4, py: 1.5, fontSize: "16px", borderRadius: "8px" }}
        aria-label="Go to Voting Page"
      >
        Go to Voting Page
      </Button>
    </Box>
  );
};

export default ResultsPage;


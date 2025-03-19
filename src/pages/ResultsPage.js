import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ResultsPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: "center", p: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Election Results
      </Typography>

      <Typography variant="h6" color="text.secondary" mb={3}>
        No results are available at this time.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/dashboard/vote")} // Use absolute path
        sx={{ mt: 2, px: 4, py: 1.5, fontSize: "16px", borderRadius: "8px" }}
        aria-label="Go to Voting Page"
      >
        Go to Voting Page
      </Button>
    </Box>
  );
};

export default ResultsPage;

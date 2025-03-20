import React from "react";
import { Box, Typography } from "@mui/material";

const ViewResults = () => {
  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        View Results
      </Typography>
      <Typography variant="h6" color="text.secondary">
        This is where you can view real-time election results.
      </Typography>
    </Box>
  );
};

export default ViewResults;

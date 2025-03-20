import React from "react";
import { Box, Typography } from "@mui/material";

const ManageCandidates = () => {
  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Manage Candidates
      </Typography>
      <Typography variant="h6" color="text.secondary">
        This is where you can add, update, or delete candidates.
      </Typography>
    </Box>
  );
};

export default ManageCandidates;

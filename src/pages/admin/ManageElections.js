import React from "react";
import { Box, Typography } from "@mui/material";

const ManageElections = () => {
  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Manage Elections
      </Typography>
      <Typography variant="h6" color="text.secondary">
        This is where you can create, update, or delete elections.
      </Typography>
    </Box>
  );
};

export default ManageElections;

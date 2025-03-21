import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

// Mock data for election results (sorted by date in descending order)
const mockElectionResults = [
  {
    id: 2,
    name: "SRC Election 2024",
    startDate: "2024-10-01",
    startTime: "08:00",
    endDate: "2024-10-02",
    endTime: "20:00",
    positions: [
      {
        title: "President",
        candidates: [
          { name: "Candidate 1a", votes: 200 },
          { name: "Candidate 1b", votes: 180 },
          { name: "Candidate 1c", votes: 150 },
        ],
      },
      {
        title: "Vice President",
        candidates: [
          { name: "Candidate 2a", votes: 190 },
          { name: "Candidate 2b", votes: 170 },
          { name: "Candidate 2c", votes: 140 },
        ],
      },
    ],
  },
  {
    id: 1,
    name: "SRC Election 2023",
    startDate: "2023-10-01",
    startTime: "08:00",
    endDate: "2023-10-02",
    endTime: "20:00",
    positions: [
      {
        title: "President",
        candidates: [
          { name: "Candidate 1a", votes: 150 },
          { name: "Candidate 1b", votes: 120 },
          { name: "Candidate 1c", votes: 80 },
        ],
      },
      {
        title: "Vice President",
        candidates: [
          { name: "Candidate 2a", votes: 130 },
          { name: "Candidate 2b", votes: 110 },
          { name: "Candidate 2c", votes: 90 },
        ],
      },
    ],
  },
];

const ViewResults = () => {
  const [selectedElection, setSelectedElection] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSelectElection = (election) => {
    setSelectedElection(election);
    handleCloseDialog();
  };

  // Helper function to determine the winner for a position
  const getWinner = (candidates) => {
    let maxVotes = -1;
    let winner = null;
    candidates.forEach((candidate) => {
      if (candidate.votes > maxVotes) {
        maxVotes = candidate.votes;
        winner = candidate.name;
      }
    });
    return winner;
  };

  return (
    <Box sx={{ p: 4, minHeight: "100vh" }}>
      {/* Heading */}
      <Typography variant="h4" fontWeight="bold" align="center" mb={4}>
        View Election Results
      </Typography>

      {/* Select Election Button */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Button
          variant="contained"
          onClick={handleOpenDialog}
          sx={{
            bgcolor: "#007bff",
            color: "white",
            "&:hover": { bgcolor: "#0056b3" },
          }}
        >
          Select Election to View
        </Button>
      </Box>

      {/* Dialog for selecting an election */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: "#007bff", color: "white" }}>
          Select Election
        </DialogTitle>
        <DialogContent>
          <List>
            {mockElectionResults.map((election) => (
              <ListItem
                button
                key={election.id}
                onClick={() => handleSelectElection(election)}
              >
                <ListItemText primary={election.name} secondary={`${election.startDate} to ${election.endDate}`} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            sx={{ color: "#6c757d", "&:hover": { color: "#5a6268" } }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Display Selected Election Results */}
      {selectedElection && (
        <Box>
          {/* Election Details */}
          <Typography variant="h5" fontWeight="bold" align="center" mb={4}>
            {selectedElection.name}
          </Typography>
          <Typography variant="h6" align="center" mb={2}>
            Start: {selectedElection.startDate} {selectedElection.startTime}
          </Typography>
          <Typography variant="h6" align="center" mb={4}>
            End: {selectedElection.endDate} {selectedElection.endTime}
          </Typography>

          {/* Positions and Candidates */}
          {selectedElection.positions.map((position, index) => {
            const winner = getWinner(position.candidates);
            return (
              <Box key={index} sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  {position.title}
                </Typography>
                <TableContainer component={Paper} sx={{ borderRadius: "16px", boxShadow: 4 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#007bff" }}>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Candidate</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Votes</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {position.candidates.map((candidate, idx) => (
                        <TableRow key={idx} sx={{ "&:hover": { backgroundColor: "rgba(0, 123, 255, 0.1)" } }}>
                          <TableCell>
                            {candidate.name === winner ? "👑 " : ""}
                            {candidate.name}
                          </TableCell>
                          <TableCell>{candidate.votes}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default ViewResults;

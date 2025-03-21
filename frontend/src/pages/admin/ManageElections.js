import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ManageElections = () => {
  const [elections, setElections] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentElection, setCurrentElection] = useState({
    id: null,
    name: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  });
  const navigate = useNavigate();

  const handleOpenDialog = (election = { id: null, name: "", startDate: "", startTime: "", endDate: "", endTime: "" }) => {
    setCurrentElection(election);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentElection({ id: null, name: "", startDate: "", startTime: "", endDate: "", endTime: "" });
  };

  const handleSaveElection = () => {
    if (currentElection.name.trim()) {
      if (currentElection.id === null) {
        // Add new election
        setElections([...elections, { ...currentElection, id: elections.length + 1 }]);
      } else {
        // Update existing election
        setElections(elections.map((election) =>
          election.id === currentElection.id ? currentElection : election
        ));
      }
      handleCloseDialog();
    }
  };

  const handleDeleteElection = (id) => {
    setElections(elections.filter((election) => election.id !== id));
  };

  const isElectionInProgress = (election) => {
    const now = new Date();
    const start = new Date(`${election.startDate}T${election.startTime}`);
    const end = new Date(`${election.endDate}T${election.endTime}`);
    return now >= start && now <= end;
  };

  const isElectionEnded = (election) => {
    const now = new Date();
    const end = new Date(`${election.endDate}T${election.endTime}`);
    return now > end;
  };

  return (
    <Box sx={{ p: 4, minHeight: "100vh" }}>
      {/* Manage Elections Heading */}
      <Typography variant="h4" fontWeight="bold" align="center" mb={4}>
        Manage Elections
      </Typography>

      {/* Add Election Button */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            bgcolor: "#28a745",
            color: "white",
            "&:hover": { bgcolor: "#218838" },
          }}
        >
          Create New Election
        </Button>
      </Box>

      {/* Elections Table */}
      <TableContainer component={Paper} sx={{ borderRadius: "16px", boxShadow: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#007bff" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Election Name</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Start Date & Time</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>End Date & Time</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {elections.map((election) => {
              const inProgress = isElectionInProgress(election);
              const ended = isElectionEnded(election);
              return (
                <TableRow key={election.id} sx={{ "&:hover": { backgroundColor: "rgba(0, 123, 255, 0.1)" } }}>
                  <TableCell>{election.name}</TableCell>
                  <TableCell>{`${election.startDate} ${election.startTime}`}</TableCell>
                  <TableCell>{`${election.endDate} ${election.endTime}`}</TableCell>
                  <TableCell>
                    {inProgress ? (
                      <Typography variant="body2" color="text.secondary">
                        Ongoing
                      </Typography>
                    ) : ended ? (
                      <Button
                        variant="contained"
                        startIcon={<Visibility />}
                        onClick={() => navigate(`/admin/results/${election.id}`)}
                        sx={{
                          bgcolor: "#007bff",
                          color: "white",
                          "&:hover": { bgcolor: "#0056b3" },
                        }}
                      >
                        View Results
                      </Button>
                    ) : (
                      <>
                        <IconButton
                          onClick={() => handleOpenDialog(election)}
                          sx={{ color: "#007bff", "&:hover": { color: "#0056b3" } }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteElection(election.id)}
                          sx={{ color: "#dc3545", "&:hover": { color: "#a71d2a" } }}
                        >
                          <Delete />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for adding/editing elections */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: "#007bff", color: "white" }}>
          {currentElection.id ? "Edit Election" : "Create New Election"}
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <TextField
            label="Election Name"
            fullWidth
            value={currentElection.name}
            onChange={(e) => setCurrentElection({ ...currentElection, name: e.target.value })}
            sx={{ mb: 3 }}
          />
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={currentElection.startDate}
            onChange={(e) => setCurrentElection({ ...currentElection, startDate: e.target.value })}
            sx={{ mb: 3 }}
          />
          <TextField
            label="Start Time"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={currentElection.startTime}
            onChange={(e) => setCurrentElection({ ...currentElection, startTime: e.target.value })}
            sx={{ mb: 3 }}
          />
          <TextField
            label="End Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={currentElection.endDate}
            onChange={(e) => setCurrentElection({ ...currentElection, endDate: e.target.value })}
            sx={{ mb: 3 }}
          />
          <TextField
            label="End Time"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={currentElection.endTime}
            onChange={(e) => setCurrentElection({ ...currentElection, endTime: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            sx={{ color: "#6c757d", "&:hover": { color: "#5a6268" } }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveElection}
            variant="contained"
            sx={{ bgcolor: "#28a745", color: "white", "&:hover": { bgcolor: "#218838" } }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageElections;

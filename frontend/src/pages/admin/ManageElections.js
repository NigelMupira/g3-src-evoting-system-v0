// ============================================
// Manage Elections Page
// ============================================
// Admin interface for creating and managing elections
// Features: table view, create, edit, delete with backend API integration

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
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
  TextField,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { getAllElections, createElection, updateElection, deleteElection } from "../../services/electionService";

const ManageElections = () => {
  // ============================================
  // State Management
  // ============================================
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  // ============================================
  // Fetch Elections on Mount
  // ============================================
  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      setLoading(true);
      const response = await getAllElections();
      setElections(response.data || []);
    } catch (err) {
      setError("Failed to load elections");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // Handle Dialog
  // ============================================
  const handleOpenDialog = (election = null) => {
    if (election) {
      setEditingId(election.id);
      setFormData({
        name: election.name,
        description: election.description || "",
        startDate: election.start_date?.split("T")[0] || "",
        endDate: election.end_date?.split("T")[0] || "",
      });
    } else {
      setFormData({ name: "", description: "", startDate: "", endDate: "" });
      setEditingId(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
  };

  // ============================================
  // Handle Save Election
  // ============================================
  const handleSaveElection = async () => {
    try {
      if (editingId) {
        await updateElection(editingId, formData);
      } else {
        await createElection(formData);
      }
      handleCloseDialog();
      fetchElections();
      alert("Election saved successfully!");
    } catch (err) {
      alert("Failed to save election: " + (err.response?.data?.error || err.message));
    }
  };

  // ============================================
  // Handle Delete Election
  // ============================================
  const handleDeleteElection = async (id) => {
    if (window.confirm("Are you sure you want to delete this election?")) {
      try {
        await deleteElection(id);
        fetchElections();
        alert("Election deleted successfully!");
      } catch (err) {
        alert("Failed to delete election: " + (err.response?.data?.error || err.message));
      }
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Manage Elections
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{ background: "#003087", textTransform: "none" }}
        >
          Create Election
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#F8F9FA" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Start Date</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>End Date</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {elections.map((election) => (
              <TableRow key={election.id}>
                <TableCell>{election.name}</TableCell>
                <TableCell>{new Date(election.start_date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(election.end_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip
                    label={election.is_active ? "Active" : "Inactive"}
                    color={election.is_active ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpenDialog(election)} title="Edit">
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDeleteElection(election.id)} title="Delete">
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? "Edit Election" : "Create Election"}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Election Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Start Date"
            type="datetime-local"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="End Date"
            type="datetime-local"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveElection} variant="contained" sx={{ background: "#003087" }}>
            {editingId ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageElections;

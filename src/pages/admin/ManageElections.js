// ============================================
// Manage Elections Page
// ============================================
// Admin interface for creating and managing elections
// Features table view with CRUD operations and status management

import React, { useState } from "react";
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
} from "@mui/material";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";

const mockElections = [
  {
    id: 1,
    name: "SRC Presidential Election 2025",
    startDate: "2025-03-15",
    endDate: "2025-03-16",
    status: "Active",
    candidates: 12,
  },
  {
    id: 2,
    name: "Faculty Representatives 2024",
    startDate: "2024-12-01",
    endDate: "2024-12-02",
    status: "Completed",
    candidates: 8,
  },
];

const ManageElections = () => {
  const [elections, setElections] = useState(mockElections);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });

  const handleOpenDialog = (election = null) => {
    if (election) {
      setEditingId(election.id);
      setFormData({
        name: election.name,
        startDate: election.startDate,
        endDate: election.endDate,
      });
    } else {
      setFormData({ name: "", startDate: "", endDate: "" });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (editingId) {
      setElections(
        elections.map((e) =>
          e.id === editingId ? { ...e, ...formData } : e
        )
      );
    } else {
      setElections([
        ...elections,
        {
          id: Math.max(...elections.map((e) => e.id)) + 1,
          ...formData,
          status: "Pending",
          candidates: 0,
        },
      ]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    setElections(elections.filter((e) => e.id !== id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Completed":
        return "default";
      case "Pending":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1A1A1A" }}>
            Manage Elections
          </Typography>
          <Typography variant="body2" sx={{ color: "#666666", mt: 0.5 }}>
            Create and manage election events
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: "#003087",
            textTransform: "none",
            "&:hover": { background: "#0052CC" },
          }}
        >
          New Election
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: "0.75rem", border: "1px solid #E0E0E0" }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F8F9FA" }}>
              <TableCell sx={{ fontWeight: 700 }}>Election Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Start Date</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>End Date</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Candidates</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {elections.map((election) => (
              <TableRow key={election.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>
                  {election.name}
                </TableCell>
                <TableCell>
                  {new Date(election.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(election.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{election.candidates}</TableCell>
                <TableCell>
                  <Chip
                    label={election.status}
                    color={getStatusColor(election.status)}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    sx={{ color: "#003087" }}
                    title="View"
                  >
                    <Visibility fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ color: "#D4A017" }}
                    onClick={() => handleOpenDialog(election)}
                    title="Edit"
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ color: "#EF4444" }}
                    onClick={() => handleDelete(election.id)}
                    title="Delete"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingId ? "Edit Election" : "Create New Election"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Election Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            margin="normal"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.5rem" } }}
          />
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            margin="normal"
            InputLabelProps={{ shrink: true }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.5rem" } }}
          />
          <TextField
            fullWidth
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            margin="normal"
            InputLabelProps={{ shrink: true }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.5rem" } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ background: "#003087" }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageElections;


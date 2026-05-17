// ============================================
// Manage Candidates Page
// ============================================
// Admin interface for adding and managing candidates
// Features candidate table with CRUD operations

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
  MenuItem,
  IconButton,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";

const mockCandidates = [
  {
    id: 1,
    name: "John Doe",
    position: "President",
    election: "SRC Presidential Election 2025",
    bio: "Dedicated student leader",
  },
  {
    id: 2,
    name: "Jane Smith",
    position: "President",
    election: "SRC Presidential Election 2025",
    bio: "Passionate advocate",
  },
  {
    id: 3,
    name: "Mike Johnson",
    position: "Vice President",
    election: "SRC Presidential Election 2025",
    bio: "Community organizer",
  },
];

const ManageCandidates = () => {
  const [candidates, setCandidates] = useState(mockCandidates);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    election: "",
    bio: "",
  });

  const handleOpenDialog = (candidate = null) => {
    if (candidate) {
      setEditingId(candidate.id);
      setFormData({
        name: candidate.name,
        position: candidate.position,
        election: candidate.election,
        bio: candidate.bio,
      });
    } else {
      setFormData({ name: "", position: "", election: "", bio: "" });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (editingId) {
      setCandidates(
        candidates.map((c) =>
          c.id === editingId ? { ...c, ...formData } : c
        )
      );
    } else {
      setCandidates([
        ...candidates,
        {
          id: Math.max(...candidates.map((c) => c.id)) + 1,
          ...formData,
        },
      ]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    setCandidates(candidates.filter((c) => c.id !== id));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1A1A1A" }}>
            Manage Candidates
          </Typography>
          <Typography variant="body2" sx={{ color: "#666666", mt: 0.5 }}>
            Add and manage candidates for positions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: "#D4A017",
            textTransform: "none",
            color: "#1A1A1A",
            "&:hover": { background: "#B8860B" },
          }}
        >
          Add Candidate
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: "0.75rem", border: "1px solid #E0E0E0" }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F8F9FA" }}>
              <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Position</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Election</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Bio</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidates.map((candidate) => (
              <TableRow key={candidate.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>
                  {candidate.name}
                </TableCell>
                <TableCell>{candidate.position}</TableCell>
                <TableCell>{candidate.election}</TableCell>
                <TableCell sx={{ maxWidth: 200 }}>{candidate.bio}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    sx={{ color: "#D4A017" }}
                    onClick={() => handleOpenDialog(candidate)}
                    title="Edit"
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ color: "#EF4444" }}
                    onClick={() => handleDelete(candidate.id)}
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
          {editingId ? "Edit Candidate" : "Add New Candidate"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Candidate Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            margin="normal"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.5rem" } }}
          />
          <TextField
            select
            fullWidth
            label="Position"
            value={formData.position}
            onChange={(e) =>
              setFormData({ ...formData, position: e.target.value })
            }
            margin="normal"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.5rem" } }}
          >
            <MenuItem value="President">President</MenuItem>
            <MenuItem value="Vice President">Vice President</MenuItem>
            <MenuItem value="Secretary">Secretary</MenuItem>
          </TextField>
          <TextField
            select
            fullWidth
            label="Election"
            value={formData.election}
            onChange={(e) =>
              setFormData({ ...formData, election: e.target.value })
            }
            margin="normal"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.5rem" } }}
          >
            <MenuItem value="SRC Presidential Election 2025">
              SRC Presidential Election 2025
            </MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Bio"
            value={formData.bio}
            onChange={(e) =>
              setFormData({ ...formData, bio: e.target.value })
            }
            margin="normal"
            multiline
            rows={3}
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
            sx={{ background: "#D4A017", color: "#1A1A1A" }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageCandidates;


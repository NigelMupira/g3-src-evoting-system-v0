// ============================================
// Manage Candidates Page
// ============================================
// Admin interface for adding and managing candidates
// Features: table view, create, edit, delete with backend API

import React, { useState, useEffect } from "react";
import {
  Box, Container, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, IconButton, CircularProgress,
  Alert, FormControl, InputLabel, Select, MenuItem,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { getCandidates, createCandidate, updateCandidate, deleteCandidate, getPositions } from "../../services/adminService";
import { getAllElections } from "../../services/electionService";

const ManageCandidates = () => {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "", bio: "", manifesto: "", photoUrl: "", videoUrl: "", positionId: "",
  });

  // Fetch elections on mount
  useEffect(() => {
    const fetch = async () => {
      try {
        const r = await getAllElections();
        setElections(r.data || []);
        if (r.data?.length) setSelectedElection(r.data[0].id);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Fetch candidates and positions when election changes
  const fetchCandidatesAndPositions = async (electionId) => {
    if (!electionId) return;
    try {
      const [candRes, posRes] = await Promise.all([
        getCandidates(electionId),
        getPositions(electionId),
      ]);
      setCandidates(candRes.data || []);
      setPositions(posRes.data || []);
    } catch (e) {
      console.error("Error fetching candidates or positions:", e);
    }
  };

  useEffect(() => {
    fetchCandidatesAndPositions(selectedElection);
  }, [selectedElection]);

  const handleSave = async () => {
    try {
      if (!formData.positionId) {
        alert("Please select a position for the candidate");
        return;
      }
      if (editingId) {
        await updateCandidate(editingId, formData);
      } else {
        await createCandidate({ ...formData, electionId: selectedElection });
      }
      setOpenDialog(false);
      fetchCandidatesAndPositions(selectedElection);
      alert("Candidate saved successfully!");
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        await deleteCandidate(id);
        fetchCandidatesAndPositions(selectedElection);
        alert("Candidate deleted successfully!");
      } catch (e) {
        alert("Error deleting candidate: " + e.message);
      }
    }
  };

  if (loading) return <Container sx={{ py: 4, textAlign: "center" }}><CircularProgress /></Container>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Manage Candidates</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => { setFormData({ name: "", bio: "", manifesto: "", photoUrl: "", videoUrl: "", positionId: "" }); setEditingId(null); setOpenDialog(true); }} sx={{ background: "#003087" }}>Add Candidate</Button>
      </Box>

      <FormControl sx={{ mb: 3, minWidth: 300 }}>
        <InputLabel>Election</InputLabel>
        <Select value={selectedElection || ""} onChange={(e) => setSelectedElection(e.target.value)} label="Election">
          {elections.map((e) => <MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>)}
        </Select>
      </FormControl>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#F8F9FA" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Position</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Bio</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidates.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.position_name}</TableCell>
                <TableCell>{c.bio?.substring(0, 40)}...</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => { setFormData({ name: c.name, bio: c.bio || "", manifesto: c.manifesto || "", photoUrl: c.photo_url || "", videoUrl: c.video_url || "", positionId: c.position_id }); setEditingId(c.id); setOpenDialog(true); }}><Edit fontSize="small" /></IconButton>
                  <IconButton size="small" onClick={() => handleDelete(c.id)}><Delete fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? "Edit" : "Add"} Candidate</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField fullWidth label="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} margin="normal" required />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Position</InputLabel>
            <Select
              value={formData.positionId || ""}
              label="Position"
              onChange={(e) => setFormData({ ...formData, positionId: e.target.value })}
            >
              {positions.length > 0 ? (
                positions.map((pos) => (
                  <MenuItem key={pos.id} value={pos.id}>
                    {pos.position_name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="" disabled>
                  No positions found for this election
                </MenuItem>
              )}
            </Select>
          </FormControl>
          <TextField fullWidth label="Bio" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} margin="normal" multiline rows={2} />
          <TextField fullWidth label="Manifesto" value={formData.manifesto} onChange={(e) => setFormData({...formData, manifesto: e.target.value})} margin="normal" multiline rows={2} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" sx={{ background: "#003087" }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageCandidates;

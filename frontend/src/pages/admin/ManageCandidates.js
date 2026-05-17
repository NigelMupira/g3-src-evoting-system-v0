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
import { getCandidates, createCandidate, updateCandidate, deleteCandidate } from "../../services/adminService";
import { getAllElections } from "../../services/electionService";

const ManageCandidates = () => {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "", bio: "", manifesto: "", photoUrl: "", videoUrl: "", positionId: "",
  });

  // Fetch elections
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

  // Fetch candidates when election changes
  useEffect(() => {
    if (!selectedElection) return;
    const fetch = async () => {
      try {
        const r = await getCandidates(selectedElection);
        setCandidates(r.data || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetch();
  }, [selectedElection]);

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateCandidate(editingId, formData);
      } else {
        await createCandidate({ ...formData, electionId: selectedElection });
      }
      setOpenDialog(false);
      setSelectedElection(selectedElection); // Refetch
      alert("Saved!");
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete?")) {
      try {
        await deleteCandidate(id);
        setSelectedElection(selectedElection); // Refetch
      } catch (e) {
        alert("Error deleting");
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
          <TextField fullWidth label="Position ID" type="number" value={formData.positionId} onChange={(e) => setFormData({...formData, positionId: e.target.value})} margin="normal" required />
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

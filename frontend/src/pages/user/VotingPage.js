// ============================================
// Voting Page Component
// ============================================
// Professional voting interface for casting votes
// Fetches elections and candidates from backend API
// Displays candidates organized by position with progress tracking
// Includes vote confirmation dialog before submission

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  Button,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  Container,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Check, HowToVote } from "@mui/icons-material";
import { getActiveElections, getElectionById } from "../../services/electionService";
import { submitVote, getCandidates } from "../../services/voteService";
import { useAuth } from "../../context/AuthContext";

const VotingPage = () => {
  // ============================================
  // State Management
  // ============================================
  const { user } = useAuth();
  const [elections, setElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedVotes, setSelectedVotes] = useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ============================================
  // Fetch Active Elections on Mount
  // ============================================
  useEffect(() => {
    const fetchElections = async () => {
      try {
        setLoading(true);
        const response = await getActiveElections();
        setElections(response.data || []);
        if (response.data && response.data.length > 0) {
          setSelectedElectionId(response.data[0].id);
        }
      } catch (err) {
        setError("Failed to load elections. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  // ============================================
  // Fetch Candidates When Election Selected
  // ============================================
  useEffect(() => {
    if (!selectedElectionId) return;

    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await getCandidates(selectedElectionId);
        setCandidates(response.data || []);
        setSelectedVotes({}); // Reset votes when election changes
      } catch (err) {
        setError("Failed to load candidates for this election.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [selectedElectionId]);

  // ============================================
  // Handle Vote Selection
  // ============================================
  const handleVote = (positionId, candidateId) => {
    setSelectedVotes((prev) => ({
      ...prev,
      [positionId]: candidateId,
    }));
  };

  // ============================================
  // Submit All Votes
  // ============================================
  const handleSubmitVotes = async () => {
    setSubmitting(true);
    try {
      // Submit each vote
      const votePromises = Object.entries(selectedVotes).map(([positionId, candidateId]) =>
        submitVote(selectedElectionId, parseInt(positionId), candidateId)
      );

      await Promise.all(votePromises);

      setConfirmDialogOpen(false);
      alert("Your votes have been submitted successfully!");
      setSelectedVotes({});
    } catch (err) {
      console.error("Vote submission failed", err);
      alert("Vote submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================
  // Group Candidates by Position
  // ============================================
  const groupedByPosition = candidates.reduce((groups, candidate) => {
    const posKey = candidate.position_id || candidate.position_name;
    if (!groups[posKey]) {
      groups[posKey] = {
        positionId: candidate.position_id,
        positionName: candidate.position_name,
        candidates: [],
      };
    }
    groups[posKey].candidates.push(candidate);
    return groups;
  }, {});

  const positions = Object.values(groupedByPosition);
  const votesCount = Object.keys(selectedVotes).length;
  const completionPercentage = positions.length > 0 ? (votesCount / positions.length) * 100 : 0;

  // ============================================
  // Render
  // ============================================
  if (loading && elections.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading elections...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (elections.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">No active elections at this time.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: "#1A1A1A", mb: 3 }}>
          Cast Your Votes
        </Typography>

        {/* Election Selection */}
        <FormControl fullWidth sx={{ mb: 3, maxWidth: 400 }}>
          <InputLabel>Select Election</InputLabel>
          <Select
            value={selectedElectionId || ""}
            onChange={(e) => setSelectedElectionId(e.target.value)}
            label="Select Election"
          >
            {elections.map((election) => (
              <MenuItem key={election.id} value={election.id}>
                {election.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="body1" sx={{ color: "#666666", mb: 3 }}>
          Select one candidate for each position below
        </Typography>

        {/* Progress Section */}
        <Box sx={{ backgroundColor: "#F8F9FA", p: 2.5, borderRadius: "0.75rem", border: "1px solid #E0E0E0" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#1A1A1A" }}>
              Progress
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#003087" }}>
              {votesCount} of {positions.length} positions
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={completionPercentage}
            sx={{
              height: 8,
              borderRadius: "4px",
              backgroundColor: "#E0E0E0",
              "& .MuiLinearProgress-bar": {
                backgroundColor: completionPercentage === 100 ? "#22C55E" : "#003087",
                borderRadius: "4px",
              },
            }}
          />
        </Box>
      </Box>

      {/* Positions Section */}
      {positions.map((position, index) => (
        <Box key={position.positionId} sx={{ mb: 5 }}>
          {/* Position Header */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, pb: 2, borderBottom: "2px solid #E0E0E0" }}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <Chip
                  label={`Position ${index + 1}`}
                  sx={{ backgroundColor: "#003087", color: "white", fontWeight: 600 }}
                />
                {selectedVotes[position.positionId] && (
                  <Chip icon={<Check />} label="Selected" color="success" sx={{ fontWeight: 600 }} />
                )}
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#1A1A1A" }}>
                {position.positionName}
              </Typography>
            </Box>
          </Box>

          {/* Candidates Grid */}
          <Grid container spacing={2.5}>
            {position.candidates.map((candidate) => {
              const isSelected = selectedVotes[position.positionId] === candidate.id;
              const initials = candidate.name.split(" ").map((n) => n[0]).join("").toUpperCase();

              return (
                <Grid item xs={12} sm={6} md={4} key={candidate.id}>
                  <Card
                    onClick={() => handleVote(position.positionId, candidate.id)}
                    sx={{
                      height: "100%",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      border: isSelected ? "2px solid #003087" : "1px solid #E0E0E0",
                      backgroundColor: isSelected ? "rgba(0, 48, 135, 0.02)" : "#FFFFFF",
                      "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)" },
                    }}
                  >
                    <Box sx={{ p: 3, textAlign: "center", height: "100%" }}>
                      {/* Avatar */}
                      <Avatar sx={{ width: 80, height: 80, margin: "0 auto 1.5rem", backgroundColor: "#003087", fontSize: "1.5rem", fontWeight: 700 }}>
                        {initials}
                      </Avatar>

                      {/* Candidate Info */}
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: "#1A1A1A" }}>
                        {candidate.name}
                      </Typography>

                      {/* Selection Indicator */}
                      {isSelected && (
                        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, backgroundColor: "#22C55E", color: "white", px: 1.5, py: 0.5, borderRadius: "0.5rem", mb: 1.5, fontSize: "0.875rem", fontWeight: 600 }}>
                          <Check sx={{ fontSize: 16 }} />
                          Your Vote
                        </Box>
                      )}

                      {/* Vote Button */}
                      <Button
                        variant={isSelected ? "contained" : "outlined"}
                        fullWidth
                        startIcon={<HowToVote />}
                        sx={{
                          mt: isSelected ? 1 : "auto",
                          textTransform: "none",
                          fontWeight: 600,
                          backgroundColor: isSelected ? "#003087" : "transparent",
                          borderColor: isSelected ? "#003087" : "#D4A017",
                          color: isSelected ? "white" : "#D4A017",
                          "&:hover": { backgroundColor: isSelected ? "#0052CC" : "rgba(212, 160, 23, 0.05)" },
                        }}
                      >
                        {isSelected ? "Vote Selected" : "Select"}
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ))}

      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 5, pt: 3, borderTop: "2px solid #E0E0E0" }}>
        <Button
          variant="outlined"
          size="large"
          sx={{ px: 4, py: 1.5, textTransform: "none", borderColor: "#D4A017", color: "#D4A017" }}
        >
          Save as Draft
        </Button>
        <Button
          variant="contained"
          size="large"
          disabled={votesCount !== positions.length || submitting}
          onClick={() => setConfirmDialogOpen(true)}
          sx={{
            px: 4,
            py: 1.5,
            textTransform: "none",
            background: votesCount === positions.length ? "#003087" : "#999999",
            "&:hover": { background: votesCount === positions.length ? "#0052CC" : "#999999" },
          }}
        >
          {submitting ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
          Submit All Votes
        </Button>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: "#1A1A1A" }}>Confirm Your Votes</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Please review your selections before submitting. Once submitted, your votes cannot be changed.
          </Typography>
          <Box sx={{ backgroundColor: "#F8F9FA", p: 2, borderRadius: "0.5rem" }}>
            {positions.map((position) => (
              <Box key={position.positionId} sx={{ mb: 1.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1A1A1A" }}>
                  {position.positionName}:
                </Typography>
                <Typography variant="body2" sx={{ color: "#666666" }}>
                  {position.candidates.find((c) => c.id === selectedVotes[position.positionId])?.name || "Not selected"}
                </Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setConfirmDialogOpen(false)} variant="outlined" sx={{ textTransform: "none" }}>
            Go Back
          </Button>
          <Button onClick={handleSubmitVotes} variant="contained" disabled={submitting} sx={{ background: "#003087", textTransform: "none" }}>
            {submitting ? "Submitting..." : "Confirm & Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VotingPage;

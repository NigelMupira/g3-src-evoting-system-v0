// ============================================
// Voting Page Component
// ============================================
// Professional voting interface for casting votes
// Displays candidates organized by position with progress tracking
// Includes vote confirmation dialog before submission

import React, { useState } from "react";
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
} from "@mui/material";
import { Check, HowToVote } from "@mui/icons-material";

const positions = [
  {
    id: 1,
    title: "President",
    description: "Lead the Student Representative Council",
    candidates: [
      { id: "1a", name: "Candidate 1a", initials: "CA" },
      { id: "1b", name: "Candidate 1b", initials: "CB" },
      { id: "1c", name: "Candidate 1c", initials: "CC" },
    ],
  },
  {
    id: 2,
    title: "Vice President",
    description: "Support the President in council activities",
    candidates: [
      { id: "2a", name: "Candidate 2a", initials: "DA" },
      { id: "2b", name: "Candidate 2b", initials: "DB" },
      { id: "2c", name: "Candidate 2c", initials: "DC" },
      { id: "2d", name: "Candidate 2d", initials: "DD" },
    ],
  },
  {
    id: 3,
    title: "Secretary",
    description: "Maintain records and communications",
    candidates: [
      { id: "3a", name: "Candidate 3a", initials: "EA" },
      { id: "3b", name: "Candidate 3b", initials: "EB" },
      { id: "3c", name: "Candidate 3c", initials: "EC" },
    ],
  },
];

const VotingPage = () => {
  const [selectedVotes, setSelectedVotes] = useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleVote = (positionId, candidateId) => {
    setSelectedVotes((prev) => ({
      ...prev,
      [positionId]: candidateId,
    }));
  };

  const handleConfirmVote = () => {
    setConfirmDialogOpen(true);
  };

  const handleSubmitVotes = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Votes submitted:", selectedVotes);
      setConfirmDialogOpen(false);
      alert("Your votes have been submitted successfully!");
    } catch (error) {
      console.error("Vote submission failed", error);
      alert("Vote submission failed. Please try again.");
    }
  };

  const votesCount = Object.keys(selectedVotes).length;
  const completionPercentage = (votesCount / positions.length) * 100;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: "#1A1A1A",
            mb: 1,
          }}
        >
          Cast Your Votes
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#666666",
            mb: 3,
          }}
        >
          Select one candidate for each position below
        </Typography>

        {/* Progress Section */}
        <Box
          sx={{
            backgroundColor: "#F8F9FA",
            p: 2.5,
            borderRadius: "0.75rem",
            border: "1px solid #E0E0E0",
          }}
        >
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
        <Box key={position.id} sx={{ mb: 5 }}>
          {/* Position Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
              pb: 2,
              borderBottom: "2px solid #E0E0E0",
            }}
          >
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <Chip
                  label={`Position ${index + 1}`}
                  sx={{
                    backgroundColor: "#003087",
                    color: "white",
                    fontWeight: 600,
                  }}
                />
                {selectedVotes[position.id] && (
                  <Chip
                    icon={<Check />}
                    label="Selected"
                    color="success"
                    sx={{ fontWeight: 600 }}
                  />
                )}
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#1A1A1A" }}>
                {position.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#666666", mt: 0.5 }}
              >
                {position.description}
              </Typography>
            </Box>
          </Box>

          {/* Candidates Grid */}
          <Grid container spacing={2.5}>
            {position.candidates.map((candidate) => {
              const isSelected = selectedVotes[position.id] === candidate.id;
              return (
                <Grid item xs={12} sm={6} md={4} key={candidate.id}>
                  <Card
                    onClick={() => handleVote(position.id, candidate.id)}
                    sx={{
                      height: "100%",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      border: isSelected ? "2px solid #003087" : "1px solid #E0E0E0",
                      backgroundColor: isSelected ? "rgba(0, 48, 135, 0.02)" : "#FFFFFF",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  >
                    <Box sx={{ p: 3, textAlign: "center", height: "100%" }}>
                      {/* Avatar */}
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          margin: "0 auto 1.5rem",
                          backgroundColor: "#003087",
                          fontSize: "1.5rem",
                          fontWeight: 700,
                        }}
                      >
                        {candidate.initials}
                      </Avatar>

                      {/* Candidate Info */}
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          mb: 1.5,
                          color: "#1A1A1A",
                        }}
                      >
                        {candidate.name}
                      </Typography>

                      {/* Selection Indicator */}
                      {isSelected && (
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.5,
                            backgroundColor: "#22C55E",
                            color: "white",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: "0.5rem",
                            mb: 1.5,
                            fontSize: "0.875rem",
                            fontWeight: 600,
                          }}
                        >
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
                          "&:hover": {
                            backgroundColor: isSelected ? "#0052CC" : "rgba(212, 160, 23, 0.05)",
                          },
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
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "center",
          mt: 5,
          pt: 3,
          borderTop: "2px solid #E0E0E0",
        }}
      >
        <Button
          variant="outlined"
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            textTransform: "none",
            borderColor: "#D4A017",
            color: "#D4A017",
          }}
        >
          Save as Draft
        </Button>
        <Button
          variant="contained"
          size="large"
          disabled={votesCount !== positions.length}
          onClick={handleConfirmVote}
          sx={{
            px: 4,
            py: 1.5,
            textTransform: "none",
            background: votesCount === positions.length ? "#003087" : "#999999",
            "&:hover": {
              background: votesCount === positions.length ? "#0052CC" : "#999999",
            },
          }}
        >
          Submit All Votes
        </Button>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#1A1A1A" }}>
          Confirm Your Votes
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Please review your selections before submitting. Once submitted, your votes cannot be changed.
          </Typography>
          <Box sx={{ backgroundColor: "#F8F9FA", p: 2, borderRadius: "0.5rem" }}>
            {positions.map((position) => (
              <Box key={position.id} sx={{ mb: 1.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1A1A1A" }}>
                  {position.title}:
                </Typography>
                <Typography variant="body2" sx={{ color: "#666666" }}>
                  {position.candidates.find(c => c.id === selectedVotes[position.id])?.name || "Not selected"}
                </Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setConfirmDialogOpen(false)}
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            Go Back
          </Button>
          <Button
            onClick={handleSubmitVotes}
            variant="contained"
            sx={{ background: "#003087", textTransform: "none" }}
          >
            Confirm & Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VotingPage;

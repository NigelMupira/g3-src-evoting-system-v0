import React, { useState } from "react";
import { Box, Typography, Grid, Card, CardContent, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Mock candidate data (replace with dynamic data from backend or config)
const positions = [
  {
    title: "Position 1",
    candidates: [
      { id: "1a", name: "Candidate 1a" },
      { id: "1b", name: "Candidate 1b" },
      { id: "1c", name: "Candidate 1c" },
    ],
  },
  {
    title: "Position 2",
    candidates: [
      { id: "2a", name: "Candidate 2a" },
      { id: "2b", name: "Candidate 2b" },
      { id: "2c", name: "Candidate 2c" },
      { id: "2d", name: "Candidate 2d" },
    ],
  },
  {
    title: "Position 3",
    candidates: [
      { id: "3a", name: "Candidate 3a" },
      { id: "3b", name: "Candidate 3b" },
      { id: "3c", name: "Candidate 3c" },
      { id: "3d", name: "Candidate 3d" },
      { id: "3e", name: "Candidate 3e" },
    ],
  },
  {
    title: "Position 4",
    candidates: [
      { id: "4a", name: "Candidate 4a" },
      { id: "4b", name: "Candidate 4b" },
      { id: "4c", name: "Candidate 4c" },
    ],
  },
];

const VotingPage = () => {
  const [selectedVotes, setSelectedVotes] = useState({});
  const navigate = useNavigate();

  const handleVote = (position, candidateId) => {
    setSelectedVotes((prev) => ({ ...prev, [position]: candidateId }));
  };

  const handleConfirmVote = async () => {
    try {
      // Simulate API call (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Votes submitted:", selectedVotes);
      alert("Your votes have been submitted successfully!");
      navigate("/dashboard/results"); // Navigate to results page after successful submission
    } catch (error) {
      console.error("Vote submission failed", error);
      alert("Vote submission failed. Please try again.");
    }
  };

  return (
    <Box sx={{ textAlign: "center", p: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Cast Your Votes
      </Typography>

      {positions.map((position) => (
        <Box key={position.title} sx={{ mb: 5 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
            {position.title}
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {position.candidates.map((candidate) => (
              <Grid item key={candidate.id}>
                <Card sx={{ 
                  width: 220,
                  height: 280,
                  textAlign: "center", 
                  p: 2, 
                  borderRadius: "16px",
                  boxShadow: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.05)" }
                }}>
                  <Box 
                    sx={{ 
                      width: 140, 
                      height: 140, 
                      backgroundColor: "#ddd", 
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
                      {candidate.name}
                    </Typography>
                    <Box sx={{ mt: "auto", width: "100%" }}> 
                      <Button 
                        variant="contained" 
                        size="small" 
                        sx={{
                          bgcolor: selectedVotes[position.title] === candidate.id ? "blue" : "grey",
                          color: "white",
                          borderRadius: "8px",
                          width: "100%",
                          "&:hover": { bgcolor: selectedVotes[position.title] === candidate.id ? "blue" : "darkgrey" }
                        }}
                        onClick={() => handleVote(position.title, candidate.id)}
                        aria-label={`Vote for ${candidate.name}`}
                      >
                        CAST VOTE
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        sx={{ 
                          mt: 1, 
                          borderRadius: "8px", 
                          width: "100%" 
                        }}
                        aria-label={`View manifesto for ${candidate.name}`}
                      >
                        MANIFESTO
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      <Button 
        variant="contained" 
        onClick={handleConfirmVote} 
        sx={{ 
          mt: 4, 
          bgcolor: "#28a745", 
          color: "white", 
          width: "280px", 
          height: "60px", 
          fontSize: "18px",
          borderRadius: "10px",
          "&:hover": { bgcolor: "#218838" }
        }}
        aria-label="Confirm Votes"
      >
        CONFIRM VOTES
      </Button>
    </Box>
  );
};

export default VotingPage;

// ============================================
// Results Page Component
// ============================================
// Displays real-time election results with analytics
// Shows vote counts and percentages for each candidate
// Professional layout with result visualizations

import React from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  LinearProgress,
  Container,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { EmojiEvents, HowToVote } from "@mui/icons-material";

const mockResults = {
  positions: [
    {
      id: 1,
      title: "President",
      candidates: [
        { name: "Candidate 1a", votes: 342, percentage: 45.2 },
        { name: "Candidate 1b", votes: 289, percentage: 38.1 },
        { name: "Candidate 1c", votes: 127, percentage: 16.7 },
      ],
      totalVotes: 758,
      winner: "Candidate 1a",
    },
    {
      id: 2,
      title: "Vice President",
      candidates: [
        { name: "Candidate 2a", votes: 412, percentage: 52.3 },
        { name: "Candidate 2b", votes: 215, percentage: 27.2 },
        { name: "Candidate 2c", votes: 98, percentage: 12.4 },
        { name: "Candidate 2d", votes: 63, percentage: 8.1 },
      ],
      totalVotes: 788,
      winner: "Candidate 2a",
    },
    {
      id: 3,
      title: "Secretary",
      candidates: [
        { name: "Candidate 3a", votes: 523, percentage: 61.8 },
        { name: "Candidate 3b", votes: 212, percentage: 25.1 },
        { name: "Candidate 3c", votes: 111, percentage: 13.1 },
      ],
      totalVotes: 846,
      winner: "Candidate 3a",
    },
  ],
  totalVoters: 956,
  turnout: 78.5,
};

const ResultsPage = ({ onNavigateToVote }) => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: "#1A1A1A",
            mb: 1,
          }}
        >
          Election Results
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#666666",
            mb: 3,
          }}
        >
          View complete election results and statistics
        </Typography>
      </Box>

      {/* Statistics Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              textAlign: "center",
              background: "linear-gradient(135deg, #003087 0%, #0052CC 100%)",
              color: "white",
            }}
          >
            <HowToVote sx={{ fontSize: 32, mb: 1 }} />
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
              Total Votes
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {mockResults.totalVoters}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              textAlign: "center",
              background: "linear-gradient(135deg, #D4A017 0%, #E5B64F 100%)",
              color: "white",
            }}
          >
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
              {mockResults.turnout}%
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Voter Turnout
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              textAlign: "center",
              background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
              color: "white",
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
              Positions
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {mockResults.positions.length}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              textAlign: "center",
              background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
              color: "white",
            }}
          >
            <EmojiEvents sx={{ fontSize: 32, mb: 1 }} />
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
              Winners
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {mockResults.positions.length}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Position Results */}
      {mockResults.positions.map((position) => (
        <Card
          key={position.id}
          sx={{
            mb: 3,
            borderRadius: "0.75rem",
            border: "1px solid #E0E0E0",
            overflow: "hidden",
          }}
        >
          {/* Position Header */}
          <Box
            sx={{
              backgroundColor: "#F8F9FA",
              p: 2.5,
              borderBottom: "1px solid #E0E0E0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#1A1A1A" }}>
                {position.title}
              </Typography>
              <Typography variant="caption" sx={{ color: "#666666" }}>
                Total Votes: {position.totalVotes}
              </Typography>
            </Box>
            <Chip
              icon={<EmojiEvents />}
              label={position.winner}
              color="success"
              sx={{ fontWeight: 600 }}
            />
          </Box>

          {/* Candidate Results */}
          <Box sx={{ p: 3 }}>
            {position.candidates.map((candidate, index) => (
              <Box key={index} sx={{ mb: index < position.candidates.length - 1 ? 2.5 : 0 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.75,
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "#1A1A1A",
                      }}
                    >
                      {candidate.name}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: "#003087",
                      }}
                    >
                      {candidate.votes} votes ({candidate.percentage}%)
                    </Typography>
                  </Box>
                </Box>

                {/* Progress Bar */}
                <LinearProgress
                  variant="determinate"
                  value={candidate.percentage}
                  sx={{
                    height: 8,
                    borderRadius: "4px",
                    backgroundColor: "#E0E0E0",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor:
                        candidate.name === position.winner ? "#22C55E" : "#003087",
                      borderRadius: "4px",
                    },
                  }}
                />
              </Box>
            ))}
          </Box>
        </Card>
      ))}

      {/* Detailed Results Table */}
      <Card
        sx={{
          mt: 4,
          borderRadius: "0.75rem",
          border: "1px solid #E0E0E0",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#F8F9FA",
            p: 2.5,
            borderBottom: "1px solid #E0E0E0",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1A1A1A" }}>
            Detailed Results Summary
          </Typography>
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F8F9FA" }}>
                <TableCell sx={{ fontWeight: 700 }}>Position</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Winner</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Votes Received</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Vote Share</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Total Votes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockResults.positions.map((position) => {
                const winner = position.candidates.find(
                  (c) => c.name === position.winner
                );
                return (
                  <TableRow key={position.id}>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {position.title}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#22C55E" }}>
                      {winner.name}
                    </TableCell>
                    <TableCell>{winner.votes}</TableCell>
                    <TableCell>{winner.percentage}%</TableCell>
                    <TableCell>{position.totalVotes}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Footer Note */}
      <Box
        sx={{
          mt: 4,
          p: 2.5,
          backgroundColor: "#E3F2FD",
          borderRadius: "0.5rem",
          border: "1px solid #90CAF9",
        }}
      >
        <Typography variant="body2" sx={{ color: "#1565C0" }}>
          ℹ️ These results are updated in real-time. Refresh the page for the latest data.
        </Typography>
      </Box>
    </Container>
  );
};

export default ResultsPage;


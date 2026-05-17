// ============================================
// View Results Page
// ============================================
// Admin interface for viewing detailed election results
// Displays analytics, vote counts, and winner information

import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  Grid,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import { EmojiEvents, TrendingUp } from "@mui/icons-material";

const mockResults = {
  totalVotes: 956,
  turnout: 78.5,
  positions: [
    {
      id: 1,
      title: "President",
      candidates: [
        { name: "John Doe", votes: 342, percentage: 45.2 },
        { name: "Jane Smith", votes: 289, percentage: 38.1 },
        { name: "Mike Johnson", votes: 127, percentage: 16.7 },
      ],
      totalVotes: 758,
      winner: "John Doe",
    },
    {
      id: 2,
      title: "Vice President",
      candidates: [
        { name: "Sarah Lee", votes: 412, percentage: 52.3 },
        { name: "Tom Wilson", votes: 215, percentage: 27.2 },
        { name: "Lisa Chen", votes: 161, percentage: 20.5 },
      ],
      totalVotes: 788,
      winner: "Sarah Lee",
    },
  ],
};

const ViewResults = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#1A1A1A",
            mb: 1,
          }}
        >
          Election Results Analytics
        </Typography>
        <Typography variant="body2" sx={{ color: "#666666" }}>
          Comprehensive results and statistics
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 3, background: "linear-gradient(135deg, #003087 0%, #0052CC 100%)", color: "white" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Total Votes
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {mockResults.totalVotes}
                </Typography>
              </Box>
              <TrendingUp sx={{ fontSize: 40, opacity: 0.5 }} />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 3, background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)", color: "white" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Voter Turnout
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {mockResults.turnout}%
                </Typography>
              </Box>
              <EmojiEvents sx={{ fontSize: 40, opacity: 0.5 }} />
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Results by Position */}
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
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1A1A1A" }}>
              {position.title}
            </Typography>
            <Chip
              icon={<EmojiEvents />}
              label={position.winner}
              color="success"
              sx={{ fontWeight: 600 }}
            />
          </Box>

          {/* Candidates */}
          <Box sx={{ p: 3 }}>
            {position.candidates.map((candidate, index) => (
              <Box key={index} sx={{ mb: index < position.candidates.length - 1 ? 2 : 0 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.75,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "#1A1A1A",
                    }}
                  >
                    {candidate.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      color: "#003087",
                    }}
                  >
                    {candidate.votes} ({candidate.percentage}%)
                  </Typography>
                </Box>
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

      {/* Detailed Table */}
      <Card
        sx={{
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
            Winners Summary
          </Typography>
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F8F9FA" }}>
                <TableCell sx={{ fontWeight: 700 }}>Position</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Winner</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Votes</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Vote Share</TableCell>
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
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Container>
  );
};

export default ViewResults;


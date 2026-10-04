// ============================================
// Results Page Component
// ============================================
// Displays election results with analytics from backend API
// Shows vote counts and percentages for each candidate
// Professional layout with result visualizations

import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { EmojiEvents, HowToVote } from "@mui/icons-material";
import { getAllElections } from "../../services/electionService";
import { getElectionResults } from "../../services/voteService";

const ResultsPage = () => {
  // ============================================
  // State Management
  // ============================================
  const [elections, setElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState(null);
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============================================
  // Fetch Elections on Mount
  // ============================================
  useEffect(() => {
    const fetchElections = async () => {
      try {
        setLoading(true);
        const response = await getAllElections();
        setElections(response.data || []);
        if (response.data && response.data.length > 0) {
          setSelectedElectionId(response.data[0].id);
        }
      } catch (err) {
        setError("Failed to load elections.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  // ============================================
  // Fetch Results When Election Selected
  // ============================================
  useEffect(() => {
    if (!selectedElectionId) return;

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getElectionResults(selectedElectionId);
        console.log("Results response:", response);
        setResults(response.data || []);
        setStats(response.stats || {});
      } catch (err) {
        setError("Failed to load results for this election.");
        console.error("Error fetching results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [selectedElectionId]);

  // ============================================
  // Group Results by Position
  // ============================================
  const groupedByPosition = results.reduce((groups, result) => {
    const posKey = result.position_id || result.position_name;
    if (!groups[posKey]) {
      groups[posKey] = {
        positionId: result.position_id,
        positionName: result.position_name,
        candidates: [],
        totalVotes: 0,
      };
    }
    groups[posKey].candidates.push(result);
    groups[posKey].totalVotes += result.vote_count || 0;
    return groups;
  }, {});

  const positions = Object.values(groupedByPosition);

  // ============================================
  // Render Loading / Empty States
  // ============================================
  if (loading && elections.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading elections...</Typography>
      </Container>
    );
  }

  if (error && elections.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (elections.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">No elections available. Please create an election first.</Alert>
      </Container>
    );
  }

  // ============================================
  // Calculate Stats
  // ============================================
  const totalVotes = stats?.totalVotes || 0;
  const uniqueVoters = stats?.uniqueVoters || 0;
  const turnout = uniqueVoters > 0 && positions.length > 0 
    ? ((totalVotes / (uniqueVoters * positions.length)) * 100).toFixed(1) 
    : 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: "#1A1A1A", mb: 3 }}>
          Election Results
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
          View complete election results and statistics
        </Typography>
      </Box>

      {/* Statistics Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: "center", background: "linear-gradient(135deg, #003087 0%, #0052CC 100%)", color: "white" }}>
            <HowToVote sx={{ fontSize: 32, mb: 1 }} />
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
              Total Votes
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {totalVotes}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: "center", background: "linear-gradient(135deg, #D4A017 0%, #E5B64F 100%)", color: "white" }}>
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
              {turnout}%
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Participation Rate
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: "center", background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)", color: "white" }}>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
              Positions
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {positions.length}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: "center", background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)", color: "white" }}>
            <EmojiEvents sx={{ fontSize: 32, mb: 1 }} />
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
              Winners
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {positions.length}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Position Results */}
      {loading ? (
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress />
        </Box>
      ) : positions.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>No positions or candidates registered for this election yet.</Alert>
      ) : (
        positions.map((position, idx) => {
          const winner = position.candidates.length > 0
            ? position.candidates.reduce((prev, current) =>
                (prev.vote_count || 0) > (current.vote_count || 0) ? prev : current
              )
            : { name: "No candidates", vote_count: 0 };

          return (
            <Card key={idx} sx={{ mb: 3, borderRadius: "0.75rem", border: "1px solid #E0E0E0", overflow: "hidden" }}>
              {/* Position Header */}
              <Box sx={{ backgroundColor: "#F8F9FA", p: 2.5, borderBottom: "1px solid #E0E0E0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#1A1A1A" }}>
                    {position.positionName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#666666" }}>
                    Total Votes: {position.totalVotes}
                  </Typography>
                </Box>
                <Chip icon={<EmojiEvents />} label={winner.name} color="success" sx={{ fontWeight: 600 }} />
              </Box>

              {/* Candidate Results */}
              <Box sx={{ p: 3 }}>
                {position.candidates.map((candidate, index) => {
                  const percentage = position.totalVotes > 0 ? ((candidate.vote_count / position.totalVotes) * 100).toFixed(1) : 0;
                  const isWinner = candidate.id === winner.id;

                  return (
                    <Box key={index} sx={{ mb: index < position.candidates.length - 1 ? 2.5 : 0 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75, alignItems: "center" }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#1A1A1A" }}>
                            {candidate.name}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: "#003087" }}>
                            {candidate.vote_count} votes ({percentage}%)
                          </Typography>
                        </Box>
                      </Box>

                      {/* Progress Bar */}
                      <LinearProgress
                        variant="determinate"
                        value={parseInt(percentage)}
                        sx={{
                          height: 8,
                          borderRadius: "4px",
                          backgroundColor: "#E0E0E0",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: isWinner ? "#22C55E" : "#003087",
                            borderRadius: "4px",
                          },
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>
            </Card>
          );
        })
      )}

      {/* Detailed Results Table */}
      {positions.length > 0 && (
        <Card sx={{ mt: 4, borderRadius: "0.75rem", border: "1px solid #E0E0E0", overflow: "hidden" }}>
          <Box sx={{ backgroundColor: "#F8F9FA", p: 2.5, borderBottom: "1px solid #E0E0E0" }}>
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
                {positions.map((position) => {
                  const winner = position.candidates.length > 0
                    ? position.candidates.reduce((prev, current) =>
                        (prev.vote_count || 0) > (current.vote_count || 0) ? prev : current
                      )
                    : { name: "No candidates", vote_count: 0 };
                  const percentage = position.totalVotes > 0 && winner.vote_count ? ((winner.vote_count / position.totalVotes) * 100).toFixed(1) : 0;

                  return (
                    <TableRow key={position.positionId}>
                      <TableCell sx={{ fontWeight: 600 }}>{position.positionName}</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#22C55E" }}>{winner.name}</TableCell>
                      <TableCell>{winner.vote_count}</TableCell>
                      <TableCell>{percentage}%</TableCell>
                      <TableCell>{position.totalVotes}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Footer Note */}
      <Box sx={{ mt: 4, p: 2.5, backgroundColor: "#E3F2FD", borderRadius: "0.5rem", border: "1px solid #90CAF9" }}>
        <Typography variant="body2" sx={{ color: "#1565C0" }}>
          ℹ️ These results are updated in real-time. Refresh the page for the latest data.
        </Typography>
      </Box>
    </Container>
  );
};

export default ResultsPage;

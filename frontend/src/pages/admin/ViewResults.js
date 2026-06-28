// ============================================
// Enhanced View Results Page
// ============================================
// Admin interface for viewing detailed election results with advanced analytics
// Displays comprehensive vote counts, winner information, participation metrics
// Features interactive charts, voter turnout analysis, and position breakdowns

import React, { useState, useEffect } from "react";
import {
  Box, Container, Typography, Card, Grid, LinearProgress, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
  CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem,
  Tab, Tabs, Avatar, Divider, Button,
} from "@mui/material";
import { EmojiEvents, TrendingUp, People, HowToVote, BarChart, Download } from "@mui/icons-material";
import { getAllElections } from "../../services/electionService";
import { getElectionResults } from "../../services/voteService";

const ViewResults = () => {
  // ============================================
  // State Management
  // ============================================
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  // ============================================
  // Fetch Elections on Mount
  // ============================================
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

  // ============================================
  // Fetch Results When Election Selected
  // ============================================
  useEffect(() => {
    if (!selectedElection) return;
    const fetch = async () => {
      try {
        const r = await getElectionResults(selectedElection);
        setResults(r.data || []);
        setStats(r.stats || {});
      } catch (e) {
        setError(e.message);
      }
    };
    fetch();
  }, [selectedElection]);

  // ============================================
  // Group Candidates by Position
  // ============================================
  const positions = Object.values(results.reduce((g, r) => {
    const k = r.position_id;
    if (!g[k]) g[k] = { positionId: k, positionName: r.position_name, candidates: [], totalVotes: 0 };
    g[k].candidates.push(r);
    g[k].totalVotes += r.vote_count || 0;
    return g;
  }, {}));

  // ============================================
  // Calculate Statistics
  // ============================================
  const totalVotes = stats.totalVotes || 0;
  const uniqueVoters = stats.uniqueVoters || 0;
  const turnout = uniqueVoters > 0 ? ((totalVotes / (uniqueVoters * Math.max(positions.length, 1))) * 100).toFixed(1) : 0;
  const totalCandidates = results.length || 0;

  // ============================================
  // Handle Tab Change
  // ============================================
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // ============================================
  // Export Results as CSV
  // ============================================
  const handleExportCSV = () => {
    const csvContent = [
      ['Position', 'Candidate', 'Votes', 'Percentage'],
      ...positions.flatMap(pos => 
        pos.candidates.map(c => [
          pos.positionName,
          c.name,
          c.vote_count || 0,
          pos.totalVotes > 0 ? ((c.vote_count / pos.totalVotes) * 100).toFixed(1) + '%' : '0%'
        ])
      )
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `election-results-${selectedElection}.csv`;
    a.click();
  };

  // ============================================
  // Render Loading State
  // ============================================
  if (loading) return <Container sx={{ py: 4, textAlign: "center" }}><CircularProgress /></Container>;
  if (error) return <Container sx={{ py: 4 }}><Alert severity="error">{error}</Alert></Container>;

  // ============================================
  // Render Main Component
  // ============================================
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          <BarChart sx={{ verticalAlign: "middle", mr: 1, fontSize: 32 }} />
          Election Results
        </Typography>
        <Button
          startIcon={<Download />}
          variant="outlined"
          onClick={handleExportCSV}
          disabled={positions.length === 0}
          sx={{ textTransform: "none" }}
        >
          Export CSV
        </Button>
      </Box>

      {/* Election Selection */}
      <FormControl sx={{ mb: 4, minWidth: 300 }}>
        <InputLabel>Select Election</InputLabel>
        <Select value={selectedElection || ""} onChange={(e) => setSelectedElection(e.target.value)} label="Select Election">
          {elections.map((e) => <MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>)}
        </Select>
      </FormControl>

      {/* Enhanced Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, background: "linear-gradient(135deg, #003087 0%, #0052CC 100%)", color: "white", borderRadius: "0.75rem" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <HowToVote sx={{ fontSize: 28, opacity: 0.9, mr: 1 }} />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Votes</Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>{totalVotes.toLocaleString()}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, background: "linear-gradient(135deg, #D4A017 0%, #E5B64F 100%)", color: "white", borderRadius: "0.75rem" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <TrendingUp sx={{ fontSize: 28, opacity: 0.9, mr: 1 }} />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Participation</Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>{turnout}%</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)", color: "white", borderRadius: "0.75rem" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <People sx={{ fontSize: 28, opacity: 0.9, mr: 1 }} />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Unique Voters</Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>{uniqueVoters.toLocaleString()}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)", color: "white", borderRadius: "0.75rem" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <EmojiEvents sx={{ fontSize: 28, opacity: 0.9, mr: 1 }} />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Candidates</Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>{totalCandidates}</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for Different Views */}
      <Card sx={{ borderRadius: "0.75rem" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Summary" />
            <Tab label="Detailed Results" />
            <Tab label="Position Breakdown" />
          </Tabs>
        </Box>

        {/* Summary Tab */}
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Election Summary</Typography>
            {positions.length > 0 ? (
              <Grid container spacing={3}>
                {positions.map((pos, index) => {
                  const winner = pos.candidates.reduce((p, c) => (p.vote_count || 0) > (c.vote_count || 0) ? p : c);
                  const pct = pos.totalVotes > 0 ? ((winner.vote_count / pos.totalVotes) * 100).toFixed(1) : 0;
                  return (
                    <Grid item xs={12} md={6} key={pos.positionId}>
                      <Card sx={{ p: 3, border: "1px solid #E0E0E0", borderRadius: "0.75rem" }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <Avatar sx={{ bgcolor: "#003087", mr: 2 }}>
                            {index + 1}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>{pos.positionName}</Typography>
                            <Typography variant="body2" sx={{ color: "#666" }}>{pos.candidates.length} candidates</Typography>
                          </Box>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <EmojiEvents sx={{ color: "#FFD700", mr: 1, fontSize: 24 }} />
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>Winner: {winner.name}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                            <Typography variant="body2" sx={{ color: "#666" }}>Vote Share</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: "#003087" }}>{pct}%</Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={parseFloat(pct)}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: "#E0E0E0",
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: "#003087",
                                borderRadius: 4,
                              },
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ color: "#666" }}>
                          {winner.vote_count} votes out of {pos.totalVotes} total
                        </Typography>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Alert severity="info">No results available for this election</Alert>
            )}
          </Box>
        )}

        {/* Detailed Results Tab */}
        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Detailed Results</Typography>
            {positions.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: "#F8F9FA" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Position</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Candidate</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Votes</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>%</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {positions.flatMap(pos => 
                      pos.candidates.map((candidate, cIndex) => {
                        const isWinner = cIndex === 0; // Assuming sorted by votes
                        const pct = pos.totalVotes > 0 ? ((candidate.vote_count / pos.totalVotes) * 100).toFixed(1) : 0;
                        return (
                          <TableRow key={`${pos.positionId}-${candidate.id}`} hover>
                            <TableCell sx={{ fontWeight: 600 }}>{pos.positionName}</TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                {isWinner && <EmojiEvents sx={{ color: "#FFD700", mr: 1, fontSize: 20 }} />}
                                {candidate.name}
                              </Box>
                            </TableCell>
                            <TableCell>{candidate.vote_count || 0}</TableCell>
                            <TableCell>{pct}%</TableCell>
                            <TableCell>
                              {isWinner ? (
                                <Chip label="Winner" color="success" size="small" />
                              ) : (
                                <Chip label="Runner-up" variant="outlined" size="small" />
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">No results available for this election</Alert>
            )}
          </Box>
        )}

        {/* Position Breakdown Tab */}
        {tabValue === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Position Breakdown</Typography>
            {positions.length > 0 ? (
              positions.map((pos, index) => (
                <Card key={pos.positionId} sx={{ mb: 3, p: 3, border: "1px solid #E0E0E0", borderRadius: "0.75rem" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>{pos.positionName}</Typography>
                  <Grid container spacing={2}>
                    {pos.candidates.map((candidate) => {
                      const pct = pos.totalVotes > 0 ? ((candidate.vote_count / pos.totalVotes) * 100).toFixed(1) : 0;
                      return (
                        <Grid item xs={12} sm={6} md={4} key={candidate.id}>
                          <Card sx={{ p: 2, backgroundColor: "#F8F9FA", border: "1px solid #E0E0E0" }}>
                            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>{candidate.name}</Typography>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                              <Typography variant="body2" sx={{ color: "#666" }}>Votes</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>{candidate.vote_count || 0}</Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={parseFloat(pct)}
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: "#E0E0E0",
                                "& .MuiLinearProgress-bar": {
                                  backgroundColor: pct > 50 ? "#22C55E" : "#003087",
                                  borderRadius: 3,
                                },
                              }}
                            />
                            <Typography variant="caption" sx={{ color: "#666", mt: 0.5, display: "block" }}>{pct}%</Typography>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Card>
              ))
            ) : (
              <Alert severity="info">No results available for this election</Alert>
            )}
          </Box>
        )}
      </Card>
    </Container>
  );
};

export default ViewResults;

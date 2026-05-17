// ============================================
// View Results Page
// ============================================
// Admin interface for viewing detailed election results
// Displays analytics, vote counts, and winner information from backend

import React, { useState, useEffect } from "react";
import {
  Box, Container, Typography, Card, Grid, LinearProgress, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
  CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem,
} from "@mui/material";
import { EmojiEvents, TrendingUp } from "@mui/icons-material";
import { getAllElections } from "../../services/electionService";
import { getElectionResults } from "../../services/voteService";

const ViewResults = () => {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const positions = Object.values(results.reduce((g, r) => {
    const k = r.position_id;
    if (!g[k]) g[k] = { positionId: k, positionName: r.position_name, candidates: [], totalVotes: 0 };
    g[k].candidates.push(r);
    g[k].totalVotes += r.vote_count || 0;
    return g;
  }, {}));

  const totalVotes = stats.totalVotes || 0;
  const uniqueVoters = stats.uniqueVoters || 0;
  const turnout = uniqueVoters > 0 ? ((totalVotes / (uniqueVoters * Math.max(positions.length, 1))) * 100).toFixed(1) : 0;

  if (loading) return <Container sx={{ py: 4, textAlign: "center" }}><CircularProgress /></Container>;
  if (error) return <Container sx={{ py: 4 }}><Alert severity="error">{error}</Alert></Container>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Election Results (Admin)</Typography>

      <FormControl sx={{ mb: 3, minWidth: 300 }}>
        <InputLabel>Election</InputLabel>
        <Select value={selectedElection || ""} onChange={(e) => setSelectedElection(e.target.value)} label="Election">
          {elections.map((e) => <MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>)}
        </Select>
      </FormControl>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, background: "linear-gradient(135deg, #003087 0%, #0052CC 100%)", color: "white" }}>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Votes</Typography>
            <Typography variant="h4">{totalVotes}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, background: "linear-gradient(135deg, #D4A017 0%, #E5B64F 100%)", color: "white" }}>
            <Typography variant="h3">{turnout}%</Typography>
            <Typography variant="body2">Participation</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)", color: "white" }}>
            <Typography variant="body2">Positions</Typography>
            <Typography variant="h4">{positions.length}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)", color: "white" }}>
            <EmojiEvents sx={{ fontSize: 32 }} />
            <Typography variant="body2">Unique Voters</Typography>
            <Typography variant="h4">{uniqueVoters}</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Results Table */}
      {positions.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#F8F9FA" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Position</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Winner</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Votes</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>%</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {positions.map((pos) => {
                const winner = pos.candidates.reduce((p, c) => (p.vote_count || 0) > (c.vote_count || 0) ? p : c);
                const pct = pos.totalVotes > 0 ? ((winner.vote_count / pos.totalVotes) * 100).toFixed(1) : 0;
                return (
                  <TableRow key={pos.positionId}>
                    <TableCell sx={{ fontWeight: 600 }}>{pos.positionName}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#22C55E" }}>{winner.name}</TableCell>
                    <TableCell>{winner.vote_count}</TableCell>
                    <TableCell>{pct}%</TableCell>
                    <TableCell>{pos.totalVotes}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ViewResults;

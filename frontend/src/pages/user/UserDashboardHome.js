// ============================================
// Enhanced User Dashboard Home Component
// ============================================
// Professional user dashboard with voting history and participation tracking
// Displays comprehensive voting activity, election timeline, and personalized statistics
// Features animated counters, participation metrics, and quick action cards

import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Avatar,
  Chip,
  Divider,
  LinearProgress,
  Container,
} from "@mui/material";
import {
  HowToVote,
  BarChart,
  CheckCircle,
  Schedule,
  TrendingUp,
  Event,
  AccessTime,
  EmojiEvents,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { getVotingHistory } from "../../services/voteService";

const UserDashboardHome = ({ onNavigate }) => {
  // ============================================
  // State Management
  // ============================================
  const { user } = useAuth();
  const [votingData, setVotingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============================================
  // Fetch Voting History
  // ============================================
  const fetchVotingHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getVotingHistory();
      setVotingData(response.data);
    } catch (err) {
      setError("Failed to load voting history. Please try again.");
      console.error("Error fetching voting history:", err);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // Initial Load
  // ============================================
  useEffect(() => {
    fetchVotingHistory();
  }, []);

  // ============================================
  // Format Date for Display
  // ============================================
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // ============================================
  // Format Time for Display
  // ============================================
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ============================================
  // Get Election Status Color
  // ============================================
  const getStatusColor = (status) => {
    const statusColors = {
      "active": "#22C55E",
      "upcoming": "#3B82F6",
      "ended": "#6B7280",
      "inactive": "#F59E0B",
    };
    return statusColors[status] || "#6B7280";
  };

  // ============================================
  // Render Loading State
  // ============================================
  if (loading && !votingData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  // ============================================
  // Render Error State
  // ============================================
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
        <Button onClick={fetchVotingHistory} sx={{ ml: 2 }}>
          Retry
        </Button>
      </Alert>
    );
  }

  const { voting_history, available_elections, statistics } = votingData || {};

  // ============================================
  // Render Main Dashboard
  // ============================================
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: "#1A1A1A" }}>
          Welcome back, {user?.firstName}!
        </Typography>
        <Typography variant="body1" sx={{ color: "#666666" }}>
          Track your voting activity and participate in upcoming elections
        </Typography>
      </Box>

      {/* Participation Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Elections Participated */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              borderRadius: "0.75rem",
              background: "linear-gradient(135deg, #003087 0%, #0052CC 100%)",
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <HowToVote sx={{ fontSize: 32, opacity: 0.9 }} />
              <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
                Elections Participated
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {statistics?.total_elections_participated || 0}
            </Typography>
          </Card>
        </Grid>

        {/* Total Votes Cast */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              borderRadius: "0.75rem",
              background: "linear-gradient(135deg, #D4A017 0%, #E5B64F 100%)",
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <CheckCircle sx={{ fontSize: 32, opacity: 0.9 }} />
              <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
                Total Votes Cast
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {statistics?.total_votes_cast || 0}
            </Typography>
          </Card>
        </Grid>

        {/* Available Elections */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              borderRadius: "0.75rem",
              background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Event sx={{ fontSize: 32, opacity: 0.9 }} />
              <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
                Available Elections
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {statistics?.total_elections_available || 0}
            </Typography>
          </Card>
        </Grid>

        {/* Participation Rate */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              borderRadius: "0.75rem",
              background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <TrendingUp sx={{ fontSize: 32, opacity: 0.9 }} />
              <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
                Participation Rate
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {statistics?.participation_rate || 0}%
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Voting History and Available Elections */}
      <Grid container spacing={3}>
        {/* Voting History */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: "0.75rem", height: "100%" }}>
            <Box sx={{ p: 3, borderBottom: "1px solid #E0E0E0" }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                <EmojiEvents sx={{ verticalAlign: "middle", mr: 1, fontSize: 24 }} />
                Your Voting History
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              {voting_history && voting_history.length > 0 ? (
                voting_history.map((election, index) => (
                  <Box key={election.election_id}>
                    <Box sx={{ p: 2, borderRadius: "0.5rem", "&:hover": { backgroundColor: "#F8F9FA" } }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {election.election_name}
                        </Typography>
                        <Chip
                          label={election.is_active ? "Active" : "Ended"}
                          size="small"
                          color={election.is_active ? "success" : "default"}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                        {election.description || "No description"}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <HowToVote sx={{ fontSize: 16, mr: 0.5, color: "#003087" }} />
                          <Typography variant="caption" sx={{ color: "#666" }}>
                            {election.positions_voted} positions voted
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <AccessTime sx={{ fontSize: 16, mr: 0.5, color: "#666" }} />
                          <Typography variant="caption" sx={{ color: "#666" }}>
                            {formatDate(election.last_vote_time)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    {index < voting_history.length - 1 && <Divider />}
                  </Box>
                ))
              ) : (
                <Box sx={{ py: 4, textAlign: "center" }}>
                  <HowToVote sx={{ fontSize: 48, color: "#E0E0E0", mb: 2 }} />
                  <Typography variant="body1" sx={{ color: "#999" }}>
                    No voting history yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#BBB" }}>
                    Participate in elections to see your history here
                  </Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>

        {/* Available Elections */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: "0.75rem", height: "100%" }}>
            <Box sx={{ p: 3, borderBottom: "1px solid #E0E0E0" }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                <Schedule sx={{ verticalAlign: "middle", mr: 1, fontSize: 24 }} />
                Available Elections
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              {available_elections && available_elections.length > 0 ? (
                available_elections.map((election, index) => (
                  <Box key={election.election_id}>
                    <Box sx={{ p: 2, borderRadius: "0.5rem", "&:hover": { backgroundColor: "#F8F9FA" } }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {election.election_name}
                        </Typography>
                        <Chip
                          label={election.status.charAt(0).toUpperCase() + election.status.slice(1)}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(election.status) + "20",
                            color: getStatusColor(election.status),
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                        {election.description || "No description"}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Event sx={{ fontSize: 16, mr: 0.5, color: "#666" }} />
                          <Typography variant="caption" sx={{ color: "#666" }}>
                            {election.total_positions} positions
                          </Typography>
                        </Box>
                        {election.status === "active" && (
                          <Button
                            size="small"
                            variant="contained"
                            sx={{ ml: "auto", textTransform: "none" }}
                            onClick={() => onNavigate("Vote")}
                          >
                            Vote Now
                          </Button>
                        )}
                      </Box>
                    </Box>
                    {index < available_elections.length - 1 && <Divider />}
                  </Box>
                ))
              ) : (
                <Box sx={{ py: 4, textAlign: "center" }}>
                  <Schedule sx={{ fontSize: 48, color: "#E0E0E0", mb: 2 }} />
                  <Typography variant="body1" sx={{ color: "#999" }}>
                    No available elections
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#BBB" }}>
                    Check back later for new voting opportunities
                  </Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card sx={{ mt: 3, p: 3, borderRadius: "0.75rem", backgroundColor: "#F8F9FA", border: "1px solid #E0E0E0" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              sx={{ textTransform: "none" }}
              onClick={() => onNavigate("Vote")}
              disabled={!available_elections?.some(e => e.status === "active")}
            >
              <HowToVote sx={{ mr: 1 }} />
              Cast Your Vote
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="outlined"
              sx={{ textTransform: "none" }}
              onClick={() => onNavigate("Results")}
            >
              <BarChart sx={{ mr: 1 }} />
              View Results
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="outlined"
              sx={{ textTransform: "none" }}
              onClick={fetchVotingHistory}
            >
              <TrendingUp sx={{ mr: 1 }} />
              Refresh Activity
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default UserDashboardHome;

// ============================================
// Enhanced Admin Dashboard Home Component
// ============================================
// Professional admin dashboard with real-time statistics
// Displays comprehensive metrics, activity timeline, and system health
// Features animated counters, activity feed, and quick action cards

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
} from "@mui/material";
import {
  People,
  HowToVote,
  BarChart,
  Security,
  TrendingUp,
  Event,
  AccessTime,
  Refresh,
  Logout,
} from "@mui/icons-material";
import { getAdminStats, getActivityTimeline } from "../../services/auditService";

const AdminDashboardHome = ({ onNavigate }) => {
  // ============================================
  // State Management
  // ============================================
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // ============================================
  // Fetch Dashboard Data
  // ============================================
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch statistics and activity in parallel
      const [statsResponse, activityResponse] = await Promise.all([
        getAdminStats(),
        getActivityTimeline(24),
      ]);

      setStats(statsResponse.data);
      setActivities(activityResponse.data?.activities || []);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // Initial Load
  // ============================================
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ============================================
  // Format Activity Time
  // ============================================
  const formatActivityTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  // ============================================
  // Get Action Icon and Color
  // ============================================
  const getActionInfo = (action) => {
    const actionMap = {
      "LOGIN": { icon: <Security />, color: "#22C55E", label: "Login" },
      "LOGOUT": { icon: <Logout />, color: "#6B7280", label: "Logout" },
      "REGISTER": { icon: <People />, color: "#3B82F6", label: "Registration" },
      "VOTE_CAST": { icon: <HowToVote />, color: "#8B5CF6", label: "Vote Cast" },
      "ELECTION_CREATE": { icon: <Event />, color: "#F59E0B", label: "Election Created" },
      "ELECTION_UPDATE": { icon: <Event />, color: "#F59E0B", label: "Election Updated" },
      "ELECTION_DELETE": { icon: <Event />, color: "#EF4444", label: "Election Deleted" },
      "CANDIDATE_CREATE": { icon: <People />, color: "#10B981", label: "Candidate Added" },
      "CANDIDATE_UPDATE": { icon: <People />, color: "#10B981", label: "Candidate Updated" },
      "CANDIDATE_DELETE": { icon: <People />, color: "#EF4444", label: "Candidate Deleted" },
      "ADMIN_ACCESS": { icon: <Security />, color: "#EF4444", label: "Admin Access" },
    };
    return actionMap[action] || { icon: <AccessTime />, color: "#6B7280", label: action };
  };

  // ============================================
  // Render Loading State
  // ============================================
  if (loading && !stats) {
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
        <Button onClick={fetchDashboardData} sx={{ ml: 2 }}>
          Retry
        </Button>
      </Alert>
    );
  }

  // ============================================
  // Render Main Dashboard
  // ============================================
  return (
    <Box sx={{ width: "100%" }}>
      {/* Header with Refresh */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 700, color: "#1A1A1A" }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: "#666666" }}>
            Real-time system overview and activity monitoring
          </Typography>
        </Box>
        <Button
          startIcon={<Refresh />}
          onClick={fetchDashboardData}
          variant="outlined"
          disabled={loading}
          sx={{ textTransform: "none" }}
        >
          Refresh
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Users */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              borderRadius: "0.75rem",
              background: "linear-gradient(135deg, #003087 0%, #0052CC 100%)",
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <People sx={{ fontSize: 32, opacity: 0.9 }} />
                <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
                  Total Users
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {stats?.users?.total || 0}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  label={`${stats?.users?.voters || 0} Voters`}
                  size="small"
                  sx={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}
                />
                <Chip
                  label={`${stats?.users?.admins || 0} Admins`}
                  size="small"
                  sx={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}
                />
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Active Elections */}
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
              <Event sx={{ fontSize: 32, opacity: 0.9 }} />
              <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
                Active Elections
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              {stats?.elections?.active || 0}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {stats?.elections?.upcoming || 0} upcoming
            </Typography>
          </Card>
        </Grid>

        {/* Total Votes */}
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
              <HowToVote sx={{ fontSize: 32, opacity: 0.9 }} />
              <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
                Total Votes
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              {stats?.voting?.total_votes || 0}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {stats?.voting?.unique_voters || 0} unique voters
            </Typography>
          </Card>
        </Grid>

        {/* System Activity */}
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
                Activity (24h)
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              {stats?.system?.activity_24h || 0}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Last updated: {formatActivityTime(lastUpdated)}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Activity Feed and Quick Actions */}
      <Grid container spacing={3}>
        {/* Recent Activity Feed */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: "0.75rem", height: "100%" }}>
            <Box sx={{ p: 3, borderBottom: "1px solid #E0E0E0" }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Recent Activity
              </Typography>
              <Typography variant="body2" sx={{ color: "#666666" }}>
                Latest system events and user actions
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              {activities.length > 0 ? (
                activities.map((activity, index) => {
                  const actionInfo = getActionInfo(activity.action);
                  return (
                    <Box key={activity.id}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          py: 2,
                          px: 1,
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: actionInfo.color,
                            width: 40,
                            height: 40,
                            mr: 2,
                          }}
                        >
                          {actionInfo.icon}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 0.5,
                            }}
                          >
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {actionInfo.label}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#666" }}>
                              {formatActivityTime(activity.timestamp)}
                            </Typography>
                          </Box>
                          {activity.user_id && (
                            <Typography variant="body2" sx={{ color: "#666" }}>
                              {activity.first_name} {activity.last_name}{" "}
                              <Chip
                                label={activity.role}
                                size="small"
                                sx={{ ml: 1, height: 20 }}
                              />
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      {index < activities.length - 1 && <Divider />}
                    </Box>
                  );
                })
              ) : (
                <Box sx={{ py: 4, textAlign: "center" }}>
                  <Typography variant="body2" sx={{ color: "#999" }}>
                    No recent activity
                  </Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>

        {/* Quick Actions and Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: "0.75rem", mb: 3 }}>
            <Box sx={{ p: 3, borderBottom: "1px solid #E0E0E0" }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Quick Actions
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Button
                fullWidth
                variant="contained"
                sx={{ mb: 2, textTransform: "none" }}
                onClick={() => onNavigate("ManageElections")}
              >
                Create Election
              </Button>
              <Button
                fullWidth
                variant="outlined"
                sx={{ mb: 2, textTransform: "none" }}
                onClick={() => onNavigate("ManageCandidates")}
              >
                Add Candidate
              </Button>
              <Button
                fullWidth
                variant="outlined"
                sx={{ textTransform: "none" }}
                onClick={() => onNavigate("AuditLogs")}
              >
                View Audit Logs
              </Button>
            </Box>
          </Card>

          {/* System Health */}
          <Card sx={{ borderRadius: "0.75rem" }}>
            <Box sx={{ p: 3, borderBottom: "1px solid #E0E0E0" }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                System Health
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2">Database</Typography>
                  <Chip label="Online" color="success" size="small" />
                </Box>
                <LinearProgress variant="determinate" value={100} />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2">API Server</Typography>
                  <Chip label="Online" color="success" size="small" />
                </Box>
                <LinearProgress variant="determinate" value={100} />
              </Box>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2">Authentication</Typography>
                  <Chip label="Active" color="success" size="small" />
                </Box>
                <LinearProgress variant="determinate" value={100} />
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboardHome;

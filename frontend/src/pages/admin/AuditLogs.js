// ============================================
// Audit Logs Viewer Component
// ============================================
// Admin interface for viewing and filtering audit logs
// Displays system activity, admin actions, and security events
// Supports filtering by action type, user, date range, and pagination

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Grid,
  Pagination,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Security,
  Person,
  AccessTime,
  Refresh,
  FilterList,
} from "@mui/icons-material";
import { getAuditLogs } from "../../services/auditService";

const AuditLogs = () => {
  // ============================================
  // State Management
  // ============================================
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [filters, setFilters] = useState({
    action: "",
    start_date: "",
    end_date: "",
  });

  const logsPerPage = 25;

  // ============================================
  // Fetch Audit Logs
  // ============================================
  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching audit logs with filters:", filters);

      const offset = (page - 1) * logsPerPage;
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== "")
      );

      console.log("Active filters:", activeFilters);
      console.log("Pagination:", { limit: logsPerPage, offset });

      const response = await getAuditLogs(activeFilters, logsPerPage, offset);

      console.log("Audit logs response:", response);

      setLogs(response.data || []);
      setTotalLogs(response.pagination?.total || 0);
    } catch (err) {
      console.error("Error fetching audit logs:", err);
      setError(`Failed to load audit logs: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // Initial Load and Refresh on Filter/Page Change
  // ============================================
  useEffect(() => {
    fetchLogs();
  }, [page, filters]);

  // ============================================
  // Handle Filter Changes
  // ============================================
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1); // Reset to first page when filters change
  };

  // ============================================
  // Handle Page Change
  // ============================================
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // ============================================
  // Get Action Color for Visual Categorization
  // ============================================
  const getActionColor = (action) => {
    const actionColors = {
      "LOGIN": "success",
      "LOGOUT": "default",
      "REGISTER": "info",
      "VOTE_CAST": "primary",
      "ELECTION_CREATE": "warning",
      "ELECTION_UPDATE": "warning",
      "ELECTION_DELETE": "error",
      "CANDIDATE_CREATE": "secondary",
      "CANDIDATE_UPDATE": "secondary",
      "CANDIDATE_DELETE": "error",
      "ADMIN_ACCESS": "error",
    };
    return actionColors[action] || "default";
  };

  // ============================================
  // Format Timestamp for Display
  // ============================================
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // ============================================
  // Calculate Pagination
  // ============================================
  const totalPages = Math.ceil(totalLogs / logsPerPage);

  // ============================================
  // Render Loading State
  // ============================================
  if (loading && logs.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading audit logs...</Typography>
      </Container>
    );
  }

  // ============================================
  // Render Error State
  // ============================================
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  // ============================================
  // Render Main Component
  // ============================================
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          <Security sx={{ verticalAlign: "middle", mr: 1, fontSize: 32 }} />
          Audit Logs
        </Typography>
        <Typography variant="body1" sx={{ color: "#666666" }}>
          Monitor system activity, admin actions, and security events
        </Typography>
      </Box>

      {/* Filters Section */}
      <Card sx={{ p: 3, mb: 3, borderRadius: "0.75rem" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <FilterList sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Filters
          </Typography>
          <Button
            startIcon={<Refresh />}
            onClick={fetchLogs}
            sx={{ ml: "auto" }}
            variant="outlined"
            size="small"
          >
            Refresh
          </Button>
        </Box>

        <Grid container spacing={2}>
          {/* Action Filter */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Action Type</InputLabel>
              <Select
                value={filters.action}
                onChange={(e) => handleFilterChange("action", e.target.value)}
                label="Action Type"
              >
                <MenuItem value="">All Actions</MenuItem>
                <MenuItem value="LOGIN">Login</MenuItem>
                <MenuItem value="LOGOUT">Logout</MenuItem>
                <MenuItem value="REGISTER">Registration</MenuItem>
                <MenuItem value="VOTE_CAST">Vote Cast</MenuItem>
                <MenuItem value="ELECTION_CREATE">Election Created</MenuItem>
                <MenuItem value="ELECTION_UPDATE">Election Updated</MenuItem>
                <MenuItem value="ELECTION_DELETE">Election Deleted</MenuItem>
                <MenuItem value="CANDIDATE_CREATE">Candidate Created</MenuItem>
                <MenuItem value="CANDIDATE_UPDATE">Candidate Updated</MenuItem>
                <MenuItem value="CANDIDATE_DELETE">Candidate Deleted</MenuItem>
                <MenuItem value="ADMIN_ACCESS">Admin Access</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Start Date Filter */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              type="datetime-local"
              label="Start Date"
              value={filters.start_date}
              onChange={(e) => handleFilterChange("start_date", e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* End Date Filter */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              type="datetime-local"
              label="End Date"
              value={filters.end_date}
              onChange={(e) => handleFilterChange("end_date", e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Card>

      {/* Logs Table */}
      <Card sx={{ borderRadius: "0.75rem" }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#F8F9FA" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Timestamp</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>IP Address</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AccessTime
                          sx={{ fontSize: 16, mr: 1, color: "#666" }}
                        />
                        {formatTimestamp(log.timestamp)}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.action}
                        color={getActionColor(log.action)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      {log.user_id ? (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Person sx={{ fontSize: 16, mr: 1, color: "#666" }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {log.first_name} {log.last_name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#666" }}>
                              {log.reg_number}
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{ color: "#999" }}>
                          System
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.role || "N/A"}
                        size="small"
                        variant="outlined"
                        color={log.role === "admin" ? "error" : "default"}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                        {log.ip_address || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {log.details ? (
                        <Tooltip
                          title={
                            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          }
                          arrow
                        >
                          <IconButton size="small">
                            <Typography variant="body2" sx={{ color: "#003087" }}>
                              View Details
                            </Typography>
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Typography variant="body2" sx={{ color: "#999" }}>
                          N/A
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" sx={{ color: "#666" }}>
                      No audit logs found matching your filters
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Card>

      {/* Statistics Summary */}
      <Card
        sx={{
          mt: 3,
          p: 3,
          borderRadius: "0.75rem",
          backgroundColor: "#F8F9FA",
          border: "1px solid #E0E0E0",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Log Statistics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Typography variant="body2" sx={{ color: "#666" }}>
              Total Entries
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#003087" }}>
              {totalLogs}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="body2" sx={{ color: "#666" }}>
              Current Page
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#D4A017" }}>
              {page} / {totalPages}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="body2" sx={{ color: "#666" }}>
              Per Page
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#22C55E" }}>
              {logsPerPage}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="body2" sx={{ color: "#666" }}>
              Filtered Results
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#3B82F6" }}>
              {logs.length}
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default AuditLogs;

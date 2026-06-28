// ============================================
// Audit Service
// ============================================
// Service layer for audit log operations
// Handles fetching and filtering audit logs for admin review

import { apiGet } from "./api";

/**
 * Fetch audit logs with optional filtering
 * @param {Object} filters - Filter parameters (action, user_id, start_date, end_date)
 * @param {number} limit - Number of logs to return (default: 50)
 * @param {number} offset - Pagination offset (default: 0)
 * @returns {Promise<Object>} Audit logs with pagination metadata
 */
export const getAuditLogs = async (filters = {}, limit = 50, offset = 0) => {
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
    ...filters,
  });

  return apiGet(`/api/admin/audit-logs.php?${queryParams.toString()}`);
};

/**
 * Fetch admin dashboard statistics
 * @returns {Promise<Object>} Dashboard statistics including user counts, election stats, etc.
 */
export const getAdminStats = async () => {
  return apiGet("/api/admin/stats.php");
};

/**
 * Fetch system activity timeline
 * @param {number} hours - Number of hours to look back (default: 24)
 * @returns {Promise<Object>} Recent system activities
 */
export const getActivityTimeline = async (hours = 24) => {
  return apiGet(`/api/admin/activity.php?hours=${hours}`);
};

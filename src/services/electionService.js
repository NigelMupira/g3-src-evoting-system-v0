// ============================================
// Election Service
// ============================================
// API calls related to elections and voting positions
// Handles fetching, creating, updating, and deleting elections

import { apiGet, apiPost, apiPut, apiDelete } from "./api";

/**
 * Fetches all active elections
 * Called when voter navigates to voting page
 * Only returns elections that are currently open for voting
 */
export const getActiveElections = async () => {
  return apiGet("/api/elections/list.php?status=active");
};

/**
 * Fetches all elections (admin only)
 * Returns all elections regardless of status
 * Used in admin dashboard for election management
 */
export const getAllElections = async () => {
  return apiGet("/api/elections/list.php");
};

/**
 * Fetches a single election by ID
 * Returns detailed election information including positions
 */
export const getElectionById = async (electionId) => {
  return apiGet(`/api/elections/get.php?id=${electionId}`);
};

/**
 * Creates a new election (admin only)
 * Requires admin role and election details
 */
export const createElection = async (electionData) => {
  return apiPost("/api/elections/create.php", {
    name: electionData.name,
    startDate: electionData.startDate,
    endDate: electionData.endDate,
  });
};

/**
 * Updates an existing election (admin only)
 * Only admin who created it or super-admin can update
 */
export const updateElection = async (electionId, electionData) => {
  return apiPut(`/api/elections/update.php?id=${electionId}`, electionData);
};

/**
 * Deletes an election (admin only)
 * Can only delete elections with no votes submitted
 */
export const deleteElection = async (electionId) => {
  return apiDelete(`/api/elections/delete.php?id=${electionId}`);
};

/**
 * Marks an election as active for voting
 * Admin can activate elections on demand
 */
export const activateElection = async (electionId) => {
  return apiPut(`/api/elections/activate.php?id=${electionId}`, {});
};

/**
 * Closes an election, preventing further votes
 * Admin can close elections before scheduled end time
 */
export const closeElection = async (electionId) => {
  return apiPut(`/api/elections/close.php?id=${electionId}`, {});
};

// ============================================
// Admin Service
// ============================================
// API calls for admin-specific operations
// Handles management of candidates, positions, and system operations

import { apiGet, apiPost, apiPut, apiDelete } from "./api";

/**
 * Fetches all candidates (with optional filters)
 * Admin can filter by election or position
 */
export const getAllCandidates = async (electionId = null) => {
  const query = electionId ? `?electionId=${electionId}` : "";
  return apiGet(`/api/candidates/list.php${query}`);
};

/**
 * Creates a new candidate
 * Admin provides candidate details and assigns to position
 * Requires election ID and position ID
 */
export const createCandidate = async (candidateData) => {
  return apiPost("/api/candidates/create.php", {
    electionId: candidateData.electionId,
    positionId: candidateData.positionId,
    name: candidateData.name,
    bio: candidateData.bio,
    manifesto: candidateData.manifesto,
    photoUrl: candidateData.photoUrl,
    videoUrl: candidateData.videoUrl,
  });
};

/**
 * Updates candidate information
 * Admin can edit any candidate details except votes
 */
export const updateCandidate = async (candidateId, candidateData) => {
  return apiPut(`/api/candidates/update.php?id=${candidateId}`, candidateData);
};

/**
 * Deletes a candidate from an election
 * Can only delete if no votes have been cast
 */
export const deleteCandidate = async (candidateId) => {
  return apiDelete(`/api/candidates/delete.php?id=${candidateId}`);
};

/**
 * Gets audit log of all system activities
 * Tracks admin actions, vote submissions, election changes
 */
export const getAuditLog = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  return apiGet(`/api/audit/log.php?${query}`);
};

/**
 * Gets system statistics and monitoring data
 * Shows voting participation, election status, etc.
 */
export const getSystemStats = async () => {
  return apiGet("/api/admin/stats.php");
};

/**
 * Gets detailed election report with all information
 * Useful for exporting election data
 */
export const getElectionReport = async (electionId) => {
  return apiGet(`/api/elections/report.php?id=${electionId}`);
};

/**
 * Exports election results as CSV or PDF
 * Admin feature for downloading results
 */
export const exportElectionResults = async (electionId, format = "csv") => {
  return apiGet(`/api/elections/export.php?id=${electionId}&format=${format}`);
};

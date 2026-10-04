// ============================================
// Admin Service
// ============================================
// API calls for admin-specific operations
// Handles election/candidate management (requires admin role)

import { apiGet, apiPost, apiPut, apiDelete } from "./api";

// ============================================
// Positions Management
// ============================================

// Get all positions for an election
export const getPositions = async (electionId) => {
  return apiGet(`/api/positions/list.php?election_id=${electionId}`);
};

// ============================================
// Candidate Management
// ============================================

// Get all candidates for an election
export const getCandidates = async (electionId) => {
  return apiGet(`/api/candidates/list.php?election_id=${electionId}`);
};

// Create new candidate (admin only)
export const createCandidate = async (candidateData) => {
  return apiPost("/api/candidates/create.php", {
    electionId: candidateData.electionId,
    positionId: candidateData.positionId,
    name: candidateData.name,
    bio: candidateData.bio || null,
    manifesto: candidateData.manifesto || null,
    photoUrl: candidateData.photoUrl || null,
    videoUrl: candidateData.videoUrl || null,
  });
};

// Update candidate information (admin only)
export const updateCandidate = async (candidateId, candidateData) => {
  return apiPut(`/api/candidates/update.php?id=${candidateId}`, {
    name: candidateData.name,
    bio: candidateData.bio || null,
    manifesto: candidateData.manifesto || null,
    photoUrl: candidateData.photoUrl || null,
    videoUrl: candidateData.videoUrl || null,
  });
};

// Delete candidate (admin only)
export const deleteCandidate = async (candidateId) => {
  return apiDelete(`/api/candidates/delete.php?id=${candidateId}`);
};

// ============================================
// Results & Reporting
// ============================================

// Get election results with statistics
export const getElectionResults = async (electionId) => {
  return apiGet(`/api/votes/results.php?election_id=${electionId}`);
};

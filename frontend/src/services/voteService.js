// ============================================
// Vote Service
// ============================================
// API calls for voting and election results
// Handles vote submission, validation, and result retrieval

import { apiGet, apiPost } from "./api";

// ============================================
// Submit Vote
// ============================================
// Cast vote in election for a specific position/candidate
// Requires authentication, prevents double voting per position
export const submitVote = async (electionId, positionId, candidateId) => {
  return apiPost("/api/votes/submit.php", {
    electionId,
    positionId,
    candidateId,
  });
};

// ============================================
// Validate Voter
// ============================================
// Check if user can vote in a specific position
// Validates election is active and user hasn't voted yet
export const validateVoter = async (electionId, positionId) => {
  return apiGet(`/api/votes/validate.php?election_id=${electionId}&position_id=${positionId}`);
};

// ============================================
// Get Election Results
// ============================================
// Fetch vote counts by candidate for an election
// Can optionally filter by specific position
export const getElectionResults = async (electionId, positionId = null) => {
  let url = `/api/votes/results.php?election_id=${electionId}`;
  if (positionId) {
    url += `&position_id=${positionId}`;
  }
  return apiGet(url);
};

// ============================================
// Get Candidates for Election
// ============================================
// Fetch all candidates for an election grouped by position
export const getCandidates = async (electionId) => {
  return apiGet(`/api/candidates/list.php?election_id=${electionId}`);
};

// ============================================
// Get User Voting History
// ============================================
// Fetch user's voting history and participation statistics
// Returns elections participated in, votes cast, and available elections
export const getVotingHistory = async () => {
  return apiGet("/api/votes/history.php");
};

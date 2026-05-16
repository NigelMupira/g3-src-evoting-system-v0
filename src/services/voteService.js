// ============================================
// Vote Service
// ============================================
// API calls related to voting and election results
// Handles vote submission and result retrieval

import { apiGet, apiPost } from "./api";

/**
 * Submits a voter's votes for an election
 * Votes are anonymous - voter ID is not stored with vote
 * Backend prevents double voting per election
 */
export const submitVotes = async (votes) => {
  return apiPost("/api/votes/submit.php", {
    votes: votes, // Array of { position_id, candidate_id }
    electionId: votes.electionId,
  });
};

/**
 * Checks if user has already voted in an election
 * Used to prevent double voting
 */
export const hasUserVoted = async (electionId) => {
  return apiGet(`/api/votes/check.php?electionId=${electionId}`);
};

/**
 * Fetches real-time results for an election
 * Shows vote counts per candidate
 * Admin can view at any time, voters only after election ends
 */
export const getElectionResults = async (electionId) => {
  return apiGet(`/api/votes/results.php?electionId=${electionId}`);
};

/**
 * Fetches aggregated results for all positions in an election
 * Used for results dashboard visualization
 */
export const getAggregatedResults = async (electionId) => {
  return apiGet(`/api/votes/aggregated.php?electionId=${electionId}`);
};

/**
 * Fetches candidates for a specific election position
 * Shows all candidates and their details (bio, manifesto, photo, video)
 */
export const getCandidatesForPosition = async (electionId, positionId) => {
  return apiGet(
    `/api/candidates/list.php?electionId=${electionId}&positionId=${positionId}`
  );
};

/**
 * Fetches a single candidate's details
 * Includes bio, manifesto, photo, and video information
 */
export const getCandidateDetails = async (candidateId) => {
  return apiGet(`/api/candidates/get.php?id=${candidateId}`);
};

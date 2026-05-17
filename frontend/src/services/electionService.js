// ============================================
// Election Service
// ============================================
// API calls for election management
// Handles fetching, creating, updating, and deleting elections

import { apiGet, apiPost, apiPut, apiDelete } from "./api";

// ============================================
// Get Active Elections
// ============================================
// Fetch all elections that are currently active/open for voting
export const getActiveElections = async () => {
  return apiGet("/api/elections/list.php?active=true");
};

// ============================================
// Get All Elections
// ============================================
// Fetch all elections (admin only)
// Includes inactive elections for management
export const getAllElections = async () => {
  return apiGet("/api/elections/list.php");
};

// ============================================
// Get Election Details
// ============================================
// Fetch specific election with all details
export const getElectionById = async (electionId) => {
  return apiGet(`/api/elections/get.php?id=${electionId}`);
};

// ============================================
// Create Election
// ============================================
// Create new election (admin only)
// Requires name, dates, and optional description
export const createElection = async (electionData) => {
  return apiPost("/api/elections/create.php", {
    name: electionData.name,
    description: electionData.description || null,
    startDate: electionData.startDate,
    endDate: electionData.endDate,
  });
};

// ============================================
// Update Election
// ============================================
// Update election details (admin only)
export const updateElection = async (electionId, electionData) => {
  return apiPut(`/api/elections/update.php?id=${electionId}`, {
    name: electionData.name,
    description: electionData.description || null,
    startDate: electionData.startDate,
    endDate: electionData.endDate,
  });
};

// ============================================
// Delete Election
// ============================================
// Delete election and all associated data (admin only)
export const deleteElection = async (electionId) => {
  return apiDelete(`/api/elections/delete.php?id=${electionId}`);
};

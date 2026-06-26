// ============================================
// API Client / HTTP Service
// ============================================
// Centralized HTTP client used by all service files (authService, electionService, etc.)
// All API calls in the app must go through these helpers — never use fetch() directly elsewhere.
// Uses the native Fetch API. Can be upgraded to axios in the future if needed.

/**
 * Base API URL — where the PHP backend is running.
 *
 * Priority order for environment variable:
 *   1. VITE_API_URL  (Vite build system — used after migrating from Create React App)
 *   2. REACT_APP_API_URL (legacy CRA env variable — kept for backwards compatibility)
 *   3. http://localhost:8000 (hardcoded fallback for local development)
 *
 * For production on Vercel, set VITE_API_URL to your Railway backend URL.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || "http://localhost:8000";

/**
 * Constructs full URL for API endpoints
 */
const getFullUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

/**
 * Gets authorization headers with JWT token
 * Token is retrieved from localStorage (stored by AuthContext)
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Makes a GET request
 * Used for fetching data (elections, candidates, results, etc.)
 */
export const apiGet = async (endpoint) => {
  try {
    const response = await fetch(getFullUrl(endpoint), {
      method: "GET",
      headers: getAuthHeaders(),
    });

    // If token expired (401), logout user
    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  } catch (error) {
    console.error("GET request error:", error);
    throw error;
  }
};

/**
 * Makes a POST request
 * Used for creating data (registration, login, voting, etc.)
 */
export const apiPost = async (endpoint, body) => {
  try {
    const response = await fetch(getFullUrl(endpoint), {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });

    // If token expired (401), logout user
    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  } catch (error) {
    console.error("POST request error:", error);
    throw error;
  }
};

/**
 * Makes a PUT request
 * Used for updating data (edit elections, candidates, etc.)
 */
export const apiPut = async (endpoint, body) => {
  try {
    const response = await fetch(getFullUrl(endpoint), {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });

    // If token expired (401), logout user
    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  } catch (error) {
    console.error("PUT request error:", error);
    throw error;
  }
};

/**
 * Makes a DELETE request
 * Used for deleting data (remove elections, candidates, etc.)
 */
export const apiDelete = async (endpoint) => {
  try {
    const response = await fetch(getFullUrl(endpoint), {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    // If token expired (401), logout user
    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  } catch (error) {
    console.error("DELETE request error:", error);
    throw error;
  }
};

// ============================================
// Helper Functions
// ============================================
// Reusable utility functions used across the application
// Handles common operations like formatting, parsing, etc.

/**
 * Formats a date to a readable string format
 * Example: 2025-03-15 -> March 15, 2025
 */
export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * Formats a date to a readable time format
 * Example: 2025-03-15T14:30:00 -> 2:30 PM
 */
export const formatTime = (dateString) => {
  const options = { hour: "2-digit", minute: "2-digit", hour12: true };
  return new Date(dateString).toLocaleTimeString(undefined, options);
};

/**
 * Formats a date-time to a readable format
 * Example: 2025-03-15T14:30:00 -> March 15, 2025 at 2:30 PM
 */
export const formatDateTime = (dateString) => {
  return `${formatDate(dateString)} at ${formatTime(dateString)}`;
};

/**
 * Capitalizes the first letter of a string
 * Example: "hello" -> "Hello"
 */
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Checks if the current election/date is within active period
 * Returns true if current time is between start and end dates
 */
export const isWithinDateRange = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  return now >= start && now <= end;
};

/**
 * Gets the remaining time until a deadline in human-readable format
 * Example: "2 days, 3 hours remaining"
 */
export const getRemainingTime = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end - now;

  if (diff <= 0) return "Voting has ended";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  const parts = [];
  if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);

  return parts.join(", ") + " remaining";
};

/**
 * Safely parses JSON data with fallback
 * Returns parsed object or empty object on error
 */
export const safeJsonParse = (jsonString, fallback = {}) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("JSON parse error:", error);
    return fallback;
  }
};

/**
 * Removes spaces from a string
 * Used for cleaning input like registration numbers
 */
export const removeSpaces = (str) => {
  return str.replace(/\s/g, "");
};

/**
 * Truncates a string to a specified length with ellipsis
 * Example: truncateString("Hello World", 5) -> "Hello..."
 */
export const truncateString = (str, length = 50) => {
  if (!str) return "";
  return str.length > length ? str.substring(0, length) + "..." : str;
};

/**
 * Converts vote count to percentage
 * Example: getPercentage(25, 100) -> 25%
 */
export const getPercentage = (count, total) => {
  if (total === 0) return 0;
  return Math.round((count / total) * 100);
};

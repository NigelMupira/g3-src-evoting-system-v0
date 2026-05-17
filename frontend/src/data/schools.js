// ============================================
// Schools and Course Data
// ============================================
// Static data for schools and their associated courses
// This is centralized for easy updates when schools/courses change

export const SCHOOLS = ["Engineering", "Business", "Arts"];

// Each school has an array of course codes available to students
export const COURSES = {
  Engineering: ["ENG101", "ENG102", "ENG103"],
  Business: ["BUS201", "BUS202", "BUS203"],
  Arts: ["ART301", "ART302", "ART303"],
};

/**
 * Gets courses for a specific school
 * Returns empty array if school not found
 */
export const getCoursesForSchool = (school) => {
  return COURSES[school] || [];
};

// ============================================
// Schools and Course Data
// ============================================
// Static data for schools and their associated courses
// This is centralized for easy updates when schools/courses change

export const SCHOOLS = ["Engineering & Technology", "Industrial Sciences & Technology", "Allied Health Sciences", "Business & Management Sciences", "Information Science & Technology"];

// Each school has an array of course codes available to students
export const COURSES = {
  "Engineering & Technology": ["HEBE", "HECP", "HEEE", "HEIM", "HEPT", "HEMT"],
  "Industrial Sciences & Technology": ["HSFP", "HSBT"],
  "Allied Health Sciences": ["HSPT", "HADR", "HATR"],
  "Business & Management Sciences": ["HBFE", "HBEC", "HBFA"],
  "Information Science & Technology": ["HICS", "HIIT", "HISA", "HISE"],
};

/**
 * Gets courses for a specific school
 * Returns empty array if school not found
 */
export const getCoursesForSchool = (school) => {
  return COURSES[school] || [];
};

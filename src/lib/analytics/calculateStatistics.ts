interface SemesterData {
  name: string;
  planned: number;
  actual: number | null;
  credits: number | null;
  gpa: number | null;
}

export interface Statistics {
  totalCreditsEarned: number;
  totalTargetCredits: number;
  progressPercentage: number;
  cumulativeGPA: number;
  lastSemesterGPA: number;
  gpaChange: number;
  lastSemesterName: string;
}

/**
 * Calculate academic statistics from semester data
 * @param semesterData Array of semester data
 * @returns Statistics object with calculated values
 */
export function calculateStatistics(semesterData: SemesterData[]): Statistics {
  const completedSemesters = semesterData.filter(s => s.actual !== null && s.gpa !== null);
  
  // Total credits earned (latest cumulative actual value)
  const totalCreditsEarned = completedSemesters.length > 0 
    ? completedSemesters[completedSemesters.length - 1].actual || 0
    : 0;
  
  // Total target credits (last planned value)
  const totalTargetCredits = semesterData.length > 0
    ? semesterData[semesterData.length - 1].planned
    : 124;
  
  // Progress percentage
  const progressPercentage = totalTargetCredits > 0 
    ? (totalCreditsEarned / totalTargetCredits) * 100 
    : 0;
  
  // Calculate cumulative GPA (weighted average)
  let cumulativeGPA = 0;
  if (completedSemesters.length > 0) {
    const totalCredits = completedSemesters.reduce((sum, s) => sum + (s.credits || 0), 0);
    const totalGradePoints = completedSemesters.reduce((sum, s) => sum + (s.credits || 0) * (s.gpa || 0), 0);
    cumulativeGPA = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
  }
  
  // Last semester GPA
  const lastSemesterGPA = completedSemesters.length > 0
    ? completedSemesters[completedSemesters.length - 1].gpa || 0
    : 0;
  
  // Calculate previous cumulative GPA (without last semester)
  let previousCumulativeGPA = 0;
  if (completedSemesters.length > 1) {
    const previousSemesters = completedSemesters.slice(0, -1);
    const totalCredits = previousSemesters.reduce((sum, s) => sum + (s.credits || 0), 0);
    const totalGradePoints = previousSemesters.reduce((sum, s) => sum + (s.credits || 0) * (s.gpa || 0), 0);
    previousCumulativeGPA = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
  }
  
  // GPA change
  const gpaChange = cumulativeGPA - previousCumulativeGPA;
  
  // Last semester name
  const lastSemesterName = completedSemesters.length > 0
    ? completedSemesters[completedSemesters.length - 1].name
    : "N/A";

  return {
    totalCreditsEarned,
    totalTargetCredits,
    progressPercentage,
    cumulativeGPA,
    lastSemesterGPA,
    gpaChange,
    lastSemesterName
  };
}

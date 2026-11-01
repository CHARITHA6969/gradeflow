/**
 * Validate criterion-level scores before a review is persisted or displayed.
 * This utility does not assign grades; it only checks arithmetic and structure.
 */
export function validateRubricScores(scores, expectedTotal) {
  const errors = [];

  if (!Array.isArray(scores) || scores.length === 0) {
    return { valid: false, errors: ["At least one rubric criterion is required."], totalEarned: 0, totalPossible: 0 };
  }

  const names = new Set();
  let totalEarned = 0;
  let totalPossible = 0;

  scores.forEach((score, index) => {
    const label = `Criterion ${index + 1}`;
    if (!score || typeof score.criterion !== "string" || !score.criterion.trim()) {
      errors.push(`${label} must have a non-empty name.`);
    } else {
      const normalized = score.criterion.trim().toLocaleLowerCase();
      if (names.has(normalized)) errors.push(`Duplicate criterion: ${score.criterion.trim()}.`);
      names.add(normalized);
    }

    if (!Number.isFinite(score?.earned) || !Number.isFinite(score?.total) || score.total <= 0) {
      errors.push(`${label} must contain finite numeric earned and total values, with total greater than zero.`);
      return;
    }
    if (score.earned < 0 || score.earned > score.total) {
      errors.push(`${label} earned points must be between zero and its maximum.`);
    }
    totalEarned += score.earned;
    totalPossible += score.total;
  });

  if (expectedTotal !== undefined && (!Number.isFinite(expectedTotal) || expectedTotal <= 0 || totalPossible !== expectedTotal)) {
    errors.push("Rubric criterion totals must equal the assignment's expected total.");
  }

  return { valid: errors.length === 0, errors, totalEarned, totalPossible };
}

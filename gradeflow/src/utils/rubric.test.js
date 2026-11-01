import { validateRubricScores } from "./rubric";

describe("validateRubricScores", () => {
  test("accepts a complete rubric whose criterion totals match the assignment", () => {
    const result = validateRubricScores([
      { criterion: "Design", earned: 8, total: 10 },
      { criterion: "Testing", earned: 7, total: 10 },
    ], 20);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.totalEarned).toBe(15);
    expect(result.totalPossible).toBe(20);
  });

  test("rejects scores outside the allowed range", () => {
    const result = validateRubricScores([
      { criterion: "Design", earned: 11, total: 10 },
    ], 10);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Criterion 1 earned points must be between zero and its maximum.");
  });

  test("rejects duplicate criterion names regardless of case", () => {
    const result = validateRubricScores([
      { criterion: "Design", earned: 4, total: 5 },
      { criterion: " design ", earned: 3, total: 5 },
    ], 10);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Duplicate criterion: design.");
  });

  test("rejects missing criteria and mismatched assignment totals", () => {
    expect(validateRubricScores([], 10).valid).toBe(false);
    const mismatch = validateRubricScores([
      { criterion: "Design", earned: 4, total: 5 },
    ], 10);
    expect(mismatch.errors).toContain("Rubric criterion totals must equal the assignment's expected total.");
  });
});

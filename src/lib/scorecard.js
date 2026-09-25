// Weighted Balanced Scorecard engine.
//
// Mirrors the method in the Strategic plan workbook ("GM Weighted Scorecard"
// and the departmental scorecard sheets) and the PMS scorecard_results model:
//
//   KPI achievement   = actual / target      (higher is better)
//                     = target / actual      (lower is better)
//   Perspective score = KPI achievements, weighted by each KPI's weight
//   Overall score     = perspective scores, weighted by perspective weight
//
// A perspective's contribution to the overall score is score x weight / total
// weight, so the four contributions add up to the overall score exactly. That
// is what the Executive donut shows.
//
// Achievement is capped (default 120%) before weighting so one KPI far over
// target cannot hide a failing one in the same perspective. The cap is not
// applied to the value shown against an individual KPI.

export const ACHIEVEMENT_CAP = 120

export function kpiAchievement(actual, target, direction = 'higher') {
  if (actual === null || actual === undefined || target === null || target === undefined) return null
  if (direction === 'lower') {
    if (actual <= 0) return target >= 0 ? ACHIEVEMENT_CAP : null
    return (target / actual) * 100
  }
  if (target === 0) return null
  return (actual / target) * 100
}

function capped(value, cap) {
  return value === null ? null : Math.min(value, cap)
}

/**
 * Weighted mean of { value, weight } items. Items with a null value are left
 * out and the remaining weights are re-normalised, so an unreported KPI does
 * not count as zero. Returns null when nothing is reported.
 */
export function weightedMean(items, cap = ACHIEVEMENT_CAP) {
  let sum = 0
  let weights = 0
  for (const { value, weight } of items) {
    const v = capped(value, cap)
    if (v === null || !weight) continue
    sum += v * weight
    weights += weight
  }
  return weights === 0 ? null : sum / weights
}

/**
 * perspectives: [{ key, weight }]
 * scores: { [key]: number | null }
 * Returns { overall, contributions: { [key]: number | null } }.
 */
export function overallFromPerspectives(perspectives, scores) {
  const reported = perspectives.filter((p) => scores[p.key] !== null && scores[p.key] !== undefined)
  const totalWeight = reported.reduce((sum, p) => sum + p.weight, 0)
  const contributions = {}
  for (const p of perspectives) {
    const score = scores[p.key]
    contributions[p.key] = score === null || score === undefined || totalWeight === 0
      ? null
      : (score * p.weight) / totalWeight
  }
  const overall = totalWeight === 0
    ? null
    : reported.reduce((sum, p) => sum + contributions[p.key], 0)
  return { overall, contributions }
}

/**
 * Scores one scorecard. kpis: [{ perspective, weight, achievement }]
 * (achievement already worked out for the period being shown).
 */
export function scoreScorecard(perspectives, kpis, cap = ACHIEVEMENT_CAP) {
  const scores = {}
  for (const p of perspectives) {
    scores[p.key] = weightedMean(
      kpis.filter((k) => k.perspective === p.key).map((k) => ({ value: k.achievement, weight: k.weight })),
      cap,
    )
  }
  return { scores, ...overallFromPerspectives(perspectives, scores) }
}

/**
 * Achievement of a monthly KPI over a set of months: the capped monthly
 * achievements, averaged. Months with no actual are skipped.
 */
export function periodAchievement(kpi, monthIndexes, cap = ACHIEVEMENT_CAP) {
  const values = monthIndexes
    .map((i) => kpiAchievement(kpi.actuals[i], kpi.target, kpi.direction))
    .filter((v) => v !== null)
    .map((v) => Math.min(v, cap))
  if (values.length === 0) return null
  return values.reduce((a, b) => a + b, 0) / values.length
}

/** Average of the reported monthly actuals for a set of months, for display. */
export function periodActual(kpi, monthIndexes) {
  const values = monthIndexes.map((i) => kpi.actuals[i]).filter((v) => v !== null && v !== undefined)
  if (values.length === 0) return null
  return values.reduce((a, b) => a + b, 0) / values.length
}

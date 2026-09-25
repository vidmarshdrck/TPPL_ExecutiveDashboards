import test from 'node:test'
import assert from 'node:assert/strict'
import { kpiAchievement, weightedMean, overallFromPerspectives, scoreScorecard, periodAchievement, periodActual } from './scorecard.js'
import { PERSPECTIVES, gmScorecard, departments, REPORTED_MONTHS } from '../data/scorecardData.js'
import { overallScores } from '../data/tazamaData.js'

const round1 = (value) => Math.round(value * 10) / 10

test('achievement inverts for lower-is-better KPIs', () => {
  assert.equal(kpiAchievement(90, 100), 90)
  assert.equal(kpiAchievement(12.5, 10, 'lower'), 80)
  assert.equal(kpiAchievement(null, 100), null)
  assert.equal(kpiAchievement(50, 0), null)
})

test('weighted mean skips unreported KPIs instead of counting them as zero', () => {
  assert.equal(weightedMean([{ value: 80, weight: 1 }, { value: null, weight: 3 }]), 80)
  assert.equal(weightedMean([{ value: null, weight: 1 }]), null)
})

test('weighted mean caps runaway achievement so it cannot mask a failing KPI', () => {
  assert.equal(weightedMean([{ value: 300, weight: 1 }, { value: 40, weight: 1 }]), 80)
})

test('perspective contributions add up to the overall score', () => {
  const { overall, contributions } = overallFromPerspectives(PERSPECTIVES, { financial: 80, customer: 90, internal: 70, learning: 60 })
  const sum = Object.values(contributions).reduce((a, b) => a + b, 0)
  assert.equal(round1(sum), round1(overall))
})

test('reproduces the approved GM weighted scorecard from the workbook', () => {
  const { scores, overall } = scoreScorecard(PERSPECTIVES, gmScorecard.kpis)
  assert.equal(round1(scores.financial), overallScores.financial)
  assert.equal(round1(scores.customer), overallScores.customer)
  assert.equal(round1(scores.internal), overallScores.internalProcesses)
  assert.equal(round1(scores.learning), round1(overallScores.learningGrowth))
  assert.equal(round1(overall), overallScores.overall)
})

test('demo department data is stable, complete, and within a believable range', () => {
  const ytd = [...Array(REPORTED_MONTHS).keys()]
  assert.equal(departments.length, 9)
  for (const department of departments) {
    for (const perspective of PERSPECTIVES) {
      assert.ok(department.kpis.some((k) => k.perspective === perspective.key), `${department.name} has no ${perspective.key} KPI`)
    }
    const { overall } = scoreScorecard(PERSPECTIVES, department.kpis.map((k) => ({ ...k, achievement: periodAchievement(k, ytd) })))
    assert.ok(overall > 55 && overall < 100, `${department.name} scored ${overall}`)
    for (const kpi of department.kpis) assert.equal(kpi.actuals.slice(REPORTED_MONTHS).every((v) => v === null), true)
  }
})

test('period actual averages only the months that were reported', () => {
  assert.equal(periodActual({ actuals: [10, null, 20] }, [0, 1, 2]), 15)
  assert.equal(periodAchievement({ actuals: [null], target: 100 }, [0]), null)
})

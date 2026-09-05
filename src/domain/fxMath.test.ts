import { describe, expect, it } from 'vitest'
import { demoOptions, demoOrder, demoReferenceRate, expectedDemo } from '../test/fixtures'
import {
  calculatePaymentResult,
  calculateProfitCliff,
  calculateScenario,
  rankDisclosedCosts,
} from './fxMath'

describe('payment calculations', () => {
  it.each([
    [demoOptions[0], expectedDemo.optionA],
    [demoOptions[1], expectedDemo.optionB],
  ])('matches the hand-calculated demo for %s', (option, expected) => {
    const result = calculatePaymentResult(demoOrder, demoReferenceRate.cadPerUsd, option)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.referenceSupplierValueCad).toBeCloseTo(27_000, 10)
    expect(result.value.supplierConversionCostCad).toBeCloseTo(expected.supplier, 10)
    expect(result.value.fxSpreadImpactCad).toBeCloseTo(expected.spread, 10)
    expect(result.value.disclosedCostVsReferenceCad).toBeCloseTo(expected.disclosed, 10)
    expect(result.value.totalKnownCostCad).toBeCloseTo(expected.totalKnown, 10)
    expect(result.value.profitCad).toBeCloseTo(expected.profit, 10)
    expect(result.value.margin).toBeCloseTo(expected.margin, 10)
    expect(result.value.hasUnknownCosts).toBe(true)
  })

  it('preserves a favorable negative spread', () => {
    const result = calculatePaymentResult(demoOrder, 1.4, { ...demoOptions[0], quotedCadPerUsd: 1.35 })
    expect(result.ok && result.value.fxSpreadImpactCad).toBeCloseTo(-1_000, 10)
  })

  it('ranks disclosed costs and supports ties', () => {
    const a = calculatePaymentResult(demoOrder, 1.35, demoOptions[0])
    const b = calculatePaymentResult(demoOrder, 1.35, demoOptions[1])
    expect(a.ok && b.ok && rankDisclosedCosts(a.value, b.value)).toBe('option-b')
    if (!a.ok) return
    expect(rankDisclosedCosts(a.value, { ...a.value, optionId: 'option-b' })).toBe('tie')
  })
})

describe('scenario calculations', () => {
  it('calculates the Profit Cliff and Safe Bid from unrounded values', () => {
    const cliff = calculateProfitCliff(demoOrder, demoOptions[1])
    expect(cliff.ok && cliff.value).toBeCloseTo(expectedDemo.profitCliff, 10)

    const scenario = calculateScenario(demoOrder, demoOptions[1], 1.375)
    expect(scenario.ok).toBe(true)
    if (!scenario.ok) return
    expect(scenario.value.totalKnownCostCad).toBeCloseTo(28_520, 10)
    expect(scenario.value.profitCad).toBeCloseTo(4_480, 10)
    expect(scenario.value.margin).toBeCloseTo(4_480 / 33_000, 10)
    expect(scenario.value.safeBidCad).toBeCloseTo(expectedDemo.safeBid, 10)
    expect(scenario.value.targetStatus).toBe('above')
  })

  it.each([
    [1.4009, 'above'],
    [1.401, 'at'],
    [1.4011, 'below'],
  ] as const)('classifies %s relative to the cliff', (rate, status) => {
    const result = calculateScenario(demoOrder, demoOptions[1], rate)
    expect(result.ok && result.value.targetStatus).toBe(status)
  })

  it('rejects invalid and impossible cases without NaN or Infinity', () => {
    expect(calculateScenario({ ...demoOrder, customerRevenueCad: 0 }, demoOptions[1], 1.4).ok).toBe(false)
    expect(calculateScenario({ ...demoOrder, supplierInvoiceUsd: 0 }, demoOptions[1], 1.4).ok).toBe(false)
    expect(calculateScenario({ ...demoOrder, targetMargin: 1 }, demoOptions[1], 1.4).ok).toBe(false)
    expect(calculateProfitCliff({ ...demoOrder, customerRevenueCad: 1_000 }, demoOptions[1]).ok).toBe(false)
  })
})

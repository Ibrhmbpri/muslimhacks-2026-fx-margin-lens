import { formatCad, formatPercent, formatRate } from './format'
import type { DisclosedCostRanking, PaymentOption, PaymentResult, ScenarioResult } from './types'

interface DecisionInput {
  options: [PaymentOption, PaymentOption]
  results: readonly [PaymentResult, PaymentResult]
  selectedOption: PaymentOption
  selectedResult: PaymentResult
  scenario: ScenarioResult
  ranking: DisclosedCostRanking
  referenceRate: number
  scenarioRate: number
}

export function buildDecisionLens(input: DecisionInput): string[] {
  const winner = input.options.find((option) => option.id === input.ranking)
  const ranking = input.ranking === 'tie'
    ? 'The two options have the same disclosed cost versus reference.'
    : `${winner?.name ?? 'One option'} has the lowest disclosed cost based on the entered rates and known fees.`
  const spreadDirection = input.selectedResult.fxSpreadImpactCad >= 0 ? 'more' : 'less'
  const quoteContext = `${input.selectedOption.name}'s quote costs ${formatCad(Math.abs(input.selectedResult.fxSpreadImpactCad))} ${spreadDirection} than converting the invoice at the ${formatRate(input.referenceRate)} reference rate, before its fixed fee.`
  const headroom = input.scenario.targetStatus === 'above'
    ? `The scenario has ${(input.scenario.profitCliffCadPerUsd - input.scenarioRate).toFixed(4)} CAD per USD of headroom before it reaches the Profit Cliff.`
    : input.scenario.targetStatus === 'at'
      ? 'The scenario is exactly at the Profit Cliff and just meets the target margin.'
      : `The scenario is above the ${formatRate(input.scenario.profitCliffCadPerUsd)} Profit Cliff, so the target margin is not met.`
  const status = `At 1 USD = ${formatRate(input.scenarioRate)} CAD, order profit is ${formatCad(input.scenario.profitCad)} and margin is ${formatPercent(input.scenario.margin)}.`
  const safeBid = `To preserve the target margin at this scenario rate, charge at least ${formatCad(input.scenario.safeBidCad)} based on known costs.`
  const uncertainty = input.results.some((result) => result.hasUnknownCosts || result.hasEstimatedCosts)
    ? 'Complete certainty is not possible: estimated or unknown payment costs remain outside disclosed totals.'
    : 'All entered payment costs are known, but the actual transaction rate can still differ.'

  return [ranking, quoteContext, headroom, status, safeBid, uncertainty]
}

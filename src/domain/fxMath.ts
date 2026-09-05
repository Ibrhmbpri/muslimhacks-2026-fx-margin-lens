import type {
  CalculationResult,
  DisclosedCostRanking,
  OrderEconomics,
  PaymentOption,
  PaymentResult,
  ScenarioResult,
  TargetStatus,
} from './types'
import { validateOption, validateOrder, validateRate } from './validation'

const RATE_TOLERANCE = 1e-10

export function calculatePaymentResult(
  order: OrderEconomics,
  referenceCadPerUsd: number,
  option: PaymentOption,
): CalculationResult<PaymentResult> {
  const errors = [
    ...validateOrder(order),
    ...validateRate(referenceCadPerUsd, 'referenceCadPerUsd'),
    ...validateOption(option),
  ]
  if (errors.length) return { ok: false, errors }

  const referenceSupplierValueCad = order.supplierInvoiceUsd * referenceCadPerUsd
  const supplierConversionCostCad = order.supplierInvoiceUsd * option.quotedCadPerUsd
  const fxSpreadImpactCad = supplierConversionCostCad - referenceSupplierValueCad
  const disclosedCostVsReferenceCad = fxSpreadImpactCad + option.knownFixedFeeCad
  const totalKnownCostCad =
    supplierConversionCostCad + option.knownFixedFeeCad + order.otherKnownCostsCad
  const profitCad = order.customerRevenueCad - totalKnownCostCad

  return {
    ok: true,
    value: {
      optionId: option.id,
      referenceSupplierValueCad,
      supplierConversionCostCad,
      fxSpreadImpactCad,
      disclosedCostVsReferenceCad,
      totalKnownCostCad,
      profitCad,
      margin: profitCad / order.customerRevenueCad,
      hasEstimatedCosts: option.uncertainCosts.some((cost) => cost.status === 'ESTIMATED'),
      hasUnknownCosts: option.uncertainCosts.some((cost) => cost.status === 'UNKNOWN'),
    },
  }
}

export function calculateProfitCliff(
  order: OrderEconomics,
  option: PaymentOption,
): CalculationResult<number> {
  const errors = [...validateOrder(order), ...validateOption(option)]
  if (errors.length) return { ok: false, errors }

  const numerator =
    order.customerRevenueCad * (1 - order.targetMargin) -
    option.knownFixedFeeCad -
    order.otherKnownCostsCad

  if (numerator <= 0) {
    return {
      ok: false,
      errors: [{ field: 'profitCliff', message: 'No positive USD/CAD rate can preserve this target margin with the entered costs.' }],
    }
  }

  return { ok: true, value: numerator / order.supplierInvoiceUsd }
}

export function calculateScenario(
  order: OrderEconomics,
  option: PaymentOption,
  scenarioCadPerUsd: number,
): CalculationResult<ScenarioResult> {
  const errors = [
    ...validateOrder(order),
    ...validateOption(option),
    ...validateRate(scenarioCadPerUsd, 'scenarioCadPerUsd'),
  ]
  if (errors.length) return { ok: false, errors }

  const cliff = calculateProfitCliff(order, option)
  if (!cliff.ok) return cliff

  const supplierCostCad = order.supplierInvoiceUsd * scenarioCadPerUsd
  const totalKnownCostCad =
    supplierCostCad + option.knownFixedFeeCad + order.otherKnownCostsCad
  const profitCad = order.customerRevenueCad - totalKnownCostCad
  const margin = profitCad / order.customerRevenueCad
  const safeBidCad = totalKnownCostCad / (1 - order.targetMargin)
  const delta = scenarioCadPerUsd - cliff.value
  const targetStatus: TargetStatus =
    Math.abs(delta) <= RATE_TOLERANCE ? 'at' : delta < 0 ? 'above' : 'below'

  return {
    ok: true,
    value: {
      supplierCostCad,
      totalKnownCostCad,
      profitCad,
      margin,
      profitCliffCadPerUsd: cliff.value,
      safeBidCad,
      targetStatus,
    },
  }
}

export function rankDisclosedCosts(
  first: PaymentResult,
  second: PaymentResult,
): DisclosedCostRanking {
  const delta = first.disclosedCostVsReferenceCad - second.disclosedCostVsReferenceCad
  if (Math.abs(delta) <= Number.EPSILON) return 'tie'
  return delta < 0 ? first.optionId : second.optionId
}

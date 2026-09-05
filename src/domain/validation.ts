import type { CalculationError, OrderEconomics, PaymentOption } from './types'

const finite = (value: number) => Number.isFinite(value)

export function validateOrder(order: OrderEconomics): CalculationError[] {
  const errors: CalculationError[] = []

  if (!finite(order.supplierInvoiceUsd) || order.supplierInvoiceUsd <= 0) {
    errors.push({ field: 'supplierInvoiceUsd', message: 'Enter a USD invoice greater than zero.' })
  }
  if (!finite(order.customerRevenueCad) || order.customerRevenueCad <= 0) {
    errors.push({ field: 'customerRevenueCad', message: 'Enter CAD revenue greater than zero.' })
  }
  if (!finite(order.otherKnownCostsCad) || order.otherKnownCostsCad < 0) {
    errors.push({ field: 'otherKnownCostsCad', message: 'Other CAD costs cannot be negative.' })
  }
  if (!finite(order.targetMargin) || order.targetMargin < 0 || order.targetMargin >= 1) {
    errors.push({ field: 'targetMargin', message: 'Target margin must be from 0% up to, but not including, 100%.' })
  }

  return errors
}

export function validateRate(cadPerUsd: number, field = 'cadPerUsd'): CalculationError[] {
  return finite(cadPerUsd) && cadPerUsd > 0
    ? []
    : [{ field, message: 'Enter a CAD-per-USD rate greater than zero.' }]
}

export function validateOption(option: PaymentOption): CalculationError[] {
  const errors = validateRate(option.quotedCadPerUsd, `${option.id}.quotedCadPerUsd`)
  if (!option.name.trim()) {
    errors.push({ field: `${option.id}.name`, message: 'Enter an option name.' })
  }
  if (!finite(option.knownFixedFeeCad) || option.knownFixedFeeCad < 0) {
    errors.push({ field: `${option.id}.knownFixedFeeCad`, message: 'Known fees cannot be negative.' })
  }
  return errors
}

export type CostStatus = 'KNOWN' | 'ESTIMATED' | 'UNKNOWN'

export type CostItem =
  | {
      status: 'KNOWN'
      label: string
      amountCad: number
      source: string
    }
  | {
      status: 'ESTIMATED'
      label: string
      minimumCad: number
      maximumCad: number
      source: string
    }
  | {
      status: 'UNKNOWN'
      label: string
      reason?: string
    }

export interface OrderEconomics {
  supplierInvoiceUsd: number
  customerRevenueCad: number
  otherKnownCostsCad: number
  targetMargin: number
}

export type ReferenceRateStatus = 'manual' | 'loading' | 'loaded' | 'failed'

export interface ReferenceRate {
  cadPerUsd: number
  source: 'manual' | 'bank-of-canada'
  observationDate?: string
  status: ReferenceRateStatus
  message?: string
}

export interface PaymentOption {
  id: 'option-a' | 'option-b'
  name: string
  quotedCadPerUsd: number
  knownFixedFeeCad: number
  uncertainCosts: CostItem[]
}

export interface PaymentResult {
  optionId: PaymentOption['id']
  referenceSupplierValueCad: number
  supplierConversionCostCad: number
  fxSpreadImpactCad: number
  disclosedCostVsReferenceCad: number
  totalKnownCostCad: number
  profitCad: number
  margin: number
  hasEstimatedCosts: boolean
  hasUnknownCosts: boolean
}

export interface Scenario {
  selectedOptionId: PaymentOption['id']
  cadPerUsd: number
}

export type TargetStatus = 'above' | 'at' | 'below'

export interface ScenarioResult {
  supplierCostCad: number
  totalKnownCostCad: number
  profitCad: number
  margin: number
  profitCliffCadPerUsd: number
  safeBidCad: number
  targetStatus: TargetStatus
}

export interface CalculationError {
  field: string
  message: string
}

export type CalculationResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: CalculationError[] }

export type DisclosedCostRanking = PaymentOption['id'] | 'tie'

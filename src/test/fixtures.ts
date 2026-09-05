import type { OrderEconomics, PaymentOption, ReferenceRate } from '../domain/types'

export const demoOrder: OrderEconomics = {
  supplierInvoiceUsd: 20_000,
  customerRevenueCad: 33_000,
  otherKnownCostsCad: 1_000,
  targetMargin: 0.12,
}

export const demoReferenceRate: ReferenceRate = {
  cadPerUsd: 1.35,
  source: 'manual',
  status: 'manual',
}

const unknownBankFees = [
  {
    status: 'UNKNOWN' as const,
    label: 'Intermediary or receiving-bank fees',
    reason: 'The final amount may not be known before the transfer is processed.',
  },
]

export const demoOptions: [PaymentOption, PaymentOption] = [
  {
    id: 'option-a',
    name: 'Canadian Bank',
    quotedCadPerUsd: 1.39,
    knownFixedFeeCad: 30,
    uncertainCosts: unknownBankFees,
  },
  {
    id: 'option-b',
    name: 'FX Specialist',
    quotedCadPerUsd: 1.375,
    knownFixedFeeCad: 20,
    uncertainCosts: unknownBankFees,
  },
]

export const expectedDemo = {
  optionA: { supplier: 27_800, spread: 800, disclosed: 830, totalKnown: 28_830, profit: 4_170, margin: 4_170 / 33_000 },
  optionB: { supplier: 27_500, spread: 500, disclosed: 520, totalKnown: 28_520, profit: 4_480, margin: 4_480 / 33_000 },
  profitCliff: 1.401,
  safeBid: 28_520 / 0.88,
}

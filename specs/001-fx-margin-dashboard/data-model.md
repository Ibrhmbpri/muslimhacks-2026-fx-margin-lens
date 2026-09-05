# Data Model: FX Margin Lens MVP

All rates use one invariant: `1 USD = X CAD`. All monetary calculations retain unrounded numeric
values; formatting is a presentation concern.

## OrderEconomics

| Field | Type | Validation |
|-------|------|------------|
| `supplierInvoiceUsd` | number | Required; finite; greater than 0 |
| `customerRevenueCad` | number | Required; finite; greater than 0 |
| `otherKnownCostsCad` | number | Required; finite; greater than or equal to 0 |
| `targetMargin` | decimal fraction | Required; finite; `0 <= value < 1` |

One `OrderEconomics` record feeds both payment comparisons and the selected scenario.

## ReferenceRate

| Field | Type | Validation |
|-------|------|------------|
| `cadPerUsd` | number | Required for calculations; finite; greater than 0 |
| `source` | `manual` or `bank-of-canada` | Required |
| `observationDate` | ISO date or absent | Required for Bank of Canada; absent allowed for manual |
| `status` | `manual`, `loading`, `loaded`, or `failed` | Required UI state |
| `message` | string or absent | Failure/reference disclosure only |

State transitions: `manual -> loading -> loaded`; any request failure becomes `failed`, preserving
the last valid `cadPerUsd` as an editable manual value. Editing the rate sets source/status to manual.

## PaymentOption

| Field | Type | Validation |
|-------|------|------------|
| `id` | `option-a` or `option-b` | Stable and unique |
| `name` | string | Required after trimming; concise display length |
| `quotedCadPerUsd` | number | Required; finite; greater than 0 |
| `knownFixedFeeCad` | number | Required; finite; greater than or equal to 0 |
| `uncertainCosts` | CostItem list | May be empty; demo includes unknown bank-related costs |

Exactly two options exist. Either may be selected; provider category conveys no price assumption.

## CostItem

Cost items use mutually exclusive states:

- `KNOWN`: requires a finite non-negative `amountCad` and a supplied/quoted/published/exact source
  description.
- `ESTIMATED`: requires finite non-negative `minimumCad` and `maximumCad`, `minimum <= maximum`, and
  a defensible citation/benchmark. Estimates are not included in disclosed totals.
- `UNKNOWN`: prohibits amount/range fields and may carry a plain-language reason.

## PaymentResult

Derived independently for each payment option:

| Field | Formula or state |
|-------|------------------|
| `referenceSupplierValueCad` | `U * referenceCadPerUsd` |
| `supplierConversionCostCad` | `U * quotedCadPerUsd` |
| `fxSpreadImpactCad` | `supplierConversionCostCad - referenceSupplierValueCad` |
| `disclosedCostVsReferenceCad` | `fxSpreadImpactCad + knownFixedFeeCad` |
| `profitCad` | `R - (supplierConversionCostCad + knownFixedFeeCad + O)` |
| `margin` | `profitCad / R` when `R > 0` |
| `hasUnknownCosts` | true when any related cost is UNKNOWN |

Ranking has three states: option A lower disclosed cost, option B lower disclosed cost, or tie.
Unknown/estimated costs never change the numeric disclosed ranking and always qualify its wording.

## Scenario

| Field | Type | Validation |
|-------|------|------------|
| `selectedOptionId` | PaymentOption ID | Must identify one of the two options |
| `cadPerUsd` | number | Required; finite; greater than 0 |

## ScenarioResult

| Field | Formula or state |
|-------|------------------|
| `supplierCostCad` | `U * x` |
| `totalKnownCostCad` | `U * x + F + O` |
| `profitCad` | `R - totalKnownCostCad` |
| `margin` | `profitCad / R` when valid |
| `profitCliffCadPerUsd` | `(R * (1 - m) - F - O) / U` when denominator/numerator valid |
| `safeBidCad` | `totalKnownCostCad / (1 - m)` when denominator valid |
| `targetStatus` | `above`, `at`, `below`, or `invalid` |

`at` uses a documented comparison tolerance suitable for floating-point noise, not displayed
rounding. A zero/negative cliff numerator yields an impossible explanatory result rather than a
positive rate. Invalid inputs yield typed errors and no misleading derived number.

## DecisionLens

An ordered list of deterministic statements derived from:

1. disclosed-cost ranking or tie;
2. selected option difference from reference;
3. positive FX headroom to the cliff, or threshold status;
4. current target status;
5. Safe Bid when valid; and
6. uncertainty qualifier when estimated or unknown costs exist.

No statement contains generated, predictive, advisory, or provider-quality claims.

## Demo State

| Input | Value |
|-------|-------|
| Supplier invoice | US$20,000 |
| Customer revenue | C$33,000 |
| Other costs | C$1,000 |
| Target margin | 12% |
| Reference rate | 1.3500 CAD per USD |
| Option A | Canadian Bank; 1.3900; C$30 fee |
| Option B | FX Specialist; 1.3750; C$20 fee |
| Initial selection/scenario | Option B at 1.3750 |

Expected checks: A disclosed cost versus reference C$830, profit C$4,170, margin 12.64%; B disclosed
cost C$520, profit C$4,480, margin 13.58%; B Profit Cliff 1.4010; B Safe Bid C$32,409.09.

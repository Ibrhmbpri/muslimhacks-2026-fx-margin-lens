# Contract: Financial Calculations

## Invariants

- Every rate means CAD required for one USD.
- Inputs and outputs are unrounded finite numbers unless a result is explicitly invalid.
- Display formatting never feeds back into calculations or threshold comparison.
- Unknown and estimated costs are excluded from numeric disclosed totals.

## Operations

### `calculatePaymentResult(order, referenceRate, option)`

Returns reference supplier value, quoted supplier conversion cost, spread impact, disclosed cost
versus reference, profit, margin, and uncertainty flags using FR-009 through FR-017 formulas.

### `calculateProfitCliff(order, option)`

Returns `(R * (1 - m) - F - O) / U`, or a typed invalid/impossible result. It MUST reject `U <= 0`,
invalid margins, non-finite inputs, and a non-positive numerator.

### `calculateScenario(order, option, scenarioRate)`

Returns supplier cost, total known cost, profit, margin, Profit Cliff, Safe Bid, and target status.
Safe Bid is `(U * x + F + O) / (1 - m)`. Status compares unrounded scenario margin with target.

### `rankDisclosedCosts(resultA, resultB)`

Returns `option-a`, `option-b`, or `tie`. User-facing copy MUST say "Lowest disclosed cost" for a
winner and MUST append an uncertainty qualifier when either result has estimated/unknown costs.

### `buildDecisionLens(comparison, scenario)`

Returns a fixed-order list of statements supported only by operation outputs. It MUST NOT forecast,
recommend a provider as guaranteed cheapest, or imply unknown costs are included.

## Error contract

Invalid results identify the affected field and a corrective message. Consumers MUST suppress the
affected numeric output while continuing to display independent valid results. No `NaN`, `Infinity`,
or fabricated zero may reach user-visible output.

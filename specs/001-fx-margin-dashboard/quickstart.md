# Quickstart and Validation Guide

## Prerequisites

- Current Node.js LTS and npm
- A modern browser
- Optional network access for the Bank of Canada reference lookup

## Setup and run

```powershell
npm install
npm run dev
```

Open the local URL printed by the development server. The dashboard must begin with the editable
demo state defined in [data-model.md](data-model.md).

## Automated gates

After the implementation tasks add the planned test commands, run:

```powershell
npm run lint
npm run test
npm run test:e2e
npm run build
```

All gates must pass before the public deployment. Validate the production build with `npm run
preview` and repeat the golden flow against the preview URL.

## Golden-flow hand check

1. Confirm the header says `1 USD = X CAD` and demo values are explicitly demonstration inputs.
2. Use the initial reference of 1.3500 and verify the two quote results:

| Result | Canadian Bank | FX Specialist |
|--------|---------------|---------------|
| Supplier conversion cost | C$27,800.00 | C$27,500.00 |
| FX spread impact | C$800.00 | C$500.00 |
| Disclosed cost vs reference | C$830.00 | C$520.00 |
| Profit | C$4,170.00 | C$4,480.00 |
| Margin | 12.64% | 13.58% |

3. Confirm FX Specialist is labeled "Lowest disclosed cost," while unknown intermediary/receiving
   costs remain amount-free and prevent a guaranteed-cheapest claim.
4. Select FX Specialist. At scenario 1.3750, verify Profit Cliff 1.4010 and Safe Bid C$32,409.09.
5. Enter scenario 1.4010 and verify margin is 12.00% and status is at target.
6. Enter 1.4100 and verify supplier cost C$28,200.00, profit C$3,780.00, margin 11.45%, below-target
   status, and Safe Bid C$33,204.55.
7. Throughout steps 4–6, confirm the exact text "Scenario analysis — not an exchange-rate
   prediction." remains visible.
8. Confirm the Decision Lens changes deterministically and mentions uncertainty.

## Failure and boundary checks

- Block the Bank of Canada request or take the browser offline. Confirm an informative failure state,
  unchanged/editable manual rate, and a fully working golden flow.
- Try zero invoice/revenue, negative costs, non-numeric rates, and target margins below 0%, at 100%,
  and above 100%. Confirm no `NaN`, infinity, or misleading derived amount appears.
- Enter equal disclosed costs and confirm a tie rather than a winner.
- Enter a quote below the reference and confirm a clearly labeled negative spread impact.
- Navigate every control by keyboard and verify threshold states are understandable without color.
- Check representative narrow mobile and wide desktop viewports for readable content without
  horizontal scrolling.

## Contract references

- Financial behavior: [contracts/calculations.md](contracts/calculations.md)
- Reference lookup and fallback: [contracts/reference-rate.md](contracts/reference-rate.md)
- Information hierarchy and accessibility: [contracts/dashboard-ui.md](contracts/dashboard-ui.md)

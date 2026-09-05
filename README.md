# FX Margin Lens

A decision-support tool that helps Canadian small businesses understand the true disclosed cost and margin risk of paying USD suppliers.

**Live app:** [muslimhacks-2026-fx-margin-lens.vercel.app](https://muslimhacks-2026-fx-margin-lens.vercel.app)

Built solo by Ibrahim Bepari for MuslimHacks 2026.

## Problem

Canadian importers may receive supplier invoices in USD while earning revenue in CAD. Before paying, they often lack a clear view of the FX spread versus a reference rate, disclosed transfer fees, possible unknown intermediary or receiving-bank charges, the effect of currency movement on order profit, the rate where their target margin breaks, and the selling price needed to protect that margin.

FX Margin Lens provides scenario analysis, not exchange-rate prediction.

## Solution

Enter the order economics, use a manual or Bank of Canada reference USD/CAD rate, and compare two editable payment quotes. The app separates Known, Estimated, and Unknown costs; calculates profit and margin; lets the user explore rate scenarios; identifies the Profit Cliff; calculates a Safe Selling Price (Safe Bid); and produces deterministic, plain-language Decision Lens explanations. A compact Sharia-aware section offers cautious educational guidance.

## Key features

- Interactive Profit Cliff and target-margin status
- Safe Selling Price under the selected scenario
- Two-option payment comparison
- Known / Estimated / Unknown trust model
- Bank of Canada daily reference with manual fallback
- Deterministic Decision Lens explanations
- Sharia-aware educational guidance
- Responsive desktop and mobile interface

## Important definitions

**USD/CAD convention:** `1 USD = X CAD` — the number of Canadian dollars required for one US dollar. This direction is used everywhere.

**Profit Cliff:** the effective USD/CAD rate at which the order exactly reaches the selected target margin.

`profitCliff = [cadRevenue × (1 − targetMargin) − fixedKnownFee − otherCadCosts] / usdInvoice`

**Safe Selling Price / Safe Bid:** the minimum CAD customer price required to preserve the selected target margin under the chosen scenario, based on known costs.

`safeBid = scenarioKnownCost / (1 − targetMargin)`

## Demo defaults

| Input | Demo value |
| --- | ---: |
| Supplier invoice | US$20,000 |
| Customer revenue | C$33,000 |
| Other known costs | C$1,000 |
| Target margin | 12% |
| Reference rate | 1.3500 CAD/USD |
| Canadian Bank | 1.3900 CAD/USD + C$30 |
| FX Specialist | 1.3750 CAD/USD + C$20 |

These are editable demonstration inputs, not claims about actual or current provider pricing.

## Trust model

- **KNOWN:** supplied, quoted, published, or exactly calculated.
- **ESTIMATED:** shown only when supported by a defensible, cited benchmark or range.
- **UNKNOWN:** no reliable pre-transfer amount is available.

Unknown costs are never treated as zero. Where uncertainty remains, the app compares the **lowest disclosed cost**, not a guaranteed cheapest option.

## Data and educational sources

- [Bank of Canada Valet API](https://www.bankofcanada.ca/valet/docs) — series `FXUSDCAD`, used for optional daily reference USD/CAD context. No API key is required. A reference rate is not a guaranteed transaction rate, and manual entry remains available.
- [AAOIFI SS (1) — Trading in Currencies](https://aaoifi.com/ss-1-trading-in-currencies/?lang=en) — primary direct currency-exchange educational source.
- [Islamic Financial Services Board (IFSB)](https://www.ifsb.org/) — secondary institutional source.

Sharia-related content is educational only. It does not certify Sharia compliance, issue a fatwa, or imply universal scholarly agreement. Treatment depends on the actual transaction structure and scholarly interpretation; seek qualified scholarly guidance for specific arrangements.

## Tech stack

- React, Vite, and TypeScript
- Vitest and Playwright
- Vercel
- Git/GitHub and GitHub Spec Kit
- OpenAI Codex

## Architecture

FX Margin Lens is a client-side React, Vite, and TypeScript application deployed on Vercel. Core financial calculations are pure, deterministic TypeScript functions kept separate from rendering. There is no backend, database, authentication, payment execution, or AI-generated financial advice. The only optional external request is the Bank of Canada reference lookup; the complete flow remains usable with manual entry.

## Testing

- 9 deterministic financial tests
- Playwright golden-flow coverage at desktop and mobile viewports
- ESLint and TypeScript validation
- Production build verification
- Manual and live smoke testing

The Playwright suite does not require the live Bank of Canada endpoint and verifies that manual fallback remains usable when it is unavailable.

## Local development

```bash
npm install
npm run dev
npm run test
npm run test:e2e
npm run build
```

## Competition Disclosures

- This project was built during the MuslimHacks 2026 official coding period, and its implementation was created fresh for the competition.
- GitHub Spec Kit was used for specification and planning; OpenAI Codex was used as an AI coding assistant.
- React, Vite, TypeScript, and the other open-source tools listed above were used to build and validate the project.
- Bank of Canada reference data is externally sourced. AAOIFI and IFSB are cited as educational sources and do not endorse or certify this product.
- Demo provider rates and fees are fictional, editable demonstration inputs—not actual provider pricing.
- The app does not move money, execute payments, provide financial advice, predict FX rates, or certify Sharia compliance.

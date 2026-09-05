# Implementation Plan: FX Margin Lens MVP

**Branch**: `001-fx-margin-dashboard` | **Date**: 2026-09-05 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-fx-margin-dashboard/spec.md`

**Note**: Planning ends after Phase 1 design; implementation tasks are generated separately.

## Summary

Build a polished, responsive, one-page decision dashboard for a Canadian importer comparing two
editable USD payment quotes. Keep all financial logic in pure TypeScript functions, all working
state in the browser, and the Bank of Canada daily USD/CAD lookup optional. React renders the input,
comparison, Profit Cliff, Safe Bid, deterministic Decision Lens, trust model, and educational note;
manual data keeps the entire flow operational when the external lookup fails.

## Technical Context

**Language/Version**: TypeScript 6.0.2, HTML, CSS

**Primary Dependencies**: React 19.2.8 and React DOM 19.2.8; browser `fetch` for the optional Bank of
Canada Valet request; no production state, charting, form, or component libraries

**Storage**: In-memory browser state only; no database, account, or required persistence

**Testing**: Vitest for pure calculation unit tests, React Testing Library for dashboard behavior,
and Playwright for the golden flow; TypeScript build and ESLint as static gates

**Target Platform**: Modern evergreen desktop and mobile browsers; static production deployment on
Vercel

**Project Type**: Single frontend web application

**Performance Goals**: Input-driven results visible within 100 ms for local calculations; initial
usable dashboard within 2 seconds on a typical broadband connection; external lookup never blocks
manual use

**Constraints**: Approximately six hours to first public MVP; one page; `1 USD = X CAD` only;
deterministic calculations; accessible status cues; no secrets, backend, authentication, database,
payment execution, provider integration, prediction, or generative AI

**Scale/Scope**: One order, one reference rate, exactly two payment options, one selected scenario,
and one concurrent browser session; no persistent multi-user scale requirement

## Constitution Check

*GATE: Passed before Phase 0 research and re-checked after Phase 1 design.*

| Gate | Design evidence | Status |
|------|-----------------|--------|
| Financial correctness before visual sophistication | Pure calculation module, hand-calculated fixtures, and unit tests precede UI polish. | PASS |
| USD/CAD is always `1 USD = X CAD` | Domain names, labels, fixtures, and contracts encode CAD per USD only. | PASS |
| Known → Estimated → Unknown | Discriminated cost states prevent unknown amounts and require sources for estimates. | PASS |
| Scenario is not prediction | Exact disclaimer is a required, persistent part of scenario output. | PASS |
| Profit Cliff and Safe Bid are central | Both are first-class calculation results and prominent dashboard sections. | PASS |
| One-page, solo-friendly architecture | One frontend application with small feature-focused modules and no backend. | PASS |
| Manual fallback and resilient golden flow | Reference lookup is optional; calculations depend on the resolved manual/reference value, not request success. | PASS |
| Sharia content is cautious and small | A compact sourced educational note is isolated below the decision workflow. | PASS |
| Deterministic and independently testable | Financial functions are pure and accept explicit inputs with no network or UI dependency. | PASS |
| Early production deployment and secret safety | Static build has no credentials or server state and targets Vercel. | PASS |
| Narrow MVP | No non-goal appears in the source structure, entities, or contracts. | PASS |

Post-design re-check: PASS. The data model contains no persistence or invented unknown values; the
contracts preserve currency direction and exact formulas; the quickstart validates offline fallback,
threshold crossing, deterministic output, responsive use, and production build readiness.

## Project Structure

### Documentation (this feature)

```text
specs/001-fx-margin-dashboard/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   |-- calculations.md
|   |-- dashboard-ui.md
|   `-- reference-rate.md
`-- tasks.md                 # Created later by $speckit-tasks
```

### Source Code (repository root)

```text
src/
|-- components/
|   |-- OrderInputs.tsx
|   |-- PaymentComparison.tsx
|   |-- ProfitCliff.tsx
|   |-- SafeBid.tsx
|   |-- DecisionLens.tsx
|   |-- TrustLegend.tsx
|   `-- ShariaNote.tsx
|-- domain/
|   |-- fxMath.ts
|   |-- decisionLens.ts
|   |-- validation.ts
|   `-- types.ts
|-- services/
|   `-- bankOfCanada.ts
|-- test/
|   |-- fixtures.ts
|   `-- setup.ts
|-- App.tsx
|-- App.css
|-- index.css
`-- main.tsx

tests/
`-- golden-flow.spec.ts
```

**Structure Decision**: Retain the existing single Vite application. Put pure, framework-independent
financial logic under `src/domain`, the only external read under `src/services`, and presentation
under focused `src/components`. Unit and component tests live beside the frontend test setup; the
single browser-level golden-flow test lives under `tests`.

## Complexity Tracking

No constitution violations require justification.

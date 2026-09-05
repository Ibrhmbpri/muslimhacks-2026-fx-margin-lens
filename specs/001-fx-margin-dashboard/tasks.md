---

description: "Critical-path implementation tasks for the FX Margin Lens MVP"
---

# Tasks: FX Margin Lens MVP

**Input**: Design documents from `/specs/001-fx-margin-dashboard/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Delivery rule**: Complete Phases 1–8 for the first public deployment. Phase 9 begins only after the
deployed golden flow passes its smoke test. ONLY deterministic financial formula tests, manual hand
checks, lint/TypeScript validation, and the production build may block first deployment. Playwright
and broader component testing remain post-deployment.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Safe to execute in parallel because it changes a different file and has no unfinished dependency
- **[Story]**: Maps the task to a user story in `spec.md`
- Every task names its target file or repository path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add only the directories and test runner required for the financial correctness gate.

- [X] T001 Confirm the intended Git branch from repository root `.` before implementation, then create the planned `src/components/`, `src/domain/`, `src/services/`, `src/test/`, and `tests/` directories from `specs/001-fx-margin-dashboard/plan.md`
- [X] T002 Add Vitest and the `test` script required for pre-deployment formula tests in `package.json` and `package-lock.json`
- [X] T003 [P] Configure the Vitest environment and test inclusion rules in `vite.config.ts`
- [X] T004 [P] Add shared test initialization needed by the domain suite in `src/test/setup.ts`

**Checkpoint**: `npm run test` can discover and execute a minimal TypeScript test.

---

## Phase 2: Foundational Financial Domain (Blocking)

**Purpose**: Establish the pure, framework-independent model, validation, and formula engine used by
every user story.

**⚠️ CRITICAL**: No React story work begins until the formula tests pass.

- [X] T005 Define OrderEconomics, ReferenceRate, PaymentOption, CostItem, PaymentResult, Scenario, ScenarioResult, and typed invalid-result contracts in `src/domain/types.ts`
- [X] T006 [P] Create the exact editable demo inputs and hand-calculated expected outputs from `data-model.md` in `src/test/fixtures.ts`
- [X] T007 [P] Implement reusable finite-number, positive-money/rate, non-negative-cost, and target-margin validation rules in `src/domain/validation.ts`
- [X] T008 Write failing table-driven tests for conversion cost, reference value, spread impact, disclosed cost, profit, margin, Profit Cliff, Safe Bid, ranking, rounding independence, and invalid/impossible cases in `src/domain/fxMath.test.ts`
- [X] T009 Implement pure payment comparison, scenario, Profit Cliff, Safe Bid, and disclosed-cost ranking functions per `contracts/calculations.md` in `src/domain/fxMath.ts`
- [X] T010 Run `npm run test` from repository root `.` and reconcile every result with `src/test/fixtures.ts` before starting UI work

**Checkpoint**: Core financial formulas are deterministic, hand-verifiable, and independent of React.

---

## Phase 3: User Story 1 — Understand Order Economics (Priority: P1)

**Goal**: Show editable order/demo inputs and a resilient manual or optional official reference rate.

**Independent Test**: Edit every order field and manual reference rate, then block the external
request and confirm valid calculations remain possible with `1 USD = X CAD` labels.

- [X] T011 [US1] Replace starter counter state with typed demo-backed order, reference, option, selection, and scenario state in `src/App.tsx`
- [X] T012 [P] [US1] Build labeled editable USD invoice, CAD revenue, other CAD costs, and target-margin controls with field errors in `src/components/OrderInputs.tsx`
- [X] T013 [P] [US1] Implement the keyless `FXUSDCAD` response adapter, timeout, defensive parsing, and non-throwing failure result per `contracts/reference-rate.md` in `src/services/bankOfCanada.ts`
- [X] T014 [US1] Add the always-editable manual reference-rate control, optional Bank of Canada load action, source/effective-date label, and failure fallback in `src/components/OrderInputs.tsx`
- [X] T015 [US1] Wire `OrderInputs` into `src/App.tsx` so valid edits update canonical state and invalid fields suppress only dependent results (FR-002–FR-007)

**Checkpoint**: User Story 1 works offline with demo defaults and an unambiguous CAD-per-USD convention.

---

## Phase 4: User Story 2 — Compare Disclosed Payment Costs (Priority: P1)

**Goal**: Edit and compare exactly two payment options without hiding uncertain costs.

**Independent Test**: Enter two quotes and verify all six output measures by hand; confirm a tie and
unknown intermediary fees never produce a guaranteed-cheapest claim.

- [X] T016 [P] [US2] Build reusable KNOWN, ESTIMATED, and UNKNOWN badges and amount/source rules in `src/components/TrustLegend.tsx`
- [X] T017 [US2] Build two editable option panels and comparison results for conversion cost, spread impact, known fees, disclosed cost, profit, and margin in `src/components/PaymentComparison.tsx`
- [X] T018 [US2] Add lowest-disclosed-cost/tie wording, negative-spread handling, and explicit unknown intermediary/receiving-bank rows in `src/components/PaymentComparison.tsx`
- [X] T019 [US2] Wire both payment options and pure comparison outputs into `src/App.tsx`, keeping unknown and estimated costs out of numeric disclosed totals (FR-008–FR-017)

**Checkpoint**: The default comparison shows Bank C$830 versus Specialist C$520 disclosed cost and
does not imply that unknown costs are zero.

---

## Phase 5: User Story 3 — Find the Profit Cliff (Priority: P1)

**Goal**: Select an option, move an exact scenario rate, and visibly cross the target-margin cliff.

**Independent Test**: Select FX Specialist and test 1.4009, 1.4010, and 1.4011; verify below/at/above
cliff status, updated profit/margin, keyboard use, and the exact non-prediction disclaimer.

- [X] T020 [US3] Add accessible selected-option controls to `src/components/PaymentComparison.tsx` and synchronize the selected quote rate into scenario state in `src/App.tsx`
- [X] T021 [US3] Build synchronized range and numeric scenario-rate inputs plus live supplier cost, profit, margin, and target status in `src/components/ProfitCliff.tsx`
- [X] T022 [US3] Add prominent Profit Cliff value, remaining-headroom explanation, and above/at/below threshold cues that do not rely on color in `src/components/ProfitCliff.tsx`
- [X] T023 [US3] Keep the exact text "Scenario analysis — not an exchange-rate prediction." visible for every valid or invalid scenario state in `src/components/ProfitCliff.tsx`
- [X] T024 [US3] Connect selected-option scenario results from `src/domain/fxMath.ts` through `src/App.tsx` to `src/components/ProfitCliff.tsx` (FR-018–FR-023)

**Checkpoint**: The judge can select either quote and visibly cross its Profit Cliff interactively.

---

## Phase 6: User Story 4 — Calculate a Safe Bid (Priority: P1)

**Goal**: Turn the selected scenario into the minimum CAD selling price that preserves target margin.

**Independent Test**: With FX Specialist at 1.3750, verify C$32,409.09; at 1.4100 verify C$33,204.55;
then enter an invalid margin and confirm the number is replaced by corrective guidance.

- [X] T025 [US4] Build the prominent CAD Safe Bid result, known-cost basis, plain-language minimum-price sentence, and uncertainty qualifier in `src/components/SafeBid.tsx`
- [X] T026 [US4] Add invalid-margin and impossible-result rendering that never exposes NaN, Infinity, or a fabricated amount in `src/components/SafeBid.tsx`
- [X] T027 [US4] Wire the selected scenario Safe Bid result from `src/domain/fxMath.ts` through `src/App.tsx` into `src/components/SafeBid.tsx` (FR-024–FR-027)

**Checkpoint**: Safe Bid tracks every valid scenario change and clearly states which known costs it uses.

---

## Phase 7: User Story 5 — Decision and Trust Boundaries (Priority: P2, required before MVP deployment)

**Goal**: Explain the deterministic decision, uncertainty, product limits, and small educational note.

**Independent Test**: Exercise both winners, a tie, above/below target, invalid Safe Bid, and unknown
costs; verify every sentence is supported by displayed calculations and contains no prediction/advice.

- [X] T028 [US5] Implement fixed-order deterministic lowest-disclosed-cost, reference difference, FX headroom, target-status, Safe Bid, and uncertainty statements in `src/domain/decisionLens.ts`
- [X] T029 [US5] Render the deterministic statements with invalid-state omissions and no provider guarantee in `src/components/DecisionLens.tsx`
- [X] T030 [P] [US5] Select two concise credible Islamic-finance sources and add them to the compact educational-only Sharia-aware note with scholarly-difference caution and qualified-guidance language in `src/components/ShariaNote.tsx`, without expanding the section
- [X] T031 [P] [US5] Complete the visible KNOWN / ESTIMATED / UNKNOWN definitions and disclosed-total caveat in `src/components/TrustLegend.tsx`
- [X] T032 [US5] Wire `DecisionLens`, `TrustLegend`, `ShariaNote`, and general non-bank/non-advice/reference-rate disclaimers into the required hierarchy in `src/App.tsx` (FR-028–FR-035)

**Checkpoint**: Decision language is entirely deterministic, uncertainty remains explicit, and the
educational content makes no certification or fatwa claim.

---

## Phase 8: First Public MVP — Vertical Slice, Build, and Deployment

**Purpose**: Finish only the cross-story work required to make the complete judge flow polished,
buildable, publicly reachable, and smoke-tested.

- [X] T033 Implement the responsive one-page visual system, typography, spacing, cards, status treatments, focus states, and mobile stacking in `src/App.css` and `src/index.css`
- [X] T034 Remove unused starter assets/imports and finalize semantic section order, page title, metadata, and favicon references in `src/App.tsx`, `src/main.tsx`, and `index.html`
- [X] T035 Execute the full early vertical slice from `specs/001-fx-margin-dashboard/quickstart.md`—enter order data → compare options → select one → move scenario → cross Profit Cliff → verify Safe Bid → read Decision Lens—and record any fixes in the affected `src/` files
- [X] T036 Run the default-demo hand calculation in `specs/001-fx-margin-dashboard/quickstart.md` and confirm every displayed value against `src/test/fixtures.ts`
- [X] T037 Run `npm run test`, `npm run lint`, and `npm run build` from repository root `.` and fix only correctness or build-blocking failures in the affected source/configuration files
- [X] T038 Review `git diff` for credentials, currency-direction reversals, generated build output, and scope violations, then create a pre-deployment Git checkpoint from repository root `.`
- [X] T039 Verify or minimally configure the intended GitHub remote from repository root `.`, then push the reviewed checkpoint and confirmed branch without adding Git workflow complexity
- [X] T040 Verify that repository root `.` is the intended Vercel deployment path, then link only if required and deploy the production build without adding secrets, a backend, persistence, or infrastructure
- [X] T041 Smoke-test the public Vercel URL against the default golden flow, manual-rate fallback, scenario disclaimer, Profit Cliff crossing, Safe Bid, mobile width, and refresh behavior; apply any release-blocking fix in the affected `src/` file and repeat T037–T040

**MVP CHECKPOINT**: A judge can complete the entire decision story on the public URL in under three
minutes. Stop scope expansion and preserve this working deployment.

---

## Phase 9: Post-Deployment Verification and Polish

**Purpose**: Increase confidence and presentation quality only after the public MVP smoke test passes.

- [X] T042 Add only the requested Playwright dependency and `test:e2e` script in `package.json` and `package-lock.json`; defer React Testing Library until component tests are explicitly requested
- [ ] T043 [P] Add component-test DOM matchers and environment configuration in `src/test/setup.ts` and `vite.config.ts`
- [X] T044 Add the deployed-priority Playwright golden-flow coverage for demo math, option selection, cliff crossing, Safe Bid, disclaimer, and manual fallback in `tests/golden-flow.spec.ts`
- [ ] T045 [P] Add focused component tests for input validation and external-reference failure fallback in `src/components/OrderInputs.test.tsx`
- [ ] T046 [P] Add focused component tests for unknown-cost wording, disclosed ranking/tie, and selection in `src/components/PaymentComparison.test.tsx`
- [ ] T047 [P] Add focused component tests for accessible threshold states and invalid Safe Bid output in `src/components/ProfitCliff.test.tsx` and `src/components/SafeBid.test.tsx`
- [X] T048 [P] Replace the starter documentation with product purpose, setup, formulas, disclosures, source provenance, deployment link, and limitation notes in `README.md`
- [ ] T049 Audit keyboard flow, visible focus, labels, live regions, contrast, zoom, reduced motion, and color-independent status; fix findings in `src/components/` and `src/App.css`
- [X] T050 Polish only issues observed in the deployed golden flow—copy hierarchy, spacing, responsive layout, and professional presentation—in `src/App.tsx`, `src/App.css`, and `src/index.css`
- [ ] T051 Run `$speckit-converge` against `specs/001-fx-margin-dashboard/spec.md`, `plan.md`, and this `tasks.md`, then append any genuine remaining work to `specs/001-fx-margin-dashboard/tasks.md`
- [ ] T052 Re-run all test, lint, build, quickstart, and public smoke checks from repository root `.`; commit and push the verified final state to the configured GitHub remote

---

## Dependencies & Execution Order

### Critical path to first public deployment

```text
Phase 1 Setup
  -> Phase 2 Financial Domain
  -> US1 Inputs/Reference
  -> US2 Comparison
  -> US3 Profit Cliff
  -> US4 Safe Bid
  -> US5 Decision/Trust
  -> Phase 8 Vertical Slice + Deploy
  -> Phase 9 Post-Deployment Only
```

### User Story Dependencies

- **US1** depends on the Phase 2 types, validation, and calculation boundary.
- **US2** depends on US1 canonical order/reference state and Phase 2 payment calculations.
- **US3** depends on US2 option selection and Phase 2 scenario calculations.
- **US4** depends on US3 selected scenario state but is independently hand-testable from explicit inputs.
- **US5** consumes US2–US4 results; its pure statement builder remains independently testable.
- **Phase 8** depends on every story checkpoint because the requested first deployment is the full golden flow.
- **Phase 9** MUST NOT block Phase 8 and starts only after the public smoke test passes.

### Within each phase

- Write formula tests before `fxMath.ts`; confirm they fail for missing behavior, then make them pass.
- Complete domain/state work before wiring presentation components.
- Do not mark a story checkpoint complete until its independent test passes.
- Never include estimated/unknown amounts in disclosed totals to unblock a UI result.
- T038–T041 are sequential because each external checkpoint depends on the prior verified state.

## Parallel Opportunities (Solo-Safe)

- **Setup**: T003 and T004 touch separate files after T002 defines the test dependency.
- **Foundation**: T006 and T007 can proceed after T005 because fixtures and validation are separate.
- **US1**: T012 and T013 are separate UI/service files after T011 establishes state.
- **US5**: T030 and T031 can proceed while deterministic lens work occurs in T028–T029.
- **Post-deployment**: T045–T048 cover separate files after T042–T043.
- Other tasks intentionally remain sequential to reduce merge/rework risk for a solo six-hour build.

## Parallel Examples

### User Story 1

```text
Task T012: Build order and manual reference controls in src/components/OrderInputs.tsx
Task T013: Build the optional reference adapter in src/services/bankOfCanada.ts
```

### User Story 5

```text
Task T030: Add educational note in src/components/ShariaNote.tsx
Task T031: Complete trust definitions in src/components/TrustLegend.tsx
```

### Post-deployment

```text
Task T045: Test inputs/fallback in src/components/OrderInputs.test.tsx
Task T046: Test comparison/trust in src/components/PaymentComparison.test.tsx
Task T048: Complete product documentation in README.md
```

## Implementation Strategy

### Six-hour MVP

1. Finish Phase 2 first; financial correctness is the gate for all visuals.
2. Build US1–US5 in order with minimal styling and validate each checkpoint.
3. At T035, stop feature work and exercise the entire judge story as one vertical slice.
4. Spend remaining pre-deployment time only on release-blocking usability, correctness, and build issues.
5. Checkpoint, push, deploy, and smoke-test before beginning any P2 task.

### Scope control

- No database, authentication, state library, backend, provider integration, realtime rates,
  additional currency, prediction, AI, or payment execution task is authorized.
- The only external read is the optional Bank of Canada reference request; its failure cannot block use.
- A working public golden flow is more valuable than additional abstractions or broad test coverage.

## Notes

- `[P]` means genuinely safe file-level parallelism, not merely theoretical concurrency.
- User-story labels preserve traceability to `spec.md`; Phase 8/9 tasks are cross-cutting.
- Git push and Vercel deployment require credentials and may require user approval when executed;
  T039 and T040 explicitly verify the minimum required configuration rather than assuming it exists.
- Commit at the explicit pre-deployment checkpoint; additional commits may group coherent completed work.

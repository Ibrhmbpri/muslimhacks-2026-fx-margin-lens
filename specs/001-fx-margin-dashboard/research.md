# Phase 0 Research: FX Margin Lens MVP

## Frontend-only architecture

**Decision**: Keep the existing React, TypeScript, and Vite application as a static, client-only
single page with in-memory state.

**Rationale**: Every authoritative input is either entered by the user or read from a public,
keyless reference service. A backend, persistent store, global state package, or form framework adds
delivery risk without strengthening the golden flow.

**Alternatives considered**: A serverless proxy could insulate the external request, but it adds an
unnecessary backend and deployment surface. A database could retain scenarios, but persistence is an
explicit non-goal.

## Financial calculation boundary

**Decision**: Implement conversion, spread impact, disclosed cost, profit, margin, Profit Cliff, and
Safe Bid as pure TypeScript functions returning explicit valid or invalid result types.

**Rationale**: Pure functions make currency direction visible, prevent UI/network state from changing
math, and allow independent hand-calculated tests. Full JavaScript number precision is retained for
calculations; formatting occurs only at display boundaries.

**Alternatives considered**: Calculating inline in components is faster initially but duplicates
formulas and weakens verification. A decimal arithmetic library is unnecessary at MVP invoice scale
when results are presented as decision support to cents and all comparisons use unrounded values.

## Cost trust model

**Decision**: Represent cost status as a discriminated union: known values require a CAD amount;
estimated values require a range and source; unknown values prohibit an amount and may include a
reason.

**Rationale**: The type model makes fabricated precision structurally difficult and allows disclosed
totals to include only known costs. The initial demo uses known fixed fees and explicit unknown
intermediary/receiving fees; it introduces no unsupported estimate.

**Alternatives considered**: Nullable numeric fees blur zero and unknown. Defaulting unavailable fees
to zero violates the constitution and can produce false comparisons.

## Reference-rate integration

**Decision**: Optionally request the latest observation from the Bank of Canada Valet daily series
`FXUSDCAD`, using the JSON observations endpoint with a recent-result limit. Parse the observation
date and numeric value defensively, apply a short timeout, and retain the existing manual rate on
HTTP, network, timeout, empty-data, or schema failure.

**Rationale**: The Bank of Canada documents Valet as a public service for exchange-rate data, with no
registration or access key. It advises careful retries/caching because daily series update once per
day. A single user-triggered/latest request is sufficient for this MVP. The series direction matches
the product convention: CAD per US dollar. Source: [Bank of Canada Valet API](https://www.bankofcanada.ca/valet/docs/)
and [official how-to guide](https://www.bankofcanada.ca/valet-api-how-to/).

**Alternatives considered**: Realtime market feeds conflict with scope and do not represent a
guaranteed transaction quote. Treating the reference request as required would break the golden flow.
Embedding a build-time rate would become stale and obscure provenance.

## Test strategy

**Decision**: Add Vitest for table-driven pure-function tests, React Testing Library for user-visible
state and accessibility behavior, and one focused Playwright golden-flow test. Keep build and lint as
release gates.

**Rationale**: Unit fixtures establish calculation correctness quickly; component tests cover the
trust language and invalid states; Playwright proves the three-minute story and responsive flow after
the first deployment. The tools align with the current TypeScript/Vite browser project.

**Alternatives considered**: Browser tests alone are slower to diagnose and insufficient for formula
boundaries. Unit tests alone cannot verify threshold communication, manual fallback, or user flow.

## Interaction and accessibility

**Decision**: Pair the scenario slider with a numeric input, textual above/at/below-target status,
and an always-visible threshold value. Use semantic sections, native labels, keyboard-accessible
controls, live result announcements where useful, and status cues combining text, icon/shape, and
color.

**Rationale**: A slider makes the Profit Cliff demonstrable while exact entry supports hand checks.
Redundant cues meet the requirement that threshold crossing not rely on color and keep the story
clear to non-finance users.

**Alternatives considered**: A chart adds time and visual complexity without improving the core
three-minute decision. Color-only cards are inaccessible and ambiguous.

## Educational content sourcing

**Decision**: Keep the Sharia-aware content to a short, clearly non-advisory note with links to
credible institutional or standards-based Islamic-finance sources; finalize exact citations during
content verification before public presentation.

**Rationale**: This preserves visible responsibility without implying certification, collapsing
scholarly disagreement, or distracting from the financial workflow.

**Alternatives considered**: A compliance score or badge would overclaim. A long explainer would
expand scope and weaken the dashboard hierarchy.

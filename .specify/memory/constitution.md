<!--
Sync Impact Report
- Version change: scaffold (unratified) -> 1.0.0
- Modified principles: placeholder principles -> five initial project principles
- Added sections: MVP Boundaries; Delivery and Verification
- Removed sections: none
- Follow-up TODOs: none
-->
# FX Margin Lens Constitution

## Core Principles

### I. Financial Correctness First
Core calculations MUST be deterministic, independently testable with hand-calculated examples,
and correct before visual sophistication. USD/CAD MUST always mean `1 USD = X CAD`; the
direction MUST never be reversed.

### II. Known, Estimated, Unknown
Every payment cost MUST be labeled **KNOWN**, **ESTIMATED**, or **UNKNOWN**. Exact values require
supporting data; estimates require a defensible source or benchmark; hidden or intermediary costs
MUST remain explicitly unknown. The product MUST NOT manufacture precision or claim a guaranteed
cheapest provider when costs are incomplete; use language such as "lowest disclosed cost."

### III. Decision Support, Not Prediction
Profit Cliff and Safe Bid / Safe Selling Price are the central capabilities. User-controlled rate
scenarios MUST display: **"Scenario analysis — not an exchange-rate prediction."** Results MUST be
explained through a plain-language Decision Lens and MUST NOT constitute AI financial advice.

### IV. Golden Flow Governs Scope
Every major feature MUST strengthen this judge flow: Canadian business owes a USD supplier;
establish reference USD/CAD; enter the actual bank or payment quote; expose FX spread and disclosed
fees; identify estimated and unknown costs; calculate order profit and margin; simulate USD/CAD
scenarios; cross the Profit Cliff; calculate Safe Bid; explain the decision plainly. Features that
do not strengthen this flow MUST be deferred from the initial MVP.

### V. Narrow, Resilient, Responsible MVP
The product MUST use a one-page, solo-friendly architecture and remain deployable to Vercel from
early development. A Bank of Canada rate MAY be used only as a reference, never as a guaranteed
transaction rate; manual-rate fallback is mandatory and the golden flow MUST survive request
failure. Secrets and credentials MUST never be committed. Sharia content MUST remain small,
educational, responsibly sourced, cautious about legitimate scholarly disagreement, and MUST NOT
be presented as certification or a fatwa.

## MVP Boundaries

The initial public MVP targets an approximately six-hour build. It MUST NOT include a database,
authentication, Supabase, payment execution, bank connectivity, realtime FX streaming, an
unnecessary backend, or AI financial advice. Reliability and polish of the golden flow take
priority over additional features.

## Delivery and Verification

Initial public deployment is the first milestone. Before deployment, the production build and
golden flow MUST work with manual rates and external-rate failure. After deployment, work MUST
prioritize, in order: verification; Playwright golden-flow coverage; Profit Cliff and Safe Bid
polish; professional UX; README and disclosures; sponsor credibility; pitch and rehearsal. Scope
expansion comes only after these priorities are adequately addressed.

Every specification, plan, task list, and review MUST verify currency direction, cost labels,
scenario disclaimer, golden-flow contribution, deterministic calculation coverage, fallback
behavior, secret handling, and MVP boundaries.

## Governance

This constitution supersedes conflicting project practices. Amendments MUST be documented in this
file with an updated Sync Impact Report, semantic version, and amendment date. MAJOR versions cover
incompatible principle removals or redefinitions; MINOR versions add or materially expand
governance; PATCH versions clarify without changing meaning. As a solo project, the owner approves
amendments and MUST review constitution compliance before merging or deploying material changes.
Any exception MUST be explicitly documented with its rationale and remediation plan.

**Version**: 1.0.0 | **Ratified**: 2026-09-05 | **Last Amended**: 2026-09-05

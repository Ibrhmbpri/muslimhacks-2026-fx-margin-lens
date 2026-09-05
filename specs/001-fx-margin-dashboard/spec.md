# Feature Specification: FX Margin Lens MVP

**Feature Branch**: `001-fx-margin-dashboard`

**Created**: 2026-09-05

**Status**: Implemented / Final

**Input**: User description: "Create a one-page MVP decision dashboard for a Canadian importer to compare USD supplier payment quotes, understand disclosed and unknown costs, test USD/CAD scenarios, find the Profit Cliff, and calculate a Safe Bid."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand Order Economics (Priority: P1)

As a Canadian importer, I enter my USD supplier invoice, expected CAD revenue, other CAD order
costs, target margin, and a reference USD/CAD rate so I can understand the order's baseline
economics without finance expertise.

**Why this priority**: These inputs establish the financial model used by every later decision.

**Independent Test**: Use the editable demo inputs with no external connection and verify that the
dashboard clearly identifies the currency convention, reference value, order costs, profit, and
margin.

**Acceptance Scenarios**:

1. **Given** the dashboard opens, **When** no values have been edited, **Then** the complete demo
   scenario is visible, editable, and labeled as demonstration data rather than verified pricing.
2. **Given** valid order inputs, **When** any value changes, **Then** all affected money and margin
   results update consistently using `1 USD = X CAD`.
3. **Given** the external reference source is unavailable, **When** the user supplies a manual
   reference rate, **Then** the complete decision flow remains usable.

---

### User Story 2 - Compare Disclosed Payment Costs (Priority: P1)

As an importer with two payment quotes, I compare their conversion costs, rate spreads, disclosed
fees, order profit, and margin so I can identify the lowest disclosed cost without assuming that
unavailable fees are zero.

**Why this priority**: Quote comparison turns raw provider rates into an actionable order-level
business decision.

**Independent Test**: Enter two provider names, rates, and known fees and verify each result by hand
against the reference rate, including explicit unknown intermediary or receiving-bank costs.

**Acceptance Scenarios**:

1. **Given** two valid quotes, **When** the comparison is displayed, **Then** each option shows
   supplier conversion cost, FX spread impact, known fees, disclosed payment cost versus reference,
   order profit, and profit margin.
2. **Given** one option has the smaller disclosed cost and either option has unknown costs, **When**
   the result is summarized, **Then** it says "Lowest disclosed cost" and does not claim a
   guaranteed cheapest option.
3. **Given** an intermediary or receiving-bank fee cannot be known before transfer, **When** costs
   are displayed, **Then** that fee remains visibly **UNKNOWN** and no invented amount enters a
   total.

---

### User Story 3 - Find the Profit Cliff (Priority: P1)

As an importer, I select a payment option and vary its effective USD/CAD scenario rate so I can see
when the order ceases to meet my target margin.

**Why this priority**: The Profit Cliff is a central differentiator and directly answers how much FX
headroom the order has.

**Independent Test**: Select one option, move the scenario rate below, to, and above the calculated
cliff, and verify supplier cost, profit, margin, and target status with hand calculations.

**Acceptance Scenarios**:

1. **Given** a selected option and valid inputs, **When** the scenario rate changes, **Then** supplier
   cost, profit, margin, and target status update immediately.
2. **Given** the scenario equals the Profit Cliff, **When** results are displayed, **Then** calculated
   margin equals the target margin within the product's displayed rounding tolerance.
3. **Given** the scenario crosses the Profit Cliff, **When** target status changes, **Then** the
   crossing is visually obvious and understandable without relying on color alone.
4. **Given** any scenario analysis is visible, **Then** the exact statement
   **"Scenario analysis — not an exchange-rate prediction."** is also visible.

---

### User Story 4 - Calculate a Safe Bid (Priority: P1)

As an importer, I see the minimum CAD selling price required at the selected scenario rate so I can
preserve my target margin when preparing or revising a customer price.

**Why this priority**: Safe Bid converts FX risk into a concrete pricing decision.

**Independent Test**: Set a scenario rate and target margin, calculate total known cost and minimum
revenue by hand, and compare the result and plain-language explanation.

**Acceptance Scenarios**:

1. **Given** valid selected-option costs, scenario rate, and target margin, **When** Safe Bid is
   shown, **Then** it equals total known cost divided by one minus the target margin.
2. **Given** a valid Safe Bid, **When** the result is explained, **Then** it states the minimum CAD
   charge needed to preserve the target margin and does not imply unknown fees are included.
3. **Given** a target margin that makes the formula invalid, **When** Safe Bid is requested, **Then**
   no misleading amount is shown and the user receives a corrective explanation.

---

### User Story 5 - Read the Decision and Trust Boundaries (Priority: P2)

As a non-finance owner, I read a concise deterministic Decision Lens, cost-status explanation, and
small Sharia-aware educational note so I can understand both the result and its limits.

**Why this priority**: Clear interpretation and cautious disclosures make the calculations usable
and credible, while remaining subordinate to the core workflow.

**Independent Test**: Review summaries for above-target, below-target, and unknown-cost cases and
confirm every statement follows directly from displayed inputs and calculations.

**Acceptance Scenarios**:

1. **Given** valid comparison and scenario results, **When** the Decision Lens appears, **Then** it
   explains lowest disclosed cost, reference-rate difference, FX headroom, target status, and Safe
   Bid as applicable.
2. **Given** unknown costs exist, **When** the Decision Lens appears, **Then** it explicitly says
   complete cost certainty is unavailable.
3. **Given** the Sharia-aware note is viewed, **Then** it is brief, educational, source-oriented,
   acknowledges scholarly differences, recommends qualified guidance, and makes no certification
   or fatwa claim.

### Edge Cases

- Zero or negative invoice, revenue, rate, or costs are rejected with field-specific guidance;
  zero other costs and zero known payment fees remain valid.
- Target margin accepts only a valid percentage below 100%; values at or above 100%, negative
  values, and non-numeric values do not produce Profit Cliff or Safe Bid results.
- If the Profit Cliff numerator is zero or negative, the dashboard explains that no positive
  effective rate can preserve the requested target under the entered economics.
- If the invoice amount is zero, Profit Cliff is undefined and no division is attempted.
- If expected CAD revenue is zero, margin is undefined and no misleading percentage is displayed.
- A quoted rate better than the reference produces a negative spread impact and is labeled clearly
  rather than forced to zero.
- Equal disclosed costs produce a tie; no option is declared lower.
- Very large valid inputs and decimal rates remain readable and do not silently overflow or truncate.
- Rounding affects display only; comparisons and threshold status use unrounded calculation values.
- Reference-rate retrieval failure, delay, or malformed data leaves manual entry available and does
  not block quote comparison, Profit Cliff, Safe Bid, or Decision Lens.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The product MUST present the MVP as one coherent decision dashboard usable at desktop
  and mobile widths.
- **FR-002**: The product MUST use `1 USD = X CAD` as the sole currency convention and MUST label
  rates so they cannot reasonably be interpreted in reverse.
- **FR-003**: Users MUST be able to edit the USD invoice, expected CAD revenue, other CAD order
  costs, and target profit margin.
- **FR-004**: The initial state MUST contain these editable demo values: US$20,000 invoice,
  C$33,000 revenue, C$1,000 other costs, 12% target margin, 1.35 reference rate, Canadian Bank at
  1.39 with C$30 fee, and FX Specialist at 1.375 with C$20 fee. It MUST label them as demonstration
  inputs, not verified market or provider facts.
- **FR-005**: Users MUST always be able to enter or override the reference USD/CAD rate manually.
- **FR-006**: The product MAY offer the Bank of Canada USD/CAD value when available, but MUST label
  it as a reference rate rather than a guaranteed transaction rate and identify its effective date.
- **FR-007**: Failure to obtain an external reference value MUST be explained without blocking any
  calculation that can use a manual rate.
- **FR-008**: Users MUST be able to edit exactly two payment options, each with a name, effective
  USD/CAD quote, and known fixed CAD transfer fees.
- **FR-009**: For each payment option, supplier conversion cost MUST equal the USD invoice multiplied
  by that option's effective USD/CAD rate.
- **FR-010**: For each option, reference supplier value MUST equal the USD invoice multiplied by the
  reference USD/CAD rate.
- **FR-011**: For each option, FX spread impact versus reference MUST equal supplier conversion cost
  minus reference supplier value.
- **FR-012**: For each option, disclosed payment cost versus reference MUST equal FX spread impact
  plus known fixed payment fees.
- **FR-013**: For each option, order profit MUST equal CAD revenue minus supplier conversion cost,
  known fixed payment fees, and other known CAD order costs.
- **FR-014**: For each option, profit margin MUST equal order profit divided by CAD revenue when CAD
  revenue is greater than zero.
- **FR-015**: Payment costs MUST be visibly classified as **KNOWN**, **ESTIMATED**, or **UNKNOWN**;
  estimates MUST display their cited benchmark or range.
- **FR-016**: Unreliable intermediary-bank and receiving-bank fees MUST be permitted to remain
  **UNKNOWN**, MUST NOT be assigned a fabricated amount, and MUST NOT be included in disclosed totals.
- **FR-017**: The comparison MUST use "Lowest disclosed cost" when identifying the smaller disclosed
  result and MUST disclose when unknown costs prevent a guaranteed overall comparison.
- **FR-018**: Users MUST be able to select either payment option for deeper analysis.
- **FR-019**: The selected option MUST have an interactive effective USD/CAD scenario control that
  also permits precise manual entry.
- **FR-020**: Scenario results MUST show supplier cost, order profit, profit margin, and whether the
  target margin is achieved.
- **FR-021**: All scenario results MUST display
  **"Scenario analysis — not an exchange-rate prediction."**
- **FR-022**: Profit Cliff MUST equal
  `(CAD revenue × (1 − target margin) − known fixed fee − other known CAD costs) ÷ USD invoice`.
- **FR-023**: The Profit Cliff threshold and the selected scenario's position relative to it MUST be
  prominent, and crossing it MUST be apparent without relying only on color.
- **FR-024**: At a selected scenario rate, total known cost MUST equal USD invoice multiplied by the
  scenario rate, plus the selected option's known fixed fee and other known CAD costs.
- **FR-025**: Safe Bid MUST equal total known cost divided by one minus target margin and MUST be
  explained as the minimum CAD selling price required to preserve that target using known costs.
- **FR-026**: Invalid or impossible Profit Cliff, margin, or Safe Bid cases MUST suppress misleading
  outputs and explain which input must change.
- **FR-027**: Calculations MUST be deterministic, use unrounded values internally, and apply a
  consistent disclosed display-rounding convention to CAD values and percentages.
- **FR-028**: The Decision Lens MUST derive statements only from user inputs and deterministic
  calculations; it MUST NOT use prediction or generative content.
- **FR-029**: The Decision Lens MUST summarize applicable disclosed-cost ranking, selected quote
  difference from reference, remaining FX headroom, target status, Safe Bid, and cost uncertainty.
- **FR-030**: The product MUST explain the meanings of **KNOWN**, **ESTIMATED**, and **UNKNOWN** in
  plain English near the decision workflow.
- **FR-031**: A small Sharia-aware section MUST explain that transaction structure matters more than
  a generic badge, acknowledge legitimate scholarly differences, cite credible Islamic-finance
  sources, recommend qualified advice for specific arrangements, and disclaim certification/fatwa.
- **FR-032**: Primary money values, profit margin, Profit Cliff, scenario status, and unknown costs
  MUST be visually emphasized and understandable without specialist terminology.
- **FR-033**: Input changes MUST update dependent results without requiring the user to restart or
  navigate away from the dashboard.
- **FR-034**: The MVP MUST NOT provide accounts, stored user records, payment execution, bank
  connections, live provider quotes, realtime FX, forecasting, AI advice, multi-currency workflows,
  hedging, accounting/CRM integration, or multiple user roles.
- **FR-035**: The complete manual-input golden flow MUST remain functional when every external
  request fails.

### Key Entities *(include if feature involves data)*

- **Order Economics**: USD supplier invoice, expected CAD customer revenue, other known CAD order
  costs, and target profit margin supplied by the user.
- **Reference Rate**: A USD/CAD benchmark value, its manual or external origin, effective date when
  available, and the disclosure that it is not a guaranteed transaction rate.
- **Payment Option**: Editable provider label, quoted effective USD/CAD rate, known fixed CAD fees,
  cost-status information, and calculated order results.
- **Cost Item**: A payment-related cost with a KNOWN, ESTIMATED, or UNKNOWN status; estimated items
  also carry a defensible source or benchmark, while unknown items carry no invented amount.
- **Scenario**: Selected payment option and user-controlled effective USD/CAD rate used to calculate
  scenario cost, profit, margin, target status, Profit Cliff position, and Safe Bid.
- **Decision Lens**: Plain-language statements deterministically derived from comparison, scenario,
  and uncertainty results.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time judge can complete the full golden flow using demo or manual inputs in
  under 3 minutes without finance assistance.
- **SC-002**: For a suite of hand-calculated normal, boundary, invalid, and impossible examples,
  100% of conversion cost, spread, disclosed cost, profit, margin, Profit Cliff, and Safe Bid results
  match the specified formulas within the disclosed display-rounding tolerance.
- **SC-003**: In usability review, all evaluators correctly identify the rate convention as
  `1 USD = X CAD`, and none interpret the displayed rate in reverse.
- **SC-004**: All golden-flow tasks remain completable using manual inputs during a simulated total
  external-service failure.
- **SC-005**: Every displayed payment cost has exactly one visible trust status, and 100% of unknown
  costs remain amount-free and excluded from disclosed totals.
- **SC-006**: Users can compare two payment options and identify the lowest disclosed cost or a tie
  on their first attempt, while also recognizing when unknown costs limit certainty.
- **SC-007**: Changing the scenario rate produces perceptible updated results and target status
  within 1 second under normal use.
- **SC-008**: In threshold testing immediately below, at, and above the Profit Cliff, 100% of cases
  show the correct target status and an obvious accessible crossing state.
- **SC-009**: The scenario disclaimer is visible in 100% of states where scenario results appear.
- **SC-010**: The dashboard is fully usable without horizontal scrolling at representative mobile
  and desktop widths, with all primary inputs and results reachable and readable.
- **SC-011**: The production release completes its build checks and can be publicly deployed to the
  target hosting environment before judging.
- **SC-012**: The Decision Lens contains no statement unsupported by displayed inputs or specified
  deterministic calculations across all acceptance scenarios.

## Assumptions

- The MVP serves one Canadian business evaluating one USD supplier invoice and two payment options
  at a time; no data persists after the current session unless the browser itself retains form state.
- All entered rates are effective USD/CAD rates quoted as CAD required for one USD.
- Known fixed payment fees and other order costs are entered in CAD and are assumed payable once per
  order; taxes and duties may be included by the user in other costs but are not modeled separately.
- The owner supplies truthful quote details; the MVP does not verify provider claims or guarantee
  execution at an entered rate.
- No estimated fee is required for the initial demo. Estimated values appear only when a defensible
  cited benchmark is available; otherwise the cost remains unknown.
- CAD amounts display to two decimal places, margins to two percentage points, and USD/CAD rates to
  four decimal places; full available precision remains the basis for calculations and comparisons.
- Credible educational citations can be reviewed and finalized before public presentation without
  expanding the Sharia-aware section into a compliance assessment.
- The public MVP is informational decision support only and does not replace financial, legal,
  accounting, tax, or qualified scholarly advice.

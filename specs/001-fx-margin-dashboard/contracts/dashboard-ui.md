# Contract: One-Page Dashboard

## Information order

1. Purpose, currency convention, and demo-data disclosure
2. Order and reference-rate inputs
3. Two-option payment comparison
4. Selected-option scenario and expected profit/margin
5. Profit Cliff and target status
6. Safe Bid
7. Decision Lens
8. KNOWN / ESTIMATED / UNKNOWN explanation
9. Compact Sharia-aware educational note and general disclaimers

## Input behavior

- Every input has a persistent visible label, currency/unit hint, and field-level invalid message.
- Numeric entry does not silently invert, clamp, or reinterpret a rate.
- The scenario slider and numeric field represent the same value and remain synchronized.
- Selecting either payment option immediately redirects scenario calculations to that option.

## Output behavior

- CAD values use `C$`; USD invoice values use `US$`; rates say CAD per USD.
- Comparison rows expose the exact components rather than only a single total.
- Cost badges always include status text; unknown items display no dollar placeholder.
- Threshold state includes words/symbols in addition to color and announces meaningful changes.
- Scenario output always includes the exact non-prediction disclaimer.
- Invalid derived results show an explanation in place of the number.

## Responsive and accessibility behavior

The golden flow remains in the same semantic order at mobile and desktop widths. Multi-column cards
may stack, but labels and values remain paired and no primary content requires horizontal scrolling.
All controls support keyboard operation, focus is visible, headings describe regions, and dynamic
status changes are exposed without repeatedly interrupting the user.

# Contract: Optional Reference Rate

## Request

`GET https://www.bankofcanada.ca/valet/observations/FXUSDCAD/json?recent=1`

No credential is required or permitted. At most one automatic load and user-initiated retries are
needed; repeated polling is out of scope.

## Accepted response

The adapter accepts a successful JSON response containing a non-empty `observations` list. The
latest observation must contain:

- `d`: an ISO observation date;
- `FXUSDCAD.v`: a string parseable as a finite number greater than zero.

It returns `{ cadPerUsd, observationDate, source: "bank-of-canada" }`. The value is displayed as a
reference, never a guaranteed transaction rate.

## Failure behavior

Timeout, network/CORS error, non-success status, invalid JSON, empty observations, or invalid fields
all return one non-throwing failure state to the UI. The adapter MUST NOT replace the last valid
manual value on failure. The dashboard explains that the reference could not be loaded and invites
manual entry; every downstream calculation remains available.

## Boundary

Only the adapter knows the external payload shape. Domain calculations accept a normalized positive
`cadPerUsd` and never call the network.

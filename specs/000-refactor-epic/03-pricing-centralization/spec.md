# Pillar Specification: Pricing Centralization

**Parent Epic**: [000-refactor-epic](../spec.md)
**Goal**: Move business logic to Backend.

## Key Changes
*Draft Plan - To be refined during execution*

1.  **Backend**: Create `masterRates.ts` with base prices (sqft rates, hourly labor, material markup).
2.  **API**: Expose `GET /config/pricing` (or calculate on `POST /estimate`).
3.  **Frontend**: Remove local rate constants. Update Redux to use async thunks for calculation or fetching rates at startup.

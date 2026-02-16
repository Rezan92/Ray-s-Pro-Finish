# Research: Painting Estimator Refactor

**Status**: Phase 0 Complete
**Date**: 2026-02-08

## 1. Needs Clarification Resolution

All requirements were clarified in the Spec phase.
*   **Source of Truth**: `masterRates.ts` will strictly mirror `rates-reference.md`.
*   **Calculation Order**: Time first (`Man-Hours`), then Price (`Hours * $75`).
*   **Stairwell Logic**: Backend will have specific rates for `Square` (12m) vs `Intricate` (30m) spindles. Frontend must send this classification.
*   **Material Breakdown**: Backend must accumulate gallons per surface type (`wallGallons`, `ceilingGallons`, etc.) specifically for the `Admin View`.

## 2. Technical Decisions

### 2.1 Backend Calculation Engine
**Decision**: Refactor `paintingService.ts` to use a `CalculationContext` object that accumulates both hours and cost line-by-line.
**Rationale**:
*   Using a simple `totalCost += x` loop hides the "Man-Hour" derivation.
*   We need to store `hours` per line item to display in the Admin Breakdown (F-015).
*   **Structure**:
    ```typescript
    interface BreakdownItem {
      name: string;
      hours: number;
      cost: number;
      details: string; // "400 sqft @ 400sqft/hr..."
    }
    ```

### 2.2 Shared Types Strategy
**Decision**: Create a unified `PaintingRoom` interface in `EstimatorTypes.ts` (or `types.ts`) that is shared/copied to both Client and Server.
**Rationale**:
*   Ensures the Frontend `Exact Dimensions` fields (`exactLength`, `exactWidth`) exactly match what the Backend expects.
*   Prevents "magic string" errors for new fields like `stairSpindleType`.

### 2.3 Exact Dimensions vs Presets
**Decision**: Frontend Logic:
*   If `exactLength` && `exactWidth` > 0, use them.
*   Else, lookup dimensions from `ROOM_DIMENSIONS[type][size]`.
**Rationale**: Keeps the UI flexible. Users can start with a preset and refine it, or go straight to exacts.

### 2.4 Workday & Trip Calculation
**Decision**:
1.  Sum `Total Labor Hours` for the whole project.
2.  `Project Days = Math.ceil(Total Hours / 8)`.
3.  `Trip Cost = Project Days * 0.75 hours * $75`.
**Rationale**: This accurately reflects the "Daily Setup" cost scaling with job size, unlike the previous per-room or flat-fee models.

## 3. Best Practices
*   **Rounding**: Round **Hours** to 1 or 2 decimal places for display clarity. Round **Cost** to nearest dollar (or cent) at the very end.
*   **Testing**: Unit tests in `paintingService.test.ts` must verify the "Standard Room" (SC-001) exactly matches the manual calculation.
# Tasks: Painting Estimator Refactor (Man-Hour Driven)

**Feature**: `008-painting-man-hour-pricing-refactor`
**Status**: Pending

## Phase 1: Setup & Contracts (Shared)

- [x] T001 Update `EstimatorTypes.ts` (Client) with new fields (exact dimensions, stairwell logic, trim conversion).
- [x] T002 [P] Update `types.ts` (Server) to match the new `PaintingRoom` interface exactly.
- [x] T003 Migrate all painting rates, multipliers, and production constants from `rates-reference.md` to `server/src/modules/estimator/constants/masterRates.ts`.

## Phase 2: Foundational (Backend Engine)

- [ ] T004 Create `CalculationContext` helper in `paintingService.ts` to accumulate hours/cost line-by-line.
- [ ] T005 [P] Implement `calculateWallHours` logic (Rolling, Cutting, Prep, Color Change) in `paintingService.ts`.
- [ ] T006 [P] Implement `calculateCeilingHours` logic (Texture, Height Multiplier) in `paintingService.ts`.
- [ ] T007 [P] Implement `calculateTrimHours` logic (Baseboards, Crown, Conversion, Doors, Windows) in `paintingService.ts`.
- [ ] T008 [P] Implement `calculateStairwellHours` logic (Spindles, Handrails, Steps) in `paintingService.ts`.
- [ ] T009 Implement "Global Add-ons" logic (Workday calc, Daily Trip, Equipment Rental) in `paintingService.ts`.
- [ ] T010 Refactor main `calculatePaintingEstimate` function to use new helpers and return detailed breakdown (F-015).

## Phase 3: Frontend UI Implementation

- [ ] T011 [P] [US1] Update `PaintingRoomCard.tsx` to add "Exact Dimensions" (L/W/H) inputs and override logic.
- [ ] T012 [P] [US1] Update `PaintingRoomCard.tsx` with specific Stairwell inputs (Spindle Type, Count, Handrail).
- [ ] T013 [P] [US1] Update `PaintingRoomCard.tsx` with new Trim/Crown options (Stained-to-Painted, Crown Style).
- [ ] T014 [US3] Update `PaintingForm.tsx` to include Global Occupancy & Furniture dropdowns (Project Defaults).

## Phase 4: Integration & Verification

- [ ] T015 [US1] Verify Admin Breakdown output includes detailed math explanations (e.g., "400 sqft @ 150sqft/hr").
- [ ] T016 [US1] Verify Material Breakdown (Admin Only) correctly sums gallons per surface type.
- [ ] T017 [US1] Create unit test in `server/src/modules/estimator/services/paintingService.test.ts` verifying "Standard Room" calculation (SC-001).

## Dependencies

1.  **T001, T002, T003 (Setup)** MUST be completed before **Phase 2 (Backend)**.
2.  **Phase 2 (Backend)** MUST be completed before **Phase 4 (Integration)**.
3.  **Phase 3 (Frontend)** can be done in parallel with **Phase 2**, but **T011** requires **T001** (Types).

## Parallel Execution Opportunities

*   **T005, T006, T007, T008**: All backend calculation helpers can be implemented simultaneously by different developers.
*   **T011, T012, T013**: Frontend component updates can happen while backend logic is being written, provided Types (T001) are settled.

## Implementation Strategy

1.  **Step 1**: Lock down the Types and Constants (Phase 1).
2.  **Step 2**: Build the Backend Logic (Phase 2) to ensure the math is correct.
3.  **Step 3**: Update the Frontend UI (Phase 3) to send the new data fields.
4.  **Step 4**: Verify the end-to-end flow (Phase 4).
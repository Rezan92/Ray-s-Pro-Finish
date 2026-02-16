# Tasks: Painting Estimator Refactor (Man-Hour Driven)

**Feature**: `008-painting-man-hour-pricing-refactor`
**Status**: In Progress

## Phase 1: Setup & Contracts (Shared)

- [x] T001 Update `EstimatorTypes.ts` (Client) with new fields (exact dimensions, stairwell logic, trim conversion).
- [x] T002 [P] Update `types.ts` (Server) to match the new `PaintingRoom` interface exactly.
- [x] T003 Migrate all painting rates, multipliers, and production constants from `rates-reference.md` to `server/src/modules/estimator/constants/masterRates.ts`.

## Phase 2: Foundational (Backend Engine)

- [x] T004 Create `CalculationContext` helper in `paintingService.ts` to accumulate hours/cost line-by-line.
- [x] T005 [P] Implement `calculateWallHours` logic (Rolling, Cutting, Prep, Color Change) in `paintingService.ts`.
- [x] T006 [P] Implement `calculateCeilingHours` logic (Texture, Height Multiplier) in `paintingService.ts`.
- [x] T007 [P] Implement `calculateTrimHours` logic (Baseboards, Crown, Conversion, Doors, Windows) in `paintingService.ts`.
- [x] T008 [P] Implement `calculateStairwellHours` logic (Spindles, Handrails, Steps) in `paintingService.ts`.
- [x] T009 Implement "Global Add-ons" logic (Workday calc, Daily Trip, Equipment Rental) in `paintingService.ts`.
- [x] T010 Refactor main `calculatePaintingEstimate` function to use new helpers and return detailed breakdown (F-015).

## Phase 3: Frontend UI Implementation

- [x] T011 [P] [US1] Update `PaintingRoomCard.tsx` to add "Exact Dimensions" (L/W/H) inputs and override logic.
- [x] T012 [P] [US1] Update `PaintingRoomCard.tsx` with specific Stairwell inputs (Spindle Type, Count, Handrail).
- [x] T013 [P] [US1] Update `PaintingRoomCard.tsx` with new Trim/Crown options (Stained-to-Painted, Crown Style).
- [x] T014 [US3] Update `PaintingForm.tsx` to include Global Occupancy & Furniture dropdowns (Project Defaults).

## Phase 4: Integration & Verification

- [x] T015 [US1] Verify Admin Breakdown output includes detailed math explanations (e.g., "400 sqft @ 150sqft/hr").
- [x] T016 [US1] Verify Material Breakdown (Admin Only) correctly sums gallons per surface type.
- [x] T017 [US1] Create unit test in `server/src/modules/estimator/services/paintingService.test.ts` verifying "Standard Room" calculation (SC-001).

## Phase 5: Global Config & Inheritance (Refinement)

- [x] T018 [US-Refinement] Update `PaintingForm.tsx` to merge "Furniture" and "Occupancy" into a single global question (Unified Occupancy Logic F-016).
- [x] T019 [US-Refinement] Update `PaintingForm.tsx` to move Scope questions (Walls, Ceiling, Condition, Color Change) to Global level (F-014).
- [x] T020 [US-Refinement] Update `PaintingRoomCard.tsx` to add "Customize this area" checkbox for inheritance/override logic (F-014).
- [x] T021 [US-Refinement] **Redux State**: Update `paintingSlice.ts` to manage `globalDefaults` and the `isCustomized` flag for each room.
- [x] T022 [US-Refinement] Ensure `EstimatorTypes.ts` supports global scope and the inheritance flags.

## Phase 6: UI Polish & Components (Refinement)

- [x] T023 [US-Refinement] Update `PaintingRoomCard.tsx`: Replace "Stained to Painted" with a dropdown (Standard vs Stained-to-Painted) (F-020).
- [x] T024 [US-Refinement] Update `PaintingRoomCard.tsx`: Refine Color Change dropdown options (Refresh, Change, Dark-to-Light) (F-021).
- [x] T025 [US-Refinement] Update `PaintingRoomCard.tsx`: Add "Closet Included?" checkbox logic for Bedrooms (F-022).
- [x] T026 [US-Refinement] Update `PaintingRoomCard.tsx`: Integrate "Enter Exact Dimensions" into standard Size dropdown and convert height to Number Input (F-011).

## Phase 7: Stairwell Specifics & Backend Refinement (Refinement)

- [x] T027 [US-Refinement] Update `PaintingRoomCard.tsx`: Implement specialized Stairwell inputs (Wall Length, Max Wall Height, Remove irrelevant surfaces) (F-012).
- [x] T028 [Backend] Refine `paintingService.ts`: Implement Workday logic (45m per 8hincrement) (F-010).
- [x] T029 [Backend] Refine `paintingService.ts`: Apply 1.5x Trim Multiplier for Stairwells and auto-trigger Equipment Fee if Max Height > 12ft (F-012).

## Dependencies

1.  **Phase 5 (Global)** must be done before **Phase 6 (UI Polish)** to ensure inheritance logic works with new UI fields.
2.  **T021 (Redux)** is a prerequisite for all refinement UI work to ensure state consistency.
3.  **T028/T029 (Backend)** depends on the new data being sent from the refined frontend.

## Implementation Strategy

1.  **Step 1**: Update Redux State and Types (Foundation for refinements).
2.  **Step 2**: Implement Global Config & Inheritance UI.
3.  **Step 3**: Polish Component UI and integrate dimensions.
4.  **Step 4**: Finalize Stairwell specifics and Backend workday refinement.
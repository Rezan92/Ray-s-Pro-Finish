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

- [ ] T018 [US-Refinement] Update `PaintingForm.tsx` to merge "Furniture" and "Occupancy" into a single global question with user-friendly labels (F-017).
- [ ] T019 [US-Refinement] Update `PaintingForm.tsx` to move "What needs painting?", "Surface Condition", and "Color Change" to the Global level (F-018).
- [ ] T020 [US-Refinement] Update `PaintingRoomCard.tsx` to add "Customize this area" checkbox. Logic: Unchecked = inherit global; Checked = show local overrides (F-019).
- [ ] T021 [US-Refinement] Ensure `EstimatorTypes.ts` supports global scope fields (`globalWalls`, `globalCeiling`, etc.).

## Phase 6: UI Polish & Components (Refinement)

- [ ] T022 [US-Refinement] Update `PaintingRoomCard.tsx`: Replace "Stained to Painted" checkbox with a Dropdown (Standard vs Stained-to-Painted) (F-020).
- [ ] T023 [US-Refinement] Update `PaintingRoomCard.tsx`: Refine Color Change dropdown options (Refresh, Change, Dark-to-Light) (F-021).
- [ ] T024 [US-Refinement] Update `PaintingRoomCard.tsx`: Add "Closet Included?" checkbox logic for Bedrooms (F-022).
- [ ] T025 [US-Refinement] Update `PaintingRoomCard.tsx`: Move "Enter Exact Dimensions" into the Size Dropdown and convert Ceiling Height to Number Input (F-023).

## Phase 7: Stairwell Specifics (Refinement)

- [ ] T026 [US-Refinement] Update `PaintingRoomCard.tsx`: Implement specialized Stairwell inputs (Wall Length, Max Height, remove irrelevant surfaces) (F-024).
- [ ] T027 [Backend] Update `paintingService.ts`: Apply 1.5x Trim Multiplier for Stairwells and trigger Equipment Fee if Max Height > 12ft (F-026).

## Dependencies

1.  **Phase 5 (Global)** must be done before **Phase 6 (UI Polish)** to ensure inheritance logic works with new UI fields.
2.  **T027 (Backend)** depends on **T026 (Frontend)** sending the new Stairwell dimensions.

## Implementation Strategy

1.  **Step 1**: Implement Global Config & Inheritance (Phase 5).
2.  **Step 2**: Polish Component UI (Phase 6).
3.  **Step 3**: Refine Stairwell Logic (Phase 7).

# Tasks: Unit Pricing Refactor

**Input**: Design documents from `/specs/009-painting-square-feet-pricing-refactor/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Verify project environment and feature branch `009-painting-square-feet-pricing-refactor`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure and data model updates required for all user stories.

- [x] T002 [P] **Migrate Rates**: Update `server/src/modules/estimator/constants/masterRates.ts`. Replace `PRODUCTION_RATES` with `UNIT_PRICES` mapping for Walls, Ceilings, Trim, Crown, and Misc fees.
- [x] T003 [P] **Update Redux State**: Modify `client/src/store/slices/paintingSlice.ts`. Remove `trimConversion`; add `trimColorChange` and `crownColorChange` to `PaintingRoom` and `GlobalDefaults`.
- [x] T004 [P] **Update Client UI**: Modify `client/src/components/common/estimator/PaintingForm.tsx`. Replace "Stained" toggle with "Color Change" dropdowns for Trim and Crown sections.
- [x] T005 [P] **Helper Implementation**: Add `calculateItemPrice(quantity, unitPrice)` helper to `server/src/modules/estimator/services/paintingService.ts` to implement the "Reverse-Hour" formula ($Hours = Cost / 75$).

**Checkpoint**: Foundation ready - constants, state, and basic UI are in place.

---

## Phase 3: User Story 1 - Standard Wall Refresh (Priority: P1) 🎯 MVP

**Goal**: Implement unit-based wall pricing ($0.58 / $0.94 / $1.36).

**Independent Test**: Select "Refresh" for a room and verify labor cost is $0.58/sqft and hours are derived correctly.

- [x] T006 [US1] Refactor `calculateWallHours` in `server/src/modules/estimator/services/paintingService.ts` to use `UNIT_PRICES.WALLS`.
- [x] T007 [US1] Implement coat-count mapping for Walls: Refresh (1), Change (2), Dark-to-Light (3).
- [x] T008 [US1] Verify wall labor cost and hour derivation ($Cost / 75$).

**Checkpoint**: Wall pricing is functional and independently testable.

---

## Phase 4: User Story 2 - Ceiling Texture Surcharges (Priority: P2)

**Goal**: Implement base ceiling rates + texture multipliers (+15%/+40%).

**Independent Test**: Select "Popcorn" texture and verify +40% surcharge on the base labor rate.

- [x] T009 [US2] Refactor `calculateCeilingHours` in `server/src/modules/estimator/services/paintingService.ts` to use `UNIT_PRICES.CEILINGS`.
- [x] T010 [US2] Apply texture surcharges: Orange Peel (+15%), Popcorn (+40%).
- [x] T011 [US2] Verify ceiling labor cost and hour derivation ($Cost / 75$).

**Checkpoint**: Ceiling pricing with texture surcharges is functional.

---

## Phase 5: User Story 3 - High Ceiling Equipment Rental (Priority: P2)

**Goal**: Track "High Work Hours" and calculate rental days for ladders/scaffolding.

**Independent Test**: Set ceiling height to 15ft and verify Scaffolding rental ($150/day) appears based on labor hours.

- [x] T012 [US3] Implement `highWorkLaborHours` counter in `calculatePaintingEstimate` (paintingService.ts).
- [x] T013 [US3] Logic to increment `highWorkLaborHours` for any wall/ceiling task where `height >= 12`.
- [x] T014 [US3] Calculate rental duration: `Math.ceil(highWorkLaborHours / 8)`.
- [x] T015 [US3] Determine rental rate: $60 (12-15ft) or $150 (15ft+).
- [x] T016 [US3] Add "Equipment Rental" line item to the breakdown.

**Checkpoint**: Equipment rental is correctly calculated and displayed.

---

## Phase 6: User Story 4 - Trim Condition & Detailed Crown (Priority: P3)

**Goal**: Implement coat-based trim/crown pricing + style/condition surcharges.

**Independent Test**: Select "Poor" trim condition and verify $0.35/lf caulking fee line item.

- [x] T017 [US4] Refactor `calculateTrimHours` in `server/src/modules/estimator/services/paintingService.ts` to use `UNIT_PRICES.TRIM` and `UNIT_PRICES.CROWN`.
- [x] T018 [US4] Implement "Poor" trim condition surcharge: standalone line item at $0.35/lf.
- [x] T019 [US4] Implement "Detailed" crown style surcharge: +20% to the base crown labor price.
- [x] T020 [US4] Verify trim/crown labor cost and hour derivation.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [x] T021 [P] Ensure `totalHours` is the sum of all item hours and `totalCost` matches the sum of all item costs.
- [x] T022 [P] Run `npm test server/src/modules/estimator/services/paintingService.test.ts` and fix regressions.
- [x] T023 [P] Final code cleanup and documentation update in `quickstart.md`.

---

## Dependencies & Execution Order

1. **Phase 2 (Foundational)**: MUST be completed first.
2. **Phase 3 (US1)**: Highest priority.
3. **Phases 4, 5, 6**: Can be worked on in parallel once Phase 2 is complete.
4. **Phase 7 (Polish)**: Final verification.

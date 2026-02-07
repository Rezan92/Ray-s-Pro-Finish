# Tasks: Painting Man-Hour Pricing Refactor

**Feature**: Painting Man-Hour Pricing Refactor
**Spec**: [spec.md](spec.md)
**Plan**: [plan.md](plan.md)
**Branch**: `008-painting-man-hour-pricing-refactor`
**Total Tasks**: 16

## Phase 1: Setup & Core Logic
**Goal**: Implement the robust backend calculation engine and centralized rates.

- [ ] T001 [P] Create `server/src/modules/estimator/constants/masterRates.ts` populated with all data from `data-model.md` including the $75/hr base rate.
- [ ] T002 Update `server/src/modules/estimator/types.ts` to include `AdminSummaryItem`, `MasterRates`, and updated `PaintingRoom` interfaces.
- [ ] T003 Implement `server/src/modules/estimator/services/paintingService.ts` with the new man-hour calculation logic (Surface Area * Production Rate * Multipliers).
- [ ] T004 Implement "Daily Trip Constant" logic in `paintingService.ts` (`ceil(TotalHours / 8) * 45 mins`).
- [ ] T005 Implement "Room Default" auto-additions (Masking, Electrical, Floor Protection) in `paintingService.ts`.
- [ ] T006 [P] Update `server/src/modules/estimator/services/aiHelper.ts` to accept structured `AdminSummary` data and use the "High Conversion" prompt blueprint.
- [ ] T007 Update `server/src/modules/estimator/controller.ts` to orchestrate the new service call and return the `{ price, adminSummary, userMessage }` response structure.

## Phase 2: Frontend State & UI
**Goal**: Update the React client to support Global Defaults and Exact Dimensions.

- [ ] T008 [P] Update `client/src/components/common/estimator/EstimatorTypes.ts` to match the backend's expectations (including `isCustom` flag for rooms).
- [ ] T009 Update `client/src/store/slices/paintingSlice.ts` to include `globalDefaults` state and `setGlobalDefaults` / `toggleRoomOverride` actions.
- [ ] T010 Create `client/src/components/common/estimator/GlobalPaintingSettings.tsx` component for selecting project-wide defaults.
- [ ] T011 Update `client/src/components/common/estimator/PaintingForm.tsx` to include the Global Settings component and handle the new state flow.
- [ ] T012 Update `client/src/components/common/estimator/PaintingRoomCard.tsx` to support "Exact Dimensions" mode (Width/Length inputs) and the "Override Defaults" toggle.
- [ ] T013 Update `client/src/pages/estimatorPage/EstimatorPage.tsx` to handle the new response structure (displaying the AI message and storing the Admin Table).

## Phase 3: Verification & Cleanup
**Goal**: Ensure accuracy and remove legacy code.

- [ ] T014 Run a manual regression test: Compare frontend inputs -> backend calculation -> expected price (manually calculated).
- [ ] T015 [P] Verify the Admin Summary table contains all 4 required columns and correct data on the frontend (console log or UI if available).
- [ ] T016 Cleanup any unused constants from old pricing logic files (`paintingConstants.ts` etc.).

## Dependencies
- T001 (Master Rates) blocks T003 (Service Logic).
- T002 (Types) blocks both Backend and Frontend work.
- T003/T004/T005 (Core Math) must be verified before T007 (Controller).
- T009 (Redux) blocks T011 (Form UI).

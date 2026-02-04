# Tasks: Phase 2 Redux Split (Pillar 2)

**Feature**: Phase 2: Redux Split (Pillar 2)
**Spec**: [spec.md](spec.md)
**Plan**: [plan.md](plan.md)
**Branch**: `006-redux-split`
**Total Tasks**: 15

## Phase 1: Setup
**Goal**: Prepare the environment and create shared slices for global state.

- [x] T001 [US1] Create `projectSlice.ts` for shared state (clientId, projectId) in `client/src/store/slices/projectSlice.ts`
- [x] T002 [US3] Create `uiSlice.ts` for global UI state (modals, loading) in `client/src/store/slices/uiSlice.ts`

## Phase 2: Foundational
**Goal**: Establish the new root store structure.

- [x] T003 [US1] Update `store.ts` to include the new `project` and `ui` reducers while keeping `estimator` temporarily in `client/src/store/store.ts`

## Phase 3: Painting Feature Slice (User Story 1 & 2)
**Goal**: Migrate Painting logic to its own slice and implement selectors.
**Independent Test**: Verify Painting form updates state in `painting` slice and total price calculates correctly.

- [x] T004 [US1] Create `paintingSlice.ts` with state and actions migrated from estimatorSlice in `client/src/store/slices/paintingSlice.ts`
- [x] T005 [P] [US2] Create memoized selectors for Painting totals in `client/src/store/slices/paintingSlice.ts`
- [x] T006 [US2] Update `PaintingForm` and child components to use `paintingSlice` actions and selectors in `client/src/components/common/estimator/PaintingForm.tsx`

## Phase 4: Feature Slices Migration (User Story 1 & 2)
**Goal**: Migrate remaining domains (Basement, Garage, Repair, Installation) to specific slices.
**Independent Test**: Verify each form updates its respective slice and persists data.

- [x] T007 [P] [US1] Create `basementSlice.ts` and migrate logic/selectors in `client/src/store/slices/basementSlice.ts`
- [x] T008 [P] [US1] Create `garageSlice.ts` and migrate logic/selectors in `client/src/store/slices/garageSlice.ts`
- [x] T009 [P] [US1] Create `repairSlice.ts` and migrate logic/selectors in `client/src/store/slices/repairSlice.ts`
- [x] T010 [P] [US1] Create `installationSlice.ts` and migrate logic/selectors in `client/src/store/slices/installationSlice.ts`
- [x] T011 [US2] Update `BasementForm`, `GarageForm`, `RepairForm`, and `InstallationForm` components to use new slices in `client/src/components/common/estimator/`

## Phase 5: Component Integration & Cleanup (User Story 1 & 3)
**Goal**: Finalize store integration and remove legacy code.
**Independent Test**: Full application regression test; verify no traces of `estimatorSlice` remain.

- [ ] T012 [US3] Migrate `EstimatorPage` and global UI components to use `uiSlice` for steps and loading state in `client/src/pages/estimatorPage/EstimatorPage.tsx`
- [ ] T013 [US1] Update `store.ts` to include all new feature reducers (`painting`, `basement`, etc.) in `client/src/store/store.ts`
- [ ] T014 [US1] Remove `estimator` reducer from `store.ts` and delete `client/src/store/slices/estimatorSlice.ts`
- [ ] T015 [US1] Run full build and type check to ensure zero errors

## Dependencies

- T001 (Project Slice) and T002 (UI Slice) must be completed first as they are foundational.
- T003 (Store Update) enables testing of new slices.
- Phase 4 tasks (T007-T010) can be executed in parallel.
- T014 (Delete Legacy) must be the final task.

## Implementation Strategy

1.  **Pilot**: Use Painting as the pilot migration (Phase 3) to validate the pattern.
2.  **Parallel**: Once the pattern is proven, migrate other features in parallel.
3.  **Selectors**: Heavily rely on `reselect` for totals to keep state normalized.

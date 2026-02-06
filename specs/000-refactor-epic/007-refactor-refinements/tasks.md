# Tasks: Post-Refactor Refinements & State Consistency

**Feature**: Post-Refactor Refinements (Priority 7)
**Spec**: [spec.md](spec.md)
**Plan**: [plan.md](plan.md)
**Branch**: `007-refactor-refinements`
**Total Tasks**: 8

## Phase 1: Setup
**Goal**: Centralize state definitions.

- [x] T001 [US1] Rename `estimationSlice.ts` to `estimatorSlice.ts` and update reducer name in `client/src/store/slices/estimatorSlice.ts`
- [x] T002 [US1] Move `currentStep` and `errors` from `uiSlice.ts` to `estimatorSlice.ts` in `client/src/store/slices/estimatorSlice.ts`

## Phase 2: Foundational
**Goal**: Cleanup shared UI state.

- [x] T003 [US3] Remove redundant `estimator` object from `uiSlice.ts` interface and initial state in `client/src/store/slices/uiSlice.ts`
- [x] T004 [US1] Update `store.ts` to reflect the slice name change (estimation -> estimator) in `client/src/store/store.ts`

## Phase 3: Component Integration (User Story 1)
**Goal**: Update components to new state structure.

- [x] T005 [US1] Update `EstimatorPage.tsx` selectors to use `state.estimator` for steps and errors in `client/src/pages/estimatorPage/EstimatorPage.tsx`
- [x] T006 [P] [US1] Update any other small components (Progress Bar, Alerts) to use the new state location

## Phase 4: Polish & Optimization (User Story 2)
**Goal**: Code quality sweep.

- [x] T007 [US2] Audit `EstimatorTypes.ts` for unused or duplicated types and cleanup in `client/src/components/common/estimator/EstimatorTypes.ts`
- [x] T008 [US2] Run a project build and check for zero lint/unused warnings

## Dependencies
- Phase 1 must complete before Phase 2.
- Phase 3 depends on store updates in Phase 2.

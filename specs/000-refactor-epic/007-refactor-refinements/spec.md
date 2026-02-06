# Feature Specification: Post-Refactor Refinements & State Consistency

**Feature Branch**: `007-refactor-refinements`
**Created**: 2026-02-04
**Status**: Draft
**Input**: User description: "Implement post-refactor refinements and state consistency improvements"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Centralized Estimator State (Priority: P1)

As a developer, I want all estimator-related state (process, results, and errors) to be managed in a single cohesive slice so that the logic is easier to follow and maintain.

**Why this priority**: Currently, estimator state is fragmented between `uiSlice` (process steps) and `estimationSlice` (results). This creates unnecessary complexity in component selection.

**Independent Test**: Verify that navigation between estimator steps still works, and that form errors are correctly displayed, while the underlying state has been moved.

**Acceptance Scenarios**:

1. **Given** the Estimator wizard is active, **When** I navigate to Step 2, **Then** the `estimator.currentStep` should update in the new centralized slice.
2. **Given** a server error or validation error, **When** it occurs, **Then** it should be stored in the centralized `estimator` slice.

---

### User Story 2 - Code Polish & Optimization (Priority: P2)

As a developer, I want to perform a general sweep of the codebase for unused imports, redundant types, and consistency issues so that the codebase remains high-quality.

**Why this priority**: Post-refactor debris can accumulate. A clean-up pass ensures long-term health.

**Independent Test**: Run a project build and check for zero warnings.

**Acceptance Scenarios**:

1. **Given** the source code, **When** I run a lint check, **Then** zero unused imports or styling variables should remain.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The `estimator` UI state (`currentStep`, `isLoading`, `errors`) MUST be moved from `uiSlice.ts` to a centralized slice.
- **FR-002**: The `estimationSlice.ts` SHOULD be renamed to `estimatorSlice.ts` to reflect its role as the primary orchestrator of the feature.
- **FR-003**: The `uiSlice.ts` MUST be cleaned up to only contain truly global UI state (mobile menu, modals).
- **FR-004**: All components (e.g., `EstimatorPage`, `EstimatorProgressBar`) MUST be updated to use the new state selectors.
- **FR-005**: Redundant or duplicated types in `EstimatorTypes.ts` SHOULD be audited and consolidated.

### Key Entities *(include if feature involves data)*

- **EstimatorState**: `{ currentStep: number, status: 'idle'|'loading'|..., formErrors: Record, estimate: Estimate | null }`

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of fragmented estimator process state is centralized.
- **SC-002**: 0 instances of nested `ui.estimator` selections remain.
- **SC-003**: Build completes with 0 warnings or errors.
- **SC-004**: Core estimator functionality remains 100% identical.
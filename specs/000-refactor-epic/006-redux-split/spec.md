# Feature Specification: Phase 2: Redux Split (Pillar 2)

**Feature Branch**: `006-redux-split`
**Created**: 2026-02-04
**Status**: Draft
**Input**: User description: "Use the existing documentation in specs\000-refactor-epic\spec.md and plan.md as the source of truth. We have completed phase one CSS migration. Begin work on phase two Redux split. The goal is to refactor the current monolithic Redux store into smaller domain driven slices following best practices. Specifically focus on splitting the existing estimator or other state into clearer feature based slices such as painting basement UI and other appropriate domains. Review the current Redux implementation in the codebase and evaluate the existing plan for phase two. If the Phase 2: Redux Split (Pillar 2) in specs\000-refactor-epic\plan.md needs updates or clarification based on the current code structure update the plan accordingly. Create a dedicated specification and plan for this work under specs\000-refactor-epic\02-redux-split. If needed introduce a new file such as split.md that clearly defines the scope approach and structure of the Redux refactor. The outcome should be a clear specification for the Redux split that improves maintainability scalability and future development."

## Clarifications

### Session 2026-02-04
- Q: How shared data (like client info or project IDs) should be synchronized? → A: Create a dedicated 'project' slice for global IDs and shared metadata; domain slices select this via root selectors.
- Q: Whether logic for calculating totals should live in a slice, a selector, or a middleware? → A: Use memoized selectors (Reselect) to derive totals from raw state, keeping the store data redundant-free.
- Q: Our naming convention for selectors to avoid collisions? → A: Use Feature-Prefixed Selectors (e.g., `selectPaintingTotalArea`) to prevent collisions and maintain clarity.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Store Architecture Refactor (Priority: P1)

As a developer, I want the Redux store to be split into domain-specific slices so that the application state is easier to maintain and scale.

**Why this priority**: Breaking the monolithic `estimatorSlice` is the core goal of this pillar. It prevents "God Object" anti-patterns and allows for feature isolation.

**Independent Test**: Verify that the application builds and runs with the new store configuration, and that the Redux DevTools show the new slice structure (e.g., `painting`, `basement` instead of just `estimator`).

**Acceptance Scenarios**:

1. **Given** the application is running, **When** I inspect the Redux store, **Then** I should see distinct slices for `painting`, `basement`, `garage`, and `ui` (or similar domains).
2. **Given** the `estimatorSlice` is deprecated, **When** I search the codebase, **Then** I should find no active imports from the old monolithic file.

---

### User Story 2 - Estimator Logic Migration (Priority: P2)

As a user, I want the Estimator feature to continue working seamlessly while powered by the new split slices.

**Why this priority**: Ensures no regression in the core business value (providing estimates) during the refactor.

**Independent Test**: Complete a full estimate flow (e.g., Painting -> Room Selection -> Quote) and verify the numbers are correct.

**Acceptance Scenarios**:

1. **Given** I am on the Painting Estimator step, **When** I add a room and select walls, **Then** the `painting` slice should update, and the estimated price should calculate correctly.
2. **Given** I switch between service types (e.g., from Painting to Basement), **When** I return to Painting, **Then** my previous selections should be persisted (or reset, depending on defined behavior).

---

### User Story 3 - UI State Isolation (Priority: P3)

As a developer, I want global UI state (modals, loading spinners, alerts) to be managed in a dedicated `uiSlice` so that it doesn't clutter business logic slices.

**Why this priority**: Separation of concerns. Visual state should not be coupled with pricing or data state.

**Independent Test**: Trigger a modal (e.g., Project Modal) and verify it opens/closes via the new `uiSlice`.

**Acceptance Scenarios**:

1. **Given** I click a project card, **When** the `openProjectModal` action is dispatched, **Then** the `uiSlice.modals.project` state should become active.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The monolithic `estimatorSlice.ts` MUST be decomposed into domain-specific slices: `paintingSlice`, `basementSlice`, `garageSlice`, and `repairSlice` (or similar).
- **FR-002**: A shared `uiSlice` MUST be created to handle global UI state (modals, loading, alerts).
- **FR-003**: The root `store.ts` MUST be updated to combine these new reducers.
- **FR-004**: All components consuming `state.estimator` MUST be updated to select from the new specific slices (e.g., `state.painting`).
- **FR-005**: All dispatch actions (e.g., `updateRoom`) MUST be mapped to the new slice actions.
- **FR-006**: The total estimate calculation logic MUST be derived using memoized selectors (Reselect) rather than stored directly in the state.
- **FR-007**: System MUST use a shared 'project' slice for global IDs (e.g., clientId, projectId) to ensure domain slices remain decoupled.
- **FR-008**: Selectors MUST be named with feature prefixes (e.g., `selectPaintingTotal`) to ensure uniqueness across the codebase.

### Key Entities *(include if feature involves data)*

- **PaintingState**: `{ rooms: [], totalArea: 0, ... }`
- **BasementState**: `{ wallLength: 0, ceilingArea: 0, ... }`
- **ProjectState**: `{ clientId: string, projectId: string, ... }`
- **UIState**: `{ modalOpen: boolean, loading: boolean, activeAlert: string | null }`

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of `estimatorSlice` logic is migrated to new slices.
- **SC-002**: 0 build errors or type warnings related to Redux state.
- **SC-003**: All 5 major Estimator flows (Painting, Basement, Garage, Repair, Installation) function identically to the pre-refactor state (manual regression test).
- **SC-004**: `estimatorSlice.ts` file is deleted.

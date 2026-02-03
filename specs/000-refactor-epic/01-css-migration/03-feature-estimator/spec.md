# Feature Specification: Migrate Feature Components (Estimator) to CSS Modules (CSS Priority 3)

**Feature Branch**: `003-css-priority-3`
**Created**: 2026-02-03
**Status**: Draft
**Parent Spec**: `specs/000-refactor-epic/01-css-migration/spec.md`
**Input**: User description: "work on the Priority 3: Feature Components (Estimator) located in specs\000-refactor-epic\01-css-migration\spec.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Complex Form Components Migration (Priority: P1)

As a developer, I want the Estimator feature's complex form components (`BasementForm`, `GarageForm`, `InstallationForm`, `PaintingForm`, `RepairForm`) to use CSS Modules so that their specific layout and styling rules do not conflict with each other or global styles.

**Why this priority**: These are the core business logic components. Style leakage here (e.g. conflicting `.form-group` or `.input` styles) breaks the user experience in the most critical part of the app.

**Independent Test**:
1. Navigate to the Estimator page.
2. Step through each service type (Painting, Patching, Installation, Garage, Basement).
3. Verify that form layouts, inputs, and spacing remain identical to the legacy version.

**Acceptance Scenarios**:

1. **Given** the Estimator wizard, **When** I select "Garage", **Then** the `GarageForm` renders with correct spacing and alignment.
2. **Given** the Estimator wizard, **When** I select "Painting", **Then** the `PaintingForm` renders without style pollution from `GarageForm`.

---

### User Story 2 - Sub-Components Migration (Priority: P2)

As a developer, I want the smaller sub-components used within the Estimator (`PaintingRoomCard`, `EstimatorStep1`, `EstimatorStep2`, `EstimatorStep3`) to use CSS Modules to ensure encapsulated styling for list items, cards, and summary views.

**Why this priority**: These components appear multiple times or control the flow. Isolating them stabilizes the "wizard" UI.

**Independent Test**:
1. Add a room in the Painting step.
2. Verify the `PaintingRoomCard` (accordion) looks correct and interactions (expand/collapse) work visually.
3. Review the final Estimate summary (Step 3).

**Acceptance Scenarios**:

1. **Given** the Painting step, **When** I add a room, **Then** the `PaintingRoomCard` accordion expands/collapses with correct animations and styles.
2. **Given** the final step, **When** the estimate is shown, **Then** `EstimatorStep3` displays the breakdown clearly.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `client/src/components/common/estimator/styles/BasementForm.css` MUST be renamed to `BasementForm.module.css`.
- **FR-002**: `client/src/components/common/estimator/styles/GarageForm.css` MUST be renamed to `GarageForm.module.css`.
- **FR-003**: `client/src/components/common/estimator/styles/InstallationForm.css` (if exists) MUST be renamed to `InstallationForm.module.css`.
- **FR-004**: `client/src/components/common/estimator/styles/PaintingForm.css` (if exists) MUST be renamed to `PaintingForm.module.css`.
- **FR-005**: `client/src/components/common/estimator/styles/RepairForm.css` MUST be renamed to `RepairForm.module.css`.
- **FR-006**: Any component-specific styles currently in `EstimatorPage.css` related to specific steps (Step1, Step2, Step3) SHOULD be extracted to `EstimatorStepX.module.css` if possible, or kept in `EstimatorPage.module.css` (Priority 4) if truly page-level. *Correction*: Migration of `EstimatorStepX` components should happen here.
- **FR-007**: All hardcoded colors in these files MUST be replaced with CSS variables from `index.css`.
- **FR-008**: Update all corresponding `.tsx` files (`BasementForm.tsx`, etc.) to import `styles`.

### Key Entities

N/A - Styling refactor.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the Estimator form components migrated to CSS Modules.
- **SC-002**: 0 visual regressions in the Estimator wizard flow.
- **SC-003**: Application builds with 0 errors.

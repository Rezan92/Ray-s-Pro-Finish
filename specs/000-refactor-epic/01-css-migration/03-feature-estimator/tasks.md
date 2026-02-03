---
description: "Task list for migrating Estimator feature components to CSS Modules"
---

# Tasks: Migrate Estimator Feature Components

**Input**: Design documents from `specs/000-refactor-epic/01-css-migration/03-feature-estimator/`
**Prerequisites**: plan.md (required), spec.md (required), quickstart.md

**Organization**: Tasks are grouped by user story (P1, P2) to enable independent implementation.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify environment readiness

- [ ] T001 Verify project builds successfully before Estimator changes
- [ ] T002 Identify all hardcoded colors in Estimator CSS files and map to `index.css` variables
- [ ] T003 Add any missing form-specific variables to `client/src/index.css`

**Checkpoint**: Variable mapping ready

---

## Phase 2: User Story 1 - Complex Form Components (Priority: P1)

**Goal**: Isolate core form logic styles.

- [x] T004 [P] [US1] Rename `styles/BasementForm.css` to `styles/BasementForm.module.css` and refactor `BasementForm.tsx`
- [x] T005 [P] [US1] Rename `styles/GarageForm.css` to `styles/GarageForm.module.css` and refactor `GarageForm.tsx`
- [x] T006 [P] [US1] Rename `styles/RepairForm.css` to `styles/RepairForm.module.css` and refactor `RepairForm.tsx`
- [x] T007 [P] [US1] Rename `styles/InstallationForm.css` (if exists) to `styles/InstallationForm.module.css` and refactor `InstallationForm.tsx`
- [x] T008 [P] [US1] Rename `styles/PaintingForm.css` (if exists) to `styles/PaintingForm.module.css` and refactor `PaintingForm.tsx`
- [x] T009 [US1] Manual visual verification of Form components (spacing, inputs, responsiveness)

**Checkpoint**: Core forms fully migrated.

---

## Phase 3: User Story 2 - Sub-Components Migration (Priority: P2)

**Goal**: Isolate wizard steps and cards.

- [x] T010 [P] [US2] Check/Create `styles/PaintingRoomCard.module.css` and refactor `PaintingRoomCard.tsx`
- [x] T011 [P] [US2] Check/Create `styles/EstimatorStep1.module.css` (if needed) and refactor `EstimatorStep1.tsx`
- [x] T012 [P] [US2] Check/Create `styles/EstimatorStep2.module.css` (if needed) and refactor `EstimatorStep2.tsx`
- [x] T013 [P] [US2] Check/Create `styles/EstimatorStep3.module.css` (if needed) and refactor `EstimatorStep3.tsx`
- [x] T014 [US2] Manual visual verification of Wizard Steps and Room Cards

**Checkpoint**: Wizard sub-components fully migrated.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final verification

- [x] T015 Verify application build success (SC-003)
- [x] T016 Verify zero visual regressions in Estimator flow (SC-002)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Blocks all.
- **User Stories (Phase 2 & 3)**: Can run in parallel, but sequential is safer for form consistency.

### Parallel Opportunities

- T004-T008 can run in parallel.
- T010-T013 can run in parallel.

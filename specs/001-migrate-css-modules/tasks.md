---
description: "Task list for migrating core components to CSS Modules"
---

# Tasks: Migrate Core Components to CSS Modules

**Input**: Design documents from `/specs/001-migrate-css-modules/`
**Prerequisites**: plan.md (required), spec.md (required), quickstart.md

**Organization**: Tasks are grouped by user story (Atomic Components P1, Card Components P2) to enable independent implementation and testing.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify environment readiness for CSS Modules migration

- [x] T001 Verify project builds successfully before changes

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T002 Identify all hardcoded colors in target components, map them to existing `index.css` variables, and document any missing variables
- [x] T003 Add any missing CSS variables identified in T002 to `client/src/index.css` to ensure full coverage

**Checkpoint**: Variable mapping strategy defined - user story implementation can now begin

---

## Phase 3: User Story 1 - Atomic UI Component Migration (Priority: P1) 🎯 MVP

**Goal**: Migrate Button, FloatingAlert, InfoTooltip, and Logo to CSS Modules with zero visual regression.

**Independent Test**: Verify components render correctly and use hashed class names in the DOM.

### Implementation for User Story 1

- [x] T004 [P] [US1] Rename `Button.css` to `Button.module.css` and refactor `client/src/components/common/button/Button.tsx`
- [x] T005 [P] [US1] Rename `FloatingAlert.css` to `FloatingAlert.module.css` and refactor `client/src/components/common/floatingAlert/FloatingAlert.tsx`
- [x] T006 [P] [US1] Rename `InfoTooltip.css` to `InfoTooltip.module.css` and refactor `client/src/components/common/infoTooltip/InfoTooltip.tsx`
- [x] T007 [P] [US1] Rename `Logo.css` to `Logo.module.css` and refactor `client/src/components/common/logo/Logo.tsx`
- [ ] T008 [US1] Manual visual verification of atomic components (check styles and global utility preservation)

**Checkpoint**: Atomic components fully migrated and verified.

---

## Phase 4: User Story 2 - Card Component Migration (Priority: P2)

**Goal**: Migrate StatCard, FeatureCard, ProjectCard, and ServiceCard to CSS Modules with zero visual regression.

**Independent Test**: Verify card components render correctly and use hashed class names in the DOM.

### Implementation for User Story 2

- [x] T009 [P] [US2] Rename `StatCard.css` to `StatCard.module.css` and refactor `client/src/components/common/statCard/StatCard.tsx`
- [x] T010 [P] [US2] Rename `FeatureCard.css` to `FeatureCard.module.css` and refactor `client/src/components/common/featureCard/FeatureCard.tsx`
- [x] T011 [P] [US2] Rename `ProjectCard.css` to `ProjectCard.module.css` and refactor `client/src/components/common/projectCard/ProjectCard.tsx`
- [x] T012 [P] [US2] Rename `ServiceCard.css` to `ServiceCard.module.css` and refactor `client/src/components/common/serviceCard/ServiceCard.tsx`
- [x] T013 [US2] Manual visual verification of card components (check styles and global utility preservation)

**Checkpoint**: All 8 components fully migrated and verified.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and cleanup

- [x] T014 Verify application build success (SC-003)
- [x] T015 Verify zero visual regressions across all pages (SC-002)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup. Blocks User Stories.
- **User Stories (Phase 3+)**: Depend on Foundational.
  - US1 and US2 can theoretically run in parallel as they touch different files, but sequential is safer for consistent patterns.
- **Polish (Final Phase)**: Depends on all stories completion.

### Parallel Opportunities

- All migration tasks (T004-T007, T009-T012) marked [P] can run in parallel as they target isolated component directories.

## Implementation Strategy

### Incremental Delivery

1. **Foundational**: Ensure variable mapping is clear.
2. **Atomic Batch (MVP)**: Migrate the 4 atomic components -> Verify -> Commit.
3. **Card Batch**: Migrate the 4 card components -> Verify -> Commit.
4. **Final Polish**: Full build and regression test.

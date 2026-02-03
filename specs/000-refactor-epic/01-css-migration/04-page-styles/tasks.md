---
description: "Task list for migrating Page-Level Styles to CSS Modules"
---

# Tasks: Migrate Page-Level Styles

**Input**: Design documents from `specs/000-refactor-epic/01-css-migration/04-page-styles/`
**Prerequisites**: plan.md (required), spec.md (required), quickstart.md

**Organization**: Tasks are grouped by user story (P1, P2) to enable independent implementation.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify environment readiness

- [ ] T001 Verify project builds successfully before Page changes
- [ ] T002 Identify all hardcoded colors in Page CSS files and map to `index.css` variables

**Checkpoint**: Variable mapping ready

---

## Phase 2: User Story 1 - Static Page Migration (Priority: P1)

**Goal**: Isolate About, Contact, Services, and Projects pages.

- [ ] T003 [P] [US1] Rename `pages/aboutPage/AboutPage.css` to `AboutPage.module.css` and refactor `AboutPage.tsx`
- [ ] T004 [P] [US1] Rename `pages/contact/ContactPage.css` to `ContactPage.module.css` and refactor `ContactPage.tsx`
- [ ] T005 [P] [US1] Rename `pages/services/ServicesPage.css` to `ServicesPage.module.css` and refactor `ServicesPage.tsx`
- [ ] T006 [P] [US1] Rename `pages/projects/ProjectsPage.css` to `ProjectsPage.module.css` and refactor `ProjectsPage.tsx`
- [ ] T007 [US1] Manual visual verification of Static Pages (layout, container widths)

**Checkpoint**: Static pages fully migrated.

---

## Phase 3: User Story 2 - Estimator Page Migration (Priority: P2)

**Goal**: Isolate Estimator page wrapper.

- [ ] T008 [US2] Rename `pages/estimatorPage/EstimatorPage.css` to `EstimatorPage.module.css` and refactor `EstimatorPage.tsx`
- [ ] T009 [US2] Ensure all wizard step styles (e.g. progress bar) are correctly scoped or moved to sub-component modules if not already done.
- [ ] T010 [US2] Manual visual verification of Estimator Page wrapper

**Checkpoint**: Estimator wrapper fully migrated.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final verification

- [ ] T011 Verify application build success (SC-003)
- [ ] T012 Verify zero visual regressions across all top-level pages (SC-002)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Blocks all.
- **User Stories (Phase 2 & 3)**: Can run in parallel.

### Parallel Opportunities

- T003-T006 can run in parallel.

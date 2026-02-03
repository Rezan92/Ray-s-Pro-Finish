---
description: "Task list for migrating layout & global components to CSS Modules"
---

# Tasks: Migrate Layout & Global Components

**Input**: Design documents from `specs/000-refactor-epic/01-css-migration/02-layout-global/`
**Prerequisites**: plan.md (required), spec.md (required), quickstart.md

**Organization**: Tasks are grouped by user story (P1, P2, P3) to enable independent implementation.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify environment readiness for layout migration

- [x] T001 Verify project builds successfully before layout changes
- [x] T002 Identify all hardcoded colors in target layout components and map to `index.css` variables
- [x] T003 Add new global variables (`--color-white-70`, etc.) to `client/src/index.css`

**Checkpoint**: Variable mapping ready

---

## Phase 2: Foundational (App.css - Priority P1)

**Purpose**: Core application layout structure migration

- [x] T004 [P] [US1] Create `App.module.css` and migrate layout styles from `App.css`
- [x] T005 [P] [US1] Move global styles from `App.css` to `index.css`
- [x] T006 [US1] Refactor `client/src/App.tsx` to use `App.module.css` and remove `App.css` import
- [x] T007 [US1] Delete `client/src/App.css`

**Checkpoint**: App global styles separated from layout

---

## Phase 3: User Story 2 - Navigation & Header (Priority: P2)

**Goal**: Isolate navigation components.

- [x] T008 [P] [US2] Rename `Navbar.css` to `Navbar.module.css` and refactor `client/src/components/common/navbar/Navbar.tsx`
- [x] T009 [P] [US2] Rename `TopBar.css` to `TopBar.module.css` and refactor `client/src/components/common/topBar/TopBar.tsx`
- [x] T010 [P] [US2] Rename `PageHeader.css` to `PageHeader.module.css` and refactor `client/src/components/common/pageHeader/PageHeader.tsx`
- [x] T011 [US2] Manual visual verification of Navigation components (mobile menu, sticky behavior)

**Checkpoint**: Navigation fully migrated.

---

## Phase 4: User Story 3 - Footer Migration (Priority: P3)

**Goal**: Isolate footer styles.

- [x] T012 [P] [US3] Rename `Footer.css` to `Footer.module.css` and refactor `client/src/components/common/footer/Footer.tsx`
- [x] T013 [US3] Manual visual verification of Footer (grid layout, responsiveness)

**Checkpoint**: Footer fully migrated.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final verification

- [x] T014 Verify application build success (SC-003)
- [x] T015 Verify zero visual regressions across all pages (SC-004)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Blocks all.
- **Foundational (Phase 2)**: Must be done first as `App.tsx` wraps everything.
- **User Stories (Phase 3 & 4)**: Can theoretically run in parallel, but sequential is safer to isolate regressions.

### Parallel Opportunities

- T008, T009, T010, T012 can run in parallel as they target isolated directories.

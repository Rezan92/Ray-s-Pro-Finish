# Implementation Plan: Refactor Epic

**Epic**: Architectural Refactoring 2026
**Strategy**: Sequential execution of 3 Pillars.

## Phase 1: CSS Migration (Pillar 1)
**Status**: In Progress
**Artifacts**: `specs/000-refactor-epic/01-css-migration/`

- [x] **Priority 1**: Core Components (`specs/001-migrate-css-modules` - *Completed*)
- [x] **Priority 2**: Layout & Global Structure (Navbar, Footer, Layout)
- [x] **Priority 3**: Feature Components (Estimator forms)
- [x] **Priority 4**: Page-Level Styles (Page wrappers)
- [x] **Priority 5**: Content Sections (Marketing blocks & Cleanup)

## Phase 2: Redux Split (Pillar 2)
**Status**: Pending
**Artifacts**: `specs/000-refactor-epic/02-redux-split/`

- [ ] Audit current `estimatorSlice.ts`
- [ ] Design new store schema
- [ ] Refactor `painting` logic
- [ ] Refactor `basement` logic
- [ ] Refactor `garage` logic

## Phase 3: Pricing Centralization (Pillar 3)
**Status**: Pending
**Artifacts**: `specs/000-refactor-epic/03-pricing-centralization/`

- [ ] Create Backend `masterRates.ts`
- [ ] Create `/api/rates` endpoint
- [ ] Update Frontend to fetch rates
- [ ] Remove hardcoded pricing from Client

# Implementation Plan: Phase 2: Redux Split (Pillar 2)

**Branch**: `006-redux-split` | **Date**: 2026-02-04 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/000-refactor-epic/006-redux-split/spec.md`

## Summary

Decompose the monolithic `estimatorSlice.ts` into smaller, domain-specific slices (`painting`, `basement`, `garage`, `repair`, `installation`, `ui`, `project`) using Redux Toolkit. Implement shared state management via a new `project` slice and derive calculated values (totals) using `reselect` selectors. This architectural refactor improves maintainability, prevents "God Object" issues, and prepares the codebase for future feature scaling.

## Technical Context

**Language/Version**: TypeScript 5.x / React 18
**Primary Dependencies**: Redux Toolkit (standard), Reselect (for memoized selectors)
**Storage**: Client-side state (Redux)
**Testing**: Manual regression testing of all Estimator flows.
**Target Platform**: Web (React Client)
**Project Type**: Web application (Frontend State Management)
**Performance Goals**: Optimized state updates; total calculations must be memoized to prevent unnecessary re-renders.
**Constraints**:
- **Zero Functionality Regression**: The Estimator must work exactly as before.
- **Strict Typing**: All slices and selectors must be fully typed.
- **No Circular Dependencies**: Slices must remain independent; shared data lives in `projectSlice`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Styling & Visual System**: N/A (State logic only).
- **II. State & Data Logic**:
  - **Modular Redux**: Plan explicitly mandates splitting `estimatorSlice` into feature-specific slices. ✅
  - **Immutable Pricing**: Plan preserves existing logic; future pricing centralization (Pillar 3) is out of scope but enabled by this structure. ✅
- **III. TypeScript & Standards**: Zero Tolerance policy enforced. Strict typing required for all new slices. ✅
- **IV. Backend Integrity**: N/A (Frontend only).
- **V. File Organization**: Plan targets `client/src/store/slices/`. ✅

## Project Structure

### Documentation (this feature)

```text
specs/000-refactor-epic/006-redux-split/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
client/
└── src/
    └── store/
        ├── store.ts                       <-- MODIFIED (root reducer update)
        ├── hooks.ts                       <-- UNCHANGED
        └── slices/
            ├── estimatorSlice.ts          <-- DELETED (eventually)
            ├── paintingSlice.ts           <-- NEW
            ├── basementSlice.ts           <-- NEW
            ├── garageSlice.ts             <-- NEW
            ├── projectSlice.ts            <-- NEW (Shared IDs)
            ├── uiSlice.ts                 <-- MODIFIED/EXPANDED
            └── [other domain slices]...
```

**Structure Decision**: New slices will reside in `client/src/store/slices/`, replacing the single file.

## Complexity Tracking

No violations found. The split reduces complexity by decoupling domains.
# Implementation Plan: Migrate Feature Components (Estimator) to CSS Modules

**Branch**: `003-css-priority-3` | **Date**: 2026-02-03 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/000-refactor-epic/01-css-migration/03-feature-estimator/spec.md`

## Summary

Migrate the Estimator feature's complex form components and sub-components from global CSS to CSS Modules. This targets the core business logic forms (`BasementForm`, `GarageForm`, etc.) and their specific sub-components (`PaintingRoomCard`, etc.), ensuring style isolation and preventing cross-form pollution.

## Technical Context

**Language/Version**: TypeScript 5.x / React 18
**Primary Dependencies**: Vite (CSS Modules support built-in)
**Storage**: N/A
**Testing**: Manual verification (visual regression checks)
**Target Platform**: Web (React Client)
**Project Type**: Web application (Frontend only)
**Performance Goals**: Zero runtime performance regression.
**Constraints**: 
- **Strict Visual Fidelity**: Components must look exactly the same.
- **Zero Tolerance**: No build errors or unused imports introduced.
- **Variable Usage**: All hardcoded colors must be mapped to `index.css` variables.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Styling & Visual System**: 
  - **Variable-First**: Plan mandates mapping hardcoded values to `index.css` variables. ✅
  - **Isolation**: Plan explicitly migrates to `[ComponentName].module.css`. ✅
  - **Mixed Usage**: Plan enforces ``className={`${styles.componentClass} global-utility`}`` pattern if needed. ✅
- **II. State & Data Logic**: N/A
- **III. TypeScript & Standards**: Zero Tolerance policy enforced. ✅
- **IV. Backend Integrity**: N/A
- **V. File Organization**: Plan targets `client/src/components/common/estimator/`. ✅

## Project Structure

### Documentation (this feature)

```text
specs/000-refactor-epic/01-css-migration/03-feature-estimator/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # N/A
├── quickstart.md        # Phase 1 output
├── contracts/           # N/A
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
client/
└── src/
    └── components/
        └── common/
            └── estimator/
                ├── styles/
                │   ├── BasementForm.module.css    <-- NEW
                │   ├── GarageForm.module.css      <-- NEW
                │   ├── InstallationForm.module.css <-- NEW (if exists)
                │   ├── PaintingForm.module.css    <-- NEW (if exists)
                │   ├── RepairForm.module.css      <-- NEW
                │   └── ... (old .css files deleted)
                ├── BasementForm.tsx               <-- MODIFIED
                ├── GarageForm.tsx                 <-- MODIFIED
                ├── InstallationForm.tsx           <-- MODIFIED
                ├── PaintingForm.tsx               <-- MODIFIED
                ├── RepairForm.tsx                 <-- MODIFIED
                ├── PaintingRoomCard.tsx           <-- MODIFIED
                ├── EstimatorStep1.tsx             <-- MODIFIED
                ├── EstimatorStep2.tsx             <-- MODIFIED
                └── EstimatorStep3.tsx             <-- MODIFIED
```

**Structure Decision**: Migration occurs in-place within the existing directory structure.

## Complexity Tracking

No violations found.
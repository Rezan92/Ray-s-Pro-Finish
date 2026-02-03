# Implementation Plan: Migrate Layout & Global Components to CSS Modules

**Branch**: `002-css-priority-2` | **Date**: 2026-02-03 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/000-refactor-epic/01-css-migration/02-layout-global/spec.md`

## Summary

Migrate 5 layout-critical components and files (`Navbar`, `TopBar`, `PageHeader`, `Footer`, `App.css`) from global CSS to CSS Modules. This ensures the structural scaffolding of the application is isolated from content styles. Global styles currently in `App.css` will be moved to `index.css`.

## Technical Context

**Language/Version**: TypeScript 5.x / React 18
**Primary Dependencies**: Vite (CSS Modules support built-in)
**Storage**: N/A
**Testing**: Manual verification (visual regression checks)
**Target Platform**: Web (React Client)
**Project Type**: Web application (Frontend only)
**Performance Goals**: Zero runtime performance regression; reduced global CSS bundle size.
**Constraints**: 
- **Strict Visual Fidelity**: Components must look exactly the same.
- **Global Utility Preservation**: Global classes found must be preserved using the Mixed Usage pattern.
- **Variable Usage**: All hardcoded colors must be mapped to `index.css` variables.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Styling & Visual System**: 
  - **Variable-First**: Plan mandates mapping hardcoded values to `index.css` variables. ✅
  - **Isolation**: Plan explicitly migrates to `[ComponentName].module.css`. ✅
  - **Mixed Usage**: Plan enforces ``className={`${styles.componentClass} global-utility`}`` pattern. ✅
- **II. State & Data Logic**: N/A
- **III. TypeScript & Standards**: Zero Tolerance policy will be enforced (no unused imports, strict types). ✅
- **IV. Backend Integrity**: N/A
- **V. File Organization**: Plan targets `client/src/components/common/`. ✅

## Project Structure

### Documentation (this feature)

```text
specs/000-refactor-epic/01-css-migration/02-layout-global/
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
    ├── App.css                            <-- MODIFIED (stripped)
    ├── App.module.css                     <-- NEW (layout only)
    ├── App.tsx                            <-- MODIFIED
    ├── index.css                          <-- MODIFIED (globals added)
    └── components/
        └── common/
            ├── footer/
            │   ├── Footer.module.css      <-- NEW
            │   └── Footer.tsx             <-- MODIFIED
            ├── navbar/
            │   ├── Navbar.module.css      <-- NEW
            │   └── Navbar.tsx             <-- MODIFIED
            ├── pageHeader/
            │   ├── PageHeader.module.css  <-- NEW
            │   └── PageHeader.tsx         <-- MODIFIED
            └── topBar/
                ├── TopBar.module.css      <-- NEW
                └── TopBar.tsx             <-- MODIFIED
```

**Structure Decision**: Migration occurs in-place within the existing directory structure.

## Complexity Tracking

No violations found.

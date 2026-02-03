# Implementation Plan: Migrate Core Components to CSS Modules

**Branch**: `001-migrate-css-modules` | **Date**: 2026-02-03 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-migrate-css-modules/spec.md`

## Summary

Migrate 8 foundational UI components (`Button`, `FloatingAlert`, `InfoTooltip`, `Logo`, `StatCard`, `FeatureCard`, `ProjectCard`, `ServiceCard`) from global CSS (`.css`) to CSS Modules (`.module.css`). This involves renaming files, refactoring TypeScript imports, and mapping `className` strings to hashed module class names while preserving global utility classes.

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
- **Global Utility Preservation**: Global classes like `.btn` or `.dark` must remain as string literals.
- **Variable Usage**: All hardcoded colors must be mapped to `index.css` variables.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Styling & Visual System**: 
  - **Variable-First**: Plan mandates mapping hardcoded values to `index.css` variables. ✅
  - **Isolation**: Plan explicitly migrates to `[ComponentName].module.css`. ✅
  - **Mixed Usage**: Plan enforces ``className={`${styles.componentClass} global-utility`}`` pattern. ✅
- **II. State & Data Logic**: N/A (Styling only)
- **III. TypeScript & Standards**: N/A (Styling only)
- **IV. Backend Integrity**: N/A (Frontend only)
- **V. File Organization**: Plan targets `client/src/components/common/`. ✅

## Project Structure

### Documentation (this feature)

```text
specs/001-migrate-css-modules/
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
    ├── components/
    │   └── common/
    │       ├── button/
    │       │   ├── Button.module.css  <-- NEW
    │       │   └── Button.tsx         <-- MODIFIED
    │       ├── floatingAlert/
    │       │   ├── FloatingAlert.module.css <-- NEW
    │       │   └── FloatingAlert.tsx        <-- MODIFIED
    │       ├── infoTooltip/
    │       │   ├── InfoTooltip.module.css <-- NEW
    │       │   └── InfoTooltip.tsx        <-- MODIFIED
    │       ├── logo/
    │       │   ├── Logo.module.css    <-- NEW
    │       │   └── Logo.tsx           <-- MODIFIED
    │       ├── featureCard/
    │       │   ├── FeatureCard.module.css <-- NEW
    │       │   └── FeatureCard.tsx        <-- MODIFIED
    │       ├── projectCard/
    │       │   ├── ProjectCard.module.css <-- NEW
    │       │   └── ProjectCard.tsx        <-- MODIFIED
    │       ├── serviceCard/
    │       │   ├── ServiceCard.module.css <-- NEW
    │       │   └── ServiceCard.tsx        <-- MODIFIED
    │       └── statCard/
    │           ├── StatCard.module.css    <-- NEW
    │           └── StatCard.tsx           <-- MODIFIED
    └── index.css                          <-- REFERENCE
```

**Structure Decision**: Migration occurs in-place within the existing `client/src/components/common/` directory structure.

## Complexity Tracking

No violations found.
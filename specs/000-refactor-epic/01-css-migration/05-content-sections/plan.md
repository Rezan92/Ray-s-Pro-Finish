# Implementation Plan: Content Sections & Final Cleanup

**Branch**: `005-content-sections` | **Date**: 2026-02-04 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/000-refactor-epic/01-css-migration/05-content-sections/spec.md`

## Summary

Migrate all remaining marketing components, page wrappers, and modals (approx. 20 files) from global CSS to CSS Modules. This action finalizes the "CSS Migration" phase by ensuring 100% of the application's styles are encapsulated and all legacy `.css` files (except `index.css`) are removed.

## Technical Context

**Language/Version**: TypeScript 5.x / React 18
**Primary Dependencies**: Vite (CSS Modules support built-in)
**Storage**: N/A (Frontend Refactor)
**Testing**: Manual Visual Verification (Regression Testing)
**Target Platform**: Web (React Client)
**Project Type**: Web application (Frontend)
**Performance Goals**: Zero runtime performance regression; reduced global CSS bundle size.
**Constraints**:
- **Strict Visual Fidelity**: Components must look exactly the same.
- **Global Utility Preservation**: Global classes (like `.container`) must be preserved using Mixed Usage pattern.
- **Variable Usage**: All hardcoded colors must be mapped to `index.css` variables.
- **Zero Tolerance**: No unused imports or warnings allowed.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Styling & Visual System**:
  - **Variable-First**: Plan mandates mapping hardcoded values to `index.css` variables. ✅
  - **Isolation**: Plan explicitly migrates to `[ComponentName].module.css`. ✅
  - **Mixed Usage**: Plan enforces ``className={`${styles.componentClass} global-utility`}`` pattern. ✅
- **II. State & Data Logic**: N/A (CSS only)
- **III. TypeScript & Standards**: Zero Tolerance policy will be enforced (no unused imports, strict types). ✅
- **IV. Backend Integrity**: N/A
- **V. File Organization**: Plan targets `client/src/components/common/` and `client/src/pages/`. ✅

## Project Structure

### Documentation (this feature)

```text
specs/000-refactor-epic/01-css-migration/05-content-sections/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (N/A)
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
client/
└── src/
    ├── pages/
    │   ├── aboutPage/
    │   │   ├── AboutPage.module.css    <-- NEW
    │   │   └── AboutPage.css           <-- DELETE
    │   └── [other pages]...
    └── components/
        └── common/
            ├── hero/
            │   ├── Hero.module.css     <-- NEW
            │   └── Hero.css            <-- DELETE
            ├── testimonialSection/
            │   ├── TestimonialSection.module.css <-- NEW
            │   └── TestimonialSection.css        <-- DELETE
            └── [other components]...
```

**Structure Decision**: Migration occurs in-place within the existing directory structure, following the established pattern.

## Complexity Tracking

No violations found.
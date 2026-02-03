# Research & Decisions: Migrate Page Styles

**Feature Branch**: `004-css-priority-4`
**Date**: 2026-02-03

## Research Findings

### R1: Global Layout Classes
**Context**: Page components likely use `.container` or similar layout classes from global styles.
**Decision**: 
- If `.container` is used for global constraints, prefer using the Mixed Usage pattern (`className={`${styles.page} container`}`) IF `container` remains global.
- However, since we are moving towards strict isolation, if `container` is defined in `App.module.css` (layout), pages cannot easily access it unless they import it.
- **Strategy**: Define page-specific container styles in `[Page].module.css` OR use a shared layout wrapper component (future refactor). For now, duplicate the container constraints (`max-width: 1200px`, `margin: 0 auto`) into each page module if needed, or rely on `App.module.css` if it wraps them (but pages often define their own inner containers).

### R2: Hardcoded Color Mapping
**Context**: Pages use brand colors for headers and sections.
**Decision**: Map all HEX/RGB values found in source CSS files to CSS variables defined in `client/src/index.css`.

## Technical Strategy

1.  **Rename**: Change extension from `.css` to `.module.css`.
2.  **Scan & Replace**: Regex/AST scan for hardcoded colors -> Replace with `var(--variable)`.
3.  **Refactor Import**: Update `.tsx` to `import styles from './[Page].module.css'`.
4.  **Refactor Classes**:
    - `className="about-page"` -> `className={styles.aboutPage}`

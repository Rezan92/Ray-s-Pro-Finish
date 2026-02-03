# Research & Decisions: Migrate Layout Components

**Feature Branch**: `002-css-priority-2`
**Date**: 2026-02-03

## Research Findings

### R1: App.css Strategy
**Context**: `App.css` currently contains basic margin rules.
**Decision**: 
- Move `margin: auto` logic to `App.module.css` (layout).
- Verify if any other globals exist (file seems mostly empty from search, but full audit required).
- If empty after move, `App.css` file can be deleted, but safer to keep empty for future globals or delete if unused. *Decision: Rename to App.module.css for layout styles, delete old file.*

### R2: Hardcoded Color Mapping
**Context**: Layout components use brand colors extensively.
**Decision**: Map all HEX/RGB values found in source CSS files to CSS variables defined in `client/src/index.css`.
- `Navbar.css`: Uses `var(--color-brand-dark)`, `var(--color-text-inverted)`. (Already good).
- `Footer.css`: Uses `rgba(255, 255, 255, 0.7)` and `0.05`. These need mapping to `var(--color-white-70)` etc.
- `PageHeader.css`: Uses `#040e266b`. Needs mapping.

## Technical Strategy

1.  **Rename**: Change extension from `.css` to `.module.css`.
2.  **Scan & Replace**: Regex/AST scan for hardcoded colors -> Replace with `var(--variable)`.
    - *New Variable Needed*: `var(--color-white-70)`, `var(--color-white-05)`, `var(--color-overlay-dark)`.
3.  **Refactor Import**: Update `.tsx` to `import styles from './Component.module.css'`.
4.  **Refactor Classes**:
    - `className="navbar"` -> `className={styles.navbar}`
    - `className="container"` -> `className={styles.container}`

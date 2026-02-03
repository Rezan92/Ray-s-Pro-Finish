# Research & Decisions: Migrate Core Components to CSS Modules

**Feature Branch**: `001-migrate-css-modules`
**Date**: 2026-02-03

## Research Findings

### R1: Global Utility Class Handling
**Context**: Components currently mix structural styles with global utility classes (e.g., `btn`, `dark`).
**Decision**: Use the "Mixed Usage" pattern codified in Constitution v1.2.0.
**Rationale**: 
- `composes` keyword in CSS Modules has limitations with global classes (requires strict ordering and import syntax).
- Duplicating utilities into modules creates maintenance drift.
- Keeping utilities as string literals is the most robust way to interact with legacy global CSS (`index.css`).

### R2: Hardcoded Color Mapping
**Context**: `spec.md` and Constitution require eliminating hardcoded colors.
**Decision**: Map all HEX/RGB values found in source CSS files to CSS variables defined in `client/src/index.css`.
**Rationale**: Enforces the "Variable-First" principle. If a variable is missing, it must be added to `index.css` (Task required).

## Technical Strategy

1. **Rename**: Change extension from `.css` to `.module.css`.
2. **Scan & Replace**: Regex/AST scan for hardcoded colors -> Replace with `var(--variable)`.
3. **Refactor Import**: Update `.tsx` to `import styles from './Component.module.css'`.
4. **Refactor Classes**:
   - `className="my-class"` -> `className={styles.myClass}`
   - `className="my-class global"` -> `className={`${styles.myClass} global`}``
   - `className={`my-class ${prop}`}` -> `className={`${styles.myClass} ${styles[prop]}`}``

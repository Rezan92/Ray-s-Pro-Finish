# Research & Decisions: Migrate Estimator Components

**Feature Branch**: `003-css-priority-3`
**Date**: 2026-02-03

## Research Findings

### R1: Form Styling Patterns
**Context**: Estimator forms likely share common form group styles (`.form-group`, `label`, `input`).
**Decision**: 
- If these styles are duplicated in each file, they should be migrated as-is to modules for now (to ensure isolation).
- If they are global, we should check `index.css`. If we move them to modules, we ensure no side-effects.
- **Strategy**: Isolate everything. Even if code is duplicated, isolation > DRY CSS for this refactor to prevent "spooky action at a distance".

### R2: Hardcoded Color Mapping
**Context**: Estimator forms may use specific UI colors.
**Decision**: Map all HEX/RGB values found in source CSS files to CSS variables defined in `client/src/index.css`.
- Will likely need more variables for form borders, focus states, etc.

## Technical Strategy

1.  **Rename**: Change extension from `.css` to `.module.css`.
2.  **Scan & Replace**: Regex/AST scan for hardcoded colors -> Replace with `var(--variable)`.
3.  **Refactor Import**: Update `.tsx` to `import styles from './styles/[Component].module.css'`.
    *   *Note*: The CSS files are currently in a `styles/` subfolder. We should keep them there or move them next to the component. The Plan implies `styles/` folder. I will stick to the existing `styles/` folder structure but rename the files.
4.  **Refactor Classes**:
    - `className="form-group"` -> `className={styles.formGroup}`

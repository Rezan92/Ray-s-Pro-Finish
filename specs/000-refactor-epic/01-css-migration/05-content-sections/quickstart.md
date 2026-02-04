# Quickstart: CSS Module Migration for Content Sections

## Prerequisites
- Node.js 18+
- Active branch: `005-content-sections`

## Migration Workflow

For each component (e.g., `Hero`):

1.  **Create Module**: `touch client/src/components/common/hero/Hero.module.css`
2.  **Move Styles**: Copy content from `Hero.css` to `Hero.module.css`.
3.  **Refactor Classes**:
    -   Change `className="hero-section"` to `className={styles.heroSection}`.
    -   Update CSS selectors to camelCase (preferred) or bracket notation (if keeping kebab-case).
4.  **Preserve Utilities**:
    -   `className="hero-container container"` -> `className={`${styles.heroContainer} container`}`
5.  **Update Variables**:
    -   Replace `#0047AB` with `var(--primary)`.
6.  **Verify & Delete**:
    -   Check rendering.
    -   Delete `Hero.css`.
    -   Remove `import './Hero.css'` from TSX.
    -   Add `import styles from './Hero.module.css'`.

## Verification Command
```bash
# Ensure no stray .css files remain in components folder
grep -r ".css" client/src/components
```

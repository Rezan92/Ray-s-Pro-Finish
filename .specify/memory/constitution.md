<!-- Sync Impact Report
- Version: 1.2.0 -> 1.3.0 (Minor)
- Changes:
  - Principle III (TypeScript & Standards): Added "Zero Tolerance" for warnings/unused imports and "Clean Code" rules for comments.
- Templates Status:
  - .specify/templates/plan-template.md: ✅ Compatible
  - .specify/templates/spec-template.md: ✅ Compatible
  - .specify/templates/tasks-template.md: ✅ Compatible
-->

# Ray Pro Finish Constitution
A high-performance, type-safe business platform for Ray Pro Finish.

## Core Principles

### I. Styling & Visual System
**Variable-First:** All colors, spacing, and shadows must use CSS variables from `index.css`. Never hardcode HEX or RGB values in component styles. If a variable does not exist for a repeated color or value, you must suggest adding it to `index.css`. **Isolation:** Use CSS Modules exclusively for component-level styling. Filenames must be `[ComponentName].module.css`. **Responsive:** Every component must follow a "Mobile-First" approach. **Mixed Usage:** When a component requires both isolated styles and global utilities (e.g. `dark` theme class), combine them: ``className={`${styles.componentClass} global-utility`}``.

### II. State & Data Logic
**Modular Redux:** Slices must be feature-specific. The "Estimator" must be divided into sub-slices (painting, basement, etc.) to prevent a "God Slice." **Immutable Pricing:** Pricing logic and rates are prohibited from being hardcoded in components. They must be fetched from `masterRates.ts` or the server.

### III. TypeScript & Standards
**Strict Mode:** No usage of `any`. All props, states, and API responses must have explicit interfaces. **Zero Tolerance:** Treat all compiler and linter warnings (including unused imports and variables) as blocking errors. **Clean Code:** Comments must only explain *why* complex logic exists, never *what* it does. Remove all unused code and comments immediately. **Text Integrity:** Prohibit changing any user-facing text, questions, or labels unless explicitly instructed. **Error Handling:** Use a unified notification pattern (e.g., the `FloatingAlert` component) for all user feedback. Browser `alert()` is prohibited.

### IV. Backend Integrity
**Service Layer:** Controllers only handle requests; Services handle calculation and business logic. **Contract-First:** API routes must return standardized JSON structures that match frontend TypeScript interfaces.

### V. File Organization
Components live in `client/src/components/` within specific folders: `common/` (atomic UI like Buttons), `features/` (complex logic like Estimator), and `layout/` (Navbar, Footer).

## Governance

### Amendment & Versioning
This constitution supersedes all other project documentation.
- **Amendments** require a Pull Request with a clear rationale and must update the version number.
- **Versioning** follows Semantic Versioning:
  - **MAJOR**: Backward incompatible governance or principle redefinitions.
  - **MINOR**: New principle added or materially expanded guidance.
  - **PATCH**: Clarifications, typos, non-semantic refinements.

### Compliance
All Pull Requests and code reviews must verify compliance with these principles.
- **Complexity** must be justified against these rules.
- **Violations** block merging until resolved or explicitly exempted via a Constitution Amendment.

**Version**: 1.3.0 | **Ratified**: 2026-02-03 | **Last Amended**: 2026-02-03

# Pillar Specification: CSS Migration

**Parent Epic**: [000-refactor-epic](../spec.md)
**Goal**: 100% CSS Module adoption.

## Priorities

### Priority 1: Core & Atomic Components (Completed)
- **Scope**: Button, Cards, Logo, Tooltips, Alerts.
- **Status**: Done in `specs/001-migrate-css-modules`.

### Priority 2: Layout & Global Structure
- **Scope**: `Navbar`, `Footer`, `TopBar`, `PageHeader`, `App.css`.
- **Goal**: Isolate structural scaffolding.

### Priority 3: Feature Components (Estimator)
- **Scope**: `BasementForm`, `GarageForm`, `RepairForm`, etc.
- **Goal**: Prevent style collisions in complex forms.

### Priority 4: Page-Level Styles
- **Scope**: `AboutPage`, `ContactPage`, `EstimatorPage`, etc.
- **Goal**: Ensure top-level page containers are scoped.

### Priority 5: Content Sections
- **Scope**: `AboutSection`, `ContactDetails`, `Hero`, `Testimonials`.
- **Goal**: Final cleanup of marketing components.

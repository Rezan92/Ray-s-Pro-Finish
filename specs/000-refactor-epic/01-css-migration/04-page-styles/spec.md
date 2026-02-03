# Feature Specification: Migrate Page-Level Styles to CSS Modules (CSS Priority 4)

**Feature Branch**: `004-css-priority-4`
**Created**: 2026-02-03
**Status**: Draft
**Parent Spec**: `specs/000-refactor-epic/01-css-migration/spec.md`
**Input**: User description: "work on Priority 4: Page-Level Styles in specs\000-refactor-epic\01-css-migration\spec.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Static Page Migration (Priority: P1)

As a developer, I want the static pages (`AboutPage`, `ContactPage`, `ServicesPage`, `ProjectsPage`) to use CSS Modules so that their top-level container styles, spacing, and specific background rules are isolated from the rest of the application.

**Why this priority**: These pages define the major views of the application. Isolating them ensures that page-specific layout hacks don't leak into other pages.

**Independent Test**:
1. Navigate to About, Contact, Services, and Projects pages.
2. Verify that page headers, content containers, and spacing look identical to before.
3. Check that no global styles from these pages affect the Home page.

**Acceptance Scenarios**:

1. **Given** the About Page, **When** I view the team section, **Then** the grid layout is preserved and isolated.
2. **Given** the Contact Page, **When** I view the map container, **Then** it renders correctly without affecting other maps in the app.

---

### User Story 2 - Estimator Page Migration (Priority: P2)

As a developer, I want the `EstimatorPage` wrapper styles to be migrated to `EstimatorPage.module.css` to clean up the remaining global styles associated with the estimator wizard (e.g., progress bars, step containers) that weren't moved in Priority 3.

**Why this priority**: The Estimator is the most complex page. We already migrated the *forms* (Priority 3), but the *page wrapper* and *wizard navigation* (progress bar) likely still rely on `EstimatorPage.css`.

**Independent Test**:
1. Navigate to the Estimator.
2. Verify the progress bar at the top renders correctly.
3. Verify the main container centering and padding.

**Acceptance Scenarios**:

1. **Given** the Estimator Page, **When** I look at the Progress Bar, **Then** the step circles and connecting lines render correctly using scoped styles.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `client/src/pages/aboutPage/AboutPage.css` MUST be renamed to `AboutPage.module.css`.
- **FR-002**: `client/src/pages/contact/ContactPage.css` MUST be renamed to `ContactPage.module.css`.
- **FR-003**: `client/src/pages/services/ServicesPage.css` MUST be renamed to `ServicesPage.module.css`.
- **FR-004**: `client/src/pages/projects/ProjectsPage.css` MUST be renamed to `ProjectsPage.module.css`.
- **FR-005**: `client/src/pages/estimatorPage/EstimatorPage.css` MUST be renamed to `EstimatorPage.module.css`.
- **FR-006**: Update all corresponding `.tsx` files (`AboutPage.tsx`, etc.) to import `styles`.
- **FR-007**: All hardcoded colors in these files MUST be replaced with CSS variables from `index.css`.
- **FR-008**: Shared layout classes found in these files (e.g., `.container`) should either be kept if specific to the page, or mapped to global layout classes if they are generic (but preference is Isolation/Duplication per the Epic strategy).

### Key Entities

N/A - Styling refactor.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the 5 specified Page CSS files are migrated to CSS Modules.
- **SC-002**: 0 visual regressions on any of the main navigation pages.
- **SC-003**: Application builds with 0 errors.

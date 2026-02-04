# Feature Specification: Content Sections & Final Cleanup (Priority 5)

**Feature Branch**: `005-content-sections`
**Created**: 2026-02-04
**Status**: Completed
**Input**: User description: "start the requirements for the priority 5"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Marketing Component Refactor (Priority: P1)

As a developer, I want to migrate all marketing and content-heavy components to CSS Modules so that their styles are isolated and do not leak into other parts of the application.

**Why this priority**: These components constitute the bulk of the public-facing pages. Migrating them completes the visual isolation strategy.

**Independent Test**: Verify each component (e.g., Hero, Testimonials) renders exactly the same as before, but the underlying styles are loaded from `*.module.css` and class names are hashed.

**Acceptance Scenarios**:

1. **Given** the About Page is loaded, **When** I inspect the `AboutSection`, **Then** the class names should be hashed (e.g., `AboutSection_container_xyz`) and the visual layout should match the original design.
2. **Given** the Home Page is loaded, **When** I interact with the `TestimonialSlider`, **Then** the slider animation and styling should function correctly using scoped styles.

---

### User Story 2 - Page Wrapper Isolation (Priority: P2)

As a developer, I want to migrate page-level CSS files (e.g., `AboutPage.css`) to CSS Modules so that high-level layout containers are strictly scoped to their specific routes.

**Why this priority**: Prevents page-specific styles from affecting other pages if class names (like `.wrapper` or `.container`) collide.

**Independent Test**: Navigate to each page and ensure layout spacing and backgrounds are preserved.

**Acceptance Scenarios**:

1. **Given** the Contact Page, **When** I view the page structure, **Then** the root container should use a scoped class from `ContactPage.module.css`.
2. **Given** the source code, **When** I check `client/src/pages/`, **Then** no `.css` files should remain (only `.tsx` and `.module.css`).

---

### User Story 3 - Cleanup & Variable Standardization (Priority: P3)

As a developer, I want to replace hardcoded hex values with global CSS variables and remove all deleted `.css` files so that the codebase is clean and maintainable.

**Why this priority**: Ensures long-term maintainability and consistency with the design system.

**Independent Test**: Search codebase for hardcoded colors or legacy `.css` imports.

**Acceptance Scenarios**:

1. **Given** a migrated component, **When** I inspect the CSS, **Then** colors should use `var(--color-name)` instead of hex codes.
2. **Given** the project file structure, **When** I search for `.css` files, **Then** only `index.css`, `App.module.css`, and valid component modules should exist.

### Edge Cases

- **Global Utility Usage**: If a component uses a global utility class (e.g., `.btn`, `.container`), it must be preserved alongside the scoped class (e.g., `className={`${styles.root} container`}`).
- **Dynamic Classes**: If a component uses dynamic class names based on props, these must be correctly mapped to the module object (e.g., `styles[variant]`).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The following Core Marketing components MUST be migrated to `[Name].module.css`: `Hero`, `AboutSection`, `FeatureSection`, `TestimonialSection`, `TestimonialSlider`.
- **FR-002**: The following Service/Project components MUST be migrated to `[Name].module.css`: `ServicesSection`, `IndustrialServicesSection`, `SpecialtyServicesSection`, `LatestProjectsSection`, `ProjectGallerySection`, `OurProcessSection`.
- **FR-003**: The following Contact/Interaction components MUST be migrated to `[Name].module.css`: `ContactDetails`, `ContactForm`, `ContactInfoBlock`, `RequestQuoteSection`.
- **FR-004**: The following Modals MUST be migrated to `[Name].module.css`: `ProjectModal`, `ServiceModal`.
- **FR-005**: The following Page Wrappers MUST be migrated to `[Name].module.css`: `AboutPage`, `ContactPage`, `ProjectsPage`, `ServicesPage`.
- **FR-006**: The file `EstimatorPage.css` MUST be removed if unused (styles verified in `EstimatorPage.module.css`).
- **FR-007**: All migrated styles MUST use CSS variables from `index.css` instead of hardcoded hex values.
- **FR-008**: All original `.css` files for the above components MUST be deleted.

### Key Entities *(include if feature involves data)*

- N/A (Refactoring task)

## Clarifications

### Session 2026-02-04
- Q: Clarify whether these are the only CSS files that should be migrated to CSS Modules. If not, identify and include all remaining CSS files that need to be converted to .module.css → A: The file scan confirms that only `index.css` and the specified component/page files remain as `.css`. All other files are already `.module.css`. `EstimatorPage.css` is flagged for potential removal.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of identified components (approx 20 files) use CSS Modules.
- **SC-002**: 0 instances of `.css` imports remain in `client/src/components` and `client/src/pages` (excluding `index.css` and declared exemptions).
- **SC-003**: Visual regression testing shows 0 differences in layout, spacing, or color across all main pages.
- **SC-004**: Build process (Vite) completes with 0 errors.
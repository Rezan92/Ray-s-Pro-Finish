# Feature Specification: Migrate Core Components to CSS Modules

**Feature Branch**: `001-migrate-css-modules`
**Created**: 2026-02-03
**Status**: Draft
**Input**: User description: "Migrate the following files to CSS Modules: client/src/components/common/button/Button.css, floatingAlert/FloatingAlert.css, infoTooltip/InfoTooltip.css, logo/Logo.css, statCard/StatCard.css, featureCard/FeatureCard.css, projectCard/ProjectCard.css, and serviceCard/ServiceCard.css."

## Clarifications

### Session 2026-02-03
- Q: How should we handle shared global utility classes (like `.btn`, `.dark`) when migrating to CSS Modules? → A: **Preserve Global Utilities**: Keep generic classes like `btn`, `dark` as global strings (e.g., ``className={`${styles.container} btn dark`}``). Only migrate component-specific structural styles to the module.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Atomic UI Component Migration (Priority: P1)

As a developer, I want the foundational atomic components (Button, FloatingAlert, InfoTooltip, Logo) to use CSS Modules so that their styles are isolated and do not conflict with other parts of the application.

**Why this priority**: These components are used everywhere. Migrating them first establishes the pattern and protects the most reused elements from global style conflicts.

**Independent Test**:
1. Run the application.
2. Verify Button, FloatingAlert, InfoTooltip, and Logo appear exactly as before.
3. Inspect the DOM to verify class names are hashed (e.g., `Button_button_xyz`).

**Acceptance Scenarios**:

1. **Given** the application is running, **When** I view any page with a Button, **Then** it renders with the correct styles and no visual regression.
2. **Given** the application is running, **When** I trigger a FloatingAlert, **Then** it appears correctly styled and isolated.
3. **Given** the codebase, **When** I check `Button.tsx`, **Then** it imports styles from `Button.module.css`.

---

### User Story 2 - Card Component Migration (Priority: P2)

As a developer, I want the card components (StatCard, FeatureCard, ProjectCard, ServiceCard) to use CSS Modules to prevent style leakage between different card types.

**Why this priority**: Cards are complex composite components. Isolating them prevents specific card styles from bleeding into other similar card components.

**Independent Test**:
1. Run the application.
2. Navigate to pages containing these cards (Home, Projects, Services).
3. Verify visual integrity of all cards.
4. Inspect DOM to ensure class name hashing.

**Acceptance Scenarios**:

1. **Given** the Projects page, **When** I view ProjectCards, **Then** they maintain their exact layout and styling.
2. **Given** the Services page, **When** I view ServiceCards, **Then** they maintain their exact layout and styling.

### Edge Cases

- **Dynamic Class Names**: Components using string interpolation for classes (e.g., `btn ${variant}`) must be correctly updated to template literals using the style object (e.g., `${styles.btn} ${styles[variant]}`).
- **Global Overrides**: If any global CSS targets these specific class names, those global styles will break. These must be identified and refactored if they exist.
- **Global Utility Classes**: Global utility classes (e.g., `btn`, `dark`) found in `index.css` MUST be preserved as string literals in the `className` attribute and NOT moved into the CSS module, ensuring consistency with the project's utility pattern.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The file `client/src/components/common/button/Button.css` MUST be renamed to `Button.module.css`.
- **FR-002**: The file `client/src/components/common/floatingAlert/FloatingAlert.css` MUST be renamed to `FloatingAlert.module.css`.
- **FR-003**: The file `client/src/components/common/infoTooltip/InfoTooltip.css` MUST be renamed to `InfoTooltip.module.css`.
- **FR-004**: The file `client/src/components/common/logo/Logo.css` MUST be renamed to `Logo.module.css`.
- **FR-005**: The file `client/src/components/common/statCard/StatCard.css` MUST be renamed to `StatCard.module.css`.
- **FR-006**: The file `client/src/components/common/featureCard/FeatureCard.css` MUST be renamed to `FeatureCard.module.css`.
- **FR-007**: The file `client/src/components/common/projectCard/ProjectCard.css` MUST be renamed to `ProjectCard.module.css`.
- **FR-008**: The file `client/src/components/common/serviceCard/ServiceCard.css` MUST be renamed to `ServiceCard.module.css`.
- **FR-009**: All corresponding `.tsx` files MUST update their import statements to `import styles from './[Component].module.css'`.
- **FR-010**: All `className` attributes in the target components MUST reference the imported `styles` object for component-specific styles.
- **FR-011**: Global utility classes (e.g., defined in `index.css`) MUST be preserved as literal strings in `className` props (e.g., `className={${styles.root} global-class}`).
- **FR-012**: The visual appearance of all migrated components MUST remain identical to the pre-migration state.

### Key Entities

N/A - This is a styling refactor and does not modify the data model.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the 8 specified components use CSS Modules.
- **SC-002**: 0 visual regressions observed across the application for these components.
- **SC-003**: Application builds successfully with 0 styling-related errors.
- **SC-004**: Browser DOM inspection confirms unique, hashed class names for all target components.

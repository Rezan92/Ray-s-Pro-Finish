# Feature Specification: Migrate Layout & Global Components to CSS Modules (CSS Priority 2)

**Feature Branch**: `002-css-priority-2`
**Created**: 2026-02-03
**Status**: Draft
**Parent Spec**: `specs/000-refactor-epic/01-css-migration/spec.md`
**Input**: User description: "Migrate the Priority 2 Layout components (Navbar, Footer, TopBar, PageHeader, App.css) to CSS Modules. the priority 2 is in the specs\000-refactor-epic\01-css-migration\spec.md files so create the new spec.md, plan/task.md files in the 01-css-migration folder as that where the parent spec.md file lives"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - App.css & Global Layout Migration (Priority: P1)

As a developer, I want `App.css` to be refactored so that global styles are moved to `index.css` and layout-specific styles are moved to `App.module.css` (or layout component modules), preventing global style pollution.

**Why this priority**: `App.css` often contains a mix of global resets and layout rules. Separating these is the prerequisite for isolating the layout components.

**Independent Test**:
1. Run the application.
2. Verify basic page structure (width, centering, background) remains identical.
3. Verify no global styles from old `App.css` are leaking into components unless moved to `index.css`.

**Acceptance Scenarios**:

1. **Given** the application root, **When** I inspect `App.tsx`, **Then** it imports `App.module.css` for layout containers.
2. **Given** global styles (fonts, resets), **When** I check `index.css`, **Then** they are defined there, not `App.css`.

---

### User Story 2 - Navigation & Header Migration (Priority: P2)

As a developer, I want `Navbar`, `TopBar`, and `PageHeader` to use CSS Modules so that their complex positioning and z-index rules are isolated from other content.

**Why this priority**: Navigation is critical for usability and often has sensitive layout rules (sticky positioning, mobile menus).

**Independent Test**:
1. Navigate between pages.
2. Verify Navbar sticks/un-sticks as expected.
3. Verify TopBar styling (contact info, hours).
4. Verify PageHeader titles and backgrounds on subpages.

**Acceptance Scenarios**:

1. **Given** the Navbar, **When** I view it on mobile, **Then** the hamburger menu works and is styled correctly.
2. **Given** the PageHeader, **When** I view the "Services" page, **Then** the background image and title overlay render correctly.

---

### User Story 3 - Footer Migration (Priority: P3)

As a developer, I want the `Footer` component to use CSS Modules to ensure its grid layout and links are styled consistently without affecting other lists or links in the app.

**Why this priority**: Footers often contain lists and links that can conflict with general content styles if not scoped.

**Independent Test**:
1. Scroll to the bottom of any page.
2. Verify Footer columns, spacing, and link colors.

**Acceptance Scenarios**:

1. **Given** the Footer, **When** I inspect the link elements, **Then** they use hashed class names (e.g., `footer_link_xyz`).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `client/src/App.css` MUST be audited. Global rules moved to `index.css`, layout rules moved to `App.module.css`.
- **FR-002**: `client/src/components/common/navbar/Navbar.css` MUST be renamed to `Navbar.module.css`.
- **FR-003**: `client/src/components/common/topBar/TopBar.css` MUST be renamed to `TopBar.module.css`.
- **FR-004**: `client/src/components/common/pageHeader/PageHeader.css` MUST be renamed to `PageHeader.module.css`.
- **FR-005**: `client/src/components/common/footer/Footer.css` MUST be renamed to `Footer.module.css`.
- **FR-006**: All corresponding `.tsx` files must update imports to `import styles from './Component.module.css'`.
- **FR-007**: All hardcoded colors in these files MUST be replaced with CSS variables from `index.css`.
- **FR-008**: Any global utility classes found must be preserved using the Mixed Usage pattern (`className={`${styles.root} global-utility`}`).

### Key Entities

N/A - Styling refactor.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the specified 5 layout files are migrated to CSS Modules.
- **SC-002**: 0 instances of global styling (unscoped classes) remaining in the `components/common` folder for these components.
- **SC-003**: Application builds with 0 errors.
- **SC-004**: Zero visual regressions on the Homepage, Services page, and Contact page.
# Tasks: Content Sections & Final Cleanup

**Feature**: Content Sections & Final Cleanup (Priority 5)
**Spec**: [spec.md](spec.md)
**Plan**: [plan.md](plan.md)
**Branch**: `005-content-sections`
**Total Tasks**: 21

## Phase 1: Setup
**Goal**: Prepare environment for final CSS migration.

- [x] T001 [P] Verify current variable availability in `index.css` to ensure all hardcoded colors map to existing variables in `client/src/index.css`

## Phase 2: Foundational
**Goal**: N/A (Standard Refactoring Pattern established)

## Phase 3: Marketing Component Refactor (User Story 1)
**Goal**: Migrate core marketing sections to CSS Modules.
**Independent Test**: Verify Hero, About, Feature, and Testimonial sections render identically.

- [x] T002 [P] [US1] Migrate Hero styles to module in `client/src/components/common/hero/Hero.tsx` and `client/src/components/common/hero/Hero.module.css`
- [x] T003 [P] [US1] Migrate AboutSection styles to module in `client/src/components/common/aboutSection/AboutSection.tsx` and `client/src/components/common/aboutSection/AboutSection.module.css`
- [x] T004 [P] [US1] Migrate FeatureSection styles to module in `client/src/components/common/featureSection/FeatureSection.tsx` and `client/src/components/common/featureSection/FeatureSection.module.css`
- [x] T005 [P] [US1] Migrate TestimonialSection styles to module in `client/src/components/common/testimonialSection/TestimonialSection.tsx` and `client/src/components/common/testimonialSection/TestimonialSection.module.css`
- [x] T006 [P] [US1] Migrate TestimonialSlider styles to module in `client/src/components/common/testimonialSlider/TestimonialSlider.tsx` and `client/src/components/common/testimonialSlider/TestimonialSlider.module.css`

## Phase 4: Service & Interaction Component Refactor (User Story 1 Extended)
**Goal**: Migrate services, projects, contact, and modal components.
**Independent Test**: Verify all service grids, project galleries, and contact forms render identically.

- [ ] T007 [P] [US1] Migrate ServicesSection styles to module in `client/src/components/common/servicesSection/ServicesSection.tsx` and `client/src/components/common/servicesSection/ServicesSection.module.css`
- [ ] T008 [P] [US1] Migrate IndustrialServicesSection styles to module in `client/src/components/common/industrialServicesSection/IndustrialServicesSection.tsx` and `client/src/components/common/industrialServicesSection/IndustrialServicesSection.module.css`
- [ ] T009 [P] [US1] Migrate SpecialtyServicesSection styles to module in `client/src/components/common/specialtyServicesSection/SpecialtyServicesSection.tsx` and `client/src/components/common/specialtyServicesSection/SpecialtyServicesSection.module.css`
- [ ] T010 [P] [US1] Migrate LatestProjectsSection styles to module in `client/src/components/common/latestProjectsSection/LatestProjectsSection.tsx` and `client/src/components/common/latestProjectsSection/LatestProjectsSection.module.css`
- [ ] T011 [P] [US1] Migrate ProjectGallerySection styles to module in `client/src/components/common/projectGallerySection/ProjectGallerySection.tsx` and `client/src/components/common/projectGallerySection/ProjectGallerySection.module.css`
- [ ] T012 [P] [US1] Migrate OurProcessSection styles to module in `client/src/components/common/ourProcessSection/OurProcessSection.tsx` and `client/src/components/common/ourProcessSection/OurProcessSection.module.css`
- [ ] T013 [P] [US1] Migrate ContactDetails styles to module in `client/src/components/common/contactDetails/ContactDetails.tsx` and `client/src/components/common/contactDetails/ContactDetails.module.css`
- [ ] T014 [P] [US1] Migrate ContactForm styles to module in `client/src/components/common/contactForm/ContactForm.tsx` and `client/src/components/common/contactForm/ContactForm.module.css`
- [ ] T015 [P] [US1] Migrate ContactInfoBlock styles to module in `client/src/components/common/contactInfoBlock/ContactInfoBlock.tsx` and `client/src/components/common/contactInfoBlock/ContactInfoBlock.module.css`
- [ ] T016 [P] [US1] Migrate RequestQuoteSection styles to module in `client/src/components/common/requestQuoteSection/RequestQuoteSection.tsx` and `client/src/components/common/requestQuoteSection/RequestQuoteSection.module.css`
- [ ] T017 [P] [US1] Migrate ProjectModal and ServiceModal styles to modules in `client/src/components/common/projectModal/ProjectModal.module.css` and `client/src/components/common/serviceModal/ServiceModal.module.css`

## Phase 5: Page Wrapper Isolation (User Story 2)
**Goal**: Migrate page-level layout styles to modules.
**Independent Test**: Navigate to About, Contact, Projects, and Services pages to verify layout spacing.

- [ ] T018 [P] [US2] Migrate AboutPage styles to module in `client/src/pages/aboutPage/AboutPage.tsx` and `client/src/pages/aboutPage/AboutPage.module.css`
- [ ] T019 [P] [US2] Migrate ContactPage styles to module in `client/src/pages/contact/ContactPage.tsx` and `client/src/pages/contact/ContactPage.module.css`
- [ ] T020 [P] [US2] Migrate ProjectsPage and ServicesPage styles to modules in `client/src/pages/projects/ProjectsPage.tsx` and `client/src/pages/services/ServicesPage.tsx`

## Phase 6: Polish & Cleanup (User Story 3)
**Goal**: Remove all legacy CSS files and verify codebase.
**Independent Test**: Build project and grep for `.css` files.

- [ ] T021 [US3] Remove `EstimatorPage.css` and run final verification scan in `client/src`

## Dependencies

- Phase 1 (Setup) must complete before any other phase.
- Phase 3, 4, and 5 can be executed in parallel or any order (highly parallelizable).
- Phase 6 must run LAST to ensure no ghost files remain.

## Implementation Strategy

1. **Batching**: T002-T017 are grouped by functional area but can be implemented individually.
2. **Verification**: After each task, check the specific component in the browser.
3. **Variable Mapping**: Critical to replace hex codes with `var(...)` during the copy-paste process.

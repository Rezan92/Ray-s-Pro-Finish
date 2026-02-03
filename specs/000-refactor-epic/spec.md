# Epic Specification: Architectural Refactoring 2026

**Status**: Planning
**Owner**: Team
**Target Date**: 2026-03-31

## Executive Summary
This epic encompasses a major architectural modernization of the Ray Pro Finish codebase. The goal is to improve maintainability, type safety, and business logic separation by moving away from global/legacy patterns toward modular, industry-standard practices.

## Pillars

### 1. CSS Migration (Style Encapsulation)
**Goal**: Eliminate global CSS leakage and enforce component isolation.
**Strategy**: Migrate all component styling from global `.css` files to scoped CSS Modules (`.module.css`).
**Phases**:
1.  Core/Atomic Components (Completed)
2.  Layout & Global Structure
3.  Feature Components (Estimator)
4.  Page-Level Styles
5.  Content Sections

### 2. Redux Split (State Management)
**Goal**: Decouple the monolithic state store into feature-specific slices.
**Strategy**: Refactor the "Estimator" slice (currently a "God Slice") into smaller, domain-driven slices (e.g., `paintingSlice`, `basementSlice`, `uiSlice`).
**Key Drivers**:
- Separation of concerns
- Improved type inference
- Easier testing of individual business logic units

### 3. Pricing Centralization (Backend Integrity)
**Goal**: Single source of truth for business logic.
**Strategy**: Move all hardcoded pricing rates, material costs, and calculation formulas from the React frontend to a backend `masterRates.ts` (or database service).
**Key Drivers**:
- Prevent client-side manipulation
- Enable dynamic pricing updates without frontend redeploys
- Centralize logic for easier auditing

## Roadmap & Dependencies

1.  **[Current]** CSS Migration must be completed first to stabilize the visual layer before moving files around.
2.  **[Next]** Redux Split will follow, as it may involve moving components/logic which is easier with isolated styles.
3.  **[Final]** Pricing Centralization happens last, plugging into the new Redux slices to fetch data instead of calculating locally.

# Implementation Plan: Painting Man-Hour Pricing Refactor

**Branch**: `008-painting-man-hour-pricing-refactor` | **Date**: 2026-02-06 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/008-painting-man-hour-pricing-refactor/spec.md`

## Summary

Replace the existing flat-rate painting estimator with a robust, backend-driven man-hour calculation engine based on PCA standards. This includes a major refactor of `masterRates.ts` to centralize all labor and production rates, updating the `paintingService` to use these granular rates, and enhancing the `aiHelper` to generate high-conversion summaries from structured data. The frontend will be updated to support "Global Defaults" and "Exact Dimensions" for a smoother UX.

## Technical Context

**Language/Version**: TypeScript 5.x / React 18 / Node.js
**Primary Dependencies**: Redux Toolkit, Reselect, Gemini API (existing)
**Storage**: N/A (State management / Runtime calculation)
**Testing**: Manual regression testing of pricing logic and UI flows.
**Target Platform**: Web (React Client + Node.js API)
**Project Type**: Full-stack Web Application
**Performance Goals**: Instant calculation on the backend; <200ms response time for estimate generation.
**Constraints**:
- **Zero Pricing Opacity**: Admin must see every minute charged.
- **Strict Typing**: All new rate structures and summary objects must be fully typed.
- **No Client-Side Pricing**: All math must happen on the server to prevent manipulation and ensure consistency.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Styling & Visual System**: Updates to Estimator UI must use existing CSS Modules and variables. ✅
- **II. State & Data Logic**:
  - **Immutable Pricing**: Plan explicitly moves all logic to backend `masterRates.ts`. ✅
  - **Modular Redux**: New UI state (Global/Override) will live in `paintingSlice`. ✅
- **III. TypeScript & Standards**: Zero Tolerance policy enforced. ✅
- **IV. Backend Integrity**:
  - **Service Layer**: Calculation logic is isolated in `paintingService`. ✅
  - **Contract-First**: New `AdminSummary` contract will be defined. ✅
- **V. File Organization**: Plan targets `server/src/modules/estimator/` and `client/src/store/slices/`. ✅

## Project Structure

### Documentation (this feature)

```text
specs/008-painting-man-hour-pricing-refactor/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
server/
└── src/
    └── modules/
        └── estimator/
            ├── constants/
            │   └── masterRates.ts         <-- HEAVILY MODIFIED (Centralized Rates)
            ├── services/
            │   ├── paintingService.ts     <-- REWRITTEN (Man-Hour Logic)
            │   └── aiHelper.ts            <-- UPDATED (Structured Input)
            └── types.ts                   <-- UPDATED (New Interfaces)

client/
└── src/
    ├── components/
    │   └── common/
    │       └── estimator/
    │           ├── PaintingForm.tsx       <-- UPDATED (Global/Override UI)
    │           └── PaintingRoomCard.tsx   <-- UPDATED (Exact Dims)
    └── store/
        └── slices/
            └── paintingSlice.ts           <-- UPDATED (State shape)
```

**Structure Decision**: In-place refactor of existing modules to enforce the "Single Source of Truth" principle.

## Complexity Tracking

No violations found. The refactor reduces long-term complexity by centralizing pricing.
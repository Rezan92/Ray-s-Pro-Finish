# Implementation Plan: Painting Estimator Refactor (Man-Hour Driven)

**Branch**: `008-painting-man-hour-pricing-refactor` | **Date**: 2026-02-08 | **Spec**: [specs/008-painting-man-hour-pricing-refactor/spec.md](spec.md)

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Refactor the Painting Estimator from a square-foot price model to a granular "Man-Hour Driven" engine.
**Key changes:**
1.  **Backend**: Centralize all constants in `masterRates.ts` (Labor $75/hr). Refactor `paintingService.ts` to calculate time first (Time * Rate = Price). Add logic for Days calculation, Daily Trip charges, and Occupancy multipliers.
2.  **Frontend**: Update `PaintingRoomCard` to accept Exact Dimensions (overriding presets). Update `Stairwell` inputs for spindle types.
3.  **Admin**: Enforce detailed breakdown (Math explanation) and Surface Gallon counts.
4.  **Refinements (New)**: Global Project Configuration (Occupancy/Scope), Inheritance Logic, Stairwell specialized inputs, and UI polish for dimensions/closets.

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: React 18, Node.js (Express)
**Storage**: N/A (Stateless calculation, standard JSON payloads)
**Testing**: Vitest (Unit tests for Service logic)
**Target Platform**: Web (Admin & Customer views)
**Project Type**: Web application (Frontend + Backend)
**Performance Goals**: Instant calculation (<200ms)
**Constraints**: strictly use `masterRates.ts` constants. No Database Schema changes.
**Scale/Scope**: Single Service Refactor (Painting only)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Styling**: (N/A for backend, Frontend will use existing CSS Modules)
- [x] **II. State & Data Logic**:
    - [x] "Immutable Pricing": Pricing logic moved to `masterRates.ts` (Source of Truth).
    - [x] "Modular Redux": Will update `paintingSlice` (or `estimatorSlice`) with new fields, keeping it modular.
- [x] **III. TypeScript**:
    - [x] "Strict Mode": All new calculations will have explicit types.
    - [x] "No any": Interface `PaintingRoom` will be strictly typed.
- [x] **IV. Backend Integrity**:
    - [x] "Service Layer": Logic resides in `paintingService.ts`, not controller.
    - [x] "Contract-First": Plan includes updating `EstimatorTypes.ts` contract first.

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
backend/
├── src/
│   ├── modules/
│   │   └── estimator/
│   │       ├── constants/
│   │       │   └── masterRates.ts       # UPDATED: Single Source of Truth
│   │       ├── services/
│   │       │   └── paintingService.ts   # REFACTORED: Man-Hour Engine
│   │       └── types.ts                 # UPDATED: Shared Types

client/
├── src/
│   ├── components/
│   │   └── common/
│   │       └── estimator/
│   │           ├── PaintingForm.tsx     # UPDATED: Global Config & Inheritance
│   │           ├── PaintingRoomCard.tsx # UPDATED: Exact Dimensions, Closets, Stairwells
│   │           └── EstimatorTypes.ts    # UPDATED: Frontend Contract matching Backend
```

**Structure Decision**: Standard "Frontend + Backend" Web Application structure.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | | |

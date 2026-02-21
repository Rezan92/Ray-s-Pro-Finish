# Implementation Plan: Unit Pricing Refactor

**Branch**: `009-painting-square-feet-pricing-refactor` | **Date**: 2026-02-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/009-painting-square-feet-pricing-refactor/spec.md`

## Summary

Refactor the painting estimator from a "Time & Materials" model to a "Unit Pricing" model ($/sqft for walls/ceilings, $/lf for trim/crown). The system will derive labor hours from the calculated price using the "Reverse-Hour" formula ($Hours = Cost / 75$). This includes updating the data model to support coat-based color changes for trim/crown, applying surcharges for texture and detailed styles, and calculating equipment rental for high work.

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 20+ / React 18  
**Primary Dependencies**: Redux Toolkit, Vite, Express  
**Storage**: N/A (Stateless calculation, standard JSON payloads)  
**Testing**: npm test (Jest/Vitest)  
**Target Platform**: Modern Web Browsers  
**Project Type**: Web application (frontend + backend)  
**Performance Goals**: <50ms calculation time for estimate breakdown  
**Constraints**: Must maintain existing `BreakdownItem` interface structure  
**Scale/Scope**: Refactoring 1 service module, 1 redux slice, and 2-3 UI components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Styling**: New UI components for color change selection must use CSS Modules and variables.
- [x] **Redux**: Changes to `paintingSlice.ts` must follow modular patterns.
- [x] **Immutable Pricing**: All unit rates must be centralized in `masterRates.ts` (backend) and mapped from `square-feet-rates-reference.md`.
- [x] **Strict Types**: No `any` in new helper functions or interface updates.
- [x] **Service Layer**: Logic resides in `paintingService.ts`, not controllers or UI.

## Project Structure

### Documentation (this feature)

```text
specs/009-painting-square-feet-pricing-refactor/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
client/
├── src/
│   ├── components/common/estimator/
│   │   └── PaintingForm.tsx
│   ├── store/slices/
│   │   └── paintingSlice.ts
│   └── types/
│       └── painting.ts

server/
├── src/
│   ├── modules/estimator/
│   │   ├── services/
│   │   │   └── paintingService.ts
│   │   └── constants/
│   │       └── masterRates.ts
│   └── shared/
```

**Structure Decision**: Web application structure (Option 2) as the project has clear `client/` and `server/` directories.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |

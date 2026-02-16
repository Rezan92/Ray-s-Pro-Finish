# Quickstart: Painting Estimator Refactor

**Branch**: `008-painting-man-hour-pricing-refactor`

## 1. Overview
This refactor transitions the painting estimator from a "price-per-sqft" model to a "man-hour" model ($75/hr base). It enables exact dimension inputs, specific stairwell calculations, and detailed Admin breakdowns.

## 2. Key Files

*   **Source of Truth**: `server/src/modules/estimator/constants/masterRates.ts`
    *   *Must contain all labor rates, multipliers, and production constants.*
*   **Logic Engine**: `server/src/modules/estimator/services/paintingService.ts`
    *   *Now calculates `hours` first, then `cost`.*
*   **Frontend Contract**: `client/src/components/common/estimator/EstimatorTypes.ts`
    *   *Must match the updated `PaintingRoom` interface.*
*   **UI Components**:
    *   `PaintingRoomCard.tsx`: Add inputs for Length/Width/Height.
    *   `PaintingForm.tsx`: Add Global "Occupancy" dropdown.

## 3. Usage Guide

### 3.1 Running the Estimator
1.  Navigate to `/estimator` (frontend).
2.  Select "Interior Painting".
3.  **Customer View**: See simplified ranges.
4.  **Admin View**: Check the "Admin Breakdown" panel (if privileged) to see the `hours` x `$75` math.

### 3.2 Adding a New Room with Exact Dimensions
*   Toggle "Custom Size" or fill in the "Length", "Width", "Height" fields.
*   System overrides the "Small/Medium/Large" preset.

### 3.3 Verifying Calculations (Example)
*   **Scenario**: 10x10 Room (40' Perimeter), 8' Ceiling. Walls only.
*   **Manual Math**:
    *   Area: 40 * 8 = 320 sqft.
    *   Roll (2 coats): 320 / 400 (1st) + 320 / 550 (2nd) = 0.8 + 0.58 = 1.38 hrs.
    *   Cut (Standard): 40 / 120 = 0.33 hrs.
    *   Prep (Good): 3.2 * 0.15 = 0.48 hrs.
    *   **Total**: ~2.19 Hours.
    *   **Cost**: 2.19 * $75 = ~$164.25.

## 4. Development Workflow
1.  **Update Constants**: Edit `masterRates.ts`.
2.  **Update Types**: Edit `EstimatorTypes.ts` & `types.ts`.
3.  **Refactor Service**: Update `paintingService.ts` logic.
4.  **Update UI**: Edit React components.
5.  **Test**: Verify against the example above.
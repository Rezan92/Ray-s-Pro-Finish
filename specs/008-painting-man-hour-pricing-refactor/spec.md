# Feature: Painting Estimator Refactor (Man-Hour Driven)

## 1. Context

### 1.1 Problem Statement

The current painting estimator uses a simplified "price per sqft" model that hides calculation details and makes it difficult to adjust labor rates or explain costs to customers. It lacks precision for complex rooms (stairwells, closets) and does not support exact dimensions. We need to transition to a professional "Man-Hour Driven" model where time is calculated first, and price is derived from time.

### 1.2 Goals

- **Switch to Man-Hour Pricing**: Calculate distinct labor hours for every task, then multiply by the global labor rate ($75/hr).
- **Centralize Pricing**: Move all painting rates to `masterRates.ts`.
- **Improve Accuracy**: Support exact room dimensions (L x W x H) and specific attributes for Stairwells and Closets.
- **Transparency**: Provide a detailed "Admin View" that shows the exact math (dimensions × rate = hours) for every line item.
- **Project-Wide Defaults**: Allow users to set global defaults (e.g., "Premium Paint") that apply to all rooms unless overridden.

### 1.3 Out of Scope

- Database schema changes (must use existing JSON structures).
- Refactoring other services (Garage, Basement, etc.).
- Authentication or User Management changes.

---

## 2. User Scenarios

### 2.1 Admin Creates a Detailed Estimate

**Actor**: Admin / Sales Rep
**Flow**:

1. Admin opens the Painting Estimator.
2. Admin sets Global defaults: "Occupancy: Furnished", "Paint: Premium".
3. Admin adds a "Living Room".
4. Admin enters exact dimensions: 18' x 22' x 12' height.
5. Admin selects "Walls" (Color Change: Dark-to-Light) and "Ceiling" (Popcorn).
6. System calculates Man-Hours:
   - Walls: (Area / Rate) + (Prep) + (Dark-to-Light surcharge).
   - Ceiling: (Area / Popcorn Rate) \* Height Multiplier.
   - Setup: Daily Trip constant added.
   - Equipment: High Ceiling Equipment Rental added automatically.
7. Admin views the "Breakdown" and sees every hour fraction and rate used.
8. Total Price is displayed as `Total Hours * $75 + Materials`.

### 2.2 Customer Uses the Estimator

**Actor**: Homeowner
**Flow**:

1. Customer selects "Interior Painting".
2. Customer answers global questions (Furniture, Paint Provider).
3. Customer adds a "Bedroom" and selects "Medium (12x14)" preset.
4. Customer adds a "Stairwell" and enters "15 Steps", "20 Spindles".
5. System calculates internal man-hours but displays a simplified "Total Estimated Range".

### 2.3 Project-Wide Defaults

**Actor**: User
**Flow**:

1. User changes "Paint Provider" to "Customer Provided" at the top level.
2. All existing and new rooms update to inherit this setting.
3. User goes to "Bedroom 1" and overrides it to "Premium Paint".
4. Estimate reflects the mix of settings.

---

## 3. Functional Requirements

### 3.1 Rate Management (Backend)

- **F-001**: `masterRates.ts` MUST contain all painting rates defined in `rates-reference.md`.
- **F-002**: All calculations MUST use a base labor rate of **$75.00/hour**.
- **F-003**: Production rates (e.g., 400 sqft/hr rolling) MUST be defined as constants, not hardcoded numbers.

### 3.2 Man-Hour Engine (Backend)

- **F-004**: System MUST calculate `Total Man-Hours` for every line item before calculating price.
- **F-005**: **Walls Logic**:
  - Calculate Area: `Perimeter * Height`.
  - Apply `Rolling Rate` (1st/2nd coat).
  - **Color Change Logic**: "Dark-to-Light" implies **3 coats total** (1 Primer + 2 Finish).
    - Base calculation: Use 1st Coat Rate + 2nd Coat Rate.
    - Surcharge: Add `0.50 hours` per 100 sqft.
    - _Clarification_: The surcharge is _additional_ time to account for the primer coat and extra care, not a replacement for standard rolling time.
  - Apply `Cutting Rate` (Standard/High Contrast).
  - Apply `Prep Time` (Good/Fair/Poor).
- **F-006**: **Ceiling Logic**:
  - Calculate Area: `L * W`.
  - Apply `Texture Rate` (Smooth vs Popcorn).
  - Apply `Height Multiplier` (1.10x for 10', 1.25x for 12'+, 1.45x for Vaulted) to **Hours**.
- **F-007**: **Trim & Doors**:
  - Baseboards: `Length / 60 ft/hr`.
  - **Crown Molding**:
    - Simple: `40 linear feet per hour`.
    - Detailed: `25 linear feet per hour`.
    - _Rule_: User selection of "Simple" vs "Detailed" directly selects the divisor rate.
  - **Conversion Multiplier**: If "Stained to Painted" is selected, multiply the final trim man-hours by **3.0x**.
  - Doors: Fixed time per Slab/Paneled door.
  - Windows: Fixed time per frame.
- **F-008**: **Stairwells**:
  - **Spindles**:
    - Square: `12 minutes` (0.2 hr) per spindle.
    - Intricate: `30 minutes` (0.5 hr) per spindle.
  - Handrails: `6 linear feet per hour`.
  - Steps (Risers + Stringers): `20 minutes` per step.
  - _Alignment_: UI must allow selecting Spindle Type and entering Count. Backend uses the specific rate per type.
- **F-009**: **Closets**:
  - Apply fixed man-hour values based on size (Standard/Medium/Large).
- **F-010**: **Workday Logic**:
  - Assume an **8-hour workday** for all projects.
  - Total project days equals total labor hours divided by 8 and rounded up.
  - Daily Trip fee of **45 minutes** is added per calculated day.

### 3.3 Estimator UI (Frontend)

- **F-011**: **UI Polish & Integrated Dimensions**:
  - Integrate "Enter Exact Dimensions" into the standard Size dropdown as an option after "Small, Medium, Large, Extra Large."
  - When selected, reveal Length and Width number fields directly below the dropdown without hiding it.
  - Simultaneously convert the standard "Ceiling Height" dropdown into a Number Input field for that room.
- **F-012**: **Stairwell Specialization**:
  - Remove irrelevant options like Windows, Doors, or Crown Molding from the Stairwell card. Focus only on Walls, Ceiling, and Woodwork/Trim.
  - Add "Wall Length" (LF) and "Max Wall Height" (ft) inputs.
  - Automatically trigger the $200 equipment rental fee if Max Height > 12ft.
  - Apply a **1.5x difficulty multiplier** to all trim/skirt-board labor in this card.
  - Rename "Surface Condition" to "Wall/Trim Condition".
- **F-013**: **Closet Logic (Bedroom Only)**:
  - Add a "Closet Included?" checkbox to Bedroom cards only.
  - If checked, reveal a size dropdown: Standard, Medium, or Large Walk-in.
- **F-014**: **Global Scope & Inheritance**:
  - Move "What needs painting?" (Walls, Ceiling, Trim, etc.), "Surface Condition", and "Color Change" to the Global level.
  - Every room card MUST feature a "Customize this area" checkbox.
  - **Unchecked**: Room inherits all global settings.
  - **Checked**: Room card reveals local overrides for that specific space.

### 3.4 Refined Global Config & Outputs

- **F-016**: **Unified Occupancy Logic**:
  - Merge "Furniture" and "Occupancy" into one global question.
  - **Options**:
    - "Empty / New Construction" (1.0x).
    - "I will move and cover everything" (1.0x).
    - "Occupied - Light Furniture": Owner moves small items, painter covers large pieces (1.20x).
    - "Occupied - Full Furniture": Painter moves and covers everything (1.35x).
  - **Constraint**: No technical multipliers (1.0, 1.2, 1.35) should be visible to the user.
- **F-015**: **Admin Output**:
  - Admin output MUST return an array of breakdown items with detailed math (dimensions × rate = hours).
  - **Material Breakdown (Admin Only)**: Must explicitly list gallon estimates per surface type: `Walls: X gal`, `Ceiling: Y gal`, `Trim: Z gal`.

---

## 4. Technical Specifications

### 4.1 Data Structures

- **Input Types**: Update `PaintingRoom` to include `exactLength`, `exactWidth`, `exactHeight`, `stairSteps`, `stairSpindles`, `stairHandrail`, `isCustomized`.
- **Constants**: strictly adhere to `rates-reference.md`.
- **Redux State**: Update `paintingSlice.ts` to manage `globalDefaults` and the `isCustomized` flag for each room.

### 4.2 API Changes

- Update `calculatePaintingEstimate` in `paintingService.ts`.
- No route changes required (POST `/api/estimate` remains).

---

## 5. Success Criteria

- **SC-001**: A "Standard Room" (10x10x8, Walls Only, 2 coats) calculates to exactly the man-hours defined in the reference manual +/- 0.1 hr.
- **SC-002**: Selecting "12ft Max Height" in a Stairwell triggers the Equipment Rental fee ($200).
- **SC-003**: Stairwell trim labor includes the 1.5x difficulty multiplier.
- **SC-004**: Room inheritance works: changing a global default updates all non-customized rooms.

## 6. Assumptions & Risks

- **Assumption**: "Daily Trip" applies per calculated 8-hour workday increment.
- **Risk**: Complex state management for inheritance might lead to UI synchronization issues if not handled carefully in Redux.

---

## 7. Review Summary

### 7.1 Key Updates & Refinements

- **Unified Occupancy (F-016)**: Merged Furniture and Occupancy into a single global question with user-friendly labels.
- **Global Scope (F-014)**: Moved scope and condition questions to Global level with room-level override (Inheritance logic).
- **Workday Logic (F-010)**: Refined daily trip fee to scale with 8-hour increments of total labor.
- **Stairwell Specifics (F-012)**: Specialized Stairwell card with wall dimensions and 1.5x trim multiplier.
- **UI Polish (F-011)**: Integrated exact dimensions into Size dropdown and converted height to number input.
- **Redux Integration**: Added requirement to update `paintingSlice.ts` for state management of refinements.

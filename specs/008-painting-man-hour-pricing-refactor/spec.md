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
   - Ceiling: (Area / Popcorn Rate) * Height Multiplier.
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
        - *Clarification*: The surcharge is *additional* time to account for the primer coat and extra care, not a replacement for standard rolling time.
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
        - *Rule*: User selection of "Simple" vs "Detailed" directly selects the divisor rate.
    - **Assume** an 8-hour workday. Total Project Days = Total Labor Hours / 8 (rounded up). Add 0.75 hours (45 mins) per calculated project day.
    - Doors: Fixed time per Slab/Paneled door.
    - Windows: Fixed time per frame.
- **F-008**: **Stairwells**:
    - **Spindles**:
        - Square: `12 minutes` (0.2 hr) per spindle.
        - Intricate: `30 minutes` (0.5 hr) per spindle.
    - Handrails: `6 linear feet per hour`.
    - Steps (Risers + Stringers): `20 minutes` per step.
    - *Alignment*: UI must allow selecting Spindle Type and entering Count. Backend uses the specific rate per type.
- **F-009**: **Closets**:
    - Apply fixed man-hour values based on size (Standard/Medium/Large).
- **F-010**: **Global Add-ons**:
    - **Workday Logic**: Assume an **8-hour workday**.
        - `Total Project Days` = `Total Labor Hours` / 8 (rounded up).
    - **Daily Trip**: Add **0.75 hours** (45 mins) *per calculated project day*.
        - *Reason*: Trips happen daily, not just once per project.
    - **Equipment**: Automatically add $200/day rental fee if any room has Height >= 12ft or is classified as Vaulted.
- **F-016**: **Occupancy & Furniture**:
    - UI must ask: "Do you need us to cover/move furniture?"
    - **Multipliers**:
        - Empty/New: 1.00x
        - Light Furniture (Owner moves, we cover): **1.20x** to labor time.
        - Heavy Furniture (We move & cover): **1.35x** to labor time.
    - *Interaction*: Set as a Global Default; can be overridden per room if needed (though typically project-wide).

### 3.3 Estimator UI (Frontend)
- **F-011**: Room Card MUST accept **Exact Dimensions** (Length, Width, Height in feet).
    - If Exact Dimensions are provided, ignore Presets.
    - If Exact Dimensions are empty, use Presets (Small/Medium/Large).
- **F-012**: Stairwell Card MUST include inputs for Wall Length (LF) and Max Wall Height (ft). If Max Wall Height > 12ft, automatically trigger the $200 equipment rental fee. also include Number of Spindles.
    - Number of Spindles (Simple/Intricate).
    - Handrail Length (ft).
- **F-013**: Closet selection MUST offer "Standard", "Medium (Walk-in)", "Large (Master)" with tooltip explanations.
- **F-014**: Project Defaults' section MUST include: Paint Provider, Occupancy/Furniture (Unified), What Needs Painting (Surfaces), Surface Condition, and Color Change.

### 3.4 Outputs
- **F-015**: Admin output MUST return an array of breakdown items, each containing:
    - `name`: Description of task.
    - `hours`: Calculated man-hours.
    - `cost`: Derived cost.
    - `details`: Text explanation (e.g., "400 sqft @ 150sqft/hr (Popcorn) x 1.25 Height").
    - **Material Breakdown (Admin Only)**:
        - Must explicitly list gallon estimates per surface type: `Walls: X gal`, `Ceiling: Y gal`, `Trim: Z gal`.
        - *Reason*: Admins need to verify material ordering quantities against the calculated surface areas.

---

## 4. UI/UX Improvements (Refinement Phase)

### 4.1 Global Project Configuration
- **F-017**: **Merged Occupancy & Furniture Logic**:
    - Merge existing "Furniture" and "Occupancy" questions into one global dropdown.
    - **Options**:
        - "Empty / New Construction" (1.0x).
        - "I will move and cover everything" (1.0x).
        - "Occupied - Light Furniture" (1.20x).
        - "Occupied - Full Furniture" (1.35x).
    - **Constraint**: Do not show multipliers (1.2x) in the UI text.
- **F-018**: **Global Service Scope**:
    - Move "What needs painting?" (Walls, Ceiling, Trim, etc.), "Surface Condition", and "Color Change" to the Global level.
    - Answering once applies to all rooms.
- **F-019**: **Inheritance & Customization**:
    - Add "Customize this area" checkbox to every Room Card.
    - **Unchecked**: Room inherits global settings.
    - **Checked**: Room reveals inputs to override global settings.

### 4.2 Component-Specific UI Updates
- **F-020**: **Trim Painting Style**:
    - Replace "Stained to Painted" checkbox with a Dropdown: `Standard Painting` vs `Stained to Painted` (3.0x multiplier).
- **F-021**: **Refined Color Change Logic**:
    - Dropdown Options:
        - `Refresh (Same Color)` -> 1 Coat Rate.
        - `Color Change (Light-to-Light/Dark)` -> 2 Coat Rate.
        - `Color Change (Dark-to-Light)` -> Primer + 2 Coats (Trigger F-005 surcharge).
- **F-022**: **Bedroom Closet Logic**:
    - Add "Closet Included?" checkbox (Bedroom only).
    - If checked, show Size Dropdown: `Standard`, `Medium`, `Large Walk-in`.
- **F-023**: **Integrated Dimensions**:
    - Move "Enter exact dimensions" to be an option *inside* the "Size" dropdown.
    - Selecting it reveals L/W fields inline.
    - Convert "Ceiling Height" dropdown to a Number Input field.

### 4.3 Stairwell Specifics
- **F-024**: **Stairwell Definition**:
    - **Size Inputs**: "Wall Length" (linear ft) and "Max Wall Height" (ft).
    - **Scope**: Remove Windows/Doors/Crown options. Keep Walls, Ceiling, Trim only.
    - **Prep**: Rename "Surface Condition" to "Wall/Trim Condition".
- **F-025**: **Detailed Woodwork**:
    - **Spindles**: Type (Square/Intricate) + Count.
    - **Handrails**: Linear Feet input.
    - **Steps**: Count input (calculates Risers/Stringers).
- **F-026**: **Stairwell Calculations**:
    - Apply **1.5x Difficulty Multiplier** to all Trim logic (Baseboards/Skirts) in stairwells.
    - **Equipment**: If Max Wall Height > 12ft, trigger $200/day equipment fee.

---

## 5. Technical Specifications

### 5.1 Data Structures
- **Input Types**: Update `PaintingRoom` to include `exactLength`, `exactWidth`, `exactHeight`, `stairSteps`, `stairSpindles`, `stairHandrail`.
- **Constants**: strictly adhere to `rates-reference.md`.
- **Dependency**: `data-model.md` (if it exists) or the `EstimatorTypes.ts` file must be updated to support:
    - `exactDimensions` fields.
    - `stairSpindleType` and `stairSpindleCount`.
    - `trimConversion` (Stained to Painted) boolean.
    - `crownMoldingType` (Simple/Detailed).
    - `surfaceCondition` (Good/Fair/Poor).

### 5.2 API Changes
- Update `calculatePaintingEstimate` in `paintingService.ts`.
- No route changes required (POST `/api/estimate` remains).
- **Admin Detection**: The system currently uses an existing URL parameter (e.g., `?admin=...`) or state to detect Admin privileges. We will rely on this existing mechanism to conditionally show the detailed F-015 output. No new auth logic is added.

---

## 6. Success Criteria
- **SC-001**: A "Standard Room" (12x14x8, Walls Only, 2 coats) calculates to exactly the man-hours defined in the reference manual +/- 0.1 hr.
- **SC-002**: Selecting "12ft Ceiling" triggers both the Height Multiplier (1.25x) AND the Equipment Rental fee ($200).
- **SC-003**: Stairwell calculation accounts for specific spindle counts (e.g., 20 spindles * 12 mins = 4 hours).
- **SC-004**: Admin breakdown clearly distinguishes between Labor Cost (Time * $75) and Material Cost.

## 7. Assumptions & Risks
- **Assumption**: Users entering "Exact Dimensions" provide accurate feet measurements.
- **Assumption**: "Daily Trip" applies once per project (not per room).
- **Risk**: Complex stairwell geometries might still be under-estimated; strictly follow the linear/count model for now.

---

## 8. Review Summary

### 8.1 Key Updates & Clarifications
- **Walls Logic (F-005)**: Explicitly defined "Dark-to-Light" as 1 Primer + 2 Finish coats, plus the surcharge. Clarified surcharge is additive.
- **Trim & Doors (F-007)**: Added 3.0x multiplier for Stained-to-Painted conversion. Added specific production rates for Simple vs. Detailed Crown Molding.
- **Stairwells (F-008)**: Explicitly distinguished Square vs. Intricate spindle rates (12 vs 30 mins), aligning frontend inputs with backend math.
- **Workday Logic (F-010)**: Added calculation for Total Project Days (Hours / 8) to correctly apply the Daily Trip charge multiple times for larger jobs.
- **Occupancy (F-016)**: Added specific labor multipliers (1.20x, 1.35x) for furniture handling, replacing the previous flat fee approach.
- **Admin Output (F-015)**: Added requirement for distinct Gallon Breakdown per surface type to aid in material ordering.
- **Dependencies (4.1)**: Noted required updates to `EstimatorTypes.ts` to support new fields.

### 8.2 Refinement Phase (New)
- **Global Config**: Merged Occupancy/Furniture, moved scope questions to Global, added Inheritance logic.
- **UI Polish**: Integrated exact dimensions into size dropdown, improved Trim/Closet/Color-Change UIs.
- **Stairwell Logic**: Specialized inputs and 1.5x trim multiplier.

### 8.3 Next Steps
**Command to Run**: `.specify/scripts/powershell/setup-plan.ps1` (via `/speckit.plan` tool) to generate the technical implementation plan.

**Suggested Commit Message**: `spec(painting): clarify man-hour logic, add workday calc, and refine stairwell rates`
# Research: Unit Pricing Refactor

## Decisions & Rationale

### 1. Calculation Engine: "Reverse-Hour" Strategy
- **Decision**: Calculate `Labor Price` first based on unit rates ($/sqft, $/lf), then derive `Hours = Price / 75`.
- **Rationale**: Align with the project's goal of simplified, unit-based pricing for homeowners while maintaining scheduling data (hours).
- **Rounding**: Hours will be stored and displayed with 2 decimal places (`.toFixed(2)`). Internal sums will use floating point precision.

### 2. Equipment Rental Logic
- **Decision**: Track "High Work Hours" (HWH) across all rooms where surface height $\ge 12ft$.
- **Formula**: `Rental Days = ceil(Total HWH / 8)`.
- **Rate Selection**: 
    - If `Max Height` in any room is $\ge 15ft$, apply **Scaffolding Rate ($150)**.
    - Otherwise, if `Max Height` $\ge 12ft$, apply **Ladder Rate ($60)**.
- **Rationale**: Equipment needs are determined by the most challenging part of the project. A single scaffolding setup can often be moved around, but the rental cost is fixed per day.

### 3. Trim & Crown Refinement
- **Decision**: Use `trimColorChange` and `crownColorChange` enums ('Similar', 'Change', 'Dark-to-Light') to map directly to coat counts (1, 2, 3) and their unit rates.
- **Rationale**: Replaces the binary `trimConversion` which was insufficient for specifying complexity.
- **Condition Surcharges**: "Poor" condition on trim triggers a standalone "Trim Prep (Caulking)" line item ($0.35/lf). "Detailed" style on crown molding triggers a 20% surcharge on the calculated labor price.

## Alternatives Considered

- **Per-Room Rental**: Rejected because equipment is typically rented for the entire project duration, not room-by-room.
- **Dynamic Hours per Unit**: Considered mapping unit rates to hours first, but calculating Price first is more resilient to future base-rate changes.

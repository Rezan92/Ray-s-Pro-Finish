# Feature Specification: Refactor Painting Estimator to Unit-Based Pricing

**Feature Branch**: `009-painting-square-feet-pricing-refactor`  
**Created**: 2026-02-18  
**Status**: Draft  
**Input**: User description: "Refactor Painting Estimator to Unit-Based Pricing"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Standard Wall Refresh (Priority: P1)

As a homeowner, I want to get an estimate for refreshing my walls with the same color so that I can see a lower price reflecting the reduced labor required for a single coat.

**Why this priority**: Core functionality of the pricing refactor. Refreshing is a very common use case.

**Independent Test**: Can be tested by selecting "Refresh" (1 Coat) for a room's walls and verifying the unit price is $0.58/sqft.

**Acceptance Scenarios**:

1. **Given** a room with 400 sqft of walls, **When** "Refresh" is selected, **Then** the labor cost should be $232.00 (400 * 0.58) and hours should be 3.09 (232 / 75).

---

### User Story 2 - Ceiling with Texture Surcharge (Priority: P2)

As a homeowner with popcorn ceilings, I want the estimate to account for the increased difficulty of painting textured surfaces.

**Why this priority**: Ensures surcharges are correctly applied to base unit rates.

**Independent Test**: Can be tested by selecting "Popcorn" texture for a ceiling and verifying the +40% surcharge on the base labor rate.

**Acceptance Scenarios**:

1. **Given** a 200 sqft ceiling requiring 2 coats ($0.94/sqft base), **When** "Popcorn" texture is selected, **Then** the unit price should be $1.316/sqft (0.94 * 1.4) and total labor cost $263.20.

---

### User Story 3 - High Ceiling Equipment Rental (Priority: P2)

As a homeowner with a 15ft vaulted ceiling, I want to see the equipment rental costs clearly separated from labor so I understand the overhead for high work.

**Why this priority**: Essential for accurate project overhead calculation and transparency.

**Independent Test**: Can be tested by setting ceiling height to 15ft and verifying the "Equipment Rental" line item appears.

**Acceptance Scenarios**:

1. **Given** a project with 12 high work hours (height >= 15ft), **When** calculating totals, **Then** "Equipment Rental" should be $300.00 (2 days @ $150/day).

---

### User Story 4 - Trim Condition & Detailed Crown (Priority: P3)

As a homeowner with old trim in poor condition and detailed crown molding, I want the estimate to reflect the extra prep and detail work required.

**Why this priority**: Covers specific surcharges and standalone prep items.

**Independent Test**: Can be tested by selecting "Poor" trim condition and "Detailed" crown molding style.

**Acceptance Scenarios**:

1. **Given** 100 lf of trim in "Poor" condition, **When** calculating, **Then** a "Trim Prep (Caulking)" line item should appear at $35.00 (100 * 0.35).
2. **Given** 50 lf of "Detailed" crown molding, **When** calculating, **Then** the labor cost should include a +20% surcharge.

### Edge Cases

- **Rounding:** How does the system handle fractional hours when performing the "Reverse-Hour" calculation (Cost / 75)? (Assumption: Round to 2 decimal places).
- **Multiple High Work Areas:** If multiple rooms have high ceilings, "High Work Hours" must be aggregated before calculating rental days.
- **Zero Square Feet:** Ensure system doesn't crash or create line items for rooms with 0 area.

## Assumptions

- **Hourly Rate Stability:** The $75/hr labor rate remains the constant for "Reverse-Hour" calculations.
- **Rental Threshold:** Work under 12ft requires no special equipment rental.
- **Rental Duration:** A rental day is exactly 8 hours of "High Work" time.
- **Surcharge Calculation:** Percentage surcharges are always applied to the Base Labor Price before any other additions.
- **Wait Time:** Setup and teardown for scaffolding/ladders are included in the unit rates or accounted for in the daily rental rate.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001: Unit-Based Wall Pricing:** System MUST calculate wall labor cost based on coat count: Refresh ($0.58/sqft), Color Change ($0.94/sqft), Dark-to-Light ($1.36/sqft).
- **FR-002: Unit-Based Ceiling Pricing:** System MUST calculate ceiling labor cost using base rates (Smooth) plus texture surcharges: Orange Peel (+15%), Popcorn (+40%).
- **FR-003: Reverse-Hour Formula:** System MUST derive labor hours for every line item using the formula: `Hours = Labor Cost / 75`.
- **FR-004: Unit-Based Trim/Crown Pricing:** System MUST calculate trim and crown labor based on linear feet and coat count derived from `trimColorChange` and `crownColorChange`.
- **FR-005: Detailed Crown Surcharge:** System MUST apply a +20% surcharge to crown molding labor cost if `crownMoldingStyle` is 'Detailed'.
- **FR-006: Standalone Trim Prep:** System MUST add a separate "Trim Prep (Caulking)" line item at $0.35/lf if `trimCondition` is 'Poor'.
- **FR-007: Equipment Rental Calculation:** System MUST track hours for work performed at heights >= 12ft ("High Work Hours") and calculate rental days as `ceil(High Work Hours / 8)`.
- **FR-008: Equipment Rental Rates:** System MUST apply $60/day for heights 12-15ft (Ladder) and $150/day for heights 15ft+ (Scaffolding). If both occur, the higher rate ($150) applies to the total rental days.
- **FR-009: Data Model Updates:** System MUST remove `trimConversion` and add `trimColorChange` / `crownColorChange` (Enum: 'Similar', 'Change', 'Dark-to-Light').

### Key Entities *(include if feature involves data)*

- **Labor Price ($):** The calculated price based on unit rate (SqFt or LF) and coat count.
- **Labor Hours (hrs):** Derived from Labor Price / $75.
- **High Work Hours:** Aggregated hours for any task where surface height >= 12ft.
- **Rental Days:** `Math.ceil(High Work Hours / 8)`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001:** All labor line items in the breakdown MUST have an `hours` property where `hours * 75` equals the `cost` (within $0.01 rounding).
- **SC-002:** Total estimate price for a standard "Color Change" wall project matches the $0.94/sqft target exactly.
- **SC-003:** Equipment rental fees are correctly calculated for 100% of projects exceeding 12ft height.
- **SC-004:** Pricing logic utilizes the `square-feet-rates-reference.md` as the single source of truth for all unit rates.

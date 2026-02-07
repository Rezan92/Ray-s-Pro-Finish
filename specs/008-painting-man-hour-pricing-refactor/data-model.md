# Data Model: Man-Hour Pricing Source of Truth

This document contains the exact production rates and constants to be used in the refactor.

## I. Global Project Variables & Multipliers

| Variable | Option | Value |
|----------|--------|-------|
| Hourly Labor Rate | Base | **$75.00** |
| Daily Trip Constant | Setup/Cleanup | 45 Minutes per day |
| Equipment Rental | Scaffolding/Lift | $200.00 flat daily fee (for 15ft+ or Vaulted) |
| Occupancy Factor | Empty / New Const. | 1.00x |
| Occupancy Factor | Light Furniture | 1.20x |
| Occupancy Factor | Full Furniture | 1.35x |
| Ceiling Height Factor | 8ft - 9ft (Standard) | 1.00x |
| Ceiling Height Factor | 10ft | 1.10x |
| Ceiling Height Factor | 12ft - 14ft | 1.25x |
| Ceiling Height Factor | Vaulted (18ft+) | 1.45x |

## II. Room Defaults (Automatic Calculations)

- **Standard Masking**: 5 Minutes per Window, 5 Minutes per Ceiling Fixture.
- **Electrical**: 3 Minutes per Plate (Assume 4 plates per room).
- **Floor Protection**: 15 Minutes per 100 SF of floor area.

### Dimension Defaults (Reference for Presets)
- **Small (10x10)**: 320 SF Walls / 100 SF Ceiling / 40 LF Perimeter.
- **Medium (12x14)**: 416 SF Walls / 168 SF Ceiling / 52 LF Perimeter.
- **Large (15x16)**: 496 SF Walls / 240 SF Ceiling / 62 LF Perimeter.

## III. Component Mapping & Production Rates

### 1. Walls (Rolling & Cutting)
- **Rolling (1st Coat)**: 400 SFPH
- **Rolling (2nd Coat)**: 550 SFPH
- **Perimeter Cutting (Standard)**: 120 LFPH
- **Perimeter Cutting (High Contrast)**: 75 LFPH
- **Color Change logic**: 
  - Refresh (1 Coat): Use 1st Coat rates.
  - Full Change (2 Coats): 1st Coat Time + 2nd Coat Time.
  - Dark-to-Light: Add 0.50 Man-Hours per 100 SF.

### 2. Surface Condition (Preparation)
- **Good**: 0.15 Man-Hours per 100 SF
- **Fair**: 0.40 Man-Hours per 100 SF
- **Poor**: 1.25 Man-Hours per 100 SF

### 3. Ceilings & Trim
- **Smooth Ceiling**: 350 SFPH (1st) / 500 SFPH (2nd)
- **Popcorn Ceiling**: 150 SFPH (1st) / 250 SFPH (2nd)
- **Standard Trim (Baseboards)**: 60 LFPH (Painted) / 35 LFPH (Stained Conversion)
- **Stained-to-Painted Multiplier**: 3.0x multiplier to all Trim/Door labor.

### 4. Closets (Total Man-Hours)
- **Standard (2x4)**: 1.5 hrs
- **Medium (5x5)**: 2.5 hrs
- **Large (6x10)**: 4.0 hrs

### 5. Stairwells
- **Square Spindle**: 12 Minutes each.
- **Intricate Spindle**: 30 Minutes each.
- **Handrail**: 6 Linear Feet per Hour.
- **Risers/Stringers**: 20 Minutes per step.
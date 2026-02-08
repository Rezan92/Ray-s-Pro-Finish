# Painting Service Man-Hour Pricing Reference
**Status:** Authoritative Source of Truth
**Date:** February 2026

## 1. Global Project Variables & Multipliers

| Item | Value | Unit | Notes |
| :--- | :--- | :--- | :--- |
| **Hourly Labor Rate** | **$75.00** | /hour | Base rate for all calculations. |
| **Daily Trip Constant** | **0.75** | hours | (45 mins) Setup/cleanup per day. Added to final total. |
| **Occupancy: Empty/New** | **1.00x** | multiplier | No furniture. |
| **Occupancy: Light Furn.** | **1.20x** | multiplier | Customer moves small items, painter covers. |
| **Occupancy: Full Furn.** | **1.35x** | multiplier | Heavy furniture present. |
| **Ceiling Height: 8-9'** | **1.00x** | multiplier | Standard. |
| **Ceiling Height: 10'** | **1.10x** | multiplier | Moderate height. |
| **Ceiling Height: 12-14'** | **1.25x** | multiplier | High. |
| **Ceiling Height: 18'+** | **1.45x** | multiplier | Vaulted. |

### Equipment Rental
*   **Trigger:** Automatically applied for 12ft+ or Vaulted ceilings.
*   **Cost:** **$200.00** flat fee per day (Lift/Scaffolding).

---

## 2. Production Rates (Man-Hours Calculation)

### Walls (Rolling & Cutting)
| Action | Rate | Unit | Notes |
| :--- | :--- | :--- | :--- |
| **Roll 1st Coat** | **400** | sqft/hr | |
| **Roll 2nd Coat** | **550** | sqft/hr | |
| **Cut (Standard)** | **120** | lin.ft/hr | Standard base/ceiling/corners. |
| **Cut (High Contrast)** | **75** | lin.ft/hr | Required for sharp lines (e.g., dark wall, white trim). |
| **Prep: Good** | **0.15** | hrs/100sqft | Minor nail holes. |
| **Prep: Fair** | **0.40** | hrs/100sqft | Scuffs, dings. |
| **Prep: Poor** | **1.25** | hrs/100sqft | Cracks, stains, extensive patching. |

**Color Change Logic:**
*   **Refresh (Same Color):** 1 Coat Rate.
*   **Full Change:** 1st Coat Rate + 2nd Coat Rate.
*   **Dark-to-Light Surcharge:** Add **0.50 hours** per 100 sqft (extra priming/coverage).

### Ceilings
| Surface Type | 1st Coat Rate | 2nd Coat Rate | Unit |
| :--- | :--- | :--- | :--- |
| **Smooth** | **350** | **500** | sqft/hr |
| **Popcorn** | **150** | **250** | sqft/hr |

### Trim & Moldings
| Item | Rate | Unit | Notes |
| :--- | :--- | :--- | :--- |
| **Baseboards (Paint)** | **60** | lin.ft/hr | Standard trim. |
| **Crown (Simple)** | **40** | lin.ft/hr | Smooth/Basic profile. |
| **Crown (Detailed)** | **25** | lin.ft/hr | Ornate/Dentil profile. |
| **Conversion (Stain->Paint)** | **3.0x** | multiplier | Requires sanding, oil prime, 2 coats. |
| **Caulking (Poor Cond.)** | **0.025** | hrs/lin.ft | Add-on for gap filling. |

---

## 3. Fixed Item Calculations

### Closets (Bedroom Only)
| Size | Man-Hours | Dimensions (Ref) |
| :--- | :--- | :--- |
| **Standard** | **1.5** | 2' x 4' |
| **Medium** | **2.5** | 5' x 5' (Walk-in) |
| **Large** | **4.0** | 6' x 10' (Master) |

### Stairwells
| Item | Time | Unit |
| :--- | :--- | :--- |
| **Square Spindle** | **12** | mins/each |
| **Intricate Spindle** | **30** | mins/each |
| **Handrail** | **6** | lin.ft/hr |
| **Risers & Stringers** | **20** | mins/step |

### Room Defaults (Auto-Calculated)
| Item | Time | Qty Assumption |
| :--- | :--- | :--- |
| **Masking (Windows)** | **5** mins | Per window. |
| **Masking (Fixtures)** | **5** mins | Per ceiling fixture. |
| **Electrical Plates** | **3** mins | Per plate (Assume 4/room). |
| **Floor Protection** | **15** mins | Per 100 sqft floor area. |

---

## 4. Reference Dimensions (Presets)
*Used only if exact dimensions are not provided.*

| Size | Walls (sqft) | Ceiling (sqft) | Perim (lf) | Approx Dim |
| :--- | :--- | :--- | :--- | :--- |
| **Small** | 320 | 100 | 40 | 10' x 10' |
| **Medium** | 416 | 168 | 52 | 12' x 14' |
| **Large** | 496 | 240 | 62 | 15' x 16' |

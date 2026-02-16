# Data Model: Painting Estimator Refactor

**Branch**: `008-painting-man-hour-pricing-refactor`

## 1. Entities

### 1.1 PaintingRoom (Updated)
*Shared interface for Frontend Input and Backend Processing.*

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | string | Yes | Unique ID (e.g., `bedroom_1`) |
| `type` | string | Yes | `bedroom`, `kitchen`, `stairwell`, etc. |
| `size` | string | Yes | Preset: `Small`, `Medium`, `Large` |
| **`exactLength`** | number | No | **NEW**: User-defined length (ft). Overrides preset. |
| **`exactWidth`** | number | No | **NEW**: User-defined width (ft). Overrides preset. |
| **`exactHeight`** | number | No | **NEW**: User-defined height (ft). Overrides preset. |
| `ceilingHeight`| string | Yes | Preset bucket: `8ft`, `9-10ft`, `11ft+` (Fallback) |
| `surfaces` | Object | Yes | Selection flags: `{ walls, ceiling, trim, doors, windows, crownMolding }` |
| `wallCondition`| string | Yes | `Good`, `Fair`, `Poor` |
| `colorChange` | string | Yes | `Similar`, `Dark-to-Light` |
| `ceilingTexture`| string | No | `Flat`, `Textured`, `Popcorn` |
| `trimCondition` | string | No | `Good`, `Poor` |
| **`trimConversion`**| boolean | No | **NEW**: `true` if Stained -> Painted (3x multiplier). |
| **`crownMoldingStyle`**| string | No | **NEW**: `Simple` vs `Detailed`. |
| `doorCount` | number | No | Integer count. |
| `doorStyle` | string | No | `Slab` vs `Paneled`. |
| `windowCount` | number | No | Integer count. |
| **`stairSteps`** | number | No | **NEW**: Count of steps (Risers + Stringers). |
| **`stairSpindles`**| number | No | **NEW**: Count of spindles. |
| **`stairSpindleType`**| string | No | **NEW**: `Square` vs `Intricate`. |
| **`stairHandrail`**| number | No | **NEW**: Linear feet of handrail. |
| `closetSize` | string | No | `None`, `Standard`, `Medium`, `Large`. |

### 1.2 Global Settings (Context)

| Field | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `paintProvider` | string | `Standard` | `Customer`, `Standard`, `Premium`. |
| `occupancy` | string | `Empty` | `Empty`, `Light Furniture` (1.2x), `Heavy Furniture` (1.35x). |
| `laborRate` | number | 75 | **Backend Constant**: Not user editable. |

### 1.3 Estimate Output (BreakdownItem)

| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | string | Task name (e.g., "Bedroom 1 - Walls") |
| `hours` | number | **NEW**: Calculated man-hours. |
| `cost` | number | derived: `hours * 75`. |
| `details` | string | Explanation of math. |

---

## 2. Validation Rules

1.  **Exact Dimensions**: If provided, must be > 0. If `exactHeight` >= 12, force `High Ceiling` logic.
2.  **Stairwells**: If `type === 'stairwell'`, `stairSteps` OR `stairHandrail` OR `stairSpindles` must be > 0 (can't be empty).
3.  **Closets**: Only valid if `type === 'bedroom'`.
4.  **Color Change**: `Dark-to-Light` triggers the "3 Coat" logic automatically.

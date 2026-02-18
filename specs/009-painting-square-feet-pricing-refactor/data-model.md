# Data Model: Unit Pricing Refactor

## Redux State Updates (`paintingSlice.ts`)

### `PaintingRoom` Interface
| Field | Type | Action | Description |
|-------|------|--------|-------------|
| `trimConversion` | `boolean` | **Remove** | Replaced by `trimColorChange`. |
| `trimColorChange` | `'Similar' \| 'Change' \| 'Dark-to-Light'` | **Add** | Maps to 1, 2, or 3 coat systems for trim. |
| `crownColorChange` | `'Similar' \| 'Change' \| 'Dark-to-Light'` | **Add** | Maps to 1, 2, or 3 coat systems for crown. |

### `GlobalDefaults` Interface
| Field | Type | Action | Description |
|-------|------|--------|-------------|
| `trimColorChange` | `'Similar' \| 'Change' \| 'Dark-to-Light'` | **Add** | Project-wide default for trim. |

## Backend Entities

### `BreakdownItem` (Existing)
- `name`: string
- `cost`: number
- `hours`: number
- `details`: string

### `UNIT_PRICES` (New in `masterRates.ts`)
- **Walls**: `REFRESH`, `CHANGE`, `DARK_TO_LIGHT`
- **Ceilings**: `BASE_SMOOTH` (mapped by coats) + Texture Multipliers
- **Trim/Crown**: `COAT_1`, `COAT_2`, `COAT_3`
- **Fixed**: `DOOR_SLAB`, `DOOR_PANELED`, `WINDOW`, `CLOSET_S/M/L`

## Validation Rules
- `hours` must equal `cost / 75` for all labor items.
- `rentalDays` must be at least 1 if `highWorkHours > 0`.

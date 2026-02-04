# Data Model: Redux State

## Entities

### Painting State
- `rooms`: Array of Room objects (id, name, width, length, height, windows, doors)
- `wallsToPaint`: boolean
- `ceilingsToPaint`: boolean
- `trimToPaint`: boolean
- `cabinetDoors`: number
- `cabinetDrawers`: number

### Basement State
- `totalWallLength`: number
- `ceilingArea`: number
- `isDrywallFinishing`: boolean
- `isPainting`: boolean

### Garage State
- `garageSize`: '1-car' | '2-car' | '3-car'
- `isDetached`: boolean
- `insulationNeeded`: boolean

### Project State (Shared)
- `projectId`: string | null
- `clientId`: string | null
- `zipCode`: string | null
- `timestamp`: string

### UI State
- `currentStep`: number
- `isModalOpen`: boolean
- `activeModalId`: string | null
- `isLoading`: boolean
- `errors`: Record<string, string>

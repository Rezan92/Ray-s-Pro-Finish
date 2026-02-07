# Quickstart: Testing the New Pricing Engine

## Prerequisites
- Backend running on `localhost:5000`
- Frontend running on `localhost:5173`

## Verification Flow

1.  **Check Rates**: Verify `server/src/modules/estimator/constants/masterRates.ts` has `HOURLY_RATE = 75`.
2.  **Generate Estimate**:
    -   Go to Estimator -> Painting.
    -   Add 1 "Small (10x10)" room.
    -   Select "Walls Only" (Refresh).
    -   Submit.
3.  **Validate Math**:
    -   Walls: 320 SF.
    -   Rate: 400 SFPH -> 0.8 hours.
    -   Trip: 45 mins -> 0.75 hours.
    -   Total Hours: 1.55.
    -   Expected Price: 1.55 * $75 = ~$116.25 (+ Materials).
4.  **Check Admin**: Look at the console/response for the `adminSummary` table data.

## API Endpoint
`POST /api/estimate`
- Payload: Full `FormData` object.
- Response: `{ price: number, adminSummary: [], userMessage: string }`

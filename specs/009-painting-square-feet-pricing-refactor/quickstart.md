# Quickstart: Unit Pricing Refactor

## Developer Setup

1. **Verify Rates**: Open `server/src/modules/estimator/constants/masterRates.ts` and ensure the `UNIT_PRICES` object reflects the latest rates from `square-feet-rates-reference.md`.
2. **Update Redux**: Run the client and check `PaintingForm.tsx`. The "Trim Conversion" toggle should be replaced by "Trim Color Change" and "Crown Color Change" dropdowns.
3. **Run Tests**: Execute `npm test server/src/modules/estimator/services/paintingService.test.ts` to verify the new pricing logic.

## Key Files
- `server/src/modules/estimator/services/paintingService.ts`: Core calculation logic.
- `client/src/store/slices/paintingSlice.ts`: State management for room options.
- `client/src/components/common/estimator/PaintingForm.tsx`: UI for selecting unit options.

## Verification Checklist
- [ ] Walls @ $0.58 / $0.94 / $1.36 per sqft.
- [ ] Ceiling texture surcharge (+15% / +40%).
- [ ] Detailed crown surcharge (+20%).
- [ ] Equipment rental triggered at 12ft+.
- [ ] All labor items have `hours` where `cost = hours * 75`.

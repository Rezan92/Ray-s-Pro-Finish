# Quickstart: Redux Split Implementation

## Prerequisites
- Node.js 18+
- Active branch: `006-redux-split`

## Implementation Workflow

1.  **Create Shared Slices**: Start with `projectSlice` and `uiSlice`. These are dependencies for feature slices.
2.  **Migrate One Domain**: Pick `paintingSlice` as the pilot.
    -   Copy relevant state/reducers from `estimatorSlice`.
    -   Create selectors for total calculation.
    -   Update `PaintingForm.tsx` to use the new hooks.
3.  **Verify**: Ensure the Painting form still updates state correctly in Redux DevTools.
4.  **Repeat**: Migrate Basement, Garage, etc.
5.  **Root Store Swap**: Update `store.ts` to include new reducers.
6.  **Cleanup**: Remove `estimatorSlice`.

## Key Commands
```bash
# Verify no regression in build
npm run build
```

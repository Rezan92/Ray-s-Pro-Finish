# Research & Decisions: Phase 2 Redux Split

**Decision**: Domain-Driven Slices
**Rationale**: Splitting by feature (Painting, Basement, Garage) rather than by data type (Rates, Inputs) aligns with the user's mental model and the application's structure.
**Alternatives**:
- *Functional Slices (Inputs, Outputs)*: Rejected. Too abstract and couples unrelated business logic.

**Decision**: Shared `projectSlice`
**Rationale**: Identifiers like `clientId` and `projectId` are global. Duplicating them in every slice creates synchronization nightmares. A dedicated slice allows valid "normalized" state.
**Alternatives**:
- *Duplication*: Rejected. High risk of desync.

**Decision**: Memoized Selectors (`reselect`) for Totals
**Rationale**: Storing calculated totals (like `totalPrice`) in the state leads to data redundancy and update anomalies. Deriving them ensures they are always correct based on current inputs.
**Alternatives**:
- *Computed State in Reducer*: Rejected. Increases complexity of every action handler.

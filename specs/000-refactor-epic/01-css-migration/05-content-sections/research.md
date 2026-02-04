# Research & Decisions: Content Sections & Final Cleanup

**Decision**: Standard CSS Module Pattern
**Rationale**: Consistency with previous successful priorities (Layout, Core Components). Vite handles hashing automatically.
**Alternatives**:
- *Styled Components*: Rejected due to project-wide CSS Module decision.
- *Tailwind*: Rejected for this phase (refactoring legacy CSS, not rewriting UI).

**Decision**: Variable Mapping Strategy
**Rationale**: `index.css` is the single source of truth. Any hardcoded color found in legacy CSS must be replaced with a `var(--...)`.
**Alternatives**:
- *Keep hardcoded values*: Rejected. Violates Constitution Principle I (Variable-First).

**Decision**: Batching Strategy
**Rationale**: Migrating 20+ files in one go is risky. Breaking into "Marketing", "Service", "Interaction", and "Pages" batches allows for checkpoint verification.

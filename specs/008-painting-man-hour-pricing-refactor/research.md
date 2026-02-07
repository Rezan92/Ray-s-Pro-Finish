# Research & Decisions: Painting Man-Hour Pricing

**Decision**: Centralized `$75/hr` Base Rate
**Rationale**: Hardcoding prices in multiple files makes updates dangerous. A single `HOURLY_LABOR_RATE` constant ensures the entire system scales with inflation or business changes.
**Alternatives**:
- *Per-Task Flat Rates*: Rejected. Doesn't account for complexity (e.g., high ceilings) accurately.

**Decision**: Structured JSON for Admin Summary
**Rationale**: Returning a raw text block makes it impossible to render a sortable/filterable table in the Admin Dashboard. A typed array of objects is robust and future-proof.
**Alternatives**:
- *HTML String*: Rejected. Couples backend to frontend presentation.

**Decision**: Global Defaults with Local Overrides (Frontend)
**Rationale**: "All rooms same color" is the 80% use case. Forcing users to select "Walls + Ceiling" 5 times is bad UX.
**Alternatives**:
- *Wizard per room*: Rejected. Too slow for whole-house estimates.

**Decision**: Gemini for "Sales Pitch" only
**Rationale**: LLMs are bad at math but great at persuasion. We calculate the numbers deterministically, then let the AI write the "cover letter."
**Alternatives**:
- *AI for Math*: Rejected. Hallucination risk is unacceptable for pricing.

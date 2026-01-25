export const BASEMENT_CONSTANTS = {
	// MATH FACTORS
	PERIMETER_MULTIPLIER: 4.2,

	// PARTITION WALL INFERENCE
	LF_PER_BEDROOM: 30,
	LF_PER_BATHROOM: 25,
	LF_PER_WETBAR: 12,

	// OPENING INFERENCE
	OPENINGS_PER_BEDROOM: 2,
	OPENINGS_PER_BATHROOM: 1,
	OPENINGS_BASE_EGRESS: 1,

	// SOFFIT INFERENCE
	SOFFIT_FACTORS: {
		Minimal: 0.1,
		Average: 0.25,
		Complex: 0.45,
	},

	// MOVED: Height Logic definitions
	HEIGHT_MAP: {
		'Standard (8ft)': 8.0,
		'Low (<7ft)': 7.0,
		'High (9ft+)': 9.5,
	} as Record<string, number>,
};

export const BASEMENT_CONSTANTS = {
	// MATH FACTORS
	PERIMETER_MULTIPLIER: 4.2,

	LF_ROOMS: {
		BEDROOM_SMALL: 25, // ~10x10
		BEDROOM_MEDIUM: 35, // ~12x12 + Closet
		BEDROOM_LARGE: 45, // ~14x14 + Walk-in
		BATH_HALF: 15, // Powder room
		BATH_FULL: 25, // Tub/Shower walls
		WETBAR: 12,
	},

	// OPENING INFERENCE
	OPENINGS: {
		BEDROOM: 2,
		BATHROOM: 1,
		BASE_EGRESS: 1,
	},

	// SOFFIT INFERENCE
	SOFFIT_FACTORS: {
		Minimal: 0.1,
		Average: 0.25,
		Complex: 0.45,
	},

	// HEIGHT MAP
	HEIGHT_MAP: {
		'Standard (8ft)': 8.0,
		'Low (<7ft)': 7.0,
		'High (9ft+)': 9.5,
	} as Record<string, number>,
};

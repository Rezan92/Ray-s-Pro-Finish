// server/src/modules/estimator/constants/garageConstants.ts

export const GARAGE_DIMENSIONS: Record<
	string,
	{ width: number; depth: number }
> = {
	'1-Car': { width: 12, depth: 22 },
	'1.5-Car': { width: 16, depth: 24 },
	'2-Car': { width: 20, depth: 24 },
	'2.5-Car': { width: 24, depth: 26 },
	'3-Car': { width: 32, depth: 24 },
};

export const HEIGHT_VALUES: Record<string, number> = {
	'Standard (8-9ft)': 9,
	'High (10-12ft)': 11,
	'Extra High (13ft+)': 14,
};

// 2025 TURNKEY RATES (Labor + Materials)
export const GARAGE_PRICES = {
	// INSULATION
	INSULATION_WALL_SQFT: 1.65,
	INSULATION_CEILING_SQFT: 1.85, // Slightly higher for overhead work

	// HANGING (5/8" Fire Code)
	HANGING_WALL_SQFT: 2.1,
	HANGING_CEILING_SQFT: 2.45, // Overhead tax

	// TAPING (Fire Tape / Level 2)
	TAPING_WALL_SQFT: 1.45,
	TAPING_CEILING_SQFT: 1.65,

	// PAINTING (Prime + 1 Coat)
	PAINTING_WALL_SQFT: 1.35,
	PAINTING_CEILING_SQFT: 1.5, // Overhead tax

	// GALLON COVERAGE (For breakdown transparency)
	COVERAGE_SQFT_PER_GALLON: 250,
	PAINT_PRICE_PER_GALLON: 45.0, // Contractor grade exterior/garage paint

	HOURS_PER_SQFT: {
		INSULATION: 0.012,
		HANGING: 0.025,
		TAPING: 0.02,
		PAINTING: 0.015,
	},

	PRO_MOVE_HANDLING_FEE: 250.0,
	PRO_MOVE_HOURS: 4,
	SCAFFOLD_RENTAL_FLAT: 180.0,

	HEIGHT_FACTORS: {
		'Standard (8-9ft)': 1.0,
		'High (10-12ft)': 1.25,
		'Extra High (13ft+)': 1.5,
	},
};

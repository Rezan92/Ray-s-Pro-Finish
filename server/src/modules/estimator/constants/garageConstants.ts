export const GARAGE_DIMENSIONS: Record<
	string,
	{ width: number; length: number }
> = {
	'1-Car': { width: 12, length: 22 },
	'1.5-Car': { width: 16, length: 24 },
	'2-Car': { width: 20, length: 22 },
	'2.5-Car': { width: 24, length: 24 },
	'3-Car': { width: 32, length: 22 },
};

export const GARAGE_PRICES = {
	// Base rates (Labor + standard material)
	INSULATION_PER_SQFT: 0.85,
	HANGING_PER_SQFT: 1.15, // Approx $37/sheet labor + material
	TAPING_MUDDING_PER_SQFT: 1.25,
	PAINTING_PER_SQFT: 1.5,
	// Occupancy & Obstacles
	PRO_MOVE_HANDLING_FEE: 75.0,

	HEIGHT_FACTORS: {
		'Standard (8-9ft)': 1.0,
		'High (10-12ft)': 1.25,
		'Extra High (13ft+)': 1.5,
	},

	// Specialized fees
	SCAFFOLD_RENTAL_DAILY: 200.0,
	FIRE_TAPE_ONLY_DISCOUNT: 0.8,
};

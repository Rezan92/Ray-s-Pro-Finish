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

export const HEIGHT_VALUES: Record<string, number> = {
	'Standard (8-9ft)': 8.5,
	'High (10-12ft)': 11,
	'Extra High (13ft+)': 14,
};

export const GARAGE_PRICES = {
	INSULATION_PER_SQFT: 0.85,
	HANGING_PER_SQFT: 1.15,
	TAPING_MUDDING_PER_SQFT: 1.25,
	PAINTING_PER_SQFT: 1.5,
	PRO_MOVE_HANDLING_FEE: 75.0,
	HEIGHT_FACTORS: {
		'Standard (8-9ft)': 1.0,
		'High (10-12ft)': 1.25,
		'Extra High (13ft+)': 1.5,
	},
	SCAFFOLD_RENTAL_DAILY: 200.0,
};

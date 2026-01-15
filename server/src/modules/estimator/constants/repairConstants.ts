export const REPAIR_PRICES = {
	BASE_SERVICE_FEE: 150, // Minimum for any repair trip

	// 100% Unit Prices (Includes: Setup, Patch, Sand, Texture, and Basic Paint)
	PATCH_AND_PAINT_BASE: {
		'Dings/Nail Pops': 150, // New Category
		'Medium (<12")': 150,
		'Large (1-3ft)': 250,
		'X-Large (Sheet+)': 650,
	},

	ADD_ON_FACTORS: {
		SAME_WALL: 0.20, // 15% of base
		DIFFERENT_ROOM: 0.4, // 40% of base
	},

	WALL_PAINTING: {
		LABOR_PER_SQFT: 1.5,
		PAINT_PER_GALLON: 50.0,
		SQFT_PER_GALLON: 350, // Industry standard for 1 coat coverage
	},

	// Discounts for subsequent work at the SAME location (Wall/Ceiling)
	DISCOUNTS: {
		SAME_WALL_SUBSEQUENT_FACTOR: 0.3, // 2nd+ patch on same wall is 30% of base price
		PATCH_ONLY_DISCOUNT: 0.2, // If user only wants patch (no wall roll), reduce base by 20%
	},

	// Surcharges for difficulty
	SURCHARGES: {
		CEILING_MULTIPLIER: 1.35, // +35% for overhead work
		HIGH_ACCESSIBILITY: 100, // Scaffolding or high ladders
		SCAFFOLD_RENTAL: 200,
		TEXTURE_COMPLEXITY: {
			Smooth: 0,
			'Orange Peel': 40,
			Knockdown: 65,
			Popcorn: 85,
		},
		COLOR_MATCH_TRIP: 65, // Trip to store for matching if customer doesn't have paint
	},
};

export const REPAIR_LABOR = {
	'Dings/Nail Pops': 1.0,
	'Medium (<12")': 1.5,
	'Large (1-3ft) ': 3.0,
	'X-Large (Sheet+)': 6.0,
};

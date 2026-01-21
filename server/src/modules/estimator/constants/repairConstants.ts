export const REPAIR_PRICES = {
	BASE_SERVICE_FEE: 150,
	PRIME_PRICE_PER_PATCH: 10,

	// CATEGORY 1: Area-Based (Holes / Impact)
	PATCH_AND_PAINT_BASE: {
		'Dings/Nail Pops': 150,
		'Medium (<12")': 150,
		'Large (1-3ft)': 250,
		'X-Large (Sheet+)': 650,
	},

	LINEAR_REPAIR_PRICES: {
		'Small (1-3ft)': 75,
		'Medium (3-5ft)': 125,
		'Large (5ft+)': 175,
	},

	PEELING_TAPE_PRICES: {
		'Small (1-3ft)': 100,
		'Medium (3-5ft)': 150,
		'Large (5ft+)': 200,
	},

	// CATEGORY 3: Specialty
	SPECIALTY_REPAIR_PRICES: {
		'Corner Bead Repair': 185,
		'Water Damage': 200,
	},

	PAINT_CREDITS: {
		'Dings/Nail Pops': 25,
		'Medium (<12")': 25,
		'Large (1-3ft)': 50,
		'X-Large (Sheet+)': 150,
		'Linear/Specialty': 20,
	},

	ADD_ON_FACTORS: {
		SAME_WALL: 0.2,
		DIFFERENT_ROOM: 0.4,
	},

	WALL_PAINTING: {
		LABOR_PER_SQFT: 1.5,
		PAINT_PER_GALLON: 50.0,
		SQFT_PER_GALLON: 350,
		PAINT_QUART: 25.0,
	},

	SURCHARGES: {
		CEILING_MULTIPLIER: 1.35,
    LADDER_FEE: 50,
		SCAFFOLD_RENTAL: 200,
		TEXTURE_COMPLEXITY: {
			Smooth: 0,
			'Orange Peel': 40,
			Knockdown: 65,
			Popcorn: 85,
		},
	},
};

export const REPAIR_LABOR = {
	'Dings/Nail Pops': 1.0,
	'Medium (<12")': 1.5,
	'Large (1-3ft)': 3.0,
	'X-Large (Sheet+)': 6.0,
	'Linear/Specialty': 1.5,
};

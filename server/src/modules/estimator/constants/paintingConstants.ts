export const ROOM_DIMENSIONS: Record<string, Record<string, number[]>> = {
	bedroom: {
		Small: [10, 10],
		Medium: [12, 14],
		Large: [15, 16],
		'X-Large': [18, 18],
	},
	livingRoom: {
		Small: [12, 15],
		Medium: [15, 18],
		Large: [18, 22],
		'X-Large': [20, 25],
	},
	diningRoom: {
		Small: [9, 10],
		Medium: [11, 13],
		Large: [12, 16],
		'X-Large': [14, 18],
	},
	kitchen: {
		Small: [10, 10],
		Medium: [12, 14],
		Large: [15, 15],
		'X-Large': [18, 20],
	},
	bathroom: {
		Small: [5, 5],
		Medium: [5, 8],
		Large: [10, 12],
		'X-Large': [12, 15],
	},
	office: {
		Small: [8, 8],
		Medium: [10, 10],
		Large: [12, 12],
		'X-Large': [12, 15],
	},
	basement: {
		Small: [15, 20],
		Medium: [20, 30],
		Large: [25, 40],
		'X-Large': [30, 50],
	},
	laundryRoom: {
		Small: [6, 4],
		Medium: [6, 8],
		Large: [8, 10],
		'X-Large': [10, 12],
	},
	closet: {
		Small: [2, 4],
		Medium: [5, 5],
		Large: [6, 10],
		'X-Large': [10, 10],
	},
	hallway: {
		Small: [3, 6],
		Medium: [3, 12],
		Large: [4, 15],
		'X-Large': [5, 20],
	},
	stairwell: {
		Small: [3, 10],
		Medium: [4, 12],
		Large: [6, 15],
		'X-Large': [8, 20],
	},
	garage: {
		Small: [12, 20],
		Medium: [22, 22],
		Large: [22, 32],
		'X-Large': [24, 40],
	},
	other: {
		Small: [8, 8],
		Medium: [10, 10],
		Large: [12, 12],
		'X-Large': [15, 20],
	},
};

export const PAINT_PRICES = {
	WALL_BASE_PER_SQFT: 1.5,
	CEILING_BASE_PER_SQFT: 1.0,
	TRIM_BASE_PER_LF: 3.5,
	CROWN_BASE_PER_LF: 4.0,
	DOOR_SLAB: 60,
	DOOR_PANELED: 80,
	WINDOW_FRAME: 50,
	CLOSET: { Standard: 75, Medium: 150, Large: 200 },
	SUPPLY: {
		STANDARD_GALLON: 50,
		PREMIUM_GALLON: 75,
	},
	SURCHARGES: {
		COLOR_CHANGE_PRIMER_PCT: 0.2,
		FAIR_CONDITION_PCT: 0.1,
		POOR_CONDITION_FLAT: 150,
		TEXTURED_CEILING_ADD: 0.25,
		POPCORN_CEILING_ADD: 0.5,
		DETAILED_TRIM_ADD: 1.0,
	},
};

export const LABOR_MULTIPLIERS = {
	SETUP_PER_ROOM: 0.5,
	WALLS: 0.0125,
	WALL_PRIMING: 0.005,
	CEILING: 0.01,
	TRIM: 0.05,
	CROWN: 0.063,
	DOOR_SLAB: 0.75,
	DOOR_PANELED: 1.25,
	WINDOW: 0.5,
	CLOSET: { Standard: 1, Medium: 1.5, Large: 2.5 },
};

export const PAINT_COVERAGE = {
	// 1 gallon covers ~350sqft for 1 coat.
	// We divide by 175 to account for 2 coats automatically.
	WALL_SQFT_PER_GALLON: 175,
	CEILING_SQFT_PER_GALLON: 175,
	// 1 gallon covers ~150 linear feet of trim/crown (2 coats)
	TRIM_LF_PER_GALLON: 150,
	// Typical door (2 coats, both sides)
	DOOR_GALLONS: 0.15,
	// Typical window frame (2 coats)
	WINDOW_GALLONS: 0.1,
	// Primer coverage (usually 1 coat only)
	PRIMER_SQFT_PER_GALLON: 300,
};

// server/src/modules/estimator/constants/masterRates.ts

export type ServiceSurface = 'WALL' | 'CEILING';

export interface RateDetail {
	labor: number;
	material: number;
	hoursPerSqft?: number; // For Surface trades (Paint, Drywall, Insulation)
	hoursPerLinearFoot?: number; // For Linear trades (Framing)
}

export interface ServiceRates {
	[level: string]: {
		WALL: RateDetail;
		CEILING: RateDetail;
	};
}

/**
 * MASTER PRICING STRATEGY (2025/2026)
 * Source of truth for all modules.
 */
export const MASTER_RATES = {
	CEILING_SYSTEMS: {
		// Option A: Standard 2x4 Grid
		DROP_CEILING_2X4: {
			labor: 4.0,
			material: 3.5,
			hoursPerSqft: 0.025, // Based on 40 sqft/hr
		},
		// Option B: Premium 2x2 Grid
		DROP_CEILING_2X2: {
			labor: 5.5,
			material: 4.5,
			hoursPerSqft: 0.04, // Based on 25 sqft/hr
		},
		// Option C: Industrial Spray
		PAINTED_INDUSTRIAL: {
			labor: 2.0,
			material: 1.0,
			hoursPerSqft: 0.01, // Based on 100 sqft/hr
		},
	},

	// --- SECTION 1: FRAMING (Linear Foot Based) ---
	FRAMING: {
		WOOD_FLOOR: {
			labor: 8.0,
			material: 8.25,
			hoursPerLinearFoot: 0.15,
		},
		CONCRETE_FLOOR: {
			labor: 13.0,
			material: 9.0,
			hoursPerLinearFoot: 0.25,
		},
		OPENING_BUILD: {
			labor: 150.0,
			material: 0,
			hoursPerLinearFoot: 1.25, // Per Opening
		},
	},

	// --- SECTION 2: INSULATION (Square Foot Based) ---
	INSULATION: {
		// STANDARD = R15 Batt (Baseline)
		STANDARD: {
			WALL: { labor: 0.65, material: 0.89, hoursPerSqft: 0.01 },
			CEILING: { labor: 0.65, material: 0.89, hoursPerSqft: 0.012 },
		},
		// Rigid Foam (XPS)
		RIGID_FOAM: {
			WALL: { labor: 1.22, material: 1.75, hoursPerSqft: 0.02 },
			CEILING: { labor: 1.5, material: 1.75, hoursPerSqft: 0.025 },
		},
	},

	// --- SECTION 3: DRYWALL INSTALLATION ---
	DRYWALL_INSTALL: {
		LEVEL_1: {
			WALL: { labor: 0.45, material: 0.65, hoursPerSqft: 0.0182 },
			CEILING: { labor: 0.65, material: 0.65, hoursPerSqft: 0.0182 },
		},
		LEVEL_2: {
			WALL: { labor: 0.65, material: 0.7, hoursPerSqft: 0.0222 },
			CEILING: { labor: 0.95, material: 0.7, hoursPerSqft: 0.0222 },
		},
		LEVEL_3: {
			WALL: { labor: 0.95, material: 0.75, hoursPerSqft: 0.0308 },
			CEILING: { labor: 1.35, material: 0.75, hoursPerSqft: 0.0308 },
		},
		LEVEL_4: {
			WALL: { labor: 1.2, material: 0.8, hoursPerSqft: 0.0444 },
			CEILING: { labor: 1.65, material: 0.8, hoursPerSqft: 0.0444 },
		},
		LEVEL_5: {
			WALL: { labor: 2.2, material: 1.05, hoursPerSqft: 0.08 },
			CEILING: { labor: 2.85, material: 1.05, hoursPerSqft: 0.08 },
		},
	},

	// --- SECTION 4: DRYWALL FINISH ONLY ---
	DRYWALL_FINISH: {
		LEVEL_1: {
			WALL: { labor: 0.1, material: 0.05, hoursPerSqft: 0.0091 },
			CEILING: { labor: 0.15, material: 0.05, hoursPerSqft: 0.0091 },
		},
		LEVEL_2: {
			WALL: { labor: 0.3, material: 0.1, hoursPerSqft: 0.0125 },
			CEILING: { labor: 0.45, material: 0.1, hoursPerSqft: 0.0125 },
		},
		LEVEL_3: {
			WALL: { labor: 0.6, material: 0.15, hoursPerSqft: 0.0182 },
			CEILING: { labor: 0.85, material: 0.15, hoursPerSqft: 0.0182 },
		},
		LEVEL_4: {
			WALL: { labor: 0.85, material: 0.2, hoursPerSqft: 0.025 },
			CEILING: { labor: 1.15, material: 0.2, hoursPerSqft: 0.025 },
		},
		LEVEL_5: {
			WALL: { labor: 1.85, material: 0.45, hoursPerSqft: 0.0571 },
			CEILING: { labor: 2.35, material: 0.45, hoursPerSqft: 0.0571 },
		},
	},

	// --- SECTION 5: PAINTING (Man-Hour Driven) ---
	PAINTING: {
		LABOR_RATE: 75,
		DAILY_TRIP_HOURS: 0.75,
		EQUIPMENT_RENTAL_DAILY: 200,
		MISC_MATERIAL_FEE_PER_ROOM: 10,

		MULTIPLIERS: {
			OCCUPANCY: {
				EMPTY: 1.0,
				OWNER_CLEARS: 1.0,
				PAINTER_COVERS: 1.2,
				PAINTER_MOVES: 1.35,
			},
			CEILING_HEIGHT: {
				STANDARD: 1.0, // 8-9'
				MID: 1.1, // 10'
				HIGH: 1.25, // 12-14'
				VAULTED: 1.45, // 15'+
			},
			STAIN_TO_PAINT: 3.0,
			TRIM_STAIRWELL: 1.5,
		},

		UNIT_PRICES: {
			WALLS: {
				REFRESH: 0.58,
				CHANGE: 0.94,
				DARK_TO_LIGHT: 1.36,
				PREP_GOOD: 0.11,
				PREP_FAIR: 0.30,
				PREP_POOR: 0.75,
			},
			CEILINGS: {
				SMOOTH_1: 0.58,
				SMOOTH_2: 0.94,
				SMOOTH_3: 1.36,
				TEXTURE_SURCHARGE: {
					ORANGE_PEEL: 0.15,
					POPCORN: 0.40,
				},
				MATERIAL_MULTIPLIER: {
					SMOOTH: 1.0,
					ORANGE_PEEL: 1.3,
					POPCORN: 2.0,
				},
			},
			TRIM: {
				COAT_1: 1.25,
				COAT_2: 2.14,
				COAT_3: 3.75,
			},
			CROWN: {
				COAT_1: 1.88,
				COAT_2: 3.00,
				COAT_3: 5.00,
			},
			MISC: {
				TRIM_PREP_POOR: 0.35,
				CROWN_DETAILED_SURCHARGE: 0.20,
			},
			STAIRS: {
				SPINDLE_SQUARE: 15.00,
				SPINDLE_INTRICATE: 37.50,
				HANDRAIL: 12.50,
				STEP: 25.00,
			},
			EQUIPMENT: {
				LADDER: 60.00,
				SCAFFOLD: 150.00,
			},
		},

		FIXED_ITEMS: {
			CLOSET_STANDARD: 1.5,
			CLOSET_MEDIUM: 2.5,
			CLOSET_LARGE: 4.0,
			CLOSET_MATERIAL_GALLONS: {
				STANDARD: 0.32,
				MEDIUM: 0.53,
				LARGE: 0.84,
			},
			WINDOW_STANDARD_CASING: 0.833, // 50 mins total per window
			DOOR_6_PANEL_SIDE: 0.666, // 40 mins per side
			DOOR_SLAB_SIDE: 0.583, // 35 mins per side
		},

		DEFAULTS: {
			MASKING_WINDOW: 0.083, // hrs (5m)
			MASKING_FIXTURE: 0.083, // hrs (5m)
			ELECTRICAL_PLATE: 0.05, // hrs (3m)
			FLOOR_PROTECTION: 0.15, // hrs per 100sqft (0.15/100 = 15m/100)
			DEFAULT_FIXTURE_COUNT: 1,
			DEFAULT_PLATE_COUNT: 4,
		},

		MATERIAL_PRICES: {
			PRO_BASE: 40,
			STANDARD: 55,
			PREMIUM: 85,
			ULTRA_PREMIUM: 128,
			UNIVERSAL_PRIMER: 45,
		},

		MATERIAL_COVERAGE: {
			WALL_CEILING_SQFT_PER_GALLON: 350, // Single-coat baseline
			PRIMER_SQFT_PER_GALLON: 250, // Single-coat baseline
			TRIM_LF_PER_GALLON: 700, // Single-coat baseline
			TRIM_PRIMER_LF_PER_GALLON: 500, // Derived: (250/350) * 700
			DOORS_PER_GALLON: 8, // Both sides, single-coat baseline
			WINDOWS_PER_GALLON: 12, // Single-coat baseline
			WASTE_BUFFER: 1.15,
		},
	},
};

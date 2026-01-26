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
		DROP_CEILING: {
			labor: 1.85, // Grid + Tile install
			material: 1.5, // Tiles + Runners + Wires
			hoursPerSqft: 0.025, // ~40 sqft/hr
		},
		PAINTED_INDUSTRIAL: {
			labor: 0.95, // Masking everything + Spraying black/white
			material: 0.4, // Paint + Masking plastic
			hoursPerSqft: 0.015,
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

	// --- SECTION 5: PAINTING ---
	PAINTING: {
		PRIMER: {
			WALL: { labor: 0.3, material: 0.1, hoursPerSqft: 0.0036 },
			CEILING: { labor: 0.5, material: 0.1, hoursPerSqft: 0.0036 },
		},
		ONE_COAT: {
			WALL: { labor: 0.6, material: 0.15, hoursPerSqft: 0.0057 },
			CEILING: { labor: 0.7, material: 0.15, hoursPerSqft: 0.0057 },
		},
		STANDARD: {
			WALL: { labor: 1.2, material: 0.3, hoursPerSqft: 0.0114 },
			CEILING: { labor: 1.4, material: 0.3, hoursPerSqft: 0.0114 },
		},
		FULL: {
			WALL: { labor: 1.5, material: 0.4, hoursPerSqft: 0.0166 },
			CEILING: { labor: 1.9, material: 0.4, hoursPerSqft: 0.0166 },
		},
	},
};

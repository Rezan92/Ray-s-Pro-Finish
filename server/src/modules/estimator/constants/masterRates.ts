// server/src/modules/estimator/constants/masterRates.ts

export type ServiceSurface = 'WALL' | 'CEILING';

export interface RateDetail {
	labor: number;
	material: number;
	hoursPerSqft: number; // Derived from your "Speed" ranges (Middle value)
}

export interface ServiceRates {
	[level: string]: {
		WALL: RateDetail;
		CEILING: RateDetail;
	};
}

/**
 * MASTER PRICING STRATEGY (2025)
 * Centralized source of truth for all modules (Garage, Repair, Painting).
 */
export const MASTER_RATES = {
	// Table 1: Insulation
	INSULATION: {
		STANDARD: {
			WALL: { labor: 0.65, material: 1.0, hoursPerSqft: 0.0057 }, // ~175 sqft/hr
			CEILING: { labor: 0.85, material: 1.0, hoursPerSqft: 0.01 }, // ~100 sqft/hr
		},
	},

	// Table 2: Full Installation (Hanging + Finishing)
	// Use when we provide Board, Tape, Mud, Screws
	DRYWALL_INSTALL: {
		LEVEL_1: {
			// Fire Tape (Hang + Tape Only)
			WALL: { labor: 0.45, material: 0.65, hoursPerSqft: 0.0182 }, // ~55 sqft/hr
			CEILING: { labor: 0.65, material: 0.65, hoursPerSqft: 0.0182 },
		},
		LEVEL_2: {
			// Garage Standard (Hang + Tape + 1 Coat)
			WALL: { labor: 0.65, material: 0.7, hoursPerSqft: 0.0222 }, // ~45 sqft/hr
			CEILING: { labor: 0.95, material: 0.7, hoursPerSqft: 0.0222 },
		},
		LEVEL_3: {
			// Texture Ready
			WALL: { labor: 0.95, material: 0.75, hoursPerSqft: 0.0308 }, // ~32.5 sqft/hr
			CEILING: { labor: 1.35, material: 0.75, hoursPerSqft: 0.0308 },
		},
		LEVEL_4: {
			// Smooth / House Standard
			WALL: { labor: 1.2, material: 0.8, hoursPerSqft: 0.0444 }, // ~22.5 sqft/hr
			CEILING: { labor: 1.65, material: 0.8, hoursPerSqft: 0.0444 },
		},
		LEVEL_5: {
			// Skim Coat
			WALL: { labor: 2.2, material: 1.05, hoursPerSqft: 0.08 }, // ~12.5 sqft/hr
			CEILING: { labor: 2.85, material: 1.05, hoursPerSqft: 0.08 },
		},
	},

	// Table 3: Finishing Only
	// Use when Board is already hung (Tape, Mud, Sand only)
	DRYWALL_FINISH: {
		LEVEL_1: {
			// Tape Only
			WALL: { labor: 0.1, material: 0.05, hoursPerSqft: 0.0091 }, // ~110 sqft/hr
			CEILING: { labor: 0.15, material: 0.05, hoursPerSqft: 0.0091 },
		},
		LEVEL_2: {
			// Tape + 1 Coat
			WALL: { labor: 0.3, material: 0.1, hoursPerSqft: 0.0125 }, // ~80 sqft/hr
			CEILING: { labor: 0.45, material: 0.1, hoursPerSqft: 0.0125 },
		},
		LEVEL_3: {
			// Tape + 2 Coats
			WALL: { labor: 0.6, material: 0.15, hoursPerSqft: 0.0182 }, // ~55 sqft/hr
			CEILING: { labor: 0.85, material: 0.15, hoursPerSqft: 0.0182 },
		},
		LEVEL_4: {
			// Standard 3 Coats
			WALL: { labor: 0.85, material: 0.2, hoursPerSqft: 0.025 }, // ~40 sqft/hr
			CEILING: { labor: 1.15, material: 0.2, hoursPerSqft: 0.025 },
		},
		LEVEL_5: {
			// Skim
			WALL: { labor: 1.85, material: 0.45, hoursPerSqft: 0.0571 }, // ~17.5 sqft/hr
			CEILING: { labor: 2.35, material: 0.45, hoursPerSqft: 0.0571 },
		},
	},

	// Table 4: Painting
	PAINTING: {
		PRIMER: {
			// Sealer/Base
			WALL: { labor: 0.3, material: 0.1, hoursPerSqft: 0.0036 }, // ~275 sqft/hr
			CEILING: { labor: 0.5, material: 0.1, hoursPerSqft: 0.0036 },
		},
		ONE_COAT: {
			// Refresh
			WALL: { labor: 0.6, material: 0.15, hoursPerSqft: 0.0057 }, // ~175 sqft/hr
			CEILING: { labor: 0.7, material: 0.15, hoursPerSqft: 0.0057 },
		},
		STANDARD: {
			// 2 Coats Total
			WALL: { labor: 1.2, material: 0.3, hoursPerSqft: 0.0114 }, // ~87.5 sqft/hr
			CEILING: { labor: 1.4, material: 0.3, hoursPerSqft: 0.0114 },
		},
		FULL: {
			// Prime + 2 Coats
			WALL: { labor: 1.5, material: 0.4, hoursPerSqft: 0.0166 }, // ~60 sqft/hr
			CEILING: { labor: 1.9, material: 0.4, hoursPerSqft: 0.0166 },
		},
	},
};

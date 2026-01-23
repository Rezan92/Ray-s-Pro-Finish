import {
	GARAGE_DIMENSIONS,
	GARAGE_PRICES,
	HEIGHT_VALUES,
} from '../constants/garageConstants.js';
import { MASTER_RATES, RateDetail } from '../constants/masterRates.js';
import { GarageRequest } from '../types.js';

interface BreakdownItem {
	name: string;
	cost: number;
	hours: number;
	details: string;
}

export const calculateGarageEstimate = (
	data: GarageRequest,
	isAdmin: boolean = false
) => {
	const {
		size,
		ceilingHeight,
		condition,
		includeCeiling,
		occupancy,
		services,
	} = data;

	const dims = GARAGE_DIMENSIONS[size];
	if (!dims) throw new Error('Invalid garage size');

	// 1. Dimensions
	const height = HEIGHT_VALUES[ceilingHeight] || 9;
	const isHighCeiling = height > 9;
	const diffFactor =
		GARAGE_PRICES.HEIGHT_FACTORS[
			ceilingHeight as keyof typeof GARAGE_PRICES.HEIGHT_FACTORS
		] || 1.0;

	// 2. Areas
	const perimeter = 2 * (dims.width + dims.depth);
	const wallSqft = perimeter * height;
	const ceilingSqft = includeCeiling ? dims.width * dims.depth : 0;
	const totalSqft = wallSqft + ceilingSqft;

	const breakdownItems: BreakdownItem[] = [];
	let totalCost = 0;
	let totalHours = 0;

	// A. Scope Header
	breakdownItems.push({
		name: 'Project Dimensions',
		cost: 0,
		hours: 0,
		details: `${size} (${dims.width}'x${
			dims.depth
		}'). Walls: ${wallSqft} sqft. Ceiling: ${
			includeCeiling ? ceilingSqft : 'Excluded'
		}.`,
	});

	// --- Helper: Standardized Math for Labor/Material ---
	const addService = (
		name: string,
		wallRate: RateDetail,
		ceilRate: RateDetail,
		note: string
	) => {
		// LABOR
		const laborW = wallSqft * wallRate.labor * diffFactor;
		const laborC = ceilingSqft * ceilRate.labor; // Ceiling rate often already accounts for difficulty, but keeping consistent
		const totalLabor = laborW + laborC;

		// HOURS
		const hoursW = wallSqft * wallRate.hoursPerSqft * diffFactor;
		const hoursC = ceilingSqft * ceilRate.hoursPerSqft;
		const totalHrs = hoursW + hoursC;

		// MATERIAL (No height factor usually)
		const matW = wallSqft * wallRate.material;
		const matC = ceilingSqft * ceilRate.material;
		const totalMat = matW + matC;

		// Push Labor Item
		breakdownItems.push({
			name: `${name} (Labor)`,
			cost: totalLabor,
			hours: totalHrs,
			details: `Walls: ${wallSqft}sf * $${(wallRate.labor * diffFactor).toFixed(
				2
			)} + Clg: ${ceilingSqft}sf * $${ceilRate.labor.toFixed(2)}`,
		});

		// Push Material Item
		breakdownItems.push({
			name: `${name} Supplies`,
			cost: totalMat,
			hours: 0,
			details: `Walls: $${wallRate.material.toFixed(
				2
			)}/sf + Clg: $${ceilRate.material.toFixed(2)}/sf (${note})`,
		});

		totalCost += totalLabor + totalMat;
		totalHours += totalHrs;
	};

	// --- B. Services ---

	// 1. Insulation
	if (services.insulation) {
		addService(
			'Insulation',
			MASTER_RATES.INSULATION.STANDARD.WALL,
			MASTER_RATES.INSULATION.STANDARD.CEILING,
			'R-13/R-19 Batts'
		);
	}

	// 2. Hanging & Taping Logic
	// Complexity: User might check Hang, Tape, or Both.
	// Data Source: Table 2 (Install) includes Tape. Table 3 (Finish) is Tape Only.

	if (services.hanging && services.taping) {
		// Scenario: Full Install (Hang + Tape + Finish)
		// Using LEVEL 2 (Garage Standard: 1 Coat)
		addService(
			'Drywall Install & Finish',
			MASTER_RATES.DRYWALL_INSTALL.LEVEL_2.WALL,
			MASTER_RATES.DRYWALL_INSTALL.LEVEL_2.CEILING,
			'Board, Tape, Mud (Level 2)'
		);
	} else if (services.hanging && !services.taping) {
		// Scenario: Hang Only (Board Up, No Tape)
		// Derivation: Install L1 (Hang+Tape) MINUS Finish L1 (Tape Only)
		// This is a calculated "Board Only" rate
		const hangWall: RateDetail = {
			labor:
				MASTER_RATES.DRYWALL_INSTALL.LEVEL_1.WALL.labor -
				MASTER_RATES.DRYWALL_FINISH.LEVEL_1.WALL.labor,
			material:
				MASTER_RATES.DRYWALL_INSTALL.LEVEL_1.WALL.material -
				MASTER_RATES.DRYWALL_FINISH.LEVEL_1.WALL.material,
			hoursPerSqft:
				MASTER_RATES.DRYWALL_INSTALL.LEVEL_1.WALL.hoursPerSqft -
				MASTER_RATES.DRYWALL_FINISH.LEVEL_1.WALL.hoursPerSqft,
		};
		const hangCeil: RateDetail = {
			labor:
				MASTER_RATES.DRYWALL_INSTALL.LEVEL_1.CEILING.labor -
				MASTER_RATES.DRYWALL_FINISH.LEVEL_1.CEILING.labor,
			material:
				MASTER_RATES.DRYWALL_INSTALL.LEVEL_1.CEILING.material -
				MASTER_RATES.DRYWALL_FINISH.LEVEL_1.CEILING.material,
			hoursPerSqft:
				MASTER_RATES.DRYWALL_INSTALL.LEVEL_1.CEILING.hoursPerSqft -
				MASTER_RATES.DRYWALL_FINISH.LEVEL_1.CEILING.hoursPerSqft,
		};

		addService(
			'Drywall Hang Only',
			hangWall,
			hangCeil,
			'5/8" Fire Board + Fasteners'
		);
	} else if (!services.hanging && services.taping) {
		// Scenario: Finish Only (Board already up)
		// Using LEVEL 2 (Tape + 1 Coat)
		addService(
			'Taping & Finishing',
			MASTER_RATES.DRYWALL_FINISH.LEVEL_2.WALL,
			MASTER_RATES.DRYWALL_FINISH.LEVEL_2.CEILING,
			'Tape + 1 Coat'
		);
	}

	// 3. Painting
	if (services.painting) {
		// Scenario: Garage Standard = Primer + 1 Coat
		// We sum the "Primer" rate and "One Coat" rate from Master Table
		const paintWall: RateDetail = {
			labor:
				MASTER_RATES.PAINTING.PRIMER.WALL.labor +
				MASTER_RATES.PAINTING.ONE_COAT.WALL.labor,
			material:
				MASTER_RATES.PAINTING.PRIMER.WALL.material +
				MASTER_RATES.PAINTING.ONE_COAT.WALL.material,
			hoursPerSqft:
				MASTER_RATES.PAINTING.PRIMER.WALL.hoursPerSqft +
				MASTER_RATES.PAINTING.ONE_COAT.WALL.hoursPerSqft,
		};
		const paintCeil: RateDetail = {
			labor:
				MASTER_RATES.PAINTING.PRIMER.CEILING.labor +
				MASTER_RATES.PAINTING.ONE_COAT.CEILING.labor,
			material:
				MASTER_RATES.PAINTING.PRIMER.CEILING.material +
				MASTER_RATES.PAINTING.ONE_COAT.CEILING.material,
			hoursPerSqft:
				MASTER_RATES.PAINTING.PRIMER.CEILING.hoursPerSqft +
				MASTER_RATES.PAINTING.ONE_COAT.CEILING.hoursPerSqft,
		};

		addService('Prime & Paint', paintWall, paintCeil, 'PVA Primer + 1 Coat');
	}

	// C. Fees
	if (occupancy === 'Pro Move') {
		totalCost += GARAGE_PRICES.PRO_MOVE_HANDLING_FEE;
		totalHours += GARAGE_PRICES.PRO_MOVE_HOURS;
		breakdownItems.push({
			name: 'Contents Handling',
			cost: GARAGE_PRICES.PRO_MOVE_HANDLING_FEE,
			hours: GARAGE_PRICES.PRO_MOVE_HOURS,
			details: 'Flat Fee: Move & Cover Items',
		});
	}

	if (isHighCeiling) {
		totalCost += GARAGE_PRICES.SCAFFOLD_RENTAL_FLAT;
		breakdownItems.push({
			name: 'Equipment Fee',
			cost: GARAGE_PRICES.SCAFFOLD_RENTAL_FLAT,
			hours: 0,
			details: 'Scaffold/Lift Rental',
		});
	}

	return {
		low: Math.round(totalCost * 0.95),
		high: Math.round(totalCost * 1.1),
		totalHours: Number(totalHours.toFixed(1)),
		explanation: `Garage Finish (${size}). Scope: ${Object.keys(services)
			.filter((k) => services[k as keyof typeof services])
			.join(', ')}.`,
		breakdownItems: isAdmin ? breakdownItems : [],
		customerSummary: `Estimate for ${size} Garage.`,
	};
};

import {
	GARAGE_DIMENSIONS,
	GARAGE_PRICES,
	HEIGHT_VALUES,
} from '../constants/garageConstants.js';
import { MASTER_RATES, RateDetail } from '../constants/masterRates.js';
import { GarageRequest } from '../types.js';

// Map UI Values to Master Rate Keys
const LEVEL_MAP: Record<string, keyof typeof MASTER_RATES.DRYWALL_INSTALL> = {
	'Level 1': 'LEVEL_1',
	'Level 2': 'LEVEL_2',
	'Level 3': 'LEVEL_3',
	'Level 4': 'LEVEL_4',
	'Level 5': 'LEVEL_5',
};

const PAINT_MAP: Record<string, keyof typeof MASTER_RATES.PAINTING> = {
	Primer: 'PRIMER',
	'1-Coat': 'ONE_COAT',
	Standard: 'STANDARD',
	Premium: 'FULL',
};

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
	const drywallLvl = data.drywallLevel || 'Level 2';
	const paintLvl = data.paintLevel || 'Standard';

	const dims = GARAGE_DIMENSIONS[size];
	if (!dims) throw new Error('Invalid garage size');

	// 1. Dimensions
	const height = HEIGHT_VALUES[ceilingHeight] || 9;
	const diffFactor =
		GARAGE_PRICES.HEIGHT_FACTORS[
			ceilingHeight as keyof typeof GARAGE_PRICES.HEIGHT_FACTORS
		] || 1.0;

	// 2. Areas
	const perimeter = 2 * (dims.width + dims.depth);
	const wallSqft = perimeter * height;
	const ceilingSqft = includeCeiling ? dims.width * dims.depth : 0;
	// const totalSqft = wallSqft + ceilingSqft; // (Not used directly in new math logic)

	const breakdownItems: BreakdownItem[] = [];
	let totalCost = 0;
	let totalHours = 0;

	// Header
	breakdownItems.push({
		name: 'Project Dimensions',
		cost: 0,
		hours: 0,
		details: `${size} (${dims.width}'x${
			dims.depth
		}'). Walls: ${wallSqft} sf. Clg: ${
			includeCeiling ? ceilingSqft : 'Excluded'
		} sf.`,
	});

	// --- Helper: Explicit Math String ---
	const addService = (
		name: string,
		wRate: RateDetail,
		cRate: RateDetail,
		note: string
	) => {
		// LABOR
		const wLaborRate = wRate.labor * diffFactor;
		const lCost = wallSqft * wLaborRate + ceilingSqft * cRate.labor;
		const lHrs =
			wallSqft * wRate.hoursPerSqft * diffFactor +
			ceilingSqft * cRate.hoursPerSqft;

		// MATERIAL
		const mCost = wallSqft * wRate.material + ceilingSqft * cRate.material;

		totalCost += lCost + mCost;
		totalHours += lHrs;

		// Formatted Strings for Admin Transparency
		// Ex: Walls: 480sf * $0.65 + Clg: 240sf * $0.85
		const laborDetails =
			`Walls: ${wallSqft}sf * $${wLaborRate.toFixed(2)}` +
			(includeCeiling
				? ` + Clg: ${ceilingSqft}sf * $${cRate.labor.toFixed(2)}`
				: '');

		const materialDetails =
			`Walls: ${wallSqft}sf * $${wRate.material.toFixed(2)}` +
			(includeCeiling
				? ` + Clg: ${ceilingSqft}sf * $${cRate.material.toFixed(2)}`
				: '');

		// 1. Labor Line
		breakdownItems.push({
			name: `${name} (Labor)`,
			cost: lCost,
			hours: lHrs,
			details: laborDetails,
		});

		// 2. Supply Line (Indented with L-shape)
		breakdownItems.push({
			name: `↳ ${name} Supplies`,
			cost: mCost,
			hours: 0,
			details: `↳ ${materialDetails} (${note})`,
		});
	};

	// --- Services ---

	// 1. Insulation
	if (services.insulation) {
		addService(
			'Insulation',
			MASTER_RATES.INSULATION.STANDARD.WALL,
			MASTER_RATES.INSULATION.STANDARD.CEILING,
			'R-13 Batts'
		);
	}

	// 2. Drywall Work
	if (services.drywall) {
		const key = LEVEL_MAP[drywallLvl] || 'LEVEL_2';

		if (condition === 'Bare Studs') {
			// Full Install
			const wRate = MASTER_RATES.DRYWALL_INSTALL[key].WALL;
			const cRate = MASTER_RATES.DRYWALL_INSTALL[key].CEILING;
			addService(
				`Drywall Install (${drywallLvl})`,
				wRate,
				cRate,
				'Board, Tape, Mud'
			);
		} else {
			// Finish Only (Hung)
			const wRate = MASTER_RATES.DRYWALL_FINISH[key].WALL;
			const cRate = MASTER_RATES.DRYWALL_FINISH[key].CEILING;
			addService(
				`Drywall Finish (${drywallLvl})`,
				wRate,
				cRate,
				'Tape & Mud Only'
			);
		}
	}

	// 3. Painting
	if (services.painting) {
		const key = PAINT_MAP[paintLvl] || 'STANDARD';
		const wRate = MASTER_RATES.PAINTING[key].WALL;
		const cRate = MASTER_RATES.PAINTING[key].CEILING;
		addService(`Painting (${paintLvl})`, wRate, cRate, 'Paint & Supplies');
	}

	// Fees
	if (occupancy === 'Pro Move') {
		totalCost += GARAGE_PRICES.PRO_MOVE_HANDLING_FEE;
		totalHours += GARAGE_PRICES.PRO_MOVE_HOURS;
		breakdownItems.push({
			name: 'Contents Handling',
			cost: GARAGE_PRICES.PRO_MOVE_HANDLING_FEE,
			hours: GARAGE_PRICES.PRO_MOVE_HOURS,
			details: 'Flat Fee',
		});
	}

	if (height > 9) {
		totalCost += GARAGE_PRICES.SCAFFOLD_RENTAL_FLAT;
		breakdownItems.push({
			name: 'Equipment Fee',
			cost: GARAGE_PRICES.SCAFFOLD_RENTAL_FLAT,
			hours: 0,
			details: 'Scaffold Rental',
		});
	}

	return {
		low: Math.round(totalCost * 0.95),
		high: Math.round(totalCost * 1.1),
		totalHours: Number(totalHours.toFixed(1)),
		explanation: `Garage (${size}). Level: ${drywallLvl}, Paint: ${paintLvl}.`,
		breakdownItems: isAdmin ? breakdownItems : [],
		customerSummary: `Estimate for ${size} Garage.`,
	};
};

// server/src/modules/estimator/services/garageService.ts
import {
	GARAGE_DIMENSIONS,
	GARAGE_PRICES,
	HEIGHT_VALUES,
} from '../constants/garageConstants.js';
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
	// CRITICAL: If includeCeiling is false, ceilingSqft is 0 for PRICING, but we might keep ref for notes
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

	// Helper to calculate cost for a service splitting Wall vs Ceiling
	const calcService = (
		name: string,
		wallRate: number,
		ceilRate: number,
		hoursRate: number
	) => {
		const wCost = wallSqft * wallRate * diffFactor;
		const cCost = ceilingSqft * ceilRate; // Ceiling usually not affected by wall height factor, it's just "high" naturally

		const cost = wCost + cCost;
		const hours = totalSqft * hoursRate * diffFactor;

		return {
			cost,
			hours,
			details: `Walls: ${wallSqft}sqft, Ceilings: ${ceilingSqft}sqft`,
		};
	};

	// B. Services
	if (services.insulation) {
		const res = calcService(
			'Insulation',
			GARAGE_PRICES.INSULATION_WALL_SQFT,
			GARAGE_PRICES.INSULATION_CEILING_SQFT,
			GARAGE_PRICES.HOURS_PER_SQFT.INSULATION
		);
		totalCost += res.cost;
		totalHours += res.hours;
		breakdownItems.push({
			name: 'Insulation',
			cost: res.cost,
			hours: res.hours,
			details: res.details,
		});
	}

	if (services.hanging) {
		const res = calcService(
			'Drywall Hang',
			GARAGE_PRICES.HANGING_WALL_SQFT,
			GARAGE_PRICES.HANGING_CEILING_SQFT,
			GARAGE_PRICES.HOURS_PER_SQFT.HANGING
		);
		totalCost += res.cost;
		totalHours += res.hours;
		breakdownItems.push({
			name: 'Hanging (5/8" Fire)',
			cost: res.cost,
			hours: res.hours,
			details: res.details,
		});
	}

	if (services.taping) {
		const res = calcService(
			'Taping (Fire Tape)',
			GARAGE_PRICES.TAPING_WALL_SQFT,
			GARAGE_PRICES.TAPING_CEILING_SQFT,
			GARAGE_PRICES.HOURS_PER_SQFT.TAPING
		);
		totalCost += res.cost;
		totalHours += res.hours;
		breakdownItems.push({
			name: 'Taping',
			cost: res.cost,
			hours: res.hours,
			details: res.details,
		});
	}

	if (services.painting) {
		const res = calcService(
			'Painting',
			GARAGE_PRICES.PAINTING_WALL_SQFT,
			GARAGE_PRICES.PAINTING_CEILING_SQFT,
			GARAGE_PRICES.HOURS_PER_SQFT.PAINTING
		);
		totalCost += res.cost;
		totalHours += res.hours;

		// Material Transparency (Like Painting Service)
		const gallons = totalSqft / GARAGE_PRICES.COVERAGE_SQFT_PER_GALLON;
		breakdownItems.push({
			name: 'Prime & Paint',
			cost: res.cost,
			hours: res.hours,
			details: `${res.details} (~${Math.ceil(gallons)} gals included)`,
		});
	}

	// C. Fees
	if (occupancy === 'Pro Move') {
		totalCost += GARAGE_PRICES.PRO_MOVE_HANDLING_FEE;
		totalHours += GARAGE_PRICES.PRO_MOVE_HOURS;
		breakdownItems.push({
			name: 'Contents Handling',
			cost: GARAGE_PRICES.PRO_MOVE_HANDLING_FEE,
			hours: GARAGE_PRICES.PRO_MOVE_HOURS,
			details: 'Move & Cover Items',
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

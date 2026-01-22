import {
	GARAGE_DIMENSIONS,
	GARAGE_PRICES,
	HEIGHT_VALUES,
} from '../constants/garageConstants.js';
import { GarageRequest } from '../types.js';

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

	if (!dims) {
		console.error(`Invalid garage size provided: ${size}`);
		throw new Error('Invalid garage size');
	}

	const height = HEIGHT_VALUES[ceilingHeight] || 8.5;
	const heightFactor =
		GARAGE_PRICES.HEIGHT_FACTORS[
			ceilingHeight as keyof typeof GARAGE_PRICES.HEIGHT_FACTORS
		] || 1.0;

	// 1. Calculate Areas
	const perimeter = 2 * (dims.width + dims.length);
	const wallArea = perimeter * height;
	const ceilingArea = dims.width * dims.length;
	const totalArea = wallArea + (includeCeiling ? ceilingArea : 0);

	const breakdownItems = [];

	// 2. Line Item: Insulation
	if (services.insulation) {
		breakdownItems.push({
			item: 'Insulation',
			description: `Wall insulation for ${wallArea.toFixed(0)} sqft`,
			total: wallArea * GARAGE_PRICES.INSULATION_PER_SQFT,
		});
	}

	// 3. Line Item: Hanging
	if (services.hanging && condition === 'Bare Studs') {
		breakdownItems.push({
			item: 'Hanging',
			description: `Drywall on ${totalArea.toFixed(0)} sqft`,
			total: totalArea * GARAGE_PRICES.HANGING_PER_SQFT * heightFactor,
		});
	}

	// 4. Line Item: Taping & Mudding
	if (
		services.taping &&
		(condition === 'Bare Studs' || condition === 'Drywall Hung')
	) {
		breakdownItems.push({
			item: 'Taping/Mudding',
			description: `Finish on ${totalArea.toFixed(0)} sqft`,
			total: totalArea * GARAGE_PRICES.TAPING_MUDDING_PER_SQFT * heightFactor,
		});
	}

	// 5. Line Item: Painting
	if (services.painting) {
		breakdownItems.push({
			item: 'Painting',
			description: `Primer/Paint on ${totalArea.toFixed(0)} sqft`,
			total: totalArea * GARAGE_PRICES.PAINTING_PER_SQFT * heightFactor,
		});
	}

	// 6. Line Item: Handling/Occupancy
	if (occupancy === 'Pro Move') {
		breakdownItems.push({
			item: 'Handling',
			description: 'Professional obstruction management',
			total: GARAGE_PRICES.PRO_MOVE_HANDLING_FEE,
		});
	}

	// 7. Equipment Surcharges
	if (ceilingHeight !== 'Standard (8-9ft)') {
		breakdownItems.push({
			item: 'Equipment',
			description: 'Scaffold/High-access rental',
			total: GARAGE_PRICES.SCAFFOLD_RENTAL_DAILY,
		});
	}

	const subtotal = breakdownItems.reduce((acc, item) => acc + item.total, 0);

	return {
		low: Math.round(subtotal * 0.9), // Providing a 10% range for "brutal honesty"
		high: Math.round(subtotal * 1.1),
		totalHours: Number((subtotal / 70).toFixed(1)), // Estimating hours based on a $70/hr labor load
		explanation: `Professional Garage Finish for a ${size} garage. Starting condition: ${condition}.`,
		breakdownItems: isAdmin ? breakdownItems : [],
	};
};

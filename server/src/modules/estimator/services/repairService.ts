import { REPAIR_PRICES, REPAIR_LABOR } from '../constants/repairConstants.js';
import { RepairItem, RepairRequest } from '../types.js';
import { generateServiceBreakdown } from '../utils/breakdownHelper.js';

export const calculateRepairEstimate = async (data: RepairRequest) => {
	let totalCost = 0;
	let totalHours = 0;
	const items: any[] = [];

	if (!data.repairs || data.repairs.length === 0)
		return {
			low: 0,
			high: 0,
			totalHours: 0,
			explanation: '',
			breakdownItems: [],
		};

	// 1. FIND THE "ANCHOR" REPAIR (The most expensive 100% item)
	let anchorIndex = -1;
	let maxBasePrice = 0;

	data.repairs.forEach((repair, idx) => {
		const base =
			REPAIR_PRICES.PATCH_AND_PAINT_BASE[
				repair.damageType === 'Dings/Nail Pops'
					? 'Dings/Nail Pops'
					: repair.size
			] || 150;
		if (base > maxBasePrice) {
			maxBasePrice = base;
			anchorIndex = idx;
		}
	});

	// 2. PROCESS REPAIRS
	const processedLocations: string[] = [];

	data.repairs.forEach((repair, idx) => {
		const qty = Number(repair.quantity) || 1;
		const baseUnitPrice =
			REPAIR_PRICES.PATCH_AND_PAINT_BASE[
				repair.damageType === 'Dings/Nail Pops'
					? 'Dings/Nail Pops'
					: repair.size
			] || 150;

		let currentItemCost = 0;
		let discountLabel = '';

		// Determine Pricing Factor
		if (idx === anchorIndex) {
			currentItemCost = baseUnitPrice; // 100% for the first one (Anchor)
		} else if (processedLocations.includes(repair.locationName)) {
			currentItemCost = baseUnitPrice * REPAIR_PRICES.ADD_ON_FACTORS.SAME_WALL; // 15%
			discountLabel = ` (Same Wall Add-on: ${
				REPAIR_PRICES.ADD_ON_FACTORS.SAME_WALL * 100
			}%)`;
		} else {
			currentItemCost =
				baseUnitPrice * REPAIR_PRICES.ADD_ON_FACTORS.DIFFERENT_ROOM; // 40%
			discountLabel = ` (Different Room Add-on: ${
				REPAIR_PRICES.ADD_ON_FACTORS.DIFFERENT_ROOM * 100
			}%)`;
		}

		// Cap at 5 patches per wall
		const finalQty = Math.min(qty, 5);
		const totalRepairCost = currentItemCost * finalQty;

		items.push({
			name: `${repair.locationName}: ${repair.damageType} (x${finalQty})`,
			cost: totalRepairCost,
			hours: (REPAIR_LABOR[repair.size] || 1) * finalQty,
			details: `Base $${baseUnitPrice}${discountLabel}`,
		});

		// 3. WALL PAINTING LOGIC (Square Footage)
		if (repair.paintMatching === 'Paint entire wall') {
			const hMap: any = {
				'8ft (Standard)': 8,
				'9-10ft': 10,
				'11ft+ (Scaffold)': 12,
			};
			const wMap: any = {
				'6ft (Small)': 6,
				'10ft (Medium)': 10,
				'12ft (Large)': 12,
				'14ft+ (Very Large)': 14,
			};

			const h = hMap[repair.wallHeight || '8ft (Standard)'];
			const w = wMap[repair.wallWidth || '10ft (Medium)'];
			const sqft = h * w;

			const paintLabor = sqft * REPAIR_PRICES.WALL_PAINTING.LABOR_PER_SQFT;
			const gallonsNeeded = Math.ceil(
				sqft / REPAIR_PRICES.WALL_PAINTING.SQFT_PER_GALLON
			);
			const paintSupply =
				gallonsNeeded * REPAIR_PRICES.WALL_PAINTING.PAINT_PER_GALLON;

			items.push({
				name: `  └ Paint Entire Wall (${sqft} sqft)`,
				cost: paintLabor + paintSupply,
				hours: sqft / 100, // Rough estimate: 1hr per 100sqft
				details: `Labor: $${paintLabor} + Paint: $${paintSupply} (${gallonsNeeded}g)`,
			});

			// Scaffolding Surcharge
			if (repair.wallHeight === '11ft+ (Scaffold)') {
				items.push({
					name: `  └ Scaffold Rental Surcharge`,
					cost: REPAIR_PRICES.SURCHARGES.SCAFFOLD_RENTAL,
					hours: 0,
					details: 'Required for high walls',
				});
			}
		}

		processedLocations.push(repair.locationName);
		totalCost += totalRepairCost;
	});

	// Minimum Service Fee Check
	if (totalCost > 0 && totalCost < REPAIR_PRICES.BASE_SERVICE_FEE) {
		const adjustment = REPAIR_PRICES.BASE_SERVICE_FEE - totalCost;
		items.push({
			name: 'Minimum Service Call Adjustment',
			cost: adjustment,
			hours: 0,
			details: `Brings project total up to the $${REPAIR_PRICES.BASE_SERVICE_FEE} minimum trip fee`,
		});
		totalCost = REPAIR_PRICES.BASE_SERVICE_FEE;
	}

	// Generate the professional text summary for the admin
	const explanation = generateServiceBreakdown(
		'Drywall Repair',
		items,
		totalCost,
		totalHours
	);

	return {
		low: Math.round(totalCost),
		high: Math.round(totalCost * 1.2),
		totalHours: parseFloat(totalHours.toFixed(1)),
		explanation: explanation,
		breakdownItems: items,
	};
};

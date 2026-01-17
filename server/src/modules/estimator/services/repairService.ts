import { REPAIR_PRICES, REPAIR_LABOR } from '../constants/repairConstants.js';
import { RepairItem, RepairRequest } from '../types.js';
import { generateServiceBreakdown } from '../utils/breakdownHelper.js';

export const calculateRepairEstimate = async (data: RepairRequest) => {
	let totalCost = 0;
	let totalHours = 0;
	let maxVisits = 0;
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

		let repairVisits = 2; // Default: Visit 1 (Prep/Mud), Visit 2 (Sand/Paint)
		if (repair.size === 'X-Large (Sheet+)') {
			repairVisits = 3; // Visit 1 (Hang/Tape), Visit 2 (Mud), Visit 3 (Sand/Paint)
		}

		// Track the highest number of visits required for the whole project
		if (repairVisits > maxVisits) maxVisits = repairVisits;
	});

	// 2. PROCESS REPAIRS
	const processedLocations: string[] = [];
	let isGlobalAnchorCharged = false;

	data.repairs.forEach((repair, idx) => {
		const qty = Number(repair.quantity) || 1;
		const finalQty = Math.min(qty, 5); // Cap at 5 per wall
		const baseUnitPrice =
			REPAIR_PRICES.PATCH_AND_PAINT_BASE[
				repair.damageType === 'Dings/Nail Pops'
					? 'Dings/Nail Pops'
					: repair.size
			] || 150;

		let repairItemCost = 0;
		let repairItemHours = (REPAIR_LABOR[repair.size] || 1) * finalQty;

		// This array will store the "Math" for each patch to show in the Admin UI
		const mathBreakdown: string[] = [];

		// --- QUANTITY LOOP: Calculate and Document each patch individually ---
		for (let i = 0; i < finalQty; i++) {
			if (idx === anchorIndex && i === 0 && !isGlobalAnchorCharged) {
				// Anchor Patch (100%)
				repairItemCost += baseUnitPrice;
				mathBreakdown.push(`Patch 1: $${baseUnitPrice} (100%)`);
				isGlobalAnchorCharged = true;
			} else if (processedLocations.includes(repair.locationName) || i > 0) {
				// Same Wall Add-ons (15%)
				const addonPrice =
					baseUnitPrice * REPAIR_PRICES.ADD_ON_FACTORS.SAME_WALL;
				repairItemCost += addonPrice;
				mathBreakdown.push(`Patch ${i + 1}: $${addonPrice.toFixed(2)} (15%)`);
			} else {
				// Different Room Add-ons (40%)
				const addonPrice =
					baseUnitPrice * REPAIR_PRICES.ADD_ON_FACTORS.DIFFERENT_ROOM;
				repairItemCost += addonPrice;
				mathBreakdown.push(`Patch ${i + 1}: $${addonPrice.toFixed(2)} (40%)`);
			}
		}

		items.push({
			name: `${repair.locationName}: ${repair.damageType} (x${finalQty})`,
			cost: repairItemCost,
			hours: repairItemHours,
			// DYNAMIC DETAIL: Shows exactly how the $210 (or any total) was reached
			details: `Breakdown: ${mathBreakdown.join(
				' + '
			)} = $${repairItemCost.toFixed(2)}`,
		});

		totalCost += repairItemCost;
		totalHours += repairItemHours;

		// 3. WALL PAINTING LOGIC (Square Footage & Exact Paint)
		if (
			repair.scope.includes('Paint') &&
			repair.paintMatching === 'Paint entire wall'
		) {
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
			const gallonsNeeded = sqft / REPAIR_PRICES.WALL_PAINTING.SQFT_PER_GALLON;
			const paintSupply =
				gallonsNeeded * REPAIR_PRICES.WALL_PAINTING.PAINT_PER_GALLON;

			const totalWallPaintCost = paintLabor + paintSupply;
			const totalWallPaintHours = sqft / 100;

			items.push({
				name: `  └ Paint Entire Wall (${sqft} sqft)`,
				cost: totalWallPaintCost,
				hours: totalWallPaintHours,
				details: `Labor: $${paintLabor.toFixed(
					2
				)} ($1.50/sqft) + Paint: $${paintSupply.toFixed(
					2
				)} ($50/gal x ${gallonsNeeded.toFixed(2)}g)`,
			});

			totalCost += totalWallPaintCost;
			totalHours += totalWallPaintHours;

			if (repair.wallHeight === '11ft+ (Scaffold)') {
				const scaffoldFee = REPAIR_PRICES.SURCHARGES.SCAFFOLD_RENTAL;
				items.push({
					name: `  └ Scaffold Rental Surcharge`,
					cost: scaffoldFee,
					hours: 0,
					details: 'Required for walls 11ft and higher',
				});
				totalCost += scaffoldFee;
			}
		} else if (repair.paintMatching === 'Color Match needed') {
			const quartPrice = REPAIR_PRICES.WALL_PAINTING.PAINT_QUART;

			items.push({
				name: `  └ Paint Supply: Color Match Quart`,
				cost: quartPrice,
				hours: 0,
				details: 'One quart of matched paint for patches',
			});

			totalCost += quartPrice; // Ensure this is added to the total!
		}

		processedLocations.push(repair.locationName);
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
		totalVisits: maxVisits,
		explanation: explanation,
		breakdownItems: items,
	};
};

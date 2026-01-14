import { REPAIR_PRICES, REPAIR_LABOR } from '../constants/repairConstants.js';
import { RepairItem, RepairRequest } from '../types.js';

export const calculateRepairEstimate = async (data: RepairRequest) => {
	let totalCost = 0;
	let totalHours = 0;
	const items: any[] = [];

	const locationGroups: Record<string, RepairItem[]> = {};

	if (data.repairs && data.repairs.length > 0) {
		data.repairs.forEach((repair: RepairItem) => {
			const loc = repair.locationName || 'Unspecified Location';
			if (!locationGroups[loc]) locationGroups[loc] = [];
			locationGroups[loc].push(repair);
		});
	}

	// FIX 1: Use Object.entries to avoid 'possibly undefined' error
	Object.entries(locationGroups).forEach(([location, repairsInLocation]) => {
		// Track if we've already charged the "First Patch (100%)" for this wall
		let isFirstInLocation = true;

		repairsInLocation.forEach((repair) => {
			let itemCost = 0;
			let itemHours = 0;

			// FIX 2: Since quantity is now typed as a number, we don't need parseInt
			// If it might be a string from the form, we cast it safely: Number(repair.quantity)
			const qty = Number(repair.quantity) || 1;

			// --- A. Base Calculation (Patch + Texture + Paint) ---
			const basePrice =
				REPAIR_PRICES.PATCH_AND_PAINT_BASE[
					repair.size as keyof typeof REPAIR_PRICES.PATCH_AND_PAINT_BASE
				] || 185;
			const baseHours =
				REPAIR_LABOR[repair.size as keyof typeof REPAIR_LABOR] || 1.5;

			// --- B. Apply "Same Wall" Discount Logic ---
			if (isFirstInLocation) {
				itemCost = basePrice;
				itemHours = baseHours;
				isFirstInLocation = false;
			} else {
				// 30% price if full wall, 50% if patch-only touch-up
				const discountFactor =
					repair.paintMatching === 'Paint entire wall'
						? REPAIR_PRICES.DISCOUNTS.SAME_WALL_SUBSEQUENT_FACTOR
						: 0.5;

				itemCost = basePrice * discountFactor;
				itemHours = baseHours * discountFactor;
			}

			const totalItemCost = itemCost * qty;
			const totalItemHours = itemHours * qty;

			// --- C. Scope Adjustment (If "Patch Only") ---
			let finalCost = totalItemCost;
			if (repair.scope === 'Patch Only') {
				finalCost =
					totalItemCost * (1 - REPAIR_PRICES.DISCOUNTS.PATCH_ONLY_DISCOUNT);
			}

			// --- D. Complexity Surcharges ---
			if (repair.placement === 'Ceiling')
				finalCost *= REPAIR_PRICES.SURCHARGES.CEILING_MULTIPLIER;
			if (repair.accessibility !== 'Standard')
				finalCost += REPAIR_PRICES.SURCHARGES.HIGH_ACCESSIBILITY;

			const textureFee =
				REPAIR_PRICES.SURCHARGES.TEXTURE_COMPLEXITY[
					repair.texture as keyof typeof REPAIR_PRICES.SURCHARGES.TEXTURE_COMPLEXITY
				] || 0;
			finalCost += textureFee * qty;

			items.push({
				name: `${location}: ${repair.damageType} (x${qty})`,
				cost: finalCost,
				hours: totalItemHours,
				details: `${repair.size} • ${repair.texture} • ${
					repair.paintMatching || 'Touch-up only'
				}`,
			});

			totalCost += finalCost;
			totalHours += totalItemHours;
		});
	});

	// 3. Small Repairs / Description Analysis
	if (data.smallRepairsDescription) {
		const smallRepairCost = 75; // Flat fee for a group of small dings
		items.push({
			name: 'General Surface Dings & Nail Pops',
			cost: smallRepairCost,
			hours: 1.0,
			details: 'Minor patching based on description',
		});
		totalCost += smallRepairCost;
		totalHours += 1.0;
	}

	// 4. Minimum Service Fee Check
	if (totalCost > 0 && totalCost < REPAIR_PRICES.BASE_SERVICE_FEE) {
		const adjustment = REPAIR_PRICES.BASE_SERVICE_FEE - totalCost;
		items.push({
			name: 'Minimum Service Call Adjustment',
			cost: adjustment,
			hours: 0,
			details: `Adjustment to meet $${REPAIR_PRICES.BASE_SERVICE_FEE} minimum`,
		});
		totalCost = REPAIR_PRICES.BASE_SERVICE_FEE;
	}

	return {
		low: Math.round(totalCost),
		high: Math.round(totalCost * 1.2), // 20% range for repairs
		totalHours: parseFloat(totalHours.toFixed(1)),
		explanation: items
			.map((i) => `${i.name}: $${Math.round(i.cost)}`)
			.join('\n'),
		breakdownItems: items,
	};
};

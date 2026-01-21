import { REPAIR_PRICES, REPAIR_LABOR } from '../constants/repairConstants.js';
import { RepairItem, RepairRequest } from '../types.js';
import { generateServiceBreakdown } from '../utils/breakdownHelper.js';

const getBasePrice = (repair: RepairItem): number => {
	const type = repair.damageType;
	const size = repair.size;

	if (type === 'Dings/Nail Pops') {
		if (size.includes('1-5'))
			return REPAIR_PRICES.DINGS_BASE_PRICES['Small (1-5 pops)'];
		if (size.includes('6-15'))
			return REPAIR_PRICES.DINGS_BASE_PRICES['Medium (6-15 pops)'];
		return REPAIR_PRICES.DINGS_BASE_PRICES['Large (16+ pops)'];
	}

	if (type === 'Peeling Tape') {
		if (size.includes('1-3ft'))
			return REPAIR_PRICES.PEELING_TAPE_PRICES['Small (1-3ft)'];
		if (size.includes('3-5ft'))
			return REPAIR_PRICES.PEELING_TAPE_PRICES['Medium (3-5ft)'];
		return REPAIR_PRICES.PEELING_TAPE_PRICES['Large (5ft+)'];
	}

	if (type === 'Stress Crack' || type === 'Crack') {
		if (size.includes('1-3ft'))
			return REPAIR_PRICES.LINEAR_REPAIR_PRICES['Small (1-3ft)'];
		if (size.includes('3-5ft'))
			return REPAIR_PRICES.LINEAR_REPAIR_PRICES['Medium (3-5ft)'];
		return REPAIR_PRICES.LINEAR_REPAIR_PRICES['Large (5ft+)'];
	}

	if (type === 'Corner Bead Repair')
		return REPAIR_PRICES.SPECIALTY_REPAIR_PRICES['Corner Bead Repair'];
	if (type === 'Water Damage')
		return REPAIR_PRICES.SPECIALTY_REPAIR_PRICES['Water Damage'];

	return (REPAIR_PRICES.PATCH_AND_PAINT_BASE as any)[size] || 150;
};

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

	// 1. FIND THE ANCHOR
	let anchorIndex = -1;
	let maxBasePrice = 0;

	data.repairs.forEach((repair, idx) => {
		const base = getBasePrice(repair);
		if (base > maxBasePrice) {
			maxBasePrice = base;
			anchorIndex = idx;
		}
		const repairVisits = repair.size === 'X-Large (Sheet+)' ? 3 : 2;
		if (repairVisits > maxVisits) maxVisits = repairVisits;
	});

	// 2. PROCESS REPAIRS
	const processedLocations: string[] = [];
	let isGlobalAnchorCharged = false;

	data.repairs.forEach((repair, idx) => {
		const qty = Number(repair.quantity) || 1;
		const finalQty = Math.min(qty, 5);
		const baseUnitPrice = getBasePrice(repair);

		let repairItemCost = 0;
		const laborKey = (REPAIR_LABOR as any)[repair.size]
			? repair.size
			: 'Linear/Specialty';
		let repairItemHours = (REPAIR_LABOR as any)[laborKey] * finalQty;
		const mathBreakdown: string[] = [];

		// --- QUANTITY LOOP: Efficiency Logic ---
		for (let i = 0; i < finalQty; i++) {
			if (idx === anchorIndex && i === 0 && !isGlobalAnchorCharged) {
				repairItemCost += baseUnitPrice;
				mathBreakdown.push(`Base: $${baseUnitPrice} (100%)`);
				isGlobalAnchorCharged = true;
			} else if (processedLocations.includes(repair.locationName) || i > 0) {
				const addonPrice =
					baseUnitPrice * REPAIR_PRICES.ADD_ON_FACTORS.SAME_WALL;
				repairItemCost += addonPrice;
				mathBreakdown.push(`Add-on: $${addonPrice.toFixed(2)} (20%)`);
			} else {
				const addonPrice =
					baseUnitPrice * REPAIR_PRICES.ADD_ON_FACTORS.DIFFERENT_ROOM;
				repairItemCost += addonPrice;
				mathBreakdown.push(`Add-on: $${addonPrice.toFixed(2)} (40%)`);
			}
		}

		// --- Priming Fee ---
		if (repair.scope.includes('Paint') || repair.scope.includes('Prime')) {
			const primeFee = REPAIR_PRICES.PRIME_PRICE_PER_PATCH * finalQty;
			repairItemCost += primeFee;
			mathBreakdown.push(`Priming: $${primeFee}`);
		}

		// --- Full Wall Painting Credit ---
		if (repair.paintMatching === 'Paint entire wall') {
			const isLinear =
				repair.damageType === 'Stress Crack' ||
				repair.damageType === 'Peeling Tape' ||
				repair.damageType === 'Corner Bead Repair';
			const creditKey = isLinear
				? 'Linear/Specialty'
				: repair.damageType === 'Dings/Nail Pops'
				? 'Dings/Nail Pops'
				: repair.size;
			const credit = (REPAIR_PRICES.PAINT_CREDITS as any)[creditKey] || 20;
			repairItemCost -= credit;
			mathBreakdown.push(`Full Wall Credit: -$${credit}`);
		}

		// --- Texture Surcharge ---
		const textureFee =
			(REPAIR_PRICES.SURCHARGES.TEXTURE_COMPLEXITY as any)[repair.texture] || 0;
		if (textureFee > 0) {
			repairItemCost += textureFee;
			mathBreakdown.push(`${repair.texture} Texture: $${textureFee}`);
		}

		// --- Accessibility Surcharge ---
		if (repair.accessibility === 'Ladder') {
			repairItemCost += REPAIR_PRICES.SURCHARGES.LADDER_FEE;
			mathBreakdown.push(
				`Ladder Access: $${REPAIR_PRICES.SURCHARGES.LADDER_FEE}`
			);
		} else if (repair.accessibility === 'High') {
			repairItemCost += REPAIR_PRICES.SURCHARGES.SCAFFOLD_RENTAL;
			mathBreakdown.push(
				`Scaffold Rental: $${REPAIR_PRICES.SURCHARGES.SCAFFOLD_RENTAL}`
			);
		}

		// --- Ceiling Surcharge ---
		if (repair.placement === 'Ceiling') {
			const ceilingFee =
				repairItemCost * (REPAIR_PRICES.SURCHARGES.CEILING_MULTIPLIER - 1);
			repairItemCost += ceilingFee;
			mathBreakdown.push(`Ceiling Surcharge: $${ceilingFee.toFixed(2)}`);
		}

		items.push({
			name: `${repair.locationName}: ${repair.damageType} (x${finalQty} ${repair.size})`,
			cost: repairItemCost,
			hours: repairItemHours,
			details: `Breakdown: ${mathBreakdown.join(
				' + '
			)} = $${repairItemCost.toFixed(2)}`,
		});

		totalCost += repairItemCost;
		totalHours += repairItemHours;

		// 3. WALL PAINTING LOGIC
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
			let paintSupply =
				gallonsNeeded <= 0.25
					? REPAIR_PRICES.WALL_PAINTING.PAINT_QUART
					: Math.ceil(gallonsNeeded) *
					  REPAIR_PRICES.WALL_PAINTING.PAINT_PER_GALLON;
			let unitLabel =
				gallonsNeeded <= 0.25 ? `1 Quart` : `${Math.ceil(gallonsNeeded)} Gal`;

			items.push({
				name: `  └ Paint Entire Wall (${sqft} sqft)`,
				cost: paintLabor + paintSupply,
				hours: sqft / 100,
				details: `Labor: $${paintLabor.toFixed(2)} + Paint: ${unitLabel}`,
			});

			totalCost += paintLabor + paintSupply;
			totalHours += sqft / 100;

			if (repair.wallHeight === '11ft+ (Scaffold)') {
				totalCost += REPAIR_PRICES.SURCHARGES.SCAFFOLD_RENTAL;
				items.push({
					name: `  └ Scaffold Surcharge`,
					cost: REPAIR_PRICES.SURCHARGES.SCAFFOLD_RENTAL,
					hours: 0,
					details: 'Required for high walls',
				});
			}
		} else if (repair.paintMatching === 'Color Match needed') {
			totalCost += REPAIR_PRICES.WALL_PAINTING.PAINT_QUART;
			items.push({
				name: `  └ Paint Supply: Color Match Quart`,
				cost: REPAIR_PRICES.WALL_PAINTING.PAINT_QUART,
				hours: 0,
				details: '1 Quart matched paint',
			});
		}

		processedLocations.push(repair.locationName);
	});

	// Minimum Service Fee
	if (totalCost > 0 && totalCost < REPAIR_PRICES.BASE_SERVICE_FEE) {
		const adjustment = REPAIR_PRICES.BASE_SERVICE_FEE - totalCost;
		items.push({
			name: 'Minimum Service Adjustment',
			cost: adjustment,
			hours: 0,
			details: 'Trip minimum',
		});
		totalCost = REPAIR_PRICES.BASE_SERVICE_FEE;
	}

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

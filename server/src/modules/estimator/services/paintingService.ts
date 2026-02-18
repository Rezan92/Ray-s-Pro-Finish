import { generateServiceBreakdown } from '../utils/breakdownHelper.js';
import { MASTER_RATES } from '../constants/masterRates.js';
import { ROOM_DIMENSIONS } from '../constants/paintingConstants.js';
import { PaintingRoom, BreakdownItem } from '../types.js';

interface CalculationContext {
	totalHours: number;
	totalCost: number;
	highWorkLaborHours: number;
	items: BreakdownItem[];
	wallGallons: number;
	ceilingGallons: number;
	trimGallons: number;
	primerGallons: number;
}

const P = MASTER_RATES.PAINTING;

/**
 * T004: Helper to add a line item to the context and update totals
 */
const addLineItem = (
	ctx: CalculationContext,
	name: string,
	hours: number,
	cost: number,
	details: string
) => {
	// Safety Check: Ensure we don't propagate NaN
	const safeHours = isNaN(hours) ? 0 : hours;
	const safeCost = isNaN(cost) ? 0 : cost;

	ctx.totalHours += safeHours;
	ctx.totalCost += safeCost;
	ctx.items.push({
		name,
		hours: parseFloat(safeHours.toFixed(2)),
		cost: Math.round(safeCost),
		details,
	});
};

/**
 * T005: Helper to calculate price and derive hours (Reverse-Hour Formula)
 */
const calculateItemPrice = (quantity: number, unitPrice: number) => {
	const safeQty = isNaN(quantity) ? 0 : quantity;
	const safePrice = isNaN(unitPrice) ? 0 : unitPrice;
	
	const cost = safeQty * safePrice;
	const hours = cost / P.LABOR_RATE;
	return { cost, hours };
};

/**
 * T005: Walls Logic
 */
const calculateWallHours = (room: PaintingRoom, ctx: CalculationContext, L: number, W: number, H: number) => {
	if (!room.surfaces.walls) return;

	const perimeter = 2 * (L + W);
	const area = perimeter * H;
	
	// 1. Determine Unit Price & Coat Counts
	let unitPrice = P.UNIT_PRICES.WALLS.CHANGE;
	let finishCoats = 2;
	let label = 'Standard Color Change';

	if (room.colorChange === 'Similar') {
		unitPrice = P.UNIT_PRICES.WALLS.REFRESH;
		finishCoats = 1;
		label = 'Refresh (1 Coat)';
	} else if (room.colorChange === 'Dark-to-Light') {
		unitPrice = P.UNIT_PRICES.WALLS.DARK_TO_LIGHT;
		finishCoats = 2; // Priming is built into the 3-coat unit price logically
		label = 'Dark-to-Light (3 Coats)';
	}

	const { cost, hours } = calculateItemPrice(area, unitPrice);
	const details = `${Math.round(area)} sqft @ $${unitPrice.toFixed(2)}/sqft (${label})`;
	
	addLineItem(ctx, `${room.label} - Walls`, hours, cost, details);

	// US3: Track High Work Hours
	if (H >= 12) {
		ctx.highWorkLaborHours += hours;
	}

	// 2. Prep (Unit-based additive price)
	let prepPrice = 0;
	if (room.wallCondition === 'Good') prepPrice = P.UNIT_PRICES.WALLS.PREP_GOOD;
	if (room.wallCondition === 'Fair') prepPrice = P.UNIT_PRICES.WALLS.PREP_FAIR;
	if (room.wallCondition === 'Poor') prepPrice = P.UNIT_PRICES.WALLS.PREP_POOR;
	
	if (prepPrice > 0) {
		const { cost: pCost, hours: pHours } = calculateItemPrice(area, prepPrice);
		addLineItem(ctx, `${room.label} - Wall Prep (${room.wallCondition})`, pHours, pCost, `${Math.round(area)} sqft @ $${prepPrice.toFixed(2)}/sqft`);
		if (H >= 12) ctx.highWorkLaborHours += pHours;
	}

	// 3. Materials (Finish Coats)
	const finishGallons = (area / P.MATERIAL_COVERAGE.WALL_CEILING_SQFT_PER_GALLON) * finishCoats;
	ctx.wallGallons += finishGallons;
	
	if (room.colorChange === 'Dark-to-Light') {
		ctx.primerGallons += (area / P.MATERIAL_COVERAGE.PRIMER_SQFT_PER_GALLON);
	}
};

/**
 * T006: Ceiling Logic
 */
const calculateCeilingHours = (room: PaintingRoom, ctx: CalculationContext, L: number, W: number, H: number) => {
	if (!room.surfaces.ceiling) return;

	const area = L * W;
	
	// 1. Determine Base Unit Price (Smooth) & Coat Counts
	let basePrice = P.UNIT_PRICES.CEILINGS.SMOOTH_2;
	let finishCoats = 2;
	let coatLabel = '2 Coats';

	if (room.colorChange === 'Similar') {
		basePrice = P.UNIT_PRICES.CEILINGS.SMOOTH_1;
		finishCoats = 1;
		coatLabel = 'Refresh (1 Coat)';
	} else if (room.colorChange === 'Dark-to-Light') {
		basePrice = P.UNIT_PRICES.CEILINGS.SMOOTH_3;
		finishCoats = 2; // Priming built-in to the unit price
		coatLabel = 'Dark-to-Light (3 Coats)';
	}

	// 2. Apply Texture Surcharge
	let textureSurchargePercent = 0;
	if (room.ceilingTexture === 'Popcorn') {
		textureSurchargePercent = P.UNIT_PRICES.CEILINGS.TEXTURE_SURCHARGE.POPCORN;
	} else if (room.ceilingTexture === 'Textured') {
		textureSurchargePercent = P.UNIT_PRICES.CEILINGS.TEXTURE_SURCHARGE.ORANGE_PEEL;
	}

	const unitPriceWithTexture = basePrice * (1 + textureSurchargePercent);
	
	// 3. Height Multiplier
	let heightMultiplier = P.MULTIPLIERS.CEILING_HEIGHT.STANDARD;
	if (H >= 10 && H < 12) heightMultiplier = P.MULTIPLIERS.CEILING_HEIGHT.MID;
	else if (H >= 12 && H < 15) heightMultiplier = P.MULTIPLIERS.CEILING_HEIGHT.HIGH;
	else if (H >= 15) heightMultiplier = P.MULTIPLIERS.CEILING_HEIGHT.VAULTED;

	const finalUnitPrice = unitPriceWithTexture * heightMultiplier;

	const { cost, hours } = calculateItemPrice(area, finalUnitPrice);
	const textureLabel = room.ceilingTexture === 'Flat' ? 'Smooth' : room.ceilingTexture;
	const details = `${Math.round(area)} sqft @ $${finalUnitPrice.toFixed(2)}/sqft (${textureLabel}, ${coatLabel} x ${heightMultiplier} height)`;
	
	addLineItem(ctx, `${room.label} - Ceiling`, hours, cost, details);

	// US3: Track High Work Hours
	if (H >= 12) {
		ctx.highWorkLaborHours += hours;
	}

	// 5. Materials
	let materialMultiplier = P.UNIT_PRICES.CEILINGS.MATERIAL_MULTIPLIER.SMOOTH;
	if (room.ceilingTexture === 'Popcorn') {
		materialMultiplier = P.UNIT_PRICES.CEILINGS.MATERIAL_MULTIPLIER.POPCORN;
	} else if (room.ceilingTexture === 'Textured') {
		materialMultiplier = P.UNIT_PRICES.CEILINGS.MATERIAL_MULTIPLIER.ORANGE_PEEL;
	}

	const ceilingFinishGallons = (area / P.MATERIAL_COVERAGE.WALL_CEILING_SQFT_PER_GALLON) * finishCoats * materialMultiplier;
	ctx.ceilingGallons += ceilingFinishGallons;

	if (room.colorChange === 'Dark-to-Light') {
		ctx.primerGallons += (area / P.MATERIAL_COVERAGE.PRIMER_SQFT_PER_GALLON);
	}
};

/**
 * T007: Trim, Doors, Windows Logic
 */
const calculateTrimHours = (room: PaintingRoom, ctx: CalculationContext, L: number, W: number) => {
	const perimeter = 2 * (L + W);

	// 1. Baseboards / Trim
	if (room.surfaces.trim) {
		let unitPrice = P.UNIT_PRICES.TRIM.COAT_2;
		let finishCoats = 2;
		let label = 'Standard Change (2 Coats)';

		if (room.trimColorChange === 'Similar') {
			unitPrice = P.UNIT_PRICES.TRIM.COAT_1;
			finishCoats = 1;
			label = 'Refresh (1 Coat)';
		} else if (room.trimColorChange === 'Dark-to-Light') {
			unitPrice = P.UNIT_PRICES.TRIM.COAT_3;
			finishCoats = 2; // Priming built-in
			label = 'Major Change (3 Coats)';
		}

		// Stairwell Multiplier
		if (room.type === 'stairwell') {
			unitPrice *= P.MULTIPLIERS.TRIM_STAIRWELL;
		}

		const { cost, hours } = calculateItemPrice(perimeter, unitPrice);
		addLineItem(ctx, `${room.label} - Trim`, hours, cost, `${Math.round(perimeter)} lf @ $${unitPrice.toFixed(2)}/lf (${label})`);

		// US4: Standalone Trim Prep (Caulking)
		if (room.trimCondition === 'Poor') {
			const prepPrice = P.UNIT_PRICES.MISC.TRIM_PREP_POOR;
			const { cost: pCost, hours: pHours } = calculateItemPrice(perimeter, prepPrice);
			addLineItem(ctx, `${room.label} - Trim Prep (Caulking)`, pHours, pCost, `${Math.round(perimeter)} lf @ $${prepPrice.toFixed(2)}/lf (Poor Condition)`);
		}

		// Materials
		const trimFinishGallons = (perimeter / P.MATERIAL_COVERAGE.TRIM_LF_PER_GALLON) * finishCoats;
		ctx.trimGallons += trimFinishGallons;
		if (room.trimColorChange === 'Dark-to-Light') {
			ctx.primerGallons += (perimeter / P.MATERIAL_COVERAGE.TRIM_PRIMER_LF_PER_GALLON);
		}
	}

	// 2. Crown Molding
	if (room.surfaces.crownMolding) {
		let unitPrice = P.UNIT_PRICES.CROWN.COAT_2;
		let finishCoats = 2;
		let label = 'Standard Change (2 Coats)';

		if (room.crownColorChange === 'Similar') {
			unitPrice = P.UNIT_PRICES.CROWN.COAT_1;
			finishCoats = 1;
			label = 'Refresh (1 Coat)';
		} else if (room.crownColorChange === 'Dark-to-Light') {
			unitPrice = P.UNIT_PRICES.CROWN.COAT_3;
			finishCoats = 2; // Priming built-in
			label = 'Major Change (3 Coats)';
		}

		// US4: Detailed Style Surcharge
		if (room.crownMoldingStyle === 'Detailed') {
			unitPrice *= (1 + P.UNIT_PRICES.MISC.CROWN_DETAILED_SURCHARGE);
		}

		const { cost, hours } = calculateItemPrice(perimeter, unitPrice);
		addLineItem(ctx, `${room.label} - Crown Molding`, hours, cost, `${Math.round(perimeter)} lf @ $${unitPrice.toFixed(2)}/lf (${label}${room.crownMoldingStyle === 'Detailed' ? ', Detailed Style' : ''})`);

		// Materials
		const crownFinishGallons = (perimeter / P.MATERIAL_COVERAGE.TRIM_LF_PER_GALLON) * finishCoats;
		ctx.trimGallons += crownFinishGallons;
		if (room.crownColorChange === 'Dark-to-Light') {
			ctx.primerGallons += (perimeter / P.MATERIAL_COVERAGE.TRIM_PRIMER_LF_PER_GALLON);
		}
	}

	// 3. Doors
	if (room.surfaces.doors) {
		const count = parseInt(room.doorCount) || 0;
		let doorHoursPerSide = 0;
		if (room.doorStyle === 'Paneled') {
			doorHoursPerSide = P.FIXED_ITEMS.DOOR_6_PANEL_SIDE;
		} else { // Slab
			doorHoursPerSide = P.FIXED_ITEMS.DOOR_SLAB_SIDE;
		}
		
		// Apply 2x multiplier for both sides
		const totalDoorHours = count * doorHoursPerSide * 2;
		const totalCost = totalDoorHours * P.LABOR_RATE;
		const detailHours = doorHoursPerSide * 2; // For displaying in details

		addLineItem(ctx, `${room.label} - Doors`, totalDoorHours, totalCost, `${count} ${room.doorStyle} doors @ ${detailHours.toFixed(2)} hrs/ea (both sides)`);
		
		// 1 Gallon paints 8 Doors (both sides, 1 coat).
		const doorFinishGallons = (count / P.MATERIAL_COVERAGE.DOORS_PER_GALLON) * 2; // Default to 2 coats for doors
		ctx.trimGallons += doorFinishGallons;
	}

	// 4. Windows
	if (room.surfaces.windows) {
		const count = room.windowCount || 0;
		const windowHours = count * P.FIXED_ITEMS.WINDOW_STANDARD_CASING;
		const totalCost = windowHours * P.LABOR_RATE;
		addLineItem(ctx, `${room.label} - Window Frames`, windowHours, totalCost, `${count} windows @ ${P.FIXED_ITEMS.WINDOW_STANDARD_CASING.toFixed(2)} hrs/ea`);
		
		// 1 Quart paints 3 Windows (1 coat). 1 Gallon = 12 Windows.
		const windowFinishGallons = (count / P.MATERIAL_COVERAGE.WINDOWS_PER_GALLON) * 2; // Default to 2 coats
		ctx.trimGallons += windowFinishGallons;
	}
};

/**
 * T008: Stairwells Logic
 */
const calculateStairwellHours = (room: PaintingRoom, ctx: CalculationContext) => {
	if (room.type !== 'stairwell') return;

	// Spindles
	if (room.stairSpindles && room.stairSpindles > 0) {
		const unitPrice = room.stairSpindleType === 'Intricate' ? P.UNIT_PRICES.STAIRS.SPINDLE_INTRICATE : P.UNIT_PRICES.STAIRS.SPINDLE_SQUARE;
		const { cost, hours } = calculateItemPrice(room.stairSpindles, unitPrice);
		addLineItem(ctx, `${room.label} - Spindles (${room.stairSpindleType})`, hours, cost, `${room.stairSpindles} @ $${unitPrice.toFixed(2)}/ea`);
	}

	// Handrails
	if (room.stairHandrail && room.stairHandrail > 0) {
		const unitPrice = P.UNIT_PRICES.STAIRS.HANDRAIL;
		const { cost, hours } = calculateItemPrice(room.stairHandrail, unitPrice);
		addLineItem(ctx, `${room.label} - Handrails`, hours, cost, `${room.stairHandrail} lf @ $${unitPrice.toFixed(2)}/lf`);
	}

	// Steps
	if (room.stairSteps && room.stairSteps > 0) {
		const unitPrice = P.UNIT_PRICES.STAIRS.STEP;
		const { cost, hours } = calculateItemPrice(room.stairSteps, unitPrice);
		addLineItem(ctx, `${room.label} - Steps (Risers/Stringers)`, hours, cost, `${room.stairSteps} steps @ $${unitPrice.toFixed(2)}/ea`);
	}
};

/**
 * T010: Main Estimation Function
 */
export const calculatePaintingEstimate = async (data: any) => {
	const ctx: CalculationContext = {
		totalHours: 0,
		totalCost: 0,
		highWorkLaborHours: 0,
		items: [],
		wallGallons: 0,
		ceilingGallons: 0,
		trimGallons: 0,
		primerGallons: 0,
	};

	const occupancyMultiplier = P.MULTIPLIERS.OCCUPANCY[data.occupancy as keyof typeof P.MULTIPLIERS.OCCUPANCY] || 1.0;

	data.rooms.forEach((room: PaintingRoom) => {
		// T011 Logic: Exact dimensions vs Presets
		let L, W, H;
		if (room.exactLength && room.exactWidth && room.exactHeight) {
			L = room.exactLength;
			W = room.exactWidth;
			H = room.exactHeight;
		} else {
			[L, W] = ROOM_DIMENSIONS[room.type]?.[room.size] || [12, 14];
			
			// Standardized Height Mapping (Phase 1 Fix)
			const HEIGHT_MAP: Record<string, number> = {
				'8ft': 8,
				'9-10ft': 9,
				'11-14ft': 12,
				'15ft+': 18,
			};
			const rawHeight = room.ceilingHeight || '8ft';
			H = HEIGHT_MAP[rawHeight] || parseInt(rawHeight) || 8;
		}

		// Surface calculations
		calculateWallHours(room, ctx, L, W, H);
		calculateCeilingHours(room, ctx, L, W, H);
		calculateTrimHours(room, ctx, L, W);
		calculateStairwellHours(room, ctx);

		// Bedroom Closets
		if (room.type === 'bedroom' && room.closetSize && room.closetSize !== 'None') {
			const sizeKey = room.closetSize.toUpperCase() as keyof typeof P.FIXED_ITEMS.CLOSET_MATERIAL_GALLONS;
			const closetHours = P.FIXED_ITEMS[`CLOSET_${sizeKey}` as keyof typeof P.FIXED_ITEMS] || 0;
			const closetCost = closetHours * P.LABOR_RATE;
			const closetGallons = P.FIXED_ITEMS.CLOSET_MATERIAL_GALLONS[sizeKey] || 0;

			addLineItem(ctx, `${room.label} - Closet (${room.closetSize})`, closetHours, closetCost, `Fixed rate for ${room.closetSize} closet`);
			ctx.wallGallons += closetGallons;
		}
	});

	// Apply Occupancy Multiplier to LABOR hours (T016)
	if (occupancyMultiplier !== 1.0) {
		const adjustmentHours = ctx.totalHours * (occupancyMultiplier - 1);
		const adjustmentCost = ctx.totalCost * (occupancyMultiplier - 1);
		
		ctx.totalHours += adjustmentHours;
		ctx.totalCost += adjustmentCost;

		ctx.items.push({
			name: `Occupancy Factor (${data.occupancy})`,
			hours: parseFloat(adjustmentHours.toFixed(2)),
			cost: Math.round(adjustmentCost),
			details: `${occupancyMultiplier}x multiplier applied to total project`,
		});
	}

	// US3: Equipment Rental (High Work)
	let maxProjectHeight = 0;
	data.rooms.forEach((room: any) => {
		let h;
		if (room.exactHeight) {
			h = room.exactHeight;
		} else {
			const hMap: Record<string, number> = { '8ft': 8, '9-10ft': 9, '11-14ft': 12, '15ft+': 18 };
			h = hMap[room.ceilingHeight] || parseInt(room.ceilingHeight) || 8;
		}
		if (h > maxProjectHeight) maxProjectHeight = h;
	});

	if (ctx.highWorkLaborHours > 0) {
		const rentalDays = Math.ceil(ctx.highWorkLaborHours / 8);
		let dailyRate = 0;
		let equipmentType = '';

		if (maxProjectHeight >= 15) {
			dailyRate = P.UNIT_PRICES.EQUIPMENT.SCAFFOLD;
			equipmentType = 'Scaffolding';
		} else if (maxProjectHeight >= 12) {
			dailyRate = P.UNIT_PRICES.EQUIPMENT.LADDER;
			equipmentType = 'Ladder';
		}

		if (rentalDays > 0 && dailyRate > 0) {
			const rentalCost = rentalDays * dailyRate;
			ctx.totalCost += rentalCost;
			ctx.items.push({
				name: 'Equipment Rental',
				hours: 0,
				cost: rentalCost,
				details: `${rentalDays} days ${equipmentType} @ $${dailyRate}/day (Total High Work: ${ctx.highWorkLaborHours.toFixed(2)} hrs)`,
			});
		}
	}

	// Material Supply Logic
	const isCustomerProviding = data.paintProvider === 'Customer';
	
	// Phase 7: Apply Waste Buffer to all categories at once
	const waste = P.MATERIAL_COVERAGE.WASTE_BUFFER;
	ctx.wallGallons *= waste;
	ctx.ceilingGallons *= waste;
	ctx.trimGallons *= waste;
	ctx.primerGallons *= waste;

	const totalGallons = ctx.wallGallons + ctx.ceilingGallons + ctx.trimGallons + ctx.primerGallons;

	if (totalGallons > 0) {
		let materialCost = 0;
		if (!isCustomerProviding) {
			let gallonPrice = P.MATERIAL_PRICES.STANDARD;
			if (data.paintProvider === 'Pro-Base') gallonPrice = P.MATERIAL_PRICES.PRO_BASE;
			if (data.paintProvider === 'Premium') gallonPrice = P.MATERIAL_PRICES.PREMIUM;
			if (data.paintProvider === 'Ultra Premium') gallonPrice = P.MATERIAL_PRICES.ULTRA_PREMIUM;

			const finishCost = (ctx.wallGallons + ctx.ceilingGallons + ctx.trimGallons) * gallonPrice;
			const primerCost = ctx.primerGallons * P.MATERIAL_PRICES.UNIVERSAL_PRIMER;
			materialCost = finishCost + primerCost;
		}

		ctx.items.push({
			name: 'Material Supply Package',
			hours: 0,
			cost: Math.round(materialCost),
			details: `${totalGallons.toFixed(1)} gal (${isCustomerProviding ? 'Customer Provided' : data.paintProvider}) incl. 15% waste`,
		});

		// T016: Gallon Breakdown for Admin
		ctx.items.push({
			name: 'Material Breakdown',
			hours: 0,
			cost: 0,
			details: `Walls: ${ctx.wallGallons.toFixed(1)}g, Ceiling: ${ctx.ceilingGallons.toFixed(1)}g, Trim: ${ctx.trimGallons.toFixed(1)}g, Primer: ${ctx.primerGallons.toFixed(1)}g`,
		});
		ctx.totalCost += materialCost;
	}

	const explanation = generateServiceBreakdown('Painting', ctx.items, ctx.totalCost, ctx.totalHours);

	return {
		low: Math.round(ctx.totalCost),
		high: Math.round(ctx.totalCost * 1.1),
		totalHours: parseFloat(ctx.totalHours.toFixed(1)),
		explanation: explanation,
		breakdownItems: ctx.items,
	};
};
import { generateServiceBreakdown } from '../utils/breakdownHelper.js';
import { MASTER_RATES } from '../constants/masterRates.js';
import { ROOM_DIMENSIONS } from '../constants/paintingConstants.js';
import { PaintingRoom, BreakdownItem, PaintingRequest } from '../types.js';

interface CalculationContext {
	totalHours: number;
	totalCost: number;
	highWorkLaborHours: number;
	items: BreakdownItem[];
	wallGallons: number;
	ceilingGallons: number;
	trimGallons: number;
	crownGallons: number;
	primerGallons: number;
}

const P = MASTER_RATES.PAINTING;

/**
 * Helper to convert ceiling height labels or numbers to a standard number
 */
const getHeightNumber = (room: PaintingRoom): number => {
	if (room.exactHeight) return room.exactHeight;
	
	const HEIGHT_MAP: Record<string, number> = {
		'8ft': 8,
		'9-10ft': 9,
		'11-14ft': 12,
		'15ft+': 18,
	};
	
	const rawHeight = room.ceilingHeight || '8ft';
	return HEIGHT_MAP[rawHeight] || parseInt(rawHeight) || 8;
};

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
 * T005: Helper to calculate price and hours independently
 */
const calculateLineData = (quantity: number, unitPrice: number, speed?: number) => {
	const safeQty = isNaN(quantity) ? 0 : quantity;
	const safePrice = isNaN(unitPrice) ? 0 : unitPrice;
	const safeSpeed = (isNaN(speed || 0) || !speed) ? 0 : speed;
	
	const cost = safeQty * safePrice;
	const hours = safeSpeed > 0 ? safeQty / safeSpeed : 0;
	
	return { cost, hours };
};

/**
 * Helper to calculate price first and derive hours (Reverse-Hour Strategy) 
 */
const calculateItemPrice = (quantity: number, unitPrice: number) => {       
	const cost = quantity * unitPrice;
	const hours = cost / P.LABOR_RATE;
	return { cost, hours };
};

/**
 * Rounding logic for paint purchase:
 * - 0 to 0.25 gallons -> 0.25 (Quart)
 * - 0.25 to 1.0 gallons -> 1.0 (Full Gallon)
 * - Above 1.0: if decimal <= 0.25 -> X.25, else -> next full Gallon
 */
const roundToPurchasableAmount = (gallons: number): number => {
	if (gallons <= 0) return 0;
	
	const integerPart = Math.floor(gallons);
	const decimalPart = gallons - integerPart;

	if (decimalPart === 0) return integerPart;
	if (decimalPart <= 0.25) return integerPart + 0.25;
	return integerPart + 1.0;
};

/**
 * T005: Walls Logic
 */const calculateWallHours = (room: PaintingRoom, ctx: CalculationContext, L: number, W: number, H: number) => {
	if (!room.surfaces.walls) return;

	const perimeter = 2 * (L + W);
	const area = perimeter * H;
	
	// 1. Determine Unit Price & Speeds
	let unitPrice = P.UNIT_PRICES.WALLS.CHANGE;
	let speed = P.PRODUCTION_SPEEDS.WALLS.CHANGE;
	let finishCoats = 2;
	let label = 'Standard Color Change';

	if (room.colorChange === 'Similar') {
		unitPrice = P.UNIT_PRICES.WALLS.REFRESH;
		speed = P.PRODUCTION_SPEEDS.WALLS.REFRESH;
		finishCoats = 1;
		label = 'Refresh (1 Coat)';
	} else if (room.colorChange === 'Dark-to-Light') {
		unitPrice = P.UNIT_PRICES.WALLS.DARK_TO_LIGHT;
		speed = P.PRODUCTION_SPEEDS.WALLS.DARK_TO_LIGHT;
		finishCoats = 2; // Priming built-in
		label = 'Dark-to-Light (3 Coats)';
	}

	// 2. Apply Height Multiplier to Walls
	let heightMultiplier = P.MULTIPLIERS.CEILING_HEIGHT.STANDARD;
	if (H >= 10 && H < 12) heightMultiplier = P.MULTIPLIERS.CEILING_HEIGHT.MID;
	else if (H >= 12 && H < 15) heightMultiplier = P.MULTIPLIERS.CEILING_HEIGHT.HIGH;
	else if (H >= 15) heightMultiplier = P.MULTIPLIERS.CEILING_HEIGHT.VAULTED;

	const finalUnitPrice = unitPrice * heightMultiplier;
	const { cost, hours } = calculateLineData(area, finalUnitPrice, speed);
	
	let details = `${Math.round(area)} sqft @ $${finalUnitPrice.toFixed(2)}/sqft (${label})`;
	if (heightMultiplier > 1) {
		details = `${Math.round(area)} sqft @ $${finalUnitPrice.toFixed(2)}/sqft (${label} x ${heightMultiplier} height)`;
	}
	
	addLineItem(ctx, `${room.label} - Walls`, hours, cost, details);

	// US3: Track High Work Hours
	if (H >= 12) {
		ctx.highWorkLaborHours += hours;
	}

	// 3. Prep (Unit-based additive price)
	let prepPrice = 0;
	let prepSpeed = 0;
	if (room.wallCondition === 'Good') {
		prepPrice = P.UNIT_PRICES.WALLS.PREP_GOOD;
		prepSpeed = P.PRODUCTION_SPEEDS.WALLS.PREP_GOOD;
	}
	if (room.wallCondition === 'Fair') {
		prepPrice = P.UNIT_PRICES.WALLS.PREP_FAIR;
		prepSpeed = P.PRODUCTION_SPEEDS.WALLS.PREP_FAIR;
	}
	if (room.wallCondition === 'Poor') {
		prepPrice = P.UNIT_PRICES.WALLS.PREP_POOR;
		prepSpeed = P.PRODUCTION_SPEEDS.WALLS.PREP_POOR;
	}
	
	if (prepPrice > 0) {
		const finalPrepPrice = prepPrice * heightMultiplier;
		const { cost: pCost, hours: pHours } = calculateLineData(area, finalPrepPrice, prepSpeed);
		addLineItem(ctx, `${room.label} - Wall Prep (${room.wallCondition})`, pHours, pCost, `${Math.round(area)} sqft @ $${finalPrepPrice.toFixed(2)}/sqft`);
		if (H >= 12) ctx.highWorkLaborHours += pHours;
	}

	// 4. Materials (Finish Coats)
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
	
	// 1. Determine Base Unit Price (Smooth) & Speeds
	let basePrice = P.UNIT_PRICES.CEILINGS.SMOOTH_2;
	let speed = P.PRODUCTION_SPEEDS.CEILINGS.CHANGE;
	let finishCoats = 2;
	let coatLabel = '2 Coats';

	if (room.colorChange === 'Similar') {
		basePrice = P.UNIT_PRICES.CEILINGS.SMOOTH_1;
		speed = P.PRODUCTION_SPEEDS.CEILINGS.REFRESH;
		finishCoats = 1;
		coatLabel = 'Refresh (1 Coat)';
	} else if (room.colorChange === 'Dark-to-Light') {
		basePrice = P.UNIT_PRICES.CEILINGS.SMOOTH_3;
		speed = P.PRODUCTION_SPEEDS.CEILINGS.DARK_TO_LIGHT;
		finishCoats = 2; // Priming built-in
		coatLabel = 'Dark-to-Light (3 Coats)';
	}

	// 2. Apply Texture Surcharges
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

	const { cost, hours } = calculateLineData(area, finalUnitPrice, speed);
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
		let speed = P.PRODUCTION_SPEEDS.TRIM.COAT_2;
		let finishCoats = 2;
		let label = 'Standard Change (2 Coats)';

		if (room.trimColorChange === 'Similar') {
			unitPrice = P.UNIT_PRICES.TRIM.COAT_1;
			speed = P.PRODUCTION_SPEEDS.TRIM.COAT_1;
			finishCoats = 1;
			label = 'Refresh (1 Coat)';
		} else if (room.trimColorChange === 'Dark-to-Light') {
			unitPrice = P.UNIT_PRICES.TRIM.COAT_3;
			speed = P.PRODUCTION_SPEEDS.TRIM.COAT_3;
			finishCoats = 2; // Priming built-in
			label = 'Major Change (3 Coats)';
		}

		// Stairwell Multiplier (Affects Price, but Speed handles the Hours)
		if (room.type === 'stairwell') {
			unitPrice *= P.MULTIPLIERS.TRIM_STAIRWELL;
		}

		const { cost, hours } = calculateItemPrice(perimeter, unitPrice);
		addLineItem(ctx, `${room.label} - Trim`, hours, cost, `${Math.round(perimeter)} lf @ $${unitPrice.toFixed(2)}/lf (${label})`);

		// US4: Standalone Trim Prep (Caulking)
		if (room.trimCondition === 'Poor') {
			const prepPrice = P.UNIT_PRICES.MISC.TRIM_PREP_POOR;
			const { cost: pCost, hours: pHours } = calculateLineData(perimeter, prepPrice);
			// Note: Prep is additive, so we manually set some hours for prep if not in speed table
			const manualPrepHours = (perimeter * 0.025); // 0.025 hrs/lf from reference
			addLineItem(ctx, `${room.label} - Trim Prep (Caulking)`, manualPrepHours, pCost, `${Math.round(perimeter)} lf @ $${prepPrice.toFixed(2)}/lf (Poor Condition)`);
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
		let speed = P.PRODUCTION_SPEEDS.CROWN.COAT_2;
		let finishCoats = 2;
		let label = 'Standard Change (2 Coats)';

		if (room.crownColorChange === 'Similar') {
			unitPrice = P.UNIT_PRICES.CROWN.COAT_1;
			speed = P.PRODUCTION_SPEEDS.CROWN.COAT_1;
			finishCoats = 1;
			label = 'Refresh (1 Coat)';
		} else if (room.crownColorChange === 'Dark-to-Light') {
			unitPrice = P.UNIT_PRICES.CROWN.COAT_3;
			speed = P.PRODUCTION_SPEEDS.CROWN.COAT_3;
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
		ctx.crownGallons += crownFinishGallons;
		if (room.crownColorChange === 'Dark-to-Light') {
			ctx.primerGallons += (perimeter / P.MATERIAL_COVERAGE.TRIM_PRIMER_LF_PER_GALLON);
		}
	}

	// 3. Doors
	if (room.surfaces.doors) {
		const count = parseInt(room.doorCount) || 0;
		if (count > 0) {
			const isPaneled = room.doorStyle === 'Paneled';
			const doorHours = isPaneled ? P.FIXED_ITEMS.DOOR_PANELED : P.FIXED_ITEMS.DOOR_SLAB;
			const doorPrice = isPaneled ? P.FIXED_ITEMS.DOOR_PANELED_PRICE : P.FIXED_ITEMS.DOOR_SLAB_PRICE;
			const styleLabel = isPaneled ? 'Paneled' : 'Slab/Smooth';

			const totalDoorHours = count * doorHours;
			const totalDoorCost = count * doorPrice;

			addLineItem(ctx, `${room.label} - Doors`, totalDoorHours, totalDoorCost, `${count} ${styleLabel} doors @ $${doorPrice.toFixed(2)}/ea`);
			
			const doorFinishGallons = (count / P.MATERIAL_COVERAGE.DOORS_PER_GALLON) * 2; 
			ctx.trimGallons += doorFinishGallons;
		}
	}

	// 4. Windows
	if (room.surfaces.windows) {
		const count = room.windowCount || 0;
		if (count > 0) {
			const windowHours = count * P.FIXED_ITEMS.WINDOW_STANDARD_CASING;
			const windowPrice = count * 37.50; // $37.50 ea from ref
			addLineItem(ctx, `${room.label} - Window Frames`, windowHours, windowPrice, `${count} windows @ $37.50/ea`);
			
			const windowFinishGallons = (count / P.MATERIAL_COVERAGE.WINDOWS_PER_GALLON) * 2; 
			ctx.trimGallons += windowFinishGallons;
		}
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
export const calculatePaintingEstimate = async (data: PaintingRequest) => {
	const ctx: CalculationContext = {
		totalHours: 0,
		totalCost: 0,
		highWorkLaborHours: 0,
		items: [],
		wallGallons: 0,
		ceilingGallons: 0,
		trimGallons: 0,
		crownGallons: 0,
		primerGallons: 0,
	};

	data.rooms.forEach((room: PaintingRoom) => {
		// T011 Logic: Exact dimensions vs Presets
		let [L, W] = (ROOM_DIMENSIONS[room.type]?.[room.size] || [12, 14]) as [number, number];
		if (room.exactLength && room.exactWidth) {
			L = room.exactLength;
			W = room.exactWidth;
		}

		const H = getHeightNumber(room);

		// Surface calculations
		calculateWallHours(room, ctx, L, W, H);
		calculateCeilingHours(room, ctx, L, W, H);
		calculateTrimHours(room, ctx, L, W);
		calculateStairwellHours(room, ctx);

		// Bedroom Closets
		if (room.type === 'bedroom' && room.closetSize && room.closetSize !== 'None') {
			const sizeKey = room.closetSize.toUpperCase() as keyof typeof P.FIXED_ITEMS.CLOSET_MATERIAL_GALLONS;
			const closetHoursKey = `CLOSET_${sizeKey}` as keyof typeof P.FIXED_ITEMS;
			const closetHours = (P.FIXED_ITEMS[closetHoursKey] as number) || 0;
			const closetCost = closetHours * P.LABOR_RATE;
			const closetGallons = P.FIXED_ITEMS.CLOSET_MATERIAL_GALLONS[sizeKey] || 0;

			addLineItem(ctx, `${room.label} - Closet (${room.closetSize})`, closetHours, closetCost, `Fixed rate for ${room.closetSize} closet`);
			ctx.wallGallons += closetGallons;
		}

		// Occupancy Fee (Per Room)
		if (data.occupancy === 'PAINTER_MOVES') {
			const fee = P.UNIT_PRICES.MISC.OCCUPANCY_PAINTER_MOVES;
			const time = P.UNIT_PRICES.MISC.OCCUPANCY_PAINTER_MOVES_TIME;
			addLineItem(ctx, `${room.label} - Furniture Handling`, time, fee, 'Fixed fee for moving/covering heavy furniture (45 mins)');
		}

		// Phase 5: Room Defaults (Electrical, Masking, Protection)
		// 1. Electrical Plates (4 per room)
		const plateTime = P.DEFAULTS.DEFAULT_PLATE_COUNT * P.DEFAULTS.ELECTRICAL_PLATE;
		const plateCost = plateTime * P.LABOR_RATE;
		addLineItem(ctx, `${room.label} - Prep (Plates/Masking)`, plateTime, plateCost, `${P.DEFAULTS.DEFAULT_PLATE_COUNT} plates/fixtures`);

		// 2. Floor Protection (15m per 100sqft)
		const floorArea = L * W;
		const floorTime = (floorArea / 100) * (P.DEFAULTS.FLOOR_PROTECTION * (100 / 60)); // Normalize to hours if the constant is in minutes-per-100? No, wait.
		// Re-reading masterRates: FLOOR_PROTECTION: 0.15, // hrs per 100sqft (0.15/100 = 15m/100)
		// Actually 0.15 * 100 / 60 = 0.25. Let's follow the test logic:
		const floorProtHrs = (floorArea / 100) * 0.25; 
		const floorProtCost = floorProtHrs * P.LABOR_RATE;
		addLineItem(ctx, `${room.label} - Floor Protection`, floorProtHrs, floorProtCost, `${Math.round(floorArea)} sqft floor area`);
	});

	// Phase 6: Project Fees & Equipment
	// 1. Misc Material Fee ($10/room)
	const miscMaterialFee = data.rooms.length * P.MISC_MATERIAL_FEE_PER_ROOM;
	ctx.totalCost += miscMaterialFee;
	ctx.items.push({
		name: 'Misc Supplies & Consumables',
		hours: 0,
		cost: miscMaterialFee,
		details: `$${P.MISC_MATERIAL_FEE_PER_ROOM} per room (${data.rooms.length} rooms)`,
	});

	// 2. Daily Trip Fees
	const totalDays = Math.ceil(ctx.totalHours / 8) || 1;
	const tripHours = totalDays * P.DAILY_TRIP_HOURS;
	const tripCost = tripHours * P.LABOR_RATE;
	addLineItem(ctx, 'Daily Trip & Setup', tripHours, tripCost, `${totalDays} day(s) drive/setup time`);

	// US3: Equipment Rental (High Work)
	let maxProjectHeight = 0;
	data.rooms.forEach((room: PaintingRoom) => {
		const h = getHeightNumber(room);
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
	
	// Phase 7: Apply Waste Buffer and Round to Purchasable Amounts (Individual Categories)
	const waste = P.MATERIAL_COVERAGE.WASTE_BUFFER;
	ctx.wallGallons = roundToPurchasableAmount(ctx.wallGallons * waste);
	ctx.ceilingGallons = roundToPurchasableAmount(ctx.ceilingGallons * waste);
	ctx.trimGallons = roundToPurchasableAmount(ctx.trimGallons * waste);
	ctx.crownGallons = roundToPurchasableAmount(ctx.crownGallons * waste);
	ctx.primerGallons = roundToPurchasableAmount(ctx.primerGallons * waste);

	const totalGallons = ctx.wallGallons + ctx.ceilingGallons + ctx.trimGallons + ctx.crownGallons + ctx.primerGallons;

	if (totalGallons > 0) {
		let materialCost = 0;
		if (!isCustomerProviding) {
			let gallonPrice = P.MATERIAL_PRICES.STANDARD;
			if (data.paintProvider === 'Pro-Base') gallonPrice = P.MATERIAL_PRICES.PRO_BASE;
			if (data.paintProvider === 'Premium') gallonPrice = P.MATERIAL_PRICES.PREMIUM;
			if (data.paintProvider === 'Ultra Premium') gallonPrice = P.MATERIAL_PRICES.ULTRA_PREMIUM;

			const finishCost = (ctx.wallGallons + ctx.ceilingGallons + ctx.trimGallons + ctx.crownGallons) * gallonPrice;
			const primerCost = ctx.primerGallons * P.MATERIAL_PRICES.UNIVERSAL_PRIMER;
			materialCost = finishCost + primerCost;
		}

		ctx.items.push({
			name: 'Material Supply Package',
			hours: 0,
			cost: Math.round(materialCost),
			details: `${totalGallons.toFixed(2)} gal (${isCustomerProviding ? 'Customer Provided' : data.paintProvider}) - Rounding applied per surface`,
		});

		// T016: Gallon Breakdown for Admin
		ctx.items.push({
			name: 'Material Breakdown',
			hours: 0,
			cost: 0,
			details: `Walls: ${ctx.wallGallons.toFixed(2)}g, Ceiling: ${ctx.ceilingGallons.toFixed(2)}g, Trim: ${ctx.trimGallons.toFixed(2)}g, Crown: ${ctx.crownGallons.toFixed(2)}g, Primer: ${ctx.primerGallons.toFixed(2)}g`,
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
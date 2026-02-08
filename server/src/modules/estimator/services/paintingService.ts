import { generateServiceBreakdown } from '../utils/breakdownHelper.js';
import { MASTER_RATES } from '../constants/masterRates.js';
import { ROOM_DIMENSIONS } from '../constants/paintingConstants.js';
import { PaintingRoom, BreakdownItem } from '../types.js';

interface CalculationContext {
	totalHours: number;
	totalCost: number;
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
	details: string,
	isLabor: boolean = true
) => {
	const cost = isLabor ? hours * P.LABOR_RATE : 0;
	ctx.totalHours += hours;
	ctx.totalCost += cost;
	ctx.items.push({
		name,
		hours: parseFloat(hours.toFixed(2)),
		cost: Math.round(cost),
		details,
	});
};

/**
 * T005: Walls Logic
 */
const calculateWallHours = (room: PaintingRoom, ctx: CalculationContext, L: number, W: number, H: number) => {
	if (!room.surfaces.walls) return;

	const perimeter = 2 * (L + W);
	const area = perimeter * H;
	
	// 1. Rolling (1st & 2nd coat)
	// Dark-to-light implies 3 coats total (1 Primer + 2 Finish)
	const isDarkToLight = room.colorChange === 'Dark-to-Light';
	const roll1Hours = area / P.PRODUCTION_RATES.WALLS.ROLL_1ST_COAT;
	const roll2Hours = area / P.PRODUCTION_RATES.WALLS.ROLL_2ND_COAT;
	
	addLineItem(ctx, `${room.label} - Wall Rolling (1st Coat)`, roll1Hours, `${Math.round(area)} sqft @ ${P.PRODUCTION_RATES.WALLS.ROLL_1ST_COAT} sqft/hr`);
	addLineItem(ctx, `${room.label} - Wall Rolling (2nd Coat)`, roll2Hours, `${Math.round(area)} sqft @ ${P.PRODUCTION_RATES.WALLS.ROLL_2ND_COAT} sqft/hr`);

	// 2. Cutting
	const cuttingRate = room.colorChange === 'Dark-to-Light' 
		? P.PRODUCTION_RATES.WALLS.CUT_HIGH_CONTRAST 
		: P.PRODUCTION_RATES.WALLS.CUT_STANDARD;
	const cuttingHours = perimeter / cuttingRate;
	addLineItem(ctx, `${room.label} - Wall Cutting`, cuttingHours, `${Math.round(perimeter)} lf @ ${cuttingRate} lf/hr`);

	// 3. Prep
	let prepRate = P.PRODUCTION_RATES.WALLS.PREP_GOOD;
	if (room.wallCondition === 'Fair') prepRate = P.PRODUCTION_RATES.WALLS.PREP_FAIR;
	if (room.wallCondition === 'Poor') prepRate = P.PRODUCTION_RATES.WALLS.PREP_POOR;
	const prepHours = area * prepRate;
	addLineItem(ctx, `${room.label} - Wall Prep (${room.wallCondition})`, prepHours, `${Math.round(area)} sqft @ ${prepRate * 100} hrs/100sqft`);

	// 4. Color Change Surcharge
	if (isDarkToLight) {
		const surchargeHours = area * P.PRODUCTION_RATES.WALLS.DARK_TO_LIGHT_SURCHARGE;
		addLineItem(ctx, `${room.label} - Dark-to-Light Surcharge`, surchargeHours, `Extra priming/care @ ${P.PRODUCTION_RATES.WALLS.DARK_TO_LIGHT_SURCHARGE * 100} hrs/100sqft`);
		ctx.primerGallons += area / P.MATERIAL_COVERAGE.PRIMER_SQFT_PER_GALLON;
	}

	// 5. Materials (2 coats finish)
	ctx.wallGallons += (area * 2) / P.MATERIAL_COVERAGE.WALL_SQFT_PER_GALLON;
	
	// 6. Defaults (Masking, Electrical)
	const windowMasking = (room.windowCount || 0) * P.DEFAULTS.MASKING_WINDOW;
	if (windowMasking > 0) addLineItem(ctx, `${room.label} - Window Masking`, windowMasking, `${room.windowCount} windows @ 5m/ea`);
	
	const electricalMasking = 4 * P.DEFAULTS.ELECTRICAL_PLATE; // Assuming 4 plates per room as per spec
	addLineItem(ctx, `${room.label} - Electrical Plates`, electricalMasking, `4 plates @ 3m/ea`);
};

/**
 * T006: Ceiling Logic
 */
const calculateCeilingHours = (room: PaintingRoom, ctx: CalculationContext, L: number, W: number, H: number) => {
	if (!room.surfaces.ceiling) return;

	const area = L * W;
	const isPopcorn = room.ceilingTexture === 'Popcorn';
	const rate1 = isPopcorn ? P.PRODUCTION_RATES.CEILINGS.POPCORN_1ST_COAT : P.PRODUCTION_RATES.CEILINGS.SMOOTH_1ST_COAT;
	const rate2 = isPopcorn ? P.PRODUCTION_RATES.CEILINGS.POPCORN_2ND_COAT : P.PRODUCTION_RATES.CEILINGS.SMOOTH_2ND_COAT;

	let hHours = (area / rate1) + (area / rate2);
	
	// Height Multiplier
	let multiplier = P.MULTIPLIERS.CEILING_HEIGHT.STANDARD;
	if (H >= 10 && H < 12) multiplier = P.MULTIPLIERS.CEILING_HEIGHT.MID;
	else if (H >= 12 && H < 18) multiplier = P.MULTIPLIERS.CEILING_HEIGHT.HIGH;
	else if (H >= 18) multiplier = P.MULTIPLIERS.CEILING_HEIGHT.VAULTED;

	const totalCeilingHours = hHours * multiplier;
	addLineItem(ctx, `${room.label} - Ceiling Painting`, totalCeilingHours, `${Math.round(area)} sqft (${room.ceilingTexture}) x ${multiplier} height factor`);

	// Fixture Masking
	addLineItem(ctx, `${room.label} - Ceiling Fixture Masking`, P.DEFAULTS.MASKING_FIXTURE, `1 fixture @ 5m`);

	ctx.ceilingGallons += (area * 2) / P.MATERIAL_COVERAGE.CEILING_SQFT_PER_GALLON;
};

/**
 * T007: Trim, Doors, Windows Logic
 */
const calculateTrimHours = (room: PaintingRoom, ctx: CalculationContext, L: number, W: number) => {
	const perimeter = 2 * (L + W);

	// 1. Baseboards
	if (room.surfaces.trim) {
		let trimHours = perimeter / P.PRODUCTION_RATES.TRIM.BASEBOARD;
		
		// F-026: Stairwell 1.5x Difficulty Multiplier for Trim
		if (room.type === 'stairwell') {
			trimHours *= 1.5;
		}

		if (room.trimCondition === 'Poor') {
			const caulkingHours = perimeter * P.PRODUCTION_RATES.TRIM.CAULKING_POOR;
			addLineItem(ctx, `${room.label} - Trim Caulking (Poor)`, caulkingHours, `${Math.round(perimeter)} lf @ 0.025 hrs/lf`);
		}
		if (room.trimConversion) {
			trimHours *= P.MULTIPLIERS.STAIN_TO_PAINT;
			addLineItem(ctx, `${room.label} - Trim (Stained-to-Painted)`, trimHours, `${Math.round(perimeter)} lf @ 60lf/hr x 3.0x multiplier`);
		} else {
			// Add detail about stairwell multiplier if applicable
			const details = room.type === 'stairwell' 
				? `${Math.round(perimeter)} lf @ 60lf/hr x 1.5x (Stairwell)` 
				: `${Math.round(perimeter)} lf @ 60lf/hr`;
			addLineItem(ctx, `${room.label} - Trim`, trimHours, details);
		}
		ctx.trimGallons += perimeter / P.MATERIAL_COVERAGE.TRIM_LF_PER_GALLON;
	}

	// 2. Crown Molding
	if (room.surfaces.crownMolding) {
		const rate = room.crownMoldingStyle === 'Detailed' ? P.PRODUCTION_RATES.TRIM.CROWN_DETAILED : P.PRODUCTION_RATES.TRIM.CROWN_SIMPLE;
		const crownHours = perimeter / rate;
		addLineItem(ctx, `${room.label} - Crown Molding (${room.crownMoldingStyle})`, crownHours, `${Math.round(perimeter)} lf @ ${rate} lf/hr`);
		ctx.trimGallons += perimeter / P.MATERIAL_COVERAGE.TRIM_LF_PER_GALLON;
	}

	// 3. Doors
	if (room.surfaces.doors) {
		const count = parseInt(room.doorCount) || 0;
		const rate = room.doorStyle === 'Paneled' ? P.PRODUCTION_RATES.STAIRS.SPINDLE_SQUARE : 0.75; // Using 0.75 for slab as fallback or defined elsewhere
		// Wait, spec F-007 says "Fixed time per Slab/Paneled door". Let's look at rates-reference.md or masterRates.ts
		// T003 migration should have handled this. Let's check masterRates.ts again for door rates.
		// Actually, let's use the values from the previous version of paintingService or constants if missing.
		// Previous code used 0.75 for Slab and 1.25 for Paneled.
		const doorRate = room.doorStyle === 'Paneled' ? 1.25 : 0.75; 
		const doorHours = count * doorRate;
		addLineItem(ctx, `${room.label} - Doors`, doorHours, `${count} ${room.doorStyle} doors @ ${doorRate} hrs/ea`);
		ctx.trimGallons += count * 0.15; // Typical door gallons
	}

	// 4. Windows
	if (room.surfaces.windows) {
		const count = room.windowCount || 0;
		const windowRate = 0.5; // From previous code/multipliers
		const windowHours = count * windowRate;
		addLineItem(ctx, `${room.label} - Window Frames`, windowHours, `${count} windows @ ${windowRate} hrs/ea`);
		ctx.trimGallons += count * 0.1; // Typical window gallons
	}
};

/**
 * T008: Stairwells Logic
 */
const calculateStairwellHours = (room: PaintingRoom, ctx: CalculationContext) => {
	if (room.type !== 'stairwell') return;

	// Spindles
	if (room.stairSpindles && room.stairSpindles > 0) {
		const rate = room.stairSpindleType === 'Intricate' ? P.PRODUCTION_RATES.STAIRS.SPINDLE_INTRICATE : P.PRODUCTION_RATES.STAIRS.SPINDLE_SQUARE;
		const spindleHours = room.stairSpindles * rate;
		addLineItem(ctx, `${room.label} - Spindles (${room.stairSpindleType})`, spindleHours, `${room.stairSpindles} @ ${rate} hrs/ea`);
	}

	// Handrails
	if (room.stairHandrail && room.stairHandrail > 0) {
		const handrailHours = room.stairHandrail / P.PRODUCTION_RATES.STAIRS.HANDRAIL;
		addLineItem(ctx, `${room.label} - Handrails`, handrailHours, `${room.stairHandrail} lf @ ${P.PRODUCTION_RATES.STAIRS.HANDRAIL} lf/hr`);
	}

	// Steps
	if (room.stairSteps && room.stairSteps > 0) {
		const stepHours = room.stairSteps * P.PRODUCTION_RATES.STAIRS.STEP;
		addLineItem(ctx, `${room.label} - Steps (Risers/Stringers)`, stepHours, `${room.stairSteps} steps @ ${P.PRODUCTION_RATES.STAIRS.STEP} hrs/ea`);
	}
};

/**
 * T010: Main Estimation Function
 */
export const calculatePaintingEstimate = async (data: any) => {
	const ctx: CalculationContext = {
		totalHours: 0,
		totalCost: 0,
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
			const rawHeight = room.ceilingHeight;
			H = rawHeight === '11ft+' ? 12 : parseInt(rawHeight) || 8;
		}

		// Surface calculations
		calculateWallHours(room, ctx, L, W, H);
		calculateCeilingHours(room, ctx, L, W, H);
		calculateTrimHours(room, ctx, L, W);
		calculateStairwellHours(room, ctx);

		// Bedroom Closets
		if (room.type === 'bedroom' && room.closetSize && room.closetSize !== 'None') {
			const closetHours = P.FIXED_ITEMS[`CLOSET_${room.closetSize.toUpperCase()}` as keyof typeof P.FIXED_ITEMS] || 0;
			addLineItem(ctx, `${room.label} - Closet (${room.closetSize})`, closetHours, `Fixed rate for ${room.closetSize} closet`);
			ctx.wallGallons += room.closetSize === 'Standard' ? 0.5 : 1.0;
		}

		// Floor Protection
		const floorArea = L * W;
		const protectionHours = (floorArea / 100) * P.DEFAULTS.FLOOR_PROTECTION * 100; // 15 mins per 100 sqft
		addLineItem(ctx, `${room.label} - Floor Protection`, protectionHours / 60, `${Math.round(floorArea)} sqft @ 15m/100sqft`);
	});

	// Apply Occupancy Multiplier to LABOR hours (T016)
	if (occupancyMultiplier !== 1.0) {
		const adjustment = ctx.totalHours * (occupancyMultiplier - 1);
		ctx.totalHours += adjustment;
		ctx.totalCost += adjustment * P.LABOR_RATE;
		// Update details of last item or add a new one? Let's add an occupancy line item.
		ctx.items.push({
			name: `Occupancy Factor (${data.occupancy})`,
			hours: parseFloat(adjustment.toFixed(2)),
			cost: Math.round(adjustment * P.LABOR_RATE),
			details: `${occupancyMultiplier}x multiplier applied to total labor`,
		});
	}

	// T009: Global Add-ons (Workday logic, Daily Trip)
	const totalDays = Math.ceil(ctx.totalHours / 8);
	const tripHours = totalDays * P.DAILY_TRIP_HOURS;
	addLineItem(ctx, 'Daily Trip & Setup', tripHours, `${totalDays} days @ 45m/day`);

	// T009: Equipment Rental
	const hasHighCeilings = data.rooms.some((r: any) => {
		const h = r.exactHeight || (r.ceilingHeight === '11ft+' ? 12 : parseInt(r.ceilingHeight) || 8);
		return h >= 12;
	});
	if (hasHighCeilings) {
		const rentalCost = totalDays * P.EQUIPMENT_RENTAL_DAILY;
		ctx.totalCost += rentalCost;
		ctx.items.push({
			name: 'High-Reach Equipment Rental',
			hours: 0,
			cost: rentalCost,
			details: `${totalDays} days @ $${P.EQUIPMENT_RENTAL_DAILY}/day`,
		});
	}

	// Material Supply Logic
	const isCustomerProviding = data.paintProvider === 'Customer';
	const totalGallons = ctx.wallGallons + ctx.ceilingGallons + ctx.trimGallons + ctx.primerGallons;

	if (totalGallons > 0) {
		let materialCost = 0;
		if (!isCustomerProviding) {
			const gallonPrice = data.paintProvider === 'Premium' ? 75 : 50; // Using standard/premium prices
			materialCost = totalGallons * gallonPrice;
		}

		ctx.items.push({
			name: 'Material Supply Package',
			hours: 0,
			cost: Math.round(materialCost),
			details: `${totalGallons.toFixed(1)} gal (${isCustomerProviding ? 'Customer Provided' : data.paintProvider})`,
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
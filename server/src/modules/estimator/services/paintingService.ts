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
	
	// Determine Coat Counts based on Phase 3 Logic
	let finishCoats = 2;
	let primerCoats = 0;

	if (room.colorChange === 'Similar') {
		finishCoats = 1;
	} else if (room.colorChange === 'Dark-to-Light') {
		finishCoats = 2;
		primerCoats = 1;
	} else { // 'Change'
		finishCoats = 2;
	}

	// 1. Priming (Labor & Materials)
	if (primerCoats > 0) {
		const primingHours = area / P.PRODUCTION_RATES.WALLS.ROLL_PRIME;
		addLineItem(ctx, `${room.label} - Wall Priming`, primingHours, `${Math.round(area)} sqft @ ${P.PRODUCTION_RATES.WALLS.ROLL_PRIME} sqft/hr`);
		
		const surchargeHours = area * P.PRODUCTION_RATES.WALLS.DARK_TO_LIGHT_SURCHARGE;
		addLineItem(ctx, `${room.label} - Dark-to-Light Surcharge`, surchargeHours, `Extra care @ ${P.PRODUCTION_RATES.WALLS.DARK_TO_LIGHT_SURCHARGE * 100} hrs/100sqft`);
		
		ctx.primerGallons += (area / P.MATERIAL_COVERAGE.PRIMER_SQFT_PER_GALLON);
	}

	// 2. Rolling (Dynamic Coats)
	const roll1Hours = area / P.PRODUCTION_RATES.WALLS.ROLL_1ST_COAT;
	addLineItem(ctx, `${room.label} - Wall Rolling (1st Coat)`, roll1Hours, `${Math.round(area)} sqft @ ${P.PRODUCTION_RATES.WALLS.ROLL_1ST_COAT} sqft/hr`);

	if (finishCoats >= 2) {
		const roll2Hours = area / P.PRODUCTION_RATES.WALLS.ROLL_2ND_COAT;
		addLineItem(ctx, `${room.label} - Wall Rolling (2nd Coat)`, roll2Hours, `${Math.round(area)} sqft @ ${P.PRODUCTION_RATES.WALLS.ROLL_2ND_COAT} sqft/hr`);
	}

	// 3. Cutting (Dynamic Coats)
	let cutRate1, cutRate2;
	if (room.colorChange === 'Dark-to-Light') {
		cutRate1 = P.PRODUCTION_RATES.WALLS.CUT_HIGH_CONTRAST_1ST;
		cutRate2 = P.PRODUCTION_RATES.WALLS.CUT_HIGH_CONTRAST_2ND;
	} else {
		cutRate1 = P.PRODUCTION_RATES.WALLS.CUT_STANDARD_1ST;
		cutRate2 = P.PRODUCTION_RATES.WALLS.CUT_STANDARD_2ND;
	}

	// Phase 1 Fix: Detailed Cutting Load
	const horizontalPerimeterLF = perimeter; // One full trip around the room
	const verticalCornersLF = H * 4;
	const openingCuttingLF = 33; // 18' Door + 15' Window (Standard Opening Load)

	/**
	 * CALCULATION STRATEGY:
	 * - Top/Bottom Edges: 2x Perimeter @ Hi-Contrast Rates (Sharp lines required for ceiling/baseboard)
	 * - Vertical Corners: 4x Height @ Standard Rates (Standard corners)
	 * - Openings: 33 LF @ Standard Rates
	 */
	
	// 1st Coat Labor
	let cut1Hours = (verticalCornersLF / P.PRODUCTION_RATES.WALLS.CUT_STANDARD_1ST) + 
					(openingCuttingLF / P.PRODUCTION_RATES.WALLS.CUT_STANDARD_1ST) +
					((horizontalPerimeterLF * 2) / P.PRODUCTION_RATES.WALLS.CUT_HIGH_CONTRAST_1ST);

	let totalCuttingHours = cut1Hours;
	const totalLF = (horizontalPerimeterLF * 2) + verticalCornersLF + openingCuttingLF;
	let cutDetails = `${Math.round(totalLF)} lf (incl. 2x perim + corners/openings) @ mixed rates`;

	if (finishCoats >= 2) {
		// 2nd Coat Labor
		let cut2Hours = (verticalCornersLF / P.PRODUCTION_RATES.WALLS.CUT_STANDARD_2ND) + 
						(openingCuttingLF / P.PRODUCTION_RATES.WALLS.CUT_STANDARD_2ND) +
						((horizontalPerimeterLF * 2) / P.PRODUCTION_RATES.WALLS.CUT_HIGH_CONTRAST_2ND);
		
		totalCuttingHours += cut2Hours;
		cutDetails = `${Math.round(totalLF)} lf (incl. 2x perim + corners/openings) @ mixed rates (2 coats)`;
	}

	addLineItem(ctx, `${room.label} - Wall Cutting`, totalCuttingHours, cutDetails);

	// 4. Prep
	let prepRate = 0;
	if (room.wallCondition === 'Good') prepRate = P.PRODUCTION_RATES.WALLS.PREP_GOOD;
	if (room.wallCondition === 'Fair') prepRate = P.PRODUCTION_RATES.WALLS.PREP_FAIR;
	if (room.wallCondition === 'Poor') prepRate = P.PRODUCTION_RATES.WALLS.PREP_POOR;
	
	if (prepRate > 0) {
		const prepHours = area * prepRate;
		addLineItem(ctx, `${room.label} - Wall Prep (${room.wallCondition})`, prepHours, `${Math.round(area)} sqft @ ${prepRate * 100} hrs/100sqft`);
	}

	// 5. Materials (Finish Coats)
	const finishGallons = (area / P.MATERIAL_COVERAGE.WALL_CEILING_SQFT_PER_GALLON) * finishCoats;
	ctx.wallGallons += finishGallons;
	
	ctx.items.push({
		name: `${room.label} - Wall Paint Requirement`,
		hours: 0,
		cost: 0,
		details: `${finishGallons.toFixed(2)} gallons finish paint (${finishCoats} coats)`
	});

	// 6. Defaults (Masking, Electrical)
	const windowMasking = (room.windowCount || 0) * P.DEFAULTS.MASKING_WINDOW;
	if (windowMasking > 0) addLineItem(ctx, `${room.label} - Window Masking`, windowMasking, `${room.windowCount} windows @ 5m/ea`);
	
	const electricalMasking = 4 * P.DEFAULTS.ELECTRICAL_PLATE; // Assuming 4 plates per room as per spec
	addLineItem(ctx, `${room.label} - Electrical Plates`, electricalMasking, `4 plates @ 3m/ea`);
};
};

/**
 * T006: Ceiling Logic
 */
const calculateCeilingHours = (room: PaintingRoom, ctx: CalculationContext, L: number, W: number, H: number) => {
	if (!room.surfaces.ceiling) return;

	const area = L * W;
	let rate1, rate2;

	if (room.ceilingTexture === 'Popcorn') {
		rate1 = P.PRODUCTION_RATES.CEILINGS.POPCORN_1ST_COAT;
		rate2 = P.PRODUCTION_RATES.CEILINGS.POPCORN_2ND_COAT;
	} else if (room.ceilingTexture === 'Textured') {
		rate1 = P.PRODUCTION_RATES.CEILINGS.ORANGE_PEEL_KNOCKDOWN_1ST_COAT;
		rate2 = P.PRODUCTION_RATES.CEILINGS.ORANGE_PEEL_KNOCKDOWN_2ND_COAT;
	} else { // Flat/Smooth
		rate1 = P.PRODUCTION_RATES.CEILINGS.SMOOTH_1ST_COAT;
		rate2 = P.PRODUCTION_RATES.CEILINGS.SMOOTH_2ND_COAT;
	}

	// Coat Logic (Phase 3)
	let finishCoats = 2;
	if (room.colorChange === 'Similar') {
		finishCoats = 1;
	}

	let hHours = area / rate1;
	let ceilingDetails = `${Math.round(area)} sqft (${room.ceilingTexture}) 1st Coat`;

	if (finishCoats >= 2) {
		hHours += (area / rate2);
		ceilingDetails = `${Math.round(area)} sqft (${room.ceilingTexture}) 2 Coats`;
	}
	
	// Height Multiplier
	let multiplier = P.MULTIPLIERS.CEILING_HEIGHT.STANDARD;
	if (H >= 10 && H < 12) multiplier = P.MULTIPLIERS.CEILING_HEIGHT.MID;
	else if (H >= 12 && H < 15) multiplier = P.MULTIPLIERS.CEILING_HEIGHT.HIGH;
	else if (H >= 15) multiplier = P.MULTIPLIERS.CEILING_HEIGHT.VAULTED;

	const totalCeilingHours = hHours * multiplier;
	addLineItem(ctx, `${room.label} - Ceiling Painting`, totalCeilingHours, `${ceilingDetails} x ${multiplier} height factor`);

	// Fixture Masking
	addLineItem(ctx, `${room.label} - Ceiling Fixture Masking`, P.DEFAULTS.MASKING_FIXTURE, `1 fixture @ 5m`);

	const ceilingFinishGallons = (area / P.MATERIAL_COVERAGE.WALL_CEILING_SQFT_PER_GALLON) * finishCoats;
	ctx.ceilingGallons += ceilingFinishGallons;

	ctx.items.push({
		name: `${room.label} - Ceiling Paint Requirement`,
		hours: 0,
		cost: 0,
		details: `${ceilingFinishGallons.toFixed(2)} gallons ceiling paint (${finishCoats} coats)`
	});
};

/**
 * T007: Trim, Doors, Windows Logic
 */
const calculateTrimHours = (room: PaintingRoom, ctx: CalculationContext, L: number, W: number) => {
	const perimeter = 2 * (L + W);

	// Coat Logic (Phase 7)
	let finishCoats = 2;
	if (room.colorChange === 'Similar') {
		finishCoats = 1;
	}

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
			
			// Primer for Stain-to-Paint (Phase 7)
			const primerReq = (perimeter / P.MATERIAL_COVERAGE.TRIM_PRIMER_LF_PER_GALLON);
			ctx.primerGallons += primerReq;
			ctx.items.push({
				name: `${room.label} - Trim Conversion Primer`,
				hours: 0,
				cost: 0,
				details: `${primerReq.toFixed(2)} gallons stain-blocking primer`
			});
		} else {
			// Add detail about stairwell multiplier if applicable
			const details = room.type === 'stairwell' 
				? `${Math.round(perimeter)} lf @ 60lf/hr x 1.5x (Stairwell)` 
				: `${Math.round(perimeter)} lf @ 60lf/hr`;
			addLineItem(ctx, `${room.label} - Trim`, trimHours, details);
		}
		
		const trimFinishGallons = (perimeter / P.MATERIAL_COVERAGE.TRIM_LF_PER_GALLON) * finishCoats;
		ctx.trimGallons += trimFinishGallons;

		ctx.items.push({
			name: `${room.label} - Trim Paint Requirement`,
			hours: 0,
			cost: 0,
			details: `${trimFinishGallons.toFixed(2)} gallons trim paint (${finishCoats} coats)`
		});
	}

	// 2. Crown Molding
	if (room.surfaces.crownMolding) {
		const rate = room.crownMoldingStyle === 'Detailed' ? P.PRODUCTION_RATES.TRIM.CROWN_DETAILED : P.PRODUCTION_RATES.TRIM.CROWN_SIMPLE;
		const crownHours = perimeter / rate;
		addLineItem(ctx, `${room.label} - Crown Molding (${room.crownMoldingStyle})`, crownHours, `${Math.round(perimeter)} lf @ ${rate} lf/hr`);
		
		const crownFinishGallons = (perimeter / P.MATERIAL_COVERAGE.TRIM_LF_PER_GALLON) * finishCoats;
		ctx.trimGallons += crownFinishGallons;

		ctx.items.push({
			name: `${room.label} - Crown Paint Requirement`,
			hours: 0,
			cost: 0,
			details: `${crownFinishGallons.toFixed(2)} gallons trim paint (${finishCoats} coats)`
		});
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
		const detailHours = doorHoursPerSide * 2; // For displaying in details

		addLineItem(ctx, `${room.label} - Doors`, totalDoorHours, `${count} ${room.doorStyle} doors @ ${detailHours.toFixed(2)} hrs/ea (both sides)`);
		
		// 1 Gallon paints 8 Doors (both sides, 1 coat).
		const doorFinishGallons = (count / P.MATERIAL_COVERAGE.DOORS_PER_GALLON) * finishCoats;
		ctx.trimGallons += doorFinishGallons;

		ctx.items.push({
			name: `${room.label} - Door Paint Requirement`,
			hours: 0,
			cost: 0,
			details: `${doorFinishGallons.toFixed(2)} gallons trim paint (${count} ${room.doorStyle} doors)`
		});
	}

	// 4. Windows
	if (room.surfaces.windows) {
		const count = room.windowCount || 0;
		const windowHours = count * P.FIXED_ITEMS.WINDOW_STANDARD_CASING;
		addLineItem(ctx, `${room.label} - Window Frames`, windowHours, `${count} windows @ ${P.FIXED_ITEMS.WINDOW_STANDARD_CASING.toFixed(2)} hrs/ea`);
		
		// 1 Quart paints 3 Windows (1 coat). 1 Gallon = 12 Windows.
		const windowFinishGallons = (count / P.MATERIAL_COVERAGE.WINDOWS_PER_GALLON) * finishCoats;
		ctx.trimGallons += windowFinishGallons;

		ctx.items.push({
			name: `${room.label} - Window Paint Requirement`,
			hours: 0,
			cost: 0,
			details: `${windowFinishGallons.toFixed(2)} gallons trim paint (${count} windows)`
		});
	}
};
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
			const closetHours = P.FIXED_ITEMS[`CLOSET_${room.closetSize.toUpperCase()}` as keyof typeof P.FIXED_ITEMS] || 0;
			addLineItem(ctx, `${room.label} - Closet (${room.closetSize})`, closetHours, `Fixed rate for ${room.closetSize} closet`);
			ctx.wallGallons += room.closetSize === 'Standard' ? 0.5 : 1.0;
		}

		// Floor Protection
		const floorArea = L * W;
		const protectionHours = (floorArea / 100) * P.DEFAULTS.FLOOR_PROTECTION * 100; // 15 mins per 100 sqft
		addLineItem(ctx, `${room.label} - Floor Protection`, protectionHours / 60, `${Math.round(floorArea)} sqft @ 15m/100sqft`);

		// Misc Material Fee
		ctx.totalCost += P.MISC_MATERIAL_FEE_PER_ROOM;
		ctx.items.push({
			name: `${room.label} - Misc Supplies`,
			hours: 0,
			cost: P.MISC_MATERIAL_FEE_PER_ROOM,
			details: 'Spackle, tape, sandpaper, etc.'
		});
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
	// Scan the breakdown items or check room heights from the data
	// Let's re-calculate H logic for the check or pass it through
	const hasHighCeilings = data.rooms.some((room: any) => {
		if (room.exactHeight && room.exactHeight >= 12) return true;
		const hMap: Record<string, number> = { '11-14ft': 12, '15ft+': 18 };
		const h = hMap[room.ceilingHeight] || parseInt(room.ceilingHeight) || 8;
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
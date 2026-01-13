import { generateServiceBreakdown } from '../utils/breakdownHelper.js';
import {
	ROOM_DIMENSIONS,
	PAINT_PRICES,
	LABOR_MULTIPLIERS,
	PAINT_COVERAGE, // Added this import
} from '../constants/paintingConstants.js';

export const calculatePaintingEstimate = async (data: any) => {
	let totalCost = 0;
	let totalHours = 0;
	const items: any[] = [];

	// Paint Tally (Gallons) - We track these separately to round up correctly at the end
	let wallGallons = 0;
	let ceilingGallons = 0;
	let trimGallons = 0;
	let primerGallons = 0;

	// 0. Project Setup (Dynamic: based on constant multiplier)
	const isContractorMoving = data.furniture === 'Contractor';
	const numRooms = data.rooms.length;

	if (isContractorMoving) {
		// Scenario A: Contractor handles furniture (45 mins + $35 fee per room)
		const furnitureHours =
			numRooms * LABOR_MULTIPLIERS.FURNITURE_HANDLING_PER_ROOM;
		const furnitureFee =
			numRooms * PAINT_PRICES.SURCHARGES.FURNITURE_HANDLING_FLAT;

		items.push({
			name: 'Furniture Handling & Protection',
			cost: furnitureFee,
			hours: furnitureHours,
			details: `${numRooms} spaces (includes setup & prep) @ $${PAINT_PRICES.SURCHARGES.FURNITURE_HANDLING_FLAT}/ea`,
		});

		totalCost += furnitureFee;
		totalHours += furnitureHours;
	} else {
		// Scenario B: Home is Empty or Customer handles furniture (30 mins + $0 per room)
		const setupHours = numRooms * LABOR_MULTIPLIERS.SETUP_PER_ROOM;
		items.push({
			name: 'Project Setup & Prep',
			cost: 0,
			hours: setupHours,
			details: `${numRooms} spaces @ ${LABOR_MULTIPLIERS.SETUP_PER_ROOM} hrs each`,
		});

		totalHours += setupHours;
	}

	data.rooms.forEach((room: any) => {
		const [L, W] = ROOM_DIMENSIONS[room.type]?.[room.size] || [12, 14];
		const h = parseInt(room.ceilingHeight) || 8;
		const perimeter = 2 * (L + W);
		const wallSqft = perimeter * h;
		const ceilingSqft = L * W;

		let roomCost = 0;
		let roomHours = 0;

		// 1. Walls Calculation
		if (room.surfaces?.walls === true) {
			let wallBase = wallSqft * PAINT_PRICES.WALL_BASE_PER_SQFT;
			if (room.wallCondition === 'Fair') {
				wallBase *= 1 + PAINT_PRICES.SURCHARGES.FAIR_CONDITION_PCT;
			}

			const repairFee =
				room.wallCondition === 'Poor'
					? PAINT_PRICES.SURCHARGES.POOR_CONDITION_FLAT
					: 0;
			const currentWallCost = wallBase + repairFee;
			const currentWallHours = wallSqft * LABOR_MULTIPLIERS.WALLS;

			items.push({
				name: `${room.label} - Walls`,
				cost: currentWallCost,
				hours: currentWallHours,
				details: `${wallSqft} sqft @ $${PAINT_PRICES.WALL_BASE_PER_SQFT}/sqft${
					repairFee > 0 ? ` + $${repairFee} repair` : ''
				}`,
			});

			roomCost += currentWallCost;
			roomHours += currentWallHours;

			// Tally Wall Paint (2 coats)
			wallGallons += wallSqft / PAINT_COVERAGE.WALL_SQFT_PER_GALLON;

			// Dark-to-Light Priming Logic
			if (room.colorChange === 'Dark-to-Light') {
				const primingCost =
					wallSqft *
					PAINT_PRICES.WALL_BASE_PER_SQFT *
					PAINT_PRICES.SURCHARGES.COLOR_CHANGE_PRIMER_PCT;
				const primingHours = wallSqft * LABOR_MULTIPLIERS.WALL_PRIMING;
				items.push({
					name: `${room.label} - Wall Priming`,
					cost: primingCost,
					hours: primingHours,
					details: `Color change surcharge`,
				});

				roomCost += primingCost;
				roomHours += primingHours;

				// Tally Primer (1 coat)
				primerGallons += wallSqft / PAINT_COVERAGE.PRIMER_SQFT_PER_GALLON;
			}
		}

		// 2. Ceiling Calculation
		if (room.surfaces?.ceiling === true) {
			let ceilingBase = ceilingSqft * PAINT_PRICES.CEILING_BASE_PER_SQFT;
			if (room.ceilingTexture === 'Textured') {
				ceilingBase +=
					ceilingSqft * PAINT_PRICES.SURCHARGES.TEXTURED_CEILING_ADD;
			}
			if (room.ceilingTexture === 'Popcorn') {
				ceilingBase +=
					ceilingSqft * PAINT_PRICES.SURCHARGES.POPCORN_CEILING_ADD;
			}

			const currentCeilingHours = ceilingSqft * LABOR_MULTIPLIERS.CEILING;

			items.push({
				name: `${room.label} - Ceiling`,
				cost: ceilingBase,
				hours: currentCeilingHours,
				details: `${ceilingSqft} sqft @ $${PAINT_PRICES.CEILING_BASE_PER_SQFT}/sqft`,
			});

			roomCost += ceilingBase;
			roomHours += currentCeilingHours;

			// Tally Ceiling Paint (2 coats)
			ceilingGallons += ceilingSqft / PAINT_COVERAGE.CEILING_SQFT_PER_GALLON;
		}

		// 3. Trim & Crown Calculation
		if (room.surfaces?.trim === true) {
			let trimBase = perimeter * PAINT_PRICES.TRIM_BASE_PER_LF;
			if (room.trimStyle === 'Detailed') {
				trimBase += perimeter * PAINT_PRICES.SURCHARGES.DETAILED_TRIM_ADD;
			}
			if (room.trimCondition === 'Poor') {
				trimBase += perimeter * 0.5; // Caulking fee
			}

			const currentTrimHours = perimeter * LABOR_MULTIPLIERS.TRIM;

			items.push({
				name: `${room.label} - Trim`,
				cost: trimBase,
				hours: currentTrimHours,
				details: `${perimeter} linear ft @ $${PAINT_PRICES.TRIM_BASE_PER_LF}/lf`,
			});

			roomCost += trimBase;
			roomHours += currentTrimHours;

			trimGallons += perimeter / PAINT_COVERAGE.TRIM_LF_PER_GALLON;
		}

		if (room.surfaces?.crownMolding === true) {
			const crownBase = perimeter * PAINT_PRICES.CROWN_BASE_PER_LF;
			const currentCrownHours = perimeter * LABOR_MULTIPLIERS.CROWN;

			items.push({
				name: `${room.label} - Crown Molding`,
				cost: crownBase,
				hours: currentCrownHours,
				details: `${perimeter} linear ft @ $${PAINT_PRICES.CROWN_BASE_PER_LF}/lf`,
			});

			roomCost += crownBase;
			roomHours += currentCrownHours;

			trimGallons += perimeter / PAINT_COVERAGE.TRIM_LF_PER_GALLON;
		}

		// 4. Doors Calculation
		if (room.surfaces?.doors === true) {
			const doorCount = parseInt(room.doorCount) || 1;
			const isPaneled = room.doorStyle === 'Paneled';

			const doorUnitPrice = isPaneled
				? PAINT_PRICES.DOOR_PANELED
				: PAINT_PRICES.DOOR_SLAB;
			const doorUnitHours = isPaneled
				? LABOR_MULTIPLIERS.DOOR_PANELED
				: LABOR_MULTIPLIERS.DOOR_SLAB;

			const currentDoorCost = doorCount * doorUnitPrice;
			const currentDoorHours = doorCount * doorUnitHours;

			items.push({
				name: `${room.label} - Doors`,
				cost: currentDoorCost,
				hours: currentDoorHours,
				details: `${doorCount} ${room.doorStyle} doors @ $${doorUnitPrice}/ea`,
			});

			roomCost += currentDoorCost;
			roomHours += currentDoorHours;

			trimGallons += doorCount * PAINT_COVERAGE.DOOR_GALLONS;
		}

		// 5. Windows Calculation
		if (room.surfaces?.windows === true) {
			const windowCount = parseInt(room.windowCount) || 1; // Standardized default to 1
			const currentWindowCost = windowCount * PAINT_PRICES.WINDOW_FRAME;
			const currentWindowHours = windowCount * LABOR_MULTIPLIERS.WINDOW;

			items.push({
				name: `${room.label} - Windows`,
				cost: currentWindowCost,
				hours: currentWindowHours,
				details: `${windowCount} window frames @ $${PAINT_PRICES.WINDOW_FRAME}/ea`,
			});

			roomCost += currentWindowCost;
			roomHours += currentWindowHours;

			trimGallons += windowCount * PAINT_COVERAGE.WINDOW_GALLONS;
		}

		// 6. Bedroom Closet Calculation
		if (room.type === 'bedroom' && room.closetSize !== 'None') {
			const closetCost =
				PAINT_PRICES.CLOSET[
					room.closetSize as keyof typeof PAINT_PRICES.CLOSET
				] || 0;
			const closetHours =
				LABOR_MULTIPLIERS.CLOSET[
					room.closetSize as keyof typeof LABOR_MULTIPLIERS.CLOSET
				] || 0;

			items.push({
				name: `${room.label} - Closet`,
				cost: closetCost,
				hours: closetHours,
				details: `${room.closetSize} closet`,
			});
			roomCost += closetCost;
			roomHours += closetHours;

			// Approximate gallons for closets (Wall paint)
			wallGallons += room.closetSize === 'Standard' ? 0.5 : 1;
		}

		totalCost += roomCost;
		totalHours += roomHours;
	});

	// 7. Material Supply Logic
	const isCustomerProviding = data.paintProvider === 'Customer';

	// Calculate quantities regardless so we can show the user how much they need to buy
	const wallQty = Math.round(wallGallons * 10) / 10;
	const ceilQty = Math.round(ceilingGallons * 10) / 10;
	const trimQty = Math.round(trimGallons * 10) / 10;
	const primeQty = Math.round(primerGallons * 10) / 10;

	const totalGallons = wallQty + ceilQty + trimQty + primeQty;

	if (totalGallons > 0) {
		let materialCost = 0;
		let statusLabel = 'Customer Provided';

		// Only calculate cost if Ray's Pro Finish is providing the paint
		if (!isCustomerProviding) {
			const gallonPrice =
				data.paintProvider === 'Premium'
					? PAINT_PRICES.SUPPLY.PREMIUM_GALLON
					: PAINT_PRICES.SUPPLY.STANDARD_GALLON;

			materialCost = totalGallons * gallonPrice;
			statusLabel = `${data.paintProvider} Quality`;
		}

		items.push({
			name: 'Paint Supply Package',
			cost: materialCost,
			hours: 0,
			details: `${totalGallons} total gallons (${statusLabel})`,
		});

		// Breakdown of specific buckets needed for transparency
		let breakdownDetails = `Walls: ${wallQty}g`;
		if (ceilQty > 0) breakdownDetails += `, Ceiling: ${ceilQty}g`;
		if (trimQty > 0) breakdownDetails += `, Trim/Doors: ${trimQty}g`;
		if (primeQty > 0) breakdownDetails += `, Primer: ${primeQty}g`;

		items.push({
			name: 'Gallon Breakdown',
			cost: 0,
			hours: 0,
			details: breakdownDetails,
		});

		totalCost += materialCost;
	}

	const explanation = generateServiceBreakdown(
		'Painting',
		items,
		totalCost,
		totalHours
	);

	return {
		low: Math.round(totalCost),
		high: Math.round(totalCost * 1.1),
		totalHours: parseFloat(totalHours.toFixed(1)),
		explanation: explanation,
		breakdownItems: items,
	};
};

import { generateServiceBreakdown } from '../utils/breakdownHelper.js';
import {
	ROOM_DIMENSIONS,
	PAINT_PRICES,
	LABOR_MULTIPLIERS,
} from '../constants/paintingConstants.js';

export const calculatePaintingEstimate = async (data: any) => {
	let totalCost = 0;
	let totalHours = 0;
	const items: any[] = [];

	// 0. Project Setup (Dynamic: based on constant multiplier)
	const setupHours = data.rooms.length * LABOR_MULTIPLIERS.SETUP_PER_ROOM;
	items.push({
		name: 'Project Setup & Prep',
		cost: 0,
		hours: setupHours,
		details: `${data.rooms.length} spaces @ ${LABOR_MULTIPLIERS.SETUP_PER_ROOM} hrs each`,
	});
	totalHours += setupHours;

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
		}

		// 5. Windows Calculation
		if (room.surfaces?.windows === true) {
			const windowCount = parseInt(room.windowCount) || 0;
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
		}

		totalCost += roomCost;
		totalHours += roomHours;
	});

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

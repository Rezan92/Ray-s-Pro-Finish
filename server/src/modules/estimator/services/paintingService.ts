import { generateServiceBreakdown } from '../utils/breakdownHelper.js';

const ROOM_DIMENSIONS: Record<string, Record<string, number[]>> = {
	bedroom: {
		Small: [10, 10],
		Medium: [12, 14],
		Large: [15, 16],
		'X-Large': [18, 18],
	},
	livingRoom: {
		Small: [12, 15],
		Medium: [15, 18],
		Large: [18, 22],
		'X-Large': [20, 25],
	},
	diningRoom: {
		Small: [9, 10],
		Medium: [11, 13],
		Large: [12, 16],
		'X-Large': [14, 18],
	},
	kitchen: {
		Small: [10, 10],
		Medium: [12, 14],
		Large: [15, 15],
		'X-Large': [18, 20],
	},
	bathroom: {
		Small: [5, 5],
		Medium: [5, 8],
		Large: [10, 12],
		'X-Large': [12, 15],
	},
	office: {
		Small: [8, 8],
		Medium: [10, 10],
		Large: [12, 12],
		'X-Large': [12, 15],
	},
	basement: {
		Small: [15, 20],
		Medium: [20, 30],
		Large: [25, 40],
		'X-Large': [30, 50],
	},
	laundryRoom: {
		Small: [6, 4],
		Medium: [6, 8],
		Large: [8, 10],
		'X-Large': [10, 12],
	},
	closet: {
		Small: [2, 4],
		Medium: [5, 5],
		Large: [6, 10],
		'X-Large': [10, 10],
	},
	hallway: {
		Small: [3, 6],
		Medium: [3, 12],
		Large: [4, 15],
		'X-Large': [5, 20],
	},
	stairwell: {
		Small: [3, 10],
		Medium: [4, 12],
		Large: [6, 15],
		'X-Large': [8, 20],
	},
	garage: {
		Small: [12, 20],
		Medium: [22, 22],
		Large: [22, 32],
		'X-Large': [24, 40],
	},
	other: {
		Small: [8, 8],
		Medium: [10, 10],
		Large: [12, 12],
		'X-Large': [15, 20],
	},
};

export const calculatePaintingEstimate = async (data: any) => {
	let totalCost = 0;
	let totalHours = 0;
	const items: any[] = [];

	// 0. Project Setup (Dynamic: 0.5 hours per room)
	const setupHours = data.rooms.length * 0.5;
	items.push({
		name: 'Project Setup & Prep',
		cost: 0,
		hours: setupHours,
		details: `${data.rooms.length} spaces @ 0.5 hrs each`,
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

		// 1. Walls ($1.5/sqft)
		if (room.surfaces?.walls === true) {
			let wallBase = wallSqft * 1.5;
			if (room.wallCondition === 'Fair') wallBase *= 1.1;

			const repairFee = room.wallCondition === 'Poor' ? 150 : 0;
			const currentWallCost = wallBase + repairFee;
			const currentWallHours = wallSqft * 0.0125;

			items.push({
				name: `${room.label} - Walls`,
				cost: currentWallCost,
				hours: currentWallHours,
				details: `${wallSqft} sqft @ $1.50/sqft${
					repairFee > 0 ? ' + $150 repair' : ''
				}`,
			});

			roomCost += currentWallCost;
			roomHours += currentWallHours;

			if (room.colorChange === 'Dark-to-Light') {
				const primingCost = wallSqft * 1.5 * 0.2;
				const primingHours = wallSqft * 0.005;
				items.push({
					name: `${room.label} - Wall Priming`,
					cost: primingCost,
					hours: primingHours,
					details: `Color change: Dark-to-Light surcharge`,
				});

				roomCost += primingCost;
				roomHours += primingHours;
			}
		}

		// 2. Ceiling ($1/sqft)
		if (room.surfaces?.ceiling === true) {
			let ceilingBase = ceilingSqft * 1.0;
			if (room.ceilingTexture === 'Textured') ceilingBase += ceilingSqft * 0.25;
			if (room.ceilingTexture === 'Popcorn') ceilingBase += ceilingSqft * 0.5;

			const currentCeilingHours = ceilingSqft * 0.01;

			items.push({
				name: `${room.label} - Ceiling`,
				cost: ceilingBase,
				hours: currentCeilingHours,
				details: `${ceilingSqft} sqft @ $1.00/sqft`,
			});

			roomCost += ceilingBase;
			roomHours += currentCeilingHours;
		}

		// 3. Trim & Crown
		if (room.surfaces?.trim === true) {
			let trimBase = perimeter * 3.5;
			if (room.trimStyle === 'Detailed') trimBase += perimeter * 1.0;
			if (room.trimCondition === 'Poor') trimBase += perimeter * 0.5;

			const currentTrimHours = perimeter * 0.05;

			items.push({
				name: `${room.label} - Trim`,
				cost: trimBase,
				hours: currentTrimHours,
				details: `${perimeter} linear ft @ $3.50/lf`,
			});

			roomCost += trimBase;
			roomHours += currentTrimHours;
		}

		if (room.surfaces?.crownMolding === true) {
			const crownBase = perimeter * 4.0;
			const currentCrownHours = perimeter * 0.063;

			items.push({
				name: `${room.label} - Crown Molding`,
				cost: crownBase,
				hours: currentCrownHours,
				details: `${perimeter} linear ft @ $4.00/lf`,
			});

			roomCost += crownBase;
			roomHours += currentCrownHours;
		}

		// 4. Doors/Windows
		if (room.surfaces?.doors === true) {
			const doorCount = parseInt(room.doorCount) || 0;
			const doorCost = doorCount * 60;
			items.push({
				name: `${room.label} - Doors`,
				cost: doorCost,
				hours: 0,
				details: `${doorCount} doors @ $60/side`,
			});
			roomCost += doorCost;
		}

		if (room.surfaces?.windows === true) {
			const windowCount = parseInt(room.windowCount) || 0;
			const windowCost = windowCount * 50;
			items.push({
				name: `${room.label} - Windows`,
				cost: windowCost,
				hours: 0,
				details: `${windowCount} window frames @ $50/ea`,
			});
			roomCost += windowCost;
		}

		// 5. Bedroom Closet
		if (room.type === 'bedroom' && room.closetSize !== 'None') {
			const closetCostMap: any = { Standard: 75, Medium: 150, Large: 200 };
			const closetTimeMap: any = { Standard: 1, Medium: 1.5, Large: 2.5 };

			const closetCost = closetCostMap[room.closetSize] || 0;
			const closetHours = closetTimeMap[room.closetSize] || 0;

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

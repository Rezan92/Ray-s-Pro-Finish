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
	let totalHours = 2; // Setup time
	let breakdown = '';

	data.rooms.forEach((room: any) => {
		const [L, W] = ROOM_DIMENSIONS[room.type]?.[room.size] || [12, 14];
		const h = parseInt(room.ceilingHeight) || 8;
		const perimeter = 2 * (L + W);
		const wallSqft = perimeter * h;
		const ceilingSqft = L * W;
		let roomCost = 0;
		let roomHours = 0;

		// 1. Walls ($1.5/sqft)
		if (room.surfaces.walls) {
			let wallBase = wallSqft * 1.5;
			if (room.colorChange === 'Dark-to-Light')
				wallBase += wallSqft * 1.5 * 0.3;
			if (room.wallCondition === 'Fair') wallBase *= 1.1;
			if (room.wallCondition === 'Poor') roomCost += 150;
			roomCost += wallBase;
			roomHours += wallSqft * 0.0125;
		}

		// 2. Ceiling ($1/sqft)
		if (room.surfaces.ceiling) {
			let ceilingBase = ceilingSqft * 1.0;
			if (room.ceilingTexture === 'Textured') ceilingBase += ceilingSqft * 0.25;
			if (room.ceilingTexture === 'Popcorn') ceilingBase += ceilingSqft * 0.5;
			roomCost += ceilingBase;
			roomHours += ceilingSqft * 0.01;
		}

		// 3. Trim & Crown
		if (room.surfaces.trim) {
			let trimBase = perimeter * 3.5;
			if (room.trimStyle === 'Detailed') trimBase += perimeter * 1.0;
			if (room.trimCondition === 'Poor') trimBase += perimeter * 0.5;
			roomCost += trimBase;
			roomHours += perimeter * 0.05;
		}
		if (room.surfaces.crownMolding) {
			roomCost += perimeter * 4.0;
			roomHours += perimeter * 0.063;
		}

		// 4. Doors/Windows
		if (room.surfaces.doors) roomCost += (parseInt(room.doorCount) || 0) * 60;
		roomCost += (room.windowCount || 0) * 50;

		// 5. Bedroom Closet
		if (room.type === 'bedroom' && room.closetSize !== 'None') {
			const closetMap: any = { Standard: 75, Medium: 150, Large: 200 };
			roomCost += closetMap[room.closetSize] || 0;
		}

		totalCost += roomCost;
		totalHours += roomHours;
		breakdown += `${room.label}: $${Math.round(roomCost)} (${roomHours.toFixed(
			1
		)} hrs)\n`;
	});

	return {
		low: Math.round(totalCost),
		high: Math.round(totalCost * 1.1),
		totalHours,
		explanation: breakdown,
	};
};
 
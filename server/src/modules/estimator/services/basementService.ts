import { BASEMENT_CONSTANTS } from '../constants/basementConstants.js';
import { MASTER_RATES, RateDetail } from '../constants/masterRates.js';
import { BasementRequest, RoomDetail } from '../types.js';

interface BreakdownItem {
	name: string;
	cost: number;
	hours: number;
	details: string;
}

export const calculateBasementEstimate = (
	data: BasementRequest,
	isAdmin: boolean = false
) => {
	const {
		sqft,
		ceilingHeight,
		condition,
		// REMOVED: numBedrooms, numBathrooms (Calculated below now)
		rooms = [], // Default to empty array
		hasWetBar,
		services,
		perimeterInsulation,
		soffitWork,
	} = data;

	// --- 1. GEOMETRY ENGINE ---
	const wallHeight = BASEMENT_CONSTANTS.HEIGHT_MAP[ceilingHeight] || 8.0;

	// A. Perimeter
	const perimeterLF = Math.ceil(
		Math.sqrt(sqft) * BASEMENT_CONSTANTS.PERIMETER_MULTIPLIER
	);

	// B. Partitions (The New Loop)
	let partitionLF = 0;
	let bedCount = 0;
	let bathCount = 0;

	// Loop through the rooms array to calculate logic
	rooms.forEach((room) => {
		if (room.type === 'Bedroom') {
			bedCount++;
			if (room.size.includes('Small'))
				partitionLF += BASEMENT_CONSTANTS.LF_ROOMS.BEDROOM_SMALL;
			else if (room.size.includes('Large'))
				partitionLF += BASEMENT_CONSTANTS.LF_ROOMS.BEDROOM_LARGE;
			else partitionLF += BASEMENT_CONSTANTS.LF_ROOMS.BEDROOM_MEDIUM; // Default
		} else if (room.type === 'Bathroom') {
			bathCount++;
			if (room.bathType === 'Full Bath')
				partitionLF += BASEMENT_CONSTANTS.LF_ROOMS.BATH_FULL;
			else partitionLF += BASEMENT_CONSTANTS.LF_ROOMS.BATH_HALF;
		}
	});

	// Add Wet Bar
	if (hasWetBar) partitionLF += BASEMENT_CONSTANTS.LF_ROOMS.WETBAR;

	// C. Soffits
	const workLevel = soffitWork || 'Average';
	const soffitFactor = BASEMENT_CONSTANTS.SOFFIT_FACTORS[workLevel];
	const soffitLF = Math.ceil(perimeterLF * soffitFactor);

	// D. Areas
	const perimeterWallSqft = perimeterLF * wallHeight;
	const partitionWallSqftOneSide = partitionLF * wallHeight;
	const partitionWallSqftTotal = partitionWallSqftOneSide * 2;
	const totalWallSqft = perimeterWallSqft + partitionWallSqftTotal;
	const ceilingSqft = sqft;

	// --- 2. COST CALCULATION ---

	const breakdownItems: BreakdownItem[] = [];
	let totalCost = 0;
	let totalHours = 0;

	// --- HELPER: Cleaner Names & Indentation ---
	const addDetailItem = (
		categoryName: string, // e.g., "Exterior Wall Framing"
		qty: number,
		unit: string,
		rate: RateDetail,
		mathEquation: string
	) => {
		if (qty <= 0) return;

		const laborCost = qty * rate.labor;
		const materialCost = qty * rate.material;
		const hoursPerUnit = rate.hoursPerLinearFoot || rate.hoursPerSqft || 0;
		const laborHours = qty * hoursPerUnit;

		totalCost += laborCost + materialCost;
		totalHours += laborHours;

		// Line 1: Parent (Labor)
		breakdownItems.push({
			name: categoryName,
			cost: laborCost,
			hours: laborHours,
			details: `${mathEquation} * $${rate.labor.toFixed(2)} (Labor)`,
		});

		// Line 2: Child (Materials) - Indented
		breakdownItems.push({
			name: `   ↳ Materials`, // Visual Indentation in Name
			cost: materialCost,
			hours: 0,
			details: `      $${rate.material.toFixed(2)}/${unit} * ${qty} ${unit}`, // Deep indent in details
		});
	};

	// --- SECTION 0: MATH EXPLAINER ---
	breakdownItems.push({
		name: '📐 Dimensions & Math',
		cost: 0,
		hours: 0,
		details: [
			`Floor: ${sqft}sf`,
			`Perimeter: ${perimeterLF} LF (Shell)`,
			`Partitions: ${partitionLF} LF (Calculated from ${rooms.length} Rooms)`,
			`Rooms: ${rooms.map((r) => (r.type === 'Bedroom' ? r.size : r.bathType)).join(', ')}`,
		].join('\n'),
	});

	// --- STEP 1: FRAMING ---
	if (services.framing) {
		if (condition === 'Bare Concrete') {
			addDetailItem(
				'Framing: Exterior Walls', // Cleaner Name
				perimeterLF,
				'LF',
				MASTER_RATES.FRAMING.CONCRETE_FLOOR,
				`${perimeterLF} LF`
			);
		}

		if (partitionLF > 0) {
			addDetailItem(
				'Framing: Interior Rooms', // Cleaner Name
				partitionLF,
				'LF',
				MASTER_RATES.FRAMING.CONCRETE_FLOOR,
				`${partitionLF} LF`
			);
		}

		if (soffitLF > 0) {
			addDetailItem(
				'Framing: Soffits & Bulkheads', // Cleaner Name
				soffitLF,
				'LF',
				MASTER_RATES.FRAMING.CONCRETE_FLOOR,
				`${soffitLF} LF`
			);
		}

		// Headers
		const numOpenings =
			bedCount * BASEMENT_CONSTANTS.OPENINGS.BEDROOM +
			bathCount * BASEMENT_CONSTANTS.OPENINGS.BATHROOM +
			BASEMENT_CONSTANTS.OPENINGS.BASE_EGRESS;

		if (numOpenings > 0) {
			const openRate = MASTER_RATES.FRAMING.OPENING_BUILD;
			const cost = numOpenings * openRate.labor;
			const hrs = numOpenings * (openRate.hoursPerLinearFoot || 1.25);
			totalCost += cost;
			totalHours += hrs;
			breakdownItems.push({
				name: 'Framing: Door/Window Headers',
				cost: cost,
				hours: hrs,
				details: `${numOpenings} units * $${openRate.labor.toFixed(2)}`,
			});
		}
	}

	// --- STEP 2: INSULATION ---
	if (condition === 'Bare Concrete') {
		if (perimeterInsulation === 'Premium (Rigid Foam)') {
			addDetailItem(
				'Insulation: Rigid Foam (XPS)',
				perimeterWallSqft,
				'sf',
				MASTER_RATES.INSULATION.RIGID_FOAM.WALL,
				`${perimeterWallSqft} sf`
			);
		}
		addDetailItem(
			'Insulation: Fiberglass Batts',
			perimeterWallSqft,
			'sf',
			MASTER_RATES.INSULATION.STANDARD.WALL,
			`${perimeterWallSqft} sf`
		);
	}

	// --- STEP 3: DRYWALL ---
	if (services.drywall) {
		const dwRate = MASTER_RATES.DRYWALL_INSTALL.LEVEL_2;

		// Perimeter
		if (condition !== 'Framed & Insulated') {
			addDetailItem(
				'Drywall: Exterior Walls',
				perimeterWallSqft,
				'sf',
				dwRate.WALL,
				`${perimeterWallSqft} sf`
			);
		}

		// Partitions
		if (partitionWallSqftTotal > 0) {
			addDetailItem(
				'Drywall: Interior Rooms',
				partitionWallSqftTotal,
				'sf',
				dwRate.WALL,
				`${partitionWallSqftTotal} sf`
			);
		}

		// Ceiling
		if (services.ceilingFinish === 'Drywall') {
			addDetailItem(
				'Drywall: Ceiling',
				ceilingSqft,
				'sf',
				dwRate.CEILING,
				`${ceilingSqft} sf`
			);
		} else if (services.ceilingFinish === 'Drop Ceiling') {
			addDetailItem(
				'Ceiling System: Grid & Tile',
				ceilingSqft,
				'sf',
				MASTER_RATES.CEILING_SYSTEMS.DROP_CEILING,
				`${ceilingSqft} sf`
			);
		}
	}

	// --- STEP 4: PAINTING ---
	if (services.painting) {
		const pRate = MASTER_RATES.PAINTING.STANDARD;
		addDetailItem(
			'Painting: All Walls',
			totalWallSqft,
			'sf',
			pRate.WALL,
			`${totalWallSqft} sf`
		);

		if (services.ceilingFinish === 'Drywall') {
			addDetailItem(
				'Painting: Ceiling',
				ceilingSqft,
				'sf',
				pRate.CEILING,
				`${ceilingSqft} sf`
			);
		} else if (services.ceilingFinish === 'Painted/Industrial') {
			addDetailItem(
				'Painting: Industrial Spray',
				ceilingSqft,
				'sf',
				MASTER_RATES.CEILING_SYSTEMS.PAINTED_INDUSTRIAL,
				`${ceilingSqft} sf`
			);
		}
	}

	return {
		low: Math.round(totalCost * 0.95),
		high: Math.round(totalCost * 1.1),
		totalHours: Number(totalHours.toFixed(1)),
		explanation: `Basement Finish Estimate`,
		breakdownItems: isAdmin ? breakdownItems : [],
		customerSummary: `Estimate for ${sqft} sqft Basement.`,
	};
};

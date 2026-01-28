// server/src/modules/estimator/services/basementService.ts

import { BASEMENT_CONSTANTS } from '../constants/basementConstants.js';
import { MASTER_RATES, RateDetail } from '../constants/masterRates.js';
import { BasementRequest } from '../types.js';

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
		rooms = [],
		hasWetBar,
		services,
		perimeterInsulation,
		soffitWork,
		ceilingGrid,
	} = data;

	// --- 1. GEOMETRY ENGINE ---
	const wallHeight = BASEMENT_CONSTANTS.HEIGHT_MAP[ceilingHeight] || 8.0;

	// A. Perimeter (Shell)
	const perimeterLF = Math.ceil(
		Math.sqrt(sqft) * BASEMENT_CONSTANTS.PERIMETER_MULTIPLIER
	);

	// B. Partitions (Interior Walls)
	let partitionLF = 0;
	let bedCount = 0;
	let bathCount = 0;

	// Track linear footage per type for the breakdown message
	let bedLF = 0;
	let bathLF = 0;
	let wetBarLF = 0;

	rooms.forEach((room) => {
		if (room.type === 'Bedroom') {
			bedCount++;
			let lfToAdd = BASEMENT_CONSTANTS.LF_ROOMS.BEDROOM_MEDIUM;
			if (room.size.includes('Small'))
				lfToAdd = BASEMENT_CONSTANTS.LF_ROOMS.BEDROOM_SMALL;
			else if (room.size.includes('Large'))
				lfToAdd = BASEMENT_CONSTANTS.LF_ROOMS.BEDROOM_LARGE;

			partitionLF += lfToAdd;
			bedLF += lfToAdd;
		} else if (room.type === 'Bathroom') {
			bathCount++;
			let lfToAdd = BASEMENT_CONSTANTS.LF_ROOMS.BATH_HALF;
			if (room.bathType === 'Full Bath')
				lfToAdd = BASEMENT_CONSTANTS.LF_ROOMS.BATH_FULL;

			partitionLF += lfToAdd;
			bathLF += lfToAdd;
		}
	});

	if (hasWetBar) {
		const wbVal = BASEMENT_CONSTANTS.LF_ROOMS.WETBAR;
		partitionLF += wbVal;
		wetBarLF = wbVal;
	}

	// C. Soffits
	const workLevel = soffitWork || 'Average';
	const soffitFactor = BASEMENT_CONSTANTS.SOFFIT_FACTORS[workLevel];
	const soffitLF = Math.ceil(perimeterLF * soffitFactor);

	// D. Areas
	const perimeterWallSqft = perimeterLF * wallHeight;
	const partitionWallSqftOneSide = partitionLF * wallHeight;

	// Interior walls have 2 sides (Front/Back)
	const partitionWallSqftTotal = partitionWallSqftOneSide * 2;

	// NEW: Soffit Surface Area (Approx 2ft width per LF of soffit for drywall/paint)
	const soffitSqft = soffitLF * 2;

	const totalWallSqft = perimeterWallSqft + partitionWallSqftTotal + soffitSqft;
	const ceilingSqft = sqft;

	// --- 2. COST CALCULATION ---

	const breakdownItems: BreakdownItem[] = [];
	let totalCost = 0;
	let totalHours = 0;

	const addDetailItem = (
		categoryName: string,
		qty: number,
		unit: string,
		rate: RateDetail,
		explanation: string // Renamed for clarity
	) => {
		if (qty <= 0) return;

		const laborCost = qty * rate.labor;
		const materialCost = qty * rate.material;
		const hoursPerUnit = rate.hoursPerLinearFoot || rate.hoursPerSqft || 0;
		const laborHours = qty * hoursPerUnit;

		totalCost += laborCost + materialCost;
		totalHours += laborHours;

		// Parent Line (Labor + Explanation)
		breakdownItems.push({
			name: categoryName,
			cost: laborCost,
			hours: laborHours,
			details: `${explanation}\n   Formula: ${qty} ${unit} * $${rate.labor.toFixed(2)} (Labor)`,
		});

		// Child Line (Material)
		breakdownItems.push({
			name: `   ↳ Materials`,
			cost: materialCost,
			hours: 0,
			details: `      $${rate.material.toFixed(2)}/${unit} * ${qty} ${unit}`,
		});
	};

	// --- SECTION 0: MATH EXPLAINER (Your Requested Format) ---
	// Calculate percentages for display
	const soffitPercent = Math.round(soffitFactor * 100);

	breakdownItems.push({
		name: '📐 Dimensions & Math',
		cost: 0,
		hours: 0,
		details: `Floor: ${sqft}sf. Height: ${wallHeight}ft.
    • Perimeter: √${sqft} * 4.2 = ${perimeterLF} LF (Exterior Shell)
    • Partitions: ${bedCount} Bed (${bedLF} LF) + ${bathCount} Bath (${bathLF} LF)${hasWetBar ? ` + Wet Bar (${wetBarLF} LF)` : ''} = ${partitionLF} LF
    • Soffits: ${perimeterLF} LF * ${soffitPercent}% = ${soffitLF} LF (Bulkheads)
    • Wall Area: (${perimeterLF} * ${wallHeight}) + (${partitionLF} * ${wallHeight} * 2 sides) + (${soffitLF} * 2 soffit face) = ${totalWallSqft} sf`,
	});

	// --- STEP 1: FRAMING ---
	if (services.framing) {
		if (condition === 'Bare Concrete') {
			addDetailItem(
				'Framing: Exterior Walls',
				perimeterLF,
				'LF',
				MASTER_RATES.FRAMING.CONCRETE_FLOOR,
				`${perimeterLF} LF (Total Perimeter)`
			);
		}

		if (partitionLF > 0) {
			addDetailItem(
				'Framing: Interior Rooms',
				partitionLF,
				'LF',
				MASTER_RATES.FRAMING.CONCRETE_FLOOR,
				`${partitionLF} LF (Beds, Baths, Closets)`
			);
		}

		if (soffitLF > 0) {
			addDetailItem(
				'Framing: Soffits & Bulkheads',
				soffitLF,
				'LF',
				MASTER_RATES.FRAMING.CONCRETE_FLOOR,
				`${soffitLF} LF (Based on ${soffitWork} complexity)`
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
				details: `${numOpenings} Openings (Inferred from rooms) * $${openRate.labor.toFixed(2)}`,
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
				`${perimeterWallSqft} sf (${perimeterLF} LF * ${wallHeight} ft)`
			);
		}
		addDetailItem(
			'Insulation: Fiberglass Batts',
			perimeterWallSqft,
			'sf',
			MASTER_RATES.INSULATION.STANDARD.WALL,
			`${perimeterWallSqft} sf (${perimeterLF} LF * ${wallHeight} ft)`
		);
	}

	// --- STEP 3: DRYWALL ---
	if (services.drywall) {
		const dwRate = MASTER_RATES.DRYWALL_INSTALL.LEVEL_2;

		// Note: Drywall Level is hardcoded to Level 2 (Standard Basement) in logic currently,
		// but we can expose that if needed.
		const levelDesc = 'Level 2 Finish';

		if (condition !== 'Framed & Insulated') {
			addDetailItem(
				`Drywall: Exterior Walls (${levelDesc})`,
				perimeterWallSqft,
				'sf',
				dwRate.WALL,
				`${perimeterWallSqft} sf (${perimeterLF} LF * ${wallHeight} ft)`
			);
		}

		if (partitionWallSqftTotal > 0) {
			addDetailItem(
				`Drywall: Interior Rooms (${levelDesc})`,
				partitionWallSqftTotal,
				'sf',
				dwRate.WALL,
				`${partitionWallSqftTotal} sf (${partitionLF} LF * ${wallHeight} ft * 2 sides)`
			);
		}

		// Soffit Drywall (NEW)
		if (soffitSqft > 0) {
			addDetailItem(
				`Drywall: Soffits/Box-outs`,
				soffitSqft,
				'sf',
				dwRate.WALL,
				`${soffitSqft} sf (Face area of ductwork boxes)`
			);
		}

		// Ceiling Logic
		if (services.ceilingFinish === 'Drywall') {
			addDetailItem(
				'Drywall: Ceiling',
				ceilingSqft,
				'sf',
				dwRate.CEILING,
				`${ceilingSqft} sf (Floor Area)`
			);
		} else if (services.ceilingFinish === 'Drop Ceiling') {
			const gridRate =
				ceilingGrid === '2x2'
					? MASTER_RATES.CEILING_SYSTEMS.DROP_CEILING_2X2
					: MASTER_RATES.CEILING_SYSTEMS.DROP_CEILING_2X4;
			const gridName = ceilingGrid === '2x2' ? '2x2 Designer' : '2x4 Standard';

			addDetailItem(
				`Ceiling System: ${gridName}`,
				ceilingSqft,
				'sf',
				gridRate,
				`${ceilingSqft} sf (Floor Area)`
			);
		}
	}

	// --- STEP 4: PAINTING ---
	if (services.painting) {
		const pRate = MASTER_RATES.PAINTING.STANDARD;
		addDetailItem(
			'Painting: All Walls & Soffits',
			totalWallSqft,
			'sf',
			pRate.WALL,
			`${totalWallSqft} sf (Exterior + Interior + Soffits)`
		);

		if (services.ceilingFinish === 'Drywall') {
			addDetailItem(
				'Painting: Ceiling',
				ceilingSqft,
				'sf',
				pRate.CEILING,
				`${ceilingSqft} sf (Floor Area)`
			);
		} else if (services.ceilingFinish === 'Painted/Industrial') {
			addDetailItem(
				'Painting: Industrial Spray',
				ceilingSqft,
				'sf',
				MASTER_RATES.CEILING_SYSTEMS.PAINTED_INDUSTRIAL,
				`${ceilingSqft} sf (Exposed Deck)`
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

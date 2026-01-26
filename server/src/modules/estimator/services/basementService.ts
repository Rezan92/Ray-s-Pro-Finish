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
		numBedrooms,
		numBathrooms,
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

	// B. Partitions
	const partitionLF =
		numBedrooms * BASEMENT_CONSTANTS.LF_PER_BEDROOM +
		numBathrooms * BASEMENT_CONSTANTS.LF_PER_BATHROOM +
		(hasWetBar ? BASEMENT_CONSTANTS.LF_PER_WETBAR : 0);

	// C. Soffits
	const workLevel = soffitWork || 'Average';
	const soffitFactor = BASEMENT_CONSTANTS.SOFFIT_FACTORS[workLevel];
	const soffitLF = Math.ceil(perimeterLF * soffitFactor);

	// D. Surface Areas
	const perimeterWallSqft = perimeterLF * wallHeight;
	const partitionWallSqftOneSide = partitionLF * wallHeight;
	const partitionWallSqftTotal = partitionWallSqftOneSide * 2;
	const totalWallSqft = perimeterWallSqft + partitionWallSqftTotal;
	const ceilingSqft = sqft;

	// --- 2. COST CALCULATION ---

	const breakdownItems: BreakdownItem[] = [];
	let totalCost = 0;
	let totalHours = 0;

	// --- HELPER: Equation Style Details ---
	const addDetailItem = (
		name: string,
		qty: number,
		unit: string,
		rate: RateDetail,
		mathEquation: string // e.g., "119' * 8' = 952 sf"
	) => {
		if (qty <= 0) return;

		const laborCost = qty * rate.labor;
		const materialCost = qty * rate.material;
		const hoursPerUnit = rate.hoursPerLinearFoot || rate.hoursPerSqft || 0;
		const laborHours = qty * hoursPerUnit;

		totalCost += laborCost + materialCost;
		totalHours += laborHours;

		// FORMAT: "119' * 8' = 952 sf * $0.65"
		const laborStr = `${mathEquation} * $${rate.labor.toFixed(2)}`;
		const matStr = `  ↳ Materials: $${rate.material.toFixed(2)}/unit`;

		breakdownItems.push({
			name: `${name} (Labor)`,
			cost: laborCost,
			hours: laborHours,
			details: laborStr,
		});

		breakdownItems.push({
			name: `  ↳ ${name} Supplies`,
			cost: materialCost,
			hours: 0,
			details: matStr,
		});
	};

	// --- SECTION 0: MATH EXPLAINER (Admin Only) ---
	breakdownItems.push({
		name: '📐 Dimensions & Math',
		cost: 0,
		hours: 0,
		details: `Floor: ${sqft}sf. Height: ${wallHeight}ft.
        • Perimeter: √${sqft} * 4.2 = ${perimeterLF} LF (Concrete Walls)
        • Partitions: ${numBedrooms} Bed * 30LF + ${numBathrooms} Bath * 25LF = ${partitionLF} LF (Interior)
        • Soffits: ${perimeterLF} LF * ${Math.round(
					soffitFactor * 100
				)}% = ${soffitLF} LF
        • Wall Area: (${perimeterLF} * ${wallHeight}) + (${partitionLF} * ${wallHeight} * 2) = ${
					perimeterWallSqft + partitionWallSqftTotal
				} sf`,
	});

	// --- STEP 1: FRAMING ---
	if (services.framing) {
		// 1.1 Perimeter (Condition Based)
		if (condition === 'Bare Concrete') {
			const rate = MASTER_RATES.FRAMING.CONCRETE_FLOOR;
			addDetailItem(
				'Framing (Concrete Perimeter)',
				perimeterLF,
				'LF',
				rate,
				`${perimeterLF} LF` // Simple linear math
			);
		}

		// 1.2 Partitions
		if (partitionLF > 0) {
			const rate = MASTER_RATES.FRAMING.CONCRETE_FLOOR;
			addDetailItem(
				'Framing (Interior Partitions)',
				partitionLF,
				'LF',
				rate,
				`${partitionLF} LF`
			);
		}

		// 1.3 Soffits
		if (soffitLF > 0) {
			const rate = MASTER_RATES.FRAMING.CONCRETE_FLOOR;
			addDetailItem(
				'Framing (Soffit Boxing)',
				soffitLF,
				'LF',
				rate,
				`${soffitLF} LF`
			);
		}

		// 1.4 Headers
		const numOpenings =
			numBedrooms * BASEMENT_CONSTANTS.OPENINGS_PER_BEDROOM +
			numBathrooms * BASEMENT_CONSTANTS.OPENINGS_PER_BATHROOM +
			BASEMENT_CONSTANTS.OPENINGS_BASE_EGRESS;

		if (numOpenings > 0) {
			const openRate = MASTER_RATES.FRAMING.OPENING_BUILD;
			const cost = numOpenings * openRate.labor;
			const hrs = numOpenings * (openRate.hoursPerLinearFoot || 1.25);

			totalCost += cost;
			totalHours += hrs;

			breakdownItems.push({
				name: 'Headers & Openings',
				cost: cost,
				hours: hrs,
				details: `${numOpenings} units * $${openRate.labor.toFixed(2)}`,
			});
		}
	}

	// --- STEP 2: INSULATION ---
	// LOGIC FIX: If 'Bare Concrete', we MUST Insulate. Decoupled from "services.framing" checkbox.
	if (condition === 'Bare Concrete') {
		if (perimeterInsulation === 'Premium (Rigid Foam)') {
			addDetailItem(
				'Rigid Foam (XPS)',
				perimeterWallSqft,
				'sf',
				MASTER_RATES.INSULATION.RIGID_FOAM.WALL,
				`${perimeterLF}' * ${wallHeight}' = ${perimeterWallSqft} sf`
			);
		}

		addDetailItem(
			'Insulation (R15 Batts)',
			perimeterWallSqft,
			'sf',
			MASTER_RATES.INSULATION.STANDARD.WALL,
			`${perimeterLF}' * ${wallHeight}' = ${perimeterWallSqft} sf`
		);
	}

	// --- STEP 3: DRYWALL ---
	if (services.drywall) {
		const dwRate = MASTER_RATES.DRYWALL_INSTALL.LEVEL_2;

		// Perimeter (1 Side)
		if (condition !== 'Framed & Insulated') {
			addDetailItem(
				'Drywall (Perimeter)',
				perimeterWallSqft,
				'sf',
				dwRate.WALL,
				`${perimeterLF}' * ${wallHeight}' = ${perimeterWallSqft} sf`
			);
		}

		// Partitions (2 Sides)
		if (partitionWallSqftTotal > 0) {
			addDetailItem(
				'Drywall (Partitions)',
				partitionWallSqftTotal,
				'sf',
				dwRate.WALL,
				`(${partitionLF}' * ${wallHeight}') * 2 sides = ${partitionWallSqftTotal} sf`
			);
		}

		// Ceiling
		if (services.ceilingFinish === 'Drywall') {
			addDetailItem(
				'Drywall (Ceiling)',
				ceilingSqft,
				'sf',
				dwRate.CEILING,
				`Floor Area = ${ceilingSqft} sf`
			);
		} else if (services.ceilingFinish === 'Drop Ceiling') {
			addDetailItem(
				'Drop Ceiling',
				ceilingSqft,
				'sf',
				MASTER_RATES.CEILING_SYSTEMS.DROP_CEILING,
				`Floor Area = ${ceilingSqft} sf`
			);
		}
	}

	// --- STEP 4: PAINTING ---
	if (services.painting) {
		const pRate = MASTER_RATES.PAINTING.STANDARD;

		// Walls Combined
		// We split the equation to show both parts
		const mathStr = `(${perimeterWallSqft}sf Perim + ${partitionWallSqftTotal}sf Part) = ${totalWallSqft} sf`;
		addDetailItem('Painting (Walls)', totalWallSqft, 'sf', pRate.WALL, mathStr);

		// Ceiling
		if (services.ceilingFinish === 'Drywall') {
			addDetailItem(
				'Painting (Ceiling)',
				ceilingSqft,
				'sf',
				pRate.CEILING,
				`Floor Area = ${ceilingSqft} sf`
			);
		} else if (services.ceilingFinish === 'Painted/Industrial') {
			addDetailItem(
				'Industrial Spray',
				ceilingSqft,
				'sf',
				MASTER_RATES.CEILING_SYSTEMS.PAINTED_INDUSTRIAL,
				`Floor Area = ${ceilingSqft} sf`
			);
		}
	}

	return {
		low: Math.round(totalCost * 0.95),
		high: Math.round(totalCost * 1.1),
		totalHours: Number(totalHours.toFixed(1)),
		explanation: `Basement Finish Estimate`,
		breakdownItems: isAdmin ? breakdownItems : [],
		customerSummary: `Estimate for ${sqft} sqft Basement Finish.`,
	};
};

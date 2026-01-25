import { BASEMENT_CONSTANTS } from '../constants/basementConstants.js';
import { MASTER_RATES } from '../constants/masterRates.js';
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
		perimeterInsulation, // 'Standard (Vapor Barrier)' | 'Premium (Rigid Foam)'
		soffitWork, // 'Minimal' | 'Average' | 'Complex'
	} = data;

	// --- 1. GEOMETRY ENGINE (The "Inference" Logic) ---

	// A. Height
	const wallHeight = BASEMENT_CONSTANTS.HEIGHT_MAP[ceilingHeight] || 8.0;

	// B. Linear Feet
	const perimeterLF = Math.ceil(
		Math.sqrt(sqft) * BASEMENT_CONSTANTS.PERIMETER_MULTIPLIER
	);

	const partitionLF =
		numBedrooms * BASEMENT_CONSTANTS.LF_PER_BEDROOM +
		numBathrooms * BASEMENT_CONSTANTS.LF_PER_BATHROOM +
		(hasWetBar ? BASEMENT_CONSTANTS.LF_PER_WETBAR : 0);

	const workLevel = soffitWork || 'Average';
	const soffitFactor = BASEMENT_CONSTANTS.SOFFIT_FACTORS[workLevel];
	const soffitLF = Math.ceil(perimeterLF * soffitFactor);

	// C. Surface Areas
	// Perimeter Walls (1-sided finish)
	const perimeterWallSqft = perimeterLF * wallHeight;

	// Partition Walls (2-sided finish)
	const partitionWallSqftOneSide = partitionLF * wallHeight;
	const partitionWallSqftTotal = partitionWallSqftOneSide * 2;

	const ceilingSqft = sqft; // Simple floor=ceiling assumption

	// --- 2. COST CALCULATION ---

	const breakdownItems: BreakdownItem[] = [];
	let totalCost = 0;
	let totalHours = 0;

	// Helper to push line items
	const addLine = (
		name: string,
		cost: number,
		hours: number,
		detailStr: string
	) => {
		totalCost += cost;
		totalHours += hours;
		breakdownItems.push({ name, cost, hours, details: detailStr });
	};

	// HEADER
	breakdownItems.push({
		name: 'Project Geometry',
		cost: 0,
		hours: 0,
		details: `Floor: ${sqft}sf. Perim Walls: ${perimeterLF}LF. Partitions: ${partitionLF}LF.`,
	});

	// --- STEP 1: FRAMING ---
	if (services.framing) {
		const rate = MASTER_RATES.FRAMING.CONCRETE_FLOOR; // Basement Default

		// 1.1 Perimeter Framing
		if (condition === 'Bare Concrete') {
			const cost = perimeterLF * (rate.labor + rate.material);
			const hrs = perimeterLF * (rate.hoursPerLinearFoot || 0.25);
			addLine(
				'Framing (Perimeter)',
				cost,
				hrs,
				`${perimeterLF} LF * $${(rate.labor + rate.material).toFixed(
					2
				)} (Concrete Rate)`
			);
		}

		// 1.2 Partition Framing (Always needed if rooms exist)
		if (partitionLF > 0) {
			const cost = partitionLF * (rate.labor + rate.material);
			const hrs = partitionLF * (rate.hoursPerLinearFoot || 0.25);
			addLine(
				'Framing (Partitions)',
				cost,
				hrs,
				`${partitionLF} LF * $${(rate.labor + rate.material).toFixed(2)}`
			);
		}

		// 1.3 Soffits (Boxing Ductwork)
		if (soffitLF > 0) {
			const cost = soffitLF * (rate.labor + rate.material);
			const hrs = soffitLF * (rate.hoursPerLinearFoot || 0.25);
			addLine(
				'Framing (Soffits)',
				cost,
				hrs,
				`${soffitLF} LF (Boxing) * $${(rate.labor + rate.material).toFixed(2)}`
			);
		}

		// 1.4 Openings (Headers)
		const numOpenings =
			numBedrooms * BASEMENT_CONSTANTS.OPENINGS_PER_BEDROOM +
			numBathrooms * BASEMENT_CONSTANTS.OPENINGS_PER_BATHROOM +
			BASEMENT_CONSTANTS.OPENINGS_BASE_EGRESS;

		const openRate = MASTER_RATES.FRAMING.OPENING_BUILD;
		const openCost = numOpenings * openRate.labor;
		const openHrs = numOpenings * (openRate.hoursPerLinearFoot || 1.25); // Using the prop for 'hours per unit'
		addLine(
			'Headers & Openings',
			openCost,
			openHrs,
			`${numOpenings} units * $${openRate.labor}`
		);
	}

	// --- STEP 2: INSULATION ---
	// Note: Partitions usually don't get insulation in basic quotes, only perimeter.
	if (services.framing && condition === 'Bare Concrete') {
		// A. Rigid Foam (Optional Premium)
		if (perimeterInsulation === 'Premium (Rigid Foam)') {
			const foamRate = MASTER_RATES.INSULATION.RIGID_FOAM.WALL;
			const cost = perimeterWallSqft * (foamRate.labor + foamRate.material);
			const hrs = perimeterWallSqft * (foamRate.hoursPerSqft || 0);
			addLine(
				'Rigid Foam (XPS)',
				cost,
				hrs,
				`${perimeterWallSqft} sf * $${(
					foamRate.labor + foamRate.material
				).toFixed(2)}`
			);
		}

		// B. Standard Batts (R15)
		// We assume batts are always added to perimeter if framing is done
		const battRate = MASTER_RATES.INSULATION.STANDARD.WALL;
		const cost = perimeterWallSqft * (battRate.labor + battRate.material);
		const hrs = perimeterWallSqft * (battRate.hoursPerSqft || 0);
		addLine(
			'Insulation (R15 Batts)',
			cost,
			hrs,
			`Perimeter: ${perimeterWallSqft} sf`
		);
	}

	// --- STEP 3: DRYWALL ---
	if (services.drywall) {
		const dwRate = MASTER_RATES.DRYWALL_INSTALL.LEVEL_2; // Standard Garage/Basement

		// 3.1 Walls (Perimeter 1-side + Partition 2-sides)
		const totalWallArea = perimeterWallSqft + partitionWallSqftTotal;
		const wCost = totalWallArea * (dwRate.WALL.labor + dwRate.WALL.material);
		const wHrs = totalWallArea * (dwRate.WALL.hoursPerSqft || 0);
		addLine(
			'Drywall Hang/Finish (Walls)',
			wCost,
			wHrs,
			`${totalWallArea} sf (Peri: ${perimeterWallSqft} + Part: ${partitionWallSqftTotal})`
		);

		// 3.2 Ceiling (If selected)
		if (services.ceilingFinish === 'Drywall') {
			const cCost =
				ceilingSqft * (dwRate.CEILING.labor + dwRate.CEILING.material);
			const cHrs = ceilingSqft * (dwRate.CEILING.hoursPerSqft || 0);
			addLine('Drywall (Ceiling)', cCost, cHrs, `${ceilingSqft} sf (Overhead)`);
		}
	}

	// --- STEP 4: PAINTING ---
	if (services.painting) {
		const pRate = MASTER_RATES.PAINTING.STANDARD; // 2 Coats

		// 4.1 Walls
		const totalWallArea = perimeterWallSqft + partitionWallSqftTotal;
		const wCost = totalWallArea * (pRate.WALL.labor + pRate.WALL.material);
		const wHrs = totalWallArea * (pRate.WALL.hoursPerSqft || 0);
		addLine('Painting (Walls)', wCost, wHrs, `${totalWallArea} sf`);

		// 4.2 Ceiling
		if (
			services.ceilingFinish === 'Drywall' ||
			services.ceilingFinish === 'Painted/Industrial'
		) {
			// Note: Industrial spray might be cheaper material but messy labor.
			// For now, using Standard Ceiling Rate.
			const cCost =
				ceilingSqft * (pRate.CEILING.labor + pRate.CEILING.material);
			const cHrs = ceilingSqft * (pRate.CEILING.hoursPerSqft || 0);
			addLine('Painting (Ceiling)', cCost, cHrs, `${ceilingSqft} sf`);
		}
	}

	return {
		low: Math.round(totalCost * 0.95),
		high: Math.round(totalCost * 1.1),
		totalHours: Number(totalHours.toFixed(1)),
		explanation: `Basement (${sqft}sf). Beds: ${numBedrooms}, Baths: ${numBathrooms}.`,
		breakdownItems: isAdmin ? breakdownItems : [],
		customerSummary: `Estimate for ${sqft} sqft Basement Finish.`,
	};
};

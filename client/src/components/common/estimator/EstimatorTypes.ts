export interface PaintingRoom {
	id: string; // A unique ID like "livingRoom_0" or "bedroom_1"
	type: string; // "livingRoom", "kitchen", "bedroom", etc.
	label: string; // "Living Room", "Bedroom 1", etc.
	size: string; // 'Small', 'Medium', 'Large', 'X-Large'
	ceilingHeight: string; // '8ft', '9ft', '10ft', '10ft+'
	windowCount: number;
	closetSize: 'None' | 'Standard' | 'Medium' | 'Large';
	surfaces: {
		walls: boolean;
		ceiling: boolean;
		trim: boolean;
		doors: boolean;
		crownMolding: boolean;
	};
	wallCondition: string; // 'Good', 'Fair', 'Poor'
	colorChange: string; // 'Similar', 'Dark-to-Light'
	ceilingTexture: string; // 'Flat', 'Textured', 'Popcorn'
	trimCondition: string; // 'Good', 'Poor'
	trimStyle: 'Simple' | 'Detailed'; // NEW
	doorCount: string;
	doorStyle: string; // 'Slab', 'Paneled'
	crownMoldingStyle: string; // 'Simple', 'Detailed'
	roomDescription?: string;
}

export interface RepairItem {
	id: string;
	damageType: string; // 'Hole', 'Crack', 'Water Damage', 'Tape Issues'
	size: string; // 'Medium (<12")', 'Large (1-3ft)', 'X-Large (Sheet+)'
	locationName: string; //e.g., "Living Room North Wall"
	quantity: number; //Number of similar patches at this location
	placement: string; // 'Wall', 'Ceiling'
	accessibility: string; // 'Standard', 'Ladder', 'High'
	texture: string; // 'Smooth', 'Orange Peel', 'Knockdown', 'Popcorn'
	scope: string; // 'Patch Only', 'Patch & Prime', 'Patch, Prime & Paint'
	paintMatching?: string; // 'Customer has paint', 'Color Match needed', 'Paint entire wall'
	wallHeight?: string;
	wallWidth?: string;
}

export interface InstallationData {
	projectType: string; // 'Wall', 'Ceiling', 'Room'
	wallLength: string; // 'Small (Under 10ft)', 'Medium (10-20ft)', 'Large (20ft+)'
	roomSqft: string; // User input number
	ceilingHeight: string; // 'Standard (8ft)', 'High (9-10ft)', 'Vaulted (12ft+)'
	framing: string; // 'Ready', 'Wood', 'Metal'
	drywallType: string; // 'Standard', 'Moisture', 'Fire' (We can default this or ask later, keeping simple for now)
	openings: string; // Number of doors/windows (for Rooms)
	finishLevel: string; // 'Level 3', 'Level 4', 'Level 5'
	includePaint: boolean;
	isLoadBearing?: string; // 'No', 'Yes', 'Unsure'
	includeDemolition?: boolean; // Haul away debris
	additionalDetails?: string;
}

export type GarageSize = '1-Car' | '1.5-Car' | '2-Car' | '2.5-Car' | '3-Car';
export type GarageHeight =
	| 'Standard (8-9ft)'
	| 'High (10-12ft)'
	| 'Extra High (13ft+)';
export type GarageCondition =
	| 'Bare Studs'
	| 'Drywall Hung'
	| 'Taped & Rough'
	| 'Finished/Bare';
export type GarageOccupancy = 'Empty' | 'Customer Will Move' | 'Pro Move';

export type DrywallLevel =
	| 'Level 1'
	| 'Level 2'
	| 'Level 3'
	| 'Level 4'
	| 'Level 5';
export type PaintLevel = 'Primer' | '1-Coat' | 'Standard' | 'Premium';

export interface GarageData {
	size: GarageSize;
	ceilingHeight: GarageHeight;
	condition: GarageCondition;
	includeCeiling: boolean;
	occupancy: GarageOccupancy;
	services: {
		insulation: boolean;
		drywall: boolean;
		painting: boolean;
	};

	drywallLevel?: DrywallLevel;
	paintLevel?: PaintLevel;

	additionalDetails?: string;
}

export type BasementCondition =
	| 'Bare Concrete'
	| 'Framed'
	| 'Framed & Insulated';
export type BasementHeight = 'Standard (8ft)' | 'Low (<7ft)' | 'High (9ft+)';
export type SoffitCondition = 'Minimal' | 'Average' | 'Complex';
export type InsulationType =
	| 'Standard (Vapor Barrier)'
	| 'Premium (Rigid Foam)';

export interface RoomDetail {
	id: string;
	type: 'Bedroom' | 'Bathroom';
	size: 'Small (10x10)' | 'Medium (12x12)' | 'Large (Master)';
	bathType?: 'Half Bath' | 'Full Bath';
}

export interface BasementData {
	sqft: string;
	ceilingHeight: BasementHeight;
	condition: BasementCondition;
	perimeterInsulation: InsulationType;
	soffitWork: SoffitCondition;
	rooms: RoomDetail[];
	services: {
		framing: boolean;
		drywall: boolean;
		painting: boolean;
		ceilingFinish: 'Drywall' | 'Drop Ceiling' | 'Painted/Industrial';
	};
	hasWetBar: boolean;
	additionalDetails?: string;
	numBedrooms?: number;
	numBathrooms?: number;
}

export interface FormData {
	services: {
		painting: boolean;
		patching: boolean;
		installation: boolean;
		garage: boolean;
		basement: boolean;
	};

	painting: {
		rooms: PaintingRoom[];
		paintProvider: string;
		furniture: string;
		additionalDetails?: string;
	};

	patching: {
		repairs: RepairItem[];
		smallRepairsDescription?: string;
	};

	installation: InstallationData;
	garage: GarageData;
	basement: BasementData;

	contact: {
		name: string;
		email: string;
		phone: string;
	};
}

export interface EstimatorState {
	step: number;
	formData: FormData;
	estimate: Estimate | null;
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
}

export interface BreakdownItem {
	name: string;
	cost: number;
	hours: number;
	details?: string;
}
export interface Estimate {
	low: number;
	high: number;
	totalHours: number;
	isAdmin: boolean;
	customerSummary?: string | null;
	explanation?: string | null; // This is the technical string for admins
	breakdownItems?: BreakdownItem[] | null;
}

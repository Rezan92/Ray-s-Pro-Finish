export interface PaintingRoom {
	id: string; // A unique ID like "livingRoom_0" or "bedroom_1"
	type: string; // "livingRoom", "kitchen", "bedroom", etc.
	label: string; // "Living Room", "Bedroom 1", "Bedroom 2"
	size: string; // 'Small', 'Medium', 'Large'
	ceilingHeight: string; // '8ft', '9-10ft', '11ft+'
	surfaces: {
		walls: boolean;
		ceiling: boolean;
		trim: boolean;
		doors: boolean;
		crownMolding: boolean;
	};
	wallCondition: string; // 'Good', 'Fair', 'Poor'
	colorChange: string; // 'Similar', 'Light-to-Dark', 'Dark-to-Light'
	ceilingTexture?: string; // 'Flat', 'Textured', 'Popcorn'
	trimCondition?: string; // 'Good', 'Poor'
	doorCount?: string; // '1', '2', etc.
	doorStyle?: string; // 'Slab', 'Paneled'
	crownMoldingStyle?: string; // 'Simple', 'Ornate'
	roomDescription?: string; // For 'Other' rooms
}

export interface RepairItem {
	id: string;
	damageType: string; // 'Hole', 'Crack', 'Water Damage', 'Tape Issues'
	size: string; // 'Medium (<12")', 'Large (1-3ft)', 'X-Large (Sheet+)'
	placement: string; // 'Wall', 'Ceiling'
	accessibility: string; // 'Standard (Reach from floor)', 'Ladder (8-12ft)', 'High/Scaffold (12ft+)'
	texture: string; // 'Smooth', 'Orange Peel', 'Knockdown', 'Popcorn'
	scope: string; // 'Patch Only', 'Patch & Prime', 'Patch, Prime & Paint'
	paintMatching?: string; // 'Customer has paint', 'Color Match needed', 'Paint entire wall'
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
}

export interface GarageData {
	capacity: string; // '1-Car', '2-Car', '3-Car', '4-Car'
	scope: string; // 'Walls Only', 'Ceiling Only', 'Both'

	// Condition
	currentCondition: string; // 'Open Studs', 'Insulated (No Board)', 'Existing Drywall (Needs Finish)'

	// Finish
	finishLevel: string; // 'Fire Tape (Code)', 'Level 3 (Work)', 'Level 4 (Smooth/Paint Ready)'

	// Services
	includeInsulation: boolean;
	includePaint: boolean;
	includeEpoxy: boolean;
	includeBaseboards: boolean; // Rubber/Vinyl base

	additionalDetails?: string;
}

export interface FormData {
	services: {
		painting: boolean;
		patching: boolean;
		installation: boolean;
		garage: boolean;
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

	contact: {
		name: string;
		email: string;
		phone: string;
	};
}

export interface Estimate {
	low: number;
	high: number;
	explanation: string;
	totalHours: number;
}

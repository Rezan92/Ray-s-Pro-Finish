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
	size: string;       // 'Medium (<12")', 'Large (1-3ft)', 'X-Large (Sheet+)'
	placement: string;  // 'Wall', 'Ceiling'
	texture: string;    // 'Smooth', 'Orange Peel', 'Knockdown', 'Popcorn'
	scope: string;      // 'Patch Only', 'Patch & Prime', 'Patch, Prime & Paint'
	paintMatching?: string; // 'Customer has paint', 'Color Match needed', 'Paint entire wall'
}

export interface FormData {
	services: {
		painting: boolean;
		patching: boolean;
		installation: boolean;
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

	installation: {
		project_type: string;
		sqft: string;
		ceilingHeight: string;
		scope: string;
		finish: string;
	};

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
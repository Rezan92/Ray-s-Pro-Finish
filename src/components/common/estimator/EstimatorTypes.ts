// This file defines the new, complex data structure for our form

/**
 * Interface for a single, dynamic painting room card.
 */
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
	};
	wallCondition: string; // 'Good', 'Fair', 'Poor'
	colorChange: string; // 'Similar', 'Light-to-Dark', 'Dark-to-Light'

	// Conditional fields
	ceilingTexture?: string; // 'Flat', 'Textured', 'Popcorn'
	trimCondition?: string; // 'Good', 'Poor'
	doorCount?: string; // '1', '2', etc.
	doorStyle?: string; // 'Slab', 'Paneled'
}

/**
 * Defines the structure for the *entire* estimator form.
 */
export interface FormData {
	// Step 1: Service Selection
	services: {
		painting: boolean;
		patching: boolean;
		installation: boolean;
	};

	// Path 1: Painting Details (New Structure)
	painting: {
		// This array will hold all the room cards
		rooms: PaintingRoom[];

		// Global settings
		paintProvider: string;
		furniture: string;
	};

	// Path 2: Patching Details (Unchanged)
	patching: {
		quantity: string;
		location: string[];
		largest_size: string;
		texture: string;
		scope: string;
	};

	// Path 3: Installation Details (Unchanged)
	installation: {
		project_type: string;
		sqft: string;
		ceilingHeight: string;
		scope: string;
		finish: string;
	};

	// Path 4: Contact (Unchanged)
	contact: {
		name: string;
		email: string;
		phone: string;
	};
}

/**
 * Defines the structure of the JSON response we expect from Gemini.
 */
export interface Estimate {
	low: number;
	high: number;
	explanation: string;
}
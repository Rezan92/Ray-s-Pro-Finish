// This file defines the new, complex data structure for our form

/**
 * Interface for a single room in the painting path.
 */
export interface PaintingRoom {
	id: string; // A unique ID like "living-room" or "bedroom-1"
	name: string; // "Living Room", "Bedroom #1"
	dimensions: {
		length: string;
		width: string;
	};
	ceilingHeight: string;
	scope: {
		walls: boolean;
		ceiling: boolean;
		trim: boolean;
		doors: boolean;
		doorCount: string;
	};
	condition: {
		currentColor: string;
		newColor: string;
		prep: string;
	};
	furniture: string;
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

	// Path 1: Painting Details
	painting: {
		spaces: {
			livingRoom: boolean;
			kitchen: boolean;
			hallway: boolean;
			stairwell: boolean;
			closets: boolean;
			// For rooms that can have more than one
			bedroomCount: number;
			bathroomCount: number;
		};
		// This will hold the dynamic "mini-forms"
		rooms: PaintingRoom[];
		materials: string;
	};

	// Path 2: Patching Details
	patching: {
		quantity: string;
		location: string[];
		largest_size: string;
		texture: string;
		scope: string;
	};

	// Path 3: Installation Details
	installation: {
		project_type: string;
		sqft: string;
		ceilingHeight: string;
		scope: string;
		finish: string;
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
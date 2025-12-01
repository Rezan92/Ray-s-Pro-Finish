export const ROOM_SIZE_OPTIONS: {
	[key: string]: { label: string; value: string }[];
} = {
	bedroom: [
		{ value: 'Small', label: 'Small (10x10)' },
		{ value: 'Medium', label: 'Medium (12x14)' },
		{ value: 'Large', label: 'Large (15x16)' },
		{ value: 'X-Large', label: 'X-Large (18x18)' },
	],
	livingRoom: [
		{ value: 'Small', label: 'Small (12x15)' },
		{ value: 'Medium', label: 'Medium (15x18)' },
		{ value: 'Large', label: 'Large (18x22)' },
		{ value: 'X-Large', label: 'X-Large (20x25)' },
	],
	diningRoom: [
		{ value: 'Small', label: 'Small (9x10)' },
		{ value: 'Medium', label: 'Medium (11x13)' },
		{ value: 'Large', label: 'Large (12x16)' },
		{ value: 'X-Large', label: 'X-Large (14x18)' },
	],
	kitchen: [
		{ value: 'Small', label: 'Small (10x10)' },
		{ value: 'Medium', label: 'Medium (12x14)' },
		{ value: 'Large', label: 'Large (15x15)' },
		{ value: 'X-Large', label: 'X-Large (18x20)' },
	],
	bathroom: [
		{ value: 'Small', label: 'Small (5x5)' },
		{ value: 'Medium', label: 'Medium (5x8)' },
		{ value: 'Large', label: 'Large (10x12)' },
		{ value: 'X-Large', label: 'X-Large (12x15)' },
	],
	office: [
		{ value: 'Small', label: 'Small (8x8)' },
		{ value: 'Medium', label: 'Medium (10x10)' },
		{ value: 'Large', label: 'Large (12x12)' },
		{ value: 'X-Large', label: 'X-Large (12x15)' },
	],
	basement: [
		{ value: 'Small', label: 'Small (15x20)' },
		{ value: 'Medium', label: 'Medium (20x30)' },
		{ value: 'Large', label: 'Large (25x40)' },
		{ value: 'X-Large', label: 'X-Large (30x50+)' },
	],
	laundryRoom: [
		{ value: 'Small', label: 'Small (6x4)' },
		{ value: 'Medium', label: 'Medium (6x8)' },
		{ value: 'Large', label: 'Large (8x10)' },
		{ value: 'X-Large', label: 'X-Large (10x12)' },
	],
	closet: [
		{ value: 'Small', label: 'Small (2x4)' },
		{ value: 'Medium', label: 'Medium (5x5)' },
		{ value: 'Large', label: 'Large (6x10)' },
		{ value: 'X-Large', label: 'X-Large (10x10)' },
	],
	hallway: [
		{ value: 'Small', label: 'Small (3x6)' },
		{ value: 'Medium', label: 'Medium (3x12)' },
		{ value: 'Large', label: 'Large (4x15)' },
		{ value: 'X-Large', label: 'X-Large (5x20+)' },
	],
	stairwell: [
		{ value: 'Small', label: 'Standard 1-Level' },
		{ value: 'Medium', label: '1-Level w/ Landing' },
		{ value: 'Large', label: '2-Story Foyer' },
		{ value: 'X-Large', label: 'Grand Foyer (16ft+)' },
	],
	garage: [
		{ value: 'Small', label: '1-Car (12x20)' },
		{ value: 'Medium', label: '2-Car (22x22)' },
		{ value: 'Large', label: '3-Car (22x32)' },
		{ value: 'X-Large', label: '3+ Car (24x40+)' },
	],
	other: [
		{ value: 'Small', label: 'Pantry' },
		{ value: 'Medium', label: 'Mudroom (8x8)' },
		{ value: 'Large', label: 'Sunroom (10x12)' },
		{ value: 'X-Large', label: 'Bonus Room (15x20)' },
	],
};

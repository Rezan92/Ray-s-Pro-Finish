import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { PaintingRoom } from '@/components/common/estimator/EstimatorTypes';

interface PaintingState {
	rooms: PaintingRoom[];
	paintProvider: string;
	occupancy: string; // Replaces 'furniture'
	globalDefaults: {
		surfaces: {
			walls: boolean;
			ceiling: boolean;
			trim: boolean;
			doors: boolean;
			crownMolding: boolean;
			windows: boolean;
		};
		wallCondition: string;
		colorChange: string;
		ceilingTexture: string;
		trimCondition: string;
		trimColorChange: string;
		crownColorChange: string;
		crownMoldingStyle: string;
		doorStyle: string;
	};
	additionalDetails?: string;
}

const initialState: PaintingState = {
	rooms: [],
	paintProvider: 'Standard',
	occupancy: 'EMPTY',
	globalDefaults: {
		surfaces: {
			walls: true,
			ceiling: false,
			trim: false,
			doors: false,
			crownMolding: false,
			windows: false,
		},
		wallCondition: 'Good',
		colorChange: 'Similar',
		ceilingTexture: 'Flat',
		trimCondition: 'Good',
		trimColorChange: 'Similar',
		crownColorChange: 'Similar',
		crownMoldingStyle: 'Simple',
		doorStyle: 'Slab',
	},
};

/**
 * Defines which surfaces are physically impossible or restricted for specific room types.
 * For example, a Stairwell usually doesn't have Doors or Windows in the context of this estimator.
 */
const ROOM_SURFACE_RESTRICTIONS: Record<string, string[]> = {
	stairwell: ['doors', 'windows', 'crownMolding'],
	closet: ['windows', 'crownMolding'],
};

const createNewRoom = (
	type: string,
	id: string,
	label: string,
	defaults: PaintingState['globalDefaults']
): PaintingRoom => {
	const isStairwell = type === 'stairwell';
	const restrictions = ROOM_SURFACE_RESTRICTIONS[type] || [];
	
	// Create surfaces based on defaults but apply restrictions
	const surfaces = { ...defaults.surfaces };
	restrictions.forEach(surface => {
		// @ts-expect-error - Dynamic key access
		surfaces[surface] = false;
	});

	return {
		id,
		type,
		label,
		size: 'Medium',
		ceilingHeight: isStairwell ? '11-14ft' : '8ft',
		windowCount: surfaces.windows ? 1 : 0,
		closetSize: 'None',
		isCustomized: false,
		surfaces,
		wallCondition: defaults.wallCondition,
		colorChange: defaults.colorChange,
		ceilingTexture: defaults.ceilingTexture,
		trimCondition: defaults.trimCondition,
		trimStyle: 'Simple',
		trimColorChange: defaults.trimColorChange,
		crownMoldingStyle: defaults.crownMoldingStyle,
		crownColorChange: defaults.crownColorChange,
		doorCount: surfaces.doors ? '1' : '0',
		doorStyle: defaults.doorStyle,
		roomDescription: '',
	};
};

const ROOM_LABELS: { [key: string]: string } = {
	livingRoom: 'Living Room',
	diningRoom: 'Dining Room',
	kitchen: 'Kitchen',
	bedroom: 'Bedroom',
	bathroom: 'Bathroom',
	office: 'Office / Study',
	basement: 'Basement',
	hallway: 'Hallway',
	stairwell: 'Stairwell',
	laundryRoom: 'Laundry Room',
	garage: 'Garage',
	closet: 'Closet',
	other: 'Other',
};

export const paintingSlice = createSlice({
	name: 'painting',
	initialState,
	reducers: {
		toggleRoomType: (
			state,
			action: PayloadAction<{ type: string; isChecked: boolean }>
		) => {
			const { type, isChecked } = action.payload;
			if (isChecked) {
				const exists = state.rooms.some((r) => r.type === type);
				if (!exists) {
					const newId = `${type}_0`;
					const isMulti = type === 'bedroom' || type === 'bathroom';
					const newLabel = isMulti
						? `${ROOM_LABELS[type]} 1`
						: ROOM_LABELS[type];
					state.rooms.push(createNewRoom(type, newId, newLabel, state.globalDefaults));
				}
			} else {
				state.rooms = state.rooms.filter((r) => r.type !== type);
			}
		},
		addRoom: (state, action: PayloadAction<string>) => {
			const type = action.payload;
			const count = state.rooms.filter((r) => r.type === type).length;
			const newId = `${type}_${count}`;
			const newLabel = `${ROOM_LABELS[type]} ${count + 1}`;
			state.rooms.push(createNewRoom(type, newId, newLabel, state.globalDefaults));
		},
		removeRoom: (state, action: PayloadAction<string>) => {
			state.rooms = state.rooms.filter((r) => r.id !== action.payload);
		},
		updateRoomField: (
			state,
			action: PayloadAction<{ roomId: string; field: string; value: unknown }>
		) => {
			const room = state.rooms.find((r) => r.id === action.payload.roomId);
			if (room) {
				// @ts-expect-error - Generic assignment
				room[action.payload.field] = action.payload.value;
			}
		},
		toggleRoomCustomization: (
			state,
			action: PayloadAction<{ roomId: string; isCustomized: boolean }>
		) => {
			const room = state.rooms.find((r) => r.id === action.payload.roomId);
			if (room) {
				room.isCustomized = action.payload.isCustomized;
				if (!action.payload.isCustomized) {
					// Revert to all current global defaults
					room.surfaces = { ...state.globalDefaults.surfaces };
					room.wallCondition = state.globalDefaults.wallCondition;
					room.colorChange = state.globalDefaults.colorChange;
					room.ceilingTexture = state.globalDefaults.ceilingTexture;
					room.trimCondition = state.globalDefaults.trimCondition;
					room.trimColorChange = state.globalDefaults.trimColorChange;
					room.crownMoldingStyle = state.globalDefaults.crownMoldingStyle;
					room.crownColorChange = state.globalDefaults.crownColorChange;
					room.doorStyle = state.globalDefaults.doorStyle;
				}
			}
		},
		updatePaintingGlobal: (
			state,
			action: PayloadAction<{ field: keyof PaintingState; value: unknown }>
		) => {
			const { field, value } = action.payload;
			(state as any)[field] = value;
		},
		updateGlobalDefaults: (
			state,
			action: PayloadAction<{ field: string; value: unknown }>
		) => {
			const { field, value } = action.payload;
			
			// 1. Update global state
			if (field === 'surfaces') {
				state.globalDefaults.surfaces = { ...(value as any) };
			} else {
				(state.globalDefaults as any)[field] = value;
			}

			// 2. Propagate to non-customized rooms
			state.rooms.forEach(room => {
				if (!room.isCustomized) {
					const restrictions = ROOM_SURFACE_RESTRICTIONS[room.type] || [];
					
					if (field === 'surfaces') {
						const surfaces = { ...(value as PaintingRoom['surfaces']) };
						
						// Enforce restrictions
						restrictions.forEach(restriction => {
							(surfaces as any)[restriction] = false;
						});

						room.surfaces = { ...surfaces };
						
						// Sync counts based on surface visibility
						if (surfaces.doors && (room.doorCount === '0' || !room.doorCount)) {
							room.doorCount = '1';
						} else if (!surfaces.doors) {
							room.doorCount = '0';
						}
						if (surfaces.windows && (room.windowCount === 0 || !room.windowCount)) {
							room.windowCount = 1;
						} else if (!surfaces.windows) {
							room.windowCount = 0;
						}
					} else {
						(room as any)[field] = value;
					}
				}
			});
		},
		resetPainting: () => initialState,
	},
});

// Selectors
export const selectPaintingState = (state: RootState) => state.painting;
export const selectPaintingRooms = (state: RootState) => state.painting.rooms;
export const selectPaintingGlobalDefaults = (state: RootState) => state.painting.globalDefaults;

export const selectPaintingTotalRooms = createSelector(
	[selectPaintingRooms],
	(rooms) => rooms.length
);

export const selectPaintingSelectedRoomTypes = createSelector(
	[selectPaintingRooms],
	(rooms) => Array.from(new Set(rooms.map((r) => r.type)))
);

export const {
	toggleRoomType,
	addRoom,
	removeRoom,
	updateRoomField,
	toggleRoomCustomization,
	updatePaintingGlobal,
	updateGlobalDefaults,
	resetPainting,
} = paintingSlice.actions;

export default paintingSlice.reducer;

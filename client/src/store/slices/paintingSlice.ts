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
		trimConversion: boolean;
		crownMoldingStyle: string;
		doorStyle: string;
	};
	additionalDetails?: string;
}

const initialState: PaintingState = {
	rooms: [],
	paintProvider: 'Standard',
	occupancy: 'Empty',
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
		trimConversion: false,
		crownMoldingStyle: 'Simple',
		doorStyle: 'Slab',
	},
};

const createNewRoom = (
	type: string,
	id: string,
	label: string
): PaintingRoom => {
	const isStairwell = type === 'stairwell';
	// Initialize with defaults, but isCustomized is false so UI will show inheritance
	return {
		id,
		type,
		label,
		size: 'Medium',
		ceilingHeight: isStairwell ? '11ft+' : '8ft',
		windowCount: 1,
		closetSize: 'None',
		isCustomized: false, // NEW: Inheritance flag
		surfaces: { ...initialState.globalDefaults.surfaces }, // Start with global
		wallCondition: initialState.globalDefaults.wallCondition,
		colorChange: initialState.globalDefaults.colorChange,
		ceilingTexture: initialState.globalDefaults.ceilingTexture,
		trimCondition: initialState.globalDefaults.trimCondition,
		trimStyle: 'Simple', // Default
		trimConversion: initialState.globalDefaults.trimConversion,
		doorCount: '1',
		doorStyle: initialState.globalDefaults.doorStyle,
		crownMoldingStyle: initialState.globalDefaults.crownMoldingStyle,
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
					// Apply current globals to new room
					const newRoom = createNewRoom(type, newId, newLabel);
					newRoom.surfaces = { ...state.globalDefaults.surfaces };
					newRoom.wallCondition = state.globalDefaults.wallCondition;
					newRoom.colorChange = state.globalDefaults.colorChange;
					state.rooms.push(newRoom);
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
			// Apply current globals to new room
			const newRoom = createNewRoom(type, newId, newLabel);
			newRoom.surfaces = { ...state.globalDefaults.surfaces };
			newRoom.wallCondition = state.globalDefaults.wallCondition;
			newRoom.colorChange = state.globalDefaults.colorChange;
			state.rooms.push(newRoom);
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
				// @ts-expect-error - Generic assignment to room object
				room[action.payload.field] = action.payload.value;
				
				// Auto-enable customization if a relevant field is changed manually? 
				// Or assume the UI handles setting isCustomized to true before calling this.
				// For now, let UI handle the flag toggling explicitly.
			}
		},
		toggleRoomCustomization: (
			state,
			action: PayloadAction<{ roomId: string; isCustomized: boolean }>
		) => {
			const room = state.rooms.find((r) => r.id === action.payload.roomId);
			if (room) {
				room.isCustomized = action.payload.isCustomized;
				// If turning OFF customization, revert to globals
				if (!action.payload.isCustomized) {
					room.surfaces = { ...state.globalDefaults.surfaces };
					room.wallCondition = state.globalDefaults.wallCondition;
					room.colorChange = state.globalDefaults.colorChange;
				}
			}
		},
		updatePaintingGlobal: (
			state,
			action: PayloadAction<{ field: keyof PaintingState; value: unknown }>
		) => {
			const { field, value } = action.payload;
			// @ts-expect-error - Generic assignment to state object
			state[field] = value as never;
		},
		updateGlobalDefaults: (
			state,
			action: PayloadAction<{ field: string; value: unknown }>
		) => {
			const { field, value } = action.payload;
			// Update the global default store
			if (field === 'surfaces') {
				state.globalDefaults.surfaces = value as any;
			} else if (field === 'wallCondition') {
				state.globalDefaults.wallCondition = value as string;
			} else if (field === 'colorChange') {
				state.globalDefaults.colorChange = value as string;
			} else if (field === 'ceilingTexture') {
				state.globalDefaults.ceilingTexture = value as string;
			} else if (field === 'trimCondition') {
				state.globalDefaults.trimCondition = value as string;
			} else if (field === 'trimConversion') {
				state.globalDefaults.trimConversion = value as boolean;
			} else if (field === 'crownMoldingStyle') {
				state.globalDefaults.crownMoldingStyle = value as string;
			} else if (field === 'doorStyle') {
				state.globalDefaults.doorStyle = value as string;
			}

			// Propagate to all NON-customized rooms
			state.rooms.forEach(room => {
				if (!room.isCustomized) {
					if (field === 'surfaces') room.surfaces = value as any;
					if (field === 'wallCondition') room.wallCondition = value as string;
					if (field === 'colorChange') room.colorChange = value as string;
					if (field === 'ceilingTexture') room.ceilingTexture = value as string;
					if (field === 'trimCondition') room.trimCondition = value as string;
					if (field === 'trimConversion') room.trimConversion = value as boolean;
					if (field === 'crownMoldingStyle') room.crownMoldingStyle = value as string;
					if (field === 'doorStyle') room.doorStyle = value as string;
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
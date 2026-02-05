import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { PaintingRoom } from '@/components/common/estimator/EstimatorTypes';

interface PaintingState {
	rooms: PaintingRoom[];
	paintProvider: string;
	furniture: string;
	additionalDetails?: string;
}

const initialState: PaintingState = {
	rooms: [],
	paintProvider: 'Standard',
	furniture: 'None',
};

const createNewRoom = (
	type: string,
	id: string,
	label: string
): PaintingRoom => {
	const isStairwell = type === 'stairwell';
	return {
		id,
		type,
		label,
		size: 'Medium',
		ceilingHeight: isStairwell ? '11ft+' : '8ft',
		windowCount: 1,
		closetSize: 'None',
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
		trimStyle: 'Simple',
		doorCount: '1',
		doorStyle: 'Slab',
		crownMoldingStyle: 'Simple',
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
					state.rooms.push(createNewRoom(type, newId, newLabel));
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
			state.rooms.push(createNewRoom(type, newId, newLabel));
		},
		removeRoom: (state, action: PayloadAction<string>) => {
			state.rooms = state.rooms.filter((r) => r.id !== action.payload);
		},
		updateRoomField: (
			state,
			action: PayloadAction<{ roomId: string; field: string; value: any }>
		) => {
			const room = state.rooms.find((r) => r.id === action.payload.roomId);
			if (room) {
				// @ts-ignore
				room[action.payload.field] = action.payload.value;
			}
		},
		updatePaintingGlobal: (
			state,
			action: PayloadAction<{ field: string; value: string }>
		) => {
			// @ts-ignore
			state[action.payload.field] = action.payload.value;
		},
		resetPainting: () => initialState,
	},
});

// Selectors
export const selectPaintingState = (state: RootState) => state.painting;
export const selectPaintingRooms = (state: RootState) => state.painting.rooms;

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
	updatePaintingGlobal,
	resetPainting,
} = paintingSlice.actions;

export default paintingSlice.reducer;

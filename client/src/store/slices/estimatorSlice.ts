import {
	createSlice,
	createAsyncThunk,
	type PayloadAction,
} from '@reduxjs/toolkit';
import type {
	FormData,
	Estimate,
	PaintingRoom,
} from '@/components/common/estimator/EstimatorTypes';
import { endpoints } from '@/config/api';

// --- Default/Initial State ---
// We define the initial state of a room here to keep it consistent
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
		// Initialize crownMolding to false
		surfaces: {
			walls: true,
			ceiling: false,
			trim: false,
			doors: false,
			crownMolding: false,
		},
		wallCondition: 'Good',
		colorChange: 'Similar',
		ceilingTexture: 'Flat',
		trimCondition: 'Good',
		doorCount: '1',
		doorStyle: 'Slab',
		// Initialize new fields
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

interface EstimatorState {
	step: number;
	formData: FormData;
	estimate: Estimate | null;
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
}

const initialState: EstimatorState = {
	step: 1,
	formData: {
		services: { painting: false, patching: false, installation: false },
		painting: { rooms: [], paintProvider: '', furniture: '' },
		patching: {
			quantity: '1-3',
			location: ['Wall'],
			largest_size: 'Fist-sized',
			texture: "I don't know",
			scope: 'Patch only',
		},
		installation: {
			project_type: 'New construction',
			sqft: '',
			ceilingHeight: '8 ft',
			scope: 'Hang, tape, finish',
			finish: 'Level 4',
		},
		contact: { name: '', email: '', phone: '' },
	},
	estimate: null,
	status: 'idle',
	error: null,
};

// --- Async Thunk for Gemini ---
export const generateEstimate = createAsyncThunk(
	'estimator/generate',
	async (formData: FormData, { rejectWithValue }) => {
		try {
			// We now fetch from our own backend!
			const response = await fetch(endpoints.estimate, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				throw new Error('Server error: Failed to fetch estimate');
			}

			const result = await response.json();
			return result;
		} catch (err: any) {
			return rejectWithValue(err.message || 'Failed to generate estimate');
		}
	}
);

// --- The Slice ---
export const estimatorSlice = createSlice({
	name: 'estimator',
	initialState,
	reducers: {
		setStep: (state, action: PayloadAction<number>) => {
			state.step = action.payload;
		},
		// Service Toggles
		toggleService: (
			state,
			action: PayloadAction<{
				name: keyof FormData['services'];
				checked: boolean;
			}>
		) => {
			state.formData.services[action.payload.name] = action.payload.checked;
		},

		// --- Painting Logic ---
		toggleRoomType: (
			state,
			action: PayloadAction<{ type: string; isChecked: boolean }>
		) => {
			const { type, isChecked } = action.payload;
			if (isChecked) {
				// Add first room if not exists
				const exists = state.formData.painting.rooms.some(
					(r) => r.type === type
				);
				if (!exists) {
					const newId = `${type}_0`;
					const isMulti = type === 'bedroom' || type === 'bathroom';
					const newLabel = isMulti
						? `${ROOM_LABELS[type]} 1`
						: ROOM_LABELS[type];
					state.formData.painting.rooms.push(
						createNewRoom(type, newId, newLabel)
					);
				}
			} else {
				// Remove all rooms of this type
				state.formData.painting.rooms = state.formData.painting.rooms.filter(
					(r) => r.type !== type
				);
			}
		},
		addRoom: (state, action: PayloadAction<string>) => {
			const type = action.payload;
			const count = state.formData.painting.rooms.filter(
				(r) => r.type === type
			).length;
			const newId = `${type}_${count}`;
			const newLabel = `${ROOM_LABELS[type]} ${count + 1}`;
			state.formData.painting.rooms.push(createNewRoom(type, newId, newLabel));
		},
		removeRoom: (state, action: PayloadAction<string>) => {
			state.formData.painting.rooms = state.formData.painting.rooms.filter(
				(r) => r.id !== action.payload
			);
		},
		updateRoomField: (
			state,
			action: PayloadAction<{ roomId: string; field: string; value: any }>
		) => {
			const room = state.formData.painting.rooms.find(
				(r) => r.id === action.payload.roomId
			);
			if (room) {
				// @ts-ignore - Dynamic assignment is safe here due to payload structure
				room[action.payload.field] = action.payload.value;
			}
		},
		updatePaintingGlobal: (
			state,
			action: PayloadAction<{ field: string; value: string }>
		) => {
			// @ts-ignore
			state.formData.painting[action.payload.field] = action.payload.value;
		},

		// --- Generic Nested Updates (Patching/Installation) ---
		updateNestedForm: (
			state,
			action: PayloadAction<{
				path: 'patching' | 'installation';
				field: string;
				value: any;
			}>
		) => {
			// @ts-ignore
			state.formData[action.payload.path][action.payload.field] =
				action.payload.value;
		},

		// --- Contact ---
		updateContact: (
			state,
			action: PayloadAction<{ field: string; value: string }>
		) => {
			// @ts-ignore
			state.formData.contact[action.payload.field] = action.payload.value;
		},

		resetEstimator: () => initialState,
	},
	extraReducers: (builder) => {
		builder
			.addCase(generateEstimate.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(generateEstimate.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.estimate = action.payload;
				state.step = 4; // Auto-advance to result
			})
			.addCase(generateEstimate.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			});
	},
});

export const {
	setStep,
	toggleService,
	toggleRoomType,
	addRoom,
	removeRoom,
	updateRoomField,
	updatePaintingGlobal,
	updateNestedForm,
	updateContact,
	resetEstimator,
} = estimatorSlice.actions;

export default estimatorSlice.reducer;

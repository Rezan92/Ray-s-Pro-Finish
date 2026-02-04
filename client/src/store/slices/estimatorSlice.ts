import {
	createSlice,
	createAsyncThunk,
	type PayloadAction,
} from '@reduxjs/toolkit';
import type {
	FormData,
	RepairItem,
	EstimatorState,
} from '@/components/common/estimator/EstimatorTypes';
import { endpoints } from '@/config/api';

const initialState: EstimatorState = {
	step: 1, // Temporarily kept for compatibility if needed, but uiSlice is preferred
	formData: {
		services: {
			painting: false,
			patching: false,
			installation: false,
			garage: false,
			basement: false,
		},

		painting: { rooms: [], paintProvider: 'Standard', furniture: 'None' },
		patching: {
			repairs: [],
			smallRepairsDescription: '',
		},

		installation: {
			projectType: 'Wall',
			wallLength: 'Small (Under 10ft)',
			roomSqft: '',
			ceilingHeight: 'Standard (8ft)',
			framing: 'Ready',
			drywallType: 'Standard',
			openings: '0',
			finishLevel: 'Level 4',
			includePaint: false,
		},

		garage: {
			size: '2-Car',
			ceilingHeight: 'Standard (8-9ft)',
			condition: 'Bare Studs',
			includeCeiling: true,
			occupancy: 'Empty',
			services: {
				insulation: true,
				drywall: true,
				painting: true,
			},
			drywallLevel: 'Level 2',
			paintLevel: 'Standard',
		},

		basement: {
			sqft: '',
			ceilingHeight: 'Standard (8ft)',
			condition: 'Bare Concrete',
			numBedrooms: 0,
			rooms: [],
			hasWetBar: false,
			ceilingGrid: '2x4',
			services: {
				framing: true,
				drywall: true,
				painting: true,
				ceilingFinish: 'Drywall',
			},
			perimeterInsulation: 'Standard (Vapor Barrier)',
			soffitWork: 'Average',
			additionalDetails: '',
		},
		contact: { name: '', email: '', phone: '' },
	},
	estimate: null,
	status: 'idle',
	error: null,
};

export const generateEstimate = createAsyncThunk(
	'estimator/generate',
	async (
		payload: { formData: FormData; adminKey: string },
		{ rejectWithValue }
	) => {
		try {
			// Append the admin key as a query parameter
			const url = `${endpoints.estimate}${
				payload.adminKey ? `?admin=${payload.adminKey}` : ''
			}`;

			const response = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload.formData),
			});

			if (!response.ok)
				throw new Error('Server error: Failed to fetch estimate');
			return await response.json();
		} catch (err: any) {
			return rejectWithValue(err.message || 'Failed to generate estimate');
		}
	}
);

export const estimatorSlice = createSlice({
	name: 'estimator',
	initialState,
	reducers: {
		toggleService: (
			state,
			action: PayloadAction<{
				name: keyof FormData['services'];
				checked: boolean;
			}>
		) => {
			state.formData.services[action.payload.name] = action.payload.checked;
		},
		addRepair: (state, action: PayloadAction<RepairItem>) => {
			state.formData.patching.repairs.push(action.payload);
		},

		updateRepair: (state, action: PayloadAction<RepairItem>) => {
			const index = state.formData.patching.repairs.findIndex(
				(r) => r.id === action.payload.id
			);
			if (index !== -1) {
				state.formData.patching.repairs[index] = action.payload;
			}
		},

		removeRepair: (state, action: PayloadAction<string>) => {
			state.formData.patching.repairs = state.formData.patching.repairs.filter(
				(r) => r.id !== action.payload
			);
		},
		updateNestedForm: (
			state,
			action: PayloadAction<{
				path: 'patching' | 'installation' | 'garage' | 'basement' | 'painting';
				field: string;
				value: any;
			}>
		) => {
			// @ts-ignore
			state.formData[action.payload.path][action.payload.field] =
				action.payload.value;
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
				// Note: Step 4 navigation is now handled in EstimatorPage via uiSlice if preferred,
                // but kept here for now as generateEstimate is still in this slice.
			})
			.addCase(generateEstimate.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			});
	},
});

export const {
	toggleService,
	addRepair,
	updateRepair,
	removeRepair,
	updateNestedForm,
	resetEstimator,
} = estimatorSlice.actions;

export default estimatorSlice.reducer;
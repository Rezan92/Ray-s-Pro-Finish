import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { FormData, Estimate } from '@/components/common/estimator/EstimatorTypes';
import { endpoints } from '@/config/api';

interface EstimatorState {
	estimate: Estimate | null;
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
	currentStep: number;
	formErrors: Record<string, string>;
}

const initialState: EstimatorState = {
	estimate: null,
	status: 'idle',
	error: null,
	currentStep: 1,
	formErrors: {},
};

export const generateEstimate = createAsyncThunk(
	'estimator/generate', // Changed action prefix to 'estimator'
	async (
		payload: { formData: FormData; adminKey: string },
		{ rejectWithValue }
	) => {
		try {
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
		} catch (err: unknown) {
			return rejectWithValue(
				err instanceof Error ? err.message : 'Failed to generate estimate'
			);
		}
	}
);

export const estimatorSlice = createSlice({
	name: 'estimator', // Renamed from 'estimation'
	initialState,
	reducers: {
		setStep: (state, action: PayloadAction<number>) => {
			state.currentStep = action.payload;
		},
		setFormError: (
			state,
			action: PayloadAction<{ field: string; message: string }>
		) => {
			state.formErrors[action.payload.field] = action.payload.message;
		},
		clearFormErrors: (state) => {
			state.formErrors = {};
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
				state.currentStep = 4; // Auto-advance to results
			})
			.addCase(generateEstimate.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			});
	},
});

export const { setStep, setFormError, clearFormErrors, resetEstimator } = estimatorSlice.actions;

// Selectors
export const selectEstimatorState = (state: RootState) => state.estimator;
export const selectEstimate = (state: RootState) => state.estimator.estimate;
export const selectEstimatorStatus = (state: RootState) => state.estimator.status;
export const selectEstimatorError = (state: RootState) => state.estimator.error;
export const selectEstimatorStep = (state: RootState) => state.estimator.currentStep;
export const selectEstimatorFormErrors = (state: RootState) => state.estimator.formErrors;

export default estimatorSlice.reducer;
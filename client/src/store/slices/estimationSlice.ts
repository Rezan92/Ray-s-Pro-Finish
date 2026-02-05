import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { FormData, Estimate } from '@/components/common/estimator/EstimatorTypes';
import { endpoints } from '@/config/api';

interface EstimationState {
	estimate: Estimate | null;
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
}

const initialState: EstimationState = {
	estimate: null,
	status: 'idle',
	error: null,
};

export const generateEstimate = createAsyncThunk(
	'estimation/generate',
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
		} catch (err: any) {
			return rejectWithValue(err.message || 'Failed to generate estimate');
		}
	}
);

export const estimationSlice = createSlice({
	name: 'estimation',
	initialState,
	reducers: {
		resetEstimation: () => initialState,
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
			})
			.addCase(generateEstimate.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			});
	},
});

export const { resetEstimation } = estimationSlice.actions;

export const selectEstimate = (state: RootState) => state.estimation.estimate;
export const selectEstimationStatus = (state: RootState) => state.estimation.status;
export const selectEstimationError = (state: RootState) => state.estimation.error;

export default estimationSlice.reducer;

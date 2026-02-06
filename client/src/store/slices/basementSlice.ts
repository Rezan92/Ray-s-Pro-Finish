import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { BasementData } from '@/components/common/estimator/EstimatorTypes';

const initialState: BasementData = {
	sqft: '',
	ceilingHeight: 'Standard (8ft)',
	condition: 'Bare Concrete',
	perimeterInsulation: 'Standard (Vapor Barrier)',
	soffitWork: 'Average',
	rooms: [],
	services: {
		framing: true,
		drywall: true,
		painting: true,
		ceilingFinish: 'Drywall',
	},
	hasWetBar: false,
	ceilingGrid: '2x4',
	additionalDetails: '',
};

export const basementSlice = createSlice({
	name: 'basement',
	initialState,
	reducers: {
		updateBasementField: (
			state,
			action: PayloadAction<{ field: keyof BasementData; value: unknown }>
		) => {
			const { field, value } = action.payload;
			// @ts-expect-error - Generic assignment to state object
			state[field] = value;
		},
		updateBasementService: (
			state,
			action: PayloadAction<{
				field: keyof BasementData['services'];
				value: unknown;
			}>
		) => {
			const { field, value } = action.payload;
			// @ts-expect-error - Generic assignment to state object
			state.services[field] = value;
		},
		resetBasement: () => initialState,
	},
});

// Selectors
export const selectBasementState = (state: RootState) => state.basement;

export const { updateBasementField, updateBasementService, resetBasement } =
	basementSlice.actions;

export default basementSlice.reducer;
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { BasementData } from '@/components/common/estimator/EstimatorTypes';

const initialState: BasementData = {
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
};

export const basementSlice = createSlice({
	name: 'basement',
	initialState,
	reducers: {
		updateBasementField: (
			state,
			action: PayloadAction<{ field: keyof BasementData; value: any }>
		) => {
			// @ts-ignore
			state[action.payload.field] = action.payload.value;
		},
		updateBasementService: (
			state,
			action: PayloadAction<{ field: keyof BasementData['services']; value: any }>
		) => {
			// @ts-ignore
			state.services[action.payload.field] = action.payload.value;
		},
		resetBasement: () => initialState,
	},
});

// Selectors
export const selectBasementState = (state: RootState) => state.basement;

export const { updateBasementField, updateBasementService, resetBasement } =
	basementSlice.actions;

export default basementSlice.reducer;

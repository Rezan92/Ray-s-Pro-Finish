import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { GarageData } from '@/components/common/estimator/EstimatorTypes';

const initialState: GarageData = {
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
	additionalDetails: '',
};

export const garageSlice = createSlice({
	name: 'garage',
	initialState,
	reducers: {
		updateGarageField: (
			state,
			action: PayloadAction<{ field: keyof GarageData; value: any }>
		) => {
			// @ts-ignore
			state[action.payload.field] = action.payload.value;
		},
		updateGarageService: (
			state,
			action: PayloadAction<{ field: keyof GarageData['services']; value: any }>
		) => {
			state.services[action.payload.field] = action.payload.value;
		},
		resetGarage: () => initialState,
	},
});

// Selectors
export const selectGarageState = (state: RootState) => state.garage;

export const { updateGarageField, updateGarageService, resetGarage } =
	garageSlice.actions;

export default garageSlice.reducer;

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { FormData } from '@/components/common/estimator/EstimatorTypes';

interface ServicesState {
	selected: FormData['services'];
}

const initialState: ServicesState = {
	selected: {
		painting: false,
		patching: false,
		installation: false,
		garage: false,
		basement: false,
	},
};

export const servicesSlice = createSlice({
	name: 'services',
	initialState,
	reducers: {
		toggleService: (
			state,
			action: PayloadAction<{
				name: keyof FormData['services'];
				checked: boolean;
			}>
		) => {
			state.selected[action.payload.name] = action.payload.checked;
		},
		resetServices: () => initialState,
	},
});

export const { toggleService, resetServices } = servicesSlice.actions;

export const selectSelectedServices = (state: RootState) => state.services.selected;

export default servicesSlice.reducer;

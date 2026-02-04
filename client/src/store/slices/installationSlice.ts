import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { InstallationData } from '@/components/common/estimator/EstimatorTypes';

const initialState: InstallationData = {
	projectType: 'Wall',
	wallLength: 'Small (Under 10ft)',
	roomSqft: '',
	ceilingHeight: 'Standard (8ft)',
	framing: 'Ready',
	drywallType: 'Standard',
	openings: '0',
	finishLevel: 'Level 4',
	includePaint: false,
	additionalDetails: '',
};

export const installationSlice = createSlice({
	name: 'installation',
	initialState,
	reducers: {
		updateInstallationField: (
			state,
			action: PayloadAction<{ field: keyof InstallationData; value: any }>
		) => {
			// @ts-ignore
			state[action.payload.field] = action.payload.value;
		},
		resetInstallation: () => initialState,
	},
});

// Selectors
export const selectInstallationState = (state: RootState) => state.installation;

export const { updateInstallationField, resetInstallation } =
	installationSlice.actions;

export default installationSlice.reducer;

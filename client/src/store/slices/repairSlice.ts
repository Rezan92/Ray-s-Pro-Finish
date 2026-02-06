import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { RepairItem } from '@/components/common/estimator/EstimatorTypes';

export interface RepairState {
	repairs: RepairItem[];
	smallRepairsDescription: string;
}

const initialState: RepairState = {
	repairs: [],
	smallRepairsDescription: '',
};

export const repairSlice = createSlice({
	name: 'repair',
	initialState,
	reducers: {
		addRepair: (state, action: PayloadAction<RepairItem>) => {
			state.repairs.push(action.payload);
		},
		updateRepair: (state, action: PayloadAction<RepairItem>) => {
			const index = state.repairs.findIndex((r) => r.id === action.payload.id);
			if (index !== -1) {
				state.repairs[index] = action.payload;
			}
		},
		removeRepair: (state, action: PayloadAction<string>) => {
			state.repairs = state.repairs.filter((r) => r.id !== action.payload);
		},
		updateRepairField: (
			state,
			action: PayloadAction<{ field: keyof RepairState; value: unknown }>
		) => {
			const { field, value } = action.payload;
			// @ts-expect-error - Generic assignment to state object
			state[field] = value as never;
		},
		resetRepair: () => initialState,
	},
});

// Selectors
export const selectRepairState = (state: RootState) => state.repair;
export const selectRepairs = (state: RootState) => state.repair.repairs;

export const {
	addRepair,
	updateRepair,
	removeRepair,
	updateRepairField,
	resetRepair,
} = repairSlice.actions;

export default repairSlice.reducer;
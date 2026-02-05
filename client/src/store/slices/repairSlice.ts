import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { RepairItem } from '@/components/common/estimator/EstimatorTypes';

interface RepairState {
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
			action: PayloadAction<{ field: keyof RepairState; value: any }>
		) => {
			// @ts-ignore
			state[action.payload.field] = action.payload.value;
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

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ProjectState {
	projectId: string | null;
	clientId: string | null;
	zipCode: string | null;
	timestamp: string | null;
	contact: {
		name: string;
		email: string;
		phone: string;
	};
}

const initialState: ProjectState = {
	projectId: null,
	clientId: null,
	zipCode: null,
	timestamp: null,
	contact: {
		name: '',
		email: '',
		phone: '',
	},
};

export const projectSlice = createSlice({
	name: 'project',
	initialState,
	reducers: {
		setProjectIds: (
			state,
			action: PayloadAction<{ projectId: string; clientId: string }>
		) => {
			state.projectId = action.payload.projectId;
			state.clientId = action.payload.clientId;
		},
		updateContact: (
			state,
			action: PayloadAction<{ field: 'name' | 'email' | 'phone'; value: string }>
		) => {
			state.contact[action.payload.field] = action.payload.value;
		},
		setZipCode: (state, action: PayloadAction<string>) => {
			state.zipCode = action.payload;
		},
		updateTimestamp: (state) => {
			state.timestamp = new Date().toISOString();
		},
		resetProject: () => initialState,
	},
});

export const {
	setProjectIds,
	updateContact,
	setZipCode,
	updateTimestamp,
	resetProject,
} = projectSlice.actions;

export default projectSlice.reducer;

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Project } from '@/components/common/projectCard/ProjectCard';
import type { Service } from '@/components/common/serviceModal/ServiceModal';

interface UiState {
	isMobileMenuOpen: boolean;
	modal: {
		isOpen: boolean;
		type: 'project' | 'service' | null;
		data: Project | Service | null;
	};
	estimator: {
		currentStep: number;
		isLoading: boolean;
		errors: Record<string, string>;
	};
}

const initialState: UiState = {
	isMobileMenuOpen: false,
	modal: {
		isOpen: false,
		type: null,
		data: null,
	},
	estimator: {
		currentStep: 1,
		isLoading: false,
		errors: {},
	},
};

export const uiSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		toggleMobileMenu: (state, action: PayloadAction<boolean | undefined>) => {
			state.isMobileMenuOpen = action.payload ?? !state.isMobileMenuOpen;
		},
		openProjectModal: (state, action: PayloadAction<Project>) => {
			state.modal.isOpen = true;
			state.modal.type = 'project';
			state.modal.data = action.payload;
		},
		openServiceModal: (state, action: PayloadAction<Service>) => {
			state.modal.isOpen = true;
			state.modal.type = 'service';
			state.modal.data = action.payload;
		},
		closeModal: (state) => {
			state.modal.isOpen = false;
			state.modal.type = null;
			state.modal.data = null;
		},
		closeMobileMenu: (state) => {
			state.isMobileMenuOpen = false;
		},
		// Estimator UI Reducers
		setEstimatorStep: (state, action: PayloadAction<number>) => {
			state.estimator.currentStep = action.payload;
		},
		setEstimatorLoading: (state, action: PayloadAction<boolean>) => {
			state.estimator.isLoading = action.payload;
		},
		setEstimatorError: (
			state,
			action: PayloadAction<{ field: string; message: string }>
		) => {
			state.estimator.errors[action.payload.field] = action.payload.message;
		},
		clearEstimatorErrors: (state) => {
			state.estimator.errors = {};
		},
	},
});

export const {
	toggleMobileMenu,
	openProjectModal,
	openServiceModal,
	closeModal,
	closeMobileMenu,
	setEstimatorStep,
	setEstimatorLoading,
	setEstimatorError,
	clearEstimatorErrors,
} = uiSlice.actions;

export default uiSlice.reducer;
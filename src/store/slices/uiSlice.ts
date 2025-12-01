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
}

const initialState: UiState = {
	isMobileMenuOpen: false,
	modal: {
		isOpen: false,
		type: null,
		data: null,
	},
};

export const uiSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		toggleMobileMenu: (state, action: PayloadAction<boolean | undefined>) => {
			// If value provided, set it; otherwise toggle
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
	},
});

export const {
	toggleMobileMenu,
	openProjectModal,
	openServiceModal,
	closeModal,
	closeMobileMenu,
} = uiSlice.actions;

export default uiSlice.reducer;

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { projectsData } from '@/data/projectsData';
import type { Project } from '@/components/common/projectCard/ProjectCard';

interface ProjectsState {
	allProjects: Project[];
	activeFilter: string;
}

const initialState: ProjectsState = {
	allProjects: projectsData, // Load static data
	activeFilter: 'All',
};

export const projectsSlice = createSlice({
	name: 'projects',
	initialState,
	reducers: {
		setFilter: (state, action: PayloadAction<string>) => {
			state.activeFilter = action.payload;
		},
		// If you ever fetch data from an API, you'd add setProjects here
	},
	selectors: {
		// This 'selector' automatically calculates the filtered list for us!
		selectFilteredProjects: (state) => {
			if (state.activeFilter === 'All') {
				return state.allProjects;
			}
			return state.allProjects.filter((p) => p.tag === state.activeFilter);
		},
		// Selector to get the current active filter
		selectActiveFilter: (state) => state.activeFilter,
		// Helper to get unique tags for the dropdown
		selectProjectCategories: (state) => {
			const tags = new Set(state.allProjects.map((p) => p.tag));
			return ['All', ...Array.from(tags)];
		},
	},
});

export const { setFilter } = projectsSlice.actions;
export const {
	selectFilteredProjects,
	selectActiveFilter,
	selectProjectCategories,
} = projectsSlice.selectors;

export default projectsSlice.reducer;

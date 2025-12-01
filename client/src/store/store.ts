import { configureStore } from '@reduxjs/toolkit';
import estimatorReducer from './slices/estimatorSlice';
import uiReducer from './slices/uiSlice';
import projectsReducer from './slices/projectsSlice';

export const store = configureStore({
	reducer: {
		estimator: estimatorReducer,
		ui: uiReducer,
		projects: projectsReducer,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

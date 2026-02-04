import { configureStore } from '@reduxjs/toolkit';
import estimatorReducer from './slices/estimatorSlice';
import uiReducer from './slices/uiSlice';
import projectsReducer from './slices/projectsSlice';
import projectReducer from './slices/projectSlice';
import paintingReducer from './slices/paintingSlice';
import basementReducer from './slices/basementSlice';
import garageReducer from './slices/garageSlice';
import repairReducer from './slices/repairSlice';
import installationReducer from './slices/installationSlice';

export const store = configureStore({
	reducer: {
		estimator: estimatorReducer,
		ui: uiReducer,
		projects: projectsReducer,
		project: projectReducer,
		painting: paintingReducer,
		basement: basementReducer,
		garage: garageReducer,
		repair: repairReducer,
		installation: installationReducer,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
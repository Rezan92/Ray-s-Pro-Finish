import { configureStore } from '@reduxjs/toolkit';
import estimatorReducer from './slices/estimatorSlice';

export const store = configureStore({
  reducer: {
    estimator: estimatorReducer,
    // We can add uiSlice later for modals if desired
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
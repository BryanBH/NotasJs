import { configureStore } from '@reduxjs/toolkit';
import { cellsReducer } from './slices/cellsSlice';
import { bundleReducer } from './slices/bundleSlice';
import { useDispatch } from 'react-redux';
import { persistMiddleware } from './middleware/persistMiddleware';

export const store = configureStore({
  reducer: {
    cells: cellsReducer,
    bundle: bundleReducer,
  },
  middleware: (gDM) => gDM().prepend(persistMiddleware.middleware),
});

export type Rootstate = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// Export a hook that can be reused to resolve types
export const useAppDispatch: () => AppDispatch = useDispatch;

export * from './slices/cellsSlice';
export * from './slices/bundleSlice';
export * from './asyncThunks';

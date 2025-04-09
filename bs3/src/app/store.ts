import { configureStore } from '@reduxjs/toolkit';
import firestoreReducer, { fetchPosts } from './firestoreSlice';
import geolocatorReducer from './geolocatorSlice';

export const store = configureStore({
  reducer: {
    app: firestoreReducer,
    geolocation: geolocatorReducer,
  },
});

store.dispatch(fetchPosts());

// Optional: export types for use with TypeScript elsewhere
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
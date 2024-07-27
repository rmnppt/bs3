import { configureStore } from '@reduxjs/toolkit'
import firestoreReducer, { fetchPosts } from './firestoreSlice'
import geolocatorSlice from './geolocatorSlice'

export const store = configureStore({
  reducer: {
    app: firestoreReducer,
    geolocation: geolocatorSlice
  }
})

store.dispatch(fetchPosts())
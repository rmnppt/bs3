import { configureStore } from '@reduxjs/toolkit'
import firestoreReducer, { fetchPosts } from '../api/firestoreSlice'

export const store = configureStore({
  reducer: {
    app: firestoreReducer
  }
})

store.dispatch(fetchPosts())
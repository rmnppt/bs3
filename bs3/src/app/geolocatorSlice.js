import { createSlice } from '@reduxjs/toolkit';

export const geolocationSlice = createSlice({
  name: 'geolocation',
  initialState: {
  	location: null, 
  },
  reducers: {
    setLocation: (state, action) => {
      state.location = action.payload;
    },
  },
});

export const { setLocation } = geolocationSlice.actions;

export default geolocationSlice.reducer;
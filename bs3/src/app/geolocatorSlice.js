import { createSlice } from '@reduxjs/toolkit';

export const geolocationSlice = createSlice({
  name: 'geolocation',
  initialState: {
  	location: {
      loaded: false,
      coordinates: { lat: null, lng: null },
      local: false,
    } 
  },
  reducers: {
    setLocation: (state, action) => {
      state.location = action.payload;
    },
  },
});

export const { setLocation } = geolocationSlice.actions;

export default geolocationSlice.reducer;
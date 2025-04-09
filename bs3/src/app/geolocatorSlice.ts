import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Location {
  loaded: boolean;
  coordinates: {
    lat: number | null;
    lng: number | null;
  };
  local: boolean;
}

interface GeolocationState {
  location: Location;
}

const initialState: GeolocationState = {
  location: {
    loaded: false,
    coordinates: { lat: null, lng: null },
    local: false,
  },
};

export const geolocationSlice = createSlice({
  name: 'geolocation',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<Location>) => {
      state.location = action.payload;
    },
  },
});

export const { setLocation } = geolocationSlice.actions;
export default geolocationSlice.reducer;
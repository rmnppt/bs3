import React, { useEffect } from 'react';
import './App.css';
import BottomAppBar from './components/bottom-app-bar';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLocation } from './app/geolocatorSlice';
import useGeoLocationCheck from './api/geolocation';

function App() {
  const dispatch = useDispatch();
  const geoLocation = useGeoLocationCheck();

  useEffect(() => {
    if (geoLocation) {
      dispatch(setLocation(geoLocation));
    }
  }, [dispatch, geoLocation]);

  return (
    <div className="App">
      <Outlet />
      <BottomAppBar />
    </div>
  );
}

export default App;
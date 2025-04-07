import './App.css';
import BottomAppBar from './components/bottom-app-bar';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLocation } from './app/geolocatorSlice';
import useGeoLocationCheck from './api/geolocation';
import { useEffect } from 'react';

function App() {
  const dispatch = useDispatch();
  const geoLocation = useGeoLocationCheck(); // Custom hook

  // Use useEffect to dispatch the action only when geoLocation is valid
  useEffect(() => {
    if (geoLocation) {
      dispatch(setLocation(geoLocation));
    }
  }, [dispatch, geoLocation]);

  return (
    <div className="App">
      <Outlet />
      <BottomAppBar></BottomAppBar>
    </div>
  );
}

export default App;

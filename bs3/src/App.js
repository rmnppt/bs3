import './App.css';
import BottomAppBar from './components/bottom-app-bar';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLocation } from './app/geolocatorSlice';
import useGeoLocationCheck from './api/geolocation';

function App() {

  const dispatch = useDispatch();
  const geoLocation = useGeoLocationCheck();
  dispatch(setLocation(geoLocation));

  return (
    <div className="App">
      <Outlet />
      <BottomAppBar></BottomAppBar>
    </div>
  );
}

export default App;

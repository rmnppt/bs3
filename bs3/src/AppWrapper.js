import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLocation } from './app/geolocatorSlice';
import useGeoLocationCheck from './api/geolocation';
import App from './App';

export default function AppWrapper() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const geoLocation = useGeoLocationCheck();

    useEffect(() => {
        dispatch(setLocation(geoLocation));
        setLoading(false);
    }, [dispatch, setLoading, geoLocation]);

    if (loading) {
        return <div>Loading...</div>; // Render a loading state while checking geolocation
    }

    return <App />;
}
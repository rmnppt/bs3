import { useState, useEffect } from "react";

const useGeoLocation = () => {
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: null, lng: null },
  });

  const onSuccess = (location) => {
    setLocation({
      loaded: true,
      coordinates: {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      },
    });
  };

  const onError = (error) => {
    setLocation({
      loaded: true,
      error: {
        code: error.code,
        message: error.message,
      },
    });
  };

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      onError({
        code: 0,
        message: "Geolocation not supported",
      });
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 60,
    });
  }, []);

  return location;
};


const isUserLocal = () => {

    const location = useGeoLocation();

    const LAT_MIN = -2.6485976706726055;
    const LAT_MAX = -2.5743893376966813;
    const LNG_MIN = 51.42082059829641;
    const LNG_MAX = 51.45543490194706;

    if (location.loaded && location.coordinates.lat && location.coordinates.lng) {
        const { lat, lng } = location.coordinates;
        if ( lat >= LAT_MIN && lat <= LAT_MAX && lng >= LNG_MIN && lng <= LNG_MAX ) {
            return true;
        }
    }

    return false;

}

export default isUserLocal;

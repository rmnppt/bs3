import { useState, useEffect, useCallback } from "react";

interface Coordinates {
  lat: number | null;
  lng: number | null;
}

interface LocationState {
  loaded: boolean;
  coordinates: Coordinates;
  local: boolean;
  error?: {
    code: number;
    message: string;
  };
}

const options: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
};

const useGeoLocationCheck = (): LocationState => {
  const [location, setLocation] = useState<LocationState>({
    loaded: false,
    coordinates: { lat: null, lng: null },
    local: false,
  });

  const isLocal = (location: GeolocationPosition): boolean => {
    const LNG_MIN = -2.6485976706726055;
    const LNG_MAX = -2.5743893376966813;
    const LAT_MIN = 51.42082059829641;
    const LAT_MAX = 51.45543490194706;

    const lat = location.coords.latitude;
    const lng = location.coords.longitude;

    if (lat && lng) {
      if (lat >= LAT_MIN && lat <= LAT_MAX && lng >= LNG_MIN && lng <= LNG_MAX) {
        console.log("Local location detected");
        return true;
      } else {
        console.log("Non-local location detected");
        return false;
      }
    } else {
      console.log("Location is not available");
      return false;
    }
  };

  const onSuccess = useCallback((location: GeolocationPosition): void => {
    console.log("Location obtained: ", location);
    setLocation({
      loaded: true,
      coordinates: {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      },
      local: isLocal(location),
    });
  }, []);

  const onError = useCallback((error: GeolocationPositionError): void => {
    console.log("Error while obtaining geolocation: ", error);
    setLocation({
      loaded: true,
      coordinates: { lat: null, lng: null },
      local: false,
      error: {
        code: error.code,
        message: error.message,
      },
    });
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions.query({ name: "geolocation" as PermissionName }).then((result) => {
        if (result.state === "granted") {
          navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
        } else if (result.state === "prompt") {
          navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
        } else {
          console.log("Geolocation permission denied");
        }
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, [onSuccess, onError, location.loaded]);

  return location;
};

export default useGeoLocationCheck;

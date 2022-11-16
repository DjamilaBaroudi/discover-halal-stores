import { useState } from "react"

const useTrackLocation = () => {

    const [locationErrorMessage, setLocationErrorMessage] = useState('');
    const [latLong, setLatLong] = useState('');
    const [isFindingLocation, setIsFindingLocation] = useState(false);

    const success = (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setLatLong(`${latitude},${longitude}`);
        setLocationErrorMessage('');
        setIsFindingLocation(false);
    }

    const error = () => {
        setLocationErrorMessage('Unable to retrieve a location');
        setIsFindingLocation(false);
    }
    const handleTrackLocation = () => {
        setIsFindingLocation(true);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            setLocationErrorMessage("Geolocation is not supported by this browser.");
            setIsFindingLocation(false);
        }

    }

    return {
        latLong,
        handleTrackLocation,
        locationErrorMessage,
        isFindingLocation
    }
}

export default useTrackLocation;
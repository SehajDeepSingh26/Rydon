import React, { useEffect } from 'react';
import { loadGoogleMap } from 'google-map-directions';


const LiveDistanceTracking = () => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const pointA = { lat: 37.7749, lng: -122.4194 }; // Example: San Francisco
    const pointB = { lat: 34.0522, lng: -118.2437 }; // Example: Los Angeles

    useEffect(() => {
        // Load the map and directions after the component has mounted
        try {
            if (typeof window !== 'undefined') {
                loadGoogleMap(apiKey, 'mapContainer', pointA, pointB);
            }
        }
        catch (error) {
            console.log(error)
        }
    }, [apiKey, pointA, pointB]);

    return (
        <div id="mapContainer" style={{ width: '100%', height: '500px' }}>
            Loading map...
        </div>
    );
};

export default LiveDistanceTracking;
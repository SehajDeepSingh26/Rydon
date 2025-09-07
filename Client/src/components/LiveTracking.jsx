import { useContext, useEffect, useState } from "react";
import {
    LoadScript,
    GoogleMap,
    Marker,
    DirectionsRenderer,
    Polyline,
} from "@react-google-maps/api";
import { SocketContext } from "../context/SocketContext";
import { RideContext } from "../context/RideContext";
import axios from "axios";

const containerStyle = {
    width: "100%",
    height: "100%",
};

const center = {
    lat: 25,
    lng: 71,
};

// Dotted line styling
const dottedLineOptions = {
    strokeColor: "#0000ff",
    strokeOpacity: 0,
    icons: [
        {
            icon: {
                path: "M 0,-1 0,1", // short vertical line (dot)
                strokeOpacity: 1,
                scale: 4,
            },
            offset: "0",
            repeat: "20px", // space between dots
        },
    ],
};

const LiveTracking = () => {
    const [currentPosition, setCurrentPosition] = useState(center);
    const [captainPosition, setCaptainPosition] = useState(null);
    const [pickupLocation, setPickupLocation] = useState(center);
    const [destinationLocation, setDestinationLocation] = useState(center);
    const [directions, setDirections] = useState(null);

    const role = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const { socket } = useContext(SocketContext);
    const { newRide } = useContext(RideContext);

    // Track current user's location
    useEffect(() => {
        let watchId;
        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition((position) => {
                const { latitude, longitude } = position.coords;
                setCurrentPosition({ lat: latitude, lng: longitude });
            });
        }
        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    // Listen for captain's location from socket
    useEffect(() => {
        if (role === "users" && socket) {
            const handleCaptainCoordinates = (data) => {
                console.log("getting captain's cords");
                setCaptainPosition({
                    lat: data.ltd,
                    lng: data.lng,
                });
            };
            socket.on("captain-coordinates", handleCaptainCoordinates);
            return () => {
                socket.off("captain-coordinates", handleCaptainCoordinates);
            };
        }
    }, [socket, role]);

    // Fetch pickup and destination coordinates
    useEffect(() => {
        const fetchCoords = async () => {
            let pickupCoords = null;
            let destCoords = null;

            if (newRide?.pickup) {
                try {
                    const response = await axios.get(
                        `${import.meta.env.VITE_BASE_URL}/maps/get-cordinates`,
                        {
                            params: { address: newRide.pickup },
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    pickupCoords = {
                        lat: response.data.ltd,
                        lng: response.data.lng,
                    };
                    setPickupLocation(pickupCoords);
                } catch (error) {
                    console.error("Error fetching pickup coords:", error);
                }
            }

            if (newRide?.destination) {
                try {
                    const response = await axios.get(
                        `${import.meta.env.VITE_BASE_URL}/maps/get-cordinates`,
                        {
                            params: { address: newRide.destination },
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    destCoords = {
                        lat: response.data.ltd,
                        lng: response.data.lng,
                    };
                    setDestinationLocation(destCoords);
                } catch (error) {
                    console.error("Error fetching destination coords:", error);
                }
            }

            if (pickupCoords && destCoords && window.google) {
                const directionsService = new window.google.maps.DirectionsService();
                directionsService.route(
                    {
                        origin: pickupCoords,
                        destination: destCoords,
                        travelMode: window.google.maps.TravelMode.DRIVING,
                    },
                    (result, status) => {
                        if (status === "OK") {
                            setDirections(result);
                        } else {
                            console.error("Directions request failed:", status);
                        }
                    }
                );
            }
        };
        fetchCoords();
    }, [newRide, token]);

    // Decide what is captain's own location
    const captainLoc = role === "users" ? captainPosition : currentPosition;

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={currentPosition}
                zoom={14}
            >
                {/* Current position */}
                <Marker position={currentPosition} label="ME" />

                {/* Captain marker */}
                {role === "users" && newRide && (
                    <Polyline
                        path={[currentPosition, pickupLocation]}
                        options={dottedLineOptions}
                    />
                )}

                {/* Pickup & Destination markers */}
                {newRide?.pickup && <Marker position={pickupLocation} label="A" />}
                {newRide?.destination && <Marker position={destinationLocation} label="B" />}

                {/* Route line */}
                {directions && <DirectionsRenderer directions={directions} />}

                {/* Dotted path Captain -> Pickup */}
                {newRide?.pickup && captainLoc && (
                    <Polyline
                        path={[captainLoc, pickupLocation]}
                        options={dottedLineOptions}
                    />
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default LiveTracking;

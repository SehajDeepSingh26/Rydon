import React, { useContext } from 'react'
import { RideContext } from '../context/RideContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const ConfirmRide = (props) => {
    const {
        pickup,
        destination,
        vehicleType,
        fares,
        isLoading,
        setIsLoading
    } = useContext(RideContext);

    const token = localStorage.getItem('token');

    const confirmThisRide = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/create`,
                { pickup, destination, vehicleType },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success !== true)
                throw new Error("Failed to confirm ride");

            console.log("Ride confirmed:", response.data);

            props.setVehicleFound(true);
            props.setConfirmRidePanel(false);

        } catch (error) {
            toast.error(error)
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Vehicle images map
    const vehicleImages = {
        car: "https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg",
        moto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
        auto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png"
    };

    return (
        <div>
            <h5
                className="p-1 text-center w-[93%] absolute top-0"
                onClick={() => props.setConfirmRidePanel(false)}
            >
                <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
            </h5>

            <h3 className="text-2xl font-semibold mb-5">Confirm your Ride</h3>

            <div className="flex gap-2 justify-between flex-col items-center">
                <img className="h-20" src={vehicleImages[vehicleType]} alt={vehicleType} />

                <div className="w-full mt-5">
                    <div className="flex items-center gap-5 p-3 border-b-2">
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className="text-lg font-medium">{pickup}</h3>
                            <p className="text-sm -mt-1 text-gray-600">Start Location</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 p-3 border-b-2">
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className="text-lg font-medium">{destination}</h3>
                            <p className="text-sm -mt-1 text-gray-600">End Location</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 p-3">
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className="text-lg font-medium">
                                ₹{fares?.[vehicleType] ?? "--"}
                            </h3>
                            <p className="text-sm -mt-1 text-gray-600">Cash</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={confirmThisRide}
                    disabled={isLoading}
                    className={`w-full mt-5 font-semibold p-2 rounded-lg text-white ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                        }`}
                >
                    {isLoading ? "Confirming..." : "Confirm"}
                </button>
            </div>
        </div>
    );
};

export default ConfirmRide;

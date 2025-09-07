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
        setIsLoading,
        setNewRide
    } = useContext(RideContext);

    const token = localStorage.getItem('token');

    const createRide = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/create`,
                { pickup, destination, vehicleType },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success !== true)
                throw new Error("Failed to confirm ride");

            setNewRide(response.data.ride);

            props.setLookingForDriverPanel(true);
            props.setConfirmRidePanel(false);

        } catch (error) {
            toast.error(error)
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Vehicle images map
    const getVehicleIcon = (type) => {
        switch (type) {
            case "car":
                return "ri-car-line"
            case "moto":
                return "ri-motorbike-line"
            case "auto":
                return "ri-taxi-line"
            default:
                return "ri-car-line"
        }
    }

    const getVehicleName = (type) => {
        switch (type) {
            case "car":
                return "RydonGo"
            case "moto":
                return "RydonMoto"
            case "auto":
                return "RydonAuto"
            default:
                return "RydonGo"
        }
    }

    return (
        <div>
            <button
                className="p-2 text-center w-full absolute -top-4 left-0 right-0"
                onClick={() => props.setConfirmRidePanel(false)}
            >
                <div className="w-12 h-1 bg-muted-foreground/50 rounded-full mx-auto"></div>
            </button>

            <div className="mb-6">
                <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-2">Confirm Your Ride</h3>
                <p className="text-muted-foreground text-sm md:text-base">Review your trip details before booking</p>
            </div>

            {/* Selected Vehicle */}
            <div className="glass-card p-4 rounded-xl mb-6 border border-primary/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/20 rounded-xl flex items-center justify-center">
                            <i className={`${getVehicleIcon(vehicleType)} text-primary text-xl md:text-2xl`}></i>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground text-base md:text-lg">{getVehicleName(vehicleType)}</h4>
                            <p className="text-muted-foreground text-sm">2-3 mins away</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-lg md:text-xl font-bold text-foreground">₹{fares[vehicleType] || "--"}</h2>
                        <p className="text-muted-foreground text-xs">Estimated fare</p>
                    </div>
                </div>
            </div>

            {/* Trip Details */}
            <div className="space-y-3 mb-8">
                <div className="flex items-start gap-4 p-3 glass-card rounded-xl border border-border">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mt-1">
                        <i className="ri-map-pin-user-fill text-primary"></i>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium text-foreground text-sm md:text-base">{pickup}</h4>
                        <p className="text-muted-foreground text-xs md:text-sm">Pickup location</p>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-3 glass-card rounded-xl border border-border">
                    <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center mt-1">
                        <i className="ri-map-pin-2-fill text-secondary"></i>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium text-foreground text-sm md:text-base">{destination}</h4>
                        <p className="text-muted-foreground text-xs md:text-sm">Destination</p>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-3 glass-card rounded-xl border border-border">
                    <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center mt-1">
                        <i className="ri-currency-line text-accent"></i>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium text-foreground text-sm md:text-base">₹{fares[vehicleType] || "--"}</h4>
                        <p className="text-muted-foreground text-xs md:text-sm">Cash payment</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <button
                    onClick={createRide}
                    className="w-full gradient-primary text-primary-foreground font-semibold py-3 md:py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl text-sm md:text-base"
                >
                    Confirm Ride
                </button>

                <button
                    onClick={() => props.setConfirmRidePanel(false)}
                    className="w-full bg-muted/20 hover:bg-muted/30 text-foreground font-medium py-3 md:py-4 rounded-xl transition-all duration-200 border border-border text-sm md:text-base"
                >
                    Cancel
                </button>
            </div>
        </div>
    )
};

export default ConfirmRide;

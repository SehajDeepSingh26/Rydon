import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RideContext } from '../context/RideContext'
import toast from 'react-hot-toast'
import { DataContext } from '../context/DataContext'
import axios from 'axios'

const FinishRide = (props) => {
    const { newRide, setNewRide } = useContext(RideContext)
    const { captain } = useContext(DataContext)
    const navigate = useNavigate();

    const token = localStorage.getItem('token')

    if (!newRide) {
        return (
            <div className="p-5 text-center text-gray-500">
                Loading ride details...
            </div>
        )
    }

    const handleFinish = async () => {

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/finish-ride`,
                { captainId: captain._id, rideId: newRide._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!response?.data.success)
                throw new Error(response.data.message)

            localStorage.removeItem('rideId')
            toast.success(response.data.message)
            setNewRide(null)

            navigate('/captain-home')
        }
        catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }

    return (
        <div>
            <button
                className="p-2 text-center w-full absolute -top-4 left-0 right-0"
                onClick={() => props.setFinishRidePanel(false)}
            >
                <div className="w-12 h-1 bg-muted-foreground/50 rounded-full mx-auto"></div>
            </button>

            <div className="mb-6">
                <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-2">Finish this Ride</h3>
                <p className="text-muted-foreground text-sm md:text-base">Complete the trip and collect payment</p>
            </div>

            <div className="glass-card p-4 rounded-xl mb-6 border border-primary/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                            <i className="ri-user-line text-primary text-xl"></i>
                        </div>
                        <div>
                            <h4 className="text-lg font-display font-semibold text-foreground capitalize">
                                {newRide?.user?.fullName.firstName + " " + newRide?.user?.fullName.lastName || "Customer Name"}
                            </h4>
                            <p className="text-muted-foreground text-sm">Passenger</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-foreground font-semibold">{newRide?.distance || "0 km"}</p>
                        <p className="text-muted-foreground text-sm">Distance</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3 mb-8">
                <div className="flex items-start gap-4 p-3 glass-card rounded-xl border border-border">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mt-1">
                        <i className="ri-map-pin-user-fill text-primary"></i>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium text-foreground text-sm md:text-base">{newRide?.pickup}</h4>
                        <p className="text-muted-foreground text-xs">Pickup location</p>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-3 glass-card rounded-xl border border-border">
                    <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center mt-1">
                        <i className="ri-map-pin-2-fill text-secondary"></i>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium text-foreground text-sm md:text-base">{newRide?.destination}</h4>
                        <p className="text-muted-foreground text-xs">Destination</p>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-3 glass-card rounded-xl border border-border">
                    <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center mt-1">
                        <i className="ri-currency-line text-accent"></i>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium text-foreground text-sm md:text-base">₹{newRide?.fare || 0}</h4>
                        <p className="text-muted-foreground text-xs">{newRide?.paymentMode || "Cash"}</p>
                    </div>
                </div>
            </div>

            <button
                onClick={handleFinish}
                className="w-full gradient-primary text-primary-foreground font-semibold py-3 md:py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl text-sm md:text-base"
            >
                Finish Ride & Collect Payment
            </button>
        </div>
    )
}

export default FinishRide

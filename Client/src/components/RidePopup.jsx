import { useContext } from "react"
import { RideContext } from "../context/RideContext"
import axios from "axios"
import { DataContext } from "../context/DataContext"
import toast from "react-hot-toast"

const RidePopUp = (props) => {
    const { newRide } = useContext(RideContext)
    const { captain } = useContext(DataContext)
    const token = localStorage.getItem("token")

    const acceptThisRide = async () => {
        props.setRidePopupPanel(false)
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/accept-ride`,
                { ride: newRide, captain },
                { headers: { Authorization: `Bearer ${token}` } },
            )
            if (!response.data.success) throw new Error("Unable to confirm Ride")

            toast.success("Ride accepted")
        } catch (error) {
            toast.error(error.message)
            console.log(error)
            return
        }
    }

    if (!newRide) return null

    return (
        <div>
            <button
                className="p-2 text-center w-full absolute -top-4 left-0 right-0"
                onClick={() => props.setRidePopupPanel(false)}
            >
                <div className="w-12 h-1 bg-muted-foreground/50 rounded-full mx-auto"></div>
            </button>

            <div className="mb-6">
                <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-2">New Ride Available!</h3>
                <p className="text-muted-foreground text-sm md:text-base">A passenger is requesting a ride</p>
            </div>

            <div className="glass-card p-4 rounded-xl mb-6 border border-primary/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                            <i className="ri-user-line text-primary text-xl"></i>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground capitalize text-base md:text-lg">
                                {newRide.user.fullName.firstName + " " + newRide.user.fullName.lastName}
                            </h4>
                            <p className="text-muted-foreground text-sm">Passenger</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-foreground font-semibold text-sm">{newRide.distance}</p>
                        <p className="text-muted-foreground text-xs">{newRide.duration}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4 mb-6">
                <div className="flex items-start gap-4 p-3 glass-card rounded-xl border border-border">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mt-1">
                        <i className="ri-map-pin-user-fill text-primary"></i>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium text-foreground text-sm md:text-base">{newRide.pickup}</h4>
                        <p className="text-muted-foreground text-xs md:text-sm mt-1">{newRide.pickupDesc}</p>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-3 glass-card rounded-xl border border-border">
                    <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center mt-1">
                        <i className="ri-map-pin-2-fill text-secondary"></i>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium text-foreground text-sm md:text-base">{newRide.destination}</h4>
                        <p className="text-muted-foreground text-xs md:text-sm mt-1">{newRide.dropDesc}</p>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-3 glass-card rounded-xl border border-border">
                    <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center mt-1">
                        <i className="ri-currency-line text-accent"></i>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium text-foreground text-sm md:text-base">₹{newRide.fare}</h4>
                        <p className="text-muted-foreground text-xs md:text-sm mt-1">{newRide.paymentMode}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <button
                    onClick={() => {
                        acceptThisRide()
                        props.setConfirmRidePopupPanel(true)
                    }}
                    className="w-full gradient-primary text-primary-foreground font-semibold py-3 md:py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl text-sm md:text-base"
                >
                    Accept Ride
                </button>

                <button
                    onClick={() => props.setRidePopupPanel(false)}
                    className="w-full bg-muted/20 hover:bg-muted/30 text-foreground font-medium py-3 md:py-4 rounded-xl transition-all duration-200 border border-border text-sm md:text-base"
                >
                    Ignore
                </button>
            </div>
        </div>
    )
}

export default RidePopUp

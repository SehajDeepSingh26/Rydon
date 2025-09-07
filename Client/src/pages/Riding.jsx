import { useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { RideContext } from "../context/RideContext"
import toast from "react-hot-toast"
import { SocketContext } from "../context/SocketContext"
import LiveTracking from "../components/LiveTracking"
import Header from "../components/Header"

const Riding = () => {
    const { newRide, setSearchPanel, setNewRide } = useContext(RideContext)
    const { socket } = useContext(SocketContext)
    const navigate = useNavigate()
    const rideId = localStorage.getItem("rideId")

    useEffect(() => {
        if (newRide) 
            setSearchPanel(false)
        else {
            if (!rideId) 
                toast.error("No Ride Ongoing")
            navigate("/home", { replace: true })
        }
    }, [newRide])

    useEffect(() => {
        if (!socket) 
            return null

        const handleFinish = () => {
            toast.success("Ride Finished, Hope you have paid the captain ;)")
            localStorage.removeItem("rideId")
            setNewRide(null)
            setSearchPanel(true)

            navigate("home")
        }

        socket.on("ride-finished", handleFinish)

        return () => {
            socket.off("ride-finished", handleFinish)
        }
    })

    if (!newRide) return null

    const { captain, pickup, destination, fare } = newRide
    const { fullName, vehicle } = captain || {}

    return (
        <div className="h-screen bg-background relative">
            {/* <Header /> */}

            <div className="h-3/5 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-background/20 to-background/60"></div>
                <LiveTracking />
            </div>

            <div className="h-2/5 glass-panel p-4 md:p-6 rounded-t-3xl border-t border-border relative z-20">
                {/* Captain & Vehicle Info */}
                <div className="glass-card p-4 rounded-xl mb-6 border border-border">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/20 rounded-full flex items-center justify-center">
                                <i className="ri-car-line text-primary text-xl md:text-2xl"></i>
                            </div>
                            <div>
                                <h3 className="text-lg md:text-xl font-display font-bold text-foreground">
                                    {fullName?.firstName} {fullName?.lastName}
                                </h3>
                                <p className="text-muted-foreground text-sm md:text-base font-mono">{vehicle?.plate}</p>
                                <p className="text-muted-foreground text-xs md:text-sm capitalize">
                                    {vehicle?.colour} {vehicle?.vehicleType}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                                <i className="ri-phone-line text-primary"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trip Details */}
                <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-4 p-3 glass-card rounded-xl border border-border">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mt-1">
                            <i className="ri-map-pin-user-fill text-primary"></i>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium text-foreground text-sm md:text-base">{pickup}</h4>
                            <p className="text-muted-foreground text-xs md:text-sm">Pickup Location</p>
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
                            <h4 className="font-medium text-foreground text-sm md:text-base">₹{fare}</h4>
                            <p className="text-muted-foreground text-xs md:text-sm">Cash Payment</p>
                        </div>
                    </div>
                </div>

                <button className="w-full gradient-primary text-primary-foreground font-semibold py-3 md:py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl text-sm md:text-base">
                    Make Payment
                </button>
            </div>
        </div>
    )
}

export default Riding

import { useContext, useEffect } from "react"
import { RideContext } from "../context/RideContext"
import { SocketContext } from "../context/SocketContext"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

const WaitingForDriver = (props) => {
    const { newRide, setNewRide } = useContext(RideContext)
    const { socket } = useContext(SocketContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (!socket || !newRide) return

        const handleRideStarted = () => {
            toast.success("Your ride has started!")
            localStorage.setItem("rideId", newRide._id)
            navigate("/riding")
        }

        socket.on("ride-started", handleRideStarted)

        return () => {
            socket.off("ride-started", handleRideStarted)
        }
    }, [socket, newRide])

    if (!newRide) return null

    const { captain } = newRide
    const { fullName, vehicle } = captain || {}

    return (
        <div className="relative">
            <div className="mb-4 text-center">
                <div className="w-12 md:w-16 md:h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="ri-car-line text-white text-xl md:text-2xl"></i>
                </div>
                <h3 className="text-lg md:text-xl font-display font-bold text-foreground mb-1">Driver Found!</h3>
                <p className="text-muted-foreground text-xs md:text-sm">Your driver is on the way</p>
            </div>

            {/* Captain Info */}
            <div className="md:flex w-full justify-between">
                <div className="md:w-2/3 glass-card p-3 rounded-xl mb-4 border border-primary/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/20 rounded-full flex items-center justify-center">
                                <i className="ri-user-line text-primary text-xl md:text-2xl"></i>
                            </div>
                            <div>
                                <h4 className="font-semibold text-foreground text-base md:text-lg capitalize">
                                    {fullName?.firstName} {fullName?.lastName}
                                </h4>
                                <p className="text-muted-foreground text-sm font-mono">{vehicle?.plate}</p>
                                <p className="text-muted-foreground text-xs capitalize">
                                    {vehicle?.colour} {vehicle?.vehicleType}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                                <i className="ri-phone-line text-primary"></i>
                            </div>
                            <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                                <i className="ri-message-3-line text-secondary"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:w-1/3 glass-card p-3 rounded-xl mb-4 border border-accent/30 bg-accent/5">
                    <div className="text-center">
                        <h5 className="font-semibold text-foreground mb-1 text-sm">Your OTP</h5>
                        <div className="text-xl md:text-2xl font-mono font-bold text-accent tracking-widest">
                            {newRide.otp || "0000"}
                        </div>
                        <p className="text-muted-foreground text-xs mt-1">Share with driver</p>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <p className="text-muted-foreground text-s">ETA: 2-3 minutes</p>
                <button
                    onClick={() => {
                        setNewRide(null)
                        props.setWaitingForDriverPanel(false)
                    }}
                    className="text-destructive hover:text-destructive/80 font-medium text-lg transition-colors"
                >
                    Cancel Ride
                </button>
            </div>
        </div>
    )
}

export default WaitingForDriver

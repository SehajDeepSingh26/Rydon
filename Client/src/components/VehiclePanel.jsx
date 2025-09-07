import { useContext } from "react"
import { RideContext } from "../context/RideContext"
import axios from "axios"
import { useEffect } from "react"
import toast from "react-hot-toast"

const VehiclePanel = (props) => {
    const { pickup, destination, setVehicleType, fares, setFares, getFare } = useContext(RideContext)
    const token = localStorage.getItem("token")

    const getFaresTravel = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
                params: { pickup, destination },
                headers: { Authorization: `Bearer ${token}` },
            })

            if (response.data.success != true) throw new Error("Failed to fetch fares")

            setFares(response.data.fares)
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message || "Failed to fetch fares")
            console.log(error)
            return
        }
    }

    useEffect(() => {
        if (getFare) 
            getFaresTravel()
    }, [pickup, destination, getFare])

    return (
        <div>
            <button
                className="p-2 text-center w-full absolute -top-4 left-0 right-0"
                onClick={() => props.setVehiclePanel(false)}
            >
                <div className="w-12 h-1 bg-muted-foreground/50 rounded-full mx-auto"></div>
            </button>

            <div className="mb-6">
                <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-2">Choose a Vehicle</h3>
                <p className="text-muted-foreground text-sm md:text-base">Select your preferred ride type</p>
            </div>

            <div className="space-y-3">
                <div
                    onClick={() => {
                        setVehicleType("car")
                        props.setConfirmRidePanel(true)
                        props.setVehiclePanel(false)
                    }}
                    className="glass-card p-4 rounded-xl cursor-pointer hover:bg-primary/10 transition-all duration-200 border border-border hover:border-primary/50 active:scale-[0.98]"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/20 rounded-xl flex items-center justify-center">
                                <i className="ri-car-line text-primary text-xl md:text-2xl"></i>
                            </div>
                            <div>
                                <h4 className="font-semibold text-foreground text-base md:text-lg flex items-center gap-2">
                                    RydonGo
                                    <span className="text-xs bg-muted/30 px-2 py-1 rounded-full text-muted-foreground">
                                        <i className="ri-user-3-fill mr-1"></i>4
                                    </span>
                                </h4>
                                <p className="text-muted-foreground text-sm">2 mins away</p>
                                <p className="text-muted-foreground text-xs">Affordable, compact rides</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-lg md:text-xl font-bold text-foreground">₹{fares.car ?? "--"}</h2>
                            <p className="text-muted-foreground text-xs">Estimated</p>
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => {
                        setVehicleType("moto")
                        props.setConfirmRidePanel(true)
                        props.setVehiclePanel(false)
                    }}
                    className="glass-card p-4 rounded-xl cursor-pointer hover:bg-primary/10 transition-all duration-200 border border-border hover:border-primary/50 active:scale-[0.98]"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-secondary/20 rounded-xl flex items-center justify-center">
                                <i className="ri-motorbike-line text-secondary text-xl md:text-2xl"></i>
                            </div>
                            <div>
                                <h4 className="font-semibold text-foreground text-base md:text-lg flex items-center gap-2">
                                    RydonMoto
                                    <span className="text-xs bg-muted/30 px-2 py-1 rounded-full text-muted-foreground">
                                        <i className="ri-user-3-fill mr-1"></i>1
                                    </span>
                                </h4>
                                <p className="text-muted-foreground text-sm">3 mins away</p>
                                <p className="text-muted-foreground text-xs">Quick motorcycle rides</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-lg md:text-xl font-bold text-foreground">₹{fares.moto ?? "--"}</h2>
                            <p className="text-muted-foreground text-xs">Estimated</p>
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => {
                        setVehicleType("auto")
                        props.setConfirmRidePanel(true)
                        props.setVehiclePanel(false)
                    }}
                    className="glass-card p-4 rounded-xl cursor-pointer hover:bg-primary/10 transition-all duration-200 border border-border hover:border-primary/50 active:scale-[0.98]"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-accent/20 rounded-xl flex items-center justify-center">
                                <i className="ri-taxi-line text-accent text-xl md:text-2xl"></i>
                            </div>
                            <div>
                                <h4 className="font-semibold text-foreground text-base md:text-lg flex items-center gap-2">
                                    RydonAuto
                                    <span className="text-xs bg-muted/30 px-2 py-1 rounded-full text-muted-foreground">
                                        <i className="ri-user-3-fill mr-1"></i>3
                                    </span>
                                </h4>
                                <p className="text-muted-foreground text-sm">3 mins away</p>
                                <p className="text-muted-foreground text-xs">Comfortable auto rides</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-lg md:text-xl font-bold text-foreground">₹{fares.auto ?? "--"}</h2>
                            <p className="text-muted-foreground text-xs">Estimated</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VehiclePanel

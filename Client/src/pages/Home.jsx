import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef, useState } from "react"
import "remixicon/fonts/remixicon.css"
import LocationSearchPanel from "../components/LocationSearchPanel"
import ConfirmRide from "../components/ConfirmRide"
import VehiclePanel from "../components/VehiclePanel"
import LookingForDriver from "../components/LookingForDriver"
import WaitingForDriver from "../components/WaitingForDriver"
import { useContext } from "react"
import { RideContext } from "../context/RideContext"
import toast from "react-hot-toast"
import { SocketContext } from "../context/SocketContext"
import { useEffect } from "react"
import { DataContext } from "../context/DataContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import LiveTracking from "../components/LiveTracking"
import Header from "../components/Header"

const Home = () => {
    const token = localStorage.getItem("token")
    const rideId = localStorage.getItem("rideId")

    const { setInputField, setPickOrDesti, pickup, setPickup, destination, setDestination, setGetFare, setNewRide } =
        useContext(RideContext)

    const { user, setUser } = useContext(DataContext)
    const { socket } = useContext(SocketContext)

    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const LookingForDriverPanelRef = useRef(null)
    const waitingForDriverRef = useRef(null)

    const [panelOpen, setPanelOpen] = useState(false)
    const { searchPanel } = useContext(RideContext)
    const [vehiclePanel, setVehiclePanel] = useState(false)
    const [confirmRidePanel, setConfirmRidePanel] = useState(false)
    const [LookingForDriverPanel, setLookingForDriverPanel] = useState(false)
    const [waitingForDriverPanel, setWaitingForDriverPanel] = useState(false)

    const navigate = useNavigate()

    const fetchProfile = async () => {
        try {
            const profile = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (profile.data.success) setUser(profile.data.user)
            else {
                toast.error(profile.data.message || "Failed to fetch profile data")
                navigate("/login")
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        }
    }

    const fillRideDetails = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/fetch-ride`,
                { rideId },
                { headers: { Authorization: `Bearer ${token}` } },
            )
            if (!response.data.success) return

            setNewRide(response.data.ride)

            if (response.data.ride.status === "ongoing") navigate("/riding")
        } catch (error) {
            console.log(error)
            localStorage.removeItem("rideId")
        }
    }

    useEffect(() => {
        fetchProfile()
        if (rideId) fillRideDetails()
    }, [])

    useEffect(() => {
        const connectSocket = async () => {
            await socket.emit("join", { userType: "user", userId: user._id })
        }
        connectSocket()
    }, [user])


    const managePickup = (e) => {
        setGetFare(false)
        setPickOrDesti(1)
        setPickup(e.target.value)
        setInputField(e.target.value)
    }
    const manageDestination = (e) => {
        setGetFare(false)
        setPickOrDesti(2)
        setDestination(e.target.value)
        setInputField(e.target.value)
    }

    const handleFindTrip = () => {
        if (pickup && destination) {
            setGetFare(true)
            setVehiclePanel(true)
            setPanelOpen(false)
        } else {
            toast.error("Please enter both pickup and destination!")
        }
    }

    useGSAP(() => {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: "60%",
                padding: 0,
                opacity: 1,
            })
            gsap.to(panelCloseRef.current, {
                opacity: 1,
            })
        } else {
            gsap.to(panelRef.current, {
                height: "0%",
                padding: 0,
                opacity: 0,
            })
            gsap.to(panelCloseRef.current, {
                opacity: 0,
            })
        }
    }, [panelOpen])

    useGSAP(() => {
        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, {
                transform: "translateY(0)",
            })
        } else {
            gsap.to(vehiclePanelRef.current, {
                transform: "translateY(100%)",
            })
        }
    }, [vehiclePanel])

    useGSAP(() => {
        if (confirmRidePanel) {
            gsap.to(confirmRidePanelRef.current, {
                transform: "translateY(0)",
            })
        } else {
            gsap.to(confirmRidePanelRef.current, {
                transform: "translateY(140%)",
            })
        }
    }, [confirmRidePanel])

    useGSAP(() => {
        if (LookingForDriverPanel) {
            gsap.to(LookingForDriverPanelRef.current, {
                transform: "translateY(0)",
            })
        } else {
            gsap.to(LookingForDriverPanelRef.current, {
                transform: "translateY(100%)",
            })
        }
    }, [LookingForDriverPanel])

    useGSAP(() => {
        if (waitingForDriverPanel) {
            gsap.to(waitingForDriverRef.current, {
                transform: "translateY(0)",
            })
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: "translateY(100%)",
            })
        }
    }, [waitingForDriverPanel])

    return (
        <div className="h-screen relative overflow-hidden bg-background">
            <Header />

            <div className="h-2/3 w-screen">
                <div className=" bg-gradient-to-b from-background/20 to-background/40"></div>
                <LiveTracking />
            </div>

            <div className="h-1/3 z-20">
                {searchPanel && (
                    <div className="flex flex-col justify-end h-screen absolute top-0 w-full  30">
                        <div className="h-[30%] p-4 md:p-6 glass-panel relative rounded-t-3xl border-t border-border">
                            <button
                                ref={panelCloseRef}
                                onClick={() => setPanelOpen(false)}
                                className="absolute opacity-0 right-4 md:right-12 mr-24 top-4 md:top-6 text-2xl text-muted-foreground hover:text-foreground transition-colors z-30"
                            >
                                <i className="ri-arrow-down-wide-line"></i>
                            </button>

                            <div className="mb-6">
                                <h4 className="text-xl md:text-2xl font-display font-bold text-foreground mb-2">Find a trip</h4>
                                <p className="text-muted-foreground text-sm md:text-base">Where would you like to go?</p>
                            </div>

                            <form onSubmit={(e) => e.preventDefault()} className="space-y-2 transform -translate-y-1/5">
                                <div className="relative">
                                    <div className="absolute left-4 z-50 top-1/2 ">
                                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                                    </div>
                                    <input
                                        onClick={() => setPanelOpen(true)}
                                        value={pickup}
                                        onChange={(e) => managePickup(e)}
                                        className="w-full  bg-input border border-border rounded-xl pl-12 pr-4 py-3 md:py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm md:text-base"
                                        type="text"
                                        placeholder="Pickup location"
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2  10">
                                        <div className="w-3 h-3 bg-secondary rounded-full"></div>
                                    </div>
                                    <input
                                        onClick={() => setPanelOpen(true)}
                                        value={destination}
                                        onChange={(e) => manageDestination(e)}
                                        className="w-full bg-input border border-border rounded-xl pl-12 pr-4 py-3 md:py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm md:text-base"
                                        type="text"
                                        placeholder="Where to?"
                                    />
                                </div>

                                <div className="absolute left-8 top-[4.5rem] w-0.5 h-6 bg-border"></div>
                            </form>

                            <button
                                className="w-full p-2 gradient-primary text-primary-foreground font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl text-sm md:text-base sticky bottom-0 -translate-y-1/2"
                                onClick={handleFindTrip}
                            >
                                Find Trip
                            </button>
                        </div>

                        <div ref={panelRef} className="glass-panel h-0 overflow-hidden">
                            <LocationSearchPanel />
                        </div>
                    </div>
                )}

                {
                    vehiclePanel && (
                        <div
                            ref={vehiclePanelRef}
                            className="fixed w-full  40 bottom-0 translate-y-full glass-panel px-4 md:px-6 py-6 md:py-10 pt-8 md:pt-12 rounded-t-3xl border-t border-border"
                        >
                            <VehiclePanel setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
                        </div>
                    )
                }

                {
                    confirmRidePanel && (
                        <div
                            ref={confirmRidePanelRef}
                            className="fixed w-full  40 bottom-0 translate-y-full glass-panel px-4 md:px-6 py-6 pt-8 md:pt-12 rounded-t-3xl border-t border-border"
                        >
                            <ConfirmRide setConfirmRidePanel={setConfirmRidePanel} setLookingForDriverPanel={setLookingForDriverPanel} />

                        </div>
                    )
                }

                {
                    LookingForDriverPanel && (
                        <div
                            ref={LookingForDriverPanelRef}
                            className="fixed w-full bottom-0 translate-y-full glass-panel px-4 md:px-6 py-6 pt-8 md:pt-12 rounded-t-3xl border-t border-border"
                        >
                            <LookingForDriver
                                setWaitingForDriverPanel={setWaitingForDriverPanel}
                                setLookingForDriverPanel={setLookingForDriverPanel}
                            />
                        </div>
                    )
                }

                {
                    waitingForDriverPanel && (
                        <div
                            ref={waitingForDriverRef}
                            className="fixed w-full bottom-0 glass-panel px-4 md:px-6 py-4 pt-6 md:pt-8 rounded-t-3xl border-t border-border h-2/5 overflow-y-auto"
                        >
                            <WaitingForDriver setWaitingForDriverPanel={setWaitingForDriverPanel} />
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Home
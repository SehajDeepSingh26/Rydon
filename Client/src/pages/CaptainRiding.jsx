import { useContext, useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import FinishRide from "../components/FinishRide"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { RideContext } from "../context/RideContext"
import toast from "react-hot-toast"
import LiveTracking from "../components/LiveTracking"
import { SocketContext } from "../context/SocketContext"
import Header from "../components/Header"

const CaptainRiding = () => {
    const [finishRidePanel, setFinishRidePanel] = useState(false)
    const { newRide } = useContext(RideContext)
    const { socket } = useContext(SocketContext)
    const finishRidePanelRef = useRef(null)

    const rideId = localStorage.getItem("rideId")
    const navigate = useNavigate()

    useEffect(() => {
        let intervalId

        const updateLocation = async () => {
            if (navigator.geolocation) {
                console.log("hi")
                await navigator.geolocation.getCurrentPosition(
                    (position) => {
                        console.log("socket sending captain cordinates", position.coords)
                        socket.emit("update-captain-ride", {
                            ride: newRide,
                            location: {
                                lng: position.coords.longitude,
                                ltd: position.coords.latitude,
                            },
                        })
                    },
                    (error) => {
                        console.error("Geolocation error:", error)
                    },
                )
            }
        }

        if (socket && newRide) {
            intervalId = setInterval(updateLocation, 1000)
        }

        return () => {
            if (intervalId) clearInterval(intervalId)
        }
    }, [socket, newRide])

    useGSAP(() => {
        if (finishRidePanel) {
            gsap.to(finishRidePanelRef.current, {
                transform: "translateY(0)",
            })
        } else {
            gsap.to(finishRidePanelRef.current, {
                transform: "translateY(100%)",
            })
        }
    }, [finishRidePanel])

    useEffect(() => {
        if (!newRide) {
            if (!rideId) toast.error("No Ride Ongoing")
            navigate("/captain-home")
        }
    }, [newRide, rideId, navigate])

    if (!newRide) return null

    return (
        <div className="h-screen bg-background relative">
            {/* <Header /> */}

            <div className="h-4/5 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-background/20 to-background/60 "></div>
                <LiveTracking />
            </div>

            <div
                className="h-1/5 glass-panel p-4 md:p-6 flex items-center justify-between relative z-20 rounded-t-3xl border-t border-border cursor-pointer hover:bg-primary/5 transition-colors"
                onClick={() => setFinishRidePanel(true)}
            >
                <button className="p-2 text-center w-full absolute -top-4 left-0 right-0">
                    <div className="w-12 h-1 bg-foreground/50 rounded-full mx-auto"></div>
                </button>

                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                        <i className="ri-navigation-line text-primary text-xl"></i>
                    </div>
                    <div>
                        <h4 className="text-lg md:text-xl font-display font-bold text-foreground">{newRide.distance} away</h4>
                        <p className="text-muted-foreground text-sm">Tap to complete ride</p>
                    </div>
                </div>

                <button className="gradient-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg text-sm md:text-base">
                    Complete Ride
                </button>
            </div>

            <div
                ref={finishRidePanelRef}
                className="fixed w-full z-30 bottom-0 translate-y-full glass-panel px-4 md:px-6 py-6 md:py-10 pt-8 md:pt-12 rounded-t-3xl border-t border-border"
            >
                <FinishRide setFinishRidePanel={setFinishRidePanel} />
            </div>
        </div>
    )
}

export default CaptainRiding

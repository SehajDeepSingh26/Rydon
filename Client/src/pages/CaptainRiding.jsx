import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { RideContext } from '../context/RideContext'
import toast from 'react-hot-toast'
import LiveTracking from '../components/LiveTracking'
import { SocketContext } from '../context/SocketContext'

const CaptainRiding = () => {

    const [finishRidePanel, setFinishRidePanel] = useState(false)
    const { newRide } = useContext(RideContext)
    const { socket } = useContext(SocketContext)
    const finishRidePanelRef = useRef(null)

    const rideId = localStorage.getItem('rideId')
    const navigate = useNavigate();

    useEffect(() => {
        let intervalId;

        const updateLocation = async() => {
            if (navigator.geolocation) {
                console.log("hi")
                await navigator.geolocation.getCurrentPosition(
                    (position) => {
                        console.log("socket sending captain cordinates", position.coords);
                        socket.emit("update-captain-ride", {
                            ride: newRide,
                            location: {
                                lng: position.coords.longitude,
                                ltd: position.coords.latitude,
                            },
                        });
                    },
                    (error) => {
                        console.error("Geolocation error:", error);
                    }
                );

            }
        };

        if (socket && newRide) {
            intervalId = setInterval(updateLocation, 1000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [socket, newRide])

    useGSAP(function () {
        if (finishRidePanel) {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [finishRidePanel])

    useEffect(() => {
        if (!newRide) {
            if (!rideId)
                toast.error("No Ride Ongoing");
            navigate('/captain-home');
        }
    }, [newRide, rideId, navigate]);

    if (!newRide)
        return null;

    return (
        <div className='h-screen relative'>

            <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
                <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
                <Link to='/captain-home' className=' h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>
            <div className='h-4/5'>
                <LiveTracking />

            </div>
            <div className='h-1/5 p-6 flex items-center justify-between relative bg-yellow-400 pt-10'
                onClick={() => {
                    setFinishRidePanel(true)
                }}
            >
                <h5 className='p-1 text-center w-[90%] absolute top-0' onClick={() => {

                }}><i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i></h5>
                <h4 className='text-xl font-semibold'>{newRide.distance} away</h4>
                <button className=' bg-green-600 text-white font-semibold p-3 px-10 rounded-lg'>Complete Ride</button>
            </div>
            <div ref={finishRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <FinishRide setFinishRidePanel={setFinishRidePanel} />
            </div>

        </div>
    )
}

export default CaptainRiding
import { useGSAP } from '@gsap/react';
import gsap from "gsap"
import { useRef, useState } from 'react'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import ConfirmRide from '../components/ConfirmRide';
import VehiclePanel from '../components/VehiclePanel';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { useContext } from 'react';
import { RideContext } from '../context/RideContext';
import toast from 'react-hot-toast';
import { SocketContext } from '../context/SocketContext';
import { useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import StartedRideUser from '../components/StartedRideUser';

const Home = () => {
    const token = localStorage.getItem('token')

    const {
        setInputField,
        setPickOrDesti,
        pickup, setPickup,
        destination, setDestination,
        setGetFare
    } = useContext(RideContext)

    const { user, setUser } = useContext(DataContext)

    const { socket } = useContext(SocketContext)

    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)

    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const LookingForDriverPanelRef = useRef(null)
    const waitingForDriverRef = useRef(null)

    const [panelOpen, setPanelOpen] = useState(false);
    const [searchPanel, setSearchPanel] = useState(true);
    const [vehiclePanel, setVehiclePanel] = useState(false)
    const [confirmRidePanel, setConfirmRidePanel] = useState(false)
    const [LookingForDriverPanel, setLookingForDriverPanel] = useState(false)
    const [waitingForDriverPanel, setWaitingForDriverPanel] = useState(false)
    const [rideStartedPanel, setRideStartedPanel] = useState(false)

    const navigate = useNavigate()

    const fetchProfile = async () => {
        try {
            const profile = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (profile.data.success)
                setUser(profile.data.user)
            else {
                toast.error(profile.data.message || "Failed to fetch profile data")
                navigate('/login')
            }
        }
        catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        }
    }

    useEffect(() => {
        fetchProfile();
    }, [])

    useEffect(() => {
        const connectSocket = async () => {
            await socket.emit('join', { userType: "user", userId: user._id })
        }
        connectSocket();
    }, [user])

    const managePickup = (e) => {
        setGetFare(false)
        setPickOrDesti(1);
        setPickup(e.target.value)
        setInputField(e.target.value);
    }
    const manageDestination = (e) => {
        setGetFare(false)
        setPickOrDesti(2)
        setDestination(e.target.value)
        setInputField(e.target.value);
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
                height: '70%',
                padding: 24,
                opacity: 1
            })
            gsap.to(panelCloseRef.current, {
                opacity: 1
            })
        }
        else {
            gsap.to(panelRef.current, {
                height: '0%',
                padding: 0,
                opacity: 0
            })
            gsap.to(panelCloseRef.current, {
                opacity: 0
            })
        }
    }, [panelOpen])

    useGSAP(function () {
        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [vehiclePanel])

    useGSAP(function () {
        if (confirmRidePanel) {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(140%)'
            })
        }
    }, [confirmRidePanel])

    useGSAP(function () {
        if (LookingForDriverPanel) {
            gsap.to(LookingForDriverPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(LookingForDriverPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [LookingForDriverPanel])

    useGSAP(function () {
        if (waitingForDriverPanel) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [waitingForDriverPanel])


    return (
        <div className='h-screen relative overflow-hidden'>
            <img className='w-16 absolute left-5 top-5' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
            <div className='h-screen w-screen'>
                {/* image for temporary use  */}
                <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" />
            </div>
            {
                searchPanel && (
                    <div className=' flex flex-col justify-end h-screen absolute top-0 w-full'>
                        <div className='h-[30%] p-6 bg-white relative'>
                            <h5 ref={panelCloseRef} onClick={() => {
                                setPanelOpen(false)
                            }} className='absolute opacity-0 right-6 top-6 text-2xl'>
                                <i className="ri-arrow-down-wide-line"></i>
                            </h5>

                            <h4 className='text-2xl font-semibold'>Find a trip</h4>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                            }}>
                                <div className="line absolute h-16 w-1 top-[45%] left-10 bg-gray-700 rounded-full"></div>
                                <input
                                    onClick={() => { setPanelOpen(true) }}
                                    value={pickup}
                                    onChange={(e) => {
                                        managePickup(e)
                                    }}
                                    className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-5'
                                    type="text"
                                    placeholder='Add a pick-up location'
                                />
                                <input
                                    onClick={() => {
                                        setPanelOpen(true)
                                    }}
                                    value={destination}
                                    onChange={(e) => {
                                        manageDestination(e)
                                    }}
                                    className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3'
                                    type="text"
                                    placeholder='Enter your destination' />
                            </form>
                            <button
                                className="px-12 py-2 text-lg rounded-lg w-full mt-5 bg-black text-white font-medium "
                                onClick={handleFindTrip}
                            >
                                Find Trip
                            </button>
                        </div>
                        <div ref={panelRef} className='bg-white h-0'>
                            <LocationSearchPanel />
                        </div>
                    </div>
                )
            }

            <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                {
                    vehiclePanel && (
                        <VehiclePanel setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
                    )
                }
            </div>

            <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                {
                    confirmRidePanel && (
                        <ConfirmRide setConfirmRidePanel={setConfirmRidePanel} setLookingForDriverPanel={setLookingForDriverPanel} />
                    )
                }
            </div>

            <div ref={LookingForDriverPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                {
                    LookingForDriverPanel && (
                        <LookingForDriver setWaitingForDriverPanel={setWaitingForDriverPanel} setLookingForDriverPanel={setLookingForDriverPanel} />
                    )
                }
            </div>

            <div ref={waitingForDriverRef} className='fixed w-full z-10 bottom-0  bg-white px-3 py-6 pt-12'>
                {
                    waitingForDriverPanel && (
                        <WaitingForDriver setWaitingForDriverPanel={setWaitingForDriverPanel} setRideStartedPanel={setRideStartedPanel} />
                    )
                }
            </div>
            {
                rideStartedPanel && (
                    <div className='fixed w-full z-10 bottom-0  bg-red text-black px-3 py-6 pt-12'>
                        <StartedRideUser setSearchPanel={setSearchPanel} />
                    </div>
                )
            }
        </div>
    )
}

export default Home

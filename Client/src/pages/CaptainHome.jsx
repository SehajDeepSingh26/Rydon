import { useGSAP } from '@gsap/react'
import { useContext, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopup'
import RidePopUp from '../components/RidePopup'
import CaptainDetails from '../components/CaptainDetails'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { DataContext } from '../context/DataContext'
import { SocketContext } from '../context/SocketContext'
import { RideContext } from '../context/RideContext'
import LiveTracking from '../components/LiveTracking'
import LiveDistanceTracking from '../components/LiveDistanceTracking'

const CaptainHome = () => {
    const { socket } = useContext(SocketContext)
    const { captain, setCaptain } = useContext(DataContext)
    const { setNewRide } = useContext(RideContext)

    const [ridePopupPanel, setRidePopupPanel] = useState(true)
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)

    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)

    const token = localStorage.getItem('token')
    const rideId = localStorage.getItem('rideId')

    const navigate = useNavigate();

    useEffect(() => {
        const fillRideDetails = async () => {
            try {
                 const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/rides/fetch-ride`,
                    { rideId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if(!response.data.success)
                    return;

                setNewRide(response.data.ride)

                if(response.data.ride.status === 'ongoing')
                    navigate('/captain-riding')
            } 
            catch (error) {
                console.log(error)
                localStorage.removeItem('rideId')
            }
        }
        if (rideId)
            fillRideDetails()
    }, [])

    const fetchProfile = async () => {
        try {
            const profile = await axios.get(`${import.meta.env.VITE_BASE_URL}/captain/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (profile.data.success)
                setCaptain(profile.data.data)
            else {
                toast.error(profile.data.message || "Failed to fetch profile data")
                navigate('/captain-login')
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
            await socket.emit('join', { userType: "captain", userId: captain._id })

            const updateLocation = () => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(async (position) => {
                        await socket.emit('update-location-captain', {
                            userId: captain._id,
                            location: {
                                lng: position.coords.longitude,
                                ltd: position.coords.latitude
                            }
                        })
                    })
                }
            }
            updateLocation();
        }
        connectSocket();
    }, [captain._id, socket])

    useEffect(() => {
        const handleMessage = (recv) => {
            setNewRide(recv)
        };
        socket.on('new-ride', handleMessage);

        return () => {
            socket.off('new-ride', handleMessage);
        };
    }, [socket])


    useGSAP(function () {
        if (ridePopupPanel) {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ridePopupPanel])

    useGSAP(function () {
        if (confirmRidePopupPanel) {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [confirmRidePopupPanel])

    return (
        <div className='h-screen'>
            <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
                <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
                <Link to='/home' className=' h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>
            <div className='h-3/5'>
                <LiveTracking />
                {/* <LiveDistanceTracking /> */}

            </div>
            <div className='h-2/5 p-6'>
                <CaptainDetails />
            </div>

            <div ref={ridePopupPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <RidePopUp setRidePopupPanel={setRidePopupPanel} setConfirmRidePopupPanel={setConfirmRidePopupPanel} />
            </div>

            <div ref={confirmRidePopupPanelRef} className='fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <ConfirmRidePopUp setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel} />
            </div>
        </div>
    )
}

export default CaptainHome

import { useGSAP } from '@gsap/react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopup'
import RidePopUp from '../components/RidePopup'
import CaptainDetails from '../components/CaptainDetails'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { DataContext } from '../context/DataContext'
import { SocketContext } from '../context/SocketContext'

const CaptainHome = () => {
    const {socket} = useContext(SocketContext)
    const {captain, setCaptain} = useContext(DataContext)

    const [ridePopupPanel, setRidePopupPanel] = useState(true)
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)

    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)
    const token = localStorage.getItem('token')

    const navigate = useNavigate();

    const fetchProfile = async() => {
        try {
            const profile = await axios.get(`${import.meta.env.VITE_BASE_URL}/captain/profile`, {
                headers: { Authorization: `Bearer ${token}`}
            })

            if(profile.data.success){
                setCaptain(profile.data.data)
                console.log(profile.data.data)
            }
            else{ 
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
        socket.emit('join', {userType: "captain", userId: captain._id})
    }, [captain])


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
                <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" />

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

import React, { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RideContext } from '../context/RideContext'
import toast from 'react-hot-toast'
import { SocketContext } from '../context/SocketContext'
import LiveTracking from '../components/LiveTracking'

const Riding = () => {
    const { newRide, setSearchPanel, setNewRide } = useContext(RideContext)
    const {socket} = useContext(SocketContext)

    const navigate = useNavigate();
    const rideId = localStorage.getItem('rideId')

    useEffect(() => {
        if(newRide)
            setSearchPanel(false)
        else{
            if(!rideId)
                toast.error("No Ride Ongoing");
            navigate('/home', { replace: true }); 
        }
    }, [newRide])

    useEffect(() => {
        if(!socket)
            return null;

        const handleFinish = () => {
            toast.success("Ride Finished, Hope you have paid the captain ;)")
            localStorage.removeItem('rideId')
            setNewRide(null)
            setSearchPanel(true)

            navigate('home')
        }

        socket.on('ride-finished', handleFinish);

        return () => {
            socket.off("ride-finished", handleFinish)
        }
    })

    if (!newRide) 
        return null; 

    const { captain, pickup, destination, fare } = newRide
    const { fullName, vehicle } = captain || {}

    return (
        <div className='h-screen'>
            {/* Home Button */}
            <Link
                to='/home'
                className='fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full shadow'
            >
                <i className="text-lg font-medium ri-home-5-line"></i>
            </Link>

            {/* Ride Animation */}
            <div className='h-5/8'>
                <LiveTracking />
            </div>

            {/* Ride Details */}
            <div className='h-1/3 p-4'>
                {/* Captain & Vehicle */}
                <div className='flex items-center justify-between'>
                    <img
                        className='h-12'
                        src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
                        alt="vehicle"
                    />
                    <div className='text-right'>
                        <h2 className='text-lg font-medium'>
                            {fullName?.firstName} {fullName?.lastName}
                        </h2>
                        <h4 className='text-xl font-semibold -mt-1 -mb-1'>
                            {vehicle?.plate}
                        </h4>
                        <p className='text-sm text-gray-600'>
                            {vehicle?.colour} {vehicle?.vehicleType}
                        </p>
                    </div>
                </div>

                {/* Pickup / Destination / Fare */}
                <div className='flex gap-2 justify-between flex-col items-center'>
                    <div className='w-full mt-5'>
                        {/* Pickup */}
                        <div className='flex items-center gap-5 p-3 border-b-2'>
                            <i className="text-lg ri-map-pin-user-fill"></i>
                            <div>
                                <h3 className='text-lg font-medium'>{pickup}</h3>
                                <p className='text-sm -mt-1 text-gray-600'>Pickup Location</p>
                            </div>
                        </div>

                        {/* Destination */}
                        <div className='flex items-center gap-5 p-3 border-b-2'>
                            <i className="text-lg ri-map-pin-2-fill"></i>
                            <div>
                                <h3 className='text-lg font-medium'>{destination}</h3>
                                <p className='text-sm -mt-1 text-gray-600'>Destination</p>
                            </div>
                        </div>

                        {/* Fare */}
                        <div className='flex items-center gap-5 p-3'>
                            <i className="ri-currency-line"></i>
                            <div>
                                <h3 className='text-lg font-medium'>₹{fare}</h3>
                                <p className='text-sm -mt-1 text-gray-600'>Cash</p>
                            </div>
                        </div>
                    </div>
                </div>

                <button className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg'>
                    Make a Payment
                </button>
            </div>
        </div>
    )
}

export default Riding

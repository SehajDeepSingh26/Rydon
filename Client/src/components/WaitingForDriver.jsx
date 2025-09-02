import React, { useContext, useEffect } from 'react'
import { RideContext } from '../context/RideContext'
import { SocketContext } from '../context/SocketContext'
import toast from 'react-hot-toast'

const WaitingForDriver = (props) => {
    const { newRide } = useContext(RideContext)
    const {socket} = useContext(SocketContext)

    useEffect(() => {
        console.log("socket change hua kuch kuch **********************************************")
        if(!socket)
            return
        const handleRideStarted = () => {
            console.log("======================ride started")
            toast.success("Ride started, Happy Journey !!")
            props.setRideStartedPanel(true)
            props.setWaitingForDriverPanel(false)
        }
        socket.on('ride-started', handleRideStarted)

        return () => {
            socket.off('ride-started', handleRideStarted)
        }
    }, [socket])


    if (!newRide) {
        return null
    }


    const { captain, otp } = newRide
    const { fullName, vehicle, phone } = captain || {}

    return (
        <div>
            <h5
                className="p-1 text-center w-[93%] absolute top-0"
                onClick={() => props.setWaitingForDriverPanel(false)}
            >
                <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
            </h5>

            {/* Title */}
            <h2 className="text-3xl mb-4">WAITING FOR DRIVER</h2>

            {/* Driver & Vehicle Info */}
            <div className="flex items-center justify-between mb-6">
                <img
                    className="h-14"
                    src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
                    alt="vehicle"
                />
                <div className="text-right">
                    <h2 className="text-xl font-semibold">
                        {fullName?.firstName} {fullName?.lastName}
                    </h2>
                    <h4 className="text-lg font-medium -mt-1 -mb-1">
                        {vehicle?.plate}
                    </h4>
                    <p className="text-base text-gray-600">
                        {vehicle?.colour} {vehicle?.vehicleType}
                    </p>
                </div>
            </div>

            {/* Captain Details in Place of Pickup/Destination/Fare */}
            <div className="w-full mt-5">
                {/* Name */}
                <div className="flex items-center gap-5 p-3 border-b-2">
                    <i className="ri-user-3-fill text-lg"></i>
                    <div>
                        <h3 className="text-xl font-semibold">
                            {fullName?.firstName} {fullName?.lastName}
                        </h3>
                        <p className="text-sm -mt-1 text-gray-600">Captain Name</p>
                    </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-5 p-3 border-b-2">
                    <i className="ri-phone-fill text-lg"></i>
                    <div>
                        <h3 className="text-xl font-semibold">{phone}</h3>
                        <p className="text-sm -mt-1 text-gray-600">Contact Number</p>
                    </div>
                </div>

                {/* Vehicle */}
                <div className="flex items-center gap-5 p-3">
                    <i className="ri-car-fill text-lg"></i>
                    <div>
                        <h3 className="text-xl font-semibold">{vehicle?.plate}</h3>
                        <p className="text-sm -mt-1 text-gray-600">
                            {vehicle?.colour} {vehicle?.vehicleType}
                        </p>
                    </div>
                </div>
            </div>

            {/* OTP */}
            <div className="flex justify-center items-center mt-6">
                <div className="bg-gray-200 text-2xl font-bold tracking-widest px-6 py-3 rounded-xl shadow">
                    OTP: {otp}
                </div>
            </div>
        </div>
    )
}

export default WaitingForDriver

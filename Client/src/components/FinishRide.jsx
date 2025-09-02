import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RideContext } from '../context/RideContext'
import toast from 'react-hot-toast'
import { DataContext } from '../context/DataContext'
import axios from 'axios'

const FinishRide = (props) => {
    const { newRide, setNewRide } = useContext(RideContext)
    const {captain} = useContext(DataContext)
    const navigate = useNavigate();

    const token = localStorage.getItem('token')

    if (!newRide) {
        return (
            <div className="p-5 text-center text-gray-500">
                Loading ride details...
            </div>
        )
    }

    const handleFinish = async() => {

        try {
             const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/finish-ride`,
                { captainId: captain._id, rideId: newRide._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if(!response?.data.success)
                throw new Error(response.data.message)

            localStorage.removeItem('rideId')
            toast.success(response.data.message)
            setNewRide(null)
            
            navigate('/captain-home')
        } 
        catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }

    return (
        <div>
            <h5
                className='p-1 text-center w-[93%] absolute top-0'
                onClick={() => {
                    props.setFinishRidePanel(false)
                }}
            >
                <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
            </h5>

            <h3 className='text-2xl font-semibold mb-5'>Finish this Ride</h3>

            <div className='flex items-center justify-between p-4 border-2 border-yellow-400 rounded-lg mt-4'>
                <div className='flex items-center gap-3'>
                    <img
                        className='h-12 w-12 rounded-full object-cover'
                        src={"https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"}
                        alt="customer"
                    />
                    <h2 className='text-lg font-medium capitalize'>
                        {newRide?.user?.fullName.firstName + " " +  newRide?.user?.fullName.lastName || "Customer Name"}
                    </h2>
                </div>
                <h5 className='text-lg font-semibold'>
                    {newRide?.distance || "0 km"}
                </h5>
            </div>

            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>{newRide?.pickup}</h3>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>{newRide?.destination}</h3>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹{newRide?.fare || 0}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{newRide?.paymentMode || "Cash"}</p>
                        </div>
                    </div>
                </div>

                <div className='mt-10 w-full'>
                    <Link
                        onClick={handleFinish}
                        className='w-full mt-5 flex text-lg justify-center bg-green-600 text-white font-semibold p-3 rounded-lg'
                    >
                        Finish Ride
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default FinishRide

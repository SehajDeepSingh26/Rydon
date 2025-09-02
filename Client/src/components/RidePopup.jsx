import { useContext } from "react"
import { RideContext } from "../context/RideContext"
import axios from "axios"
import { DataContext } from "../context/DataContext"
import toast from "react-hot-toast"
import { SocketContext } from "../context/SocketContext"

const RidePopUp = (props) => {
    const { newRide } = useContext(RideContext) 
    const { captain} = useContext(DataContext)
    const token = localStorage.getItem('token')

    const acceptThisRide = async() => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/accept-ride`,
                { ride: newRide, captain },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if(!response.data.success)
                throw new Error("Unable to confirm Ride")
    
            console.log(response)
            toast.success("Ride accepted")
        } 
        catch (error) {
            toast.error(error.message)
            console.log(error)
            return;
        }
    }

    if (!newRide) return null 

    return (
        <div>
            <h5
                className="p-1 text-center w-[93%] absolute top-0"
                onClick={() => props.setRidePopupPanel(false)}
            >
                <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
            </h5>

            <h3 className="text-2xl font-semibold mb-5">New Ride Available!</h3>

            <div className="flex items-center  gap-48 p-3 bg-yellow-400 rounded-lg mt-4">
                <div className="flex items-center gap-3 ">
                    <img className='h-12 rounded-full object-cover w-12' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="" />
                    <p className="text-lg font-semibold capitalize">{newRide.user.fullName.firstName + " " + newRide.user.fullName.lastName}</p>
                </div>
                <h5 className="text-lg font-semibold">Distance: {newRide.distance}</h5>
                <h5 className="text-lg font-semibold">Duration: {newRide.duration}</h5>
            </div>

            {/* Ride Details */}
            <div className="flex gap-2 justify-between flex-col items-center">
                <div className="w-full mt-5">
                    <div className="flex items-center gap-5 p-3 border-b-2">
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className="text-lg font-medium">{newRide.pickup}</h3>
                            <p className="text-sm -mt-1 text-gray-600">
                                {newRide.pickupDesc}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-5 p-3 border-b-2">
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className="text-lg font-medium">{newRide.destination}</h3>
                            <p className="text-sm -mt-1 text-gray-600">
                                {newRide.dropDesc}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-5 p-3">
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className="text-lg font-medium">₹{newRide.fare}</h3>
                            <p className="text-sm -mt-1 text-gray-600">{newRide.paymentMode}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-5 w-full">
                    <button
                        onClick={() => {
                            acceptThisRide();
                            props.setConfirmRidePopupPanel(true)
                        }}
                        className=" bg-green-600 w-full text-white font-semibold p-2 px-10 rounded-lg"
                    >
                        Accept
                    </button>

                    <button
                        onClick={() => {
                            props.setRidePopupPanel(false)
                        }}
                        className="mt-2 w-full bg-gray-300 text-gray-700 font-semibold p-2 px-10 rounded-lg"
                    >
                        Ignore
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RidePopUp

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import { DataContext } from "../context/DataContext"
import toast from "react-hot-toast"
import { useContext } from 'react'
import { RideContext } from '../context/RideContext'

const ConfirmRidePopUp = (props) => {
    const [otp, setOtp] = useState('')
    const { newRide } = useContext(RideContext)
    const token = localStorage.getItem('token')

    const navigate = useNavigate();

    if (!newRide)
        return null

    const StartRide = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/confirm-ride`,
                { rideId: newRide._id, otp },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!response?.data.success) {
                toast.error(response.data.message)
            }
            else {
                localStorage.setItem('rideId', newRide._id)

                toast.success(response?.data.message)
                props.setRidePopupPanel(false)
                props.setConfirmRidePopupPanel(false)
                navigate('/captain-riding')
            }
        }
        catch (error) {
            toast.error(error.response.data.message)
            console.log(error)
        }
    }

    const submitHander = (e) => {
        e.preventDetault()
    }
    return (
        <div className=''>
            <button
                className="p-2 text-center w-full absolute -top-4 left-0 right-0"
                onClick={() => props.setConfirmRidePopupPanel(false)}
            >
                <div className="w-12 h-1 bg-muted-foreground/50 rounded-full mx-auto"></div>
            </button>

            <div className="mb-6">
                <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-2">Confirm Ride to Start</h3>
                <p className="text-muted-foreground text-sm md:text-base">Enter the OTP provided by the passenger</p>
            </div>

            <div className="glass-card p-4 rounded-xl mb-6 border border-primary/30">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                        <i className="ri-user-line text-primary text-xl"></i>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-foreground capitalize text-base md:text-lg">
                            {newRide?.user.fullName.firstName + " " + newRide?.user.fullName.lastName}
                        </h4>
                        <p className="text-muted-foreground text-sm">{newRide.distance}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={(e) => submitHander(e)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Enter OTP</label>
                    <input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        type="text"
                        className="w-full bg-input border border-border rounded-xl px-4 py-3 md:py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all font-mono text-lg md:text-xl text-center tracking-widest"
                        placeholder="000000"
                        maxLength="6"
                    />
                </div>

                <div className="space-y-3">
                    <button
                        onClick={StartRide}
                        className="w-full gradient-primary text-primary-foreground font-semibold py-3 md:py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl text-sm md:text-base"
                    >
                        Confirm & Start Ride
                    </button>

                    <button
                        onClick={() => {
                            props.setConfirmRidePopupPanel(false)
                            props.setRidePopupPanel(false)
                        }}
                        className="w-full bg-destructive/20 hover:bg-destructive/30 text-destructive font-medium py-3 md:py-4 rounded-xl transition-all duration-200 border border-destructive/30 text-sm md:text-base"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ConfirmRidePopUp
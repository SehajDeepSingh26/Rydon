"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"

const CaptainSignup = () => {
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [vehicleColor, setVehicleColor] = useState("")
    const [vehiclePlate, setVehiclePlate] = useState("")
    const [vehicleCapacity, setVehicleCapacity] = useState("")
    const [vehicleType, setVehicleType] = useState("")
    const [otp, setOtp] = useState()
    const [otpField, setOtpField] = useState(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const id = localStorage.getItem("id")

    useEffect(() => {
        if (id === "users") navigate("/home")
        if (id === "captain") navigate("/captain-home")
    }, [id, navigate])

    const submitHandler = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        if (!otp) {
            await sendOtp()
            return
        }

        const captainData = {
            fullName: {
                firstName: firstName,
                lastName: lastName,
            },
            email: email,
            password: password,
            vehicle: {
                colour: vehicleColor,
                plate: vehiclePlate,
                capacity: vehicleCapacity,
                vehicleType: vehicleType,
            },
            otp: otp,
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captain/register`, captainData)

            if (response.data.success === true) {
                toast.success("Captain account created! Please login.")

                setEmail("")
                setFirstName("")
                setLastName("")
                setPassword("")
                setVehicleColor("")
                setVehiclePlate("")
                setVehicleCapacity("")
                setVehicleType("")
                setOtp("")
                setOtpField(false)
                setError("")
                navigate("/captain-login")
            } else {
                toast.error(response.data.message || "Registration failed")
                setError(response.data.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || "Registration failed")
            setError(error?.response?.data?.message || error.message || "Registration failed")
        } finally {
            setIsLoading(false)
        }
    }

    const sendOtp = async () => {
        try {
            setOtp("")
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/captain/send-otp`, { email })
            if (res.data.success === true) {
                setOtpField(true)
                toast.success("OTP sent to your email!")
            } else setError(res.data.message)
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || "Failed to send OTP")
            setError(error?.response?.data?.message || error.message || "Failed to send OTP")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-green-50 to-secondary/10">
            <div className="p-6 md:p-8 min-h-screen flex flex-col justify-between max-w-md mx-auto">
                {/* Header */}
                <div>
                    <div className="flex items-center justify-center mb-8">
                        <div className="bg-white rounded-2xl p-4 shadow-lg">
                            <svg className="w-12 h-12 md:w-16 md:h-16 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                        </div>
                    </div>

                    <div className="bg-card rounded-3xl p-6 md:p-8 shadow-2xl border border-border/50">
                        <div className="text-center mb-6">
                            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">Join Our Fleet</h1>
                            <p className="text-muted-foreground">Start earning as a Rydon captain</p>
                        </div>

                        <form onSubmit={submitHandler} className="space-y-4">
                            {/* Personal Information */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Captain Name</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        required
                                        className="bg-input border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                        type="text"
                                        placeholder="First name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                    <input
                                        required
                                        className="bg-input border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                        type="text"
                                        placeholder="Last name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                                <input
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                    type="email"
                                    placeholder="email@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                                <input
                                    required
                                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    placeholder="Create a strong password"
                                />
                            </div>

                            {/* Vehicle Information */}
                            <div className="pt-4 border-t border-border">
                                <h3 className="text-lg font-display font-semibold text-foreground mb-4">Vehicle Information</h3>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground mb-1">Color</label>
                                        <input
                                            required
                                            className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                            type="text"
                                            placeholder="Vehicle Color"
                                            value={vehicleColor}
                                            onChange={(e) => setVehicleColor(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground mb-1">License Plate</label>
                                        <input
                                            required
                                            className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                            type="text"
                                            placeholder="ABC-1234"
                                            value={vehiclePlate}
                                            onChange={(e) => setVehiclePlate(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground mb-1">Capacity</label>
                                        <input
                                            required
                                            className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                            type="number"
                                            placeholder="4"
                                            value={vehicleCapacity}
                                            onChange={(e) => setVehicleCapacity(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground mb-1">Type</label>
                                        <select
                                            required
                                            className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                            value={vehicleType}
                                            onChange={(e) => setVehicleType(e.target.value)}
                                        >
                                            <option value="" disabled>
                                                Select Type
                                            </option>
                                            <option value="car">🚗 Car</option>
                                            <option value="auto">🛺 Auto</option>
                                            <option value="moto">🏍️ Moto</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {otpField && (
                                <div className="animate-slide-up pt-4 border-t border-border">
                                    <label className="block text-sm font-medium text-foreground mb-2">Verification Code</label>
                                    <div className="flex gap-3">
                                        <input
                                            required
                                            className="flex-1 bg-input border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="Enter OTP"
                                        />
                                        <button
                                            type="button"
                                            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium px-4 py-3 rounded-xl transition-all"
                                            onClick={() => sendOtp()}
                                        >
                                            Resend
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl mt-6"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2"></div>
                                        {otpField ? "Creating Account..." : "Sending OTP..."}
                                    </div>
                                ) : otpField ? (
                                    "Create Captain Account"
                                ) : (
                                    "Send Verification Code"
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-muted-foreground">
                                Already a captain?{" "}
                                <Link to="/captain-login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                                    Sign In
                                </Link>
                            </p>
                        </div>

                        {error && (
                            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl">
                                <p className="text-destructive text-sm text-center">{error}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6">
                    <p className="text-xs text-muted-foreground text-center leading-relaxed">
                        This site is protected by reCAPTCHA and the <span className="underline">Google Privacy Policy</span> and{" "}
                        <span className="underline">Terms of Service</span> apply.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CaptainSignup

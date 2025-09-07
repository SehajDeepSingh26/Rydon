import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { DataContext } from "../context/DataContext"
import toast from "react-hot-toast"

const UserSignup = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [otp, setOtp] = useState()
    const [otpField, setOtpField] = useState(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()
    const { setUser } = useContext(DataContext)

    const id = localStorage.getItem("id")

    useEffect(() => {
        if (id === "users") navigate("/home")
        if (id === "captain") navigate("/captain-home")
    }, [id, navigate])

    const submitHandler = async (e) => {
        try {
            e.preventDefault()
            setIsLoading(true)

            if (!otp) {
                await sendOtp()
                return
            }

            const newUser = {
                fullName: {
                    firstName: firstName,
                    lastName: lastName,
                },
                email: email,
                password: password,
                otp: otp,
            }
            setUser(newUser)

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser)

            if (response.data.success === true) {
                toast.success("Account created! Please login.")
                const data = response.data
                setUser(data.user)
                navigate("/login")
            } else {
                toast.error(response.data.message || "Registration failed")
                setError(response.data.message)
                return
            }

            setEmail("")
            setFirstName("")
            setLastName("")
            setPassword("")
            setOtp("")
            setOtpField(false)
        } catch (error) {
            toast.error("Something went wrong!")
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const sendOtp = async () => {
        try {
            setOtp("")
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/send-otp`, { email: email })

            if (response.data?.success == true) {
                setOtpField(true)
                toast.success("OTP sent to your email!")
            } else setError(response.data?.message)
        } catch (error) {
            console.log(error)
            toast.error("Failed to send OTP")
        } finally {
            setIsLoading(false)
        }
        return
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-green-50 to-secondary/10">
            <div className="p-6 md:p-8 min-h-screen flex flex-col justify-between max-w-md mx-auto">
                {/* Header */}
                <div>
                    <div className="flex items-center justify-center mb-8">
                        <div className="bg-white rounded-2xl p-4 shadow-lg">
                            <img
                                className="w-12 h-12 md:w-16 md:h-16"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s"
                                alt="Rydon"
                            />
                        </div>
                    </div>

                    <div className="bg-card rounded-3xl p-6 md:p-8 shadow-2xl border border-border/50">
                        <div className="text-center mb-6">
                            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">Create Account</h1>
                            <p className="text-muted-foreground">Join Rydon for premium rides</p>
                        </div>

                        <form onSubmit={submitHandler} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
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

                            {otpField && (
                                <div className="animate-slide-up">
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
                                    "Create Account"
                                ) : (
                                    "Send Verification Code"
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-muted-foreground">
                                Already have an account?{" "}
                                <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
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

export default UserSignup

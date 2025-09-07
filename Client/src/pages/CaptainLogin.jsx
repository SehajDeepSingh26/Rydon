"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"

const CaptainLogin = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()
    const id = localStorage.getItem("id")

    useEffect(() => {
        if (id === "users") navigate("/home")
        if (id === "captain") navigate("/captain-home")
    }, [id, navigate])

    const submitHandler = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        const captain = {
            email,
            password,
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captain/login`, captain)
            let data
            if (response?.data?.success === true) {
                toast.success("Login successful!")
                data = response.data

                localStorage.setItem("token", data.token)
                localStorage.setItem("id", "captain")
                localStorage.setItem("setupTime", Date.now())
                navigate("/captain-home")
            } else throw new Error(`${response.data.data.message}` || "Login failed")
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || "Login failed")
            console.log(error)
        } finally {
            setIsLoading(false)
        }

        setEmail("")
        setPassword("")
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-green-50 to-secondary/10 flex flex-col">
            {/* Header */}
            <div className="p-6 md:p-8">
                <div className="flex items-center justify-center mb-8">
                    <div className="bg-white rounded-2xl p-4 shadow-lg">
                        <svg className="w-12 h-12 md:w-16 md:h-16 text-primary" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center px-6 md:px-8 max-w-md mx-auto w-full">
                <div className="bg-card rounded-3xl p-6 md:p-8 shadow-2xl border border-border/50">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">Captain Portal</h1>
                        <p className="text-muted-foreground">Sign in to start earning with Rydon</p>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                            <input
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                type="email"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                            <input
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                type="password"
                                placeholder="Enter your password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2"></div>
                                    Signing In...
                                </div>
                            ) : (
                                "Sign In as Captain"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-muted-foreground">
                            New captain?{" "}
                            <Link to="/captain-signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
                                Join Our Fleet
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="p-6 md:p-8">
                <Link
                    to="/login"
                    className="flex items-center justify-center w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </svg>
                    Sign in as User
                </Link>
            </div>
        </div>
    )
}

export default CaptainLogin

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Header = () => {
    const [showLogout, setShowLogout] = useState(false)
    const navigate = useNavigate()
    return (
        <div>
            <div className="fixed top-2 left-2 right-0 z-10" onClick={() => console.log("header header")}>
                <div className="flex items-center justify-between">
                    <div className="glass-card px-4 py-2 rounded-xl z-10">
                        <h1 className="text-xl md:text-2xl font-display font-bold text-foreground z-10">Rydon</h1>
                    </div>

                    <div className="glass-card p-2 rounded-xl flex gap-5">
                        {showLogout && (
                            <button
                                onClick={() => {
                                    localStorage.removeItem("token")
                                    localStorage.removeItem("rideId")
                                    navigate("/login")
                                }}
                                className="px-3 py-1 text-sm font-medium bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                            >
                                Logout
                            </button>
                        )}
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center">
                            <i className="ri-user-line text-primary-foreground text-lg" onClick={() => setShowLogout(!showLogout)}></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header

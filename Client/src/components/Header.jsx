import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Header = () => {
    const [showLogout, setShowLogout] = useState(false)
    const navigate = useNavigate()
    return (
        <div>
            <div className="fixed top-2 left-2 right-0 z-10 pointer-events-none">
                <div className="flex items-center justify-between">
                    <div className="glass-card px-4 py-2 rounded-xl z-10">
                        <h1 className="text-xl md:text-2xl font-display font-bold text-foreground z-10">Rydon</h1>
                    </div>

                    <div className="glass-card p-2 rounded-xl flex gap-5">
                        {showLogout && (
                            <button
                                onClick={() => {
                                    navigate("/logout")
                                }}
                                className="px-3 py-1 text-sm font-medium bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors pointer-events-auto"
                            >
                                Logout
                            </button>
                        )}
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center pointer-events-auto">
                            <i className="ri-user-line text-primary-foreground text-lg" onClick={() => setShowLogout(!showLogout)}></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header

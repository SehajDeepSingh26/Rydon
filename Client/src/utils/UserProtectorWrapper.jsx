import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const UserProtectorWrapper = ({ children }) => {
    const navigate = useNavigate();
    const id = localStorage.getItem('id')
    const token = localStorage.getItem('token')

    useEffect(() => {
        if (!token) {
            navigate('/login')
            return
        }
        if (id !== "users") {
            navigate('/captain-home')
        }
    }, [token, id])

    if (!token || id !== "users") return null

    return (
        <div>
            {children}
        </div>
    )
}

export default UserProtectorWrapper

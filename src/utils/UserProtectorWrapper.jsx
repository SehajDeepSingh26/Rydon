import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const UserProtectorWrapper = ({
    children
}) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token')
    const id = localStorage.getItem('id')
    
    useEffect(() => {
        if (!token)
            navigate('/login')
        if(id !== "users")
            navigate('/captain-home');
    }, [token, navigate])

    return (
        <div>
            {children}
        </div>
    )
}

export default UserProtectorWrapper

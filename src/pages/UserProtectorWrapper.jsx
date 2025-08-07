import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const UserProtectorWrapper = ({
    children
}) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token')
    
    useEffect(() => {
        if (!token)
            navigate('/login')
    }, [token, navigate])

    return (
        <div>
            {children}
        </div>
    )
}

export default UserProtectorWrapper

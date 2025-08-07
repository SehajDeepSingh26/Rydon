import React, { useEffect } from 'react'
import { apiConnector } from '../utils/apiConnector'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
    const token = localStorage.getItem('token')
    const id = localStorage.getItem('id')
    const navigate = useNavigate();

    useEffect(() => {
        logout();
    })
    const logout = async () => {
        if(!id || !token)
            return;
        
        const res = await apiConnector(
            'GET', 
            `${import.meta.env.VITE_BASE_URL}/${id}/logout`,
            null,
            {Authorization: `Bearer ${token}`}
        )
        if(res.data.success){
            localStorage.removeItem('token')
            localStorage.removeItem('id')
            if(id === "users")
                navigate('/login')
            else
                navigate('/captain-login')
        }
        else{
            console.log(res.data.message)
            if(id === "users")
                navigate('/login')
            else
                navigate('/captain-login')
        }
    }
    return (
        <div>
            Thanks for reaching Here, but Lol, you see nothing
        </div>
    )
}

export default Logout

import React, { useEffect } from 'react'
import { apiConnector } from '../utils/apiConnector'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

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
        try {
            const res = await apiConnector(
                'GET', 
                `${import.meta.env.VITE_BASE_URL}/${id}/logout`,
                null,
                {Authorization: `Bearer ${token}`}
            )
            if(res.data.success){
                toast.success("Logged out successfully!")
                localStorage.removeItem('token')
                localStorage.removeItem('id')
                if(id === "users")
                    navigate('/login')
                else
                    navigate('/captain-login')
            }
            else{
                toast.error(res.data.message || "Logout failed")
                console.log(res.data.message)
                if(id === "users")
                    navigate('/login')
                else
                    navigate('/captain-login')
            }
        } catch (error) {
            toast.error("Something went wrong!")
            console.log(error)
        }
    }
    return (
        <div>
            Thanks for reaching Here, but Lol, you see nothing
        </div>
    )
}

export default Logout

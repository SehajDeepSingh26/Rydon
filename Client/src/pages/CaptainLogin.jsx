import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { DataContext } from '../context/DataContext'

const Captainlogin = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()
    const id = localStorage.getItem('id')

    useEffect(() => {
        if(id === 'users')
            navigate('/home')
        if(id === 'captain')
            navigate('/captain-home')

    }, [id, navigate])


    const submitHandler = async (e) => {
        e.preventDefault();
        const captain = {
            email,
            password
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captain/login`, captain)
            let data;
            if (response?.data?.success === true) {
                toast.success("Login successful!")
                data = response.data

                localStorage.setItem('token', data.token)
                localStorage.setItem('id', "captain")
                localStorage.setItem('setupTime', Date.now()) 
            } 
            else 
                throw new Error(`${response.data.data.message}` || "Login failed")
        } 
        catch (error) {
            toast.error(error?.response?.data?.message || error.message || "Login failed")
            console.log(error)
        }

        setEmail('')
        setPassword('')
    }
    return (
        <div className='p-7 h-screen flex flex-col justify-between'>
            <div>
                <img className='w-20 mb-3' src="https://www.svgrepo.com/show/505031/uber-driver.svg" alt="" />

                <form onSubmit={(e) => {
                    submitHandler(e)
                }}>
                    <h3 className='text-lg font-medium mb-2'>What's your email</h3>
                    <input
                        required
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                        className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
                        type="email"
                        placeholder='email@example.com'
                    />

                    <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

                    <input
                        className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                        required type="password"
                        placeholder='password'
                    />

                    <button
                        className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
                    >Login</button>

                </form>
                <p className='text-center'>Join a fleet? <Link to='/captain-signup' className='text-blue-600'>Register as a Captain</Link></p>
            </div>
            <div>
                <Link
                    to='/login'
                    className='bg-[#d5622d] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
                >Sign in as User</Link>
            </div>
        </div>
    )
}

export default Captainlogin
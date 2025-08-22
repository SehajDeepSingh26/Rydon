import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { DataContext } from '../context/DataContext'

const UserSignup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [otp, setOtp] = useState()
    const [otpField, setOtpField] = useState(false)
    const [error, setError] = useState("")

    const navigate = useNavigate()
    const {setUser} = useContext(DataContext)

    const id = localStorage.getItem('id')
    
    useEffect(() => {
        if(id === 'users')
            navigate('/home')
        if(id === 'captain')
            navigate('/captain-home')

    }, [id, navigate])


    const submitHandler = async (e) => {
        try {
            e.preventDefault()
            if (!otp) {
                await sendOtp();
                return;
            }

            const newUser = {
                fullName: {
                    firstName: firstName,
                    lastName: lastName
                },
                email: email,
                password: password,
                otp: otp
            }
            setUser(newUser)

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser)

            if (response.data.success === true) {
                const data = response.data
                setUser(data.user)
                navigate('/login')
            }
            else {
                setError(response.data.message)
                return;
            }

            setEmail('')
            setFirstName('')
            setLastName('')
            setPassword('')
            setOtp('');
            setOtpField(false)
        } catch (error) {
            console.log(error)
        }
    }

    const sendOtp = async () => {
        try {
            setOtp("")
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/send-otp`, { email: email });
           
            if (response.data?.success == true) {
                setOtpField(true)
            }
            else
                setError(response.data?.message)
        }
        catch (error) {
            console.log(error)
        }
        return;
    }

    return (
        <div>
            <div className='p-7 h-screen flex flex-col justify-between'>
                <div>
                    <img className='w-16 mb-10' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="" />

                    <form onSubmit={(e) => { submitHandler(e) }}>
                        <h3 className='text-lg w-1/2  font-medium mb-2'>What's your name</h3>
                        <div className='flex gap-4 mb-7'>
                            <input
                                required
                                className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
                                type="text"
                                placeholder='First name'
                                value={firstName}
                                onChange={(e) => {
                                    setFirstName(e.target.value)
                                }}
                            />
                            <input
                                required
                                className='bg-[#eeeeee] w-1/2  rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
                                type="text"
                                placeholder='Last name'
                                value={lastName}
                                onChange={(e) => {
                                    setLastName(e.target.value)
                                }}
                            />
                        </div>

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

                        {otpField && (
                            <div className=''>
                                <h3 className='text-lg font-medium mb-2'>Enter OTP (Sent to you email)</h3>
                                <div className='flex'>
                                    <input
                                        className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base mr-2'
                                        value={otp}
                                        onChange={(e) => {
                                            setOtp(e.target.value)
                                        }}
                                        required
                                        placeholder='xxxxxx'
                                    />
                                    <button
                                        type='button'
                                        className='bg-[#111] text-white font-semibold mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base ml-2'
                                        onClick={() => sendOtp()}
                                    >
                                        Resend OTP
                                    </button>
                                </div>
                            </div>
                        )}


                        <button className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'>
                            Create account
                        </button>

                    </form>
                    <p className='text-center'>
                        Already have a account? <Link to='/login' className='text-blue-600'>Login here</Link>
                    </p>
                    <div>
                        {error && (
                            <>
                                ERROR
                            </>
                        )}
                    </div>
                </div>
                <div>
                    <p className='text-[10px] leading-tight'>This site is protected by reCAPTCHA and the
                        <span className='underline'>Google PrivacyPolicy</span> and
                        <span className='underline'>Terms of Service apply</span>.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default UserSignup
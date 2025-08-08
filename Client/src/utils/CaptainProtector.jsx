import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const CaptainProtector = ({children}) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token')
    const id = localStorage.getItem('id')

    useEffect(() => {
        if (!token)
            navigate('/login')
        if (id !== "captain")
            navigate('/home');
    }, [token, navigate])

    return (
        <div>
            {children}
        </div>
    )
}

export default CaptainProtector

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import UserDataContext from './context/DataContext.jsx'
import UserRideContext from './context/RideContext.jsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
    <UserDataContext>
        <UserRideContext>
            <BrowserRouter>
                <Toaster/>
                <App />
            </BrowserRouter>
        </UserRideContext>
    </UserDataContext>
)

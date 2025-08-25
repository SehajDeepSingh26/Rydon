import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import UserDataProvider from './context/DataContext.jsx'
import UserRideProvider from './context/RideContext.jsx'
import UserSocketProvider from './context/SocketContext.jsx'

createRoot(document.getElementById('root')).render(
    <UserDataProvider>
        <UserRideProvider>
            <UserSocketProvider>

                <BrowserRouter>

                    <Toaster />
                    <App />

                </BrowserRouter>

            </UserSocketProvider>
        </UserRideProvider>
    </UserDataProvider>
)

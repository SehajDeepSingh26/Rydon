import { useEffect } from 'react'
import { createContext } from 'react'
import { io } from 'socket.io-client'

// eslint-disable-next-line react-refresh/only-export-components
export const SocketContext = createContext()

const socket = io(import.meta.env.VITE_BASE_URL)

const UserSocketProvider = ({ children }) => {
    useEffect(() => {
        socket.on('connect', () => {
            console.log("Connected to server")
        })
        socket.on('disconnect', () => {
            console.log("Disconnected from server")
        })

        return () => {
            socket.disconnect()
        }
    }, [])

    const value = {
        socket
    };
    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    )
}

export default UserSocketProvider

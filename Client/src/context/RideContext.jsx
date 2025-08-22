import { createContext, useState } from 'react'

// eslint-disable-next-line react-refresh/only-export-components
export const RideContext = createContext()

const UserRideContext = ({ children }) => {
    const [inputField, setInputField] = useState("")
    const [pickOrDesti, setPickOrDesti] = useState(null) // 1 for pickup and 2 for destination

    const [pickup, setPickup] = useState("");
    const [destination, setDestination] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [fares, setFares] = useState({})

    const [ isLoading, setIsLoading ] = useState(false);

    const value = {
        inputField,
        setInputField,
        pickOrDesti,
        setPickOrDesti,
        pickup,
        setPickup,
        destination,
        setDestination,
        vehicleType,
        setVehicleType,
        fares,
        setFares,
        isLoading,
        setIsLoading
    };
    return (
        <RideContext.Provider value={value}>
            {children}
        </RideContext.Provider>
    )
}

export default UserRideContext

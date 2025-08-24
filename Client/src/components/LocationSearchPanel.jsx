import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { useContext } from 'react'
import { RideContext } from '../context/RideContext'
import toast from 'react-hot-toast'

const LocationSearchPanel = () => {

    const [locations, setLocations] = useState([])
    const token = localStorage.getItem('token')

    const {
        inputField,
        pickOrDesti,
        setPickup,
        setDestination
    } = useContext(RideContext)

    // sample array for location 
    const fetchLocation = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions?input=${inputField}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }}
            );
            if (response.data.success != true)
                throw new Error("Unable to fetch suggestions")

            const data = response.data.suggestions;
            data.map((val) => {
                setLocations((loc) => [...loc, val.description])
            })
        }
        catch (error) {
            toast.error(error)
            console.log(error)
        }
    }

    useEffect(() => {
        if (inputField.length >= 3) {
            setLocations([])
            fetchLocation();
        }
    }, [inputField, pickOrDesti])

    return (
        <div>
            {
                locations.map(function (elem, idx) {
                    return <div key={idx}
                        onClick={() => {
                            if(pickOrDesti === 1)
                                setPickup(elem)                            
                            else
                                setDestination(elem)
                        }}
                        className='flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start'
                    >
                        <h2 className='bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full'>
                            <i className="ri-map-pin-fill"></i>
                        </h2>
                        <h4 className='font-medium'>{elem}</h4>
                    </div>
                })
            }
        </div>
    )
}

export default LocationSearchPanel
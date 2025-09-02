import React, { useEffect } from 'react'

const StartedRideUser = (props) => {
    useEffect(() => {
        props.setSearchPanel(false)
    }, [])

    return (
        <div className='text-3xl font-bold bg-white w-full h-20 flex items-center justify-center'>
            Ride Started
        </div>
    )
}

export default StartedRideUser

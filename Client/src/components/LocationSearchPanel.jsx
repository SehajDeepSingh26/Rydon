import { useState } from "react"
import axios from "axios"
import { useEffect } from "react"
import { useContext } from "react"
import { RideContext } from "../context/RideContext"
import toast from "react-hot-toast"

const LocationSearchPanel = () => {
  const [locations, setLocations] = useState([])
  const token = localStorage.getItem("token")

  const { inputField, pickOrDesti, setPickup, setDestination } = useContext(RideContext)

  // sample array for location
  const fetchLocation = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions?input=${inputField}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response?.data?.success) {
        throw new Error("Unable to fetch suggestions")
      }

      const data = response.data.suggestions
      data.map((val) => {
        setLocations((loc) => [...loc, val.description])
      })
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }

  useEffect(() => {
    if (inputField.length >= 3) {
      setLocations([])
      fetchLocation()
    }
  }, [inputField, pickOrDesti])

  return (
    <div className="p-4 md:p-6 space-y-3">
      <div className="mb-4">
        <h3 className="text-lg font-display font-semibold text-foreground mb-2">
          {pickOrDesti === 1 ? "Select Pickup Location" : "Select Destination"}
        </h3>
        <p className="text-muted-foreground text-sm">Choose from suggestions below</p>
      </div>

      {locations.length === 0 && inputField.length >= 3 && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-pulse-slow">
            <i className="ri-map-pin-line text-2xl text-muted-foreground"></i>
          </div>
        </div>
      )}

      {locations.map((elem, idx) => (
        <div
          key={idx}
          onClick={() => {
            if (pickOrDesti === 1) setPickup(elem)
            else setDestination(elem)
          }}
          className="flex gap-4 glass-card p-4 rounded-xl items-center cursor-pointer hover:bg-muted/20 transition-all duration-200 border border-border hover:border-primary/50"
        >
          <div className="bg-primary/20 h-10 w-10 flex items-center justify-center rounded-full">
            <i className="ri-map-pin-fill text-primary"></i>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-foreground text-sm md:text-base">{elem}</h4>
            <p className="text-muted-foreground text-xs md:text-sm">Suggested location</p>
          </div>
          <i className="ri-arrow-right-s-line text-muted-foreground"></i>
        </div>
      ))}

      {locations.length === 0 && inputField.length < 3 && (
        <div className="text-center py-8">
          <i className="ri-search-line text-3xl text-muted-foreground mb-2 block"></i>
          <p className="text-muted-foreground text-sm">Type at least 3 characters to search</p>
        </div>
      )}
    </div>
  )
}

export default LocationSearchPanel

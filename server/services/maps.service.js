const axios = require("axios");
const { captainModel } = require("../models/captain.models");

module.exports.getAddressCordinate = async (address) => {
    const apiKey = process.env.MAPS_API
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`

    try {
        const response = await axios.get(url);
        if (response?.data.status === 'OK') {
            const location = response.data.results[0].geometry.location
            return {
                ltd: location.lat,
                lng: location.lng
            }
        }
        else
            throw new Error("Unable to fetch location mann !!!")
    }
    catch (error) {
        console.log(error)
        throw error
    }
}

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination)
        throw new Error("Either Origin or destination are missing, Please share those !")

    const apiKey = process.env.MAPS_API
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        const response = await axios.get(url)

        if (response?.data.status === "OK") {
            if (response.data.rows[0].elements[0].status === "ZERO_RESULTS")
                throw new Error("No routes found")

            return response.data.rows[0].elements[0]
        }
        else
            throw new Error("Unable to fetch distance-time data")
    }
    catch (error) {
        console.log(error, "Error while fetching distanceTime in Service")
        throw error
    }
}

module.exports.getSuggestions = async (input) => {
    const apiKey = process.env.MAPS_API
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);

        if(response.data.status === 'OK'){
            const suggestions = response.data.predictions;
            return suggestions
        }
        else    
            throw new Error("Error while fetching suggestions")
    }
    catch (error) {
        console.log(error, "Error while fetching suggestions")
        throw error
    }
}

module.exports.getCaptainsInTheRadius = async(ltd, lng, radius) => {
    try {
        const response = await captainModel.find({
            location: {
                $geoWithin: {
                    $centerSphere: [ [lng, ltd], radius / 3963.2]
                }
            }
        });
        if(response)
            return response;
        else
            throw new Error("Unable to fetch list of captains in radius")
    } 
    catch (error) {
        console.log(error)
    }
}
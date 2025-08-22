const { validationResult } = require("express-validator");
const { default: axios } = require("axios");

module.exports.getCordinates = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ error: errors.array() })

    try {
        const { address } = req.query;

        const apiKey = process.env.MAPS_API
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`

        const response = await axios.get(url);
        if (response?.data.status === 'OK') {
            const location = response.data.results[0].geometry.location

            return res.status(200).json({
                success: true,
                ltd: location.lat,
                lng: location.lng
            })
        }
        else
            throw new Error("Unable to fetch location !!")
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Error while fetching cordinates",
            error: error
        })
    }
}

module.exports.getDistanceTime = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ error: errors.array() })

    const { origin, destination } = req.query;

    if (!origin || !destination)
        throw new Error("Either Origin or destination are missing, Please share those !")

    const apiKey = process.env.MAPS_API
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        const response = await axios.get(url)

        if (response?.data.status === "OK") {
            if (response.data.rows[0].elements[0].status === "ZERO_RESULTS")
                return res.status(404).json({
                    success: false,
                    message: "No Routes found bwteen these locations"
                })

            res.status(200).json({
                success: true,
                ...response.data.rows[0].elements[0]
            })
        }
        else
            throw new Error("Unable to fetch distance-time data")
    }
    catch (error) {
        console.log(error, "Error while fetching distanceTime")
        res.status(500).json({
            success: false,
            message: "Error while fetching distance-Time",
            error: error.message,
        })
    }
}

module.exports.getAutoCompleteSuggestions = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ error: errors.array() })


    const {input} = req.query;
    if(!input)
        return res.status(404).json({
            success: false,
            message: "No input found. please provide"
        })

    const apiKey = process.env.MAPS_API
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);

        if(response.data.status === 'OK'){
            const suggestions = response.data.predictions;
            res.status(200).json({
                success: true,
                suggestions: suggestions
            })
        }
        else
            throw new Error("Error while fetching suggestions")
    } 
    catch (error) {
        console.log(error)
        res.status(500).json({
            success: false
        })
    }

}
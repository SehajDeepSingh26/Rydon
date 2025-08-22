const { validationResult } = require("express-validator");
const { createRide, getFare } = require("../services/ride.service");
const { getDistanceTime } = require("../services/maps.service");

module.exports.getFare = async (req, res) => {
    const { pickup, destination } = req.query;

    try {
        const distanceTime = await getDistanceTime(pickup, destination);
        const vehicles = ['car', 'auto', 'moto'];

        const fares = vehicles.reduce((acc, v) => {
            acc[v] = getFare(distanceTime, v);  // assign fare by vehicle type
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            fares
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error found while fetching Fare of ride",
            error: error.message
        });
    }
}

module.exports.creatRide = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body

    try {
        const ride = await createRide({ user: req.user._id, pickup, destination, vehicleType });
        return res.status(201).json({
            success: true,
            ride
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            succuss: false,
            message: "Error found while creating ride",
            error: error.message
        })
    }
}
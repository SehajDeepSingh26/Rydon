const { validationResult } = require("express-validator");
const { createRide, getFare } = require("../services/ride.service");
const { getDistanceTime, getAddressCordinate, getCaptainsInTheRadius } = require("../services/maps.service");
const { sendMessageToSocketId } = require("../socket");
const rideModel = require("../models/ride.model");

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

module.exports.createRide = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body

    try {
        const ride = await createRide({ user: req.user._id, pickup, destination, vehicleType });
        const pickupCord = await getAddressCordinate(pickup);

        const nearBy_captains = await getCaptainsInTheRadius(pickupCord.ltd, pickupCord.lng, 50)

        // populate user
        const rideWithUser = await rideModel.findById({_id: ride._id}).populate('user')

        nearBy_captains.map(captain => {
            if (vehicleType === captain.vehicle.vehicleType){
                sendMessageToSocketId(captain.socketId, {
                    event: 'new-ride',
                    data: rideWithUser
                })
            }
        })

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

module.exports.confirmRide = async(req, res) => {
    const {ride, captain} = req.body;

    try {
        const response = await rideModel.findByIdAndUpdate(ride._id, {
            captain: captain,
            status: 'accepted'
        }, {new: true}).populate('user')
        console.log(response)

        if(!response){
            throw new Error("Couldn't update Ride status")
        }

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-accepted',
            data: "Ride is accepted by a captain"
        })
        res.status(200).json({
            success: true,
            message: "Ride confirmed. "
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Couldn't confirm ride",
            error: error.message
        })
    }
}
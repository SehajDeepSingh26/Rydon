const rideModel = require("../models/ride.model");
const { getDistanceTime } = require("./maps.service");
const otpGenerator = require("otp-generator");

module.exports.getFare = (distanceTime, vehicleType) => {

    const baseFare = {
        auto: 30,
        car: 50,
        moto: 20
    };

    const perKmRate = {
        auto: 10,
        car: 15,
        moto: 8
    };

    const perMinuteRate = {
        auto: 2,
        car: 3,
        moto: 1.5
    };

    return Math.round(
        baseFare[vehicleType] +
        ((distanceTime.distance.value / 1000) * perKmRate[vehicleType]) +
        ((distanceTime.duration.value / 60) * perMinuteRate[vehicleType])
    );
}

module.exports.getOtp = () => {
     var otp = otpGenerator.generate(6, {
        specialChars: false,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false
    })

    return otp;
}

module.exports.createRide = async({ user, pickup, destination, vehicleType}) => {
    if(!user || !pickup || !destination || !vehicleType)
        throw new Error("Missing required fields for creating a Ride")

    try {
        // const existingRide = await rideModel.findOne({user})
        // if(existingRide && (existingRide.status !== 'completed' || existingRide.status !== 'cancelled'))
        //     throw new Error("User already has an ongoing ride")
        
        const distanceTime = await getDistanceTime(pickup, destination)
        if(!distanceTime)
            throw new Error("Error while calculating Fare due to issue in fetching distanceTime")
    
        const ridefare = this.getFare(distanceTime, vehicleType)
        const otp = this.getOtp()
    
        const newRide = await rideModel.create({
            user,
            pickup,
            destination,
            fare: ridefare,
            otp
        })
    
        return newRide
    } 
    catch (error) {
        console.log(error, "Error while creating new ride")
        throw error
    }
}

module.exports.confirmRide = async(rideId, captain) => {
    if(!rideId || !captain)
        throw new Error("Missing required fields while confirmimg Ride")

    try {
        const ride = await rideModel.findById(rideId)
        if(!ride){
            throw new Error("No ride found for this id")
        }
    
        await rideModel.findByIdAndUpdate(rideId, {
            captain
        })
        return true
    } catch (error) {
        console.log(error, "Error while confirmng Ride")
        throw error
    }
}
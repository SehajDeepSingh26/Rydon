const { captainModel } = require("../models/captain.models");

module.exports.createCaptain = async({fullName, email, password, vehicle}) => {
    if(!fullName || !vehicle || !email || !password) {
        throw new Error("All fields are required");
    }
    const captain = await captainModel.create({fullName, email, password, vehicle});
    return captain;
}
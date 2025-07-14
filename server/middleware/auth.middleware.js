
const { blackListModel } = require("../models/blacklistToken.models");
const { captainModel } = require("../models/captain.models");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token)
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })

    const isBlacklisted = await blackListModel.findOne({token})
    if(isBlacklisted){
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }

    try {
        const decodedId = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decodedId.id)
        
        req.user = user;
        return next();
    } 
    catch (error) {
        console.log(error)
        return res.status(401).json({
            success: false,
            message: "User is Unauthorized"
        })
    }
}

module.exports.authCaptain = async(req, res, next) => {
    
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(403).json({
            success: false,
            message: "UnAuthorized"
        })
    }

    const isBlacklisted = await blackListModel.findOne({token})
    if(isBlacklisted){
        return res.status(403).json({
            success: false,
            message: "UnAuthorized"
        })
    }

    try {
        const decodedId = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decodedId.id);

        req.captain = captain
        next();
    } 
    catch (error) {
        console.log("Error", error)    
        res.status(500).json({
            success: false,
            message: "Unauthorized token",
            error: error.message
        })
    }
}
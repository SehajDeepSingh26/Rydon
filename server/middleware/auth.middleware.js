const blacklistTokenModels = require("../models/blacklistToken.models");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token)
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })

    const isBlacklisted = await blacklistTokenModels.findOne({token})
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
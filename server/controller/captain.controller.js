const { validationResult } = require("express-validator");
const { captainModel } = require("../models/captain.models");
const { blackListModel } = require("../models/blacklistToken.models");
const { createCaptain } = require("../services/captain.service");


module.exports.registerCaptain = async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password, vehicle, fullName} = req.body

    // console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=", email, password, vehicle, fullName)

    const isCaptain = await captainModel.findOne({email})
    if(isCaptain){
        return res.status(400).json({
            success: false,
            message: "User already registered"
        })
    }

    const hashedPass = await captainModel.hashPassword(password);
    try {
        const captain = await createCaptain({
            fullName, email, password: hashedPass, vehicle
        })

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            captain
        })
    } 
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Error occured while registering user",
            error: error.message
        })
    }
}

module.exports.loginCaptain = async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const {email, password} = req.body;
    
        const captain = await captainModel.findOne({email}).select("+password");
        if(!captain){
            return res.status(401).json({
                success: false,
                message: "Email or password is incorrect"
            })
        }
    
        const ismatch = await captain.comparePswd(password)
        if(!ismatch){
            return res.status(401).json({
                succes: false,
                message: "Email or password is incorrect"
            })
        }
    
        // generate auth token and store in cookies
        const token = captain.generateAuthToken();
        res.cookie('token', token)
    
        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            token: token
        })
    } 
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Error occured while Logging in the captain",
            error: error.message
        })
    }
}

module.exports.captainProfile = async(req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: req.captain
        })
    } 
    catch (error) {
         console.log(error)
         return res.status(500).json({
            success: false,
            message: "Error occured while fetching profile of captain",
            error: error.message
        })
    }
}

module.exports.logoutCaptain = async(req, res) => {
    try {
        res.clearCookie('token')
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        
        await blackListModel.create({token});
        res.status(200).json({
            success: true,
            message: "Captain logged out successfully"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Error occured while Logging out captain",
            error: error.message
        })
    }
}
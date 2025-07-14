const userModel = require("../models/user.model");
const {validationResult} = require("express-validator");
const userService = require("../services/user.services");
const bcrypt = require("bcrypt");
const { blackListModel } = require("../models/blacklistToken.models");

// Register a new user
module.exports.registerUser = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        const {fullName, email, password} = req.body;

        const IsUser = await userModel.findOne({email});
        if(IsUser){
            return res.status(409).json({
                success: false,
                message: "User already present"
            })
        }
        const hashedPass = await userModel.hashPassword(password);

        const user = await userService.createUser({fullName, email, password: hashedPass});

        // const token = user.generateAuthToken();
        res.status(201).json({
            // token,
            user,
            success: true,
            message: "User registered successfully"
        });
    } 
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while registering user",
            error: error
        });
    }
}

//Login user
module.exports.loginUser = async(req, res, next) => {
    // take data
    // check user available
    // compare password
    // store token in cookies
    // send res

    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
    
        const {email, password} = req.body;
    
        const user = await userModel.findOne({email}).select("+password");
        if(!user){
            return res.status(401).json({
                success: false,
                message: "Invalid user or password"
            })
        }
        const isValid = await user.comparePassword(password)
        if(!isValid){
            return res.status(401).json({
                success: false,
                message: "Invalid user or password"
            })
        }

        const token = user.generateAuthToken();
        res.cookie('token', token)
        
        res.status(200).json({
            success: true,
            message: "User loggedIn",
            token,
            user
        })
    } 
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Error while login user",
            error: error.message
        })
    }
}

module.exports.getUserProfile = async(req, res, next) => {
    try {
        // const user = await userModel.findById(req.user._id)
        // console.log(user)
        res.status(200).json({
            success: true,
            message: "profile data fetched",
            user: req.user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Error occured while fetching profile data"
        })
    }
}

module.exports.logoutUser = async(req, res, next) => {
    res.clearCookie('token')

    //^ add in balckList token
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];

    await blackListModel.create({token})

    res.status(200).json({
        success: true,
        message: "User logged out"
    })
}
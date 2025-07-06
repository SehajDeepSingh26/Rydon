const userModel = require("../models/user.model");
const {validationResult} = require("express-validator");
const userService = require("../services/user.services");

// Register a new user
module.exports.registerUser = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        const {fullName, email, password} = req.body;
        const hashedPass = await userModel.hashPassword(password);

        const user = await userService.createUser({fullName, email, password: hashedPass});

        const token = user.generateAuthToken();
        res.status(201).json({
            token,
            user,
            success: true,
            message: "User registered successfully"
        });
    } 
    catch (error) {
        console.log("Error while registering user", error);
        res.status(500).json({
            success: false,
            message: "Error while registering user",
            error: error
        });
    }
}
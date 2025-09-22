const {userModel, generateAuthToken, hashPassword} = require("../models/user.model");
const { validationResult } = require("express-validator");
const userService = require("../services/user.services");
const bcrypt = require("bcrypt");
// const { blackListModel } = require("../models/blacklistToken.models");
const optGenerator = require("otp-generator");
const { OtpModel } = require("../models/otp.model");
const { pool } = require("../db/db");
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../utils/optTemplate");

module.exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(404).json({
                success: false,
                message: "Email not found"
            })
    
        // const user = await userModel.findOne({ email })
        // if (user) {
        //     return res.status(409).json({
        //         success: false,
        //         message: "User already present"
        //     })
        // }

        const [user] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        if(user.length > 0)
            return res.status(409).json({
                success: false,
                message: "User already present"
            })
    
        var otp = await optGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
    
        // var otpPresent = await OtpModel.findOne({ otp: otp });
        var [otpPresent] = await pool.query(
            'SELECT * FROM otp_codes WHERE otp = ? AND expires_at > CURRENT_TIMESTAMP', [otp]
        )
        while (otpPresent.length > 0) {
            otp = await optGenerator(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            [otpPresent] = await pool.query(
                'SELECT * FROM otp_codes WHERE otp = ? AND expires_at > CURRENT_TIMESTAMP', [otp]
            )
        }
    
        await OtpModel.create({email, otp});
        await pool.query(
               `INSERT INTO otp_codes (email, otp) 
                VALUES (?, ?)
                ON DUPLICATE KEY UPDATE 
                otp = VALUES(otp), 
                expires_at = NOW() + INTERVAL 5 MINUTE;`,
                [email, otp]
        )
        await mailSender(email, "OTP for Verification", otpTemplate(otp));
        console.log("OTP email sent successfully");

        console.log(otp)
        res.status(201).json({
            success: true,
            message: "Otp sent successfully"
        })
    } 
    catch (error) {
        console.log(error)    
        res.status(500).json({
            success: false,
            message: "Something went wrong while sending otp"
        })
    }
}

// Register a new user
module.exports.registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { fullName, email, password, otp } = req.body;

        // const IsUser = await userModel.findOne({ email });
        // if (IsUser) {
        //     return res.status(409).json({
        //         success: false,
        //         message: "User already present"
        //     })
        // }

        const [userExists] = await pool.query(
            `SELECT id FROM users WHERE email = ?`, 
            [email]
        );
        if(userExists.length > 1)
            return res.status(409).json({
                success: false,
                message: "User already present"
            })

        //check most recent otp
        // const response = await OtpModel.find({email}).sort({createdAt: -1}).limit(1);

        const [response] = await pool.query(
            'SELECT * FROM otp_codes WHERE email = ? AND expires_at > CURRENT_TIMESTAMP', [email]
        )

        if(response.length == 0)
            return res.status(404).json({
                success: false,
                message: "No OTP Found"
            })
        else if(response[0].otp != otp)
            return res.status(403).json({
                success: false,
                message: "OTP is invalid."
            })
        
        const hashedPass = await hashPassword(password);

        // const user = await userService.createUser({ fullName, email, password: hashedPass });

        await pool.query('INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)', [fullName.firstName, fullName.lastName, email, hashedPass])

        const user = {
            fullName,
            email
        }

        // const token = user.generateAuthToken();
        res.status(201).json({
            // token,
            user: user,
            success: true,
            message: "User registered successfully"
        });
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error while registering user",
            error: error.message
        });
    }
}

//Login user
module.exports.loginUser = async (req, res, next) => {
    // take data
    // check user available
    // compare password
    // store token in cookies
    // send res

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // const user = await userModel.findOne({ email }).select("+password");
        // if (!user) {
        //     return res.status(401).json({
        //         success: false,
        //         message: "Invalid user or password"
        //     })
        // }
        const [user] = await pool.query(
            `SELECT * FROM users WHERE email=? `, 
            [email]
        )
        if(!user.length > 0)
            return res.status(401).json({
                success: false,
                message: "Invalid user or password"
            })
        
        // const isValid = await user.comparePassword(password)
        const isValid = await bcrypt.compare(password, user[0].password);
            
        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid user or password"
            })
        }

        const token = await generateAuthToken(user[0]);
        console.log(user[0])
        res.cookie('token', token)

        res.status(200).json({
            success: true,
            message: "User loggedIn",
            token,
            user: user[0]
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

module.exports.getUserProfile = async (req, res, next) => {
    try {
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

module.exports.logoutUser = async (req, res, next) => {
    //^ add in balckList token
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];
    
    res.clearCookie('token')

    // await blackListModel.create({ token })
    await pool.query(
        `INSERT INTO blacklist_tokens (token) VALUES (?)`,
        [token]
    )

    res.status(200).json({
        success: true,
        message: "User logged out"
    })
}
const express = require("express")
const { body } = require("express-validator")
const { registerCaptain, loginCaptain, captainProfile, logoutCaptain, sendOTP } = require("../controller/captain.controller")
const { authCaptain } = require("../middleware/auth.middleware")
const router = express.Router()

router.post('/register', [
    body('email').isEmail().withMessage('Invalid email address'),
    body('fullName.firstName').notEmpty().withMessage('First name is required'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters'),
    body('vehicle.colour').notEmpty().withMessage('Vehicle color is required'),
    body('vehicle.plate').notEmpty().withMessage('Vehicle plate is required'),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('Vehicle capacity must be a positive integer'),
    body('vehicle.vehicleType').isIn(['car', 'motorbike', 'auto']).withMessage('Vehicle type must be car, motorbike, or auto'),
    body('otp').isLength({ min: 6 }).withMessage('OTP must be of length 6'),
], registerCaptain)

router.post('/login', [
     body('email').isEmail().withMessage('Invalid email address'),
     body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters'),
], loginCaptain)

router.get('/profile', authCaptain, captainProfile);
router.get('/logout', authCaptain, logoutCaptain)
router.post('/send-otp', sendOTP)

module.exports = router
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { authUser, authCaptain } = require("../middleware/auth.middleware");
const { getFare, createRide, fetchRideDetails, acceptRide, confirmRide, finishRide } = require("../controller/ride.controller");

router.post(
    '/create',
    body('pickup')
        .isString().withMessage('Pickup location must be a string')
        .isLength({ min: 3 }).withMessage('Pickup location must be at least 3 characters'),
    body('destination')
        .isString().withMessage('Destination must be a string')
        .isLength({ min: 3 }).withMessage('Destination must be at least 3 characters'),
    body('vehicleType')
        .isString()
        .isIn(['auto', 'car', 'moto'])
        .withMessage('Vehicle type must be one of: auto, car, moto'),
    authUser,
    createRide
);
router.post(
    '/accept-ride',    
    authCaptain,
    acceptRide
);
router.post(
    '/confirm-ride',    
    authCaptain,
    confirmRide
);

router.post(
    '/finish-ride',    
    authCaptain,
    finishRide
);

router.post(
    '/fetch-ride',    
    authUser,
    fetchRideDetails
);


router.get('/get-fare', authUser, getFare)

module.exports = router;
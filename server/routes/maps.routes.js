const express = require("express");
const router = express.Router();
const { query } = require("express-validator");
const { authUser } = require("../middleware/auth.middleware");
const { getCordinates, getDistanceTime, getAutoCompleteSuggestions } = require("../controller/maps.controller");

router.get('/get-cordinates', 
    query('address')
        .isString().withMessage('Address must be a string')
        .isLength({ min: 3 }).withMessage('Address must be at least 3 characters'),
    authUser, 
    getCordinates
);

router.get('/get-distance-time', 
    query('origin')
        .isString().withMessage('Origin must be a string')
        .isLength({ min: 3 }).withMessage('Origin must be at least 3 characters'),
    query('destination')
        .isString().withMessage('Destination must be a string')
        .isLength({ min: 3 }).withMessage('Destination must be at least 3 characters'),
    authUser,
    getDistanceTime
);

router.get('/get-suggestions', 
    query('input')
        .isString().withMessage('Input must be a string')
        .isLength({ min: 3 }).withMessage('Input must be at least 3 characters'),
    authUser,
    getAutoCompleteSuggestions
);

module.exports = router;
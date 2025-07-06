const express = require("express");
const router = express.Router();
const {body} = require("express-validator");
const userController = require("../controller/user.controller");

router.post('/register', [
    body('email').isEmail().withMessage("Invalid email"),
    body('fullName.firstName').isLength({min: 3}).withMessage("First Name must be 3 characters longer"),
    body("password").isLength({min: 6}).withMessage("Password must be 6 characters longer"),
], userController.registerUser)

module.exports = router;
const express = require("express");
const router = express.Router();
const {body} = require("express-validator");
const { authUser } = require("../middleware/auth.middleware");
const { getUserProfile, loginUser, registerUser, logoutUser } = require("../controller/user.controller");

router.post('/register', [
    body('email').isEmail().withMessage("Invalid email"),
    body('fullName.firstName').isLength({min: 3}).withMessage("First Name must be 3 characters longer"),
    body("password").isLength({min: 6}).withMessage("Password must be 6 characters longer"),
], registerUser)

router.post('/login', [
    body('email').isEmail().withMessage("Invalid email"),
    body("password").isLength({min: 6}).withMessage("Password must be 6 characters longer"),
], loginUser)

router.get("/profile", authUser, getUserProfile)
router.get('/logout', authUser, logoutUser)

module.exports = router;
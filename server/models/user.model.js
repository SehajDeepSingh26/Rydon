const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const JsonWebTokenError = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    fullName: {
        firstName: {
            type: String,
            required: true,
            minLength: [3, "First Name must be 3 characters longer"]
        },
        lastName: {
            type: String,
            minLength: [3, "Last Name must be 3 characters longer"]
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minLength: [5, "Email must be 5 characters longer"]
    },
    password: {
        type: String,
        required: true,
        select: false       //^ when user will be called from db, pswd will not be called by default
    },
    socketId: {
        type: String,
    },
})

userSchema.methods.generateAuthToken = () => {
    const token = JsonWebTokenError.sign({ id: this._id }, process.env.JWT_SECRET, {
        // expiresIn: "1h"
    });
    return token;
}

userSchema.methods.compare = async (password) => {
    return await bcrypt.compare(password, this.password)
}

userSchema.statics.hashPassword = async(password) => {
    return await bcrypt.hash(password, 10);
}

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
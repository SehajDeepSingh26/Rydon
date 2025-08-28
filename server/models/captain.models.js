const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const captainSchema = new mongoose.Schema({
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
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    vehicle: {
        colour: {
            type: String,
            required: true,
            minLength: [3, "Colour must be 3 characters longer"]
        },
        plate: {
            type: String,
            required: true,
            minLength: [3, "Plate must be 3 characters longer"]
        },
        capacity: {
            type: Number,
            required: true,
            minLength: [1, "Capacity must be at least 1"]
        },
        vehicleType: {
            type: String,
            required: true,
            enum: ["car", "motorcycle", "auto"]
        }
    },
    location: {
        type: {
            type: String,
            enum: ['Point'], 
        },
        coordinates: {
            type: [Number],
        }
    }
})


captainSchema.index({ location: "2dsphere" });

captainSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' })
    return token
}

captainSchema.methods.comparePswd = async function (pass) {
    return await bcrypt.compare(pass, this.password);
}

captainSchema.statics.hashPassword = async (password) => {
    return await bcrypt.hash(password, 10)
}

module.exports.captainModel = mongoose.model("Captain", captainSchema)
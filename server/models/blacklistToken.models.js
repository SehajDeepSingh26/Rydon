const mongoose = require("mongoose")

const blackListTokenSchema = new mongoose.Schema({
    token:{
        type: String,
        required: true,
        unique: true
    },
    createdat: {
        type: Date,
        default: Date.now(),
        expires: 86400      //^ 24hr in seconds
    }
}, {timestamps: true})

module.exports.blackListModel = mongoose.model('BlacklistToken', blackListTokenSchema);
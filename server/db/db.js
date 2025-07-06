const mongoose = require("mongoose")
require('dotenv').config();
const connectDb = () => {
    try {
        mongoose.connect(process.env.DB_URI)
        .then(() => {
            console.log('Connecetd to DB')
        })
    } catch (error) {
        console.log("Error while connecting DB", error)
    }
}

module.exports = connectDb
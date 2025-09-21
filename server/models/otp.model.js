const mongoose = require("mongoose")
const mailSender = require("../utils/mailSender")
const otpTemplate = require("../utils/optTemplate")

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5*60
    }
})

const sendVerificationEmail = async(email, otp) => {
    try {
        await mailSender(email, "OTP for Verification", otpTemplate(otp))
        console.log("Email sent successfully")
    } 
    catch (error) {
        console.log("Error while sending verification mail");
        throw error;
    }
}

otpSchema.pre("save", async function(next){
    await sendVerificationEmail(this.email, this.otp);
    next();
})

module.exports.OtpModel = mongoose.model("OTP", otpSchema);


module.exports.createOtpTable = async(pool) => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS otp_codes (
            email VARCHAR(255) PRIMARY KEY,
            otp INT NOT NULL,
            expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL 5 MINUTE) 
        )
    `)
}

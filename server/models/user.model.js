const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

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

module.exports.generateAuthToken = async(user) => {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {expiresIn: '24h'});
    return token;
}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

module.exports.hashPassword = async(password) => {
    return await bcrypt.hash(password, 10);
}

module.exports.userModel = mongoose.model("User", userSchema);


module.exports.createUserTable = async(pool) => {
    try {
        const [result] = await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                firstName VARCHAR(100) NOT NULL,
                lastName VARCHAR(100),
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                socketId VARCHAR(255)
            )
        `);
        // console.log("User tabel created", result)
    } catch (error) {
        console.log(error)
    }
}
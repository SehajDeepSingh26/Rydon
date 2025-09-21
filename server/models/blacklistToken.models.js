const mongoose = require("mongoose");

const blackListTokenSchema = new mongoose.Schema({
    token:{
        type: String,
        required: true,
        unique: true
    },
    createdate: {
        type: Date,
        default: Date.now(),
        expires: 86400      //^ 24hr in seconds
    }
}, {timestamps: true})

module.exports.blackListModel = mongoose.model('BlacklistToken', blackListTokenSchema);

//mysql
module.exports.createBlackListTokenTable = async (pool) => {
    try {
        const [result] = await pool.query(`
            CREATE TABLE IF NOT EXISTS blacklist_tokens (
                id INT AUTO_INCREMENT PRIMARY KEY,
                token VARCHAR(200) UNIQUE NOT NULL,
                createdate DATETIME DEFAULT CURRENT_TIMESTAMP 
            )
        `);     
        //! expires in condition is not done, need to manually chck or delete the tokens using a cron job scheduler
    } 
    catch (error) {
        console.log("Error while creating blacklist_tokens table", error);
    }
}
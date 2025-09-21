const { createBlackListTokenTable } = require("../models/blacklistToken.models");
const { createOtpTable } = require("../models/otp.model");
const { createUserTable } = require("../models/user.model");
// import other table creation functions...

async function initTables(pool) {
    await createUserTable(pool);
    await createBlackListTokenTable(pool);
    await createOtpTable(pool);
    // call other table creation functions...
}

module.exports = { initTables };
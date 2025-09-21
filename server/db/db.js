const mongoose = require("mongoose")
const mysql = require("mysql2");
const { createUserTable } = require("../models/user.model");
const { initTables } = require("./initTables");
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

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise()

pool.getConnection()
    .then(async (conn) => {
        console.log("MySQL DB connected")
        await conn.release()
        await initTables(pool);
    })
    .catch(err => {
        console.error("Error connecting to MySQL DB:", err)
        throw err;
    })


module.exports = {
    connectDb,
    pool
}
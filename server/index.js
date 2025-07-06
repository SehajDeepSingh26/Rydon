const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDb = require('./db/db')
const userRoutes = require('./routes/user.routes')


dotenv.config()
const app = express()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDb();

app.get('/', (req, res) => {
    res.send("Server is running")
});

app.use('/users', userRoutes)

module.exports = app
const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const userRoutes = require('./routes/user.routes')
const captainRoutes = require('./routes/captain.routes')
const mapRoutes = require('./routes/maps.routes')
const rideRoutes = require('./routes/ride.routes')
const cookieParser = require('cookie-parser')
const { connectDb } = require('./db/db')


dotenv.config()
const app = express()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

connectDb();

app.get('/', (req, res) => {
    res.send("Server is running")
});

app.use('/users', userRoutes)
app.use('/captain', captainRoutes)
app.use('/maps', mapRoutes)
app.use('/rides', rideRoutes)

module.exports = app
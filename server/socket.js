const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const { captainModel } = require('./models/captain.models');
const { sendMessageToSocketId } = require('./socket.js');
let io;

module.exports.initializeSocket = (server) => {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('join', async (data) => {      //^ save socketId in dataBase
            try {
                const { userId, userType } = data;
                if (userType === 'user')
                    await userModel.findByIdAndUpdate(userId, { socketId: socket.id });

                else if (userType === "captain")
                    await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
            catch (error) {
                console.log(error)
                socket.emit('error', { message: "socket not connected" })
            }
        })

        socket.on('update-location-captain', async (data) => {
            try {
                const { userId, location } = data;
                if (!location || !location.ltd || !location.lng)
                    return socket.emit('error', { message: "Invalid location data" })

                await captainModel.findByIdAndUpdate(
                    userId,
                    {
                        location: {
                            type: "Point",
                            coordinates: [location.lng, location.ltd] // [lng, lat]
                        }
                    }
                )
            }
            catch (error) {
                socket.emit('error', { message: "Error during captain loction update with socket" })
            }
        })
        socket.on('update-captain-ride', async (data) => {
            try {
                const { ride, location } = data;
                if (!location || !location.ltd || !location.lng || !ride)
                    return socket.emit('error', { message: "Invalid location data" })

                await captainModel.findByIdAndUpdate(
                    ride.captain._id,
                    {
                        location: {
                            type: "Point",
                            coordinates: [location.lng, location.ltd]
                        }
                    }
                );

                sendMessageToSocketId(ride.user.socketId, {
                    event: "captain-coordinates",
                    data: { lng: location.lng, ltd: location.ltd } // Send as object
                });
            }
            catch (error) {
                socket.emit('error', { message: "Error during captain location update with socket to User in Ride" });
            }
        })

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`)
        })
    })
}

module.exports.sendMessageToSocketId = (socketId, messageObject) => {
    console.log(messageObject, socketId)
    if (io)
        io.to(socketId).emit(messageObject.event, messageObject.data)
    else
        console.log("Socket.io is not initialized")
}
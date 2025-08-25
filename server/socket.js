const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const { captainModel } = require('./models/captain.models');
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

        socket.on('join', async(data) => {      //^ save socketId in dataBase
            const {userId, userType} = data;

            if(userType === 'user')
                await userModel.findByIdAndUpdate(
                    userId, 
                    { socketId: socket.id }
                );
            else
                await captainModel.findByIdAndUpdate(
                    userId, 
                    { socketId: socket.id }
                );            
        })

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`)
        })
    })
}

module.exports.sendMessageToSocketId = (socketId, message) => {
    if(io)
        io.to(socketId).emit('message', message)
    else
        console.log("Socket.io is not initialized")
}
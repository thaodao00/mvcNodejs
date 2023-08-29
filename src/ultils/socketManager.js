const socketIo = require('socket.io');

let ioInstance = null;

function initializeSocket(server) {
    ioInstance = socketIo(server);

    ioInstance.on('connection', (socket) => {
        console.log('A user connected');
    });
}

function getSocketIOInstance() {
    return ioInstance;
}

module.exports = {
    initializeSocket: initializeSocket,
    getSocketIOInstance: getSocketIOInstance
};
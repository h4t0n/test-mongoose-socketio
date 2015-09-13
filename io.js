var Server = require('socket.io');
var debug = require('debug')('test-mongoose-socketio:socketio');




module.exports = function (server) {


    var io = new Server(server);


    io.on('connection', function (socket) {

        socket.emit('root', 'A string from server: on connection');

        socket.on('root', function (data) {
            debug(data);
        })

    })


    return io;
}
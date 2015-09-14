"use strict";

var mongoose = require('mongoose');
var debug = require('debug')('test-mongoose-socketio:db');
var Schema = mongoose.Schema;

/**
 * Mongoose setup
 */
mongoose.connect('mongodb://localhost/test-mongoose-socketio');
var db = mongoose.connection;
db.on('error', function () {
    debug('Mongoose Connection error');
    process.exit(1);
});
db.once('open', function (callback) {
    debug('Mongoose Connection Ready');
});


/**
 * Some schema/model definitions
 */


var io;

var Counter_schema = new Schema({
    count: Number
});


Counter_schema.post('save', function (c) {
    // a counter object was saved
    debug('A couter object just saved');

    // we emit a message to the root event 
    // the message contains the updated Counter
    io.sockets.emit('root', c);
});

var Counter = mongoose.model('Counter', Counter_schema);


var RoomCounter_schema = new Schema({

    name: String,
    count: Number

});

RoomCounter_schema.post('save', function (r) {
    // a counter object was saved
    debug('A RoomCouter [room: ' + r.name + '] object just saved');

    // we emit a message to the root event 
    // the message contains the updated Counter
    io.sockets.to(r.name).emit('room update', r);
});


var RoomCounter = mongoose.model('RoomCounter', RoomCounter_schema);



module.exports = function (_io) {

    io = _io;

    // when you start the server a new counter is created on the mongo database
    // and it is used to test socket.io messages from server to client on update
    var counter = new Counter({
        count: 0
    });

    // update the counter object each second 
    setTimeout(function () {

        counter.save();
        setInterval(function () {

            counter.count++;
            counter.save();
        }, 1000);

    }, 1000);



};
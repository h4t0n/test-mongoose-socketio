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
    exit(1);
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
    debug('A couter object just saved');
    io.sockets.emit('root', c);
});

var Counter = mongoose.model('Counter', Counter_schema);



module.exports = function (_io) {

    io = _io;

    var counter = new Counter({
        count: 0
    });

    setTimeout(function () {

        counter.save();

        setInterval(function () {

            counter.count++;
            counter.save();
        }, 1000);


    }, 1000);



}
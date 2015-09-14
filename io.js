"use strict";

var Server = require('socket.io');
var debug = require('debug')('test-mongoose-socketio:socketio');
var mongoose = require('mongoose');



module.exports = function (server) {


    var io = new Server(server);


    io.on('connection', function (socket) {

        socket.emit('root', 'A string from server: on connection');

        socket.on('root', function (data) {
            debug(data);
        });


        socket.on('join_room', function (data) {


            var room_name = data.name;

            debug(room_name);

            socket.join(room_name);

            var RoomCounter = mongoose.model('RoomCounter');

            //  console.log(RoomCounter);

            RoomCounter.findOne({
                name: room_name
            }, function (err, rc) {


/*
                if (err) next(err);
*/

                if (rc){
                    debug('already existent');
                    socket.emit('room update',"Room '" + room_name + "' already existent: joined");
                    return;
                }
                    
                var new_room = new RoomCounter({
                    name: room_name,
                    count: 0
                });
                new_room.save()
                    .then(function () {

                        setInterval(function () {
                            new_room.count++;
                            new_room.save();
                        }, 1000);
                                     
                        socket.emit('room update',"Room " + room_name + " inexistent: created and joined");

                    });

            });

        });


    });


    return io;
};
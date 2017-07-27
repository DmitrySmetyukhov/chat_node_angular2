var log = require('../lib/log')(module);
var cookie = require('cookie');
var config = require('../config');
var cookieParser = require('cookie-parser');
var User = require('../models/user').User;
var pmHelper = require('../helpers/privateMessages').helper;
var Message = require('../models/Message').Message;
var async = require('async');
var sessionStorage = require('../lib/sessionStore');
var tmpUser;
var sess;
var sid;
var actualConnections;


module.exports = function (server) {

    function loadSession(sid, callback) {
        sessionStorage.get(sid, function (err, session) {
            if (arguments.length == 0) {
                return callback(null, null)
            } else {
                return callback(null, session);
            }
        });
    }

    function loadUser(session, callback) {
        if (!session.userId) {
            return callback(null, null);
        }

        User.findById(session.userId, function (err, user) {
            if (err) return callback(err);
            if (!user) return callback(null, null);
            callback(null, user);
        })
    }

    var io = require('socket.io').listen(server, {
        origins: 'localhost:*',
        logger : log
    });

    io.set('heartbeat interval', 4);

    actualConnections = {};


    io.set('authorization', function (handshakeData, callback) {
        async.waterfall([
            function (callback) {
                handshakeData.cookies = cookie.parse(handshakeData.headers.cookie || '');
                var sidCookie = handshakeData.cookies[config.get('session:key')];

                // console.log(sidCookie, 'sidCookie');

                sid = cookieParser.signedCookie(sidCookie, config.get('session:secret'));

                loadSession(sid, callback);
            },
            function (session, callback) {
                if (!session) {
                    let err = new Error();
                    err.status = 401;
                    err.message = 'No session';
                    return callback(err)
                }

                // handshakeData.session = session;
                sess = session;
                loadUser(session, callback);
            },
            function (user, callback) {
                if (!user) {
                    let err = new Error();
                    err.status = 403;
                    err.message = 'Anonimous session. No connect.';
                    callback(err);
                }

                // handshakeData.user = user;

                tmpUser = user;

                callback(null);
            }
        ], function (err) {
            if (!err) {
                console.log('authorised');
                return callback(null, true);
            }

            return callback(null, false);
        })
    });


    io.sockets.on('connection', function (socket) {

            console.log('connected');

            // var uuid = require('uuid');
            // var room = uuid.v4();
            // console.log(socket.adapter.rooms, 'rooms');
            // var room = socket.handshake.currentUser.username;
            // socket.join(room);

            socket.handshake.currentUser = tmpUser.username;

            actualConnections[socket.handshake.currentUser] = socket.id;
            socket.broadcast.emit('addConnection', socket.handshake.currentUser);


            Message.find(
                {
                    $or: [
                        {'sender': socket.handshake.currentUser},
                        {'receiver': socket.handshake.currentUser},
                        {'receiver': 'public'}
                    ]
                })
                .then((messages) => {
                    socket.emit('initialMessagesBackup', messages)
                }).catch((err) => console.log(err, 'error'));


            socket.on('message', function (message) {
                console.log(message, 'message');

                new Message({
                    text    : message['text'],
                    sender  : message['sender'],
                    receiver: message['receiver']
                })
                    .save()
                    .then((message) => {
                            if (!message) return console.log('error, no message');

                            if (message.receiver == 'public') {
                                socket.broadcast.emit('message', message);
                            } else {
                                io.sockets.connected[actualConnections[message.receiver]].emit('message', message);
                            }
                            socket.emit('message', message);
                        }
                    );

            });

            socket.on('connected', function () {
                socket.emit('initialization', {
                    currentUser      : socket.handshake.currentUser,
                    actualConnections: actualConnections //временно все, пока нет личных контактов
                })
            });

            socket.on('disconnect', function () {
                console.log('disconnect');
                socket.broadcast.emit('disconnected', socket.handshake.currentUser);
                delete actualConnections[socket.handshake.currentUser];
            });

            socket.on('createRoom', function (room) {
                console.log(room, 'room');
            });

            // io.sockets.connected[socket.id].emit('private', socket.handshake.currentUser.username);

            // io.sockets.to(room).emit('message', socket.handshake.currentUser.username, 'testRoom');

        }
    )
    ;


    return io;

}
;


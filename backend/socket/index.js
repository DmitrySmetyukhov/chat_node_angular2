var log = require('../lib/log')(module);
var cookie = require('cookie');
var config = require('../config');
var cookieParser = require('cookie-parser');
var User = require('../models/user').User;
var async = require('async');
var sessionStorage = require('../lib/sessionStore');
var tmpUser;
var sess;
var sid;


module.exports = function (server) {

    function loadSession(sid, callback) {
        sessionStorage.get(sid, function(err, session){
            if(arguments.length == 0){
                return callback(null, null)
            }else{
                return callback(null, session);
            }
        });
    }

    function loadUser(session, callback) {
        if(!session.userId){
            return callback(null, null);
        }

        User.findById(session.userId, function(err, user){
            if(err) return callback(err);
            if(!user) return callback(null, null);
            callback(null, user);
        })
    }

    var io = require('socket.io').listen(server, {
        origins: 'localhost:*',
        logger : log
    });

    io.clientsArr = [];


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
        io.clientsArr.push(socket);
        console.log('connected');
        socket.handshake.currentUser = tmpUser;
        socket.handshake.session = sess;
        socket.handshake.session.id = sid;
        socket.broadcast.emit('enter', socket.handshake.currentUser.username);

        socket.on('message', function (text, cb) {
            socket.broadcast.emit('message', socket.handshake.currentUser.username, text);
            cb(text);
        });

        socket.on('disconnect', function(){
            console.log('disconnect');
            socket.broadcast.emit('leave', socket.handshake.currentUser.username)
        });

    });

    return io;

};


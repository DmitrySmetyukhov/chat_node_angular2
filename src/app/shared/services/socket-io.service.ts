import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';


@Injectable()
export class SocketIoService {

    private socket: SocketIOClient.Socket; // The client instance of socket.io
    messages = [];
    privateMessages = [];
    actualConnections = {};
    connectionState = {};
    adresat: string;


    // constructor() {}

    setConnection() {
        if (!this.connectionState['isConnected']) {
            this.connection(
                this.messages,
                this.privateMessages,
                this.actualConnections,
                this.connectionState);
        }
    }

    connection(messages, privateMessages, connections, connectionState) {
        let self = this;
        this.socket = io.connect("http://localhost:3000");
        this.socket.on('message', function (user, message) {
            messages.push({
                user: user,
                message: message
            });
        });

        this.socket.on('connect', function () {
            console.log('connected!');
            connectionState.isConnected = true;
            self.socket.emit('state', 'frontend connected*****');
        });

        this.socket.on('leave', function (username) {
            delete connections[username];
            messages.push({
                message: username + ' lived chat.'
            });
        });

        this.socket.on('stateInitial', function (actualConnections, connectionInfo) {
            // console.log(connectionInfo, 'connection info')
            connectionState['username'] = connectionInfo.username;
            connectionState['connectionId'] = connectionInfo.connectionId;
            for (let key in connections) {
                delete connections[key]
            }

            for (let key in actualConnections) {
                connections[key] = actualConnections[key];
            }

        });


        this.socket.on('newConnection', function (connectionInfo) {
            connections[connectionInfo.username] = connectionInfo.connectionId;
            messages.push({
                message: connectionInfo.username + ' connected'
            })
        });

        this.socket.on('private', function (message, fromName) {
            privateMessages.push({
                message: message,
                user: fromName
            })
        });
    }

    emitToAll(message) {
        this.socket.emit('message', message);
    }

    sendPrivateMessage(message) {
        this.socket.emit('private', message, this.connectionState['username'], this.adresat);
    }

    disconnect() {
        this.socket.disconnect();
        for (let key in this.actualConnections) {
            delete this.actualConnections[key]
        }

        this.connectionState['isConnected'] = null;
        console.log('disconnect()')
    }

    connect() {
        this.connection(
            this.messages,
            this.privateMessages,
            this.actualConnections,
            this.connectionState
        );
    }
}
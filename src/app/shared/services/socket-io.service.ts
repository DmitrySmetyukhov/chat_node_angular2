import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';


@Injectable()
export class SocketIoService {

    private socket: SocketIOClient.Socket; // The client instance of socket.io
    messages = [];
    privateMessages = [];
    currentRoomMessages = [];
    actualConnections = {};
    connectionState = {};
    adresat: string;


    // constructor() {}

    setConnection() {
        if (!this.connectionState['isConnected']) {
            this.connection(
                this,
                this.messages,
                this.privateMessages,
                this.currentRoomMessages,
                this.actualConnections,
                this.connectionState);
        }
    }

    connection(state, messages, privateMessages, currentRoomMessages, connections, connectionState) {
        let self = this;
        this.socket = io.connect("http://localhost:3000");
        this.socket.on('message', function (username, message) {
            messages.push({
                username: username,
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
            connectionState['username'] = connectionInfo.username;
            connectionState['connectionId'] = connectionInfo.connectionId;
            for (let key in connections) {
                delete connections[key]
            }

            for (let key in actualConnections) {
                if (connectionInfo.username !== key) {
                    connections[key] = actualConnections[key];
                }
            }
        });


        this.socket.on('newConnection', function (connectionInfo) {
            connections[connectionInfo.username] = connectionInfo.connectionId;
            messages.push({
                message: connectionInfo.username + ' connected'
            })
        });

        this.socket.on('private', function (message, sender) {
            privateMessages.push({
                message: message.text,
                username: sender,
                direction: message.direction
            });

            state.getPrivateRoomMessages(sender);
        });
    }


    getPrivateRoomMessages(username){
        this.currentRoomMessages.length = 0;
        this.privateMessages.forEach((message) => {
            if(message['username'] == username){
                this.currentRoomMessages.push(message);
            }
        });
    }

    emitToAll(message) {
        this.socket.emit('message', message);
    }

    sendPrivateMessage(message) {
        let sender = {
            connectionId: this.connectionState['connectionId'],
            username: this.connectionState['username']
        };

        this.socket.emit('private', message, sender, this.adresat);
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
            this,
            this.messages,
            this.privateMessages,
            this.currentRoomMessages,
            this.actualConnections,
            this.connectionState
        );
    }
}
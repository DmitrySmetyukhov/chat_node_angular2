import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';

@Injectable()
export class SocketIoService {
    private socket: SocketIOClient.Socket; // The client instance of socket.io
    messages;
    connectionsIds;

    constructor() {
        this.connectionsIds = ['kjdckj', '65465'];
        this.messages = [];
        this.connection(this.messages, this.connectionsIds);
    }

    connection(messages, connections) {
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
            self.socket.emit('message', 'frontend connected*****');
        });

        this.socket.on('leave', function (message) {
            messages.push({message: message});
        });

        this.socket.on('enter', function (connIds) {
            connections.length = 0;
            connIds.forEach((id) => {
                connections.push(id);
            })
        });

        this.socket.on('private', function (message) {
            messages.push({message: message});
        })
    }

    emitMessage() {
        this.socket.emit('message', 'hello');
    }

    disconnect() {
        this.socket.disconnect();
        console.log('disconnect()')
    }

    connect() {
        this.connection(this.messages, this.connectionsIds);
    }
}
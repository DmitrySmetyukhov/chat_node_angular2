import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';


@Injectable()
export class SocketIoService {

    private socket: SocketIOClient.Socket; // The client instance of socket.io
    messages;
    actualConnections = {};



    constructor() {
        this.messages = [];
        this.connection(this.messages, this.actualConnections);
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

        this.socket.on('leave', function (username) {
            delete connections[username];
        });

        this.socket.on('selfEnter', function (actualConnections) {

            for(let key in connections){
                delete connections[key]
            }

            for(let key in actualConnections){
                connections[key] = actualConnections[key];
            }
        });


        this.socket.on('newConnection', function(connectionInfo){
            connections[connectionInfo.username] = connectionInfo.connectionId;
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
        for(let key in this.actualConnections){
            delete this.actualConnections[key]
        }
        console.log('disconnect()')
    }

    connect() {
        this.connection(this.messages, this.actualConnections);
    }
}
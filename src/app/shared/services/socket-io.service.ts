import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Message} from "../models/message";


@Injectable()
export class SocketIoService {

    private socket: SocketIOClient.Socket; // The client instance of socket.io

    actualConnections = {};
    connectionState = {
        isConnected: false,
        currentUser: ''
    };
    messages: Message[] = [];


    setConnection() {
        if (this.connectionState['isConnected']) return;
        this.connect(this);
    }


    connect(state) {
        let socket = this.socket = io.connect("http://localhost:3000");

        //***************************************************************************//

        socket.on('connect', function () {
            state.connectionState.isConnected = true;
            socket.emit('connected', 'frontend connected*****');
        });

        socket.on('initialization', function (initialObject) {
            //initialObject: {currentUser, connections(usernames of connected users})
            state.connectionState.currentUser = initialObject.currentUser;
            state.clearObjectProps(state.actualConnections);
            state.actualConnections['all'] = 'public';
            // передаются все открытые коннекшены
            Object.keys(initialObject.actualConnections).forEach((key) => {
                if (state.connectionState.currentUser != key) {
                    state.actualConnections[key] = initialObject[key];
                }
            })
        });

        socket.on('disconnected', function (connection) {
            console.log(connection, 'disconnected connection')
            delete state.actualConnections[connection];
        });

        socket.on('addConnection', function (connection) {
            state.actualConnections[connection] = true;
        });

        //*******************************************************************//

        socket.on('message', function (message) {
            console.log(message, 'message*');
            this.messages.push(message);
        });


    }

    private clearObjectProps = function (object) {
        Object.keys(object).forEach((key) => delete object[key]);
    };

    disconnect() {
        this.socket.disconnect();
        this.connectionState['isConnected'] = null;
        this.clearObjectProps(this.actualConnections);
    }

    sendMessage(message: Message) {
        console.log(message, 'sent message');
        this.socket.emit('message', message);
    }
}
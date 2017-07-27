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
    currentMessagesList = [];
    selectedOpponent = 'public';


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
            state.connectionState.currentUser = initialObject.currentUser;
            state.clearObjectProps(state.actualConnections);
            state.actualConnections['public'] = 'public';
            // передаются все открытые коннекшены
            Object.keys(initialObject.actualConnections).forEach((key) => {
                if (state.connectionState.currentUser != key) {
                    state.actualConnections[key] = initialObject[key];
                }
            })
        });

        socket.on('initialMessagesBackup', function (messages) {
            state.messages.length = 0;
            messages.forEach((message) => {
                state.messages.push(message);
            });
        });

        socket.on('disconnected', function (connection) {
            delete state.actualConnections[connection];
        });

        socket.on('addConnection', function (connection) {
            state.actualConnections[connection] = true;
        });

        //*******************************************************************//

        socket.on('message', function (message) {
            state.messages.push(message);
            state.getCurrentMessagesList();
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
        this.socket.emit('message', message);
    }

    getCurrentMessagesList() {
        this.currentMessagesList.length = 0;
        this.messages.forEach((message) => {
            if (message.sender == this.selectedOpponent || message.receiver == this.selectedOpponent) {
                this.currentMessagesList.push(message);
            }
        })
    }
}
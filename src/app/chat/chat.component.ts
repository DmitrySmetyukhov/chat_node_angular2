import {Component, OnInit} from "@angular/core";
import {SocketIoService} from "../shared/services/socket-io.service";


@Component({
    templateUrl: 'chat.component.html',
    styleUrls: ['chat.css']
})

export class ChatComponent implements OnInit {
    objectKeys = Object.keys;

    constructor(private socketService: SocketIoService) {

    }

    ngOnInit() {
        // this.socketService.connect();
        this.socketService.setConnection();
    }


    connect() {
        this.socketService.connect();
    }

    disconnect() {
        this.socketService.disconnect();
    }
}
import {Component} from "@angular/core";
import {SocketIoService} from "../shared/services/socket-io.service";

@Component({
    templateUrl: 'chat.component.html'
})

export class ChatComponent {
    objectKeys = Object.keys;

    constructor(private socketService: SocketIoService) {

    }

    connect() {
        this.socketService.connect();
    }

    disconnect(){
        this.socketService.disconnect();
    }
}
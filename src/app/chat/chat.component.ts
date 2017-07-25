import {Component, OnInit} from "@angular/core";
import {SocketIoService} from "../shared/services/socket-io.service";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";


@Component({
    templateUrl: 'chat.component.html',
    styleUrls: ['chat.css', 'platform.css']
})

export class ChatComponent implements OnInit {
    objectKeys = Object.keys;
    messageForm: FormGroup;
    newMessage;
    privateMessages;


    constructor(private socketService: SocketIoService, private fb: FormBuilder) {

    }

    ngOnInit() {
        this.socketService.setConnection();
        this.buildForm();
    }

    buildForm() {
        this.messageForm = this.fb.group({
            newMessage: [this.newMessage, [Validators.required]]
        })
    }

    onSubmit(form) {
        if (form.invalid) return;
        if (!this.socketService.adresat) {
            this.socketService.emitToAll(form.value.newMessage);
        } else {
            this.socketService.sendPrivateMessage(form.value.newMessage)
        }

        form.reset();
    }

    onKey(event: KeyboardEvent, form) {
        if (event.key === 'Enter') {
            this.onSubmit(form);
        }
    }

    selectUser(connection, event) {
        event.preventDefault();
        this.socketService.adresat = connection;

        if (this.socketService.adresat) {
            this.socketService.getPrivateRoomMessages(this.socketService.adresat['username']);
        }
    }

    connect() {
        this.socketService.connect();
    }

    disconnect() {
        this.socketService.disconnect();
    }
}
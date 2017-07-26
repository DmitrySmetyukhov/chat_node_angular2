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
    text;
    privateMessages;
    isPrivateRoom;
    receiver;


    constructor(private socketService: SocketIoService, private fb: FormBuilder) {

    }

    ngOnInit() {
        this.socketService.setConnection();
        this.buildForm();
    }

    buildForm() {
        this.messageForm = this.fb.group({
            text: [this.text, [Validators.required]]
        })
    }

    onSubmit(form) {
        console.log(form, 'form')
        if (form.invalid) return;
        // if (!this.socketService.adresat) {
        //     this.socketService.emitToAll(form.value.newMessage);
        // } else {
            this.socketService.sendPrivateMessage(form.text, this.receiver);

        // }

        form.reset();
    }

    onKey(event: KeyboardEvent, form) {
        if (event.key === 'Enter') {
            this.onSubmit(form);
        }
    }

    selectUser(receiver, event) {
        event.preventDefault();
        this.receiver = receiver || 'public';
        this.isPrivateRoom = !!receiver;
        // this.socketService.adresat = connection;
        this.socketService.getPrivateRoomMessages(receiver || 'public');
    }

    connect() {
        this.socketService.connect();
    }

    disconnect() {
        this.socketService.disconnect();
    }
}
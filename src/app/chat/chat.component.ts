import {Component, OnInit} from "@angular/core";
import {SocketIoService} from "../shared/services/socket-io.service";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {Message} from "../shared/models/message";


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
    selectedOpponent = 'public';


    constructor(private socketService: SocketIoService, private fb: FormBuilder) {

    }

    ngOnInit() {
        this.socketService.setConnection();
        this.buildForm();
    }

    buildForm() {
        this.messageForm = this.fb.group({
            messageText: [this.text, [Validators.required]]
        })
    }

    onSubmit(form) {
        if (form.invalid) return;

        let message = new Message(form.value.messageText, this.socketService.connectionState['currentUser'], this.selectedOpponent);
        this.socketService.sendMessage(message);

        form.reset();
    }

    onKey(event: KeyboardEvent, form) {
        if (event.key === 'Enter' && !form.value.messageText) {
            event.preventDefault();
        } else if(event.key === 'Enter'){
            this.onSubmit(form);
            event.preventDefault();
        }
    }

    selectUser(selectedOpponent, event) {
        event.preventDefault();
        this.selectedOpponent = selectedOpponent;
    }

    connect() {
        this.socketService.setConnection();
    }

    disconnect() {
        this.socketService.disconnect();
    }
}
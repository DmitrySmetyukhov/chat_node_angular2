import {Component, OnInit} from "@angular/core";
import {SocketIoService} from "../shared/services/socket-io.service";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";


@Component({
    templateUrl: 'chat.component.html',
    styleUrls: ['chat.css']
})

export class ChatComponent implements OnInit {
    objectKeys = Object.keys;
    messageForm: FormGroup;
    newMessage;

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

    onSubmit(form){
        if(form.invalid) return;
        this.socketService.emitToAll(form.value.newMessage);
        form.reset();
    }


    connect() {
        this.socketService.connect();
    }

    disconnect() {
        this.socketService.disconnect();
    }
}
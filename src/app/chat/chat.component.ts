import {Component, OnInit, TemplateRef} from "@angular/core";
import {SocketIoService} from "../shared/services/socket-io.service";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {Message} from "../shared/models/message";
import {BsModalService, BsModalRef} from "ngx-bootstrap/modal";


@Component({
    templateUrl: 'chat.component.html',
    styleUrls: ['chat.css', 'platform.css', 'modal.css']
})

export class ChatComponent implements OnInit {
    objectKeys = Object.keys;
    messageForm: FormGroup;
    text;
    currentMessagesList = [];
    selectedOpponent = 'public';

    newRoomName: string;

    public modalRef: BsModalRef;


    constructor(private socketService: SocketIoService,
                private fb: FormBuilder,
                private modalService: BsModalService) {
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

        let message = new Message(form.value.messageText, this.socketService.connectionState['currentUser'], this.socketService.selectedOpponent);
        this.socketService.sendMessage(message);

        form.reset();
    }

    onKey(event: KeyboardEvent, form) {
        if (event.key === 'Enter' && !form.value.messageText) {
            event.preventDefault();
        } else if (event.key === 'Enter') {
            this.onSubmit(form);
            event.preventDefault();
        }
    }

    selectUser(selectedOpponent, event) {
        event.preventDefault();
        this.socketService.selectedOpponent = selectedOpponent;
        this.socketService.getCurrentMessagesList();
    }

    connect() {
        this.socketService.setConnection();
    }

    disconnect() {
        this.socketService.disconnect();
    }

    public openModal(template: TemplateRef<any>) {
        this.socketService.freeUsers = Object.keys(this.socketService.actualConnections);
        this.socketService.addedUsers = [];
        this.newRoomName = null;
        this.modalRef = this.modalService.show(template);
    }

    addUserToRoom(user: string, event) {
        event.preventDefault();
        this.socketService.addedUsers.push(user);
        this.socketService.freeUsers = this.socketService.freeUsers.filter((username) => {
            return username !== user;
        });
        console.log(user);
    }

    removeFromRoom(user: string, event) {
        event.preventDefault();
        this.socketService.freeUsers.push(user);
        this.socketService.addedUsers = this.socketService.addedUsers.filter((username) => {
            return username !== user;
        })
    }

    createRoom(roomName: string) {
        this.socketService.createRoom(roomName);
        this.modalRef.hide();
    }

}
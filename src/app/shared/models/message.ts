export class Message {
    constructor(text, sender, receiver, created?) {
        this.text = text;
        this.sender = sender;
        this.receiver = receiver;
        this.created = created;
    }

    text: string;
    sender: string;
    receiver: string;
    created: string;
}
export class Room {
    constructor(name, users) {
        this.name = name;
        this.addedUsers = users;
    }

    name: string;
    addedUsers: string[];
}
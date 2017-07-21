export class User {
    constructor(id: string, login: string){
        this.id = id;
        this.login = login;
    }

    id: string;
    login: string;

    public toString(){
        return this.id + ';' + this.login;
    }
}